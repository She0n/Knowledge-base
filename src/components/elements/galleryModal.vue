<template>
  <div>
  <div class="c-modal c-modal--huge modal fade" id="n-gallery-modal" tabindex="-1" role="dialog"
       aria-labelledby="n-gallery-modal">
    <span class="c-modal__close" data-dismiss="modal" aria-label="Close">&times;</span>
    <div class="c-modal__dialog modal-dialog" role="document" id="n-gallery-modal-dialog">
      <div class="c-modal__content modal-content">
        <div class="n-gallery-modal-body">
          <div class="n-gallery-modal-image-wrapper" id="n-gallery-modal-image-wrapper">
            <div class="n-gallery-modal-image-inner" id="n-gallery-modal-image-inner">
              <div class="n-gallery-preloader-wrapper">
                <i class="m-loader" id="gallery-preloader" aria-hidden="true"></i>
              </div>
              <div class="gallery-control gallery-left-control" onclick="window.gallery.prev()">
                <i class="fa fa-angle-left" id="gallery-left-control" ></i>
              </div>
              <div class="gallery-control gallery-right-control" onclick="window.gallery.next()">
                <i class="fa fa-angle-right" id="gallery-right-control" ></i>
              </div>

              <img src="" id="gallery-modal-image" onerror="window.setDefaultImage(this)">
            </div>
          </div>
          <div class="n-gallery-modal-desc-placeholder"></div>
          <div class="n-gallery-modal-image-desc">
            <div id="n-gallery-modal-desc">
              <div id="n-gallery-modal-owner">
                <div class="o-media">
                  <div class="o-media__img u-mr-xsmall">
                    <div class="c-avatar c-avatar--xsmall">
                    <img id="n-gallery-modal-owner-avatar-image" src=""
                      onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
                  </div>
                  <div class="o-media__body">
                  <span class="u-text-dark" id="n-gallery-modal-owner-name"></span>
                    <small class="u-block u-text-mute" id="n-gallery-modal-owner-profession"></small>
                  </div>
                </div>
              </div>
              <small id="n-gallery-modal-uploaded-at" class="u-block u-text-mute u-text-right u-p-small"></small>
              <div class="u-p-small" id="n-gallery-modal-description"></div>
            </div>
          </div>

        </div><!-- // .c-plans__body -->
      </div>
    </div>

  </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {};
    }
  }
</script>
