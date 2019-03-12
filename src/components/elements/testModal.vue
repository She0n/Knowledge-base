<template>
  <div>
    <div class="c-modal c-modal--huge modal fade" id="test-modal" tabindex="-1" role="dialog"
         aria-labelledby="test-modal">
      <div class="c-modal__dialog modal-dialog" role="document" >
        <span class="c-modal__close" data-dismiss="modal" aria-label="Close" v-if="showClose">&times;</span>
        <div class="c-modal__content modal-content">
          <div id="test-begin">
            <div class="modal-test-title">Вы собираетесь пройти тест</div>
            <div class="modal-test-desc u-text-mute">
              Нажимая кнопку <span class="u-color-info">продолжить</span> будет зафиксирована попытка прохождения теста, будет запрещено закрывать это всплывающее окно,
              в случае закрытия страницы или отключения от интернета <span class="u-color-danger">будет зафиксирован провал теста</span>. Результат прохождения будет зафиксирован в вашем профиле.
            </div>
            <div class="modal-test-subtitle u-text-mute">
              <span class="modal-test-data-key u-text-mute">тема теста: </span>
              <span  v-html="test.title" class="u-text-dark modal-test-data-val"></span>
            </div>
            <div class="modal-test-subtitle u-text-mute">
              <span class="modal-test-data-key u-text-mute">вопросов: </span>
              <span  v-html="test.steps ? test.steps.length : ''" class="u-text-dark modal-test-data-val"></span>
            </div>
            <div class="modal-test-desc-time u-text-left">
              <span class="modal-test-data-key">время на прохождение:</span>
              <span v-html="testTime()" class="modal-test-data-val u-text-dark"></span>
            </div>
            <div class="u-text-center u-mt-small">
              <button class="c-btn c-btn--info" v-on:click="beginTest()">продолжить</button>
            </div>
          </div>
          <div id="test-data" style="display: none;">
            <div class="test-data-title u-h4" v-html="test.title"></div>
            <div class="test-meta">
              <div class="test-meta-step">
              Вопрос
              <span v-html="(activeStep+1)"></span>/<span v-html="test.steps ? test.steps.length : ''"></span>
              </div>
              <div :class="'test-meta-time'+ (deadline < 30 ? ' u-color-danger' : '')">
                <span class="u-mr-xsmall">осталось времени: </span>
                <span v-html="deadlineString"></span>
              </div>
            </div>
            <div class="test-progress">
              <div class="test-progress-outer">
                <div class="test-progress-inner" :style="'width: '+progress+'%'"></div>
              </div>
            </div>
            <div class="test-step-data u-mt-small">
              <h5 class="modal-test-step-title u-mb-small" v-html="activeQuest.question"></h5>
              <div class="modal-test-step-answers">
                <div v-for="answer, index in activeQuest.answers">
                  <div v-if="showAnswer(answer)">
                    <div class="c-choice c-choice--checkbox u-mb-zero u-width-100">
                      <input :id="'cat-usergroup-item-'+index+'-'+activeStep" type="checkbox" class="c-choice__input cb-size-1" :value="index">
                      <label :for="'cat-usergroup-item-'+index+'-'+activeStep" class="c-choice__label" v-html="answer.title"></label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-test-step-bottom">
                <div class="modal-test-step-err"></div>
                <div>
                  <button class="c-btn c-btn--success2">далее</button>
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
  import testMixin from '@/mixins/testMixin.vue';
  export default {
    mixins: [testMixin],
    props: ['test', 'force'],
    data() {
      return {
        showClose: true,
        activeStep: null,
        deadline: 0,
        deadlineString: ''
      };
    },
    computed: {
      progress() {
        if(!this.test.steps) { return 0; }
        if(!this.test.steps.length) { return 0; }
        if(this.activeStep === null) { return 0; }
        let st = this.activeStep+1;
        if(st === this.test.steps.length) { return 100; }
        let sti = parseInt(100/this.test.steps.length);
        let progress = st*sti;
        return progress;
      },
      activeQuest() {
        if(this.activeStep === null) { return {}; }
        if(!this.test.steps[this.activeStep]) { return {}; }
        return this.test.steps[this.activeStep];
      }
    },
    watch: {
      force() {
        $('#test-begin').show();
        $('#test-data').hide();
        this.activeStep = null;
      },
      deadline() {
        if(this.deadline < 60) {
          return this.deadlineString = this.deadline+ ' сек.';
        }
        let minutes = parseInt(this.deadline/60);
        let seconds = this.deadline - (minutes*60);
        seconds = seconds > 9 ? seconds : '0'+parseInt(seconds).toString();
        return this.deadlineString = minutes+':'+seconds + '';
      }
    },
    methods: {
      getTotalTime() {
        if(!this.test) { return 0; }
        if(!this.test.steps) { return 0; }
        if(!this.test.steps.length)  { return 0; }
        let stepTime = 45;
        return stepTime*this.test.steps.length;
      },
      setDeadline() {
        this.deadline = this.getTotalTime();
      },
      testTime() {
        if(!this.test.steps) { return 0; }
        if(!this.test.steps.length) { return 0; }
        let total = this.getTotalTime();
        if(total < 60) {
          return total +' сек.';
        } else {
          let minutes = parseInt(total/60);
          let seconds = total - (minutes*60);
          seconds = seconds > 10 ? seconds : '0'+parseInt(seconds).toString();
          return ''+minutes+':'+seconds + '';
          //
        }
      },
      beginTest() {
        let that = this;
        $('#test-begin').fadeOut(300, function() {
          that.setDeadline();
          that.setTimer();
          that.activeStep = 0;
          that.showClose = false;
        });
        setTimeout(() => {
          $('#test-data').fadeIn(300);
        }, 250);
      }
    }
  }
</script>
