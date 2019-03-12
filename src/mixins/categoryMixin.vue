<template></template>
<script>
  export default {
    data() {
      return {
        tree: [],
        treeReady: false,
        rootMaterials: [],
        categoriesByIds: [],
        rootCategoriesByIds: [],
        rootCategoriesLength: 0
      };
    },
    methods: {
      getReformattedCategories() {
        let tree = [];
        let a = {};
        let final = [];
        for (let i = 0; i < this.categories.length; i++) {
          this.categories[i].childs = [];
          /*if(this.category) {
            if(this.categories[i].category_id == this.category.category_id) { this.categories.splice(i, 1); i--; continue; }
          }*/
          a[this.categories[i].category_id] = this.categories[i];
        }
        let b = {};
        for(let i = 0; i < this.categories.length; i++) {
          let cat = this.categories[i];
          if(!cat.parent_id) { tree.push(cat); b[cat.category_id] = cat; continue; }
          if(!a[cat.parent_id]) { tree.push(cat); b[cat.category_id] = cat; continue; }
          a[cat.parent_id].childs.push(cat);
        }
        this.rootCategoriesByIds = b;
        this.rootCategoriesLength = Object.keys(b).length;
        let modifyNode = (node, level) => {
          let pref = '';
          if(level) {
            for(let i = 0; i < level; i++) {
              pref += '-';
            }
            pref += ' ';
          }
          node.title = pref + node.title;
          if(node.childs && node.childs.length) {
            level++;
            for(let i = 0; i < node.childs.length; i++) {
              modifyNode(node.childs[i], level);
            }
          }
        };
        for(let i = 0; i < tree.length; i++) {
          let level = 0;
          modifyNode(tree[i], level);
        }
        let createFinal = (arr) => {
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            final.push(item);
            if (item.childs && item.childs.length) {
              createFinal(item.childs);
            }
          }
        };
        createFinal(tree);
        /*for(let i = 0; i < tree.length; i++) {
          let item = tree[i];
          final.push(item);
          if(item.childs && item.childs.length) {
            for(let j = 0; j < item.childs.length; j++) {
              final.push(item.childs[j]);
              if (item.childs[j].childs && item.childs[j].childs.length) {
                for(let k = 0; k < item.childs[j].childs.length; k++) {
                  final.push(item.childs[j].childs[k]);
                }
              }
            }
          }
        }*/
        let final2 = {};
        final = JSON.parse(JSON.stringify(final));
        for(let i = 0; i < final.length; i++) {
          final2[final[i].category_id] = final[i];
        }
        this.reformattedCategoriesLength = final.length;
        return this.reformattedCategories = final;
      },
      async getCategory() {
        //this.$store.dispatch('setComponentReady', false);
        const resp = await $http.post('/get-material-category', {category_id: this.category_id});
        if (resp) {
          if(!this.permissions(resp)) { return; }
          if(resp.result) {
            this.unpackCategory(resp.category);
          } else {
            if(!this.ignoreNotFound) {
              this.$router.push('/not-found');
            }
          }
          //this.$store.dispatch('setComponentReady', true);
        }
      },
      async getAllCategories() {
        const resp = await $http.get('/get-all-categories');
        return resp;
      },
      async getCategorySuggestions(id) {
        const resp = $http.post('/get-category-suggestions', { category_id: id });
        return Array.isArray(resp) ? resp : [];
      },
      async getMaterialSuggestions(id) {
        const resp = $http.post('/get-material-suggestions', { material_id: id });
        return Array.isArray(resp) ? resp : [];
      },
      unpackCategory(cat) {
        if(typeof this.category !== 'object') { return; }
        if(typeof cat !== 'object') { cat = {}; }
        let except = ['usergroups'];
        for(let prop in cat) {
            if(except.indexOf(prop) !== -1) { continue; }
            this.category[prop] = cat[prop];
        }
        this.category.professions = Array.isArray(cat.professions) ? cat.professions : [];
      },
      async getCategoryTree() {
        const resp = await $http.get('/get-category-tree');
        this.treeReady = true;
        let cats = {};
        let iterateItem = (item) => {
          cats[item.category_id] = item;
          if(!item.childs) { return; }
          if(!item.childs.length) { return; }
          for(let i = 0; i < item.childs.length; i++) {
            iterateItem(item.childs[i]);
          }
        };
        let tree = [];
        let root = [];
        if(resp) {
          if(Array.isArray(resp.tree)) { tree = resp.tree; }
          if(Array.isArray(resp.root)) { root = resp.root; }
        }
        for(let i = 0; i < tree.length; i++) { iterateItem(tree[i]); }
        this.tree = tree;
        this.root = root;
        this.categoriesByIds = cats;
        return this.tree;
      },
      async getContentOfCategory(id) {
        const resp = await $http.post('/get-content-of-category', { category_id: id });
        if(resp) {
          return typeof resp === 'object' ? resp : {};
        }
        return [];
      },
      materialSaveText(material) {
        if(!material.material_id) { return 'Создать статью'; }
        let s = 'Отправить исправления';
        if(!this.$store.state.user) { return s; }
        if(!this.$store.state.canModerate) { return s; }
        return 'Сохранить статью';
      },
      dropMaterialDialog(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить эту статью?',
          confirm: async function () {
            const resp = await $http.post('/drop-material', {material_id: id});
            if (resp) {
              if(that.setup) {
                await that.setup();
              }
              if(that.setInfo) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
              }
            } else {

            }
          },
        });
      },
      allowDropCategory() {
        if (!this.category.category_id) {
          return 0;
        }
        return this.$store.state.canModerate;
      },
      allowModifyCategory(cat) {
        if (!cat.category_id) {
          return 0;
        }
        return this.$store.state.canModerate;
      },
      async getRootCategories() {
        if(this.rootCategoriesReady) { return; }
        const resp = await $http.get('/get-root-categories');
        if(resp) {
          this.rootCategories = Array.isArray(resp) ? resp : [];
        }
        this.rootCategoriesReady = true;
      }
    }
  }
</script>
