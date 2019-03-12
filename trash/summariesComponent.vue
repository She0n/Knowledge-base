<template>
  <div>
    <div class="summary-group">
      <div class="summary-group-title">результаты тестов</div>
      <div class="summary-row">
        <div class="summary-key">тестов пройдено:</div>
        <div class="summary-val" v-html="getSum('test_attempts_finished')"></div>
      </div>
      <div class="summary-row">
        <div class="summary-key">тестов провалено:</div>
        <div :class="'summary-val ' + (renderFailClass(getSum('test_attempts'), getSum('test_fails')))" v-html="getSum('test_fails_percent') +' %'"></div>
      </div>
    </div>
    <!-- end test summaries -->
    <div class="summary-group u-border-bottom-zero" v-if="activityExists()">
      <div class="summary-group-title">активность</div>
      <div>
      <div class="summary-row" v-for="item, index in summariesColumns "v-if="getSum(index)">
        <div class="summary-key" v-html="item"></div>
        <div class="summary-val" v-html="getSum(index)"></div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    props: ['summaries'],
    mixins: [commonMixin],
    data() {
      return {
        summariesColumns: {
          create_material: 'статей создано',
          update_material: 'статей исправлено',
          moderate_material: 'статей отмодерировано',
          delete_material: 'статей удалено',
          create_category: 'разделов создано',
          update_category: 'разделов изменено',
          modeate_category: 'разделов отмодерировано',
          delete_category: 'разделов удалено',
          create_test: 'тестов создано',
          update_text: 'тестов изменено',
          moderate_test: 'тестов отмодерировано',
          delete_test: 'тестов удалено'
        }
      }
    },
    methods: {
      getSum(name) {
        if(!this.summaries) { return 0; }
        if(!this.summaries.total) { return 0; }
        return this.summaries.total[name];
      },
      activityExists() {
        if(!this.summaries) { return 0; }
        if(!this.summaries.total) { return 0; }
        for(let prop in this.summaries.total) {
          if(this.summaries.total[prop]) { return 1; }
        }
      }
    },
  }
</script>
