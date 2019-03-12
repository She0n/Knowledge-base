// This is your plugin object. It can be exported to be used anywhere.
const Notify = {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  install(Vue, options) {
    // We call Vue.mixin() here to inject functionality into all components.
    Vue.prototype.$isLoading = false;
    Vue.mixin({
      watch: {
        $isLoading() {
          alert('is l ');
        }
      }

    })

  }
};

export default Notify;
