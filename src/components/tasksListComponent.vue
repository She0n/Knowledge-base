<template>
  <div class="tasks-list-wrapper">
    <div class="empty-tasks-container stacked u-text-center n-no-messages" v-if="!tasks.list.length">
      <div>
        <div>
          <img src="/static/images/document-cross.png" >
        </div>
        <div v-html="tasksData.q ? 'Нет задач соответствующих вашему запросу' : 'У вас пока нет задач'"></div>
      </div>
    </div>
    <div v-else>
      <div class="tasks-list-arr-wrapper">
    <div class="list-item-container ">
      <div class="task-checkbox">
          <div class="c-choice c-choice--checkbox c-choice--info abs c-choice--round">
            <input id="task-0x" v-model="checkAll"  type="checkbox" class="c-choice__input">
            <label for="task-0x" class="c-choice__label  c-choice__label"></label>
          </div>
        </div>
        <div class="task-title">&nbsp;</div>
        <div class="task-deadline">&nbsp;</div>
        <div class="task-actions">
          <i :class="'fa fa-sort-amount-asc trigger u-text-mute u-text-dark-hover order-tasks '+(tasksData.ordering === 'asc' ? 'order-asc' : 'order-desc')" @click="tasksData.ordering = tasksData.ordering === 'asc' ? 'desc' : 'asc'" ></i>
        </div>
    </div>
    <div v-for="task, index in tasks.list" :class="'list-item-container '+(task.checked ? 'list-item-container-checked' : '')" >
      <div class="task-checkbox">
        <div class="c-choice c-choice--checkbox c-choice--info abs c-choice--round">
          <input :id="'task-'+index" v-model="task.checked"  type="checkbox" class="c-choice__input">
          <label :for="'task-'+index" class="c-choice__label c-choice__label"></label>
        </div>
      </div>
      <router-link :to="makeTaskLink({ task_id: task.task_id })" class="u-text-dark-hover task-link" >
      <div class="list-item-title">
          <span v-html="task.title"></span>
      </div>
      <div class="task-groups-related">
        <div class="overlay-modal-tag" v-for="tag in task.tags" v-if="$store.state.taskTags[tag]">
          <div class="overlay-modal-tag-icon"><i :class="'fa fa-circle-o u-color-'+getTagCls(tag)"></i></div>
          <div v-html="getTagTitle(tag)"></div>
        </div>
      </div>
      <div class="task-deadline" v-html="renderDate(task.deadline)"></div>
      </router-link>
      <!--
       <li class="c-dropdown__item dropdown-item trigger" v-if="task.is_favourite">добавить в избранное</li>
            <li class="c-dropdown__item dropdown-item trigger" v-else>удалить из избранного</li>
            <li class="c-dropdown__item dropdown-item trigger" >удалить задачу</li>
      -->
    </div>
    </div>
    <div class="task-container task-mass-actions-container stacked u-mt-small" style="display: none;">
      <div class="tma-description u-mr-small">С выбранными:</div>
      <div class="tma-action" v-for="tma in tasksMassActions">
        <div v-html="tma.title"></div>
      </div>
    </div>
    </div>

  </div>
</template>
<script>
  import tasksMixin from '@/mixins/tasksMixin.vue';

  export default {
    props: ['tasks', 'props', 'tasksData', 'tasksMassActions'],
    mixins: [tasksMixin],
    created() {
      return;
    },
    data() {
      return {
          checkAll: false
      };
    },
    watch: {
      checkAll(v) {
        this.checkAllTasks(v);
      }
    },
    methods: {
      checkAllTasks(v) {
        for(let i = 0; i < this.tasks.list.length; i++) {
          this.tasks.list[i].checked = v;
        }
      },
      renderSimpleDate(date) {
        return window.dateFormatter.reformatSimpleDate(date);
      },
      renderDate(date) {
        return window.dateFormatter.reformatDate(date);
      },
    },
    components: {

    }
  }
</script>
