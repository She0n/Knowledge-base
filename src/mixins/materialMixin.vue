<template></template>
<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      async getMaterialById(id) {
        const resp = await $http.post('/get-material', { material_id: id });
        return resp;
      },
      async getMaterialSuggestionById(id, matId) {
        const resp = await $http.post('/get-material-suggestion', { suggestion_id: id, material_id: matId });
        return resp;
      },
    }
  }
</script>
