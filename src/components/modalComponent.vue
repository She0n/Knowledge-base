<script>
  export default {
    data() {
      return {};
    },
    methods: {
      renderImage(img) {
        return window.image(img);
      },
      renderUserRealName(user) {
        return window.renderUserRealName(user);
      },
      renderAvatar(img, type) {
        if(!img) { return window.getDefaultAvatar(); }
        let path = '/images/'+(type ? type+'/' : '' )+img;
        return this.renderImage(path);
      },
    }
  }
</script>
