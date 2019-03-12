<script>
  export default {
    methods: {
      makeTaskLink(opts) {
        let params = Object.assign({}, this.$route.query);
        params.mode = 'task';
        if(opts.task_id) {
          params.item_id = opts.task_id;
        } else {
          delete params.item_id;
        }
        return this.$route.path+window.serialize(params);
      },
      clearLinkMode() {
        let params = Object.assign({}, this.$route.query);
        params.mode = 'task';
        if(Object.keys(params).length) {
          delete params.item_id;
          delete params.mode;
        }
        this.modalMode = null;
        return this.$route.path+window.serialize(params);
      },
      getTagCls(a) {
        if(!this.$store.state.taskTags[a]) { return ''; }
        return this.$store.state.taskTags[a].cls;
      },
      getTagTitle(a) {
        let t = this.$store.state.taskTags[a];
        if(!t) { return ''; }
        let f = t.title.substr(0, 3);
        let l = t.title.substr(3, t.length);
        let s = '<span class="u-color-'+t.cls+'">'+f+'</span>'+l;
        return t.title;
        return s;
      },
    }
  }
</script>
