export default {
  state: {
    isActive: false,
    multiple: false,
    deleteCallback: null,
    addCallback: null,
    items: [],
    allowEdit: false,
    activeIndex: 0
  },
  mutations: {
   setGalleryOpts(state, a) {
    Object.assign(state, a);
    if(!a.deleteCallback) {
      state.deleteCallback = null;
    }
    if(!a.addCallback) {
      state.addCallback = null;
    }
   },
   setGalleryState(state, a) {
    a = state.items.length ? a : false;
    state.isActive = a;
   },
   setActiveIndex(state, a) {
    state.activeIndex = a;
   },
   galleryNextItem(state) {
    let next = state.activeIndex+1;
    if(next > state.items.length-1) {
      next = 0;
    }
    state.activeIndex = next;
   },
   galleryPrevItem(state) {
    let next = state.activeIndex-1;
    if(next < 0) {
      next = state.items.length-1;
    }
    state.activeIndex = next;
   }
  },
  actions: {
    recalculateGalleryMinSize(arg) {
      setTimeout(() => {
        let el = document.getElementById('overlay-gallery-item-container');
        if(!el) { return; }
        let mw = parseInt(el.style.minWidth);
        let mh = parseInt(el.style.minHeight);
        mw = mw ? mw : 0;
        mh = mh ? mh : 0;
        el.style.minWidth = mw > el.clientWidth ? mw+'px' : el.clientWidth+'px';
        el.style.minHeight =  mh > el.clientWidth ? mh+'px' : el.clientHeight+'px';
      }, 350);
    },
    callGallery({ commit }, opts) {
        opts.items = Array.isArray(opts.items) ? opts.items : [];
        commit('setGalleryOpts', opts);
        commit('setActiveIndex', 0);
        setTimeout(() => {
          commit('setGalleryState', true);
        }, 70);

    },
    dismissGallery({ commit }) {
      commit('setGalleryState', false);
    },
  }

}
