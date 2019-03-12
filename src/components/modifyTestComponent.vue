<template>
  <div class="create-test">
    <div class="container-fluid">
      <div class="row">
        <div class="c-stage">
          <div class="header-block">
            <div class="row">
              <div class="col-12 col-sm-8 col-md-9 col-xl-10">
                <div class="row">
                  <div class="header-img">
                    <img src="/static/images/create.svg" width="50" onerror="window.setDefaultImage(this)">
                  </div>
                  <div class="header-title">
                    <h6 class="project-title" v-html="test.title.length ? test.title : 'Новый тест'"></h6>
                    <p>
                      <span v-html="displayCreatedAt()" class="meta-delimeter"></span>
                      <span v-html="displayUpdatedAt()" class="meta-delimeter" v-if="showUpdatedAt()"></span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4 col-md-3 col-xl-2">
                <div class="modify-test-block">
                  <button class="c-btn c-btn__success modify-test-btn" v-on:click="modifyTest()">
                    <!--<i class="m-loader" aria-hidden="true" v-if="process"></i>-->
                    <img src="/static/images/ok.svg" width="20" height="20">
                    <span v-html="test.test_id ? 'Сохранить тест' : 'Создать тест'"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="c-stage content-block content-block-test">
          <div class="create-test-settings">
            <div class="c-field">
              <div class="field-block">
                <label class="c-field__label">Тема теста:</label>
                <input type="text" placeholder="Введите название теста" v-model="test.title" class="c-input">
              </div>
            </div>
            <div class="c-field">
              <label class="c-field__label">Доступен для:</label>
              <div class="n-edit-field">
                <div class="service-type-container">
                  <div class="service-type-group">
                    <div class="service-type-items">
                      <div class="c-choice c-choice--checkbox service-type-item-cb" v-for="(item, index) in $store.state.professions">
                        <input :id="'cat-usergroup-item-'+item.profession_id" type="checkbox" class="c-choice__input" v-model="test.professions" :value="item.profession_id">
                        <label :for="'cat-usergroup-item-'+item.profession_id" class="c-choice__label" v-html="item.title"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="create-test-questions">
            <div class="head-block">
              <span class="title">Вопросы теста</span>
              <span class="questions-count">Всего вопросов: <span class="green"><span class="count" v-html="test.steps.length"></span> штук<span v-html="questions_letter"></span></span></span>
            </div>
            <div class="c-field steps-block">
              <div class="test-step stacked" v-for="(step, stepIndex) in test.steps">
                <div class="head-step">
                  <div class="left">
                    <div class="test-step-number" v-html="(stepIndex+1)"></div>
                    <div class="test-step-question c-field__label">
                      <input type="text" v-model="step.question" :placeholder="step.questionPlaceholder"/>
                    </div>
                  </div>
                  <div class="right">
                    <button type="button" class="delete-button" @click="dropQuestItem(stepIndex)" v-if="test.steps.length > 3">Удалить</button>
                  </div>
                </div>
                <div class="test-step-answers">
                  <div v-for="(answer, index) in step.answers">
                    <div class="c-choice c-choice--checkbox service-type-item-cb">
                      <input :id="'cat-usergroup-item-'+index+'-'+stepIndex" type="checkbox" class="c-choice__input"
                             v-model="step.correct" :value="index">
                      <label :for="'cat-usergroup-item-'+index+'-'+stepIndex" class="c-choice__label">
                        <input type="text" v-model="answer.title" :placeholder="answer.placeholder">
                      </label>
                    </div>
                  </div>
                </div>
                <!--<div class="test-step-actions">
                  <div class="add-test-item" v-if="test.steps.length < 15" v-on:click="addNewQuestion(stepIndex)">Добавить ещё вопрос</div>
                  <div class="drop-test-item" v-if="test.steps.length > 1" v-on:click="dropQuestItem(stepIndex)">Удалить вопрос</div>
                </div>-->
              </div>
              <div class="add-question-block">
                <img src="/static/images/danger.svg" width="43" height="37">
                <button type="button" class="add-test-item" v-on:click="addNewQuestion">Добавить вопрос</button>
                <hr class="hr-line">
                <p class="text">Минимальное количество вопросов - 15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import searchComponent from '@/components/searchComponent.vue';
  import testMixin from '@/mixins/testMixin.vue';
  let pageData = {title: 'Редактирование теста', metaTitle: 'Редактирование теста', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    mixins: [categoryMixin, testMixin],
    data() {
      return {
        pageData: pageData,
        usertypes: [],
        test: {
          test_id: null,
          title: '',
          created_at: null,
          updated_at: null,
          created_by: null,
          updated_by: null,
          steps: [],
          professions: [],
        },
        process: false,
        questions_letter: ''
      }
    },
    created() {

    },
    async mounted() {
      await this.init();
    },
    watch: {
      'test.steps'() {
        this.questionsLetterInit();
      }
    },
    methods: {
      questionsLetterInit() {
        if (this.test.steps.length === 3 || this.test.steps.length === 4 || this.test.steps.length === 22 || this.test.steps.length === 23 || this.test.steps.length === 24 ||
            this.test.steps.length === 32 || this.test.steps.length === 33 || this.test.steps.length === 34) {
          this.questions_letter = 'и';
        } else if (this.test.steps.length === 21 || this.test.steps.length === 31) {
          this.questions_letter = 'а';
        } else {
          this.questions_letter = '';
        }
      },
      addNewQuestion() {
        let quest = this.getTestStep();
        this.test.steps.push(quest);
        //this.test.steps.splice((index+1), 0, quest);
      },
      dropQuestItem(index) {
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить этот вопрос?',
          confirm: () => {
            this.test.steps.splice(index, 1);
          }
        });
      },
      getTestStep() {
        let a = {
          question: '',
          questionPlaceholder: 'Текст вопроса... ?',
          answers: [
            { title: '', placeholder: 'Ответ 1 ...' },
            { title: '', placeholder: 'Ответ 2 ...' },
            { title: '', placeholder: 'Ответ 3 ...' },
            { title: '', placeholder: 'Ответ 4 ...' },
          ],
          correct: []
        };
        return a;
      },
      async modifyTest() {
        if(this.process) { return 0; }
        this.process = 1;
        const resp = await $http.post('/modify-test', this.test);
        if(resp) {
          if(resp.result) {
            window.toastr.success(resp.display);
            this.$router.push('/');
          } else {
            window.toastr.error(resp.display);
          }
        }
        this.process = 0;
      },
      async init() {
        this.page();
        //let testId = window.location.getParameter('test_id');
        let testId = this.$route.query['test_id'];
        if(testId) {
          let test;
          test = await this.getTestById(testId);
          test.steps.forEach((el) => {
            el.answers.pop();
          });
          let except = ['professions'];
          for(let prop in test) {
            if(except.indexOf(prop) !== -1) { continue; }
            this.test[prop] = test[prop];
          }
          this.test.professions = Array.isArray(test.professions) ? test.professions : [];
        }
        if (!this.test.steps.length) {
          for (let i = 0; i < 3; i++) {
            this.test.steps.push(this.getTestStep());
          }
        }
        this.questionsLetterInit();
        this.$store.dispatch('setComponentReady', true);
      },
      displayCreatedAt() {
        let s = '<span>Создан: </span> ';
        if (!this.test.created_at) {
          return s + ' ---';
        }
        return s += window.dateFormatter.reformatDate(this.test.created_at);
      },
      displayUpdatedAt() {
        let s = '<span>Обновлен: </span> ';
        if (!this.test.updated_at) {
          return s + ' ---';
        }
        let updated = window.dateFormatter.reformatDate(this.test.updated_at);
        return s += updated;
      },
      showUpdatedAt() {
        let created = window.dateFormatter.reformatDate(this.test.created_at);
        let updated = window.dateFormatter.reformatDate(this.test.updated_at);
        return created !== updated;
      }
    },
    components: {
      searchComponent
    }
  }
</script>
