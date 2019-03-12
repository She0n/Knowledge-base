<template>
  <div :class="'tags-c-input-outer '+(cls ? cls : '')" :id="id">
    <div :class="'c-input tags-c-input '+(!(multiple ? false : selected.user_id) ? 'empty' : '')">
      <div v-if="!(multiple ? selected.length : selected.user_id)" class="c-input-placeholder trigger tags-placeholder-span" @click="dropdown = !dropdown" v-html="placeholderVal" ></div>
      <div v-if="!multiple && selected.user_id" class="tags-placeholder-span" @click="dropdown = !dropdown" v-html="renderUserRealName(selected)"></div>
      <div v-if="multiple && selected.length">
              <div class="tags-c-input-empty-space" @click="dropdown = !dropdown"></div>
              <div v-for="user, index in selected" class="tags-c-input-user-tag" @click="selected.splice(index, 1)">
                <div v-html="renderUserRealName(user)"></div>
                <div class="delete-tag-user">×</div>
              </div>
      </div>
      <div v-if="!multiple && showClose" class="vdp-datepicker__clear-button ver2" @click="clearUser()"><i><span>×</span></i></div>
    </div>
    <div class="tags-c-input-dropdown-outer" v-if="dropdown">
      <div class="tags-c-input-dropdown-inner c-scrollbar">
        <div  class="search-input-wrapper">
          <input type="text" class="c-input" v-model="q" placeholder="Поиск по сотрудникам">
          <i class="fa fa-search search-icon"></i>
        </div>
        <div class="tags-c-input-dropdown-content">
          <div :class="'tags-c-input-user '+(user.active ? 'u-hidden' : '')" v-for="user in users" v-if="usersReady && activeUsersLength !== users.length">
            <div class="o-media u-mb-small" @click="selectUser(user)">
              <div class="o-media__img u-mr-small">
                <div class="c-avatar c-avatar--xsmall avatar-over">
                  <img :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
              </div>
              <div class="o-media__body trigger">
                <h6 class=" u-mb-zero u-text-small" v-html="renderUserRealName(user)"></h6>
                <p class="u-text-mute u-text-xsmall" v-html="renderUserType(user)"></p>
                <div class="drop-related-user u-text-dark-hover" @click="$parent.$emit('dropRelatedUser', { list: list, index: index})">-</div>
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
</template>
<script>
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    props: {
      placeholderVal: {
        type: String,
        default: 'Не выбран'
      },
      showClose: {
        type: Boolean,
        default: true
      },
      allowUserTypes: {
        type: Array,
        default: () => [],
      },
      select: {
        type: String,
        default: ''
      },
      force: {
        default: 0
      },
      multiple: {
        type: Boolean,
        default: false
      },
      selected: {

      },
      cls: {
        type: String,
        default: ''
      },
      selectCallback: {

      },
      multipleSelectTitle: {
        type: String,
        default: ''
      },
      inline: false,
      except: {
        type: Array,
        default: () => [],
      }
    },
    mixins: [commonMixin],
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
        selectedUserTypes: [],
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
      users() {
        if(!this.multiple) { return; }
        this.recalculateActiveUsers();
      },
      selected() {
        if(!this.multiple) { return; }
        this.recalculateActiveUsers();
      },
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
        for(let prop in this.selected) {
          this.selected[prop] = '';
        }
      },
      recalculateActiveUsers() {
        let active = 0;
        for(let i = 0; i < this.users.length; i++) {
          this.users[i].active = this.isUserActive(this.users[i]);
          if(this.users[i].active) { active++; }
        }
        this.activeUsersLength = active;
      },
      selectUser(user) {
        if(!this.multiple) {
          for(let prop in this.selected) {
            this.selected[prop] = user[prop];
          }
          if(this.selectCallback) {
            this.selectCallback();
          }
          if(!this.inline) {
            this.hideDropdown();
          }
          return;
        }
        for(let i = 0; i < this.selected.length; i++) {
          if(this.selected[i].user_id === user.user_id) { return; }
        }
        this.selected.push(user);

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
      isUserActive(user) {
        for(let i = 0; i < this.selected.length; i++) {
          if(this.selected[i].user_id === user.user_id) { return 1; }
        }
        return 0;
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
