<template>
  <div class="d-input" v-if="displayInput">
    <div class="d-input-val double-toggler toggler" v-if="field.type === 'double-toggler'">
      <span v-html="field.titles[0]" :class="!realValue ? 'd-text-dark' : ''"></span>
      <input v-model="realValue" :id="'d-input-'+id" type="checkbox">
      <label :for="'d-input-'+id" class="lever"></label>
      <span v-html="field.titles[1]" :class="realValue ? 'd-text-dark' : ''"></span>
    </div><!-- end of double toggler -->
    <div class="d-input-border trigger" v-if="field.type === 'select'" >
      <div class="d-input-val">
        <nselect2 ref="inputRef" :title="field.title" :options="field.values" :select_key="field.select_key ? field.select_key : 'value_id'" :nullable="field.nullable" v-model="realValue"   :placeholderVal="field.placeholderVal"></nselect2>
      </div>
    </div><!-- end of select -->
    <div class="d-input-border multiselect trigger" v-if="field.type === 'multiselect'">
      <div class="d-input-val">
        <nselect2 :title="field.title" :options="field.values" ref="inputRef" :select_key="field.select_key ? field.select_key : 'value_id'" :nullable="field.nullable" v-model="realValue" :placeholderVal="field.placeholderVal" :multiple="true"></nselect2>
      </div>
    </div><!-- end of multiselect -->

  <div  >

    <div class="d-input-val" v-if="field.type === 'responsible_user'">
      <div :id="'res-select-'+id" :class="'vue-select-wrapper '+(!realValue.user_id ? 'empty-vue-select' : '')">
        <div :class="'vue-select-container '+(users_open ? 'open' : '')">
          <div class="vue-select-placeholder" @click="!users_open ? openDropdown() : 0">
          <span class="vue-select-placeholder-span" v-html="realValue.user_id ? renderUserRealName(realValue) : 'Выбрать'"></span>
          </div>
          <ul class="vue-select-dropdown">
            <li class="overlay-input-dd-preloader" v-if="field.users_loading"><div class="m-loader" ></div></li>
            <li :class="realValue.user_id === a.user_id ? 'active' : ''" v-for="a, b in users" v-html="renderUserRealName(a)" @click="setUser(a)" v-if="!field.users_loading"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="d-input-val" v-if="field.type === 'contact-autocomplete'">
      <input type="text" ref="inputRef" class="d-input" @keyup="getTimeoutContacts" :placeholder="field.placeholder ? field.placeholder : '...'" v-model="realValue" spellcheck="false" autocomplete="off">
      <div class="linked-form__field__autocomplete-wrapper" v-if="showAutocomplete">
          <div v-for="a, b in autocomplete" :class="'linked-form-autocomplete-list-item '+(field.relatedObject[field.relatedKey] == a.user_id ? 'active' : '')" @click="setAutocompleteContactItem(a)">
            <div class="linked-form__field-autocomplete-name" v-html="renderUserRealName(a)"></div>
            <div class="linked-form__field-autocomplete-phone" v-html="a.phone"></div>
          </div>
      </div>
    </div>
    <div class="d-input-val" v-else-if="field.type === 'toggler'">
      <div class="d-input-inner">
        <div v-html="field.title"></div>
        <div class="d-input-val toggler">
          <input v-model="realValue" :id="'d-input-'+id" type="checkbox">
          <label :for="'d-input-'+id" class="lever"></label>
        </div>
      </div>
    </div>
    <div class="d-input-val" v-else-if="field.type === 'float' || field.type === 'int' || field.type === 'numeric'">
      <div class="d-input-inner">
        <div v-html="field.title"></div>
        <input class="d-input-v" type="text" v-model="realValue" :maxlength="field.maxlength ? field.maxlength : 255" :placeholder="field.placeholderVal ? field.placeholderVal : '...'" v-on:keypress="validateInput($event)"  spellcheck="false" autocomplete="off" ref="inputRef">
      </div>
    </div>
    <div class="d-input-val" v-else-if="field.type === 'password' || field.type === 'text' || field.type === 'phone'">
      <div class="d-input-inner">
        <div v-html="field.title"></div>
        <input class="d-input-v" :type="field.type" :maxlength="field.maxlength ? field.maxlength : 255" v-model="realValue" :placeholder="field.placeholderVal ? field.placeholderVal : '...'"  spellcheck="false" autocomplete="off" ref="inputRef">
      </div>
    </div>
    <div class="d-input-val" v-else-if="field.type === 'textarea'">
      <div class="d-input-inner">
        <div v-html="field.title" class="d-input-t"></div>
        <textarea :class="'d-input-v '+(field.cls ? field.cls : '')" :type="field.type" v-model="realValue" :mounted="recalculateTextareaHeight()" @keyup="recalculateTextareaHeight()"  :placeholder="field.placeholderVal ? field.placeholderVal : '...'"  spellcheck="false" autocomplete="off" ref="inputRef">
        </textarea>
      </div>
    </div>
    <div :class="'d-input-val checkbox '+(realValue ? 'checked' : '')" v-else-if="field.type === 'checkbox'">
      <div class="control-checkbox">
        <div class="control-checkbox__body"  @click="realValue = !Boolean(realValue)"></div>
      </div>
    </div>
    <div class="d-input-val" v-else-if="field.type === 'date'">
    <span class="date_field_wrapper js-control-date ">
      <div class="date_field_wrapper--calendar   trigger" @click="openDate()">
        <span v-html="renderSimpleDate(realValue)" v-if="realValue" class="u-mr-xsmall"></span>
        <i class="fa fa-calendar u-text-mute" v-if="!realValue"></i>
      </div>
    </span>
      <datepicker :clear-button="false" ref="dateRef" v-model="realValue"
                  :input-class="'u-hidden'" language="ru"
                  :monday-first="true"></datepicker>
    </div>
    <div class="d-input-val" v-else-if="hasUpload">
      <div class="d-input-inner">
        <div v-html="field.title"></div>
        <div class="d-input-v">
            <span v-html="fileFieldIconValue()" @click="handleFileFieldClick()" ></span>
      </div>

      </div>
    </div>


    <div class="d-input-val" v-else-if="field.type === 'audiogallery'">
     </div>
    <div class="d-input-val" v-else-if="field.type === 'tags'">
      <div class="d-input-inner">
        <div v-html="field.title" class="d-input-t"></div>
        <vue-tags-input class="d-input-v"
          v-model="tagsModel"
          :tags="field.tags"
          :placeholder="field.placeholder ? field.placeholder : '...'"
          :autocomplete-items="filteredTags"
          @tags-changed="tagsChangeHandler"
        >
        </vue-tags-input>
      </div>

    </div>


  </div>
  <div v-show="false" v-if="hasUpload">
    <form ref="uploadFormRef" >
      <input ref="uploadFileRef" type="file" name="file" :accept="acceptance" :multiple="multiple"  />
    </form>
  </div>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker';
  import nselect2 from '@/components/elements/nselect2.vue';
  import Inputmask from 'inputmask';
  import VueTagsInput from '@johmun/vue-tags-input/vue-tags-input/vue-tags-input.vue';
  import sInputValueMixin from '@/mixins/sInputValueMixin.vue';
  export default {
    props: ['field', 'value', 'relatedObject'],
    mixins: [sInputValueMixin],
    data() {
      return {
        realValue: null,
        tagsModel: '',
        process: false,
        users_open: false,
        users: [],
        outsideClicks: 0,
        id: '',
        acceptance: '',
        autocomplete: [],
        showAutocomplete: false,
        isInput: true
      };
    },
    created() {
      this.init();
      this.realValue = this.value;
    },
    mounted() {
      this.id = window.generateId();
      if(this.field.type === 'phone' || this.field.type === 'contact-autocomplete') {
        if(this.$refs.inputRef) {
          let im = new Inputmask('+7 (999)-999-99-99');
          im.mask(this.$refs.inputRef);
          return;
        }
      }
      if(this.field.mask) {
        if(this.$refs.inputRef) {
          let im = new Inputmask(this.field.mask);
          im.mask(this.$refs.inputRef);
        }
      }
    },
    watch: {
      realValue(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      value(n) {
        if(this.realValue !== n) {
          this.realValue = n;
        }
      },
    },
    computed: {
      // filteredSpecialization
      filteredTags() {
        if(!this.field.autocomplete) { return []; }
        return this.field.autocomplete.filter((el) => {
          return (this.tagsModel && this.tagsModel.length) ? (el.text.toLowerCase().indexOf(this.tagsModel.toLowerCase()) !== -1) : true;
        });
      },
      displayInput() {
        if(this.field.type !== 'select' && this.field.type !== 'multiselect') {
          return true;
        }
        if(!this.field.values) { return 0; }
        if(Array.isArray(this.field.values)) {
          if(!this.field.values) { return 0; }
          if(!this.field.values.length) { return 0; }
          return 1;
        }
        return Object.keys(this.field.values).length;
      }
    },
    methods: {
      recalculateTextareaHeight() {
        if(!this.$refs.inputRef) { return; }
        this.$refs.inputRef.style.height = 'auto';
        let h = this.$refs.inputRef.scrollHeight+ 'px';
        this.$refs.inputRef.style.height = h;
      },
      validateInput(e) {
        let v = this.field.type === 'int' ? window.validateNumericInput(e) : window.validateFloatInput(e);
        if(v) { return true; }
        e.preventDefault();
        return false;
      },
      setAutocompleteContactItem(a) {
        this.field.relatedObject[this.field.relatedKey] = a.user_id ? a.user_id : a.company_id;
        this.field.relatedObject.contact_type = a.user_id ? 'contact' : 'company';
        this.realValue = a.phone;
      },
      showAutocompleteContainer() {
        this.showAutocomplete = true;
        $('body').on('click.overlay-input-ac'+this.id, (e) => {
            this.hideAutocompleteContainer();
        });
      },
      hideAutocompleteContainer() {
        this.showAutocomplete = false;
        $('body').off('click.overlay-input-ac'+this.id);
      },
      getTimeoutContacts() {
        if(this.timeoutContacts) { clearTimeout(this.timeoutContacts); }
        this.field.relatedObject[this.field.relatedField] = '';
        this.timeoutContacts = setTimeout(() => {
          this.getContacts();
        }, 200);
      },
      async getContacts() {
        const resp = await $http.post('/get-autocomplete-contacts', { phone: this.realValue });
        if(resp) {
          if(Array.isArray(resp.list)) {
            this.autocomplete = resp.list;
            if(this.autocomplete.length) {
              this.showAutocompleteContainer();
            } else {
              this.hideAutocompleteContainer();
            }
            return;
          }
        }
        this.hideAutocompleteContainer();
        this.autocomplete = [];
      },
      setUser(a) {
        for(let prop in a) {
          this.$set(this.realValue, prop, a[prop]);
        }
      },
      openDropdown() {
        this.users_open = true;
        this.getUsers();
        $('body').on('click.overlay-input-users'+this.id, (e) => {
          if(this.outsideClicks > 0) {
            this.closeUsersDropdown();
            return;
          }
          this.outsideClicks++;

        });
      },
      closeUsersDropdown() {
        this.users_open = false;
        $('body').off('click.overlay-input-users'+this.id);
        this.outsideClicks = 0;
      },
      async getUsers() {
        if(this.users_loading) { return; }
        this.users_loading = true;
        this.users = [];
        let resp = await $http.post('/api/users', {
          usertypes: this.field.usertypes ? this.field.usertypes : null,
        });
        if(resp) {
          if(resp.list) {
            for(let i = 0; i < resp.list.length; i++) {
              resp.list[i].active = false;
              this.users.push(resp.list[i]);
            }
          }
        }
        this.users_loading = false;
      },
      renderUserRealName(user) {
        return window.renderUserRealName(user);
      },
      tagsChangeHandler(a) {
        let finish = [];
        for(let i = 0; i < a.length; i++) {
          finish.push(a[i].text.toString().trim());
        }
        this.realValue = finish.join(', ');
      },
      renderSimpleDate() {
        return window.dateFormatter.reformatDateToDotted(this.realValue);
      },
      openDate() {
        if(this.$refs.dateRef) {
          this.$refs.dateRef.showCalendar();
        }
      },
      calculateTextareaHeight() {
        let length = this.realValue && this.realValue.length ? this.realValue.length : 0;
        let b = Math.ceil(length/43)-1;
        b = b > 0 ? b : 0;
        return (26 + b*19);
      }
    },
    components: {
      Datepicker, nselect2, VueTagsInput
    }
  }
</script>
