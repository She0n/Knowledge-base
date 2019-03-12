<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      async getAccountSummaries(uid, tf, tt) {
        const resp = await $http.post('/api/get-account-summaries', { user_id: uid, time_from: tf, time_to: tt });
        return resp ? resp : {};
      },
      async refreshSummaries() {
        let resp = await this.getAccountSummaries(this.$store.state.user.user_id);
        let summaries = resp.summaries;
        this.setAccountSummaries(summaries);
      },
      setAccountSummaries(summaries) {
        if(summaries) {
          if(summaries.total) {
            for(let prop in summaries.total) {
              this.summaries.total[prop] = summaries.total[prop];
            }
          }
          if(summaries.last_month) {
            for(let prop in summaries.last_month) {
              this.summaries.last_month[prop] = summaries.last_month[prop];
            }
          }
        }
      },
      displayModerateCol(val) {
        if(val) { return 1; }
        if(!this.$store.state.user) { return 0; }
        return this.$store.state.user.canModerate;
      }
    }
  }
</script>
