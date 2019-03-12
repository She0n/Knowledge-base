<template>
  <div>
    <div class="tasks-page" id="tasks-page">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 u-p-zero">
            <div class="c-toolbar u-mb-medium" id="tasks-toolbar">
              <div class="tasks-toolbar-inner">
                <div class="c-toolbar-row-1 u-width-100">
                  <div class="change-chat-mode" @click="prevPage()"><i class="fa fa-angle-left"></i></div>
                  <h3 :class="'c-toolbar__title '+(hasItems ? 'has-divider' : '')" v-html="renderHeading()"></h3>
                  <h5 :class="'c-toolbar__meta u-mr-auto '+(!hasItems ? 'u-invisible' : '')" v-html="isInProjects ? (projects.total + ' ' +rusificate(projects.total, 'проект', 'проекта', 'проектов')) : (tasks.total + ' '+rusificate(tasks.total, 'задача', 'задачи', 'задач'))"></h5>
                  <a title="Вид: список" :class="'c-toolbar__icon has-divider u-hidden-down@mobile '+(tasksData.mode === 'list' ? 'is-active' : '')" @click="tasksData.mode = 'list'" v-if="displayDisplayModes">
                    <i class="fa fa-navicon"></i>
                  </a>
                  <a title="Вид: канбан" :class="'c-toolbar__icon has-divider u-hidden-down@mobile '+(tasksData.mode === 'kanban' ? 'is-active' : '')" @click="tasksData.mode = 'kanban'" v-if="displayDisplayModes">
                    <i class="fa fa-th-large"></i>
                  </a>
                  <a title="Расширенный поиск" class="c-toolbar__icon u-mr-small u-hidden-down@mobile u-text-warning-hover"  v-if="!displayModifyBtn">
                    <i class="fa fa-sliders"></i>
                  </a>
                  <div class="u-inline-block search-input-wrapper u-mr-xsmall" v-if="!displayModifyBtn">
                    <input type="text" class="c-input" :placeholder="'Поиск по '+(isInProjects ? 'проектам' : 'задачам')" v-model="isInProjects ? projects.q : tasksData.q" />
                    <div class="search-icon " aria-label="Расширенный поиск">
                      <i class="fa fa-search" ></i>
                    </div>
                  </div>

                  <div class="u-inline-block" v-if="!displayModifyBtn">
                    <router-link :to="isInProjects ? '/tasks/add-project' : '/tasks/add'">
                      <button class="c-btn c-btn--success"><i class="fa fa-plus u-mr-xsmall"></i><span v-html="isInProjects ? 'Создать проект' : 'Создать задачу'"></span></button>
                    </router-link>
                  </div>
                  <div v-if="displayModifyBtn">
                    <button class="c-btn c-btn--success" @click="isInProjects ? modifyProject() : modifyTask()"><i class="fa fa-check u-mr-xsmall"></i><span v-html="isInProjects ? 'Сохранить проект' : 'Сохранить задачу'"></span></button>
                  </div>
                </div>
              </div>
              <div class="c-toolbar-row-2">
                <div id="fixed-actions-with-selected" >
                  <div class="fixed-actions-inner">
                    <div>
                      <div class="tma-descriptor u-text-mute u-text-right">Действия с выбранными:</div>
                      <div class="tma-actions-list">
                        <nselect2 :options="tasksMassActions" v-model="tasksMassAction" :value="tasksMassAction"  id="tasks-mass-actions-select" placeholderVal="Не выбрано" :nullable="true"></nselect2>
                      </div>
                      <div class="tma-apply">
                        <div class="c-btn c-btn--fancy u-text-left"><i class="fa fa-check u-mr-xsmall"></i>Применить</div>
                      </div>
                    </div>
                    <div class="u-mt-3" v-if="tasksMassActions[tasksMassAction] && tasksMassActions[tasksMassAction].tmaUser">
                      <div class="tma-descriptor u-text-mute u-text-right" v-html="tasksMassActions[tasksMassAction].tmaUser"></div>
                      <div class="tma-actions-list">
                        <div class="c-input c-input-abs u-text-left trigger u-relative u-p-zero">
                          <div class="u-p-input cursor-default">
                            <div class="u-p-input-inner" v-html="selectedTmaUser.user_id ? renderUserRealName(selectedTmaUser) : 'Не выбран'"></div>
                          </div>
                          <span class="vdp-datepicker__clear-button ver2" v-if="selectedTmaUser.user_id"
                                v-on:click="clearTmaUser()"><i><span>×</span></i></span>
                        </div>
                      </div>
                      <div class="tma-apply">
                        <button class="c-btn u-text-left c-btn--fancy" v-on:click="selectTmaUser()"><i class="fa fa-user-plus u-mr-xsmall"></i>Выбрать</button>
                      </div>
                    </div>
                    <div class="u-mt-3" v-if="tasksMassActions[tasksMassAction] && tasksMassActions[tasksMassAction].tmaTime">
                      <div class="tma-descriptor u-text-mute u-text-right" v-html="tasksMassActions[tasksMassAction].tmaTimeDescription"></div>
                      <div class="tma-actions-list">
                        <dateTimePicker placeholderVal="Не выбран" v-model="selectedTmaTime"></dateTimePicker>
                      </div>
                      <div class="tma-apply">

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="tasks-main">
              <div v-if="isInProjects">

              </div>
              <div v-if="!isInProjects">
                <transition name="slide-fade" mode="out-in">
                  <tasksListComponent :tasksMassActions="tasksMassActions" :key="'tasks-all'" v-if="activeView === 'tasks-all' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" :key="'tasks-in_progress'" v-if="activeView === 'tasks-in_progress' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" :key="'tasks-helping'" v-if="activeView === 'tasks-helping' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" :key="'tasks-instucted'" v-if="activeView === 'tasks-instucted' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" :key="'tasks-observing'" v-if="activeView === 'tasks-observing' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <div v-if="activeView === 'tasks-task'" class="tasks-list-wrapper">
                    <div class="edit-task-container">
                      task page
                    </div>
                  </div>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-all'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-in_progress'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-helping'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-instucted'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-observing'"></kanbanComponent>
                  <div class="tasks-list-wrapper" v-if="activeView === 'tasks-add' || activeView === 'tasks-edit'" :key="'tasks-add'">
                    <div class="c-stage">
                      <div class="u-relative" v-if="e_activeTask.task_id">
                        <ul class="c-tabs__list nav nav-tabs no-border-tabs">
                          <li :class="activeView === 'tasks-task' ? 'active' : ''">
                            <router-link :to="'/tasks/task?task_id='+e_activeTask.task_id" >
                              Задача
                            </router-link>
                          </li>
                        </ul>
                        <div :class="'rounded-icon  icon-edit-user trigger '+((activeView === 'tasks-edit' || activeView === 'tasks-add') ? 'active' : '')"><i class="fa fa-cog"></i></div>
                      </div>
                      <div class="edit-task-container">
                        <div class="edit-task-container-inner">
                          <div>
                            <div >
                              <div class="u-mb-small u-pb-xsmall u-border-bottom task-edit-title">
                                <input type="text" v-model="e_activeTask.title" placeholder="Введите название задачи" class="c-input">
                                <div :class="'edit-task-is-important '">

                                </div>
                              </div> <!-- end activeTask.title -->
                              <div class="u-mb-small">
                                <div >
                                  <div class="c-field u-relative">
                                    <div :class="taskEditorToolbar ? '' : 'hidden-editr-toolbar'">
                                      <wysiwyg  v-model="e_activeTask.description" placeholder="" />
                                    </div>
                                    <div class="task-editor-toolbar-additional">
                                      <i class="fa fa-document-with-paperclip fa-document-with-paperclip-dark-hover trigger u-text-dark-hover u-mr-5" title="Загрузить файл" @click="toggleEl('edit-task-files')"></i>
                                      <i class="fa fa-check-square-alt fa-check-square-alt-dark-hover trigger" title="Чек-лист" @click="toggleEl('edit-task-checklist')"></i>
                                      <i class="fa fa-font task-editor-toolbar-toggler trigger u-text-dark-hover" title="Визуальный редактор" @click="taskEditorToolbar = !taskEditorToolbar"></i>
                                    </div>
                                  </div>
                                </div>
                              </div> <!-- end activeTask desc -->
                              <div class="task-data-wrapper task-data-wrapper-2 u-mb-small u-border-bottom" id="edit-task-files" style="display: none;">
                                <div class="task-data-wrapper-desc u-text-dark u-text-bold u-mb-xsmall"><i class="fa fa-document-with-paperclip u-mr-small top@2" aria-hidden="true"></i>Прикрепленные файлы и документы:</div>
                                <div class="task-data-wrapper-files-list">

                                </div>
                                <div class="task-data-wrapper-box">

                                </div>
                              </div>
                              <div class="task-data-wrapper task-data-wrapper-2 u-mb-small u-border-bottom" id="edit-task-checklist" style="display: none;">
                                <div class="task-data-wrapper-desc u-text-bold u-text-dark u-mb-xsmall"><i class="fa fa-check-square-alt u-mr-small top@1@5" aria-hidden="true"></i>Чек-лист по задаче:</div>
                                <div class="progress-with-percent">
                                  <div class="progress-with-percent-percent" v-html="calculateChecklistProgress(e_activeTask.checklist)+'%'"></div>
                                  <div class="c-progress">
                                    <div class="c-progress__bar n-progress-inner u-bg-success" :style="'width: '+calculateChecklistProgress(e_activeTask.checklist)+'%'"></div>
                                  </div>
                                </div>
                                <div class="edit-task-checklist-items">
                                  <div class="edit-task-checklist-item" v-for="item, itemIndex in e_activeTask.checklist">
                                    <div class="edit-task-checklist-item-normal">
                                      <div class="c-choice c-choice--checkbox c-choice--checkbox--small u-mt-xsmall">
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
                              <div class="task-data-wrapper u-mb-small">
                                <div class="u-mb-small">
                                  <div class="u-mb-xsmall task-option-item-group">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Ответственный:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input u-mr-small">
                                        <tagsUsers :selected="e_activeTask.responsibleUser" :allowUserTypes="['admin', 'coworker']" :showClose="false"></tagsUsers>
                                      </div>
                                      <div class="edit-task-post-tag u-text-dark-hover u-mr-small trigger" @click="toggleEl('edit-task-accepting')"><span>Принимающий</span></div>
                                      <div class="edit-task-post-tag u-text-dark-hover trigger u-mr-small" @click="toggleEl('edit-task-initiator')"><span>Инициировавший</span></div>
                                      <div class="edit-task-post-tag u-text-dark-hover trigger u-mr-small" @click="toggleEl('edit-task-coperformers')"><span>Соисполнители</span></div>
                                      <div class="edit-task-post-tag u-text-dark-hover trigger" @click="toggleEl('edit-task-observers')"><span>Наблюдатели</span></div>
                                    </div>
                                  </div>

                                  <div class="u-mb-xsmall task-option-item-group" id="edit-task-accepting" style="display: none;">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Принимающий:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input u-mr-small">
                                        <tagsUsers :selected="e_activeTask.acceptingUser" :allowUserTypes="['admin', 'coworker']" :showClose="false"></tagsUsers>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="u-mb-xsmall task-option-item-group" id="edit-task-initiator" style="display: none;">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Инициировавший:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input">
                                        <tagsUsers :selected="e_activeTask.initiatorUser" :allowUserTypes="['admin', 'coworker']" :showClose="false"></tagsUsers>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="u-mb-xsmall task-option-item-group" id="edit-task-coperformers" style="display: none;">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Соисполнители:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input">
                                        <tagsUsers :selected="e_activeTask.performers_list" :allowUserTypes="['admin', 'coworker']" :multiple="true" placeholderVal="Не выбраны"></tagsUsers>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="u-mb-xsmall task-option-item-group" id="edit-task-observers" style="display: none;">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Наблюдатели:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input">
                                        <tagsUsers :selected="e_activeTask.observers_list" :allowUserTypes="['admin', 'coworker']" :multiple="true" placeholderVal="Не выбраны"></tagsUsers>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="u-mb-small">
                                  <div class="u-mb-xsmall task-option-item-group">
                                    <div class="task-options-item-param">
                                      <label class="c-field__label u-text-right">Крайний срок:</label>
                                    </div>
                                    <div class="task-options-item-val">
                                      <div class="task-d-input u-mr-small">
                                        <dateTimePicker v-model="e_activeTask.deadline"  />
                                      </div>
                                      <div class="edit-task-post-tag u-text-dark-hover u-mr-small trigger" @click="toggleEl('edit-task-planning-time')"><span>Планирование сроков</span></div>
                                    </div>
                                  </div>
                                  <div class="u-mb-xsmall task-option-item-group" id="edit-task-planning-time" style="display: none;">
                                    <div class="u-mb-small task-option-item-group">
                                      <div class="task-options-item-param">
                                        <label class="c-field__label u-text-right">Дата начала:</label>
                                      </div>
                                      <div class="task-options-item-val">
                                        <div class="task-d-input u-mr-small">
                                          <dateTimePicker v-model="e_activeTask.start_date"></dateTimePicker>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="task-data-wrapper-outer" id="edit-task-additional-outer">
                                <div class="task-data-wrapper-title u-text-dark u-p-small trigger" @click="toggleEditTaskAdditional()"><i class="fa fa-angle-down u-mr-xsmall"></i>Дополнительно (проект, подзадача, теги, поля)</div>
                                <div class="task-data-wrapper task-data-wrapper-inner-toggle" id="tasks-additional-data">
                                  всякая шляпа
                                </div>
                              </div>

                              <div class="u-mb-small" v-show="false">
                                <div>
                                  <label class="c-field__label u-text-bold u-text-subdefault u-text-dark">Теги:</label>
                                </div>
                                <div>
                                  <vue-tags-input
                                    v-model="activeTag"
                                    :tags="taskTagsArr"
                                    placeholder="Добавить тег"
                                    :autocomplete-items="filteredBaseTaskTags"
                                    @tags-changed="taskTagChangeHandler"
                                  />
                                </div>
                              </div>
                              <div class="u-mb-small" v-show="false">
                                <div>
                                  <label class="c-field__label u-text-bold u-text-subdefalt u-text-dark">Проект:</label>
                                </div>
                                <div>
                                  <div class="c-input c-input-abs u-text-left trigger u-relative u-p-zero">
                                    <div class="u-relative" v-if="e_activeTask.project.project_id">
                                      <span class="vdp-datepicker__clear-button ver2" @click="e_activeTask.project = this.getClearProject(); e_activeTask.project_id = 0;"><i><span>×</span></i></span>
                                    </div>
                                    <div class="u-p-input dtp-toggler">
                                      <div :class="'u-p-input-inner '+(e_activeTask.project.project_id ? '' : 'u-text-soft')" v-html="e_activeTask.project.project_id ? e_activeTask.project.title : 'Выберите проект'" @click="selectRelatedProject()" ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> <!-- end edit task data -->
                </transition>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <modalUsers :allowUserTypes="modalUsersData.allowUserTypes" :multipleSelectTitle="modalUsersData.multipleSelectTitle" :multiple="modalUsersData.multiple" :except="modalUsersData.except" :title="modalUsersData.title" :select="modalUsersData.select" :force="modalUsersData.force" ></modalUsers>
  </div>


</template>
<script>
  const pageData = { title: 'Мои задачи', metaTitle: 'Мои задачи', headerClass: '', style: 'page-w-header' };
  const searchBlockIndexes = ['tasks-add', 'tasks-task', 'task-edit'];
  const editTaskModes = ['tasks-add', 'tasks-task', 'task-edit'];
  const headerHeight = 70;
  import Datepicker from 'vuejs-datepicker';
  import modalUsers from '@/components/users/modalUsers.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import Component from '@/components/Component.vue';
  import relatedUserComponent from '@/components/relatedUserComponent.vue';
  import kanbanComponent from '@/components/kanbanComponent.vue';
  import tasksListComponent from '@/components/tasksListComponent.vue';
  import nselect2 from '@/components/elements/nselect2.vue';
  import dateTimePicker from '@/components/elements/dateTimePicker.vue';
  import singleRelatedUserComponent from '@/components/singleRelatedUserComponent.vue';
  import VueTagsInput from '@johmun/vue-tags-input/vue-tags-input/vue-tags-input.vue';
  import moment from 'moment';
  import tagsUsers from '@/components/tagsUsers.vue';
  import Inputmask from 'inputmask';
  export default {
    props: [],
    mixins: [Component, commonMixin],
    data() {
      return {
        pageData,
        modifyingProcess: 0,
        tasksLoading: 0,
        taskEditorToolbar: false,
        tasksCompleting: 0,
        tasksMassAction: '',
        routeChanges: 0,
        activeTag: '',
        newCheckListItemTitle: '',
        disabledDates: {
          to: null
        },
        tasksMassActions: {
          taskActionComplete: {
            title: 'Завершить',
            fn: 'taskActionComplete'
          },
          taskActionChangeDeadline: {
            title: 'Изменить крайний срок',
            fn: 'taskActionChangeDeadline',
            tmaTime: true,
            tmaTimeDescription: 'Выберите крайник срок:'
          },
          taskActionChangeResponsible: {
            title: 'Изменить ответственного',
            fn: 'taskActionChangeResponsible',
            tmaUser: 'Ответственный:',
            tmaUserDesc: 'Выберите ответственного',
            select: 'taskActionChangeResponsible'
          },
          taskActionChangeInitiator: {
            title: 'Изменить инициатора',
            fn: 'taskActionChangeInitiator',
            tmaUser: 'Инициатор:',
            tmaUserDesc: 'Выберите инициатора',
            select: 'taskActionChangeInitiator',
          },
          taskActionAddObserver: {
            title: 'Добавить наблюдателя',
            fn: 'taskActionAddObserver',
            tmaUser: 'Наблюдатель:',
            tmaUserDesc: 'Выберите наблюдателя',
            select: 'taskActionAddObserver'
          },
          taskActionAddCoperformer: {
            title: 'Добавить соисполнителя',
            fn: 'taskActionAddCoperformer',
            tmaUser: 'Соисполнитель:',
            tmaUserDesc: 'Выберите соисполнителя',
            select: 'taskActionAddCoperformer'
          },
          taskActionBookmark: {
            title: 'Добавить в избранное',
            fn: 'taskActionBookmark'
          },
          taskActionRemoveBookmark: {
            title: 'Убрать из избранного',
            fn: 'taskActionRemoveBookmark'
          },
          taskActionSetProject: {
            title: 'Указать проект',
            fn: 'taskActionSetProject',
            tmaProject: true
          },
          taskActionDelete: {
            title: 'Удалить',
            fn: 'taskActionDelete'
          },
        },
        activeTabLink: {
          active: false,
          title: '',
          link: ''
        },
        modalUsersData: {
          allowUserTypes: [],
          title: '',
          select: '',
          force: 0,
          multipleSelectTitle: 'Назначить выбранных',
          multiple: false,
          except: []
        },
        activeTaskTime: true,
        activeTask: this.getClearTask(),
        e_activeTask: this.getClearTask(),
        activeProject: this.getClearProject(),
        e_activeProject: this.getClearProject(),
        selectedTmaUser: this.getClearUser(),
        selectedTmaTime: '',
        taskTabs: {
          all: { title: 'Все' },
          in_progress: { title: 'Делаю' },
          helping: { title: 'Помогаю' },
          instucted: { title: 'Поручил' },
          observing: { title: 'Наблюдаю' }
        },
        tasks: {
          total: 0,
          list: []
        },
        projects: {
          total: 0,
          list: 0
        },
        activeView: 'tasks-all',
        tasksData: {
          q: '',
          p: 1,
          state: '',
          mode: 'list',
          ordering: 'asc',
          important: false,
          completed: false,
          late: false,
          cols: []
        },
        baseTaskTags: [{ text: 'маркетинг' }, { text: 'производство' }, { text: 'кадры' }, { text: 'продажи' }],
        taskTagsArr: [],
      };
    },
    computed: {
      filteredBaseTaskTags() {
        return this.baseTaskTags.filter((el) => {
          return (this.activeTag && this.activeTag.length) ? (el.text.toLowerCase().indexOf(this.activeTag.toLowerCase()) !== -1) : true;
        });
      },
      checkedTasksLength() {
        if(this.isInProjects) { return 0; }
        for(let i = 0; i < this.tasks.list.length; i++) {
          if(this.tasks.list[i].checked) { return 1; }
        }
        return 0;
      },
      hasItems() {
        return (this.isInProjects ? this.projects.total : this.tasks.total);
      },
      isInProjects() {
        return (this.activeView && this.activeView.indexOf('project') !== -1);
      },
      displaySearch() {
        if(this.tasksData.mode !== 'list') { return 0; }
        if(searchBlockIndexes.indexOf(this.activeView) !== -1) { return 0; }
        return 1;
      },
      displayModifyBtn() {
        if(editTaskModes.indexOf(this.activeView) === -1) { return 0; }
        if(this.activeView === 'tasks-task'){ return 0; }
        return 1;
      },
      displayDisplayModes() {
        if(this.displayModifyBtn) { return 0; }
        return 1;
      },
    },
    watch: {
      modifyingProcess(v) {
        this.$store.commit('loading', v ? 'сохранение' : false);
      },
      'tasksData.mode'(v) {
        if(v === 'kanban') {
          this.checkAllTasks(false);
        }
      },
      'e_activeTask.responsibleUser.user_id'() {
        this.e_activeTask.responsible_id = this.e_activeTask.responsibleUser.user_id;
      },
      'e_activeTask.initiatorUser.user_id'() {
        this.e_activeTask.initiator_id = this.e_activeTask.initiatorUser.user_id;
      },
      'e_activeTask.acceptingUser.user_id'() {
        this.e_activeTask.accepting_id = this.e_activeTask.acceptingUser.user_id;
      },
      $route(v) {
        this.activeView = this.$route.name;
        this.recalculateView();
        this.routeChanges++;
      },
      checkedTasksLength(v) {
        if(this.tmaClearTimeout) { clearTimeout(this.tmaClearTimeout); }
        if(v) {
          this.$fws.addClass('show');
        } else {
          this.$fws.removeClass('show');
          this.tmaClearTimeout = setTimeout(() => {
            this.tasksMassAction = null;
            this.selectedTmaTime = null;
            this.clearTmaUser();
          }, 250);

        }
      },
    },
    mounted() {
      this.addEvents();
      this.$tp = $('#tasks-page');
      this.$fws = $('#fixed-actions-with-selected');
    },
    async created() {
      this.addEvents();
      this.activeView = this.$route.name;
      this.recalculateView();
      this.$on('dropRelatedUser', (o) => {
        this.e_activeTask[o.list].splice(o.index, 1);
      });
      this.$on('selectResponsibleTaskUser', (user) => {
        this.e_activeTask.responsibleUser = user;
      });
      this.$on('selectInitiatorTaskUser', (user) => {
        this.e_activeTask.initiatorUser = user;
      });
      this.$on('selectAcceptingTaskUser', (user) => {
        this.e_activeTask.acceptingUser = user;
      });
      this.$on('taskActionChangeResponsible', (user) => {
        this.selectedTmaUser = user;
      });
      this.$on('taskActionChangeInitiator', (user) => {
        this.selectedTmaUser = user;
      });
      this.$on('taskActionAddObserver', (user) => {
        this.selectedTmaUser = user;
      });
      this.$on('taskActionAddCoperformer', (user) => {
        this.selectedTmaUser = user;
      });
      this.$store.dispatch('setComponentReady', true);
    },
    destroyed() {
      this.dropEvents();
    },
    methods: {
      createActiveTaskChecklistItem() {
        if(!this.newCheckListItemTitle) { return; }
        this.newCheckListItemTitle = this.newCheckListItemTitle.toString().trim();
        if(!this.newCheckListItemTitle) { return; }
        this.e_activeTask.checklist.push({
          title: this.newCheckListItemTitle,
          delimeter: false,
          checked: false,
          edit: false
        });
        this.newCheckListItemTitle = '';
      },
      submitEnter(e, cb) {
        if(e.key !== 'Enter') { return; }
        if(e.shiftKey !== false) { return; }
        cb();
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
      toggleEditTaskAdditional() {
        let $el = $('#edit-task-additional-outer');
        let $el2 = $('#tasks-additional-data');
        if(!$el.hasClass('active')) {
          $el.addClass('active');
          $el2.slideDown(200);
        } else {
          $el.removeClass('active');
          $el2.slideUp(200);
        }
      },
      toggleEl(a) {
        $('#'+a).slideToggle(200);
      },
      dropRelatedUser(index, list) {
        list.splice(index, 1);
      },
      selectRelatedProject() {

      },
      timeMask() {
        let tm = $('.time-mask');
        let im = new Inputmask("99:99");
        for(let i = 0; i < tm.length; i++) {
          im.mask(tm[i]);
        }
      },
      validHours(a) {
        return window.dateFormatter.validHours(a);
      },
      validMinutes(a) {
        return window.dateFormatter.validMinutes(a);
      },
      validTime(a) {
        return window.dateFormatter.validTime(a);
      },
      taskTagChangeHandler(a) {
        let finish = [];
        for(let i = 0; i < a.length; i++) {
          finish.push(a[i].text.toString().trim());
        }
        return this.e_activeTask.tags = finish.join(', ');
      },
      taskActionChangeResponsible() {

      },
      taskActionChangeInitiator() {

      },
      taskActionAddObserver() {

      },
      taskActionAddCoperformer() {

      },
      selectTmaUser() {
        if(!this.tasksMassActions[this.tasksMassAction]) { return; }
        this.modalUsersData.allowUserTypes = ['admin', 'coworker'];
        this.modalUsersData.title = this.tasksMassActions[this.tasksMassAction].tmaUserDesc;
        this.modalUsersData.select = this.tasksMassActions[this.tasksMassAction].select;
        this.modalUsersData.force = Math.random();
        this.modalUsersData.multiple = false;
        this.callUsersModal();
      },
      clearTmaUser() {
        this.selectedTmaUser = this.getClearUser();
      },
      checkAllTasks(v) {
        for(let i = 0; i < this.tasks.list.length; i++) {
          this.tasks.list[i].checked = v;
        }
      },
      prevPage() {
        if(!this.routeChanges) { return; }
        this.$router.go(-1);
        this.routeChanges -= 2;
      },

      renderHeading() {
        if(this.isInProjects) {
          return 'Все проекты';
        }
        if(!this.isInProjects) {
          if(this.activeView === 'tasks-all') { return 'Все задачи'; }
          if(this.activeView === 'tasks-helping') { return 'Задачи, которые помогаю делать'; }
          if(this.activeView === 'tasks-instucted') { return 'Задачи, которые поручил'; }
          if(this.activeView === 'tasks-observing') { return 'Задачи, в которых я наблюдатель'; }
          if(this.activeView === 'tasks-in_progress') { return 'Задачи, которые я выполняю'; }
          if(this.activeView === 'tasks-add') { return 'Создание новой задачи'; }
          if(this.activeView === 'tasks-edit') { return 'Редактирование задачи'; }
          if(this.activeView === 'tasks-task') { return 'Задача'; }
          return 'Задачи';
        }
      },
      getFilteredTasksLink() {
        return '/tasks';
      },
      getFilteredProjectsLink() {
        return '/tasks/projects';
      },
      isCorrectActiveTaskDates() {
        return 0;
      },
      async getTasks(defarg, opts = {}) {
        if(this.tasksLoading || this.tasksCompleting) { return; }
        this.tasksLoading = !defarg;
        this.tasksCompleting = defarg;
        const resp = await axios.post('/tasks/get', this.tasksData);
        if(resp.data) {
          if(resp.data.result) {

          } else {
            this.$msg.error(resp.data.display);
          }
        }
        this.tasksLoading = 0;
        this.tasksCompleting = 0;
      },
      pushRelatedTaskUser(user, list) {
        if(user.user_id === this.e_activeTask.responsible_id) { return; }
        for(let i = 0; i < list.length; i++) {
          if(list[i].user_id == user.user_id) { return; }
        }
        list.push(user);
      },
      addCoperformer() {
        this.modalUsersData.title = 'Выберите соисполнителя';
        this.modalUsersData.select = 'selectCoperformerTaskUser';
        this.modalUsersData.except = [this.e_activeTask.responsible_id];
        this.modalUsersData.multiple = true;
        this.selectResponsibleTrigger();
      },
      addObserver() {
        this.modalUsersData.title = 'Выберите наблюдателя ';
        this.modalUsersData.select = 'selectObserverTaskUser';
        this.modalUsersData.except = [this.e_activeTask.responsible_id];
        this.modalUsersData.multiple = true;
        this.selectResponsibleTrigger();
      },
      selectResponsibleUserForActiveTask() {
        this.modalUsersData.title = 'Выберите ответственного сотрудника';
        this.modalUsersData.select = 'selectResponsibleTaskUser';
        this.modalUsersData.except = [];
        this.modalUsersData.multiple = false;
        this.selectResponsibleTrigger();
      },
      selectInitiatorUserForActiveTask() {
        this.modalUsersData.except = [];
        this.modalUsersData.title = 'Выберите сотрудника, который инициировал задачу';
        this.modalUsersData.select = 'selectInitiatorTaskUser';
        this.modalUsersData.multiple = false;
        this.selectResponsibleTrigger();
      },
      selectResponsibleTrigger() {
        this.modalUsersData.allowUserTypes = ['coworker', 'admin'];
        this.modalUsersData.force = Math.random();
        this.callUsersModal();
      },
      selectAcceptingUserForActiveTask() {
        this.modalUsersData.title = 'Выберите сотрудника, который принимает задачу';
        this.modalUsersData.select = 'selectAcceptingTaskUser';
        this.modalUsersData.multiple = false;
        this.selectResponsibleTrigger();
      },
      callUsersModal() {
        $('#usersModal').modal('show');
      },
      getClearTask() {
        return {
          task_id: 0,
          title: '',
          created_by: 0,
          created_at: '',
          finished_at: '',
          start_date: '',
          tags: '',
          description: '',
          deadline: '',
          tsvector_data: '',
          responsible_id: '',
          initiator_id: '',
          accepting_id: '',
          time: '',
          late_fine: '',
          bounty: '',
          is_important: false,
          project_id: 0,
          responsibleUser: this.getClearUser(),
          initiatorUser: this.getClearUser(),
          acceptingUser: this.getClearUser(),
          project: this.getClearProject(),
          checklist: [],
          files: [],
          observers_list: [],
          performers_list: []
        };
      },
      getClearProject() {
        return {
          project_id: 0,
          title: '',
          created_by: 0,
          created_at: '',
          finished_at: '',
          start_date: '',
          tags: '',
          description: '',
        };
      },
      getClearUser() {
        return {
          user_id: 0,
          profession_id: 0,
          username: '',
          first_name: '',
          last_name: '',
          third_name: '',
        };
      },
      addEvents() {
        window.addEventListener('keydown', this.keypressSave);
      },
      dropEvents() {
        window.removeEventListener('keydown', this.keypressSave);
      },
      async keypressSave(e) {
        if(!e.ctrlKey && !e.metaKey){ return; }
        if((e.key === 's' || e.key === 'ы')) {
          e.preventDefault(); //Good browsers
          await this.modify();
        }
      },
      async modify() {
        if(this.activeView.indexOf('-add') === -1 && this.activeView.indexOf('-edit') === -1) { return; }
        if(this.activeView === 'tasks-add' || this.activeView === 'tasks-edit') {
          await this.modifyTask();
          return;
        }
        // todo if view
      },
      collectTaskData() {
        let a = {
          title: this.e_activeTask.title,
          description: this.e_activeTask.description,
          start_date: this.activeTaskTime ? null : this.e_activeTask.start_date,
          start_date_time: (this.e_activeTask.start_date && this.e_activeTask.start_date.wTime),
          deadline_date_time:  (this.e_activeTask.deadline && this.e_activeTask.deadline.wTime),
          deadline: this.activeTaskTime ? null : this.e_activeTask.deadline,
          tags: this.e_activeTask.tags,
          responsible_id: this.e_activeTask.responsible_id,
          initiator_id: this.e_activeTask.initiator_id,
          accepting_id: this.e_activeTask.accepting_id,
          late_fine: this.e_activeTask.late_fine,
          time: this.activeTaskTime ? this.e_activeTask.time : null,
          project_id: this.e_activeTask.project_id,
          observers_ids: this.e_activeTask.observers_list.map(a => a.user_id),
          performers_ids: this.e_activeTask.performers_list.map(a => a.user_id),
        };
        return a;
      },
      async modifyProject() {

      },
      async modifyTask() {
        if(this.modifyingProcess) { return 0; }
        this.modifyingProcess = 1;
        const resp = await axios.post('/tasks/modify-task', this.collectTaskData());
        if(resp.data) {
          if(resp.data.result) {
            this.$msg.success(resp.data.display);
          } else {
            if(this.errorTimeout) { clearTimeout(this.errorTimeout); }
            this.errorTimeout = setTimeout(() => {
              this.$dialog.fns.error({
                title: 'Ошибка',
                text: resp.data.display
              });
            }, 300);
          }
        }
        this.modifyingProcess = 0;
        return 1;
      },
      recalculateView() {
        this.tasksData.q = '';
        this.disabledDates = {
          to: new Date(moment().subtract(1, 'days')),
        };
        if(editTaskModes.indexOf(this.activeView) !== -1) {
          this.tasks.list = [];
          // calculate task
          // await this.getTaskById();
          if(!this.activeTask.task_id) {
            this.e_activeTask.start_date = new Date();
            let deadline = new Date(this.e_activeTask.start_date.getTime()+(60*60*24*1000));
            deadline.setMinutes(parseInt(this.$store.state.workDayMaxMinutes));
            deadline.setHours(parseInt(this.$store.state.workDayMaxHours));
            this.e_activeTask.deadline = deadline;
            this.e_activeTask.responsibleUser = JSON.parse(JSON.stringify(this.$store.state.user));
            this.e_activeTask.initiatorUser = JSON.parse(JSON.stringify(this.$store.state.user));
            this.e_activeTask.acceptingUser = JSON.parse(JSON.stringify(this.$store.state.user));
          }
        } else {

        }
      },
      link(a) {
        if(!a || a === 'all'){ return '/tasks'; }
        return '/tasks?mode='+a;
      }
    },
    components: {
      Datepicker, modalUsers, relatedUserComponent, tasksListComponent, kanbanComponent, nselect2, dateTimePicker,
      singleRelatedUserComponent, VueTagsInput, tagsUsers
    }
  }
</script>
