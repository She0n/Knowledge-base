<template>
    <div :class="cls ? cls : ''">
      <div class="material-input-blank-wrapper" v-if="!type || type === 'text'">
        <div :class="'material-input-blank-placeholder '+(realValue ? 'active ' : '') +(isFocus ? 'active' : '')"><span :class="required && !realValue ? 'd-color-danger' : ''" v-html="placeholderVal"></span></div>
        <input type="text" class="c-input" v-model="realValue" @keyup="submitEnter($event)" @focus="isFocus = true" @blur="isFocus = false">
      </div>
      <div class="material-input-blank-wrapper" v-if="type === 'datetime'">
        <div :class="'material-input-blank-placeholder '+(realValue ? 'active ' : '') +(isFocus ? 'active' : '')"><span :class="required && !realValue ? 'd-color-danger' : ''" v-html="placeholderVal"></span></div>
        <dateTimePicker  placeholderVal="" v-model="realValue"
                         :disabledDates="disabledDates"/>
      </div>
      <div class="material-input-blank-wrapper material-input-tags-users" v-if="type === 'tagsUsers'">
        <div :class="'material-input-blank-placeholder '+(isTagUserSelected() ? 'active ' : '') +(($refs.tagsUsers && $refs.tagsUsers.dropdown) ? 'active' : '')"><span :class="required && !isTagUserSelected() ? 'd-color-danger' : ''" v-html="placeholderVal"></span></div>
        <tagsUsers :selected="selectedTagUser" ref="tagsUsers" placeholderVal=""
                   :allowUserTypes="allowUserTypes"  :multiple="multipleTagUsers"></tagsUsers>
      </div>
    </div>
</template>
<script>
  import dateTimePicker from '@/components/elements/dateTimePicker.vue';
  import tagsUsers from '@/components/tagsUsers.vue';
  export default {
    props: ['type', 'cls', 'value', 'placeholderVal', 'required', 'submit', 'disabledDates', 'selectedTagUser', 'allowUserTypes', 'multipleTagUsers'],
    data() {
      return {
        realValue: '',
        isFocus: false
      };
    },
    beforeMount() {
      this.realValue = this.value;
    },
    methods: {
      isTagUserSelected() {
        if(!this.selectedTagUser) { return 0; }
        if(Array.isArray(this.selectedTagUser)) {
          return this.selectedTagUser.length;
        } else {
          return parseInt(this.selectedTagUser.user_id);
        }
      },
      submitEnter(e) {
        if(typeof this.submit !== 'function') { return; }
        if (e.key !== 'Enter') { return; }
        if (e.shiftKey !== false) { return; }
        this.submit();
      },
    },
    watch: {
      value(v) {
        if(this.realValue !== v) {
          this.realValue = v;
        }
      },
      realValue(v, o) {
        this.$emit('input', v);
      },
    },
    components: {
      dateTimePicker, tagsUsers
    }
  }
</script>
