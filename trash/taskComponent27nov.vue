<template>
  <div class="task-modal-outer" :id="id">
    <div class="task-modal-backdrop" @click="$parent.modalMode = null;"></div>
    <div class="task-modal-inner c-scrollbar">
      <div class="task-modal-left">
        <div class="task-modal-header">
          <div class="task-modal-close" @click="$parent.modalMode = null" >
            <i class="fa fa-angle-left"></i>
          </div>
          <div class="task-modal-title">
            <input type="text" v-model="e_task.title" placeholder="Название задачи" class="task-modal-title-input" />
            <div class="task-modal-header-icons">
              <i :class="'fa fa-exclamation-circle task-modal-header-icon important '+(e_task.is_important ? 'active' : '')" @click="set('is_important', !e_task.is_important)"></i>
              <i :class="'fa fa-star task-modal-header-icon task-modal-header-icon-star favourite '+(e_task.is_favourite ? 'active' : '')" @click="set('is_favourite', !e_task.is_favourite)"></i>
              <i :class="'fa fa-tags task-modal-header-icon '+(tagsAreShown ? 'active' : '')" id="task-tags-toggler" @click="toggleTagsDropdown($event)"></i>
              <div :class="'c-dropdown dropdown '+(tagsAreShown ? 'show' : '')" id="task-tags-dropdown">
                <div class="c-dropdown__menu dropdown-menu dropdown-menu-right c-dropdown-menu-cbs">
                  <div class="c-dropdown__item" v-for="tag, index in $store.state.taskTags">
                    <div  class="c-choice c-choice--round c-choice--checkbox abs c-choice--checkbox--small c-choice--info2">
                      <input :id="'active-task-tag-'+index" :value="index" type="checkbox" v-model="e_task.tags" class="c-choice__input">
                      <label :for="'active-task-tag-'+index" class="c-choice__label">
                        <span v-html="tag.title"></span>
                        <i :class="'fa fa-tag '+tag.cls"></i>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="task-modal-subtitle-bar">
            <div class="task-modal-tags">

              <div class="task-modal-tag" v-for="tag, i in e_task.tags" @click="e_task.tags.splice(i, 1)">
                <div :class="'task-modal-tag-title u-color-'+getTagCls(tag)" v-html="getTagTitle(tag)"></div>
                <div class="task-modal-tag-close">&times;</div>
              </div>
            </div>
            <div class="task-modal-subtitle-tools">

            </div>
          </div>
          <div class="task-modal-header-more"></div>
        </div>
        <div class="task-modal-tabs">
          <div v-for="tab, i in tabs" :class="'task-modal-tab '+(activeTab === i ? 'active' : '')" @click="activeTab = i" v-html="tab.title"></div>
        </div>
        <div class="task-modal-tab-content" v-if="activeTab === 'details'">
          <div class="task-modal-padding" style="display: none;">
            <div class="task-data-togglable" id="edit-task-checklist">
              <div class="task-data-wrapper-desc  u-mb-xsmall" @click="toggleDD($event)">
              <span class="task-data-wrapper-desc-title u-text-mute u-text-dark-hover">
                <i class="fa fa-check-square-o  u-mr-xsmall top@0@5" aria-hidden="true"></i>Чек-лист по задаче:
              </span>
                <div class="task-data-wrapper-desc-toggler">
                  <i class="fa fa-angle-down"></i>
                </div>
              </div>
              <div class="task-data-togglable-body">
                <div class="progress-with-percent">
                  <div class="progress-with-percent-percent" v-html="calculateChecklistProgress(e_task.checklist)+'%'"></div>
                  <div class="c-progress">
                    <div class="c-progress__bar n-progress-inner u-bg-success" :style="'width: '+calculateChecklistProgress(e_task.checklist)+'%'"></div>
                  </div>
                </div>
                <div class="edit-task-checklist-items">
                  <div class="edit-task-checklist-item" v-for="item, itemIndex in e_task.checklist">
                    <div class="edit-task-checklist-item-normal">
                      <div class="c-choice c-choice--checkbox c-choice--checkbox--small c-choice--round u-mt-xsmall">
                        <input :id="'active-task-cl-'+itemIndex" name="active" type="checkbox" v-model="item.checked" class="c-choice__input">
                        <label :for="'active-task-cl-'+itemIndex" class="c-choice__label">
                          <input type="text" v-if="item.edit" v-model="item.title" class="c-input">
                          <span v-html="item.title" v-else></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div> <!-- items -->
                <div class="edit-task-checklist-items-edit u-mb-small">
                  <div class="u-mt-large">
                    <textarea style="height: 70px;" class="c-input-blank" @keyup="submitEnter($event, createActiveTaskChecklistItem)"  v-model="newCheckListItemTitle"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="task-modal-description">
            <div :class="taskEditorToolbar ? '' : 'hidden-editr-toolbar'">
              <div class="task-editor-with-toolbar">
                <wysiwyg  v-model="e_task.description" placeholder="" />
              </div>
            </div>
          </div>
        </div>

        <div class="task-modal-tab-content" v-if="activeTab === 'additional'">

        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import tasksMixin from '@/mixins/tasksMixin.vue';
  import tagsUsers from '@/components/tagsUsers.vue';
  export default {
    mixins: [tasksMixin],
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
        newCheckListItemTitle: '',
        tagsAreShown: false,
        outsideClicks: 0,
        allowEditTask: true,
        tabs: {
          details:  { title: 'Детали' },
          subtasks: { title: 'Подзадачи' },
          additional: { title: 'Дополнительно' }
        },
        activeTab: 'details'
      };
    },
    mounted() {
      let $el = $('#edit-task-checklist');
      if(!$el) { return; }
      if(this.e_task.checklist.length) {
        $el.find('.task-data-togglable-body').slideDown();
      }
    },
    watch: {
      show(v) {
        this.toggleModal(v);
      },
      'e_task.tags'() {
        if(this.e_task.tags.length === Object.keys(this.$store.state.taskTags).length) {
          this.hideTagsDropdown();
        }
      },
    },
    methods: {
      set(k, v) {
        this.e_task[k] = v;
      },
      toggleEl($el) {
        $el.slideToggle();
      },
      toggleDD($ev) {
        let $target = $($ev.target).closest('.task-data-togglable').find('.task-data-togglable-body').slideToggle();
      },
      toggleTagsDropdown(e) {
        if(this.tagsAreShown) {
          this.hideTagsDropdown();
        } else {
          this.showTagsDropdown();
        }
      },
      showTagsDropdown() {
        let id = 'task-tags-dropdown';
        this.tagsAreShown = true;
        $('body').on('click.task-tags-dropdown', (e) => {
          let $target = $(e.target);
          if($target.attr('id') === id  || $target.closest('#'+id).length || e.target.id === 'task-tags-toggler') {
            return;
          }
          this.outsideClicks++;
          if(this.outsideClicks > 0) {
            this.hideTagsDropdown();
          }
        });
      },
      hideTagsDropdown() {
        this.outsideClicks = 0;
        this.tagsAreShown = false;
        $('body').off('click.task-tags-dropdown');
      },
      submitEnter(e, cb) {
        if(e.key !== 'Enter') { return; }
        if(e.shiftKey !== false) { return; }
        cb();
      },
      createActiveTaskChecklistItem() {
        if(!this.newCheckListItemTitle) { return; }
        this.newCheckListItemTitle = this.newCheckListItemTitle.toString().trim();
        if(!this.newCheckListItemTitle) { return; }
        this.e_task.checklist.push({
          title: this.newCheckListItemTitle,
          delimeter: false,
          checked: false,
          edit: false
        });
        this.newCheckListItemTitle = '';
      },
      calculateChecklistProgress(checklist) {
        let active = 0;
        for(let i = 0; i < checklist.length; i++) {
          if(checklist[i].checked) { active++; }
        }
        let r = parseInt((active/checklist.length*100));
        r = r ? r : 0;
        return r; //percent;
      },
      toggleModal(v) {
        let el = $('#'+this.id);
        let el2 = el.find('.task-modal-backdrop');
        if(v) {
          el.show();
          el2.stop().fadeIn(300);
          el.addClass('show');
          $('body').addClass('task-mode');
        } else {

          el2.stop().fadeOut(300, () => {
            el.hide();
          });
          el.removeClass('show');
          $('body').removeClass('task-mode');
        }
      },
      toggleEl(a) {
        $('#'+a).slideToggle(200);
      },
    },
    components: { tagsUsers }
  }
</script>
