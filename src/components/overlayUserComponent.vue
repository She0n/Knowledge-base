<template>
  <div>
    <div :class="'overlay-modal-outer '+(show ? '' : 'overlay-translated')">
      <div class="overlay-modal-outer-backdrop" @click="showCallback()"></div>
      <div class="overlay-modal-inner overlay-modal-inner2 c-scrollbar">
        <div class="overlay-modal-wrap c-scrollbar">
          <div class="u-width-100 c-scrollbar">
          <div class="c-card u-mb-small u-width-100 u-pv-xsmall u-ph-medium u-flex">
            <div class="o-media">
              <div class="o-media__img u-mr-small">
                <div class="c-avatar c-avatar--xsmall u-mt-3">
                  <img :class="'c-avatar__img '+(allowModifyUser(edit_user) ? 'trigger' : '')" :src="renderUserAvatar(edit_user)" v-on:click="changeAvatarDialog()">
                </div>
              </div>
              <div class="o-media__body">
                <h5 ><span v-html="is_profile ? 'Мой профиль' : (renderUserRealName(edit_user) ? renderUserRealName(edit_user) : 'Карточка ' + calculatePageTitleText())"></span>
                  <span class="c-message__title-meta" v-html="renderUserType(edit_user)"></span></h5>
              </div>
            </div>
          </div>
          <div class="c-card u-width-100 u-p-medium" >

            <div v-if="allowModifyUser(edit_user)">
              <div class="u-mb-large" v-if="$store.state.usertypes[edit_user.usertype] && !$store.state.usertypes[edit_user.usertype].nologin">
                <sInput :key="'ouc-'+index" :field="{ type: item.type ? item.type : 'text', title: item.title }" v-model="edit_user[index]" v-for="item, index in loginFields"></sInput>
              </div>
              <div class="u-mb-large">
                <div v-if="allowModifyUser(edit_user, 1)">
                  <sInput :key="'ouc-'+index" :field="{ type: 'text', title: item.title }" v-model="edit_user[index]" v-for="item, index in personalFieldsA"></sInput>
                </div>
                <sInput :field="{ type: 'text', title: 'Дата рождения', mask: '99.99.9999' }" v-model="edit_user.birthday" v-if="allowModifyUser(edit_user, 1)"></sInput>
                <sInput :field="{ type: 'textarea', title: 'О себе' }" v-model="edit_user.about"></sInput>
                <sInput :field="{ type: 'textarea', title: 'Примечание' }" v-model="edit_user.comment"></sInput>
              </div>
              <div v-if="allowModifyUser(this.edit_user, 1)" >
                <div  v-if="isCoworker(edit_user) || isAdmin(edit_user)" class="u-mb-large">
                  <sInput :field="{ type: 'select', title: 'Должность', values: $store.state.professions, select_key: 'profession_id' }" :nullable="true" v-model="edit_user.profession_id" v-if="$store.state.professions.length && (((isCoworker(edit_user) && edit_user.usertype !== 'workman' && !isSelf(edit_user)) || isAdmin(edit_user)))"></sInput>
                  <sInput :field="{ type: 'tags', title: 'Специализация', tags: baseSpecializationTags }" v-model="edit_user.specialization"></sInput>
                  <sInput :field="{ type: 'tags', title: 'Инструмент', tags: baseInstrumentTags, autocomplete: autocompleteInstruments }" v-if="edit_user.usertype === 'workman'" v-model="edit_user.instrument"></sInput>
                  <!-- specialization -->
                  <sInput :field="{ title: 'Опыт работы', type: 'float' }" v-model="edit_user.expirience"></sInput>

                  <!-- expirience -->

                  <sInput :field="{ title: 'Анализ теста', type: 'text' }" v-model="edit_user.test_result"></sInput>
                  <sInput :field="{ title: 'Уровень объектов', type: 'multiselect', values: $store.state.priceModes }" v-model="edit_user.priceModes" v-if="edit_user.usertype === 'workman'"></sInput>

                  <!-- end add.comment -->
              </div>
              <div class="u-mb-large" v-if="allowModifyUser(edit_user)">
                <sInput :key="'ouc-'+index" v-for="item, index in contactFields" :field="{ title: item.title, type: 'text', mask: index.indexOf('phone') !== -1 ? '+7 (999)-999-99-99' : null }" v-model="edit_user[index]"></sInput>
              </div>
                <!-- end contact fields -->

              </div>

              <div v-if="allowModifyUser(edit_user, 1) && edit_user.usertype === 'workman'" class="u-mb-large">
                <sInput :field="{ title: 'Район проживания', type: 'select', values: areas, select_key: 'area_id', placeholderVal: 'Не выбран' }" :nullable="true" v-model="edit_user.area_id" v-if="areas.length"></sInput>
                <sInput :field="{ title: 'Трудоустроен', type: 'checkbox' }" :nullable="true" v-model="edit_user.is_legal_worker"></sInput>
              </div>


              <!-- about -->
              <div class="u-mb-large" id="passport-container" v-if="allowWatchConfidencialInformation(edit_user)" v-show="!isHiddenPassportContainer">
                <sInput :key="'ouc-'+index" :field="{ type: (item.type ? item.type : 'text'), title: item.title, mask: item.mask }" v-model="edit_user.passport_data[index]" v-for="item, index in passportFields"></sInput>
                <sInput :field="{ type: 'photo', title: 'Фото пасспорта', path: '/images/passports', uploadPath: '/api/users/modify/upload-photo', }" v-model="edit_user.passport_data.photo1"></sInput>
                <sInput :field="{ type: 'photo', title: 'Фото регистрации', path: '/images/passports', uploadPath: '/api/users/modify/upload-photo', }" v-model="edit_user.passport_data.photo2"></sInput>
                <!-- end reg photo -->
              </div>
              <div class="u-mt-large u-mb-large">&nbsp;</div>
              <div class="u-mb-large">
                <div class="u-text-center">
                  <button class="c-btn c-btn--success" v-on:click="modifyUser()">
                    <span class="m-loader" v-if="process"></span>
                    <span v-html="edit_user.user_id ? 'Сохранить' : 'Создать'"></span>
                  </button>
                </div>
              </div>
            </div>
            <div v-else> <!-- watch only mode -->
              <div class="u-mb-medium">
                <sValue :field="{ type: 'text', title: 'Телефон' }" :value="user.phone"></sValue>
                <sValue :field="{ type: 'text', title: 'Альт. телефон' }" :value="user.phone2"></sValue>
                <sValue :field="{ type: 'text', title: 'Емайл' }" :value="user.email"></sValue>
              </div>
              <!-- birthday, about, expirience, -->
              <div class="u-mb-small" v-if="!isFieldEmpty(user.birthday) || !isFieldEmpty(user.instrument) || !isFieldEmpty(user.test_results) || !isFieldEmpty(user.about) || !isFieldEmpty(user.expirience) || !isFieldEmpty(user.specialization) || areasByIds[user.area_id]">
                <sValue :field="{ type: 'date', title: 'Дата рождения' }" :value="user.birthday"></sValue>
                <sValue :field="{ type: 'text', title: 'Специальность' }" :value="user.specialization"></sValue>
                <sValue :field="{ type: 'text', title: 'Опыт работы' }" :value="user.expirience + ' ' +rusificate(ceil(user.expirience), 'год', 'года', 'лет')" v-if="!isFieldEmpty(user.expirience)"></sValue>
                <sValue :field="{ type: 'text', title: 'Инструмент' }" :value="user.instrument"></sValue>
                <sValue :field="{ type: 'text', title: 'Анализ тестирования' }" :value="user.test_results"></sValue>
                <sValue :field="{ type: 'text', title: 'Район' }" :value="areasByIds[user.area_id].title" v-if="areasByIds[user.area_id]"></sValue>
                <sValue :field="{ type: 'text', title: 'О себе' }" :value="user.about"></sValue>
              </div>

              <!-- passport -->
              <div class="u-mb-small" v-if="allowWatchConfidencialInformation(user) && (
                  !isFieldEmpty(user.passport_data.author) || !isFieldEmpty(user.passport_data.code) || !isFieldEmpty(user.passport_data.registration) ||
                  !isFieldEmpty(user.passport_data.date) || !isFieldEmpty(user.passport_data.photo1) || !isFieldEmpty(user.passport_data.photo2) )
                  ">
                <sValue :field="{ type: 'text', title: 'Паспорт (серия и номер)' }" :value="user.passport_data.series"></sValue>
                <sValue :field="{ type: 'text', title: 'Паспорт (кем выдан)' }" :value="user.passport_data.author"></sValue>
                <sValue :field="{ type: 'text', title: 'Паспорт (дата выдачи)' }" :value="user.passport_data.date"></sValue>
                <sValue :field="{ type: 'text', title: 'Паспорт (код подразделения)' }" :value="user.passport_data.code"></sValue>
                <sValue :field="{ type: 'text', title: 'Паспорт (регистрация)' }" :value="user.passport_data.registration"></sValue>
                <div class="u-mt-medium">
                  <sValue :field="{ type: 'photo', path: '/images/passports/', title: 'Фото пасспорта' }" :value="user.passport_data.photo1"></sValue>
                  <sValue :field="{ type: 'photo', path: '/images/passports/', title: 'Фото регистрации' }" :value="user.passport_data.photo2"></sValue>
                </div>
              </div>

            </div>

          </div>
          </div>

        </div>
      </div>
    </div>
    <transition name="fade" >
      <div class="modal-overlay-backdrop" @click="showCallback()" v-if="show"></div>
    </transition>
  </div>
</template>
<script>
  import modalRoutingMixin from '@/mixins/modalRoutingMixin.vue';
  import materialInput from '@/components/elements/materialInput.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import userModifyMixin from '@/mixins/userModifyMixin.vue';
  import modalComponent from '@/components/modalComponent.vue';
  import sInput from '@/components/elements/sInput.vue';
  import sValue from '@/components/elements/sValue.vue';
  export default {
    props: ['show', 'transfered_user_id', 'creating_usertype', 'parentShowCallback', 'modifyCallback', 'is_profile', 'creating_usertype'],
    mixins: [modalRoutingMixin, commonMixin, usersMixin, permissionsMixin, userModifyMixin, modalComponent],
    async mounted() {

    },
    data() {
      return {
        mode: 'edit',
        user: this.getClearUser(),
        edit_user: this.getClearUser(),
        loginFields: {
          username: { title: 'Логин', placeholder: 'Введите логин', type: 'text' },
          password: { title: 'Пароль', placeholder: '******', type: 'password' },
          password2: { title: 'Повторите пароль', placeholder: '******', type: 'password' },
        },
      };
    },
    watch: {
      show(v) {
        if(v) {
          document.body.classList.add('overlay-modal-mode');
        } else {
          document.body.classList.remove('overlay-modal-mode');
        }
        if(this.is_profile) {
          this.getUser();
        }
      },
      async $route() {
        if(this.is_profile) { return; }
        if(!this.show) { return; }
        await this.getInstruments();
        await this.getAreas();
        if(this.$route.query.item_id) {
          this.getUser();
        } else {
          this.edit_user = this.getClearUser();
          this.user = this.getClearUser();
          this.edit_user.usertype = this.calculateCreatingUsertype();
          this.user.usertype = this.edit_user.usertype;
        }

        if(!this.edit_user.user_id) {
          this.edit_user.usertype = this.calculateCreatingUsertype();
          this.user.usertype = this.edit_user.usertype;
        }
      },
      'edit_user.user_id'() {
        this.userAfter();
      },
      'edit_user.usertype'() {
        this.userAfter();
      },
      'edit_user.is_legal_worker'(a) {
        if(this.edit_user.usertype !== 'workman') { return; }
        this.isHiddenPassportContainer = !a;
      },
    },
    methods: {
      userAfter() {
        this.isHiddenPassportContainer = (this.edit_user.usertype === 'workman' && !this.edit_user.is_legal_worker);
      },
      async getUser() {
        this.loading = true;
        let id;
        if(typeof this.transfered_user_id !== 'undefined') {
          id = this.transfered_user_id;
        } else {
          if(this.is_profile) {
            id = this.$store.state.user.user_id;
          } else {
            //id = window.location.getParameter('item_id');
            id = this.$route.query['item_id'];
          }
        }
        this.user_id = id;
        let user = (await $http.get('/api/users/profile?user_id=' + this.user_id));
        user = (user.result && user.user) ? user.user : {};
        user.birthday = window.dateFormatter.reformatDateToDotted(user.birthday);
        if(user.passport_data) {
          if(user.passport_data.date) {
            user.passport_data.date = window.dateFormatter.reformatDateToDotted(user.passport_data.date);
          }
        }
        let except = ['passport_data', 'priceModes'];
        for (let prop in this.user) {
          if(except.indexOf(prop) !== -1) { continue; }
          this.user[prop] = user[prop];
        }
        if(typeof user.additional !== 'object' || !user.additional) { user.additional = {}; }
        this.user.priceModes = Array.isArray(user.priceModes) ? user.priceModes : [];
        if(user.passport_data) {
          for(let prop in this.user.passport_data) {
            this.user.passport_data[prop] = user.passport_data[prop] ? user.passport_data[prop] : '';
          }
        }

        if(!this.user.user_id) {
          this.user.usertype = this.calculateCreatingUsertype();
          this.edit_user.usertype = this.calculateCreatingUsertype();
        } else {
          this.user.password2 = this.user.password;
          this.edit_user.password2 = this.user.password;
          //this.computeUsertype();
        }
        if(window.location.pathname.indexOf('modify') !== -1) {
          //let route = this.calculateRouteByUsertype(this.user.usertype);
          //if(window.location.pathname !== route) {
          //  this.$router.replace(route+(window.location.search ? '?'+window.location.search : ''));
          //}
        }
        this.fillEditFields();

        if (user.user_id) {
          this.exists = true;
        } else {
          let access = this.allowModifyUser(user);
          if (access) {
            this.user.usertype = this.calculateCreatingUsertype();
            this.edit_user.usertype = this.user.usertype;
            /*
            this.pageData.title = 'Создание ' + this.calculatePageTitleText();
            this.pageData.metaTitle = this.pageData.title;
            */
            this.user.user_id = 0;
            this.edit_user.user_id = 0;
            this.activeTab = 'settings';
          } else {
            this.showCallback();
          }
        }
        this.process = false;
        this.loading = false;
      },
    },
    components: {
      materialInput, sInput, sValue
    }
  }
</script>
