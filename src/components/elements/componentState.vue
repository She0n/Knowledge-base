<template>
  <div id="component-state">
    <div class="component-state-preloader">
      <div class="container-fluid">
        <div class="c-stage">
          <div class="c-stage__panel">
            <div>
              <div class="u-text-mute u-text-center">
                  <preloader/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import preloader from '@/components/elements/preloader.vue';
  export default {
    data() {
      return {};
    },
    components: {
      preloader
    }
  }
</script>
