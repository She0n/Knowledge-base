<template>
  <div :class="'overlay-gallery-wrapper '+($store.state.gallery.isActive ? 'active': '')">
    <div class="overlay-modal-outer-backdrop" @click="$store.dispatch('dismissGallery')"></div>
    <div class="overlay-gallery-inner c-scrollbar">
      <div class="overlay-gallery-container">
        <div v-if="$store.state.gallery.items[$store.state.gallery.activeIndex]" class="overlay-gallery-item-container" id="overlay-gallery-item-container">
          <div class="overlay-gallery-nav overlay-gallery-nav-left" @click="$store.commit('galleryPrevItem')" v-if="$store.state.gallery.items.length > 1"><i class="fa fa-angle-left"></i></div>
              <img :src="$store.state.gallery.items[$store.state.gallery.activeIndex].fullpath" v-if="$store.state.gallery.items[$store.state.gallery.activeIndex].type === 'photo'">
              <div v-if="$store.state.gallery.items[$store.state.gallery.activeIndex].type === 'video'" class="overlay-gallery-audio-player">
              <video :key="'video-gallery-'+$store.state.gallery.activeIndex" controls>
                <source :src="$store.state.gallery.items[$store.state.gallery.activeIndex].fullpath">
              </video>
              </div>
              <div v-if="$store.state.gallery.items[$store.state.gallery.activeIndex].type === 'audio'" class="overlay-gallery-audio-player">
              <audio  controls>
                <source :src="$store.state.gallery.items[$store.state.gallery.activeIndex].fullpath" type="audio/mpeg" >
              </audio>
              </div>
          <div class="overlay-gallery-nav overlay-gallery-nav-right" @click="$store.commit('galleryNextItem')" v-if="$store.state.gallery.items.length > 1"><i class="fa fa-angle-right"></i></div>
        </div>
        <div class="overlay-gallery-comment-container">

          <div id="n-gallery-modal-description" class="u-p-small"><div id="n-gallery-modal-desc-default"><img src="/static/images/fc.png"></div></div>
          <div id="n-gallery-modal-actions" v-if="$store.state.gallery.allowEdit">
            <span class="u-mr-xsmall trigger" @click="$store.state.gallery.addCallback ? $store.state.gallery.addCallback() : 0" v-html="$store.state.gallery.multiple ? 'добавить еще' : 'изменить'"></span>
            <span class="trigger" @click="$store.state.gallery.deleteCallback ? $store.state.gallery.deleteCallback() : 0">удалить</span>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" >
      <div class="modal-overlay-backdrop" @click="$store.dispatch('dismissGallery')" v-if="$store.state.gallery.isActive"></div>
    </transition>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      };
    },
    watch: {
      '$store.state.gallery.isActive'(v) {
        if(v) {
          document.body.classList.add('overlay-gallery-mode');
          this.$store.dispatch('recalculateGalleryMinSize');
        } else {
          document.body.classList.remove('overlay-gallery-mode');
          this.$store.commit('setActiveIndex', -1);
        }
      },
      '$store.state.gallery.activeIndex'() {
        if(this.$store.state.gallery.isActive) {
          this.$store.dispatch('recalculateGalleryMinSize');
        }

      }
    },
    mounted() {
      this.addEvents();
    },
    destroyed() {
      this.removeEvents();
    },
    methods: {
      addEvents() {
        window.addEventListener('resize', this.$store.dispatch('recalculateGalleryMinSize', true));
      },
      removeEvents() {
        window.removeEventListener('resize', this.$store.dispatch('recalculateGalleryMinSize', true));
      },

    }
  }
</script>
