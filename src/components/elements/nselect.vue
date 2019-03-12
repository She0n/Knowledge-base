<template>
  <div>
  <div :class="'vue-select-wrapper '+cls" v-if="options" :id="id">
    <select :name="name" :value="value" style="display: none">
      <option v-for="(option, index) in options" :value="index">{{ option.title }}</option>
    </select>
    <div class="vue-select-container">
      <div class="vue-select-placeholder c-input"  v-on:click="toggleDropdown()">
        <span v-html="renderPlaceholderValue()"></span>
      </div>
      <ul class="vue-select-dropdown">
        <li v-if="nullable" v-html="placeholderVal.length ? placeholderVal : 'Не выбрано'" v-on:click="selectOption(null)"></li>
        <li v-for="(option, index) in options" :class="renderOptionClass(option, index)" v-html="renderOptionHtml(option, index)" :data-index="index" v-on:click="selectOption(index)"></li>
      </ul>
    </div>
  </div>
  </div>
</template>
<script>
  export default {
    props: {
      options: {
        required: true,
        default: []
      },
      cls: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        default: ''
      },
      placeholderVal: {
        default: 'Не выбрано'
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      value: {
        default: ''
      },
      nullable: {
        type: Boolean,
        default: false
      },
      change: {
        type: String,
        default: this.value
      }
    },
    watch: {
      value(nv) {
       
      }
    },
    methods: {
      renderOptionHtml(option, index) {
        if(!this.multiple) { return option.title; }
        let active = Array.isArray(this.value) ? (this.value.indexOf(index) === -1 ? '' : 'active') : '';
        return '<span class="checkbox-simulator '+active+' u-mr-small"></span><span>'+option.title+'</span>';
      },
      renderOptionClass(option, index) {
        if(this.multiple) { return ''; }
        return ((option.cls ? option.cls + ' ' : '') + (this.value === index ? 'active' : ''));
      },
      selectOption (index) {
       this.$parent.$emit(this.change, index);
      },
      renderPlaceholderValue() {
        let string = this.placeholderVal;
        if(this.multiple) {
          if(Array.isArray(this.value)) {
            if(this.value.length) {
                string += ' ('+this.value.length+')';
            }
          }
          return string;
        }

        if(!this.options) { return string; }
        if(!this.options[this.value]) {
          if(this.nullable) {
            return string;
          } else {
            let keys = Object.keys(this.options);
            if(!keys.length) { return ''; }
            this.selectOption(keys[0]);
            return this.options[keys[0]].title;
          }
        }

        return this.options[this.value].title;

      },
      closeDropdown () {
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        if(ddContainer.classList.contains('open')) {
          ddContainer.classList.remove('open');
        }
      },
      closeDropdown() {
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        let body = $('body');
        ddContainer.classList.remove('open');
        body.off('click.nselect'+this.id);
      },
      toggleDropdown () {
        let el = document.getElementById(this.id);
        if(!el) { return; }
        let ddContainer = el.getElementsByClassName('vue-select-container');
        if(!ddContainer.length) { return; }
        ddContainer = ddContainer[0];
        let body = $('body');
        if(!ddContainer.classList.contains('open')) {
        ddContainer.classList.add('open');
        body.off('click.nselect'+this.id);
        body.on('click.nselect'+this.id, (e) => {
              this.outsideClicks++;
              if(!this.multiple) {
                if(this.outsideClicks > 1) {
                  this.outsideClicks = 0;
                  this.closeDropdown();
                }
              } else {
                 if((e.target.id === this.id) || e.target.closest('#'+this.id)) {
                    return;
                 }
                if(this.outsideClicks > 1) {
                  this.outsideClicks = 0;
                  this.closeDropdown();
                }
              }
          });
        }

      }
    },
    data () {
      return {
        outsideClicks: 0
      }
    },

  }
</script>
