export default {
  state: {
    tasksLength: {
      all: 0,
      in_progress: 0,
      helping: 0,
      accepting: 0,
      observing: 0,
      projects: 0
    },
  },
  mutations: {
    setTasksLength(state, a) {
      for(let b in a) {
        state.tasksLength[b] = a[b];
      }
    }
  },
  actions: {
    async getTasksLength({ commit }) {
      // const resp = await axios.get('/get-tasks-length');
      const response = await $http.get('/get-tasks-length');
      const resp = {
        data: response
      };
      if(resp) {
        if(typeof resp.tasksLength === 'object' && resp.tasksLength) {
          commit('setTasksLength', resp.tasksLength);
        }
      }
    }
  }
}
