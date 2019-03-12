<template>
  <div class="moderate-page">
    <div class="container-fluid">
      <div class="row">
        <div class="c-stage head-block">
          <ul class="c-tabs__list nav nav-tabs">
            <li>
              <a :class="'c-tabs__link' + (tab === 1 ? ' active' : '')" @click.prevent="tab = 1">
            <span v-html="categories.length ? (categories.length + ' ' + (rusificate(categories.length, 'раздел', 'раздела', 'разделов')) + ' для модерации') : 'нет новых разделов'"></span>
              </a>
            </li>
            <li> <!-- v-on:click="waitCalculateSuggestionStyles()" -->
              <a :class="'c-tabs__link' + (tab === 2 ? ' active' : '')" @click.prevent="tab = 2">
            <span v-html="materials.length ? (materials.length + ' '+ (rusificate(materials.length, 'статья', 'статьи', 'статей'))+' для модерации') : 'нет новых статей'"></span>
              </a>
            </li>
            <li> <!-- v-on:click="waitCalculateTestSuggestionStyles()" -->
              <a :class="'c-tabs__link' + (tab === 3 ? ' active' : '')" @click.prevent="tab = 3">
            <span v-html="tests.length ? (tests.length + ' '+ (rusificate(tests.length, 'тест', 'теста', 'тестов'))+' для модерации') : 'нет новых тестов'"></span>
              </a>
            </li>
          </ul>
        </div>
        <div class="content-block">
          <div class="c-tabs__content tab-content">
            <div class="tab tab1" v-if="tab === 1">
              <div class="c-stage empty-col" v-if="!categories.length">
                <span>Нет разделов для модерации</span>
              </div>
              <div class="c-table__wrapper" v-else>
                <table class="c-table">
                  <thead class="c-table__head">
                    <tr class="c-table__row">
                      <th class="c-table__cell c-table__cell--head ta-left">Раздел</th>
                      <th class="c-table__cell c-table__cell--head">Дата создания</th>
                      <th class="c-table__cell c-table__cell--head">Автор</th>
                      <th class="c-table__cell c-table__cell--head">Доступ</th>
                      <th class="c-table__cell c-table__cell--head">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="c-table__row" v-for="cat in categories">
                      <td class="c-table__cell ta-left">
                        <router-link :to="'/main/modify-category?category_id='+cat.category_id">
                        <span v-if="cat.parent_title.length">
                          <span v-html="cat.parent_title" class="cat-sug-parent-title"></span>
                          <span class="fa fa-angle-double-right"></span>
                        </span>
                          <span v-html="cat.title"></span>
                        </router-link>
                      </td>
                      <td class="c-table__cell">
                        <span v-html="renderDate(cat.created_at)"></span>
                      </td>
                      <td class="c-table__cell">
                        <span v-html="renderUserRealName(cat)"></span>
                      </td>
                      <td class="c-table__cell">
                        <div v-html="renderCatUsergroups(cat)"></div>
                      </td>
                      <td class="c-table__cell buttons">
                        <span class="u-color-success trigger" v-on:click="approveCategory(cat.category_id)">Утвердить</span>
                        <span class="u-color-danger trigger" v-on:click="denieCategory(cat.category_id)">Отклонить</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            <!-- categories panel -->
            <div class="tab tab2" v-if="tab === 2">
              <div class="c-stage empty-col" v-if="!materials.length">
                <span>Нет статей для модерации</span>
              </div>
              <div v-else-if="materials.length" :class="'c-stage suggestion-row '">
                  <div class="content-material-item content-material-item-2">
                    <div class="letter">
                      <div class="moderate-state-data">Оригинал</div>
                      <div class="content-material-title content-material-title-2">
                        <div class="title">Инструкция</div>
                        <div class="title"v-html="material.title"></div>
                        <div class="material-post">
                          <div class="material-meta">
                            <span v-html="displayCreatedAt(material)" class="meta-delimeter"></span>
                            <span v-html="displayUpdatedAt(material)" class="meta-delimeter" v-if="showUpdatedAt(material)"></span>
                            <span class="meta-delimeter">
                              <span>Раздел: </span>
                              <span v-html="material.category_title"></span>
                            </span>
                            <span class="meta-delimeter" v-if="material.username">
                              <span>Автор: </span>
                              <span v-html="renderUserRealName(material)"></span>
                            </span>
                            <span class="meta-delimeter" v-if="material.suggestions.length > 1">
                              <span>Предложений: </span>
                              <span v-html="material.suggestions.length"></span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="content-material-inner" v-html="material.content"></div>
                      <div class="content-material-test-data" v-if="material.test_data">
                      </div>
                      <div class="edit-material edit-material-2" v-if="material.suggestions.length">
                        <router-link :to="'/main/modify-material?material_id='+material.material_id">
                          <span>Редактировать статью</span>
                        </router-link>
                        <span class="trigger" v-on:click="dropMaterialDialog(material.material_id)">Удалить статью</span>
                      </div>
                      <div class="edit-material edit-material-2" v-else>
                       <span class="trigger" v-on:click="approveMaterial(material.material_id)">
                         <span class="u-color-success">Утвердить</span>
                       </span>
                        <span class="u-color-danger trigger"
                              v-on:click="denieMaterial(material.material_id)">Отклонить</span>
                        <router-link :to="'/main/modify-material?material_id='+material.material_id">
                          <span>Редактировать</span>
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <!-- material suggestions -->
                  <div class="suggestions-col" :id="'suggestions-for-material-'+material.material_id" :data-id="material.material_id"
                       data-active="0" v-if="material.suggestions.length">
                    <div class="material-suggestions-wrapper">
                      <div class="suggestion-nav">
                        <div class="quiz-prev quiz-nav"
                             v-on:click="prevMaterialSug('suggestions-for-material-'+material.material_id)"><i
                          class="fa fa-angle-left"></i></div>
                        <div class="quiz-next quiz-nav"
                             v-on:click="nextMaterialSug('suggestions-for-material-'+material.material_id)"><i
                          class="fa fa-angle-right"></i></div>
                      </div>
                      <div class="material-suggestions" style="display: none;">
                         <!-- suggestions -->
                        <div class="content-material-item content-material-item-2 content-material-item-3"
                             v-for="ms in material.suggestions" style="display: none;">
                          <div class="letter-outer">
                            <div class="letter">
                              <div class="letter-inner">
                                <div class="moderate-state-data"
                                     v-html="material.suggestions.length ? 'Предложение' : 'Предложение'"></div>
                                <div class="content-material-title content-material-title-2">
                                  <div v-html="ms.title"></div>
                                  <div class="material-post">
                                    <div class="material-meta">
                                      <span v-html="displayCreatedAt(ms)" class="meta-delimeter"></span>
                                      <span v-html="displayUpdatedAt(ms)" class="meta-delimeter" v-if="showUpdatedAt(ms)"></span>
                                      <span class="meta-delimeter" :class="ms.category_id != material.category_id ? 'u-color-info' : ''">
                                        <span>Раздел: </span>
                                        <span v-html="ms.category_title"></span>
                                      </span>
                                      <span class="meta-delimeter" v-if="ms.username">
                                        <span>Автор исправления: </span>
                                        <span v-html="renderUserRealName(ms)">
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div class="content-material-inner" v-html="ms.content"></div>
                                <div class="edit-material edit-material-2">
                                  <span class="trigger" v-on:click="applyMaterialSuggestion(ms.row_id, ms.material_id)">
                                    <span class="u-color-success">Принять</span>
                                  </span>
                                  <span class="trigger" v-on:click="dropMaterialSuggestion(ms.row_id, ms.material_id)">Отклонить</span>
                                  <router-link :to="'/main/modify-material?material_id='+ms.material_id+'&s='+ms.row_id">
                                    <span>Редактировать</span>
                                  </router-link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                         <!-- end suggestions -->
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <!-- materials panel -->
            <div class="tab tab3" v-if="tab === 3">
              <div class="c-stage empty-col" v-if="!tests.length">
                <span>Нет тестов для модерации</span>
              </div>
              <div class="c-stage suggestion-row" v-else-if="tests.length">
                <div :class="'moderate-test-col'">
                  <div :class="'moderate-test-wrapper'">
                    <div class="letter">
                      <div class="letter-inner">
                        <div class="test-step-title" v-html="'Тест: ' + test.title"></div>
                        <div v-for="step, index in test.steps" class="test-step-moderate">
                          <div class="head-step">
                            <div class="test-step-number" v-html="(index + 1)"></div>
                            <div class="test-step-question c-field__label" v-html="step.question"></div>
                          </div>
                          <div class="test-step-answers">
                            <div v-for="answer, ai in step.answers">
                              <div v-if="showAnswer(answer)">
                                <div class="c-choice c-choice--checkbox service-type-item-cb">
                                  <input :id="'answer-'+test.test_id+'-st-'+index+'-'+ai" type="checkbox"
                                         class="c-choice__input" :checked="isCorrectAnswer(step, ai)" disabled
                                         :value="ai">
                                  <label :for="'answer-'+test.test_id+'-st-'+index+'-'+ai"
                                         class="c-choice__label cursor-default"><span
                                    v-html="answer.title"></span></label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="edit-material" v-if="test.suggestions.length">
                        <router-link :to="'/main/modify-test?test_id='+test.test_id">
                          <span>Редактировать тест</span>
                        </router-link>
                        <span class="trigger" v-on:click="dropTestDialog(test.test_id)">Удалить тест</span>
                      </div>
                      <div class="edit-material edit-test" v-else>
                        <span class="trigger" v-on:click="approveTest(test.test_id)">
                          <span class="u-color-success">Утвердить</span>
                        </span>
                        <span class="u-color-danger trigger" v-on:click="denieTest(test.test_id)">Отклонить</span>
                        <router-link :to="'/main/modify-test?test_id='+test.test_id">
                          <span>Редактировать</span>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- tests panel -->
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
  import testMixin from '@/mixins/testMixin.vue';

  let pageData = {title: 'Модерирование', metaTitle: 'База знаний - модерирование', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [categoryMixin, permissionsMixin, testMixin],
    data() {
      return {
        pageData,
        moderateLength: 0,
        tests: [],
        categories: [],
        materials: [],
        tab: 1
      }
    },
    computed: {
      material() {
        return this.materials.length ? this.materials[0] : {
          suggestions: []
        };
      },
      test() {
        return this.tests.length ? this.tests[0] : {
          suggestions: []
        };
      }
    },
    async mounted() {
      this.page();
      await this.init();
      this.$store.dispatch('setComponentReady', true);
      this.addResizeListener();
    },
    destroyed() {
      this.removeResizeListener();
    },
    methods: {
      applyTestSuggestion(sugId, testId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Принять исправление',
          text: 'Отклонить остальные исправления?',
          cls: 'dg-select',
          confirm: async function () {
            const resp = await $http.post('/apply-test-suggestion', {row_id: sugId, denie: true});
            if (resp) {
              if (resp.result) {
                if (resp) {
                  let info = await that.$store.dispatch('getModerationInfo');
                  that.setInfo(info);
                }
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }

            }
          },
          cancel: async function () {
            const resp = await $http.post('/apply-test-suggestion', {row_id: sugId, denie: false});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                $('#suggestions-for-test-' + testId).attr('data-active', 0);
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }

            }
          }
        });
      },
      dropTestSuggestion(sugId, testId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите отклонить это исправление?',
          confirm: async function () {
            const resp = await $http.post('/drop-test-suggestion', {row_id: sugId});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                $('#suggestions-for-test-' + testId).attr('data-active', 0);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }
            }
          },
        });
      },
      waitCalculateSuggestionStyles() {
        setTimeout(() => {
          this.calculateSuggestionStyles();
        }, 50);
      },
      waitCalculateTestSuggestionStyles() {
        setTimeout(() => {
          this.calculateTestSuggestionStyles();
        }, 50);
      },
      calculateTestSuggestionStyles() {
        let cols = $('.suggestions-col');
        for (let i = 0; i < cols.length; i++) {
          this.calculateSuggestionStyle('suggestions-for-test-' + cols[i].dataset.id);
        }
        this.resizeTime = 210;
      },
      denieCategory(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены что хотите отклонить раздел и все его содержимое?',
          confirm: async function () {
            const resp = await $http.post('/denie-category', {category_id: id});
            if (resp) {
              if (resp.result) {
                if (resp) {
                  let info = await that.$store.dispatch('getModerationInfo');
                  that.setInfo(info);
                }
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }
            }
          },
        });
      },
      approveCategory(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены что хотите утвердить раздел?',
          confirm: async function () {
            const resp = await $http.post('/approve-category', {category_id: id});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                that.$store.dispatch('getAllCategories');
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }
            }
          },
        });
      },
      renderCatUsergroups(cat) {
        if (!cat.professions) {
          return 'Доступно всем';
        }
        if (!cat.professions.length) {
          return 'Доступно всем';
        }
        let str = '';
        let comma = '';
        for (let i = 0; i < cat.professions.length; i++) {
          let u = cat.professions[i];
          let prof = this.$store.state.professions[u];
          if (!prof) {
            continue;
          }
          str += comma + this.$store.state.professions[u].title;
          comma = ', ';
        }
        return str;
      },
      addResizeListener() {
        let that = this;
        $(window).on('resize.calc', () => {
          that.resizeTime = 0;
          that.calculateSuggestionStyles();
          that.calculateTestSuggestionStyles();
          that.resizeTime = 210;
        });
      },
      removeResizeListener() {
        $(window).off('resize.calc');
      },
      prevMaterialSug(matId) {
        let $el = $('#' + matId);
        if (!$el) {
          return;
        }
        let active = parseInt($el.attr('data-active'));
        let $items = $el.find('.content-material-item');
        if (active - 1 < 0) {
          return;
        }
        $el.attr('data-active', active - 1);
        this.calculateSugMargin(matId);
        this.calculateSugControls($el, active - 1, $items);
      },
      async approveTest(testId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены, что хотите утвердить тест?',
          confirm: async function () {
            const resp = await $http.post('/approve-test', {test_id: testId});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
              } else {
                window.toastr.error(resp.display);
              }
            }
          },
        });
      },
      denieTest(testId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены что хотите отклонить этот тест?',
          confirm: async function () {
            const resp = await $http.post('/denie-test', {test_id: testId});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
              } else {
                window.toastr.error(resp.display);
              }
            }
          },
        });
      },
      async approveMaterial(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены что хотите утвердить статью?',
          confirm: async function () {
            const resp = await $http.post('/approve-material', {material_id: id});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                window.toastr.success('Статья утверждена');
              } else {
                window.toastr.error(resp.display);
              }
            }
          }
        });
      },
      async denieMaterial(id) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение?',
          text: 'Вы уверены что хотите отклонить статью?',
          confirm: async function () {
            const resp = await $http.post('/denie-material', {material_id: id});
            if (resp) {
              if (resp.result) {
                if (resp) {
                  let info = await that.$store.dispatch('getModerationInfo');
                  that.setInfo(info);
                }
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }
            }
          },
        });
      },
      applyMaterialSuggestion(sugId, matId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Принять исправление',
          text: 'Отклонить остальные исправления?',
          cls: 'dg-select',
          confirm: async function () {
            const resp = await $http.post('/apply-material-suggestion', {row_id: sugId, denie: true});
            if (resp) {
              if (resp.result) {
                if (resp) {
                  let info = await that.$store.dispatch('getModerationInfo');
                  that.setInfo(info);
                }
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }

            }
          },
          cancel: async function () {
            const resp = await $http.post('/apply-material-suggestion', {row_id: sugId, denie: false});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                $('#suggestions-for-material-' + matId).attr('data-active', 0);
                window.toastr.success(resp.display);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }

            }
          }
        });
      },
      dropTestDialog() {

      },
      dropMaterialSuggestion(sugId, matId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите отклонить это исправление?',
          confirm: async function () {
            const resp = await $http.post('/drop-material-suggestion', {row_id: sugId});
            if (resp) {
              if (resp.result) {
                let info = await that.$store.dispatch('getModerationInfo');
                that.setInfo(info);
                $('#suggestions-for-material-' + matId).attr('data-active', 0);
              } else {
                that.$dialog.fns.error({
                  title: 'Ошибка',
                  text: resp.display
                });
              }
            }
          },
        });
      },
      calculateSugControls($el, active, $items) {
        let $prev = $el.find('.quiz-prev');
        let $next = $el.find('.quiz-next');
        if ($items.length === 1) {
          $prev.hide();
          $next.hide();
        } else {
          if (active == 0) {
            $prev.hide();
            $next.show();
          } else {
            $prev.show();
          }
          if (($items.length - 1) == active) {
            $next.hide();
            $prev.show();
          } else {
            $next.show();
          }
        }
        let margin = $el.find('.material-suggestions-wrapper').outerWidth() * active;
        if ($items[active]) {
          let clone = $($items[active]).clone();
          let suggestionsWrapper = $el.find('.material-suggestions');
          let sugParent = $el.find('.material-suggestions-wrapper');
          clone.css({
            position: 'absolute',
            display: 'block',
            top: '-9999px',
            width: sugParent.width(),
            visibility: 'hidden'
          });
          $('body').append(clone);
          suggestionsWrapper.stop().animate({
            height: clone.outerHeight(),
            marginLeft: '-' + margin + 'px'
          }, this.resizeTime);
          console.log(this.resizeTime);
          clone.remove();
        }
      },
      nextMaterialSug(matId) {
        let $el = $('#' + matId);
        if (!$el) {
          return;
        }
        let $items = $el.find('.content-material-item');
        let active = parseInt($el.attr('data-active'));
        if (($items.length - 1) < active + 1) {
          return;
        }
        $el.attr('data-active', active + 1);
        this.calculateSugMargin(matId);
        this.calculateSugControls($el, active + 1, $items);
      },
      calculateSugMargin(matId) {
        return;
        let $el = $('#' + matId);
        if (!$el) {
          return;
        }
        let active = parseInt($el.attr('data-active'));
        let margin = $el.find('.material-suggestions-wrapper').outerWidth() * active;
        $el.find('.material-suggestions').animate({marginLeft: '-' + margin + 'px'}, 210);
      },
      calculateSuggestionStyles() {
        let cols = $('.suggestions-col');
        for (let i = 0; i < cols.length; i++) {
          this.calculateSuggestionStyle('suggestions-for-material-' + cols[i].dataset.id);
        }
        this.resizeTime = 210;
      },
      calculateSuggestionStyle(matId) {
        let $el = $('#'+matId);
        if (!$el) {
          suggestionsWrapper.css({
            width: '100%',
            display: 'block'
          });
          return this.calculateSugControls($el, $el.attr('data-active'), $items);
        }
        let suggestionsWrapperParent = $el.find('.material-suggestions-wrapper');
        let suggestionsWrapper = $el.find('.material-suggestions');
        let $items = $el.find('.content-material-item');
        if (!$items.length) {
          suggestionsWrapper.css({
            width: '100%',
            display: 'block'
          });
          return this.calculateSugControls($el, $el.attr('data-active'), $items);
        }
        let width = suggestionsWrapperParent.outerWidth();
        console.log(width);
        suggestionsWrapper.css({
          width: ((width * $items.length) + 200),
          display: 'block'
        });
        $items.each(function () {
          let $th = $(this);
          $th.css({width: width + 'px'});
          setTimeout(function () {
            $th.css({float: 'left', display: 'block'});
          }, 300);
        });
        return this.calculateSugControls($el, $el.attr('data-active'), $items);
      },
      async init() {
        const resp = await this.$store.dispatch('getModerationInfo');
        this.setInfo(resp);
      },
      setInfo(resp) {
        if (resp) {
          this.tests = Array.isArray(resp.tests) ? resp.tests : [];
          this.categories = Array.isArray(resp.categories) ? resp.categories : [];
          this.materials = Array.isArray(resp.materials) ? resp.materials : [];
        }
        setTimeout(() => {
          this.calculateSuggestionStyles();
        }, 400);

      },
      displayCreatedAt(obj) {
        let s = '<span>Создана :</span> ';
        if (!obj.created_at) {
          return s + ' ---';
        }
        return s += window.dateFormatter.reformatDate(obj.created_at);
      },
      displayUpdatedAt(obj) {
        let s = '<span>Обновлена :</span> ';
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
      }
    }
  }
</script>
