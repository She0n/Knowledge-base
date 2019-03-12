<template>
  <div>
    <div class="container-fluid">
      <div class="c-panel u-p-zero u-mb-medium">
        <div v-if="!projectsReady">
          <preloader></preloader>
        </div>
        <div v-else>
          <div class="col-12 col-xl-8 n-col-1">
            <div class="project-list-heading-outer">
              <i class="fa fa-angle-left project-list-left-scroll project-list-scroll" v-if="projectArrowsVisible" v-on:click="scrollHeaderLeft()"></i>
              <i class="fa fa-angle-right project-list-right-scroll project-list-scroll" v-if="projectArrowsVisible" v-on:click="scrollHeaderRight()"></i>
              <div class="project-list-heading-inner">
                <ul role="tablist" id="project-list-ul" class="c-tabs__list nav nav-tabs">
                  <li class="active">
                    <a id="main-project-tab-header" data-toggle="tab" href="#main-project-tab-panel" role="tab"
                       aria-controls="main-task-panel" aria-selected="true" class="c-tabs__link">
                      Основные задачи
                    </a>
                  </li>
                  <li v-for="project in projects">
                    <a :id="project.project_id+'-project-tab-header'" data-toggle="tab" :href="'#'+project.project_id+'-project-tab-panel'"
                       role="tab"
                       :aria-controls="'#'+project.project_id+'-project-tab-panel'" aria-selected="false" class="c-tabs__link">
                      {{project.title}}<span class="drop-task-project" v-on:click="dropTaskProject($event, project)">&times;</span></a>
                  </li>
                </ul>
                <div id="add-project-item">
                  <div class="n-dropdown-wrapper">
                    <button class="n-extra-button-1 n-dropdown-button" v-on:click="toggleProjectDialog()">Новый проект <i
                      class="fa fa-angle-down u-ml-xsmall"></i></button>
                    <div class="n-dropdown-container" :style="newProjectOpen ? 'display: block' : 'display: none;'">
                      <div class="n-extra-dd-field-1">
                        <input type="text" class="c-input" v-model="newProjectName" v-on:keydown="createProjectKeydown($event)"
                               placeholder="Введите название..." maxlength="15"/>
                        <i class="fa fa-check-circle" v-on:click="createProject()"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="c-tabs__content tab-content" id="project-tabs-container">
            <div class="c-tabs__pane active show project-tab" id="main-project-tab-panel" role="tabpanel"
                 aria-labelledby="main-project-tab-header">
              <projectInner :project="mainProject"></projectInner>
            </div>
            <div class="c-tabs__pane project-tab" v-for="project in projects" role="tabpanel" :id="project.project_id+'-project-tab-panel'"
                 :aria-labelledby="project.project_id+'-project-tab-header'">
              <projectInner :project="project"></projectInner>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import preloader from '@/components/elements/preloader.vue';
  import projectInner from '@/components/tasks/projectInner.vue';
  let pageData = {title: 'Задачи', metaTitle: 'Задачи', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    data() {
      return {
        pageData,
        newProjectOpen: 0,
        newProjectName: '',
        projects: [],
        mainProject: {},
        projectArrowsVisible: 0,
        viewPortIndex: 0,
        projectsReady: false,
      };
    },
    async mounted() {
      await this.getTasks();
    },
    computed: {
      projectsByIds() {
        let a = {};
        for(let i = 0; i < this.projects.length; i++) {
          a[this.projects[i].project_id] = this.projects[i];
        }
        return a;
      }
    },
    methods: {
      async dropTaskProject($event, project) {
        $event.stopPropagation();
        this.$dialog.confirm('<div class="dg-header">Подтверждение</div><div class="dg-body">Вы уверены что хотите удалить этот проект?</div>', {
          okText: 'Да',
          cancelText: 'Нет',
          html: true
        })
          .then(() => {
            this.dropTaskProjectAction(project);
          })
          .catch(() => {});
      },
      async dropTaskProjectAction(project) {
        const resp = await axios.post('/tasks/drop-project', { project_id: project.project_id });
        if(resp && resp.data) {
          $('#main-project-tab-header').trigger('click');
          this.extractTasks(resp.data.projects);
        }
      },
      async getTasks() {
        const resp = await axios.get('/tasks/get-tasks');
        if (resp.data) {
          this.extractTasks(resp.data);
          return;
        }
        this.extractTasks(0);
      },
      recalculateHeader() {
        setTimeout(() => {
          let el = document.getElementById('project-list-ul');
          const listWidth = el.clientWidth;
          let li = el.getElementsByTagName('li');
          let itemsLength = 0;
          for(let i = 0; i < li.length; i++) {
            itemsLength += li[i].clientWidth;
          }
          this.projectArrowsVisible = listWidth < itemsLength;
        }, 150);
      },
      getItemsWidth() {
        let el = document.getElementById('project-list-ul');
        let li = el.getElementsByTagName('li');
        let width = 0;
        for(let i = 0; i < li.length; i++) {
          width+= li[i].clientWidth;
        }
        return parseInt(width);
      },
      scrollHeaderRight() {
        let el = document.getElementById('project-list-ul');
        let li = el.getElementsByTagName('li');
        let active = li[this.viewPortIndex];
        const listWidth = this.getItemsWidth();
        const maxOffset = listWidth - parseInt(el.parentElement.clientWidth);
        if(listWidth < maxOffset) { return; }
        let currentOffset = el.style.marginLeft;
        currentOffset = currentOffset ? currentOffset.replace('px', '') : 0;
        const activeWidth = active.clientWidth;
        let newOffset = parseInt(currentOffset)-parseInt(activeWidth);
        if((newOffset*-1) >= maxOffset) {
          newOffset = -maxOffset;
        } else {
          this.viewPortIndex++;
          if(!li[this.viewPortIndex]) { this.viewPortIndex--; }
        }
        el.style.marginLeft = newOffset+'px';
      },
      scrollHeaderLeft() {
        let el = document.getElementById('project-list-ul');
        let li = el.getElementsByTagName('li');
        let active = li[this.viewPortIndex];
        const listWidth = this.getItemsWidth();
        const maxOffset = listWidth - el.parentElement.clientWidth;
        if(listWidth < maxOffset) { return; }
        let currentOffset = el.style.marginLeft;
        currentOffset = currentOffset ? currentOffset.replace('px', '') : 0;
        const activeWidth = active.clientWidth;
        let newOffset = parseInt(currentOffset)+parseInt(activeWidth);
        if((newOffset*-1) <= 0) {
          newOffset = 0;
        } else {

        }
        if(this.viewPortIndex > 0) {
          this.viewPortIndex--;
        }
        el.style.marginLeft = newOffset+'px';
      },
      toggleProjectDialog() {
        this.newProjectOpen = this.newProjectOpen ? 0 : 1;
        if(this.newProjectOpen) {
          document.body.addEventListener('click', this.closeProjectDialog);
        } else {
          document.body.removeEventListener('click', this.closeProjectDialog);
        }
      },
      closeProjectDialog(e) {
        if(e.target.closest('#add-project-item')) { return; }
        this.newProjectOpen = 0;
        document.body.removeEventListener('click', this.closeProjectDialog);
      },
      async createProject() {
        let name = this.newProjectName ? this.newProjectName.trim() : '';
        if (!name.length) {
          return;
        }
        this.newProjectOpen = 0;
        this.newProjectName = '';
        let resp = await axios.post('/tasks/modify-project', {title: name});
        this.extractTasks(resp.data.projects);
        if(resp.data.result) {
          if(resp.data.createdProject) {
            window.toastr.success('Проект `'+name+'` создан');
            setTimeout(() => {
              $('#'+resp.data.createdProject+'-project-tab-header').trigger('click');
            }, 50);
          }
        } else {
          window.toastr.error(resp.data.display);
        }

      },
      extractTasks(tasks) {

        if (!tasks) {
          this.projects = [];
          this.mainProject = tasks.mainProject;
          this.projectsReady = true;
          return;
        }
        if (typeof tasks !== 'object') {
          this.projects = [];
          this.mainProject = tasks.mainProject;
          this.projectsReady = true;
          return;
        }
        if(!tasks.projects || !tasks.projects.length) {
          this.projects = [];
          this.mainProject = tasks.mainProject;
          this.projectsReady = true;
          return;
        }
        for(let i = 0; i < tasks.projects.length; i++) {
          for(let j = 0; j < tasks.projects[i].tasks.length; j++) {
            tasks.projects[i].tasks[j].handling = 0;
          }
        }
        this.projects = tasks.projects;
        this.mainProject = tasks.mainProject;
        this.projectsReady = true;
        this.recalculateHeader();
      },
      createProjectKeydown(e) {

        if (e.code === 'Enter') {
          this.createProject();
        }
      },
      createTempTask(e) {
        if (!this.allowCreate) {
          return;
        }
        const id = this.generateId();
        const task = {
          title: '',
          temp: true,
          id: id,
          temp_id: id,
          style: this.calculateNewTask(e)
        };
        this.tasksByIds[id] = task;
        this.tasks.push(this.tasksByIds[id]);
      },
      getRandomColor() {
        if (!this.$store.getters.getColors[this.lastColorIndex]) {
          this.lastColorIndex = 0;
        }
        const color = this.$store.getters.getColors[this.lastColorIndex];
        this.lastColorIndex++;
        return color;
      }
    },
    components: {
      projectInner
    }
  }
</script>
