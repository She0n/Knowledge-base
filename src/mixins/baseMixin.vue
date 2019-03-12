
<script>

    const baseMixin = {
        data() {

        },
        beforeMounted() {
          this.startLoading();
        },
        mounted() {
          this.finishLoading();
        },
        methods: {
            startLoading() {
                this.loading = true;
            },
            finishLoading() {
                //document.title = this.meta.title;
                this.loading = false;
            }
        },
    };

    export default baseMixin;
</script>
