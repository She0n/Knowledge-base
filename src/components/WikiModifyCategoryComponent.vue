<template>
  <div class="create-section">
    <div class="container-fluid">
      <div class="row">
        <div class="c-stage">
          <div class="header-block">
            <div class="row">
              <div class="col-12 col-sm-8 col-md-9 col-xl-10">
                <div class="row">
                  <div class="header-img">
                    <img src="/static/images/create.svg" width="50" onerror="window.setDefaultImage(this)">
                  </div>
                  <div class="header-title">
                    <h6 class="project-title" v-html="category.title.length ? category.title : 'Новый раздел'"></h6>
                    <p>
                      <span v-html="displayCreatedAt()" class="meta-delimeter"></span>
                      <span v-html="displayUpdatedAt()" class="meta-delimeter" v-if="showUpdatedAt()"></span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4 col-md-3 col-xl-2">
                <div class="modify-section-block">
                  <button class="c-btn c-btn__success modify-section-btn" v-on:click="modifyCategory()">
                    <!--<i class="m-loader" aria-hidden="true" v-if="process"></i>-->
                    <img src="/static/images/ok.svg" width="20" height="20">
                    <span v-html="category.category_id ? 'Сохранить раздел' : 'Создать раздел'"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="c-stage content-block">
          <div class="create-section-block">
            <div class="c-field">
              <div class="field-block">
                <label class="c-field__label">Название категории:</label>
                <input type="text" placeholder="Введите название" v-model="category.title" class="c-input">
              </div>
            </div>
            <!-- end title -->
            <div class="c-field" v-if="rootCategoriesLength">
              <div class="field-block">
                <label class="c-field__label">Родительский раздел:</label>
                <nselect2 id="parent-category-select" :nullable="true" :options="reformattedCategories"
                         :placeholder="'Выберите родительский раздел'" select_key="category_id"
                         v-model="category.parent_id" class="c-field__select"></nselect2>
              </div>
            </div>
            <!-- end root categories -->
            <div class="c-field">
              <label class="c-field__label n-field-label">Разрешено для чтения:</label>
              <div class="n-edit-field">
                <div class="service-type-container">
                  <div class="service-type-group">
                    <div class="service-type-items">
                      <div class="c-choice c-choice--checkbox service-type-item-cb u-mb-zero u-width-100" v-for="(item, index) in $store.state.professions">
                        <input :id="'cat-usergroup-item-'+index" type="checkbox" class="c-choice__input" v-model="category.professions" :value="item.profession_id">
                        <label :for="'cat-usergroup-item-'+index" class="c-choice__label" v-html="item.title"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="create-section-ilustr">
            <img src="/static/images/ilustr-section.svg" width="545" height="420">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import nselect2 from '@/components/elements/nselect2.vue';

  const pageData = {title: 'Редактирование раздела', metaTitle: 'Редактирование раздела', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [categoryMixin, permissionsMixin],
    async created() {
      this.$on('selectParentCategory', (val) => {
        this.category.category_id = val;
        //this.category.parent_id = val;
      });
      this.$store.commit('titleStatement', false);
      //let id = window.location.getParameter('category_id');
      let id = this.$route.query['category_id'];
      if (id) {
        this.category_id = id;
        await this.getCategory();
        if (this.category.category_id) {
          this.pageData.title = 'Редактирование раздела';
          this.pageData.metaTitle = 'Редактирование раздела';
        }
        //await this.getCategorySuggestions();
      }
      if (!this.pageData.title.length) {
        this.pageData.title = 'Создание раздела';
        this.pageData.metaTitle = 'Создание раздела';
      }
      this.categories = await this.getAllCategories();
      this.page();
      this.getReformattedCategories();
      this.$store.dispatch('setComponentReady', true);
      this.$store.commit('titleStatement', true);
    },
    data() {
      return {
        pageData: pageData,
        ignoreNotFound: true,
        rootCategories: [],
        categories: [],
        category: {
          category_id: '',
          title: '',
          description: '',
          created_at: '',
          updated_at: '',
          professions: [],
          is_deleted: false,
          deleted_by: null,
          parent_id: null,
          waiting_for_moderation: false
        },
        suggestions: [],
        reformattedCategories: {},
        reformattedCategoriesLength: 0,
        process: false,
        usertypes: {}
      };
    },
    watch: {
      /*categories() {
        this.getReformattedCategories();
      }*/
    },
    methods: {
      collectCategoryData() {
        let data = {
          category_id: this.category.category_id,
          title: this.category.title,
          professions: this.category.professions,
          parent_id: this.category.parent_id
        };
        return data;
      },
      async modifyCategory() {
        if(this.process) { return; }
        this.process = 1;
        const resp = await $http.post('/modify-material-category', this.collectCategoryData());
        if(resp) {
          if(resp.result) {
            if(this.isAdmin()) {
              this.$store.dispatch('getAllCategories');
            }
            window.toastr.success(this.category.category_id ? 'Раздел сохранен' : 'Раздел создан');
            this.$router.push('/main');
          } else {
            window.toastr.error(resp.display);
          }
        }
        this.process = 0;
      },
      displayCreatedAt() {
        let s = '<span>Создан: </span> ';
        if (!this.category.created_at) {
          return s + ' ---';
        }
        return s += window.dateFormatter.reformatDate(this.category.created_at);
      },
      displayUpdatedAt() {
        let s = '<span>Обновлен: </span> ';
        if (!this.category.updated_at) {
          return s + ' ---';
        }
        let updated = window.dateFormatter.reformatDate(this.category.updated_at);
        return s += updated;
      },
      showUpdatedAt() {
        let created = window.dateFormatter.reformatDate(this.category.created_at);
        let updated = window.dateFormatter.reformatDate(this.category.updated_at);
        return created !== updated;
      },
    },
    components: {
      nselect2
    }
  }
</script>
