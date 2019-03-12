export default {
  state: {
      title: '',
      meta: {
        title: '',
      },
      headerClass: '',
      style: '',
      showHeader: true
  },
  mutations: {
    page(state, page) {
      state.title = page.title;
      let metaIsSet = false;
      page.showHeader = typeof page.showHeader === 'undefined' ? true : page.showHeader;
      state.showHeader = page.showHeader;
      if(page.metaTitle) {
        if(page.metaTitle.length) {
          state.meta.title = page.metaTitle;
          metaIsSet = true;
        }
      }
      if(!metaIsSet) {
        state.meta.title = page.title;
      }
      state.headerClass = page.headerClass ? page.headerClass : '';
      state.style = page.style ? page.style : '';
      document.title = state.meta.title;
    },
  }

}
