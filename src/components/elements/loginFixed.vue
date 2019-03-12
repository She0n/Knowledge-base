<template>
  <div class="login-fixed-overlay"  v-if="userInitiated">

    <form action="/login" v-on:submit.prevent="login">
      <h1 class="d-mb-20">Вход в систему</h1>
      <div class="form-group d-mb-30">
        <div class="d-label">Ваш логин:</div>
        <div class="iconed-input-wrapper">
        <input class="d-input-cf" type="text" id="login"  v-model="username"
              >
          <i :class="(username && username.length > 3) ? 'fa fa-check-circle d-color-success' : 'fa fa-circle d-text-extra-mute'"></i>
        </div>
      </div>
      <div class="form-group d-mb-30">
        <div class="d-label">Пароль:</div>
        <div class="iconed-input-wrapper">
          <input class="d-input-cf" type="password" id="password"  v-model="password"  >
          <i :class="(password && password.length > 5) ? 'fa fa-check-circle d-color-success' : 'fa fa-circle d-text-extra-mute'"></i>
        </div>
      </div>
      <button class="d-btn d-btn--success d-width-100 d-mb-30 fs-16" type="submit">
        <loader v-if="process"></loader>
        <span :class="process ? 'opacity-0' : ''">Продолжить</span>
      </button>
    </form>
    <div :class="'login-bg '+(loginBgShow ? 'active' : '')" >
      <img src="/static/images/ilustr-login.svg" width="582" height="533">
    </div>
  </div>
</template>
<style lang="scss">
  .login-fixed-overlay {
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 150px;
    justify-content: space-between;
    form {
      width: 400px;
    }
    .d-input-cf {
      font-weight: 500;
    }
    .login-bg {
      transform: translateX(calc(100% + 150px));
      transition: all 1280ms cubic-bezier(.4,0,.2,1);
      &.active {
        transform: translateX(0);
      }
    }
  }
</style>
<script>
  const pageData = {
    title: 'Вход',
    metaTitle: 'Вход',
    headerClass: '',
    style: 'o-page o-page--center hidden-sidebar hidden-header'
  };
  import Component from '@/components/Component.vue';

  export default {
    extends: Component,
    data() {
      return {
        pageData: pageData,
        username: '',
        password: '',

        path: '/api/login',
        process: 0,
        mode: 'login',
        loginBgShow: false,
      }
    },
    mounted() {
      setTimeout(() => {
        this.loginBgShow = true;
      }, 1100);

    },
    computed: {
      userInitiated() {
        return this.$store.state.userInitiated;
      }
    },
    methods: {
      async checkUser() {
        await this.$store.dispatch('checkUser');
      },
      async login() {
        if (this.process) {
          return;
        }
        this.process = 1;
        let resp = (await $http.post('/api/login', {username: this.username, password: this.password}));
        this.process = 0;
        if(resp) {
          if (resp.result) {
            resp.setRefresh = true;
            this.$store.commit('login', resp);
            this.$store.commit('canModerate', resp.user ? resp.user : {});
          } else {
            this.alert({
              title: resp.display,
              icon: 'danger',
              color: 'success'
            });
          }
        }
      }
    }
  }
</script>
