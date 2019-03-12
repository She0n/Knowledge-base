<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div class="container-fluid worker-page" v-else>
        <div class="row d-card flex-nowrap">
          <div class="worker-left-col">
            <div class="user-short-info d-p-20">
              <div class="avatar avatar-large">
                <img :src="renderUserAvatar(activeUser)" v-on:click="activeTab === 'settings' ? changeAvatarDialog() : 0" @error="renderUserAvatarError($event, activeUser)" :class="'avatar-img '+(activeTab === 'settings' ? 'trigger' : '')">
                <sForm ref="avatarFormRef" :field="{ type: 'photo' }" :callback="confirmChangeAvatar"></sForm>
              </div>
              <div class="info">
                <div class="fs-25 d-text-dark d-text-bold d-mb-5" v-html="renderUserInitials(activeUser)"></div>
                <div class="fs-14" v-html="'На сайте с '+renderDate(user.created_at)" v-if="user.created_at"></div>
              </div>
              <div :class="'profile-edit-icon-wrapper  trigger '+(activeTab === 'settings' ? ('d-border-'+color) : '')" v-if="activeTab !== 'settings' && allowModifyUser(edit_user)" @click="toggleEditMode()">
                <img :src="'/static/images/pencil'+(activeTab === 'settings' ? ('-'+color) : '')+'.svg'" >
              </div>
            </div>
            <div class="worker-col-inner d-p-20">
              <div v-if="$store.state.usertypes[edit_user.usertype] && !$store.state.usertypes[edit_user.usertype].nologin">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Пользователь в системе</div>
                <sInputValue :field="{ type: 'text', title: 'Логин' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" v-model="edit_user.username" :static_value="user.username" class="d-mb-10"></sInputValue>
                <sInputValue :field="{ type: 'password', title: 'Пароль' }" :access="activeTab === 'settings'" v-model="edit_user.password" :static_value="user.password" class="d-mb-10"></sInputValue>
                <sInputValue :style="activeTab !== 'settings' ? 'opacity: 0' : ''" :field="{ type: 'password', title: 'Повторите пароль' }" :static_value="user.password" :access="activeTab === 'settings'" v-model="edit_user.password2"></sInputValue>
              </div>
              <div :class="'d-text-right d-mb-20 ' +($store.state.usertypes[edit_user.usertype] && !$store.state.usertypes[edit_user.usertype].nologin ? 'd-mt-20' : '')" v-if="activeTab === 'settings'">
                <button class="d-btn d-btn--success" @click="modifyUser()">сохранить</button>
                <button class="d-btn d-btn--secondary" v-if="user.user_id" @click="toggleEditMode()">отменить</button>
              </div>
              <div class="d-delimeter d-mt-20 d-mb-20 right-anti-20" v-if="$store.state.usertypes[edit_user.usertype] && !$store.state.usertypes[edit_user.usertype].nologin"></div>
              <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Основная информация</div>
              <sInputValue :field="{ type: 'text', title: 'Фамилия' }" v-model="edit_user.last_name" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.last_name" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'text', title: 'Имя' }" v-model="edit_user.first_name" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.first_name" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'text', title: 'Отчество' }" v-model="edit_user.third_name" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.third_name" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'text', title: 'Дата рождения', mask: '99.99.9999', placeholderVal: 'дд.мм.гггг' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.birthday" v-model="edit_user.birthday" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'int', title: 'Дети' }" v-model="edit_user.children" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.children" class="d-mb-10"></sInputValue>
              <div class="d-delimeter d-mt-20 d-mb-20 left-anti-20"></div>
              <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Паспорт</div>
              <sInputValue :field="{ type: 'text', title: 'Серия и номер', mask: '9999 999999' }" v-model="edit_user.passport_data.series" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1) && allowWatchConfidencialInformation(edit_user))" :static_value="user.passport_data.series" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'text', title: 'Дата выдачи', mask: '99.99.9999', placeholderVal: 'дд.мм.гггг' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1)  && allowWatchConfidencialInformation(edit_user))" :static_value="user.passport_data.date" v-model="edit_user.passport_data.date" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'text', title: 'Код подразделения', mask: '999-999', }" v-model="edit_user.passport_data.code" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1)  && allowWatchConfidencialInformation(edit_user))" :static_value="user.passport_data.code" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'textarea', title: 'Кем выдан' }" v-model="edit_user.passport_data.author" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1)  && allowWatchConfidencialInformation(edit_user))" :static_value="user.passport_data.author" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'textarea', title: 'Регистрация' }" v-model="activeUser.passport_data.registration" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1)  && allowWatchConfidencialInformation(edit_user))" :static_value="user.passport_data.registration" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'photo', title: 'Фото главной страницы', path: '/images/passports', uploadPath: '/api/users/modify/upload-photo' }" v-model="activeUser.passport_data.photo1" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.passport_data.photo1" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
              <sInputValue :field="{ type: 'photo', title: 'Фото регистрации', path: '/images/passports', uploadPath: '/api/users/modify/upload-photo' }" v-model="activeUser.passport_data.photo2" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :static_value="user.passport_data.photo2" :hideValue="!allowWatchConfidencialInformation(edit_user)" class="d-mb-10"></sInputValue>
            </div>
          </div>
          <div class="worker-mid-col">
            <div class="worker-col-inner">
              <div class="d-p-20">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Рабочие моменты</div>
                <sInputValue class="d-mb-10" :static_value="user.profession_id" v-model="edit_user.profession_id" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :field="{ type: 'select', title: 'Должность', select_key: 'profession_id', nullable: true, values: $store.state.professions }"></sInputValue>
                <sInputValue class="d-mb-10" :static_value="user.specialization"  :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :field="{ type: 'tags', title: 'Специализация', tags: baseSpecializationTags }" v-model="edit_user.specialization"></sInputValue>

                <sInputValue class="d-mb-10" :static_value="user.instrument" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :field="{ type: 'tags', title: 'Инструмент', tags: baseInstrumentTags, autocomplete: autocompleteInstruments }" v-if="edit_user.usertype === 'workman'" v-model="edit_user.instrument"></sInputValue>
                <sInputValue class="d-mb-10" :static_value="user.expirience" v-model="edit_user.expirience" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))"  :field="{ type: 'float', title: 'Опыт работы', maxlength: 2 }"></sInputValue>
                <sInputValue :static_value="user.test_results" v-model="edit_user.test_results" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" :field="{ type: 'textarea', title: 'Анализ теста' }"></sInputValue>
              </div>
              <div class="d-delimeter "></div>
              <div class="d-p-20">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Связь</div>
                <sInputValue class="d-mb-10" :static_value="user.phone" v-model="edit_user.phone"  :field="{ type: 'phone', title: 'Телефон' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 0))"></sInputValue>
                <sInputValue class="d-mb-10" :static_value="user.phone2" v-model="edit_user.phone2" :field="{ type: 'phone', title: 'Альт. телефон' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 0))"></sInputValue>
                <sInputValue class="d-mb-10" :static_value="user.email" v-model="edit_user.email" :field="{ type: 'text', title: 'Основная почта' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 0))"></sInputValue>
              </div>
              <div class="d-delimeter"></div>
              <div class="d-p-20">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Проживание</div>
                <sInputValue class="d-mb-10" :static_value="user.birthplace_city" v-model="user.birthplace_city" :field="{ type: 'text', title: 'Город рождения' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))" ></sInputValue>
                <sInputValue class="d-mb-10" :static_value="user.fact_address" v-model="user.fact_address" :field="{ type: 'text', title: 'Адрес жительства' }" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1) && allowWatchConfidencialInformation(edit_user))" :hideValue="!allowWatchConfidencialInformation(edit_user)"></sInputValue>
              </div>
            </div>
          </div>
          <div class="worker-right-col" v-if="user.description || user.comment || activeTab === 'settings'">
            <div class="worker-col-inner d-p-20">
              <div v-if="activeTab === 'settings' || user.description" class="d-mb-20">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Характеристика работника</div>
                <sInputValue :field="{ type: 'textarea', title: 'Характеристика', cls: 'mh-160', value_cls: 'value-title-hidden value-title-hidden-left value-mute mh-160' }" :static_value="user.description" v-model="edit_user.description" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))"></sInputValue>
              </div>
              <div v-if="activeTab === 'settings' || user.comment">
                <div class="fs-18 d-text-sbold d-text-dark d-mb-20">Примечание</div>
                <sInputValue :field="{ type: 'textarea', title: 'Примечание', cls: 'mh-160', value_cls: 'value-title-hidden value-title-hidden-left value-mute mh-160' }" :static_value="user.comment" v-model="edit_user.comment" :access="(activeTab === 'settings' && allowModifyUser(edit_user, 1))"></sInputValue>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component'
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import areasMixin from '@/mixins/areasMixin.vue';
  import userModifyMixin from '@/mixins/userModifyMixin.vue';
  import sInputValue from '@/components/elements/sInputValue.vue';
  import sForm from '@/components/elements/sForm.vue';
  export default {
    mixins: [permissionsMixin, commonMixin, usersMixin, userModifyMixin, areasMixin, Component],
    data() {
      return {
        activeStatsBtn: 'all',
        avatarModalName: 'avatar-modify-modal',
        activeTab: 'profile',
        user: this.getClearUser(),
        edit_user: this.getClearUser(),
        pageData: { title: '', metaTitle: '' },
        error: '',
        mode: 'default',
        user_id: null,
        exists: false,
        activeProfileTab: 'profile',
      }
    },
    async beforeMount() {
      this.user.user_id = this.getUserId();
      if (this.user.user_id == this.$store.state.user.user_id) {
        this.$router.push('/profile');
      }
      if(window.location.pathname === '/profile') {
        this.user.user_id = this.$store.state.user.user_id;
      }
      if(!this.user.user_id) {
        if(!this.isSelf(this.user)) {
          let access = await this.$store.dispatch('havePermission', ['crm', this.getPermissionKeyByType()]);
          if(!access) {
            this.permissions({
              permissionDenied: true,
              title: '',
              description: ''
            });
          }
        }
      }
    },
    async mounted() {
      await this.getInstruments();
      await this.getAreas();
      await this.getUser();
    },
    watch: {
      'user.description'(v) {
        console.log(v);
      },
      async $route() {
        this.getUser();
      },
      'edit_user.user_id'(v) {
        if(v !== this.user.user_id) {
          this.getUser();
        }
      },
      'edit_user.is_legal_worker'(a) {
        if(this.edit_user.usertype !== 'workman') { return; }
        let el = $('#passport-container');
        if(a) {
          el.slideDown();
        } else {
          el.slideUp();
        }
      },
      activeTab(a) {
        if(a === 'settings') {
          this.isHiddenPassportContainer = (this.edit_user.usertype === 'workman' && !this.edit_user.is_legal_worker);
        }
      },
    },
    computed: {
      color() {
        return this.edit_user === 'workman' ? 'info' : 'success';
      },
      activeUser() {
        return this.activeTab === 'settings' ? this.edit_user : this.user;
      }
    },
    methods: {
      modifyCallback() {
        this.activeTab = 'profile';
      },
      toggleEditMode() {
        let nt = this.activeTab === 'profile' ? 'settings' : 'profile';
        if(nt === 'profile') {

        }
        this.activeTab = nt;
      },
      recalculatePageTitle() {
          let initials = this.renderUserInitials(this.user);
          let myProfile = (this.$store.state.user && this.$store.state.user.user_id == this.user_id);
          let title = myProfile ? 'Мой профиль' : (this.calculatePageTitleText());
          this.pageData = {
            title: title + (!myProfile && initials.length ? ' - '+initials : ''),
            metaTitle: this.edit_user.user_id ? 'Профиль сотрудника' : 'Создание сотрудника'
          };
      },
      allowWatchPersonalInformation(user) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(this.isCoworker(user)) {
          if(this.havePermission('crm', 'watchCoworkersPersonalData')) { return 1; }
        }
        if(user.usertype === 'client') {
          return this.havePermission('crm', 'watchClientPersonalData');
        }
        return 0;
      },

      async getUser() {
        this.loading = true;
        let id = this.$route.query.user_id;
        let myProfile = (window.location.pathname === '/profile' && !id);
        this.user_id =  myProfile ? this.$store.state.user.user_id : id;
        let user = (await $http.get('/api/users/profile', { user_id: this.user_id }));
        user = (user && user.result && user.user) ? user.user : {};
        this.parseUser(user, this.user);

        if(!this.user.user_id) {
          this.user.usertype = this.calculateCreatingUsertype();
          this.edit_user.usertype = this.calculateCreatingUsertype();
        } else {
          this.computeUsertype();
        }
        let route = this.calculateRouteByUsertype(this.user.usertype);
        if(window.location.pathname !== route) {
          this.$router.replace(route+(window.location.search ? '?'+window.location.search : ''));
        }
        this.fillEditFields();

        if (user.user_id) {
          this.exists = true;
        } else {
          let access = this.allowModifyUser(user);
          if (access) {
            this.user.usertype = this.calculateCreatingUsertype();
            this.edit_user.usertype = this.user.usertype;
            this.user.user_id = 0;
            this.edit_user.user_id = 0;
            this.activeTab = 'settings';
          } else {
            this.permissions({
              permissionDenied: true
            });
          }
        }
        this.recalculatePageTitle();
        this.page();
        this.process = false;
        this.$store.dispatch('setComponentReady', true);
        this.loading = false;
      },
    },
    components: {
      sInputValue, sForm
    }
  }
</script>


