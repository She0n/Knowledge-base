import ws from '@/modules/ws';
export default {
  state: {
    crm: {
      channel: '',
      callback: false
    }
  },
  mutations: {
    setCrmChannelData(state, data) {
      if(state.crm.channel) { ws.unsubscribe(state.crm.channel); }
      if(data.channel) { ws.subscribe(data.channel); }
      state.crm.channel = data.channel;
      state.crm.callback = data.callback;
    },
  },
  actions: {

  }

}
