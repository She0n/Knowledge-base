<template>

</template>
<script>
   export default {
    data () {
      return {

      }
    },
    beforeCreate() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  }
</script>
