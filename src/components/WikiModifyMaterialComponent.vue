<template>
  <div class="create-material">
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
                    <h6 class="project-title" v-html="material.title.length ? material.title : 'Новая статья'"></h6>
                    <p>
                      <span v-html="displayCreatedAt()" class="meta-delimeter"></span>
                      <span v-html="displayUpdatedAt()" class="meta-delimeter" v-if="showUpdatedAt()"></span>
                      <span v-if="displayAuthor()" class="meta-delimeter">
                        <span>Автор предложения:</span>
                        <span v-html="renderUserRealName(material)"></span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4 col-md-3 col-xl-2">
                <div class="modify-material-block">
                  <button class="c-btn c-btn__success modify-material-btn" v-on:click="modifyMaterial()">
                    <!--<i class="m-loader" aria-hidden="true" v-if="process"></i>-->
                    <img src="/static/images/ok.svg" width="20" height="20">
                    <span v-html="materialSaveText(material)"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="c-stage content-block">
          <div class="create-material-block">
            <div class="c-field">
              <div class="field-block">
                <label class="c-field__label">Заголовок:</label>
                <input type="text" placeholder="Введите название статьи" v-model="material.title" class="c-input">
              </div>
            </div>
            <div class="c-field">
              <div class="field-block">
                <label class="c-field__label">Раздел:</label>
                <nselect2 id="parent-category-select" :options="reformattedCategories" class="selector"
                          :placeholder="'Выберите родительский раздел'" select_key="category_id"
                          v-model="material.category_id" v-if="reformattedCategoriesLength"/>
                <div class="c-field__text" v-else>
                  Нет доступных разделов
                </div>
              </div>
            </div>
            <div class="c-field" v-if="tests.length">
              <div class="field-block">
                <label class="c-field__label">Тест:</label>
                <nselect2 id="modify-material-test-selector" class="selector" :options="tests" :nullable="true" v-model="material.test_id" select_key="test_id"></nselect2>
              </div>
            </div>
            <div class="c-field">
              <label class="c-field__label">Содержание:</label>
              <quill-editor :content="material.content" v-model="material.content" @change="onEditorChange($event)" @ready="onEditorReady($event)" :options="editorConfig"/>
            </div>
          </div>
          <div class="create-material-ilustr">
            <img src="/static/images/ilustr-article.svg" width="545" height="420">
          </div>
          <!-- end title -->
          <!-- end root categories -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import materialMixin from '@/mixins/materialMixin.vue';
  import Component from '@/components/Component.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import nselect2 from '@/components/elements/nselect2.vue';
  const pageData = {title: 'Редактирование статьи', metaTitle: 'Редактирование статьи', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [materialMixin, categoryMixin],
    beforeRouteLeave (to, from, next) {
      if(this.allowLeave) { next(); return; }
      this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы внесли изменения, но они не сохранятся, вы уверены что хотите покинуть страницу?',
          confirm: () => {
            next();
          }
      });
    },
    data() {
      return {
        pageData: pageData,
        process: false,
        allowLeave: true,
        editorConfig: {
          placeholder: 'Введите текст статьи',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': ['roboto'] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            clipboard: {
              matchVisual: false // https://quilljs.com/docs/modules/clipboard/#matchvisual
            }
          },
        },
        material: {
          material_id: null,
          title: '',
          content: '',
          category_id: null,
          test_id: 0,
          created_at: '',
          updated_at: '',
          row_id: 0,
          first_name: '',
          last_name: '',
          username: '',
        },
        categories: [],
        tests: [],
        reformattedCategoriesLength: 0
      };
    },
    async created() {
      this.$on('selectParentCategory', (val) => {
        this.material.category_id = val;
      });
      //let id = window.location.getParameter('material_id');
      let id = this.$route.query['material_id'];
      if(id) {
        //let sug = window.location.getParameter('s');
        let sug = this.$route.query.s;
        let material;
        if(sug) {
          material = await this.getMaterialSuggestionById(sug, id);
        } else {
          material = await this.getMaterialById(id);
        }
        if(material) {
          this.material = material;
          this.pageData.title = 'Редактирование статьи';
          this.pageData.metaTitle = 'Редактирование статьи';
        }
      }
      if(!this.material.material_id) {
        this.pageData.title = 'Создание статьи';
        this.pageData.metaTitle = 'Создание статьи';
      }
      await this.getTests();
      this.page();
      this.$store.commit('titleStatement', false);
      let categories = (await this.getAllCategories());
      this.categories = Array.isArray(categories) ? categories : [];
      this.reformattedCategories = await this.getReformattedCategories();
      this.$store.dispatch('setComponentReady', true);
    },
    destroy() {
      this.destroyEditorToolbar();
    },
    methods: {
      async getTests() {
        const resp = await $http.get('/get-tests', { light: 1 });
        if(resp) {
          this.tests = Array.isArray(resp) ? resp : [];
        }
      },
      calculateEditorToolbar() {
        let $ql = $('.quill-editor');
        if(!$ql.length) { return; }
        let $toolbar = $ql.find('.ql-toolbar');
        let offset = $ql.offset();
        let width = $ql.width();
        $toolbar.css({ width: width + 'px' });
        $ql.css({ paddingTop: ($toolbar.height()+15)+'px' });
        if(window.pageYOffset >= offset.top) {
          $ql.addClass('fixed-elements');
        } else {
          $ql.removeClass('fixed-elements');
        }
      },
      initEditorToolbar() {
        $(window).on('resize.editorToolbar', this.calculateEditorToolbar);
        $(window).on('scroll.editorToolbar', this.calculateEditorToolbar);
      },
      destroyEditorToolbar() {
        $(window).off('resize.editorToolbar');
        $(window).off('scroll.editorToolbar');
      },
      onEditorReady(e) {
        setTimeout(() => {
          this.initEditorToolbar();
          $(window).trigger('resize');
        }, 1000);

      },
      onEditorChange(e) {
        this.allowLeave = this.material.material_id ? false : true;
      },
      displayAuthor() {
        if(!this.material.row_id) { return 0; }
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.user_id === this.material.row_id) { return 0; }
        return 1;
      },
      async modifyMaterial() {
        const resp = await $http.post('/modify-material', this.material);
        if(resp) {
          if(resp.result) {
            window.toastr.success(resp.display);
            this.allowLeave = true;
            this.$router.push('/main');
          } else {
            window.toastr.error(resp.display);
          }
        }
      },
      displayCreatedAt() {
        let s = '<span class="u-mr-xsmall">Создана :</span> ';
        if (!this.material.created_at) {
          return s + ' ---';
        }
        return s += window.dateFormatter.reformatDate(this.material.created_at);
      },
      displayUpdatedAt() {
        let s = '<span class="u-mr-xsmall">Обновлена :</span> ';
        if (!this.material.updated_at) {
          return s + ' ---';
        }
        let updated = window.dateFormatter.reformatDate(this.material.updated_at);
        return s += updated;
      },
      showUpdatedAt() {
        let created = window.dateFormatter.reformatDate(this.material.created_at);
        let updated = window.dateFormatter.reformatDate(this.material.updated_at);
        return created !== updated;
      }
    },
    components: {
      nselect2
    }
  }
</script>
