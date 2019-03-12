<template>
  <div>
      <div :class="($store.state.user ? 'o-page__content' : '')" id="network-error-wrapper" v-show="$store.state.networkError">
        <div id="network-error">
          <i class="c-alert__icon fa fa-exclamation-circle"></i>
          <span class="network-error-inner">Отсутствует соединение с интернетом</span>
        </div>
      </div>
      <loginFixed v-if="!$store.state.user" ></loginFixed>
      <div v-bind:class="$store.state.page.style" v-else>
        <sidebar  :open="sidebarOpen" />
        <main class="o-page__content">
          <headerElement :pageTitle="$store.state.page.title" :hClass="$store.state.page.headerClass" v-if="$store.state.page.showHeader" />
          <div id="component-state">
            <div class="loading-content">
              <div class="m-loader"></div>
              <span class="u-text-dark">загрузка...</span>
            </div>
          </div>
          <div id="app-inner">
            <router-view ref="routerViewRef" />
          </div>
        </main>
      </div>

      <overlayGallery></overlayGallery>
      <vdialog></vdialog>
  </div>
</template>
<style lang="scss">
  @import "styles/app.scss";
</style>
<script>
  import sidebar from '@/components/elements/sidebar/sidebar.vue'
  import headerElement from '@/components/elements/headerElement.vue'
  import loginFixed from '@/components/elements/loginFixed.vue'
  import preloader from '@/components/elements/preloader.vue';
  import vdialog from './components/elements/vdialog.vue';
  import overlayUserComponent from '@/components/overlayUserComponent.vue';
  import overlayGallery from '@/components/elements/overlayGallery.vue';
  export default {
    data() {
      return {
        sidebarOpen: false,
        loadingEl: null,
      }
    },
    created() {
      this.extendFns();
      this.$socket.app = this;
      this.$socket.init();
      this.$on('toggleSidebar', () => {
        this.sidebarOpen = this.sidebarOpen ? 0 : 1;
      });
    },
    async beforeCreate() {
      await this.$store.dispatch('getAppData');
      await this.$store.dispatch('checkUser');
    },
    async mounted() {

    },
    methods: {
      extendFns() {
        this.$dialog.fns = {
          confirm: (obj) => {
            this.$dialog.confirm('<div class="dg-header">'+obj.title+'</div><div class="dg-body">'+obj.text+'</div>', {
              okText: obj.accept ? obj.accept : 'Да',
              cancelText: obj.denie ? obj.denie : 'Нет',
              html: true,
              cls: obj.cls ? obj.cls : ''
            })
              .then(() => {
                if(obj.confirm) {
                  obj.confirm();
                }
              })
              .catch(() => {
                if(obj.cancel) {
                  obj.cancel();
                }
              });
          },
          error: (obj) => {
            this.$dialog.confirm('<div class="dg-header dg-error-header">'+(obj.title ? obj.title : 'Ошибка')+'</div><div class="dg-body dg-error-body">'+(obj.text ? obj.text : '')+'</div>', {
              okText: obj.accept ? obj.accept : 'Ок',
              cancelText: obj.denie ? obj.denie : 'Нет',
              html: true,
              cls: 'dg-error'
            })
              .then(() => {
                if(obj.confirm) {
                  obj.confirm();
                }
              })
              .catch(() => {
              });
            return;
          }
        }
        /*

  */
      }
    },
    watch: {

    },
    components: {
      headerElement, sidebar, loginFixed, overlayUserComponent, overlayGallery, vdialog
    }
  }
</script>

