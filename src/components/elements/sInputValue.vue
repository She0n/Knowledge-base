<template>
  <sInput :field="field" :relatedObject="relatedObject" v-model="realValue" v-if="access" ></sInput>
  <sValue :field="field" :relatedObject="relatedObject" :value="static_value" :hide="hideValue" v-else></sValue>
</template>
<script>
  import sInput from '@/components/elements/sInput.vue';
  import sValue from '@/components/elements/sValue.vue';
  export default {
    props: {
      field: {},
      value: {},
      relatedObject: {},
      access: {
        default: true
      },
      hideValue: {
        default: false
      },
      static_value: {

      }
    },
    data() {
      return {
        realValue: ''
      };
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
    methods: {

    },
    created() {
      this.realValue = this.value;
    },
    components: {
      sInput, sValue
    }
  }
</script>
