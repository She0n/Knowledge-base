<template>
  <div :class="'n-dateTime-picker '+(inline ? 'dtp-inline open' : '') +(cls ? ' '+cls : '')" :id="elid">
    <div class="n-dateTime-picker-value" v-if="!inline">
      <div class="c-input c-input-abs u-text-left trigger u-relative u-p-zero">
        <div class="u-relative" v-if="hasDate"> <span class="vdp-datepicker__clear-button ver2" @click="clearDate()"><i><span>×</span></i></span></div>
        <div class="u-p-input dtp-toggler" @click="toggleDropdown()">
          <div :class="'u-p-input-inner '+(hasDate ? '' : 'placeholder-text-simulator')" v-html="placeholderText" ></div>
        </div>
      </div>
    </div>
    <div class="n-dateTime-picker-outer">
    <div class="n-dateTime-picker-wrapper">
      <datepicker :clear-button="false" :disabled="disabledDates" v-model="realValue" :selected="selectDateEvent()"
                  input-class="c-input trigger"  language="ru" :inline="true"
                  :monday-first="true"></datepicker>
      <div class="n-time-picker-wrapper">
        <div v-if="timeIsActive">
          <div class="n-time-picker-wrapper-desc">время:</div>
          <div class="n-time-picker-wrapper-container">
            <input :class="'c-input '+(!validHours() ? 'c-input--danger' : '')" type="text" placeholder="--" maxlength="2" @keyup="recalculateRealValue()" onkeypress="return validateNumericInput(event)" v-model="selectedHours" />
            <span class="n-time-picker-wrapper-delimeter">:</span>
            <input type="text" placeholder="--" @keyup="recalculateRealValue()" onkeypress="return validateNumericInput(event)" maxlength="2" v-model="selectedMinutes" :class="'c-input '+(!validMinutes() ? 'c-input--danger' : '')" />
          </div>
          <div class="n-time-picker-wrapper-desc"><span class="trigger u-text-dark-hover" @click="timeIsActive = false;">&times;</span></div>
        </div>
        <div class="u-text-center u-text-mute u-text-xsmall " v-else>
          <div class="trigger u-text-dark-hover" @click="timeIsActive = true;">
          <i class="fa fa-clock-o u-mr-xsmall u-text-xsmall2 top@0@5"></i> установить время
          </div>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker/src/components/Datepicker.vue';

  export default {
    props: {
      cls: {
        type: String,
        default: ''
      },
      value: {
        default: ''
      },
      placeholderVal: {
        type: String,
        default: 'Не выбрано'
      },
      inline: {
        type: Boolean,
        default: false
      },
      disabledDates: {
        default: () => { return { to: null }; }
      },
    },
    data() {
      return {
        realValue: '',
        hasDate: false,
        elid: '',
        placeholderText: '',
        selectedMinutes: this.getTimeMinutes(),
        selectedHours: this.getTimeHours(),
        outsideClicks: 0,
        timeIsActive: true,
        timeIsValid: false,
      };
    },
    beforeCreate() {

    },
    mounted() {
      this.elid = 'datepicker-'+window.generateId();
      this.realValue = this.value;
      this.computeOutsideRealValue();
      this.recalculateRealValue();
    },
    watch: {
      value(n) {
        if(this.realValue !== n) {
          this.realValue = n;
          this.computeOutsideRealValue();
        }
      },
      realValue(v) {
        this.realValue = v;
        this.recalculateRealValue();
      },
      selectedMinutes(v) {
        this.selectedMinutes = v;
        this.recalculateRealValue();
      },
      selectedHours(v) {
        this.selectedHours = v;
        this.recalculateRealValue();
      },
    },
    destroyed() {
      let body = $('body');
      body.off('click.ndtp'+this.elid);
    },
    methods: {
      getTimeHours() {
        return this.realValue ? window.dateFormatter.c(this.realValue.getHours()) : '';
      },
      getTimeMinutes() {
        return this.realValue ? window.dateFormatter.c(this.realValue.getMinutes()) : '';
      },
      validHours() {
        return window.dateFormatter.validHours(this.selectedHours);
      },
      validMinutes() {
       return window.dateFormatter.validMinutes(this.selectedMinutes);
      },
      computeOutsideRealValue() {
        this.selectedMinutes = this.getTimeMinutes();
        this.selectedHours = this.getTimeHours();
      },
      clearDate() {
        this.realValue = null;
        this.selectedMinutes = null;
        this.selectedHours = null;
        this.$emit('input', this.realValue);
      },
      toggleDropdown () {
        if(this.inline) { return; }
        let el = document.getElementById(this.elid);
        if(!el) { return; }
        let body = $('body');
        if(!el.classList.contains('open')) {
          el.classList.add('open');
          body.off('click.ndtp'+this.elid);
          body.on('click.ndtp'+this.elid, (e) => {
            if(!e.target.classList.contains('dtp-toggler') && !e.target.closest('.dtp-toggler')) {
              if(e.target.id === this.elid || e.target.closest('#'+this.elid)) { return; }
            }
            this.outsideClicks++;
            if(this.outsideClicks > 1) {
              this.outsideClicks = 0;
              this.closeDropdown();
            }
          });
        }
      },
      closeDropdown() {
        if(this.inline) { return; }
        let el = document.getElementById(this.elid);
        if(!el) { return; }
        el.classList.remove('open');
        let body = $('body');
        body.off('click.ndtp'+this.elid);
      },
      recalculateRealValue() {
        let d = new Date(this.realValue);
        if(isNaN(d.getDate()) || !this.realValue) {
          this.placeholderText = this.placeholderVal;
          this.hasDate = false;
          return;
        }
        this.hasDate = true;
        if(this.timeIsActive && this.validHours() && this.validMinutes()) {
          d.setMinutes(parseInt(this.selectedMinutes));
          d.setHours(parseInt(this.selectedHours));
          this.timeIsValid = true;
        } else {
          this.timeIsValid = false;
        }
        let pv = window.dateFormatter.reformatDate3(d, this.timeIsValid);
        if(this.realValue) {
          this.realValue.wTime = this.timeIsValid;
        }
        this.placeholderText = pv;
        this.$emit('input', this.realValue);
      },

      fillPossibleTime() {
        let minutes = [];
        let hours = [];
        for(let i = 0; i < 60; i+=5) {
          minutes.push(window.dateFormatter.c(i));
        }
        for(let i = 0; i <= 12; i++) {
          hours.push(window.dateFormatter.c(i));
          this.possibleMinutes = minutes;
          this.possibleHours = hours;
        }
      },
      formatHours(v) {
        return v > 12 ? v/2 : v;
      },
      isFieldEmpty(a) {
        if (!a) {
          return 1;
        }
        if (typeof a === 'string') {
          if (!a.trim().length) {
            return 1;
          }
        }
        return 0;
      },
      selectDateEvent(v) {
        if(!this.realValue) { return; }
        this.selectedMinutes = this.$store.state.workDayMaxMinutes;
        this.selectedHours = this.$store.state.workDayMaxHours;
        this.recalculateRealValue();
      },
      formatDateTime(t) {
        return t.getDate() + ' ' +window.dateFormatter.switchMonth(t.getMonth())[1]+ ' ' +t.getFullYear() + ' '+((this.selectedHours ? this.selectedHours+':'+(this.selectedMinutes ? this.selectedMinutes : '00') : ''));
      }
    },
    components: {Datepicker}
  }
</script>
