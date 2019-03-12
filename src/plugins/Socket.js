import ws from '@/modules/ws.js';
const Socket = {
  install(Vue, options) {
    Vue.prototype.$socket = ws;
  }
};

export default Socket;

