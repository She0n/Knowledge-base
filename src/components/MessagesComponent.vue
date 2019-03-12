<template>
  <div class="messages-wrapper">
    <div class="messages-dialogs-list d-card ">
      <div class="chat-dialogs-list" id="chat-dialogs-list" >
        <div class="d-p-20 d-border-bottom">
          <div class="iconed-input-wrapper">
            <input type="text" class="d-input-cf d-width-100" v-model="dialogsq" placeholder="Поиск по пользователям">
            <i class="fa fa-search"></i>
          </div>
        </div>
        <div id="dialogs-list-wrapper"  >
            <div v-if="!sortedDialogs.length">
              <div v-html="dialogsq ? 'Нет соответствий' : 'Нет доступных собеседников'" class="empty-table-err"></div>
            </div>
            <div id="dialogs-list"  class="d-scrollbar" v-else>
              <div v-for="dialog in sortedDialogs" @mousedown="navigateToParthner(dialog.parthner.user_id)" :class="'d-dialog-item trigger '+($store.state.chat.activeChat === 'dialog_room_'+dialog.room ? 'is-active' : '')" >
                <div class="dialog-item-left">
                  <div class="avatar-wrapper">
                    <span :class="'d-message-counter '+(dialog.parthner.usertype === 'admin' ? 'admin' : '')" v-if="displayUnread(dialog)" v-html="displayUnread(dialog)"></span>
                    <div class="avatar avatar-52">
                      <img class="avatar-img" :src="renderUserAvatar(dialog.parthner)" @error="renderUserAvatarError($event, dialog.parthner)">
                    </div>
                  </div>
                  <div class="dialog-item-user">
                    <div class="d-text-sbold fs-16 d-width-100 d-text-dark"  v-html="renderUserRealName(dialog.parthner)"></div>
                    <div class="fs-12 d-text-dark" v-html="renderUserProfessionSpecialization(dialog.parthner)"></div>
                  </div>
                </div>
                </div>
              </div>
            </div>
        </div>
      </div>

    <!-- END OF LEFT COL -------------------------->
    <div class="messages-chat d-card">
      <div class="chat-header d-border-bottom d-pv-15 d-ph-20" v-if="activeDialog.parthner.user_id">
        <div class="chat-header-back visibility-hidden visibility-xs" @click="$router.push('/messages')">
          <i class="fa fa-angle-left"></i>
        </div>
        <div class="chat-header-right">
          <div class="iconed-input-wrapper">
            <input type="text" class="d-input-cf d-input-underline" v-model="messagesq" placeholder="Поиск по сообщениям">
            <i class="fa fa-search d-text-mute"></i>
          </div>
        </div>
        <!--
         <button class="c-btn c-btn--mute-gray u-hidden-down@tablet" type="button" v-if="showMore"
                  v-on:click="showMoreAction()"> <i class="m-loader m-loader-velvet" v-if="process" aria-hidden="true"></i>показать предыдущие сообщения</button>

        -->
      </div>
      <div class="chat-body">
        <div class="d-no-messages" v-if="!activeChat()">
          <div class="d-chat-error" v-html="renderDialogError()"></div>
        </div>
        <div class="chat-display hidden-scrollbar" :key="'chat-body'" id="chat-body" :mounted="addScrollchatEvent()" ref="chatBodyRef" :id="buildDialogId(activeDialog.parthner.user_id)" v-else>
          <div v-for="message, index in $store.state.chat.activeChatMessages" :class="'chat-message ' +(nextIsSame(index) ? ' next-is-same ' : ' next-is-another ') +(prevIsSame(index) ? ' prev-is-same ' : '') +(prevIsSameDay(index) ? ' prev-is-same-day ' : '') +(message.f === $store.state.user.user_id ? '  ' : 'foreign-msg') + (message.temp_id ? ' undelivered' : '') + (message.r ? '' : (' unreaded-msg ' + (message.temp_id ? '' : unreadedByMe(message.f))))" :id="message.id ? 'message-'+message.id : ''">
                <div class="chat-message-day" v-html="renderDate(message.created_at)"></div>
                <div class="chat-message-content">
                <div class="avatar avatar-medium" v-if="message.f !== $store.state.user.user_id">
                  <img :src="renderAvatar(computeAuthor(message.f).avatar)" class="avatar-img" onerror="window.setDefaultAvatar(this)">
                </div>
                <div class="message-body">
                  <div class="message-body-content" v-html="message.msg"></div>
                  <div class="message-time"  v-html="renderAt(message.created_at)"></div>
                </div>
                </div>
          </div>
        </div>
        <div class="chat-form-wrapper" v-if="activeDialog.access && activeDialog.id">
            <div class="attach-file-btn trigger">
              <img src="/static/images/startup.svg">
            </div>
            <textarea class="c-input" ref="inputRef" id="message-textarea-container" @keyup="submitOnEnter($event); recalculateTextareaHeight(); "  placeholder="Введите ваше сообщение"></textarea>
            <div class="send-message-btn trigger" v-on:click="sendPrivateMessage()">
              <img src="/static/images/startup.svg">
            </div>
        </div>
      </div>
    </div>
    <!-- END OF MID COL -------------------------->
    <div class="messages-active-chat-info d-card">
      <div class="messages-active-chat-user-data">
        <div class="messages-active-chat-avatar">
          <div class="avatar avatar-xlarge d-mb-20">
            <img :src="activeDialog.parthner.user_id ? renderUserAvatar(activeDialog.parthner) : renderUserAvatar()" @error="renderUserAvatarError($event, activeDialog.parthner)" class="avatar-img">
          </div>
        </div>
        <div class="messages-active-chat-username fs-21 d-text-sbold d-text-dark d-mb-6">
          <div v-if="activeDialog.parthner.user_id" v-html="renderUserRealName(activeDialog.parthner)"></div>
          <div class="skeleton-string-lg" v-else></div>
        </div>
        <div class="d-text-dark fs-12" v-html="renderUserProfessionSpecialization(activeDialog.parthner)" v-if="activeDialog.parthner.user_id"></div>
        <div class="skeleton-string" v-else></div>
      </div>
      <div class="messages-active-chat-user-contacts">
        <div class="messages-active-chat-user-contact">
          <div class="key">Телефон</div>
          <div class="value">
            <div :class="!activeDialog.parthner.user_id ? 'skeleton-string' : ''" v-html="activeDialog.parthner.phone ? activeDialog.parthner.phone : (activeDialog.parthner.user_id ? 'не указан' : '')"></div>
          </div>
        </div>
        <div class="messages-active-chat-user-contact">
          <div class="key">Альт. телефон</div>
          <div class="value">
            <div :class="!activeDialog.parthner.user_id ? 'skeleton-string' : ''" v-html="activeDialog.parthner.phone2 ? activeDialog.parthner.phone2 : (activeDialog.parthner.user_id ? 'не указан' : '')"></div>
          </div>
        </div>
        <div class="messages-active-chat-user-contact">
          <div class="key">Email</div>
          <div class="value">
            <div :class="!activeDialog.parthner.user_id ? 'skeleton-string' : ''" v-html="activeDialog.parthner.email ? activeDialog.parthner.email : (activeDialog.parthner.user_id ? 'не указан' : '')"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- END OF RIGHT COL -->
  </div>
</template>
<style lang="scss">
  .avatar-wrapper {
    position: relative;
  }
  .d-message-counter {
    width: 15px;
    height: 15px;
    background-color: #1ad372;
    border-radius: 100%;
    color: #fff;
    text-align: center;
    position: absolute;
    top: 0;
    right: 7.5px;
    font-size: 10px;
    line-height: 16px;
    &.admin {
      background-color: #F7396B;
    }
  }
  .message-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 12px;
    color: #c2c2c2;
    margin-right: 15px;
    order: 1;
  }
  .chat-message-day {
    text-align: center;
    font-size: 14px;
    padding: 20px 0 30px;
  }
  .next-is-same {
    .message-body {
      margin-bottom: 7px;

    }
  }
  .prev-is-same-day {
    .chat-message-day {
      display: none;
    }
  }
  .prev-is-same {
    .avatar {
      visibility: hidden;
    }
  }
  .message-body {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .chat-message-content {
    width: 100%;
    display: flex;
  }
  .foreign-msg {
    .message-body-content {
      background: #eae8ed;
      color: #11223e;
      order: 1;
      text-align: left;
    }
    .avatar {
      margin-right: 30px;
    }
    .chat-message-content {
      justify-content: flex-start;
    }
    .message-body {
      justify-content: flex-start;
    }
    .message-time {
      order: 2;
      margin-left: 15px;
      margin-right: 0;
    }
  }
  .message-body-content {
    background: #4CC68B;
    color: #fff;
    padding: 15px;
    border-radius: 5px;
    min-width: 150px;
    display: inline-block;
    text-align: right;
    order: 2;
    word-break: break-all;
  }
.chat-header {
  .iconed-input-wrapper {
    input {
      min-width: 250px;
      padding: 12px 6px !important;

      &:focus {
        box-shadow: none;
      }
    }
  }
}

.chat-display {
  padding: 30px 20px;
  overflow-y: auto;
  width: 100%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  min-height: 70px;
}
.messages-active-chat-user-contacts {
  padding: 20px 15px;
  font-size: 12px;
}
.messages-active-chat-user-contact {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  .value {
    color: #11223E;
  }
}
  .messages-active-chat-user-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: solid 1px #dbdee2;
    padding-left: 20px;
    padding-right: 20px;
  }
  .dialog-item-left {
    flex-grow: 1;
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
    }
  }
  .d-no-messages {
    flex-grow: 1;
    align-items: center;
    align-content: center;
    display: flex;
    justify-content: center;
  }
  .messages-wrapper {
    display: flex;
  }
  .d-dialog-item {
    padding: 15px 10px 15px;
    display: flex;
    width: 100%;
    border-bottom: solid 1px #dbdee2;
    &.is-active {
      background: #f8f8f8;
    }
  }
  .dialog-item-right {
    font-size: 11px;
    max-width: 60px;
    min-width: 60px;
    text-align: right;
    display: flex;
    align-items: center;
  }
  .messages-dialogs-list {
    min-width: 300px;
    max-width: 300px;
  }
.messages-active-chat-info {
  min-width: 345px;
  max-width: 345px;
}
  .messages-dialogs-list, .messages-active-chat-info, .messages-chat {
    min-height: 85vh;
    max-height: 85vh;
  }
  .messages-active-chat-info {
    padding: 30px 0 ;
    display: flex;
    flex-direction: column;
  }

  .messages-chat {
    flex-grow: 1;
    margin: 0 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

  }
  .chat-body {
    flex-grow: 1;
    display: flex;
    position: relative;
    padding-bottom: 90px;
    overflow-anchor: none;
  }
  .chat-form-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-top: solid 1px #f3f3f3;
    background: #fff;
    textarea {
      flex-grow: 1;
      background: #f8f8f8;
      border: none;
      resize: none;
      padding: 16px 15px;
      overflow: hidden;
      height: 64px;
    }
  }
  .send-message-btn, .attach-file-btn {
    width: 50px;
    min-height: 50px;
    border-radius: 0 5px 5px 0;
    background: #68CD86;
    padding: 14px;
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
    }
  }
  .attach-file-btn {
    border-radius: 5px 0 0 5px;
    background: #d0d0d0;
  }
  #dialogs-list {
    overflow-y: overlay;
    max-height: calc(85vh - 82px);
    position: relative;
  }

</style>
<script>
  import Component from '@/components/Component.vue';
  import preloader from '@/components/elements/preloader.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    extends: Component,
    mixins: [usersMixin, commonMixin],
    data() {
      return {
        // dialogs list
        messagesq: '',
        parthners: {},
        rooms: [],
        dialogsq: '',
        lastScrollBottom: 0,
        chatInitiated: false,
        process: false,
        loadingMessages: false,
        // messages
        windowWidth: window.innerWidth,
        windowFocus: true,
        activeDialog: {
          id: 0,
          first: 0,
          parthner: this.getClearParthner(),
          access: 1
        },
      };
    },
    beforeCreate() {
      this.$store.dispatch('setComponentReady', false);
    },
    created() {

    },
    async mounted() {
      await this.detectChat();
      this.$store.dispatch('setComponentReady', true);
      setTimeout(() => {
        this.addScrollEvent();
      }, 100);
    },
    beforeDestroy() {
      this.dropScrollEvent();
    },
    watch: {
      '$route.fullPath'() {
        this.detectChat();
      },
      pageData() {
        this.page();
      },
      activeChatMessagesLength() {
        if(!this.chatInitiated) { return; }
        setTimeout(() => {
          this.scrollHeightOnMessage();
        }, 100);
      },
    },
    computed: {
      pageData() {
        return {title: 'Сообщения', metaTitle: 'Сообщения '+(this.$store.state.chat.unreadedDialogsCount ? '('+this.$store.state.chat.unreadedDialogsCount+')' : ''), headerClass: 'u-mb-medium', style: 'messages-page'};
      },
      activeChatMessagesLength() {
        if(!this.$store.state.chat.activeChatMessages) { return 0; }
        return this.$store.state.chat.activeChatMessages.length;
      },
      showMore() {
        if(!this.$store.state.chat.activeChatMessages) { return 0; }
        if(!this.$store.state.chat.activeChatMessages.length) { return 0; }
        if(!this.activeDialog.first) { return 0; }
        if(!this.$store.state.chat.activeChatMessages[0].id) { return 0; }
        if(this.$store.state.chat.activeChatMessages[0].id > this.activeDialog.first) { return 1; }
        return 0;
      },
      sortedDialogs() {
        let dialogs = JSON.parse(JSON.stringify(this.$store.state.chat.dialogs));
        dialogs = dialogs.filter((el) => {
          let u = el.parthner ? ((!this.isFieldEmpty(el.parthner.first_name) || !this.isFieldEmpty(el.parthner.last_name)) ? (el.parthner.first_name + ' '+ el.parthner.last_name) : el.parthner.username) : '';
          return (this.dialogsq && this.dialogsq.length) ? ((u).toLowerCase().indexOf(this.dialogsq.toLowerCase()) !== -1) : true;
        });
        let res = dialogs.sort((a, b) => {
          a.created_at = new Date(a.created_at ? a.created_at : '1970-01-01').getTime();
          b.created_at = new Date(b.created_at ? b.created_at : '1970-01-01').getTime();
          if (a.created_at > b.created_at) {
            return -1;
          }
          if (a.created_at < b.created_at) {
            return 1;
          }
          return 0;
        });
        return res;
      },
    },
    methods: {
      renderAt(ts) {
        return window.dateFormatter.renderAt(ts);
      },
      recalculateTextareaHeight() {

        if(!this.$refs.inputRef) { return; }
        this.$refs.inputRef.style.height = 'auto';
        let h = this.$refs.inputRef.scrollHeight+ 'px';
        this.$refs.inputRef.style.height = h;
      },
      scrollHeightOnMessage() {
        if(this.$refs.chatBodyRef.scrollHeight - this.$refs.chatBodyRef.scrollTop > 100) { return; }
        this.$refs.chatBodyRef.scrollTop = this.$refs.chatBodyRef.scrollHeight;
      },

      renderDialogError() {
        if(!this.activeDialog.id) { return 'Выберите собеседника'; }
        if(!this.activeDialog.access) { return 'У вас нет доступа к этому чату'; }
        return 'Нет сообщений';
      },
      navigateToParthner(uid) {
        this.$router.push('/messages?p='+uid);
      },
      async detectChat() {
        this.chatInitiated = false;
        let p = parseInt(this.$route.query.p);
        if(p) {
          await this.activateChat({ parthner_id: p });
        } else {
          this.clearActiveChat();
          this.$store.dispatch('setActiveChat', false);
        }
      },
      activeChat() {
        return this.$store.state.chat.activeChatMessages.length && this.activeDialog.parthner.user_id;
      },
      nextIsSame(index) {
        let next = index+1;
        if(this.$store.state.chat.activeChatMessages.length <= next) { return 0; }
        return this.$store.state.chat.activeChatMessages[index].f == this.$store.state.chat.activeChatMessages[next].f;
      },
      prevIsSameDay(index) {
        if(!index) { return 0; }
        if(this.$store.state.chat.activeChatMessages[index-1].next_portion) { return 0; }
        let f = window.dateFormatter.reformatDateToDotted(this.$store.state.chat.activeChatMessages[index].created_at);
        return f === window.dateFormatter.reformatDateToDotted(this.$store.state.chat.activeChatMessages[index-1].created_at);
      },
      prevIsSame(index) {
        if(!index) { return 0; }
        let f = this.$store.state.chat.activeChatMessages[index].f;
        return f === this.$store.state.chat.activeChatMessages[index-1].f;
      },
      computeAuthor(id) {
        return (id === this.$store.state.user.user_id) ? this.$store.state.user : this.activeDialog.parthner;
      },
      unreadedByMe(f) {
        if(!this.$store.state.user) { return ''; }
        return (f !== this.$store.state.user.user_id) ? ' unreaded-msg-by-me ' : '';
      },
      async showMoreAction() {
        if(!this.showMore) { return; }
        if(!this.$store.state.chat.activeChatMessages) { return 0; }
        if(!this.$store.state.chat.activeChatMessages.length) { return 0; }
        if(this.process) { return 0; }
        let start = this.$store.state.chat.activeChatMessages[0].id;
        this.process = 1;
        $(this.$refs.chatBodyRef).css({ overflowY: 'hidden' });
        let resp = await $http.get('/get-chat', { part: this.activeDialog.parthner.user_id, start: start });
       // return;
        if(resp) {
          if(resp.messages) {
            resp.messages[resp.messages.length - 1].next_portion = true;
            await this.$store.dispatch('unshiftMessages', resp.messages);
            setTimeout(() => {
              this.loadingMessages = 0;
              this.process = 0;
              this.$refs.chatBodyRef.scrollTop = this.$refs.chatBodyRef.scrollHeight - this.lastScrollBottom;
              $(this.$refs.chatBodyRef).css({ overflowY: 'auto' });
            }, 0);
            return;
          }
        }
        this.loadingMessages = 0;
        this.process = 0;
        $(this.$refs.chatBodyRef).css({ overflowY: 'auto' });
      },
      buildDialogId(a) {
        if(!this.$store.state.user) { return false; }
        if(!this.$store.state.user.user_id) { return false; }
        return 'dialog_room_' + (a > this.$store.state.user.user_id ? this.$store.state.user.user_id+'_'+a : a+'_'+this.$store.state.user.user_id);
      },
      clearActiveChat() {
        this.activeDialog.parthner = JSON.parse(JSON.stringify(this.getClearParthner()));
        this.activeDialog.id = 0;
        this.activeDialog.first = 0;
        this.activeDialog.access = 0;
        this.mode = 'list';
      },
      async activateChatByParthner(uid) {
        let dialogId = this.buildDialogId(uid);
        if(!dialogId) {
          this.clearActiveChat();
          return;
        }
        this.activateChat({ parthner_id: uid });
      },
      async getParthner(uid) {
        let resp = await $http.get('/api/users/profile?user_id=' + uid+'&f=a');
        if (resp) {
          if (resp.result) {
            let fields = ['avatar', 'profession_id', 'first_name', 'last_name', 'third_name', 'email', 'phone', 'phone2', 'usertype'];
            for (let i = 0; i < fields.length; i++) {
              this[fields[i]] = resp.user[fields[i]];
            }
            this.activeDialog.parthner = resp.user;
            return;
          }
        }
        this.activeDialog.parthner = this.getClearParthner();
      },
      getClearParthner() {
        return {
          user_id: 0,
          username: '',
          first_name: '',
          last_name: '',
          usertype: '',
          specialization: '',
          profession_id: 0,
          phone: '',
          email: '',
          phone2: ''
        };
      },
      async getMessages(uid) {
        this.loadingMessages = true;
        let resp = await $http.get('/get-chat?part='+uid);
        if(resp) {
          if(resp.messages) {
            this.loadingMessages = 0;
            let dialogId = this.buildDialogId(this.activeDialog.parthner.user_id);
            this.$store.dispatch('setActiveChat', dialogId);
            this.$store.dispatch('addMessages', resp.messages);
            this.mode = 'dialog';
            this.activeDialog.id = dialogId;
            this.activeDialog.first = resp.first;
            this.activeDialog.access = true;
            this.loadingMessages = 0;
            return;
          }
        }
        this.loadingMessages = 0;
      },
      async activateChat(opts) {
        await this.getParthner(opts.parthner_id);
        if(!this.activeDialog.parthner) {
          return;
        }
        await this.getMessages(opts.parthner_id);
        setTimeout(() => {
          this.scrollChatBottom();
          this.chatInitiated = 1;
        }, 20);
      },
      submitOnEnter(e) {
        if(e.key !== 'Enter') { return; }
        if(e.shiftKey !== false) { return; }
        this.sendPrivateMessage();
      },
      sendPrivateMessage() {
        if(this.$store.state.user.demo) {
          this.$dialog.fns.error({
            title: '<i class="fa fa-warning u-mr-xsmall u-color-warning u-text-small"></i>Ошибка',
            text: 'Демо пользователь не может отправлять сообщения'
          });
          return;
        }
        if(!this.$socket) { return; }
        let msgContainer = document.getElementById('message-textarea-container');
        if(!msgContainer) { return; }
        let msgv = msgContainer.value;
        if(!msgv) { return; }
        msgv = msgv.toString().trim();
        if(!msgv.length) {
          msgContainer.value = '';
          return;
        }
        try {
          msgv = handleMessage(msgv);
        } catch(e) { return; }
        let id = this.generateId();
        let msg = {
          id: id,
          type: 'pm',
          t: this.activeDialog.parthner.user_id,
          f: this.$store.state.user.user_id,
          msg: msgv,
          temp_id: id,
          created_at: new Date(),
          r: 0
        };
        this.$store.dispatch('addMessages', [msg]);
        let send = Object.assign({}, msg);
        send.msg = msgContainer.value;
        msgContainer.value = '';
        this.$socket.send(send);
        setTimeout(() => {
          this.scrollChatBottom();
        }, 50);
      },
      scrollChatBottom() {
        let $el =  $(this.$refs.chatBodyRef);
        if(!$el.length) { return; }
        let el = $el[0];
        el.scrollTop = el.scrollHeight;
        this.lastScrollBottom = el.scrollHeight;
        console.log('sb'+this.lastScrollBottom);
      },
      collectViewportMessagesToRead() {
        let msgs = document.getElementsByClassName('unreaded-msg-by-me');
        if(!msgs.length) { return {}; }
        let res = [];
        for(let i = 0; i < msgs.length; i++) {
          if(!window.isAnyPartOfElementInViewport(msgs[i])) { continue; }
          res[msgs[i].id] = msgs[i];
        }
        return res;
      },
      calculateNewScrollBottom() {
        return this.$refs.chatBodyRef.scrollHeight - this.$refs.chatBodyRef.scrollTop;
      },
      scrollChat(opts = {}) {
        if(!this.windowFocus) { return; }
        let nsb = this.calculateNewScrollBottom();

        if (nsb > this.lastScrollBottom) {
           if(this.$refs.chatBodyRef.scrollTop === 0 && !opts.showMoreIgnore) {
            if(this.chatInitiated) {
              this.showMoreAction();
            }
          }
        }
        let collectedMessages = this.collectViewportMessagesToRead();
        if(Object.keys(collectedMessages).length) {
          if(this.readTimeout) { clearTimeout(this.readTimeout); }
          this.readTimeout = setTimeout(() => {
            let msg = { type: 'read', msg: [] };
            for(let prop in collectedMessages) {
              msg.msg.push(prop.replace('message-', ''));
            }
            if(msg.msg.length) {
              this.$socket.send(msg);
            }
          }, 150);
        }
        this.lastScrollBottom = nsb;
      },
      addScrollEvent() {
        window.addEventListener('focus', this.focusWindow);
        window.addEventListener('blur', this.blurWindow);
      },
      addScrollchatEvent() {
        setTimeout(() => {
          $(this.$refs.chatBodyRef).on('scroll', this.scrollChat);
        }, 100);
      },
      focusWindow() {
        this.windowFocus = true;
        setTimeout(() => {
          this.scrollChat({ showMoreIgnore: true });
        }, 70);
      },
      blurWindow() {
        this.windowFocus = false;
      },
      dropScrollEvent() {
        window.removeEventListener('blue', this.blurWindow);
        window.removeEventListener('focus', this.focusWindow);
      },

      displayUnread(dialog) {
        if (!this.$store.state.chat.unreadedDialogs['dialog_room_' + dialog.room]) {
          return 0;
        }
        let l = Object.keys(this.$store.state.chat.unreadedDialogs['dialog_room_' + dialog.room]).length;
        console.log(dialog.room + ' --|'+l);
        return l;
      },
      isDialogWriterSelf(dialog) {
        if (!this.$store.state.user) {
          return 0;
        }
        if (dialog.f === this.$store.state.user.user_id) {
          return 1;
        }
        return 0;
      },
      async init() {
        setTimeout(() => {

          this.addScrollEvent();
        }, 400);
      },
      renderMessageDate(time) {
        return window.dateFormatter.reformatDate2(time);
      },

    },
    components: {
      preloader
    }
  }
</script>
