<template>
  <div class="container-fluid">
    <div class="row">
      <searchComponent tests="true"/>
      <div class="c-stage no-tests" v-if="!tests.length">Тестов не найдено</div>
      <div class="tests-page" v-else>
        <div class="test-items">
          <div class="c-stage list-test-item" v-for="test in tests">
            <div class="list-test-item-title">
              <span v-html="test.title"></span>
            </div>
            <div class="list-test-item-time">
              На выполнение теста даётся 10 минут
            </div>
            <div class="test-buttons-block">
              <router-link :to="'/main/modify-test?test_id=' + test.test_id" class="c-btn list-test-item-change"><span>Редактировать</span></router-link>
              <button type="button" class="c-btn list-test-item-delete" @click="dropTest(test.test_id)">Удалить</button>
            </div>
          </div>
        </div>
      </div>
      <testModal :test="activeTest" :force="force" v-if="activeTest"></testModal>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import searchComponent from '@/components/searchComponent.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import testMixin from '@/mixins/testMixin.vue';
  import testModal from '@/components/elements/testModal.vue';
  let pageData = {title: 'Тестирование', metaTitle: 'Тестирование', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [categoryMixin, permissionsMixin, testMixin],
    data() {
      return {
        pageData: pageData,
        tests: [],
        activeTest: 0,
        force: 0
      }
    },
    async mounted() {
      await this.init();
    },
    methods: {
      dropTest(testId) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить этот тест?',
          confirm: async function() {
            const resp = await $http.post('/drop-test', { test_id: testId });
            if(resp) {
              if(resp.result) {
                for(let i = 0; i < that.tests.length; i++) {
                  let test = that.tests[i];
                  if(test.test_id === testId) {
                    that.tests.splice(i, 1);
                  }
                }
                window.toastr.success('Тест удалён');
              } else {
                window.toastr.error(resp.display);
              }
            }
          },
        });
      },
      showUpdatedAt(a) {
        return a.created_at !== a.updated_at && a.updated_at;
      },
      async init() {
        this.page();
        await this.getTests();
        this.$store.dispatch('setComponentReady', true);
      },
      async getTests() {
        const resp = await $http.get('/get-tests');
        if(resp) {
          this.tests = Array.isArray(resp) ? resp : [];
        }
      }
    },
    components: {
      searchComponent, testModal
    }
  }
</script>
