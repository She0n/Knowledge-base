<template>
  <div>
    <div :class="'vue-select-wrapper '+cls+(' '+(isEmpty() ? '' : 'empty-vue-select')) + (isOpen ? ' open' : '')" v-if="options" :id="id">
      <select :name="name" v-model="childValue" style="display: none">
        <option v-for="(option, index) in options" :value="Array.isArray(options) ? option[select_key] : index">{{ option.title }}</option>
      </select>
      <div class="vue-select-container">
        <div class="vue-select-placeholder "  v-on:click="toggleDropdown()">
          <div v-if="title" v-html="title"></div>
          <div v-html="renderPlaceholderValue()" :title="renderPlaceholderValue()" class="vue-select-placeholder-span"></div>
        </div>
        <ul class="vue-select-dropdown dropdown-menu">
          <li v-if="nullable" class="dropdown-item" v-html="placeholderVal.length ? placeholderVal : 'Не выбрано'" v-on:click="selectOption(null); closeDropdown()"></li>
          <li v-for="(option, index) in options" :class="'dropdown-item ' + (renderOptionClass(option, Array.isArray(options) ? option[select_key] : index))" v-html="renderOptionHtml(option, Array.isArray(options) ? option[select_key] : index)" :data-index="Array.isArray(options) ? option[select_key] : index" v-on:click="selectOption(Array.isArray(options) ? option[select_key] : index)"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .vue-select-dropdown {
    display: none;
    width: 100%;
  }

  .vue-select-placeholder {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    border: solid 1px #dbdee2;
    border-radius: 5px;
    font-size: 15px;
  }
  .vue-select-wrapper {
    position: relative;

  }
  .vue-select-wrapper.open {
    .vue-select-dropdown {
      display: block;
    }
  }
  .vue-select-wrapper:hover, .vue-select-wrapper.open {
    box-shadow: 0 0 10px rgba(219, 222, 226, 0.71);
  }
  .vue-select-placeholder-span {
    margin-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #11223e;
  }
  .empty-vue-select {
    .vue-select-placeholder-span {
      color: #87909e;
    }
  }
</style>
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
      select_key: {
        type: String,
        default: ''
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
      title: {

      }
    },
    destroyed() {
      this.closeDropdown();
    },
    mounted() {
      if(Array.isArray(this.options)) {
        if(this.optionsByIds[this.value]) {
          this.childValue = this.value;
        } else {
          if(this.multiple) {
            if(this.nullable) {
              this.childValue = [];
            } else {
              this.childValue = [this.options[0][this.select_key]];
            }
          } else {
            if(this.nullable) {
              this.childValue = 0;
            } else {
              this.childValue = this.options[0][this.select_key];
            }
          }
        }
      } else {
        if(this.options[this.value]) {
          this.childValue = this.value;
        } else {
          if(!this.nullable) {
            let keys = Object.keys(this.options);
            this.childValue = keys[0];
          }
        }
      }
    },
    computed: {
      optionsByIds() {
        let a = {};
        if(!Array.isArray(this.options)) { return this.options; }
        for(let i = 0; i < this.options.length; i++) {
          a[this.options[i][this.select_key]] = this.options[i];
        }
        return a;
      }
    },
    watch: {
      childValue(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      value(n) {
        if(this.childValue !== n) {
          this.childValue = n;
        }
      },

    },
    methods: {
      isEmpty() {
        if(!this.multiple) { return this.childValue; }
        return this.childValue.length;
      },
      renderOptionHtml(option, index) {
        if(!this.multiple) { return option.title; }
        let active = Array.isArray(this.childValue) ? (this.childValue.indexOf(index) === -1 ? '' : 'active') : '';
        return '<span class="checkbox-simulator '+active+' d-mr-12"></span><span>'+option.title+'</span>';
      },
      renderOptionClass(option, index) {
        if(this.multiple) { return ''; }
        return (this.childValue === index ? 'active' : '');
      },
      selectOption (index) {
        if(!this.multiple) {
          this.childValue = index;
          return;
        }
        if(index || index === 0) {
          if(!Array.isArray(this.childValue)) {
            this.childValue = [index];
          } else {
            let index2 = this.childValue.indexOf(index);
            let newval =  JSON.parse(JSON.stringify(this.childValue));
            if(index2 !== -1) {
              newval.splice(index2, 1);
            } else {
              newval.push(index);
            }
            this.childValue = newval;
          }
        } else {
          this.childValue = [];
        }
      },
      renderPlaceholderValue() {
        let string = this.placeholderVal;
        if(this.multiple) {
          if(Array.isArray(this.childValue)) {
            if(this.childValue.length) {
              string = '';
              let comma = '';
              for(let i = 0; i < this.childValue.length; i++) {
                string += comma + this.optionsByIds[this.childValue[i]].title;
                comma = ', ';
              }
            }
          }
          return string;
        }

        if(!this.options) { return string; }
        if(Array.isArray(this.options)) {
          if(!this.optionsByIds[this.childValue]) {
            if(this.nullable) {
              return string;
            } else {
              this.selectOption(this.options[0][this.select_key]);
              return this.options[0].title;
            }
          }
          return this.optionsByIds[this.childValue].title;
        }

        if(!this.options[this.childValue]) {
          if(this.nullable) {
            return string;
          } else {
            let keys = Object.keys(this.options);
            if(!keys.length) { return ''; }
            this.selectOption(keys[0]);
            return this.options[keys[0]].title;
          }
        }



        return this.options[this.childValue].title;

      },
      closeDropdown() {
        this.isOpen = false;
        let body = $('body');
        this.outsideClicks = 0;
        body.off('click.nselect'+this.id);
      },
      toggleDropdown () {
        if(this.isOpen) {
          this.closeDropdown();
          return;
        }
        this.isOpen = true;
        let body = $('body');
        body.off('click.nselect'+this.id);
        body.on('click.nselect'+this.id, (e) => {
          this.outsideClicks++;
          if(!this.multiple) {
            if(this.outsideClicks > 1) { this.closeDropdown(); }
          } else {

            if(e.target.classList.contains('vue-select-placeholder') || e.target.closest('.vue-select-placeholder')) {
              if(this.outsideClicks > 1) {
                this.closeDropdown();
                return;
              }
            }
            if((e.target.id === this.id) || e.target.closest('#'+this.id)) { return; }
            if(this.outsideClicks > 1) { this.closeDropdown(); }
          }
        });

      },
      generateId() {
        return 'nselect-'+window.generateId();
      }
    },
    data () {
      return {
        outsideClicks: 0,
        childValue: 0,
        isOpen: false,
        id: this.generateId()
      }
    },
  }
</script>
