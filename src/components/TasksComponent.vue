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
              <h3 class="c-toolbar__title" v-html="renderHeading()"></h3>
                <h5 class="c-toolbar__meta u-mr-auto u-invisible"></h5>
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
                <router-link :to="makeTaskLink({ task_id: null })">
                  <button class="c-btn c-btn--success"><i class="fa fa-plus u-mr-xsmall"></i><span v-html="isInProjects ? 'Создать проект' : 'Создать задачу'"></span></button>
                </router-link>
              </div>
              <div v-if="displayModifyBtn">
                  <button class="c-btn c-btn--success" @click="isInProjects ? modifyProject() : modifyTask()"><i class="fa fa-check u-mr-xsmall"></i><span v-html="isInProjects ? 'Сохранить проект' : 'Сохранить задачу'"></span></button>
              </div>
              </div>
              </div>
              <div class="c-toolbar-row-2">
                <div id="fixed-actions-with-selected" :class="checkedTasksLength ? 'show' : ''" >
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
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListAll" :key="'tasks-all'" v-if="activeView === 'tasks-all' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListIP" :key="'tasks-in_progress'" v-if="activeView === 'tasks-in_progress' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListHE" :key="'tasks-helping'" v-if="activeView === 'tasks-helping' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListIN" :key="'tasks-instucted'" v-if="activeView === 'tasks-instucted' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListOB" :key="'tasks-observing'" v-if="activeView === 'tasks-observing' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <tasksListComponent :tasksMassActions="tasksMassActions" ref="tasksListAC" :key="'tasks-accepting'" v-if="activeView === 'tasks-accepting' && tasksData.mode === 'list'" :tasks="tasks" :tasksData="tasksData"></tasksListComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-all'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-in_progress'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-helping'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-instucted'"></kanbanComponent>
                  <kanbanComponent :tasksData="tasksData" :tasks="tasks" :key="'tasks-kanban-all'" v-if="tasksData.mode === 'kanban' && activeView === 'tasks-observing'"></kanbanComponent>
                </transition>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <taskComponent :show="modalMode === 'task'"  :task="activeTask" :modifyTask="modifyTask" :e_task="e_activeTask" ref="taskComponent"></taskComponent>
    <modalUsers :allowUserTypes="modalUsersData.allowUserTypes" :multipleSelectTitle="modalUsersData.multipleSelectTitle" :multiple="modalUsersData.multiple" :except="modalUsersData.except" :title="modalUsersData.title" :select="modalUsersData.select" :force="modalUsersData.force" ></modalUsers>
  </div>


</template>
<script>
  const pageData = { title: 'Мои задачи', metaTitle: 'Мои задачи', headerClass: '', style: 'page-w-header' };
  const searchBlockIndexes = ['tasks-add', 'tasks-task', 'task-edit'];
  const editTaskModes = ['tasks-add', 'tasks-task', 'task-edit'];
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
  import moment from 'moment';
  import tagsUsers from '@/components/tagsUsers.vue';
  import taskComponent from '@/components/taskComponent.vue';
  import Inputmask from 'inputmask';
  import tasksMixin from '@/mixins/tasksMixin.vue';
  export default {
    props: [],
    mixins: [Component, commonMixin, tasksMixin],
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
        prevPath: '',
        modalMode: null,
        modalId: '',
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
        tasksData: this.getClearTasksData(),
      };
    },
    computed: {
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
      'activeTask.task_id'() {
        let task = JSON.parse(JSON.stringify(this.activeTask));
        task.start_date = new Date(task.start_date);
        task.deadline = new Date(task.deadline);
        this.e_activeTask = task;
      },
      modifyingProcess(v) {
        this.$store.commit('loading', v ? 'сохранение' : false);
      },
      'tasksData.mode'(v) {
        if(v === 'kanban') {
          this.checkAllTasks(false);
        }
      },
      'tasksData.ordering'(v) {
        this.tasksData.p = 1;
        this.getTasks();
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
        } else {
          this.tmaClearTimeout = setTimeout(() => {
            this.tasksMassAction = null;
            this.selectedTmaTime = null;
            this.clearTmaUser();
          }, 250);
        }
      },
    },
    mounted() {
      this.$store.dispatch('setComponentReady', true);
      this.addEvents();
      this.activeView = this.$route.name;
      setTimeout(() => {
        this.recalculateView();
      }, 750);

    },
    async created() {
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

    },
    destroyed() {
      this.dropEvents();
    },
    methods: {
      getClearTasksData() {
        return {
          q: '',
          p: 1,
          state: '',
          mode: 'list',
          ordering: 'asc',
          important: false,
          completed: false,
          late: false,
          cols: []
        };
      },
      callModifyModal() {
        if(this.isInProjects) {
          this.callProjectModal();
        } else {
          this.callTaskModal();
        }
      },
      callTaskModal() {
        this.modalMode = 'task';
      },
      callProjectModal() {

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
      clearCheckAll() {
        for(let prop in this.$refs) {
          if(prop.indexOf('tasksList') !== -1) {
            this.$refs[prop].checkAll = false;
          }
        }
      },
      async getTasks(defarg, opts = {}) {
        if(this.tasksLoading || this.tasksCompleting) { return; }
        this.tasksLoading = !defarg;
        this.tasksCompleting = defarg;
        let tasksData = Object.assign({}, this.tasksData);
        const resp = await $http.post('/tasks/get', tasksData);
        if(resp) {
          if(resp.result) {
            if(this.tasksLoading) {
              this.tasks.list = [];
              this.tasks.total = 0;
              this.clearCheckAll();
            }
            let tasks = [];
            if(resp.list) {
              for(let i = 0; i < resp.list.length; i++) {
                resp.list[i].checked = false;
                tasks.push(resp.list[i]);
              }
              this.tasks.list = this.tasks.list.concat(tasks);
              this.tasks.total = resp.total;
            } else {
              if(!this.tasksCompleting) {
                this.tasks.total = 0;
              }
            }
            this.tasksLoading = false;
            this.tasksCompleting = false;
          } else {
            this.$msg.error(resp.display);
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
        let deadline = new Date((new Date).getTime()+(60*60*24*1000));
        deadline.setMinutes(parseInt(this.$store.state.workDayMaxMinutes));
        deadline.setHours(parseInt(this.$store.state.workDayMaxHours));
        let u = Object.assign({}, this.$store.state.user);
        console.log(u);
        let u2 = Object.assign({}, this.$store.state.user);
        let u3 = Object.assign({}, this.$store.state.user);
        return {
          task_id: 0,
          title: '',
          created_by: 0,
          created_at: '',
          finished_at: '',
          start_date: new Date(),
          description: '',
          deadline: deadline,
          responsible_id: this.$store.state.user.user_id,
          initiator_id: this.$store.state.user.user_id,
          accepting_id: this.$store.state.user.user_id,
          is_important: false,
          is_favourite: false,
          project_id: 0,
          responsibleUser: u,
          initiatorUser: u2,
          acceptingUser: u3,
          project: this.getClearProject(),
          target: '',
          tags: [],
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
          tags: [],
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
        if(this.modalMode === 'task' || this.modalMode === 'project') {
          await this.modifyTask();
          this.$router.push(this.clearLinkMode());
          return;
        }
        // todo if view
      },
      collectTaskData() {
        let a = {
          task_id: this.e_activeTask.task_id,
          title: this.e_activeTask.title,
          description: this.e_activeTask.description,
          start_date: this.e_activeTask.start_date,
          deadline: this.e_activeTask.deadline,
          tags: this.e_activeTask.tags,
          responsible_id: this.e_activeTask.responsible_id,
          initiator_id: this.e_activeTask.initiator_id,
          accepting_id: this.e_activeTask.accepting_id,
          target: this.e_activeTask.target,
          checklist: this.e_activeTask.checklist,
          project_id: this.e_activeTask.project_id,
          is_important: this.e_activeTask.is_important,
          is_favourite: this.e_activeTask.is_favourite,
          observers_ids: this.e_activeTask.observers_list.map(a => a.user_id),
          performers_ids: this.e_activeTask.performers_list.map(a => a.user_id),
          document_ids: this.e_activeTask.files.map(a => a.document_id),
        };
        return a;
      },
      async modifyProject() {

      },
      async modifyTask() {
        if(this.modifyingProcess) { return 0; }
        this.modifyingProcess = 1;
        const resp = await $http.post('/tasks/modify-task', this.collectTaskData());
        if(resp) {
          if(resp.result) {

          } else {
            if(this.errorTimeout) { clearTimeout(this.errorTimeout); }
            this.errorTimeout = setTimeout(() => {
              this.$dialog.fns.error({
                title: 'Ошибка',
                text: resp.display
              });
            }, 300);
          }
        }
        this.modifyingProcess = 0;
        return 1;
      },
      async getTask() {
        const resp = await $http.post('/get-task', { task_id: this.$route.query.item_id });
        if(resp) {
          if(resp.task) {
            return resp.task;
          }
        }
        return this.getClearTask();
      },
      async recalculateMode() {
        if(!this.$route.query.mode) {
          this.closeModifyModal();
          return;
        }
        if(this.$route.query.mode === 'task') {
          let taskId = window.toInt(this.$route.query.item_id);
          let task = taskId ? await this.getTask() : this.getClearTask();
          if(!task.task_id) {
            task.start_date = new Date(task.start_date);
            task.deadline = new Date(task.deadline);
            this.disabledDates = {
              to: new Date(moment().subtract(1, 'days')),
            };
          }
          this.activeTask = task;
          this.callModifyModal();
          return;
        }
        this.closeModifyModal();
      },
      closeModifyModal() {
        this.modalMode = null;
      },
      calculateRequiredActions() {
        let result = {
          clearTaskData: false,
          getTasks: false,
          closeModal: false,
        };
        this.prevPath = this.$route.path;

        return result;
      },
      async recalculateView() {
        let actions = this.calculateRequiredActions();
        if(actions.clearTaskData) {

        }
        await this.getTasks();
        this.recalculateMode();
      },
      link(a) {
        if(!a || a === 'all'){ return '/tasks'; }
        return '/tasks?mode='+a;
      }
    },
    components: {
      Datepicker, modalUsers, relatedUserComponent, tasksListComponent, kanbanComponent, nselect2, dateTimePicker,
      singleRelatedUserComponent, tagsUsers, taskComponent
    }
  }
</script>
