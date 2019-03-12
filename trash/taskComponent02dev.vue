<template>
  <div class="task-modal-outer" :id="id">
    <div class="task-modal-backdrop" @click="$parent.modalMode = null;"></div>
    <div class="task-modal-inner c-scrollbar">
      <div class="task-modal-left">
        <div class="task-modal-header">
          <div class="task-modal-close" @click="$parent.modalMode = null">
            <i class="fa fa-angle-left"></i>
          </div>
          <div class="task-modal-title">
            <input type="text" v-model="e_task.title" placeholder="Название задачи" class="task-modal-title-input"/>
            <div class="task-modal-header-icons">
              <div @click="set('is_important', !e_task.is_important)">
                <svg class="task-modal-header-icon task-modal-important-icon" fill="none" title="Горит" viewBox="0 0 14 18"  xmlns="http://www.w3.org/2000/svg" v-if="!e_task.is_important">
                  <path d="M0.69756 9.07097C0.840824 8.31826 1.10151 7.58926 1.46436 6.9089C1.59193 7.27635 1.7726 7.626 1.9999 7.94223C2.19977 8.22031 2.53971 8.26665 2.78971 8.15111C3.02857 8.04072 3.20326 7.77839 3.16133 7.47009C2.96347 6.01505 3.47222 4.45207 4.45424 3.27647C5.20363 2.37935 6.16144 1.68572 7.22257 1.14386C7.02349 1.94688 7.08108 2.81315 7.29582 3.56521L7.29582 3.56521C7.59055 4.59735 8.15635 5.52765 8.67812 6.38556C8.78432 6.56018 8.88871 6.73181 8.98861 6.90069C9.54275 7.83745 10.0081 8.71137 10.1263 9.6305C10.1687 9.9604 10.4261 10.1453 10.6498 10.1922C10.8763 10.2396 11.2005 10.1706 11.3651 9.86217C11.6322 9.36186 11.9297 8.80333 12.1227 8.18365L12.1227 8.18364C12.1537 8.08403 12.1829 7.9826 12.2098 7.87962C12.2855 8.11165 12.3462 8.35634 12.3942 8.61902C12.5649 9.5537 12.5385 10.5398 12.4371 11.5263C12.3012 12.6093 12.0314 13.6681 11.4879 14.5065L11.4861 14.5094C10.8554 15.4955 9.83153 16.222 8.67751 16.6311C6.56103 17.0067 4.50672 16.7226 2.9857 15.4184C2.29134 14.6971 1.94325 14.2646 1.70798 13.8923C1.51285 13.5836 1.3901 13.3107 1.20901 12.9082C1.16723 12.8153 1.12235 12.7155 1.07275 12.6068C0.608211 11.5206 0.47068 10.263 0.69756 9.07097Z" stroke="#7F8FA4" stroke-width="1.1"/>
                </svg>
                <svg  class="task-modal-header-icon task-modal-important-icon" title="Горит" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
                  <path d="M2.60736 15.8184C1.1762 14.3342 1.07959 13.9464 0.569713 12.8293C0.059581 11.64 -0.0902869 10.2688 0.15726 8.96813C0.38449 7.77425 0.885697 6.64011 1.60543 5.64972C1.66351 5.5698 1.79321 5.61726 1.79602 5.71602C1.81525 6.39089 2.04711 7.06556 2.44651 7.62123C2.50619 7.70427 2.63013 7.64553 2.61635 7.5442C2.39523 5.91812 2.96318 4.20354 4.03213 2.92387C5.088 1.65986 6.51082 0.790144 8.02037 0.176121C8.11867 0.136137 8.21322 0.269054 8.15433 0.357333C7.57939 1.21921 7.53534 2.40087 7.82469 3.41419C8.15418 4.5681 8.84412 5.5762 9.46198 6.62066C10.0141 7.55396 10.5375 8.5162 10.6718 9.56033C10.6849 9.66214 10.8316 9.69369 10.8799 9.60314C11.15 9.09733 11.4223 8.58274 11.5975 8.02011C11.7648 7.48284 11.8658 6.92375 11.8141 6.37774C11.804 6.27077 11.9513 6.20262 12.0136 6.29017C12.4939 6.96518 12.779 7.66474 12.9353 8.52019C13.1198 9.5303 13.0879 10.5773 12.9836 11.5886C12.8436 12.7083 12.5594 13.8646 11.9495 14.8057C11.2333 15.9255 10.0843 16.7234 8.82536 17.1621C8.82049 17.1638 8.81549 17.1652 8.81041 17.1661C6.57617 17.5701 4.30802 17.2901 2.60736 15.8184Z" fill="#F3705A"/>
                  <path d="M4.40397 16.4551C3.63542 15.658 3.58354 15.4498 3.30973 14.8499C3.03578 14.2112 2.9553 13.4749 3.08823 12.7764C3.20084 12.1848 3.43873 11.6205 3.77851 11.119C3.83392 11.0372 3.96787 11.0836 3.97922 11.1817C4.00861 11.4359 4.09288 11.6856 4.22359 11.9086C4.2753 11.9968 4.39835 11.9422 4.39091 11.8402C4.33101 11.0193 4.63252 10.1729 5.16908 9.5306C5.6927 8.90376 6.38436 8.45749 7.12557 8.13318C7.22279 8.09064 7.3294 8.2313 7.28328 8.32687C7.0709 8.76695 7.06909 9.31538 7.20572 9.79391C7.38267 10.4136 7.75317 10.9549 8.08497 11.5158C8.35079 11.9652 8.60423 12.427 8.70578 12.9219C8.72642 13.0224 8.88078 13.0537 8.9284 12.9628C9.04484 12.7404 9.15547 12.5124 9.23178 12.2673C9.30001 12.0482 9.34769 11.8224 9.35453 11.5979C9.3578 11.4906 9.51654 11.4242 9.5725 11.5159C9.76094 11.8248 9.87984 12.1509 9.95016 12.5359C10.0492 13.0783 10.0321 13.6406 9.9761 14.1836C9.90094 14.7849 9.74832 15.4059 9.42077 15.9113C9.03682 16.5116 8.42121 16.9396 7.74649 17.1755C7.74162 17.1772 7.73661 17.1785 7.73153 17.1794C6.53287 17.3955 5.31634 17.2446 4.40397 16.4551Z" fill="#FFD15C"/>
                </svg>
              </div>
              <div @click="set('is_favourite', !e_task.is_favourite)">
                <svg :class="'task-modal-header-icon task-modal-favourite-icon ' +(e_task.is_favourite ? 'active' : '')" title="В закладки" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0.618034L10.6574 5.71885C10.7912 6.13087 11.1752 6.40983 11.6084 6.40983H16.9717L12.6327 9.56231C12.2822 9.81695 12.1356 10.2683 12.2694 10.6803L13.9268 15.7812L9.58779 12.6287C9.2373 12.374 8.7627 12.374 8.41221 12.6287L4.0732 15.7812L5.73056 10.6803C5.86443 10.2683 5.71777 9.81695 5.36729 9.56231L1.02828 6.40983H6.39159C6.82481 6.40983 7.20877 6.13087 7.34265 5.71885L9 0.618034Z" stroke="#7F8FA4"/>
                </svg>
              </div>
              <div title="Добавить теги"  @click="toggleTagsDropdown($event)">
                <svg  :class="'task-modal-header-icon task-modal-tags-icon '+(tagsAreShown ? 'active' : '')" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2117 14.5072L15.7657 19.6025C15.564 19.7912 15.2476 19.7806 15.059 19.579L6.47656 10.4058C6.38684 10.3099 6.33845 10.1825 6.34184 10.0513L6.46903 5.12216C6.47589 4.85611 6.68996 4.64206 6.95601 4.63522L12.3018 4.49776C12.4446 4.49408 12.5821 4.55167 12.6797 4.65599L17.1457 9.42934L21.2353 13.8005C21.4239 14.0021 21.4134 14.3185 21.2117 14.5072Z" stroke="#7F8FA4"/>
                  <path d="M19.11 14.5072L13.6639 19.6025C13.4623 19.7912 13.1459 19.7806 12.9572 19.579L3.85862 9.85407C3.77195 9.76143 3.72373 9.63932 3.72373 9.51247L3.72373 4.44562C3.72373 4.16948 3.94759 3.94562 4.22373 3.94562L9.69642 3.94562C9.8348 3.94562 9.967 4.00297 10.0615 4.10402L14.7909 9.15896L19.1335 13.8005C19.3221 14.0021 19.3116 14.3185 19.11 14.5072Z" fill="white" stroke="#7F8FA4"/>
                  <circle cx="7.35625" cy="7.35622" r="1.55089" stroke="#7F8FA4"/>
                </svg>
              </div>
              <div :class="'c-dropdown dropdown '+(tagsAreShown ? 'show' : '')" id="task-tags-dropdown">
                <div class="c-dropdown__menu dropdown-menu dropdown-menu-right c-dropdown-menu-cbs">
                  <div class="c-dropdown__item" v-for="tag, index in $store.state.taskTags">
                    <div
                      class="c-choice c-choice--round c-choice--checkbox abs c-choice--checkbox--small c-choice--info">
                      <input :id="'active-task-tag-'+index" :value="index" type="checkbox" v-model="e_task.tags"
                             class="c-choice__input">
                      <label :for="'active-task-tag-'+index" class="c-choice__label">
                        <span v-html="tag.title"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="task-modal-subtitle-bar">
            <div class="task-modal-tags" v-if="e_task.tags.length">

              <div class="trigger task-modal-tag" v-for="tag, i in e_task.tags" @click="e_task.tags.splice(i, 1)">
                <div class="task-modal-tag-icon"><i :class="'fa fa-circle-o u-color-'+getTagCls(tag)"></i></div>
                <div class="" v-html="getTagTitle(tag)"></div>
              </div>
            </div>
            <div class="task-modal-subtitle-tools">

            </div>
          </div>
          <div class="task-modal-editor">
            <div>
              <div
                :class="'hidden-editr-toolbar ' +(!taskEditorToolbar ? 'no-toolbar' : '')+ (e_task.checklist.length ? ' task-modal-editor-w-checklist' : '')">
                <wysiwyg v-model="e_task.description" placeholder=""/>
              </div>
              <div class="task-editor-checklist u-p-xsmall u-mb-large" v-if="e_task.checklist.length">
                <div class="task-editor-wysiwyg-sep u-text-mute u-text-uppercase u-text-small u-mb-medium">
                  <span>Чек-лист</span>
                </div>
                <div class="edit-task-checklist-items">
                  <div class="edit-task-checklist-item" v-for="item, itemIndex in e_task.checklist">
                    <div class="edit-task-checklist-item-normal">
                      <div class="c-choice c-choice--checkbox c-choice--transparent">
                        <input :id="'active-task-cl-'+itemIndex" name="active" type="checkbox"
                               v-model="item.checked" class="c-choice__input">
                        <label :for="'active-task-cl-'+itemIndex" class="c-choice__label"
                               :id="'active-task-cl-label-'+itemIndex"
                               @contextmenu="openCheckListMenu(itemIndex, $event)">
                          <input type="text" v-if="item.edit" :ref="'eTaskClInput'+itemIndex" v-model="item.title"
                                 class="c-input" @keyup="keypressCheckList($event, item)"
                                 @blur="item.edit = false;" :mounted="setFocusCheckList(itemIndex)">
                          <span v-html="item.title" v-else></span>
                        </label>
                        <div class="checklist-context c-dropdown__menu dropdown-menu dropdown-menu-right"
                             :id="'active-task-cl-label-context-'+itemIndex" :key="itemIndex"
                             :mounted="focusEl(itemIndex)" v-if="activeChecklistContext === itemIndex">
                          <div class="c-dropdown__item dropdown-item trigger"
                               @click="editCheckListItem(item, itemIndex)">редактировать
                          </div>
                          <div class="c-dropdown__item dropdown-item trigger"
                               @click="e_task.checklist.splice(itemIndex, 1)">удалить
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div> <!-- items -->
              </div>
              <div class="task-editor-toolbar-additional">
                <div  :class="'task-checklist-toolbar-toggler u-text-mute trigger u-inline-block u-mr-small '+(checklistTab ? 'u-color-info' : '')" @click="checklistTab = !checklistTab">создать чек-лист</div>
                <div :class="'task-checklist-toolbar-toggler u-text-mute trigger u-inline-block '+(taskEditorToolbar ? 'u-color-info' : '')" @click="taskEditorToolbar = !taskEditorToolbar">редактор текста</div>
              </div>
            </div>
            <div>
              <div id="checklist-tab" style="display: none;">
                <div class="task-editor-toolbar-additional">
                  <input type="text" class="c-input u-mt-small" placeholder="новый пункт в чеклисте"
                         @keyup="submitEnter($event, createtaskChecklistItem)"
                         v-model="newCheckListItemTitle">
                </div>
              </div>
            </div>
          </div><!-- // .c-stage__panel -->

        </div>
        <div class="c-toolbar c-toolbar--small" v-show="false">
          <div class="c-tabs__item" v-for="tab, index in tabs" @click="activeTab = index"><span :class="'c-tabs__link trigger '+(activeTab === index ? 'active' : '')" v-html="tab.title"></span></div>
        </div>

        <div class="task-modal-tab-content" v-if="activeTab === 'details'" :key="'task-modal-tab-details'"
             :mounted="recalculateMainTab()">
          <div class="u-pv-medium">
            <div class="u-bg-white task-modal-padding u-border-top u-border-bottom mh-200  u-width-100">
              <div class="task-modal-bb-wrapper">
                <div class="task-modal-responsible task-modal-blue-block task-modal-blue-block-first u-mr-small">
                  <div :class="'task-modal-blue-block-fr '+(allowEditTask ? 'trigger' : '')"
                       @click="allowEditTask ? toggleEl('select-responsible-wrapper') : toggleEl('select-responsible-wrapperx')">
                    <div class="task-modal-blue-block-val-wrapper c-input c-input-material-like">
                      <div class="material-like-placeholder">Ответственный</div>
                      <div class="task-modal-blue-block-val ">
                        <span v-html="renderUserRealName(e_task.responsibleUser)"></span>
                      </div>
                    </div>
                  </div>
                  <div class="task-modal-blue-block-select-val" id="select-responsible-wrapper">
                    <tagsUsers :selected="e_task.responsibleUser" ref="eTaskResponsibleRef"
                               :allowUserTypes="['admin', 'coworker']" :selectCallback="selectResponsibleCallback"
                               :inline="true" :multiple="false"></tagsUsers>
                  </div>
                </div>
                <div class="task-modal-date-deadline task-modal-blue-block">
                  <div :class="'task-modal-blue-block-fr '+(allowEditTask ? 'trigger' : '')"
                       @click="allowEditTask ? toggleEl('deadline-wrapper') : toggleEl('deadline-wrapperx')">
                    <div class="task-modal-blue-block-val-wrapper c-input c-input-material-like">
                      <div class="material-like-placeholder">
                        Крайний срок
                      </div>
                      <div class="task-modal-blue-block-val  trigger">
                        <span v-html="$refs.eTaskDeadlineRef ? $refs.eTaskDeadlineRef.placeholderText : ''"></span>
                        <span class="vdp-datepicker__clear-button ver2 ver2x2" @click="clearDeadline($event)">&times;</span>
                      </div>
                    </div>
                  </div>
                  <div class="task-modal-blue-block-select-val" id="deadline-wrapper">
                    <dateTimePicker ref="eTaskDeadlineRef" placeholderVal="Не выбран" v-model="e_task.deadline" :inline="true"
                                    :disabledDates="disabledDates"/>
                  </div>
                </div>
              </div>
              <div class="task-modal-bb-wrapper u-mt-zero">
                <div class="task-modal-responsible task-modal-blue-block task-modal-blue-block-first ">
                  <div class="task-modal-blue-block-fr u-mt-zero">
                    <div class="task-modal-blue-block-val-wrapper">
                      <div class="task-modal-blue-block-val">
                        <div class="u-relative">
                          <div class="material-like-placeholder">Ценный конечный продукт:</div>
                          <input type="text" class="c-input" v-model="e_task.target">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="c-stage__header u-text-dark-hover u-flex u-justify-between" @click="toggleEl('documents-tab')">
                <h6 class="u-text-mute u-text-dark-hover-parent u-text-uppercase u-text-small u-mb-zero">Документы</h6>
                <i class="fa fa-angle-down u-text-dark-hover-parent u-text-mute"></i>
              </div>
              <div class="c-stage__panel c-stage__panel--mute collapse" id="documents-tab">
                <div class="u-p-medium">
                  <div>
                    files
                  </div>
                  <div class="c-stage__pane-empty u-text-center">
                    <div class="u-text-center u-color-info trigger">загрузить новый файл</div>
                  </div>
                </div>
              </div>
              <div v-if="e_task.task_id">
                <div class="c-stage__header u-text-dark-hover u-flex u-justify-between" @click="toggleEl('comments-tab')">
                  <h6 class="u-text-mute u-text-dark-hover-parent u-text-uppercase u-text-small u-mb-zero">Комментарии</h6>
                  <i class="fa fa-angle-down u-text-dark-hover-parent u-text-mute"></i>
                </div>
                <div class="c-stage__panel c-stage__panel--mute collapse" id="comments-tab">
                  <div class="u-p-medium">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo similique illo dolore aliquid quas, saepe nostrum placeat vero, illum explicabo sed cumque dolorem iusto dolores aperiam! Veritatis quod neque excepturi!</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        <div class="task-modal-tab-content" v-if="activeTab === 'additional'" :key="'task-modal-tab-additional'">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import tasksMixin from '@/mixins/tasksMixin.vue';
  import tagsUsers from '@/components/tagsUsers.vue';
  import dateTimePicker from '@/components/elements/dateTimePicker.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import moment from 'moment';

  export default {
    mixins: [tasksMixin, commonMixin],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      task: {},
      e_task: {},
    },
    data() {
      return {
        id: 'taskModal',
        taskEditorToolbar: false,
        checklistTab: false,
        newCheckListItemTitle: '',
        tagsAreShown: false,
        outsideClicks: 0,
        allowEditTask: true,
        activeChecklistContext: '',
        disabledDates: {
          to: null
        },
        tabs: {
          details: {title: 'Детали'},
          additional: {title: 'Дополнительно'},
          history: {title: 'История'}
        },
        activeTab: 'details'
      };
    },
    mounted() {
      let $el = $('#edit-task-checklist');
      if (!$el) {
        return;
      }
      this.recalculateMainTab();
      this.recalculateData();
    },
    destroyed() {
      this.hideTagsDropdown();
      this.hideModal();
    },
    watch: {
      taskEditorToolbar(v) {
        let $el = $('.task-modal-editor').find('.editr--toolbar');
        if(v) {
          $el.slideDown(200);
        } else {
          $el.slideUp(200);
        }
      },
      checklistTab(v) {
        this.toggleEl('checklist-tab', v);
      },
      'task.task_id'() {
        this.recalculateData();
      },
      show(v) {
        this.toggleModal(v);
      },
      'e_task.tags'() {
        if (this.e_task.tags.length === Object.keys(this.$store.state.taskTags).length || !this.e_task.tags.length) {
          this.hideTagsDropdown();
        }
      },
    },
    methods: {
      keypressCheckList($event, item) {
        this.submitEnter($event, () => {
          this.changeItemProp(item, 'edit', false);
        });
      },
      changeItemProp(item, prop, val) {
        item[prop] = val;
      },
      setFocusCheckList(i) {
        setTimeout(() => {
          // console.log(this.$refs['eTaskClInput'+i]);
          this.$refs['eTaskClInput' + i][0].focus();
        }, 100);
      },
      editCheckListItem(item, index) {
        for (let i = 0; i < this.e_task.checklist.length; i++) {
          if (index === i) {
            item.edit = !item.edit;
          } else {
            this.e_task.checklist[i].edit = false;
          }
        }
      },
      focusEl(index) {
        $('#active-task-cl-label-context-' + index).focus();
      },
      openCheckListMenu(ind, e) {
        e.preventDefault();
        this.activeChecklistContext = ind;
        let body = $('body');
        body.off('click.clm');
        body.on('click.clm', () => {
          this.activeChecklistContext = null;
          $('body').off('click.clm');
        });
      },

      clearDeadline(e) {
        this.e_task.deadline = null;
        e.stopPropagation();
        $('#deadline-wrapper')
      },
      recalculateMainTab() {
        if (!this.e_task.task_id) {
          $('#documents-card').show();
          $('#checklist-card').show();
        }
      },
      selectResponsibleCallback() {
        this.toggleEl('select-responsible-wrapper');
      },
      recalculateData() {
        this.disabledDates = {
          to: new Date(),
        };
      },
      set(k, v) {
        this.e_task[k] = v;
      },

      toggleDD($ev) {
        let $target = $($ev.target).closest('.task-data-togglable').find('.task-data-togglable-body').slideToggle();
      },
      toggleTagsDropdown(e) {
        if (this.tagsAreShown) {
          this.hideTagsDropdown();
        } else {
          this.showTagsDropdown();
        }
      },
      showTagsDropdown() {
        console.log('show');
        let id = 'task-tags-dropdown';
        this.tagsAreShown = true;
        $('body').on('click.task-tags-dropdown', (e) => {
          let $target = $(e.target);
          if ($target.attr('id') === id || $target.closest('#' + id).length || e.target.id === 'task-tags-toggler') {
            return;
          }
          this.outsideClicks++;
          if (this.outsideClicks > 1) {
            this.hideTagsDropdown();
          }
        });
      },
      hideTagsDropdown() {
        console.log('hide');
        this.outsideClicks = 0;
        this.tagsAreShown = false;
        $('body').off('click.task-tags-dropdown');
      },
      submitEnter(e, cb) {
        if (e.key !== 'Enter') {
          return;
        }
        if (e.shiftKey !== false) {
          return;
        }
        cb();
      },
      createtaskChecklistItem() {
        if (!this.newCheckListItemTitle) {
          return;
        }
        this.newCheckListItemTitle = this.newCheckListItemTitle.toString().trim();
        if (!this.newCheckListItemTitle) {
          return;
        }
        this.e_task.checklist.push({
          title: this.newCheckListItemTitle,
          delimeter: false,
          checked: false,
          edit: false
        });
        this.newCheckListItemTitle = '';
      },
      escapeListener(e) {
        if (e.key !== 'Escape') {
          return;
        }
        this.$parent.modalMode = null;
      },
      toggleModal(v) {
        let el = $('#' + this.id);
        let el2 = el.find('.task-modal-backdrop');
        if (v) {
          el.show();
          el2.stop().fadeIn(300);
          el.addClass('show');
          $('body').addClass('task-mode');
          window.addEventListener('keydown', this.escapeListener);
        } else {
          this.hideModal();
        }
      },
      hideModal() {
        let el = $('#' + this.id);
        let el2 = el.find('.task-modal-backdrop');
        el2.stop().fadeOut(300, () => {
          el.hide();
        });
        el.removeClass('show');
        window.removeEventListener('keydown', this.escapeListener);
        $('body').removeClass('task-mode');
      },
      toggleEl(a, arg) {
        let $el = $('#' + a);
        if(typeof arg === 'undefined') {
          $el.slideToggle(200);
          return;
        }
        if(arg) {
          $el.slideDown(200);
        } else {
          $el.slideUp(200);
        }
      },
    },
    components: {tagsUsers, dateTimePicker}
  }
</script>
