<script>
  export default {
    methods: {
      async getAreas() {
        const resp = await $http.post('/get-areas', {city_id: 1});
        if (Array.isArray(resp.list)) {
          this.areas = resp.list;
          let areasByIds = {};
          for (let i = 0; i < this.areas.length; i++) {
            areasByIds[this.areas[i].area_id] = this.areas[i];
          }
          this.areasByIds = areasByIds;
        } else {
          this.areasByIds = {};
        }
      },
    }
  }
</script>
