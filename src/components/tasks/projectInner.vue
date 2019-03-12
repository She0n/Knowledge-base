<template>
  <div class="c-panel">
  <div class="project-task-inner">
    <div class="tasks-list">
          <div v-for="task in project.tasks" :key="'task-key-'+task.task_id" v-dragula="project.tasks" bag="tasks-bag">
            <div :class="'task-container '+(task.editing ? 'task-editing' : '')">
              <div class="task-inner">
                <div class="task-inner-2">
                <div class="task-inner-3">
                  <div class="task-dragger">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                  </div>
                  <div class="task-circle-outer" v-on:click="handleTaskCircleClick(task, $event)">
                    <i :class="calculateTaskCircleClass(task)"></i>
                  </div>
                  <div class="task-inner-4">
                    <div v-if="task.editing" class="edit-task-body">
                      <input type="text" v-model="task.e_title" class="edit-task-title-input c-input">
                      <textarea v-model="task.e_content" class="c-input task-content-input"></textarea>
                      <button class="c-btn c-btn--success u-mt-xsmall save-task-btn">сохранить</button>
                    </div>
                    <div v-else v-html="task.title"></div>
                  </div>
                  <div class="task-actions">
                    <div class="task-action edit-task" title="Редактировать">
                      <div class="task-action-inner" v-on:click="toggleTaskEditMode(task)"></div>
                    </div>
                    <div class="task-action task-date" title="Назначить дату">
                      <div class="task-action-inner"></div>
                    </div>
                    <div class="task-action task-comments" title="Комментарии">
                      <div class="task-action-inner"></div>
                    </div>
                    <div class="task-action task-user" title="Ответственный пользователь">
                      <div class="task-action-inner"></div>
                    </div>
                    <div class="task-action task-users" title="Причастные пользователи">
                      <div class="task-action-inner"></div>
                    </div>
                    <div class="task-action task-close" title="Удалить задачу">
                      <div class="task-action-inner"></div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
    </div>
    <div class="add-task-container">
      <div class="c-task " v-if="1==2">
        <div class="c-task__content">
          <div v-if="creatorActive" class="task-container">
            <input type="text" class="c-input task-title-input" />
          </div>
          <button class="c-btn c-btn--fancy" v-on:click="toggleTaskCreator()"><i class="fa fa-plus u-mr-xsmall"></i>Добавить задачу</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>

  export default {
    props: ['project'],
    data() {
      return {
        tasks: [
          {
            title: 'asd',
            id: 1
          },
          {
            title: 'dsa',
            id: 2
          }
        ],
        creatorActive: false
      };
    },
    computed: {
      tasksByIds() {
        let a = {};
        if(!this.project) { return a; }
        if(!this.project.tasks)  { return a; }
        for(let i = 0; i < this.project.tasks.length; i++) {
          a[this.project.tasks[i].task_id] = this.project.tasks[i];
        }
        return a;
      }
    },
    methods: {
      toggleTaskEditMode(task) {
        if(!task.task_id) { return; }
        this.tasksByIds[task.task_id].editing = this.tasksByIds[task.task_id].editing ? 0 : 1;
      },
      calculateTaskCircleClass(task) {
        let c = 'fa fa-check task-circle-inner ';
        if(this.tasksByIds[task.task_id].handling) { c+='active'; }
        return c;
      },
      toggleTaskCreator() {
        this.creatorActive = this.creatorActive ? 0 : 1;
      },
      handleTaskCircleClick(task) {
        this.tasksByIds[task.task_id].handling = 1;
        this.$dialog.confirm('<div class="dg-header">Подтверждение</div><div class="dg-body">Вы выполнили эту задачу?</div>', {
          okText: 'Да',
          cancelText: 'Нет',
          html: true
        })
          .then(() => {
            this.completeTaskAction(task);
          })
          .catch(() => {
            this.tasksByIds[task.task_id].handling = 0;
          });
      },
      completeTaskAction(task) {
        console.log(task);
        this.tasksByIds[task.task_id].handling = 0;
      }
    },
    components: {

    }
  }
</script>
