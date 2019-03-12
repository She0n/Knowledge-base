<script>
  export default {
    methods: {
      clearLinkView() {
        let params = Object.assign({}, this.$route.query);
        delete params.item_id;
        delete params.view;
        this.modalMode = false;
        return this.$route.path+window.serialize(params);
      },
      showCallback() {
        this.parentShowCallback ? this.parentShowCallback() : this.$router.push(this.clearLinkView());
      },
    },
  }
</script>
