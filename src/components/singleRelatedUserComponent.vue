<template>
  <div>
  <div class="c-field__label c-field-label-material" v-html="title"></div>
  <div class="edit-task-responsible-users-col trigger  u-mb-medium" @click="dropdown = !dropdown">
    <div class="edit-task-responsible-users-col-inner">
      <div class="o-media ">
        <div class="o-media__img u-mr-small">
          <div :class="'c-avatar c-avatar--xsmall avatar-over '+(user.user_id ? '' : 'avatar-no-border')">
            <img :src="!user.user_id ? '/static/images/default-client.png' : renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
        </div>
        <div class="o-media__body">
          <h6 :class="'u-mb-zero u-text-small  '+(user.user_id ? 'u-text-bold u-text-dark' : ' single-row-user-title u-text-mute u-text-small')" v-html="user.user_id ? renderUserRealName(user) : selectTitle"></h6>
          <p class="u-text-mute u-text-xsmall" v-if="user.user_id" v-html="renderUserType(user)"></p>
        </div>
      </div>
    </div>
    <div class="tags-c-input-dropdown-outer" v-if="dropdown">
      <div class="tags-c-input-dropdown-inner c-scrollbar">
        <div  class="search-input-wrapper">
          <input type="text" class="c-input" v-model="q" placeholder="Поиск по сотрудникам">
          <i class="fa fa-search search-icon"></i>
        </div>
        <div class="tags-c-input-dropdown-content">
          <div class="tags-c-input-user" v-for="user in users" v-if="usersReady && activeUsersLength !== users.length">
            <div class="o-media u-mb-small" @click="selectUser(user)">
              <div class="o-media__img u-mr-small">
                <div class="c-avatar c-avatar--xsmall avatar-over">
                  <img :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
              </div>
              <div class="o-media__body trigger">
                <h6 class=" u-mb-zero u-text-small" v-html="renderUserRealName(user)"></h6>
                <p class="u-text-mute u-text-xsmall" v-html="renderUserType(user)"></p>
              </div>
            </div>
          </div>
          <div v-if="usersReady && activeUsersLength === users.length" class="tags-users-empty u-text-mute">
            <div v-html="q ? 'Нет доступных сотрудников соответствующих вашему запросу' : 'Нет доступных сотрудников'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    mixins: [commonMixin],
    props: {
      user: {
        default: () => {
          return {
            user_id: '',
            avatar: '',
            first_name: '',
            last_name: '',
            username: ''
          };
        }
      },
      title: {},
      selectTitle: {},
      selectedUserTypes: {
        type: Array,
        default: () => { return []; }
      },
      inline: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        page: 1,
        q: '',
        no_q_total: 0,
        id: this.generateId(),
        searchTimeout: null,
        users: [],
        usertypes: [],
        total: 0,
        perPage: 80,
        completing: false,
        dropdown: false,
        usersReady: false,
        outsideClicks: 0,
        activeUsersLength: 0,
      };
    },
    created () {
      if(this.inline) {
        this.dropdown = true;
        this.page = 1;
        this.getUsers();
      }
    },
    mounted() {
      this.$el = $('#'+this.id);

    },
    watch: {
      dropdown(v) {
        if(this.inline) { return; }
        if(v) {
          this.showDropdown();
        } else {
          this.hideDropdown();
        }
      },
      q () {
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
          this.page = 1;
          this.getUsers();
        }, 400);
      }
    },
    methods: {
      clearUser() {
        for(let prop in this.user) {
          this.user[prop] = '';
        }
      },
      selectUser(user) {
        for(let prop in user) {
          this.user[prop] = user[prop];
        }

        if(this.selectCallback) {
          this.selectCallback();
        }
        if(!this.inline) {
          this.dropdown = false;
        }
      },
      toggleDropdown() {
        if(this.inline) { return; }
        if(!this.dropdown) {
          this.showDropdown();
        } else {
          this.hideDropdown();
        }
      },
      showDropdown() {
        this.page = 1;
        this.getUsers();
        this.dropdown = true;
        $('body').on('click.tags-users'+this.id, (e) => {
          if(e.target.classList.contains('tags-placeholder-span')) {
            this.hideDropdown();
            return;
          }
          if((e.target.id === this.id) || e.target.closest('#'+this.id)) {
            return;
          }
          this.hideDropdown();
        });
      },
      hideDropdown() {
        this.outsideClicks = 0;
        this.dropdown = false;
        $('body').off('click.tags-users'+this.id);
      },
      generateId() {
        return 'tags-users-'+window.generateId();
      },
      displayShowMoreRow() {
        if(!this.users) { return 0; }
        if(!this.users.length) { return 0; }
        if(this.total <= this.users.length) { return 0; }
        return 1;
      },
      async getUsers(defarg = false) {
        if(this.loading || this.completing) { return; }
        this.loading = !defarg;
        if(this.loading) {
          this.users = [];
          this.checkAll = false;
        }
        this.completing = defarg;
        let resp = await $http.post('/api/users', {
          usertypes: this.selectedUserTypes.length ? this.selectedUserTypes : this.allowUserTypes,
          p: this.page,
          q: this.q,
          except: Array.isArray(this.except) ? this.except : null
        });
        this.usersReady = true;
        if(resp.list) {
          for(let i = 0; i < resp.list.length; i++) {
            resp.list[i].active = false;
            this.users.push(resp.list[i]);
          }
          this.total = resp.total;
          this.perPage = resp.perPage;
        } else {
          this.total = 0;
          this.perPage = 60;
        }
        this.loading = false;
        this.completing = false;
      },
      async completeUsersList() {
        this.page = this.page+1;
        await this.getUsers(true);
      },
      emitSelectedUser (user) {
        if(!this.select) { return; }
        if(!user) { return; }
        $('#usersModal').modal('hide');
        this.$parent.$emit(this.select, user);
      },
      renderUserAvatar(user) {
        if(!user || !user.avatar) { return window.getDefaultAvatar(); }
        return window.image('/images/xs/'+user.avatar);
      },
      renderUserRealName(user) {
        return window.renderUserRealName(user);
      },
      switchGraphicalUserStatus(user) {
        return window.switchGraphicalUserStatus(user);
      }
    },
    components: {

    }
  }
</script>
