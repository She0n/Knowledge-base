<template>

  <div :class="'c-chat__message o-media' +(message.f === $store.state.user.user_id ? ' my-msg ' : '') + (message.temp_id ? ' undelivered' : '') + (message.r ? '' : (' unreaded-msg ' + (message.temp_id ? '' : unreadedByMe(message.f))))" :id="message.id ? 'message-'+message.id : ''">
    <div class="chat-message-inner">
      <div class="o-media__img u-mr-small">
        <div class="c-avatar c-avatar--xsmall">
          <div class="c-avatar__img">
            <img :src="renderAvatar(user.avatar)" class="c-avatar__img" onerror="window.setDefaultAvatar(this)">
          </div>
        </div>
      </div><!-- // .o-media__img -->

      <div class="o-media__body">
        <p class="c-chat__message-content" v-html="message.msg"></p>
       <!-- <span class="c-chat__message-time" v-html="renderMessageDate(message.created_at)"></span> -->

      </div><!-- // .o-media__body -->
    </div>
  </div>

</template>
<script>
  export default {
    props: {
      user: {
        type: Object,
        default: { }
      },
      message: {
        type: Object,
        default: { }
      }
    },
    data () {
      return { };
    },
    methods: {
      renderRealUserName(user) {
        return window.renderUserRealName(user);
      },

      renderAvatar(x) {
        return window.image('/images/sm/'+x);
      },
      renderMessageDate(time) {
        return window.dateFormatter.reformatDate(time, 1);
      }
    }
  }
</script>
