import Vue from 'vue'
import store from '@/store/index.js';
export default {
  state: {
    activeChat: false,
    activeChatMessages: [],
    dialogs: [],
    dialogsByIds: {},
    dialogsReady: false,
    unreadedDialogs: {

    },
    unreadedDialogsCount: 0,
    unreadedDialogsReady: false,
    tempMsgs: {

    }
  },
  mutations: {
    addUnreadMessage(state, msg) {
      if(!state.unreadedDialogs[msg.room]) {
        Vue.set(state.unreadedDialogs, msg.room, {});
      } //[msg.room] = {};  }
      state.unreadedDialogs[msg.room][msg.id] = msg.id;
      state.unreadedDialogsCount = Object.keys(state.unreadedDialogs).length;
    },
    deleteUnreadMessage(state, msg) {
      if(!msg.msg) { return; }
      if(!msg.msg.length) { return; }
      let idsToDelete = [];
      for(let i = 0; i < msg.msg.length; i++) {
        idsToDelete.push(parseInt(msg.msg[i]));
      }
      if(state.unreadedDialogs[msg.room]) {
        for(let i = 0; i < msg.msg.length; i++) {
          if(!state.unreadedDialogs[msg.room][msg.msg[i]]) { continue; }
          delete state.unreadedDialogs[msg.room][msg.msg[i]];
        }
        let l = Object.keys(state.unreadedDialogs[msg.room]).length;
        if(!l) { delete state.unreadedDialogs[msg.room]; }
        state.unreadedDialogsCount = Object.keys(state.unreadedDialogs).length;
      }
      let room = msg.room.replace('dialog_room_', '');
      if(state.dialogsByIds[room]) {
        if(!state.dialogsByIds[room].mutate) {
          state.dialogsByIds[room].mutate = 0;
        }
        state.dialogsByIds[room].mutate++;
      }
      if(state.activeChat !== msg.room) { return; }
      if(state.activeChatMessages.length) {
        for(let i = state.activeChatMessages.length-1; i >= 0; i--) {
          let msgId = parseInt(state.activeChatMessages[i].id.toString().replace('message-', ''));
          if(idsToDelete.indexOf(msgId) === -1) { continue; }
          state.activeChatMessages[i].r = 1;
        }
      }
    },
    setActiveChat (state, room, messages) {
      state.activeChat = room;
      state.activeChatMessages = messages ? messages : [];
      state.tempMsgs = {};
    },
    async refreshDialogs(state, dialogs) {
      state.dialogs = dialogs;
      for(let i = 0; i < state.dialogs.length; i++) {
        state.dialogsByIds[state.dialogs[i].room] = state.dialogs[i];
      }
      state.dialogsReady = true;
    },
    addMessages(state, messages) {
      if(!messages) { return; }
      for(let i = 0; i < messages.length; i++) {
        state.activeChatMessages.push(messages[i]);
        if(messages[i].temp_id) {
          state.tempMsgs[messages[i].temp_id] = state.activeChatMessages[state.activeChatMessages.length-1];
          state.tempMsgs[messages[i].temp_id].arr_index = state.activeChatMessages.length-1;
        }
      }
    },
    unshiftMessages(state, messages) {
      if(!messages) { return; }
      for(let i = (messages.length-1); i >= 0; i--) {
        state.activeChatMessages.unshift(messages[i]);
        if(messages[i].temp_id) {
          state.tempMsgs[messages[i].temp_id] = state.activeChatMessages[state.activeChatMessages.length-1];
          state.tempMsgs[messages[i].temp_id].arr_index = state.activeChatMessages.length-1;
        }
      }
    },
    setMessages(state, messages) {
      if(!messages) { return; }
      state.activeChatMessages = messages;
    },
    addMessageToDialogs(state, msg) {
      if(!store.state.user) { return; }
      if(!store.state.user.user_id) { return; }
      let newDialogMsg = {
        f: msg.f,
        t: msg.t,
        r: msg.r,
        msg: msg.msg,
        created_at: new Date(msg.created_at).getTime(),
        room: msg.room.replace('dialog_room_', ''),
        parthner: store.state.user.user_id === msg.f ? msg.to : msg.fr
      };
      if(!state.dialogsByIds[newDialogMsg.room]) {
        state.dialogsByIds[newDialogMsg.room] = newDialogMsg;
        state.dialogs.push(state.dialogsByIds[newDialogMsg.room]);
      } else {
        for(let prop in newDialogMsg) {
          state.dialogsByIds[newDialogMsg.room][prop] = newDialogMsg[prop];
        }
      }
    },
    handleTempMessage(state, msg) {
      if(!state.tempMsgs[msg.temp_id]) { return; }
      if(!state.activeChatMessages[state.tempMsgs[msg.temp_id].arr_index]) { return; }
      state.activeChatMessages[state.tempMsgs[msg.temp_id].arr_index].id = msg.id;
      delete state.activeChatMessages[state.tempMsgs[msg.temp_id].arr_index].temp_id;
    },
    setUnreadedDialogs(state, dialogs) {
      if(dialogs) {
        state.unreadedDialogs = dialogs;
      }
      state.unreadedDialogsReady = true;
      state.unreadedDialogsCount = Object.keys(state.unreadedDialogs).length;
    },
  },
  actions: {
    handleTempMessage: ({ commit }, msg) => {
      commit('handleTempMessage', msg);
    },
    addMessageToDialogs: ({ commit }, msg) => {
      commit('addMessageToDialogs', msg);
    },
    unshiftMessages: ({ commit }, messages) => {
      commit('unshiftMessages', messages);
    },
    addMessages: ({ commit }, messages) => {
      commit('addMessages', messages);
    },
    setActiveChat: ({ commit }, room_id, messages) => {
      commit('setActiveChat', room_id, messages);
    },
    addUnreadMessage({ commit }, msg) {
      commit('addUnreadMessage', msg);
    },
    deleteUnreadMessage({ commit }, msg) {
      commit('deleteUnreadMessage', msg);
    },
    async getUnreadedDialogs({ commit }, msg) {
      let resp = await $http.get('/unreaded-dialogs');
      commit('setUnreadedDialogs', resp);
    },

    getDialogs: async({ commit }) => {
      let response = await $http.get('/dialogs-list');
      let resp = {
        data: response
      };
      if(resp) {
        if(resp) {
          let dialogs = resp.dialogs ? resp.dialogs : [];
          for(let i = 0; i < dialogs.length; i++) {
            dialogs[i].mutate = 1;
          }
          commit('refreshDialogs', dialogs);
          return;
        }
      }
      commit('refreshDialogs', []);
      //resp.dialogs[i].mutate = 1;
    },
  }
}
