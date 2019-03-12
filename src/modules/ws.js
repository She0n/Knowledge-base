import store from '@/store/index.js';
import config from '@/../config-file.js';

const wsServer = 'ws://'+config.auth_server+':9000';
const socketObject = {
  app: null,
  interval: null,
  authed: false,
  connecting: false,
  unauth: ['authenticate'],
  audio: new Audio('/static/audio/tg.mp3'),
  playAudio: function() {
    socketObject.audio.pause();
    socketObject.audio.currentTime = 0.6;
    socketObject.audio.play();
  },
  init () {
    console.log('router is');
    console.log(this.$router);
    socketObject.createActionsMap();
    socketObject.initWs();
  },
  initWs() {
    if(socketObject.connecting) { return; }
    socketObject.connecting = true;
    socketObject.ws = new WebSocket(wsServer);
    socketObject.ws.onopen = socketObject.open;
    socketObject.ws.onclose = socketObject.reconnect;
    socketObject.ws.onmessage = (e) => { socketObject.handleMessage(e); };
  },
  createActionsMap () {
    socketObject.actionsMap = {
      authenticate: socketObject.confirmAuthenticate,
      messageSended: socketObject.messageSended,
      pm: socketObject.newMessage,
      readed: socketObject.readed,
      confirmErr: socketObject.confirmErr,
      logout: socketObject.logoutEmit,
      toChannel: socketObject.toChannelMessage
    };
  },
  toChannelMessage(msg) {
    if(msg.msg.msg === 'refreshLeads') {
      console.log(msg.msg.channel + ' ' +store.state.subscribe.crm.channel);
      if(msg.msg.channel === store.state.subscribe.crm.channel) {
        console.log('proceed');
        if(typeof store.state.subscribe.crm.callback === 'function') {
          store.state.subscribe.crm.callback();
        }
      }
    }
  },
  subscribe(msg) {
    socketObject.send({ type: 'subscribe',  msg: msg });
  },
  unsubscribe(msg) {
    socketObject.send({ type: 'unsubscribe',  msg: msg });
  },
  messageSended(msg) {
    store.dispatch('handleTempMessage', msg);
    store.dispatch('addMessageToDialogs', msg);
  },
  logoutEmit(msg) {
    if(store.state.token) {
      store.dispatch('setInitialState');
    }
  },
  readed(msg) {
    if(!msg.room) { return; }
    let inter = setInterval(() => {
      if(store.state.chat.unreadedDialogsReady) {
        socketObject.readMessages(msg);
        clearInterval(inter);
      }
    }, 120);
  },
  readMessages(msg) {
    store.dispatch('deleteUnreadMessage', msg);
  },
  confirmErr(msg) {

  },
  newMessage(msg) {
    if(!msg.room) { return; }
    if(store.state.chat.activeChat === msg.room) {
      store.dispatch('addMessages', [msg]);
    }
    if(!store.state.user) { return; }
    if(msg.t === store.state.user.user_id) {
      store.dispatch('addUnreadMessage', msg);
      if(msg.sound) {
        socketObject.playAudio();
      }
    }
    store.dispatch('addMessageToDialogs', msg);
  },
  confirmAuthenticate(msg) {
    socketObject.authed = msg.msg;
    if(socketObject.authed) {
      store.dispatch('getUnreadedDialogs');
      store.dispatch('getDialogs');
      store.dispatch('getTasksLength');
    }
  },
  handleMessage (e) {
    if(!e.data) { return; }
    let response;
    try {
      response = JSON.parse(e.data);
    } catch(e) {
      // на самом деле нам плевать на подделки
      return;
    }
    if(!response.type) { return; }
    if(!socketObject.actionsMap[response.type]) { return; }
    socketObject.actionsMap[response.type](response);
  },
  input (e) {
    if(e.key !== 'Enter') { return true; }
    if(e.shiftKey !== false) { return true; }
    return false;
  },
  open() {
    socketObject.connecting = false;
    if(socketObject.interval) { clearInterval(socketObject.interval); socketObject.interval = null; }
    socketObject.authenticate();
  },
  authenticate (t) {
    let token = t ? t : localStorage.getItem('token');
    socketObject.send({ type: 'authenticate', token: token, msg: 1 });
  },
  logout () {
    socketObject.send({ type: 'logout', token: localStorage.getItem('token'), msg: 1 });
  },
  send (msg) {
    if(!socketObject.authed) {
      if(socketObject.unauth.indexOf(msg.type) === -1) { return; }
    }
    socketObject.ws.send(JSON.stringify(msg));
  },
  reconnect () {
    socketObject.authed = false;
    console.log('reconnect');
    if(socketObject.interval) { return; }
    socketObject.interval = setTimeout(() => {
      socketObject.initWs();
    }, 800);
  }
};

export default socketObject;
