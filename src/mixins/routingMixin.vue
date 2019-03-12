<script>
  export default {
    methods: {
      makeLink(opts = {}, keep = true) {
        let link = this.$route.path;
        let obj = keep ? Object.assign({}, this.$route.query) : {};
        for(let prop in opts) {
          obj[prop] = (typeof opts[prop] !== 'undefined' && opts[prop]) ? opts[prop] : null;
          if(!obj[prop]) { delete obj[prop]; }
        }
        return link+window.serialize(obj);
      },
    }
  }
</script>
