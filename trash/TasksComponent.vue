<template>
  <div>
    <div class="tasks-page">

      <div class="container-fluid">
        <div class="tasks-container">
          <div class="tasks-left" id="global-tasks-left">
            <div class="tasks-body">

            </div>
          </div>
          <div class="tasks-right" id="global-tasks-right">
            <transition name="slide-fade" mode="out-in">
            <div class="tasks-header" v-if="!displayModifyTaskBtn">
              <div class="tasks-header-inner">
                  <div >
                    <div class="tasks-header-left" >
                      <i :class="'fa fa-navicon u-mr-xsmall '+(tasksData.mode === 'list' ? 'active' : '')" @click="tasksData.mode = 'list'"></i>
                      <i :class="'fa fa-th-large  top@0@5 ' + (tasksData.mode === 'kanban' ? 'active' : '')" @click="tasksData.mode = 'kanban'"></i>
                    </div>
                  </div>
                  <div class="tasks-header-search"  :key="'search-wrapper'">
                    <div class="search-input-wrapper">
                      <input type="text" class="c-input" v-model="tasksData.q" placeholder="Поиск по задачам..." />
                      <i class="fa fa-search"></i>
                    </div>
                  </div>
              </div>
            </div>
            </transition>
            <div class="tasks-body">
              <transition name="slide-fade" mode="out-in">
                <tasksListComponent :key="'tasks-all'" v-if="activeView === 'tasks-all'" :tasks="tasks"></tasksListComponent>
                <tasksListComponent :key="'tasks-in_progress'" v-if="activeView === 'tasks-in_progress'" :tasks="tasks"></tasksListComponent>
                <tasksListComponent :key="'tasks-helping'" v-if="activeView === 'tasks-helping'" :tasks="tasks"></tasksListComponent>
                <tasksListComponent :key="'tasks-instucted'" v-if="activeView === 'tasks-instucted'" :tasks="tasks"></tasksListComponent>
                <tasksListComponent :key="'tasks-observing'" v-if="activeView === 'tasks-observing'" :tasks="tasks"></tasksListComponent>

              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modalUsers :allowUserTypes="modalUsersData.allowUserTypes" :title="modalUsersData.title" :select="modalUsersData.select" :force="modalUsersData.force" ></modalUsers>
  </div>


</template>
<script>
  const pageData = { title: 'Задачи', metaTitle: 'Задачи', headerClass: 'u-mb-medium' };
  const searchBlockIndexes = ['tasks-add', 'tasks-task'];
  const editTaskModes = ['tasks-add', 'tasks-task'];
  import Datepicker from 'vuejs-datepicker';
  import modalUsers from '@/components/users/modalUsers.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import Component from '@/components/Component.vue';
  import relatedUserComponent from '@/components/relatedUserComponent.vue';
  import tasksListComponent from '@/components/tasksListComponent.vue';
  export default {
    props: [],
    mixins: [Component, commonMixin],
    data() {
      return {
        pageData,
        modifyingProcess: 0,
        tasksLoading: 0,
        tasksCompleting: 0,
        activeTabLink: {
          active: false,
          title: '',
          link: ''
        },
        modalUsersData: {
          allowUserTypes: [],
          title: '',
          select: '',
          force: 0
        },
        activeTask: this.getClearTask(),
        e_activeTask: this.getClearTask(),
        taskTabs: {
          all: { title: 'Все' },
          in_progress: { title: 'Делаю' },
          helping: { title: 'Помогаю' },
          instucted: { title: 'Поручил' },
          observing: { title: 'Наблюдаю' }
        },
        tasks: [
        ],
        activeView: 'tasks-all',
        tasksData: {
          q: '',
          p: 1,
          state: '',
          mode: 'list',
          important: false,
          completed: false,
          late: false
        },
      };
    },
    computed: {
      displaySearch() {
        if(this.tasksData.mode !== 'list') { return 0; }
        if(searchBlockIndexes.indexOf(this.activeView) !== -1) { return 0; }
        return 1;
      },
      displayModifyTaskBtn() {
        if(editTaskModes.indexOf(this.activeView) === -1) { return 0; }
        if(this.activeView === 'tasks-task'){ return 0; }
        return 1;
      }
    },
    watch: {
      $route(v) {
        this.activeView = this.$route.name;
        this.recalculateView();
      }
    },
    async created() {
      this.activeView = this.$route.name;
      this.addEvents();
      this.recalculateView();
      this.$on('selectResponsibleTaskUser', (user) => {
        this.e_activeTask.responsibleUser = user;
        this.e_activeTask.responsible_id = user.user_id;
      });
      this.$on('selectObserverTaskUser', (user) => {
        this.pushRelatedTaskUser(user, this.e_activeTask.observers_list);
      });
      this.$on('selectCoperformerTaskUser', (user) => {
        this.pushRelatedTaskUser(user, this.e_activeTask.performers_list);
      });
      this.$store.dispatch('setComponentReady', true);
    },
    destroyed() {
      this.dropEvents();
    },
    methods: {

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
        for(let i = 0; i < list.length; i++) {
          if(list[i].user_id == user.user_id) { return; }
        }
        list.push(user);
      },
      addCoperformer() {
        this.modalUsersData.allowUserTypes = ['coworker', 'admin'];
        this.modalUsersData.title = 'Выберите соисполнителя';
        this.modalUsersData.select = 'selectCoperformerTaskUser';
        this.modalUsersData.force = Math.random();
        this.callUsersModal();
      },
      addObserver() {
        this.modalUsersData.allowUserTypes = ['coworker', 'admin'];
        this.modalUsersData.title = 'Выберите наблюдателя ';
        this.modalUsersData.select = 'selectObserverTaskUser';
        this.modalUsersData.force = Math.random();
        this.callUsersModal();
      },
      selectResponsibleUserForActiveTask() {
        this.modalUsersData.allowUserTypes = ['coworker', 'admin'];
        this.modalUsersData.title = 'Выберите ответственного сотрудника';
        this.modalUsersData.select = 'selectResponsibleTaskUser';
        this.modalUsersData.force = Math.random();
        this.callUsersModal();
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
          responsibleUser: this.getClearUser(),
          observers_list: [],
          performers_list: []
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
        window.addEventListener('resize', this.recalculateSizeTimeout);
      },
      dropEvents() {
        window.removeEventListener('resize', this.recalculateSizeTimeout);
      },
      recalculateSizeTimeout() {
        if(this.recalculateSizeTimeoutSubst) { clearTimeout(this.recalculateSizeTimeoutSubst); }
        this.recalculateSizeTimeoutSubst = setTimeout(this.recalculateSideSize, 400);
      },
      recalculateSideSize() {
        return;
        let el = $('#global-tasks-left');
        if(!el.length) { return; }
        let th = el.find('.tasks-header')[0].clientHeight;
        let bh = el.height();
        let nh = bh - th;
        $('#edit-task-left').css({ minHeight: nh+'px' });
      },
      modifyTask() {
        if(this.modifyingProcess) { return 0; }
        this.modifyingProcess = 1;

        this.modifyingProcess = 0;
        return 1;
      },
      recalculateView() {
        this.tasksData.q = '';
        this.recalculateSizeTimeout();
      },
      link(a) {
        if(!a || a === 'all'){ return '/tasks'; }
        return '/tasks?mode='+a;
      }
    },
    components: {
      Datepicker, modalUsers, relatedUserComponent, tasksListComponent
    }
  }
</script>
