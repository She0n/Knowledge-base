<template>
  <div class="container-fluid">
    <div class="row">
      <searchComponent/>
    </div>
    <div class="row">
      <div class="col-12 col-lg-6 order-2 order-lg-1 order-xl-1">
        <div class="row">
          <div class="aligner-col aligner-col-left">
            <div class="c-stage stats-block block">
              <h4 class="head-block block-padding">
                Статистика / Показатели
                <div class="head-right">
                  <!--<span :class="'heading-1-corner-inner ' + (activeMode === 'summ' ? 'active' : '')" v-on:click="activeMode = 'summ'">общие</span>
                  <span :class="'heading-1-corner-inner ' + (activeMode === 'month' ? 'active' : '')" v-html="renderMonth()" v-on:click="activeMode = 'month'"></span>-->
                  <sInput v-model="activeMode" v-if="true" class="d-input" :field="{ type: 'double-toggler', titles: ['общие', renderMonth()] }"></sInput>
                </div>
              </h4>
              <div class="content-block block-padding">
                <div class="summary-group">
                  <div class="summary-group-title">Результаты тестов</div>
                  <div class="summary-row">
                    <div class="summary-key">Тестов пройдено:</div>
                    <div class="summary-val" v-html="getSum('test_attempts_finished')"></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-key">Тестов провалено:</div>
                    <div :class="'summary-val ' + (renderFailClass(getSum('test_attempts'), getSum('test_fails')))" v-html="getSum('test_fails_percent') +' %'"></div>
                  </div>
                </div>
                <!-- end test summaries -->
                <div class="summary-group">
                  <div class="summary-group-title">Активность</div>
                  <div class="summary-row">
                    <div class="summary-key">Статей создано:</div>
                    <div class="summary-val" v-html="getSum('create_material')"></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-key">Статей исправлено:</div>
                    <div class="summary-val" v-html="getSum('update_material')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('moderate'))">
                    <div class="summary-key">Статей отмодерировано:</div>
                    <div class="summary-val" v-html="getSum('moderate_material')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('delete_material'))">
                    <div class="summary-key">Статей удалено:</div>
                    <div class="summary-val" v-html="getSum('delete_material')"></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-key">Разделов создано:</div>
                    <div class="summary-val" v-html="getSum('create_category')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('update_category'))">
                    <div class="summary-key">Разделов изменено:</div>
                    <div class="summary-val" v-html="getSum('update_category')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('moderate_category'))">
                    <div class="summary-key">Разделов отмодерировано:</div>
                    <div class="summary-val" v-html="getSum('moderate_category')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('delete_category'))">
                    <div class="summary-key">Разделов удалено:</div>
                    <div class="summary-val" v-html="getSum('delete_category')"></div>
                  </div>
                  <div class="summary-row">
                    <div class="summary-key">Тестов создано:</div>
                    <div class="summary-val" v-html="summaries.total.create_test"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('update_test'))">
                    <div class="summary-key">Тестов изменено:</div>
                    <div class="summary-val" v-html="getSum('update_test')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('moderate_test'))">
                    <div class="summary-key">Тестов отмодерировано:</div>
                    <div class="summary-val" v-html="getSum('moderate_test')"></div>
                  </div>
                  <div class="summary-row" v-if="displayModerateCol(getSum('delete_test'))">
                    <div class="summary-key">Тестов удалено:</div>
                    <div class="summary-val" v-html="getSum('delete_test')"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6 order-1 order-lg-3 order-xl-3">
        <div class="row">
          <div class="aligner-col aligner-col-right">
            <div class="c-stage tests-block block">
              <h4 class="head-block block-padding">Ежедневный Спринт Тест</h4>
              <div class="content-block">
                <div v-if="!dailyTest.tests_length">
                  <div class="text-block block-padding">
                    <img src="/static/images/ilustr1.svg" class="img-margin-top">
                    <span>Для вас сегодня нет тестов</span>
                  </div>
                </div>
                <div v-else>
                  <div id="test-lock" style="display: none;">
                    <div class="text-block block-padding">
                      <img src="/static/images/ilustr1.svg">
                      <span>Вы проходите тест в другом окне</span>
                      <span>До завершения осталось <span v-html="lockTimeString"></span></span>
                    </div>
                  </div>
                  <div id="test-inner">
                    <div v-if="!testIsActive">
                      <div class="sprint-test-head head-block block-padding">
                        <div :class="'sprint-test-head-left ' + (dailyTest.fails >= dailyTest.max_fails_count ? 'u-color-danger' : '')">
                          <span>Ошибок:</span>
                          <span class="count"><span v-html="dailyTest.fails"></span>/<span v-html="dailyTest.max_fails_count"></span></span>
                        </div>
                        <div :class="'sprint-test-head-right ' + (dailyTest.finished >= dailyTest.tests_length ? 'color-green' : 'color-red')">
                          <span>Тестов пройдено:</span>
                          <span class="count"><span v-html="dailyTest.finished"></span>/<span v-html="dailyTest.tests_length"></span></span>
                        </div>
                      </div>
                      <div class="test-progress">
                        <div class="test-progress-outer">
                          <div class="test-progress-inner" :style="'width: '+progress+'%'"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div v-if="dailyTest.next_test_data">
                        <div class="sprint-test-head head-block block-padding">
                          <div class="sprint-test-head-left">
                            <span>Вопросов: </span>
                            <span v-html="this.activeTestStep"></span>/<span v-html="dailyTest.next_test_data.steps.length"></span>
                          </div>
                          <div class="sprint-test-head-right">
                            <span>Время: </span>
                            <span v-html="deadlineString"></span>
                          </div>
                        </div>
                        <div class="test-progress">
                          <div class="test-progress-outer">
                            <div class="test-progress-inner" :style="'width: '+activeTestProgress+'%'"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="test-data" id="test-data-wrapper">
                      <div class="text-block block-padding" id="test-lobby">
                        <div v-if="dailyTest.next_test_data">
                          <img src="/static/images/ilustr1.svg">
                          <div class="sprint-test-failed" v-if="testFailed">Тест провален</div>
                          <div class="sprint-test-title-1"><span v-html="testFailed ? 'Тема теста: ' : 'Тема следующего теста: '"></span><span v-html="dailyTest.next_test_data.title"></span></div>
                          <div class="text-small">
                            Нажимая кнопку `<span v-html="testFailed ? 'Попробовать еще раз' : 'Начать'"></span>` будет зафиксирована попытка прохождения теста,
                            будет запрещено закрывать это всплывающее окно, в случае закрытия страницы или отключения от интернета будет зафиксирован провал теста.
                            Результат прохождения будет зафиксирован в вашем профиле.
                          </div>
                          <button class="c-btn start-btn" style="min-width: 140px;" v-html="testFailed ? 'Попробовать ещё раз' : 'Начать'" v-on:click="startTheTest()"></button>
                        </div>
                        <div class="daily-test-results" v-if="!dailyTest.next_test_data && dailyTest.test_ended">
                          <div v-if="dailyTest.finished >= dailyTest.tests_length">
                            <div class="daily-test-results-icon">
                              <img src="/static/images/ilustr1.svg" onerror="window.setDefaultImage(this)" class="img-margin-top">
                            </div>
                            <div>Спринт-тест завершен</div>
                            <div class="text-small">Следующий тест вы сможете пройти завтра</div>
                          </div>
                          <div v-else>
                            <div class="daily-test-results-icon">
                              <img src="/static/images/ilustr1.svg" onerror="window.setDefaultImage(this)" class="img-margin-top">
                            </div>
                            <div>Спринт-тест провален</div>
                            <div class="text-small">Следующий тест вы сможете пройти завтра</div>
                          </div>
                        </div>
                      </div>
                      <div id="test-preloader" style="display: none;">
                        <div class="m-loader"></div>
                      </div>
                      <div id="test-container" v-if="dailyTest.next_test_data" style="display: none;">
                        <div class="test-container-title">
                          <span v-html="getTestProp('title')"></span>
                        </div>
                        <div id="test-container-steps-outer">
                          <div id="test-container-steps">
                            <div class="test-container-step" v-for="step, stepIndex in dailyTest.next_test_data.stepsShuffled">
                              <div class="test-container-step-question" v-html="step.question"></div>
                              <div class="test-container-step-answers-container">
                                <div class="c-choice c-choice--checkbox service-type-item-cb" v-for="(item, index) in step.answers">
                                  <div v-if="showAnswer(item)">
                                    <input :id="'cat-usergroup-item-'+index+'-'+stepIndex" type="checkbox" class="c-choice__input" v-on:change="calculateAnswerBtnClass()" :value="index">
                                    <label :for="'cat-usergroup-item-'+index+'-'+stepIndex" class="c-choice__label" v-html="item.title"></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="test-container-step-action">
                            <button :class="'c-btn answer-btn no-transition '+answerBtnClass" v-on:click="answerOnTestQuestion()"><i class="m-loader" v-if="stepProcess" aria-hidden="true"></i> Подтвердить</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  import commonMixin from '@/mixins/commonMixin.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  import searchComponent from '@/components/searchComponent.vue';
  import profileMixin from '@/mixins/profileMixin.vue';
  import testMixin from '@/mixins/testMixin.vue';
  let pageData = {title: 'База знаний', metaTitle: 'База знаний', headerClass: 'u-mb-small'};
  export default {
    extends: Component,
    mixins: [commonMixin, categoryMixin, profileMixin, testMixin],
    data() {
      return {
        activeMode: false,
        testFailed: 0,
        testsDone: 0,
        testsTotal: 3,
        errorsCount: 0,
        errorsAvailable: 2,
        testIsActive: false,
        activeTestStep: 0,
        deadline: 0,
        deadlineString: '',
        stepProcess: false,
        lockTimeout: 0,
        lockTime: 0,
        lockTimeString: '',
        animate: true,
        answerBtnClass: 'answer-btn-locked',
        dailyTest: {
          tests_data: [],
          results_data: [],
          tests_length: 0,
          finished: 0,
          fails: 0,
          test_ended: 0,
          next_test_data: {
            test_id: 0,
            title: '',
            steps: [],
            stepsShuffled: []
          },
          max_fails_count: 0
        },
        summaries: {
          total: {
            test_attempts: 0,
            test_fails: 0,
            test_fails_percent: 0,
            tests_finished: 0,
            test_attempts_finished: 0,

            create_category: 0,
            update_category: 0,
            moderate_category: 0,
            delete_category: 0,

            create_material: 0,
            update_material: 0,
            moderate_material: 0,
            delete_material: 0,

            create_test: 0,
            update_test: 0,
            moderate_test: 0,
            delete_test: 0,
          },
          last_month: {
            test_attempts: 0,
            test_fails: 0,
            test_fails_percent: 0,
            tests_finished: 0,
            test_attempts_finished: 0,

            create_category: 0,
            update_category: 0,
            moderate_category: 0,
            delete_category: 0,

            create_material: 0,
            update_material: 0,
            moderate_material: 0,
            delete_material: 0,

            create_test: 0,
            update_test: 0,
            moderate_test: 0,
            delete_test: 0,
          },
        },
        pageData: pageData
      }
    },
    async mounted() {
      await this.init();
      this.listenerOn();
    },
    destroyed() {
      this.listenerOff();
    },
    watch: {
      lockTime() {
        return this.lockTimeString = this.timeToString(this.lockTime);
      },
      deadline() {
        return this.deadlineString =this.timeToString(this.deadline);
      }
    },
    computed: {
      activeTestProgress() {
        if(!this.dailyTest.next_test_data) { return 0; }
        let step = 100/this.dailyTest.next_test_data.stepsShuffled.length;
        return step*this.activeTestStep;
      },
      progress() {
        if(!this.dailyTest.tests_length) { return 0; }
        let step = 100/this.dailyTest.tests_length;
        return step*this.dailyTest.finished;
      },
    },
    methods: {
      timeToString(a) {
        if(a < 60) {
          return  a+ ' сек.';
        }
        let minutes = parseInt(a/60);
        let seconds = a - (minutes*60);
        seconds = seconds > 9 ? seconds : '0'+parseInt(seconds).toString();
        return  minutes+':'+seconds + '';
      },
      calculateAnswerBtnClass() {
        return this.answerBtnClass = (this.collectAnswerValues()).length ? '' : ' answer-btn-locked';
      },
      listenerOn() {
        $(window).on('resize.testWidth', this.calculateTestWidth);
      },
      listenerOff() {
        $(window).off('resize.testWidth');
      },
      calculateTestWidth() {
        let $tdw = $('#test-data-wrapper');
        let $sw = $('#test-container-steps');
        let $tdwWidth = $tdw.outerWidth();
        let $items = $('.test-container-step');
        for(let i = 0; i < $items.length; i++) {
          let $item = $($items[i]);
          $item.width($tdwWidth);
          $item.css({ float: 'left' });
        }
        $sw.width(($tdwWidth*$items.length)+3000);
        this.calculateTestContainerHeight();
        this.calculateContainerOffset();

      },
      calculateTestContainerHeight() {
        let $sw = $('#test-container-steps');
        let $items = $('.test-container-step');
        if($items[this.activeTestStep]) {
          let clone = $($items[this.activeTestStep]).clone();
          clone.css({ position: 'absolute', left: '-9999px' });
          $('body').append(clone);
          $sw.height(clone.height());
        } else {
          $sw.css({ height: 'auto' });
        }
      },
      endTest(ignoreRefresh) {
        this.testIsActive = false;
        this.activeTestStep = 0;
        this.showLobby();
        clearInterval(this.interval);
        this.clearAnswerValues();
        if(!ignoreRefresh) {
          this.refreshSummaries();
        }
      },
      showLobby(callback) {
        let $testInner = $('#test-inner');
        let $testLock = $('#test-lock');
        let $lobby = $('#test-lobby');
        let $preloader = $('#test-preloader');
        $preloader.hide();
        let $testContainer = $('#test-container');
        $testContainer.fadeOut(200, () => {

        });
        $testLock.fadeOut(200, () => {

        });
        setTimeout(() => {
          $testInner.fadeIn(200, () => {
            $lobby.fadeIn(200, () => {
              if(callback) {
                callback();
              }
            });
          });
        }, 210);

        // .is(":visible");


      },
      showLock(callback) {
        let $testInner = $('#test-inner');
        let $testLock = $('#test-lock');
        let $lobby = $('#test-lobby');
        $testInner.fadeOut(200, () => {
          $testLock.fadeIn(200, () => {
            if(callback) {
              callback();
            }
          });
        });
      },
      nextTestStep() {
        this.activeTestStep++;
        if(!this.dailyTest.next_test_data.stepsShuffled[this.activeTestStep]) {
            this.endTest();
        }
        this.calculateTestContainerHeight();
        this.calculateContainerOffset();
      },
      calculateContainerOffset() {
        let $parent = $('#test-container');
        let $container = $('#test-container-steps');
        let ml = (this.activeTestStep*$parent.outerWidth());
        if(!this.animate) {
          $container.css({ marginLeft: '-'+ml+'px' })
        } else {
          $container.animate({ marginLeft: '-'+ml+'px' }, 200);
        }
      },
      async answerOnTestQuestion() {
        if(this.stepProcess) { return; }
        let answer = this.collectAnswerValues();
        if(!answer.length) {
          return;
        }
        if(!this.dailyTest.next_test_data) { return; }
        this.stepProcess = true;
        const resp = await window.$http.post('/answer-test-step', { test_id: this.dailyTest.next_test_data.test_id, question_index: this.activeTestStep, answer: answer });
        if(resp) {
          if(resp.result) {
            if(resp.finishTest) {
              await this.refreshDailyTestData();
              await this.refreshSummaries();
              this.endTest(1);
              this.showLobby();
              clearInterval(this.interval);
              clearInterval(this.lockInterval);
              this.lockTime = 0;
              this.testFailed = 0;
              this.showLobby();
            } else {
              this.nextTestStep();
            }
          } else {
            await this.refreshDailyTestData();
            await this.refreshSummaries();
            this.testFailed = 1;
            this.endTest(1);
            clearInterval(this.lockInterval);
            clearInterval(this.interval);
            this.lockTime = 0;
            this.showLobby();
          }
        }
        this.stepProcess = false;
      },
      collectAnswerValues() {
        let $items = $('.test-container-step');
        let step = $items[this.activeTestStep];
        if(!step) { return []; }
        step = $(step);
        let res = [];
        let checked = step.find('input:checked');
        for(let i = 0; i < checked.length; i++) {
          res.push(checked[i].value);
        }
        return res;
      },
      clearAnswerValues() {
        $('.test-container-step').find('input:checked').prop('checked', false);
      },
      setTimer() {
        if(!this.dailyTest.next_test_data) { return; }
        this.deadline = this.dailyTest.next_test_data.time;
        this.interval = setInterval(() => {
          this.deadline--;
          if(this.deadline <= 0) {
            this.testFailed = 1;
            this.endTest();
            this.showLobby();
            this.refreshSummaries();
            this.refreshDailyTestData();
            clearInterval(this.interval);
          }
        }, 1000);
      },
      setTestTimeout(resp, lockRefresh) {
        this.lockTime = resp.testTimeout;
        if(!lockRefresh) {
          this.refreshSummaries();
        }
        setTimeout(async() => {
          let testData = await this.getDailyTestData();
          this.extractDailyTestData(testData);
          clearInterval(this.lockInterval);
          this.lockTime = 0;
          this.testFailed = 0;
          this.showLobby();
        }, this.lockTime*1000);
        this.lockInterval = setInterval(() => {
          let newVal = this.lockTime-1;
          if(newVal >= 0) {
            this.lockTime--;
          } else {
            clearInterval(this.lockInterval);
            this.showLobby();
            this.lockTime = 0;
            this.testFailed = 0;
          }
        }, 1000);
        console.log('block');
        this.showLock();
        return;
      },
      async startTheTest() {
        if(!this.dailyTest.next_test_data) { return 0; }
        let $lobby = $('#test-lobby');
        let $preloader = $('#test-preloader');
        let $testContainer = $('#test-container');
        $lobby.fadeOut(200, async() => {
          $preloader.fadeIn(200, async () => {
            let testData = await this.getDailyTestData();
            if(!testData.next_test_data) {
              // нет следующего теста
              this.extractDailyTestData(testData);
              window.toastr.info('Этот тест уже был пройден сегодня');
              this.showLobby();
              return;
            }
            if(testData.next_test_data.test_id != this.dailyTest.next_test_data.test_id) {
              this.extractDailyTestData(testData);
              this.showLobby();
              window.toastr.info('Этот тест уже был пройден сегодня');
              return;
            }
            this.extractDailyTestData(testData);
            const resp = await window.$http.post('/start-the-test', { test_id: this.dailyTest.next_test_data.test_id });
            if(!resp) {
              this.showLobby();
              return;
            }
            if(!resp.result) {
              if(resp.testTimeout) {
                return this.setTestTimeout(resp);
              }
              this.showLobby();
              this.refreshSummaries();
              window.toastr.error(resp.display);
              return;
            }
            setTimeout(() => {
              this.activeTestStep = 0;
              this.testFailed = false;
              this.calculateTestWidth();
              $preloader.fadeOut(200, () => {
                $testContainer.fadeIn(200, async () => {
                  this.testIsActive = true;
                  this.setTimer();
                });
              });
            }, 200);
          });
        });
      },
      getTestProp(a) {
        if(!this.dailyTest.next_test_data) { return null; }
        return this.dailyTest.next_test_data[a];
      },
      getSum(name) {
        //if(this.activeMode === 'summ') { return this.summaries.total[name]; }
        if(!this.activeMode) { return this.summaries.total[name]; }
        return this.summaries.last_month[name];
      },
      extractDailyTestData(resp) {
        if(resp) {
          let fields = ['tests_data', 'max_fails_count', 'tests_length', 'next_test_data', 'fails', 'finished', 'test_ended'];
          for(let i = 0; i < fields.length; i++) {
            this.dailyTest[fields[i]] = resp[fields[i]];
          }
        }
        if(resp.testTimeout) {
          setTimeout(() => {
            this.setTestTimeout(resp, 1);
          }, 150);
        }
      },
      async getDailyTestData() {
        const resp = await $http.get('/get-daily-test-data');
        return resp;
      },
      async refreshDailyTestData() {
        const resp = await $http.get('/get-daily-test-data');
        this.extractDailyTestData(resp);
      },
      renderMonth() {
        let date = new Date();
        let month = date.getMonth();
        return window.dateFormatter.switchMonth(month)[0];
      },
      async init() {
        this.page();
        if(!this.$store.state.user) { return; }
        this.extractDailyTestData((await this.getDailyTestData()));
        let resp = await this.getAccountSummaries(this.$store.state.user.user_id);
        let summaries = resp.summaries;
        this.setAccountSummaries(summaries);
        this.$store.dispatch('setComponentReady', true);
      }
    },
    components: {
      searchComponent
    }
  }
</script>
