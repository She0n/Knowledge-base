<script>
  export default {
    data() {
      return { };
    },
    methods: {
      allowDropObject() {
          if(!this.$store.state.user) { return 0; }
          let groups = ['admin', 'superadmin'];
          return groups.indexOf(this.$store.state.user.usertype) !== -1;
      },
      async getObjectById(id) {
        const resp = await $http.post('/objects/get-object', { object_id: id });
        return resp;
      },
      renderObjectStatus(a) {
        let st = this.getObjectStatus(a);
        if(!st) { return ''; }
        return '<i class="fa fa-circle-o u-color-'+st.cls+' u-mr-xsmall"></i> '+st.title;
      },
      renderObjectType(a) {

      },
      getObjectStatus(a) {
        if(!this.$store.state.objectStatuses[a]) { return ''; }
        return this.$store.state.objectStatuses[a];
      }
    },
  }
</script>
