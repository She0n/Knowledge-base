<script>
  export default {
    methods: {
      submitEnter(e, cb) {
        if (e.key !== 'Enter') {
          return;
        }
        if (e.shiftKey !== false) {
          return;
        }
        cb();
      },
    }
  }
</script>
