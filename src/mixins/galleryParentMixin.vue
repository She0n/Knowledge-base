<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      callFeedImage(gallery, index) {
        window.gallery.items = gallery;
        window.gallery.setItem(index);
        window.gallery.callModal();
      },
    }
  }
</script>
