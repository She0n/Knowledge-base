<script>
  import modalRoutingMixin from '@/mixins/modalRoutingMixin.vue';
  export default {
    mixins: [modalRoutingMixin],
    methods: {
      makeLeadLink(opts) {
        let params = Object.assign({}, this.$route.query);
        params.view = 'lead';
        if(opts.lead_id) {
          params.item_id = opts.lead_id;
        } else {
          delete params.item_id;
        }
        return this.$route.path+window.serialize(params);
      }
    }
  }
</script>
