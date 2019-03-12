<template>
  <form class="d-none">
    <input ref="uploadFileRef" type="file" name="file" :accept="acceptance" @change="callback()" :multiple="multiple"  />
  </form>
</template>
<script>
  export default {
    props: ['field', 'callback'],
    data() {
      return {
        realValue: '',
        multiple: false
      }
    },
    created() {
      if(this.field.type.indexOf('gallery') !== -1) {
        this.multiple = true;
      }
      if(this.field.type.indexOf('photo') !== -1) {
        this.acceptance = window.Uploader.images;
      }
      if(this.field.type.indexOf('video') !== -1) {
        this.acceptance = window.Uploader.video;
      }
      if(this.field.type.indexOf('audio') !== -1) {
        this.acceptance = window.Uploader.audio;
      }
    },
    methods: {
      select() {
        $(this.$refs.uploadFileRef).trigger('click');
      }
    }
  }
</script>
