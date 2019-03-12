<template>
  <div class="kanban-component">
    <div class="kanban-line">
      <kanbanCol title="" :key="col.col_id" v-for="col in tasksData.cols"></kanbanCol>
    </div>
  </div>
</template>
<script>
  import kanbanCol from '@/components/kanbanCol.vue';
  export default {
    props: {
      tasks: {
        type: Object,
        default: []
      },
      tasksData: {
        type: Object,
      },
    },
    data() {
      return {

      };
    }
  }
</script>
