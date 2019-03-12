<template>
  <div class="btn-group b-dropdown dropdown" v-click-outside="hide">
    <button aria-haspopup="true" aria-expanded="true" type="button" class="btn btn-secondary dropdown-toggle" @click="toggle" v-if="text" v-html="text"></button>
    <div v-if="$slots.button" @click="toggle()">
      <slot name="button"  ></slot>
    </div>
    <div :class="'dropdown-menu dropdown-menu-right '+(opened ? ' show' : '')" @click="hide()">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import ClickOutside from 'vue-click-outside'
  export default {
    props: ['text'],
    data() {
      return {
        opened: false
      };
    },
    directives: {
      ClickOutside
    },
    methods: {
      toggle () {
        this.opened = !this.opened
      },

      hide () {
        this.opened = false
      }
    }
  }
</script>
