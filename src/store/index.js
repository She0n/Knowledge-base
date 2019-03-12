import Vue from 'vue'
import Vuex from 'vuex'
import chat from './modules/chat';
import ws from './../modules/ws'
import tasks from './modules/tasks';
import subscribe from './modules/subscribe';
import gallery from './modules/gallery';
import dialog from './modules/dialog';
import page from './modules/page';
Vue.use(Vuex);


export default new Vuex.Store({
  modules: { chat,  tasks, subscribe, gallery, page, dialog },
  state: {
    user: null,
    userInitiated: false,
    titleStatement: true,
    usertypes: [],
    professions: [],
    professionsByIds: {},
    objectStatuses: {},
    objectTypes: {},
    buildingTypes: {},
    roughMaterialVolumeTypes: {},
    materialTypes: {},
    volumeTypes: {},
    priceModes: {},
    userstates: [],
    workDayMaxHours: '19',
    workDayMaxMinutes: '00',
    defaultPassword: '*****-',
    defaultUserState: 'is_working',
    taskTags: {},
    loading: false,
    categories: [],
    categoryTree: [],
    categoriesByIds: {},
    categoriesByPath: {},
    canModerate: false
  },
  mutations: {
    loading(state, v) {
      state.loading = v;
    },
    async setAppData(state, resp) {
      let objectKeys = ['usertypes', 'priceModes', 'taskTags', 'objectStatuses', 'objectTypes', 'buildingTypes', 'roughMaterialVolumeTypes', 'volumeTypes', 'materialTypes'];
      let arrKeys = ['professions', ];
      for(let i = 0; i < objectKeys.length; i++) {
        let key = objectKeys[i];
        state[key] = typeof resp[key] === 'object' ? resp[key] : {};
      }
      for(let i = 0; i < arrKeys.length; i++) {
        let key = arrKeys[i];
        state[key] = Array.isArray(resp[key]) ? resp[key] : [];
      }
      let professions = {};
      for(let i = 0; i < state.professions.length; i++) {
        let prof = state.professions[i];
        professions[prof.profession_id] = prof;
      }
      state.professionsByIds = professions;
    },
    canModerate(state, user) {
      let t = user ? user : state.user;
      if(t.usertype === 'admin') {
        state.canModerate = true;
        return;
      }
      if(t.usertype === 'coworker') {
        if(state.professionsByIds[t.profession_id]) {
          if(state.professionsByIds[t.profession_id].permissions) {
            if(state.professionsByIds[t.profession_id].permissions.knowledge_base) {
              if(state.professionsByIds[t.profession_id].permissions.knowledge_base.allowModerate) {
                state.canModerate = true;
              }
            }
          }
        }
      }
    },
    async login(state, response) {
      localStorage.setItem("token", response.token);
      if(response.setRefresh) {
        localStorage.setItem("refresh", response.refresh);
      }
      let sameUser = false;
      if(state.user && response.user) {
        if(state.user.user_id == response.user.user_id) {
          sameUser = true;
        }
      }
      this.dispatch('setUser', response.user);
      state.token = response.token;
      state.userInitiated = true;
      if(!sameUser) {
        ws.authenticate(response.token);
      }
      await this.dispatch('getAllCategories');
    },
    setUser (state, user) {
      state.user = user;
      localStorage.setItem('user_id', user ? user.user_id : 0);
    },
    initiateUser (state) {
      state.userInitiated = true;
    },
    logout(state) {
      this.commit('setInitialState');
      localStorage.setItem('token', null);
      localStorage.setItem('refresh', null);
      localStorage.setItem('user_id', null);
      ws.logout();
    },
    setInitialState(state) {
      state.user = false;
      state.token = false;
      localStorage.setItem('token', null);
      localStorage.setItem('user_id', null);
    },
    titleStatement(state, arg) {
      state.titleStatement = arg;
    },
    setComponentReady(state, val) {
      let comp = $('#app-inner');
      let compState = $('#component-state');
      if(comp.length && compState.length) {
        if(val) {
          compState.show();
          comp.fadeOut(30);
          compState.fadeOut(500, function () {
            comp.fadeIn(670);
          });
        } else {
          compState.show();
          comp.hide();
        }
      }
      state.componentReady = val;
    },
    setModerationLength(state, l) {
      state.moderationLength = l;
    },
    setCategories(state, arr) {
      let categoriesByIds = {};
      let categoriesByPath = {};
      let tree = [];
      for(let i = 0; i < arr.length; i++) {
        let cat = arr[i];
        cat.link = '/wiki/';
        cat.key = cat.category_id;
        cat.childs = [];
        cat.materials = [];
        categoriesByIds[cat.category_id] = cat;
      }
      for(let i = 0; i < arr.length; i++) {
        let cat = arr[i];
        if(!cat.parent_id) { tree.push(cat); cat.link+= cat.alias; continue; }
        if(!categoriesByIds[cat.parent_id]) { continue; }
        categoriesByIds[cat.parent_id].childs.push(cat);
        cat.link += categoriesByIds[cat.parent_id].alias+'/'+cat.alias;
      }
      for(let i = 0; i < arr.length; i++) {
        categoriesByPath[arr[i].link] = arr[i];
      }
      state.categoriesByPath = categoriesByPath;
      state.categoriesByIds = categoriesByIds;
      state.categoryTree = tree;
      state.categories = arr;
    }
  },
  actions: {
    havePermission({ state }, a) {
      if(!state.user) { return 0; }
      if(state.user.usertype === 'admin') { return 1; }
      if(state.user.usertype !== 'coworker') { return 0; }
      if(!state.professionsByIds[state.user.profession_id]) { return 0; }
      if(!state.professionsByIds[state.user.profession_id].permissions[a[0]]) { return 0; }
      return state.professionsByIds[state.user.profession_id].permissions[a[0]][a[1]];
    },
    getAppData: async ({ commit }) => {
      const resp = await window.$http.get('/crm/get-app-data');
      commit('setAppData', resp);
    },
    setComponentReady: ({ commit }, val) => {
      commit('setComponentReady', val);
    },
    checkUser: async ({ commit }) => {
      let response = (await window.$http.post('/api/check-user'));
      if(response.result && response.user) {
        commit('setInitialState');
        commit('canModerate', response.user);
        commit('login', response);
      } else {
        let tokenRefresh = await $http.refreshToken();
        if(tokenRefresh) {
          this.a.dispatch('checkUser');
          return;
        }
        commit('setInitialState');
      }
      commit('initiateUser');
      return response;
    },
    setInitialState: ({ commit }) => {
      commit('setInitialState');
    },
    async changeUserDataProperty({ commit }, prop, val) {
      commit('changeUserDataProperty', prop, val);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      commit('logout');
    },
    async getAllCategories({ commit }) {
      const resp = await $http.get('/get-all-categories');
      commit('setCategories', (Array.isArray(resp) ? resp : []));
    },
    setCategories({ commit }, categories) {
      commit('setCategories', (Array.isArray(categories) ? categories : []));
    },
    async getModerationInfo({ commit }) {
      const resp = await $http.get('/get-data-for-moderation');
      let moderationLength = 0;
      if(resp) {
        if(Array.isArray(resp.materials)) {
          moderationLength += resp.materials.length;
        }
        if(Array.isArray(resp.categories)) {
          moderationLength += resp.categories.length;
        }
        if(Array.isArray(resp.tests)) {
          moderationLength += resp.tests.length;
        }
      }
      commit('setModerationLength', moderationLength);
      return resp ? resp : {};
    }
  },
  strict: false
})
