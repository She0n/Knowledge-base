<script>
  export default {
    data() {
      return {

      };
    },
    methods: {
      setAccountSummaries(summaries) {
        if(!summaries) { return; }
        let indexes = ['total', 'range', 'today', 'last_month'];
        for(let prop in summaries) {
          for(let prop2 in summaries[prop]) {
            this.summaries[prop][prop2] = summaries[prop][prop2];
          }
        }
      },
    }
  }
</script>
