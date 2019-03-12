<template>
  <div class="c-stage u-mb-small u-p-medium" v-if="((items && items.length) || allowAdd)">
    <div class="project-gallery-wrapper">
      <div class="project-gallery-title u-text-mute u-text-uppercase u-text-small u-mb-xsmall" v-if="title"
           v-html="title"></div>
      <div class="project-gallery-top"><span v-if="allowAdd" class="u-text-mute u-text-small trigger hover-blue" v-on:click="addPhotoDialog()">Добавить фото</span>
      </div>
      <div class="project-gallery-outer">
        <div class="project-gallery-inner">
          <div v-if="!items || !items.length">
            <div class="gallery-no-items-error">
              <div class="u-text-mute u-text-center">
                <i class="fa fa-file-o empty-xl-icon"></i>
                <i class="fa fa-file-o empty-xl-icon"></i>
                <i class="fa fa-file-o empty-xl-icon"></i>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="project-gallery-item" v-for="(item, index) in items">
              <img class="trigger" :src="renderImage(item.image)" v-on:click="callGallery(index)" onerror="window.setDefaultImage(this)">
            </div>
          </div>
        </div>
      </div>
      <div class="project-gallery-bottom">
        <span class="u-text-mute u-text-small trigger underline-hover" v-if="items && items.length" v-on:click="callGallery(0)">Показать все</span>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    props: ['items', 'title', 'ev', 'empty', 'allowAdd'],
    data() {
      return {};
    },
    methods: {
      callGallery(index) {
        window.gallery.items = this.items;
        window.gallery.setItem(index);
        window.gallery.callModal();
      },
      renderImage(name) {
        return window.image('/images/projects/sm/'+name);
      },
      addPhotoDialog() {
        window.Uploader.addCallback(this.addPhotoConfirm);
        window.Uploader.selectFile();
      },
      addPhotoConfirm() {
        if(this.ev) {
          this.$parent.$emit(this.ev);
        }
      },

    },
    components: {

    }
  }
</script>
