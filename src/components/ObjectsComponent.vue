<template>
  <div>
    <ObjectsListComponent :showCreateBtn="true" :isPage="true"></ObjectsListComponent>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import preloader from '@/components/elements/preloader.vue';
  import ObjectsListComponent from '@/components/ObjectsListComponent.vue';
  let pageData = {title: 'Объекты', metaTitle: 'Объекты', headerClass: 'u-mb-medium'};
  export default {
    extends: Component,
    data() {
      return {
        pageData: pageData,
      };
    },
    async created() {

    },
    components: {
      preloader, ObjectsListComponent
    }
  }
</script>
