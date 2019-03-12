<template>
  <div class="c-modal modal fade" id="usersModal" tabindex="-1" role="dialog"
       aria-labelledby="usersModal">
    <div class="c-modal__dialog modal-dialog" role="document">
      <div class="c-modal__content modal-content">
        <header class="c-modal__header dark-header">
          <h1 class="c-modal__title" v-html="title"></h1>
          <span class="c-modal__close" data-dismiss="modal" aria-label="Close">
                                        <i class="fa fa-close"></i>
                                    </span>
        </header>


        <div class="c-modal__body">
          <div class="row">
            <div class="col-12">
              <div class="u-text-center">
                <form onsubmit="return false;" id="users-modal-form">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-4 col-xl-3">
                      <div class="c-field has-icon-right u-mb-medium">
                        <span class="c-field__icon"><i class="fa fa-search"></i></span>
                        <input id="params-users-q" type="text" placeholder="Начните ввод..." name="q" v-model="q" class="c-input">
                      </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-4 col-xl-3" >
                      <div class="u-text-left" v-if="showSelectUserType">
                      <!--
                        <nselect :options="usertypes" :value="selectedUserTypes" :placeholderVal="'Тип пользователя'" :multiple="true" :change="ev"  id="modify-user-type-selector"></nselect>
                      -->
                      </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-4 col-xl-6" v-if="multiple">
                      <div class="u-text-right">
                        <div class="c-btn c-btn--info" @click="emitSelected()" v-html="multipleSelectTitle"></div>
                      </div>
                    </div>
                   </div>
                </form>
              </div>
            </div>
            <div class="col-12 mh-450">
              <div class="delimeter-stripe u-mb-medium"></div>
              <preloader v-if="loading"></preloader>
              <table class="c-table" v-else>
                <thead class="c-table__head c-table__head--slim">
                <tr class="c-table__row">
                  <th class="c-table__cell c-table__cell--head" v-if="multiple"></th>
                  <th class="c-table__cell c-table__cell--head">Имя</th>
                  <th class="c-table__cell c-table__cell--head u-text-center">Телефон</th>
                  <th class="c-table__cell c-table__cell--head u-text-center">Емайл</th>
                </tr>
                </thead>
                <tbody>
                <tr class="c-table__row" v-if="multiple">
                  <td class="c-table__cell modal-cb-cell">
                    <div class="c-choice c-choice--checkbox  abs c-choice--round c-choice--info">
                      <input id="m-user-all" v-model="checkAll"  type="checkbox" class="c-choice__input">
                      <label for="m-user-all" class="c-choice__label  c-choice__label"></label>
                    </div>
                  </td>
                  <td class="c-table__cell" colspan="3">

                  </td>
                </tr>
                <tr class="c-table__row  trigger"  v-for="(user, index) in users" >
                  <td class="c-table__cell modal-cb-cell" v-if="multiple">
                    <div class="c-choice c-choice--checkbox  abs c-choice--round c-choice--info">
                      <input :id="'m-user-'+index" v-model="selectedUsers" :value="user.user_id" type="checkbox" class="c-choice__input">
                      <label :for="'m-user-'+index" class="c-choice__label  c-choice__label"></label>
                    </div>
                  </td>
                  <td class="c-table__cell" v-on:click="emitSelectedUser(user)">
                    <div class="u-color-primary">
                      <div class="o-media">
                        <div class="o-media__img u-mr-xsmall">
                          <div class="c-avatar c-avatar--xsmall">
                            <img class="c-avatar__img" :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)">
                          </div>
                        </div>
                        <div class="o-media__body">
                          <span v-html="renderUserRealName(user)"></span>
                          <small class="u-block u-text-mute" v-html="renderUserType(user)"></small>
                        </div>
                      </div>

                      <small class="u-block u-text-mute"></small>
                    </div>
                  </td>
                  <td class="c-table__cell u-text-center" v-on:click="emitSelectedUser(user)">{{ user.phone ? user.phone : '' }}</td>
                  <td class="c-table__cell  u-text-center" v-on:click="emitSelectedUser(user)">{{ user.email ? user.email : '' }}</td>
                </tr>
                <tr v-if="!users.length">
                  <td colspan="6">
                    <div class="empty-table-error-container u-text-mute u-text-center">Не найдено сотрудников, соответствующих вашему запросу</div>
                  </td>
                </tr>
                <tr v-if="displayShowMoreRow()">
                  <td colspan="6">
                    <div class="u-text-center u-p-medium">
                      <button class="c-btn c-btn--main" v-on:click="completeUsersList()">
                      Показать еще <i class="fa fa-spinner preloader fa-spin fa-fw" v-if="completing" aria-hidden="true"></i></button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div><!-- // .c-plans__body -->

      </div>
    </div>
  </div>
</template>
<script>
  import preloader from '@/components/elements/preloader.vue';
  //import nselect from '@/components/elements/nselect.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    props: ['allowUserTypes', 'title', 'select', 'force', 'multiple', 'multipleSelectTitle', 'except'],
    mixins: [commonMixin],
    data() {
      return {
        loading: false,
        page: 1,
        q: '',
        searchTimeout: null,
        users: [],
        usertypes: [],
        selectedUserTypes: [],
        selectedUsers: [],
        total: 0,
        perPage: 60,
        checkAll: false,
        completing: false,
        ev: 'changeUserType',
        showSelectUserType: true,
      };
    },
    created () {
      this.$on(this.ev, (val) => {
        if(!Array.isArray(this.selectedUserTypes)) {
          this.selectedUserTypes = [val];
          return;
        }
        let index = this.selectedUserTypes.indexOf(val);
        if(index === -1) {
          this.selectedUserTypes.push(val);
        } else {
          this.selectedUserTypes.splice(index, 1);
        }
      });
    },
    mounted() {
      this.renderUserTypeSelector();
    },
    watch: {
      checkAll(v) {
        this.checkAllUsers(v);
      },
      force() {
        this.page = 1;
        this.getUsers();
      },
      selectedUserTypes () {
        this.page = 1;
        this.getUsers();
      },
      usertypes () {

      },
      allowUserTypes () {
        this.page = 1;
        this.renderUserTypeSelector();
        this.getUsers();
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
      emitSelected() {
        $('#usersModal').modal('hide');
        let selectedUsers = [];
        for(let i = 0; i < this.users.length; i++) {
          if(this.selectedUsers.indexOf(this.users[i].user_id) !== -1) {
            selectedUsers.push(this.users[i]);
          }
        }
        this.$parent.$emit(this.select, selectedUsers);
      },
      checkAllUsers(v) {
        let selectedUsers = [];
        if(v) {
          for(let i = 0; i < this.users.length; i++) {
            selectedUsers.push(this.users[i].user_id);
          }
        }
        this.selectedUsers = selectedUsers;
      },
      determineDisplayMode() {
        if(!this.usertypes) { this.showSelectUserType = false; return; }
        if((Object.keys(this.usertypes)).length < 2) { this.showSelectUserType = false; return; }
        this.showSelectUserType = true;
      },
      renderUserTypeSelector() {

        this.determineDisplayMode();
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
          this.selectedUsers = [];
          this.checkAll = false;
        }
        this.completing = defarg;
        let resp = await $http.post('/api/users', {
          usertypes: this.selectedUserTypes.length ? this.selectedUserTypes : this.allowUserTypes,
          p: this.page,
          q: this.q,
          except: Array.isArray(this.except) ? this.except : null
        });
        if(resp.list) {
          for(let i = 0; i < resp.list.length; i++) {
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
      preloader
    }
  }
</script>
