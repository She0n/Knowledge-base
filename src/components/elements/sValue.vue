<template>
  <div :class="'d-value '+(field.value_cls ? field.value_cls : '')" >
    <div class="d-input-val">
      <div class="d-value-inner">
        <div class="d-value-title" v-html="field.title"></div>
        <div class="d-input-v d-text-dark" v-if="!blur" v-html="renderedValue" @click="handleClick()"></div>
        <div class="skeleton-string" v-else></div>
      </div>
    </div>
  </div>
</template>
<script>
  import sInputValueMixin from '@/mixins/sInputValueMixin.vue';
  export default {
    props: ['field', 'value', 'hide'],
    mixins: [sInputValueMixin],
    data() {
      return {
        textFields: ['password','text','phone','textarea', 'tags', 'float', 'int', 'numeric'],
        selectFields: ['select', 'multiselect'],
        fileFields: ['photo', 'video', 'audio', 'photogallery', 'videogallery', 'audiogallery'],
        hasUpload: false,
        multiple: false,
        isInput: false
      };
    },
    computed: {
      renderedValue() {
        if(this.selectFields.indexOf(this.field.type) !== -1) { return this.selectFieldValue(); }
        if(this.fileFields.indexOf(this.field.type) !== -1) { return this.fileFieldIconValue(); }
        return this.value ? this.value : null;
      },
      blur() {
        if(this.hide) { return 1; }
        if(this.field.type === 'password') { return 1; }
        if(!this.renderedValue) { return 1; }
        if(!this.renderedValue.length) { return 1; }
        if(this.fileFields.indexOf(this.field.type) !== -1) {
          if(!this.value && !this.value.length) { return 1; }
        }
        return 0;
      }
    },
    methods: {
      handleClick() {
        if(this.fileFields.indexOf(this.field.type) !== -1) {
          this.handleFileFieldClick();
        }
      },
      selectFieldValue() {
        let valsByKeys = {};
        if(Array.isArray(this.field.values)) {
          valsByKeys = {};
          this.field.values.forEach((x) => {
            valsByKeys[x[this.field.select_key]] = x;
          });
        } else {
          valsByKeys = this.field.values;
        }
        if(this.field.type !== 'multiselect') { return valsByKeys[this.value] ? valsByKeys[this.value].title : ''; }
        let string = this.placeholderVal;
        if(Array.isArray(this.value)) {
          if(this.value.length) {
            string = '';
            let comma = '';
            for(let i = 0; i < this.value.length; i++) {
              let vbk = valsByKeys[this.value[i]];
              if(!vbk) { continue; }
              string += comma + vbk[this.value[i]].title;
              comma = ', ';
            }
          }
        }
        return string;

      },
      setGalleryItem() {
        this.$store.dispatch('callGallery', [{
          value: this.value,
          type: 'photo',
          fullpath: this.renderImage((this.field.path ? this.field.path : '') + '/'+this.value)
        }]);
      },
      isFieldEmpty(a) {
        return window.isFieldEmpty(a);
      },
      renderDate(a) {
        return window.dateFormatter.reformatDate(a);
      },

    }
  }
</script>
