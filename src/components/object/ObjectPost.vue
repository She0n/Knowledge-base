<template>

</template>
<script>
  export default {
    props: ['post'],
    data() {
      return {

      };
    },
    methods: {
      renderAuthorAvatar() {
        if(!this.user || !this.user.avatar) { return window.getDefaultAvatar(); }
        return window.image('/images/xs/'+this.user.avatar);
      },
      renderCreatedAt() {
        return window.dateFormatter.reformatDate(this.post.created_at);
      }
    }
  }
</script>
