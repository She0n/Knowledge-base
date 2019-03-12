<script>
  export default {
    data() {
      return {
       fastLead: this.getClearFastLead(),
       searchData: this.getClearSearchData(),
       process: false
      }
    },
    methods: {
      getClearFastLead() {
        return {
          title: '',
          price: '',
          first_name: '',
          phone: '',
          email: '',
          contact_id: '',
          contact_type: ''
        };
      },
      getClearSearchData() {
        return {
          q: ''
        }
      }
    }
  }
</script>
