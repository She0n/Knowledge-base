<template>
  <div>
    <div class="o-media u-mb-small">
      <div class="o-media__img u-mr-xsmall">
        <div class="c-avatar c-avatar--xsmall">
          <router-link :to="'/users/profile?user_id='+user.user_id" tag="a">
            <img class="c-avatar__img" :src="getAvatar(user.avatar)" onerror="window.setDefaultAvatar(this)">
          </router-link>
        </div>
      </div>
      <div class="o-media__body">
        <router-link :to="'/users/profile?user_id='+user.user_id" tag="a">
          <h6 class="u-text-small u-mb-zero" v-html="renderUserRealName(user)"></h6>
          <p class="u-text-mute u-text-xsmall" v-html="renderProfessionTitle(user)"></p>
        </router-link>
        <div class="drop-related-user trigger" v-if="allowDrop" v-on:click="dropRelatedUser()">&times;</div>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    props: ['user', 'allowDrop', 'dropEv'],
    data () {
      return {};
    },
    methods: {
      dropRelatedUser() {
        if(!this.dropEv) { return; }
        this.$parent.$emit(this.dropEv, this.user);
      },
      renderUserRealName(user) {
        return window.renderUserRealName(user);
      },
      renderProfessionTitle(user) {
        if(!this.$store.getters.getUserTypes[user.usertype]) { return '&nbsp;'; }
        return this.$store.getters.getUserTypes[user.usertype].title;
      },
      getAvatar(a) {
        return window.image('/images/xs/' + a);
      },
    }
  }
</script>
