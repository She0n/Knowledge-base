<template>
  <router-link v-else  :to="link" class="c-sidebar__item"  tag="li">
    <a class="c-sidebar__link menu-item-title"><i v-bind:class="icon"></i>{{title}}</a>
  </router-link>
</template>
<script>
  export default {
    name: 'sidebarItem',
    props: ['title', 'nodes', 'depth', 'node', 'icon', 'link', 'childs', 'isActive', ''],
    data () {
      return { }
    },
    mounted () {

    },
    computed: {
      usertype() {
        return this.$store.state.user.usertype
      }
    },
    methods: {

    }
  }
</script>
