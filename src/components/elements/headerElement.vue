<template>
  <div class="d-header">
    <slot name="left" class="d-header-left"></slot>
    <div v-if="!$slots.left" class="d-header-left">
      <div class="d-none d-lg-block">
      <div class="trigger d-text-dark-hover d-header-left-inner" @click="$router.go(-1)">
        <i class="fa fa-angle-left header-left-base-image"></i>
        <span >Вернуться назад</span>
      </div>
      </div>
      <div class="d-lg-none d-header-left-inner">
        <div class="collapser trigger d-text-dark-hover">collapser</div>
      </div>
    </div>
    <slot name="center" class="d-header-center">

    </slot>
    <div v-if="!$slots.center" class="d-header-center">
      <span v-html="pageTitle"></span>
    </div>

    <slot name="right" class="d-header-right"></slot>
    <div class="d-header-user d-input--info" v-if="$store.state.user">
      <div class="avatar">
        <img class="avatar-img" :src="getAvatar()" onerror="window.setDefaultAvatar(this)">
      </div>
      <!--<dropdown :text="renderUserFirstName($store.state.user)">
        <router-link class="dropdown-item" to="/profile">Профиль</router-link>
        <router-link class="dropdown-item" to="/logout">Выход</router-link>
      </dropdown>-->
    </div>
  </div>
</template>
<style lang="scss">
  .d-header {
    margin-bottom: 20px;
    display: flex;
    border-radius: 5px;
    background: #fff;
    padding: 25px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.03);
    justify-content: space-between;
  }
  .d-header-left {
    display: inline-flex;
    align-items: center;
  }
  .d-header-left-inner {
    display: inline-flex;
    align-items: center;
  }
  .header-left-base-image {
    font-size: 22px;
    margin-right: 18px;
  }
  .d-header-left {
    width: 200px;
  }
  .d-header-user {
    margin-left: 160px;
  }
  .d-header-center {
    font-size: 18px;
    font-weight: 500;
    align-self: center;
    color: #11223e;
  }
  .d-header-user {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: -15px;
      width: 1px;
      height: 26px;
      background-color: rgba(#707070, 0.2);
    }
    .avatar {
      margin-right: 15px;
    }
  }
  .dropdown-toggle {
    font-size: 16px;
    border: none;
    background: transparent;
    padding: 0;
  }
</style>
<script>
  export default {
    props: ['pageTitle', 'hClass'],
    data() {
      return {

      }
    },
    methods: {
      toggleSidebar() {
        this.$parent.$emit('toggleSidebar');
      },
      renderUserFirstName(a) {
        return window.renderUserFirstName(a);
      },
      getAvatar() {
        if(!this.$store.state.user) { return ''; }
        return window.image('/images/xs/'+this.$store.state.user.avatar);
      }
    }
  }
</script>
