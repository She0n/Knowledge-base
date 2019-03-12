<template>
  <div class="chat-form-wrapper">
  <form class="c-chat__composer" v-on:submit.prevent>
      <button class="send-message-btn" v-on:click="submit()"><i class="fa fa-paper-plane-o"></i></button>
      <textarea class="c-input" id="message-textarea-container" v-on:keyup="input($event)"  placeholder="Введите ваше сообщение"></textarea>
  </form><!-- // .c-chat__composer -->
  </div>
</template>
<script>
  export default {
    props: ['submit'],
    data () {
      return { };
    },
    methods: {
      input(e) {
        if(e.key !== 'Enter') { return; }
        if(e.shiftKey !== false) { return; }
        this.submit();
      },
    }
  }
</script>
