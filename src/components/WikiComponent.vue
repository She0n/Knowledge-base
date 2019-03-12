<template>
  <div class="container-fluid">
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc"/>
    <div v-else>
      <div class="row">
        <div class="col-12 n-col-1">
          <div class="row">
            <!--<div class="c-stage no-content" v-if="!content.length">
              В этом разделе нет статей
            </div>-->
            <div class="wiki-block">
              <div class="left">
                <div class="c-stage">
                  <div v-for="material in allContent" v-if="material.category_id === category.category_id" :class="'content-material-item-nav' + (activeMaterialId === material.material_id ? ' active' : '')"
                       @click="changeActiveMaterial(material.material_id)" v-html="material.title"></div>
                  <div v-for="item in childs">
                    <div class="content-material-item-nav content-category" v-if="item.materials.length">
                      <span>{{ item.title }}</span>
                      <dropdown text=" ">
                        <router-link :to="'/main/modify-category?category_id='+item.category_id"
                                     class="edit-text-btn" v-if="$store.state.canModerate">
                          <span v-if="!$store.state.canModerate">Предложить исправление</span>
                          <span v-else>Редактировать раздел</span>
                        </router-link>
                        <span class="trigger edit-text-btn" v-on:click="dropCategoryDialog(item.category_id)" v-if="allowDropCategory(item)">Удалить раздел</span>
                      </dropdown>
                    </div>
                    <div v-for="material in item.materials" :class="'content-material-item-nav d-pl-40' + (activeMaterialId === material.material_id ? ' active' : '')"
                         @click="changeActiveMaterial(material.material_id)">{{ material.title }}</div>
                    <div v-for="itemInner in item.childs">
                      <div class="content-material-item-nav content-category d-pl-40" v-if="itemInner.materials.length">
                        <span>{{ itemInner.title }}</span>
                        <dropdown text=" ">
                          <router-link :to="'/main/modify-category?category_id='+itemInner.category_id"
                                       class="edit-text-btn" v-if="$store.state.canModerate">
                            <span v-if="!$store.state.canModerate">Предложить исправление</span>
                            <span v-else>Редактировать раздел</span>
                          </router-link>
                          <span class="trigger edit-text-btn" v-on:click="dropCategoryDialog(itemInner.category_id)" v-if="allowDropCategory(itemInner)">Удалить раздел</span>
                        </dropdown>
                      </div>
                      <div v-for="materialInner in itemInner.materials" :class="'content-material-item-nav d-pl-60' + (activeMaterialId === materialInner.material_id ? ' active' : '')"
                           @click="changeActiveMaterial(materialInner.material_id)">{{ materialInner.title }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="c-stage right-head">
                  <!--<div class="content-breadcrumbs" v-if="breadcrumbs.length > 1">
                    <ul>
                      <li v-for="(item, index) in breadcrumbs">
                        <router-link v-if="index !== (breadcrumbs.length-1)" :to="item.link" v-html="item.title"></router-link>
                        <span v-else v-html="item.title"></span>
                      </li>
                    </ul>
                  </div>-->
                  <div v-html="category.title" v-if="category.category_id" class="category-title"></div>
                  <div class="edit-category">
                    <dropdown text=" ">
                      <router-link :to="'/main/modify-category?category_id='+category.category_id"
                                   class="edit-text-btn" v-if="$store.state.canModerate">
                        <span v-if="!$store.state.canModerate">Предложить исправление</span>
                        <span v-else>Редактировать раздел</span>
                      </router-link>
                      <span v-if="isAdmin() && !contentErrorMessage.length" class="trigger edit-text-btn">Редактировать порядок контента</span> <!-- v-on:click="layoutMode = 'sort'" -->
                      <span v-if="isAdmin() && !category.parent_id" class="trigger edit-text-btn" v-on:click="categoryUp()">Поднять раздел</span>
                      <span class="trigger edit-text-btn" v-on:click="dropCategoryDialog(category.category_id)" v-if="allowDropCategory(category)">Удалить раздел</span>
                    </dropdown>
                  </div>
                </div>
                <div class="c-stage right-content no-content" v-if="!allContent.length">
                  В этом разделе нет статей
                </div>
                <div id="layout-default" v-else-if="layoutMode === 'default'">
                  <div class="c-stage right-content" v-if="allContent" v-for="(material) in allContent" :id="'material-' + material.material_id">
                    <div class="head-content">
                      <div :class="'title' + (material.active ? ' active' : '')" v-html="material.title" @click="changeActiveMaterial(material.material_id)"></div>
                      <transition name="fade">
                        <div class="info" v-if="material.active">
                          <span class="info-create" v-html="displayCreatedAt(material)"></span>
                          <span class="author-create">
                        <span>Автор: </span>
                        <span v-html="renderUserRealName(material)"></span>
                      </span>
                        </div>
                      </transition>
                      <transition name="fade">
                        <dropdown text=" " v-if="material.active">
                        <span>
                          <router-link :to="'/main/modify-material?material_id='+material.material_id" class="edit-text-btn">
                             <span v-if="!$store.state.canModerate">Предложить исправление</span>
                             <span v-else>Редактировать статью</span>
                          </router-link>
                        </span>
                          <span class="trigger edit-text-btn" v-if="allowDropCategory()" v-on:click="dropMaterialDialog(material.material_id)">Удалить статью</span>
                        </dropdown>
                      </transition>
                    </div>
                    <transition-expand>
                      <div id="material-content" class="main-content" v-if="material.active">
                        <div v-html="material.content"></div>
                        <!--<div class="content-breadcrumbs" v-if="breadcrumbs.length > 1">
                          <ul>
                            <li v-for="(item, index) in breadcrumbs">
                              <router-link v-if="index !== (breadcrumbs.length-1)" :to="item.link" v-html="item.title"></router-link>
                              <span v-else v-html="item.title"></span>
                            </li>
                          </ul>
                        </div>-->
                        <!--<div id="layout-default" v-if="layoutMode === 'default'">
                          <div v-html="category.title" v-if="category.category_id"></div>
                          <div class="edit-category">
                            <router-link :to="'/modify-category?category_id='+category.category_id"
                                         class="edit-text-btn" v-if="$store.state.canModerate">
                              <span v-if="!$store.state.canModerate"><i class="fa fa-pencil"></i> предложить исправление</span>
                              <span v-else><i class="fa fa-pencil"></i> редактировать раздел</span>
                            </router-link>
                            <span v-if="isAdmin() && !contentErrorMessage.length" class="trigger edit-text-btn" v-on:click="layoutMode = 'sort'">
                            <i class="fa fa-sort" aria-hidden="true"></i> редактировать порядок контента
                          </span>
                            <span v-if="isAdmin() && !category.parent_id" class="trigger edit-text-btn" v-on:click="categoryUp()">
                            <i class="fa fa-chevron-up"></i> поднять раздел
                          </span>
                            <span class="trigger edit-text-btn" v-on:click="dropCategoryDialog(category.category_id)" v-if="allowDropCategory(category)">удалить раздел</span>
                          </div>-->
                        <!--<div v-if="childs.length" class="content-material-subcategories">
                          <div v-for="cat in childs" class="content-material-item-nav">
                            <a :href="category.link+'#cs-'+cat.alias">
                              <div class="u-color-success2 content-material-title-nav" v-html="cat.title"></div>
                            </a>
                            <div class="content-material-childs" v-if="cat.materials.length">
                              <div v-for="mat in cat.materials" class="material-subitem">
                                <a :href="category.link+'#material-'+mat.material_id">
                                  <div class="u-color-success2 content-material-title-nav" v-html="mat.title"></div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="empty-col-xt-2"
                             v-if="(contentErrorMessage || !content.length) && !childs.length">
                          <i class="fa fa-tint" style="position: relative; top: 2px;"></i><span v-html="contentErrorMessage"></span>
                        </div>
                        <div v-else>-->
                        <!--<div v-for="material in content" class="content-material-item-nav">
                          <a :href="category.link+'#material-'+material.material_id">
                            <div class="u-color-success2 content-material-title-nav"
                                 v-html="material.title"></div>
                          </a>
                        </div>-->
                        <!--<div v-if="childs.length">
                          <div v-for="cat in childs" class="content-material-item-nav" :id="'cs-'+cat.alias">
                            <div>
                              <div v-html="cat.title" class="wiki-cat-title" v-if="cat.category_id"></div>
                              <div class="edit-category">
                                <router-link :to="'/modify-category?category_id='+cat.category_id" v-if="$store.state.canModerate">
                                  <span v-if="!$store.state.canModerate"><i class="fa fa-pencil"></i> предложить исправление</span>
                                  <span v-else><i class="fa fa-pencil"></i> редактировать раздел</span>
                                </router-link>
                                <span class="trigger" v-on:click="dropCategoryDialog(cat.category_id)" v-if="$store.state.canModerate">удалить раздел</span>
                              </div>
                            </div>
                            <div class="content-material-childs" v-if="cat.materials.length">
                              <div v-for="material in cat.materials" class="content-material-item"
                                   :id="'material-'+material.material_id">
                                <div class="content-material-title">
                                  <div v-html="material.title"></div>
                                  <div class="material-post">
                                    <div class="material-meta">
                                      <p>
                                        <span v-html="displayCreatedAt(material)" class="meta-delimeter"></span>
                                        <span v-html="displayUpdatedAt(material)" class="meta-delimeter" v-if="showUpdatedAt(material)"></span>
                                        <span class="meta-delimeter" v-if="material.username">
                                          <span>Автор :</span>
                                          <span v-html="renderUserRealName(material)"></span>
                                        </span>
                                      </p>
                                    </div>
                                    <div class="edit-material">
                                      <span>
                                        <router-link :to="'/modify-material?material_id='+material.material_id" class="edit-text-btn">
                                           <span v-if="!$store.state.canModerate"><i class="fa fa-pencil"></i>предложить исправление</span>
                                           <span v-else><i class="fa fa-pencil"></i>редактировать статью</span>
                                        </router-link>
                                      </span>
                                      <span class="trigger edit-text-btn" v-if="allowDropCategory()" v-on:click="dropMaterialDialog(material.material_id)">удалить статью</span>
                                    </div>
                                  </div>
                                </div>
                                <div class="content-material-inner" v-html="material.content"></div>
                              </div>
                            </div>
                            <div v-else>
                              <div class="empty-col-xt-2">
                                <i class="fa fa-tint" style="position: relative; top: 2px;"></i><span>В этом подразделе ничего нет</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-for="material in content" class="content-material-item" :id="'material-'+material.material_id">
                          <div class="content-material-title">
                            <div v-html="material.title"></div>
                            <div class="material-post">
                              <div class="material-meta">
                                <p>
                                  <span v-html="displayCreatedAt(material)" class="meta-delimeter"></span>
                                  <span v-html="displayUpdatedAt(material)" class="meta-delimeter" v-if="showUpdatedAt(material)"></span>
                                  <span class="meta-delimeter" v-if="material.username">
                                    <span>Автор :</span>
                                    <span v-html="renderUserRealName(material)"></span>
                                  </span>
                                </p>
                              </div>
                              <div class="edit-material">
                              <span>
                                <router-link :to="'/modify-material?material_id='+material.material_id" class="edit-text-btn">
                                   <span v-if="!$store.state.canModerate"><i class="fa fa-pencil"></i>предложить исправление</span>
                                   <span v-else><i class="fa fa-pencil"></i>редактировать статью</span>
                                </router-link>
                              </span>
                              <span class="trigger edit-text-btn" v-if="allowDropCategory()" v-on:click="dropMaterialDialog(material.material_id)">удалить статью</span>
                              </div>
                            </div>
                          </div>
                          <div class="content-material-inner" v-html="material.content"></div>
                        </div>-->
                        <!--</div>
                      </div>-->
                        <!--<div v-if="layoutMode === 'sort'">
                          <div class="empty-col-xt-2"
                               v-if="(contentErrorMessage || !content.length) && !childs.length">
                            <i class="fa fa-tint" style="position: relative; top: 2px;"></i><span
                            v-html="contentErrorMessage"></span>
                          </div>
                          <div v-else>
                            <div class="u-h1">
                              <div v-html="category.title" v-if="category.category_id"></div>
                            </div>
                            <div id="sort-container"></div>
                            <div class="u-text-center">
                              <button class="c-btn c-btn--success" v-on:click="saveSorting()">
                                <span class="m-loader" v-if="sortingProcess"></span>
                                сохранить
                              </button>
                            </div>
                          </div>
                        </div>-->
                      </div>
                    </transition-expand>
                    <div id="material-content-preloader" style="display: none;"><div><preloader/></div></div>
                  </div>
                </div>
                <div v-if="layoutMode === 'sort'">
                  <div class="empty-col-xt-2"
                       v-if="(contentErrorMessage || !content.length) && !childs.length">
                    <i class="fa fa-tint" style="position: relative; top: 2px;"></i><span
                    v-html="contentErrorMessage"></span>
                  </div>
                  <div v-else>
                    <div class="u-h1">
                      <div v-html="category.title" v-if="category.category_id"></div>
                    </div>
                    <div id="sort-container"></div>
                    <div class="u-text-center">
                      <button class="c-btn c-btn--success" v-on:click="saveSorting()">
                        <span class="m-loader" v-if="sortingProcess"></span>
                        Сохранить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import searchComponent from '@/components/searchComponent.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import transitionExpand from '@/components/transitionExpand.vue';
  let pageData = {title: 'База знаний', metaTitle: 'База знаний', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [categoryMixin, permissionsMixin],
    data() {
      return {
        layoutMode: 'default',
        q: '',
        pageData: pageData,
        contentReady: false,
        content: [],
        allContent: [],
        childs: [],
        activeMaterialId: -1,
        breadcrumbs: [],
        moderatorMode: true,
        sortingProcess: 0,
        category: {
          category_id: 0,
          title: '',
          created_at: '',
          updated_at: '',
          usergroups: [],
          childs: [],
          alias: '',
          link: ''
        },
        treeReady: false,
        contentErrorMessage: 'В этом разделе ничего нет',
        timeout: null,
        lastPath: '',
        changes: 0
      };
    },
    watch: {
      layoutMode(newVal) {
        this.$store.dispatch('setComponentReady', false);
        if(newVal === 'sort') {
          setTimeout(() => {
            this.recalculateSortingItems();
            this.$store.dispatch('setComponentReady', true);
          }, 150);
        }
      },
      $route(val) {
        if(this.lastPath === val.path) {
          this.navigate();
          this.layoutMode = 'default';
          return;
        }
        this.$store.dispatch('setComponentReady', false);
        this.calculateContent();
        this.$store.dispatch('setComponentReady', true);
      }
    },
    async mounted() {
      this.$store.dispatch('setComponentReady', false);
      this.childs = [];
      this.content = [];
      this.contentReady = true;
      setTimeout(async () => {
        await this.setup();
        this.navigate();
        this.$store.dispatch('setComponentReady', true);
      }, 700);
    },
    methods: {
      changeActiveMaterial(material_id) {
        this.activeMaterialId = -1;
        let status = false;
        let activeId = -1;
        this.allContent.forEach((el) => {
          if (el.material_id === material_id) {
            el.active = !el.active;
            status = el.active;
            if (el.active) {
              activeId = el.material_id;
            }
            document.location.href = '#material-' + material_id;
          } else {
            el.active = false;
          }
        });
        if (activeId !== -1) {
          this.activeMaterialId = activeId;
        }
      },
      async categoryUp() {
        let categories = {};
        let modifier = 10;
        for(let i = this.$store.state.categoryTree.length-1; i >= 0; i--) {
          let base = i+1;
          let cat = this.$store.state.categoryTree[i];
          let index = base + modifier;
          if(cat.category_id == this.category.category_id) {
            modifier = 12;
          } else {
            categories[cat.category_id] = index;
          }
          categories[cat.category_id] = index;
          index++;
        }
        const resp = await $http.post('/category-up', { categories: categories });
        if(resp) {
          if(resp.result) {
            this.$store.dispatch('setCategories', resp.categories);
          } else {
            window.toastr.error(resp.display);
          }
        }
      },
      collectSortData() {
        let data = {
          materials: {},
          categories: {}
        };
        let mats = $('.sort-for-mat');
        let cats = $('.sort-for-cat');
        for(let i = 0; i < mats.length; i++) {
          data.materials[mats[i].dataset.id] = $(mats[i]).index();
        }
        for(let i = 0; i < cats.length; i++) {
          data.categories[cats[i].dataset.id] = $(cats[i]).index();
        }
        return data;
      },
      async saveSorting() {
        if(this.sortingProcess) { return; }
        this.sortingProcess = 1;
        const resp = await $http.post('/save-content-ordering', this.collectSortData());
        if(resp) {
          if(resp.result) {
            await this.$store.dispatch('getAllCategories');
            await this.calculateContent();
            window.toastr.success('Порядок сохранён');
          } else {
            window.toastr.error(resp.display);
          }
        }
        this.sortingProcess = 0;
      },
      recalculateSortingItems() {
        let $container = $('#sort-container');
        if(!$container.length) { return; }
        let sortableOptions = {
            containment: '#sort-container'
        };
        let sortableOptions2 = {
          containment: '#child-cats-container'
        };
        let childCatsContainer = $('<ul id="child-cats-container" class="sorting-container content-material-subcategories"></ul>');
        let createChildCatElement = (item) => {
            let $item = $('<li class="child-cat-sorting-item sort-for-cat" data-id="'+item.category_id+'"><div class="sorting-title u-color-success u-text-bold content-material-title-nav u-mb-5 u-text-17">'+item.title+'</div><div class="sorting-handler"></div></li>');
            if(item.materials.length) {
              let $matList = $('<ul class="child-mats-container content-material-childs"></ul>');
              for(let i = 0; i < item.materials.length; i++) {
                let mat = item.materials[i];
                let $matItem = $('<li class="child-mat-sorting-item sort-for-mat" data-id="'+mat.material_id+'"><div class="sorting-title u-color-success content-material-title-nav u-mb-5 u-text-16">'+mat.title+'</div><div class="sorting-handler"></div></li>');
                $matList.append($matItem);
                $matList.sortable(sortableOptions2);
              }
              $item.append($matList);
            }
            childCatsContainer.append($item);
        };
        if(this.childs.length) {
          for(let i = 0; i < this.childs.length; i++) {
            createChildCatElement(this.childs[i]);
          }
          $container.append(childCatsContainer);
          childCatsContainer.sortable(sortableOptions);
        }
        let childMatsContainer = $('<ul id="child-mats-container" class="sorting-container content-material-subcategories"></ul>');
        for(let i = 0; i < this.content.length; i++) {
          let mat = this.content[i];
          let $matItem = $('<li class="child-mat-sorting-item sort-for-mat" data-id="'+mat.material_id+'"><div class="sorting-title u-color-success content-material-title-nav u-mb-5 u-text-16">'+mat.title+'</div><div class="sorting-handler"></div></li>');
          childMatsContainer.append($matItem);
        }
        childMatsContainer.sortable(sortableOptions);
        $container.append(childMatsContainer);
        /*
         <div v-if="childs.length" class="content-material-subcategories">
                    <div v-for="cat in childs" class="content-material-item-nav">
                      <a :href="category.link+'#cs-'+cat.alias">
                        <div class="u-color-success2 u-text-bold content-material-title-nav u-mb-5 u-text-17"
                             v-html="cat.title"></div>
                      </a>
                      <div class="content-material-childs" v-if="cat.materials.length">
                        <div v-for="mat in cat.materials" class="material-subitem">
                          <a :href="category.link+'#material-'+mat.material_id">
                            <div class="u-color-success2 content-material-title-nav u-mb-5 u-text-16"
                                 v-html="mat.title"></div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
         */
      },
      navigate() {
        if (this.$route.hash) {
          setTimeout(() => {
            let el = document.getElementById(this.$route.hash.replace('#', ''));
            if (el) {
              el.scrollIntoView();
            }
          }, 350);
        }
      },
      displayCreatedAt(obj) {
        let s = '<span>Создана: </span> ';
        if (!obj.created_at) {
          return s + ' ---';
        }
        return s += window.dateFormatter.reformatDate(obj.created_at);
      },
      displayUpdatedAt(obj) {
        let s = '<span>Обновлена: </span> ';
        if (!obj.updated_at) {
          return s + ' ---';
        }
        let updated = window.dateFormatter.reformatDate(obj.updated_at);
        return s += updated;
      },
      showUpdatedAt(obj) {
        let created = window.dateFormatter.reformatDate(obj.created_at);
        let updated = window.dateFormatter.reformatDate(obj.updated_at);
        return created !== updated;
      },
      async setup() {
        let route = this.getRoute();
        this.lastPath = route;
        await this.calculateContent();
      },
      dropCategoryDialog(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить этот раздел и все статьи внутри него?',
          confirm: async function () {
            const resp = await $http.post('/drop-category', {category_id: id});
            that.$store.dispatch('getAllCategories');
            that.$router.push('/main');
            that.clearCategory();
            await that.setup();
          },
        });
      },
      clearCategory() {
        this.category = {
          category_id: 0,
          title: '',
          created_at: '',
          updated_at: '',
          usergroups: [],
          materials: [],
          childs: [],
          link: '',
          alias: ''
        };
      },
      dropMaterialDialog(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить эту статью?',
          confirm: async function () {
            const resp = await $http.post('/drop-material', {material_id: id});
            if (resp) {
              await that.setup();
            } else {

            }
          },
        });
      },
      allowDropCategory() {
        if (!this.category.category_id) {
          return 0;
        }
        if (!this.$store.state.user) {
          return 0;
        }
        let groups = ['admin'];
        return groups.indexOf(this.$store.state.user.usertype) !== -1;
      },
      allowModifyCategory(cat) {
        if (!cat.category_id) {
          return 0;
        }
        if (!this.$store.state.user) {
          return 0;
        }
        let groups = ['admin'];
        return groups.indexOf(this.$store.state.user.usertype) !== -1;
      },
      getRoute() {
        let route = '';
        if (this.$route.path) {
          route += this.$route.path;
        }
        if (this.$route.query) {
          route += '?' + window.querystring.stringify(this.$route.query);
        }
        return route;
      },
      showPreloader() {
        $('#material-content').fadeOut(195, () => {
          this.layoutMode = 'default';
          $('#material-content-preloader').fadeIn(195);
        });
      },
      showContent() {
        $('#material-content-preloader').fadeOut(195, () => {
          $('#material-content').fadeIn(195);
        });
        $('#material-content-preloader').hide();
      },
      async calculateContent() {
        this.lastPath = this.$route.path;
        this.changes++;
        let changesBase = this.changes;
        let end = (err) => {
          if (err) {
            this.contentErrorMessage = err;
            this.content = [];
            this.childs = [];
          }
        };
        if (!this.$store.state.categoriesByPath[this.$route.path]) {
          this.clearCategory();
          return end('Раздел не найден');
        }
        if (!this.$store.state.categoriesByPath[this.$route.path].status) {
          this.clearCategory();
          return end('Раздел не найден');
        }
        if(this.$store.state.categoriesByPath[this.$route.path].parent_id) {
          let parent = this.$store.state.categoriesByIds[this.$store.state.categoriesByPath[this.$route.path].parent_id];
          if(!parent.status) {
            this.clearCategory();
            return end('Раздел не найден');
          }
        }

        this.contentReady = false;
        let contentReady = false;
        let timeoutDone = false;
        let content = [];
        let childs = [];
        if (this.contentTimeout) {
          clearTimeout(this.contentTimeout);
        }
        //this.showPreloader();

        let setContent = () => {
          //this.showContent();
          this.content = content;
          this.allContent = allContent;

          this.allContent.forEach((el) => {
            this.$set(el, 'active', false);
          });
          if (this.allContent.length) {
            this.allContent[0].active = true;
            this.activeMaterialId = this.allContent[0].material_id;
          }

          this.childs = childs;
          this.category = this.$store.state.categoriesByPath[this.$route.path];
          if(!this.content.length) {
            this.contentErrorMessage = 'В этом разделе ничего нет';
          } else {
            this.contentErrorMessage = '';
          }
          let breadcrumbs = [JSON.parse(JSON.stringify(this.category))];
          if(this.$store.state.categoriesByPath[this.$route.path].parent_id) {
            let parent = this.$store.state.categoriesByIds[this.$store.state.categoriesByPath[this.$route.path].parent_id];
            breadcrumbs.unshift(parent);
          }
          this.breadcrumbs = breadcrumbs;
        };
        //this.contentTimeout = setTimeout(() => {
          /*if (contentReady) {
            setContent();
          }
          timeoutDone = true;*/
        //}, 1000);
        let response = (await this.getContentOfCategory(this.$store.state.categoriesByPath[this.$route.path].category_id));
        content = Array.isArray(response.materials) ? response.materials : [];
        childs = Array.isArray(response.childs) ? response.childs : [];
        let allContent = JSON.parse(JSON.stringify(content));
        let initAllContent = (childs) => {
          if (childs && childs.length) {
            childs.forEach((el) => {
              el.materials.forEach((elem) => {
                allContent.push(elem);
              });
              initAllContent(el.childs);
            });
          }
        };
        initAllContent(childs);
        contentReady = true;
        if (this.changes !== changesBase) {
          return;
        }
        //if (timeoutDone) {
          setContent();
        //}
        this.navigate();
      }
    },
    components: {
      searchComponent,
      'transition-expand': transitionExpand
    }
  }
</script>
