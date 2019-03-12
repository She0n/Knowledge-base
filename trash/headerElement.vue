<template>
  <div v-bind:class="hClass+' c-navbar'">
    <div class="container-fluid">
      <div class="row">

        <header class="c-navbar-2">
          <button class="c-sidebar-toggle js-sidebar-toggle" v-on:click="toggleSidebar()">
            <span class="c-sidebar-toggle__bar"></span>
            <span class="c-sidebar-toggle__bar"></span>
            <span class="c-sidebar-toggle__bar"></span>
          </button>

          <h2 class="c-navbar__title u-mr-auto lh-38" v-html="$store.state.titleStatement ? pageTitle : '&nbsp;'"></h2>


          <div class="pull-right">

          </div>
        </header>
      </div>
    </div>
  </div><!-- // .c-navbar -->
</template>
<script>
  export default {
    props: ['pageTitle', 'hClass'],
    data() {
      return {}
    },
    methods: {
      toggleSidebar() {
        this.$parent.$emit('toggleSidebar');
      },
      getAvatar() {
        if(!this.$store.state.user) { return ''; }
        return window.image('/images/xs/'+this.$store.state.user.avatar);
      }
    }
  }
</script>
