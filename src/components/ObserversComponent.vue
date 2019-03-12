<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <usersList :usertypes="['observer']" modifyLink="/observers/modify" :isPage="true" v-else />
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import usersList from '@/components/users/usersList.vue';
  let pageData = { title: 'Наблюдатели', metaTitle: 'Наблюдатели', headerClass: 'u-mb-medium' };
  export default {
    mixins: [Component],
    data() {
      return {
        pageData: pageData
      }
    },
    components: {
      usersList
    }
  }
</script>
