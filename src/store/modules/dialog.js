export default {
  state: {
    items: [],
    checkbox: '',
    input: '',
    error: ''
  },
  mutations: {
    addDialogItem(state, a) {
      document.activeElement.blur();
      state.items.push(a);
    },
    removeDialogItem(state) {
      state.items.splice(0, 1);
      state.checkbox = false;
      state.input = '';
      state.error = '';
    },
    setDialogVals(state, opts) {
      for(let prop in opts) {
        state[prop] = opts[prop];
      }
    },
  },


}
