<template>
  <div>
    <div v-if="loading"></div>
    <div v-else>
      <div class="container" v-if="isCoworker()">
        <div class="row">
          <div class="col-12">
            <div class="c-stage" id="profile-summary-controls-wrapper">
              <div class="c-stage__panel">
                <div class="profile-summary-controls">
                  <!-- общие, июнь, сегодня, период -->
                  <button :class="'c-btn c-btn--custom-1 ' +(activeStatsBtn === 'all' ? 'active' : '')" v-on:click="toggleActiveStatsBtn('all')">за все время</button>
                  <span class="button-divider">-</span>
                  <button :class="'c-btn c-btn--custom-1 ' +(activeStatsBtn === 'last_month' ? 'active' : '')" v-on:click="toggleActiveStatsBtn('last_month')">за <span v-html="renderMonth()"></span></button>
                  <span class="button-divider">-</span>
                  <button :class="'c-btn c-btn--custom-1 ' +(activeStatsBtn === 'today' ? 'active' : '')" v-on:click="toggleActiveStatsBtn('today')">за сегодня</button>
                  <span class="button-divider">-</span>
                  <button :class="'c-btn c-btn--custom-1 ' +(activeStatsBtn === 'range' ? 'active' : '')" v-on:click="toggleActiveStatsBtn('range')">за период</button>

                </div>
              </div>
              <div id="profile-summary-controls-wrapper-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="container" v-if="!allowModify() || mode === 'default'">
        <div class="row u-mb-large">
          <div class="col-12">
            <ul class="c-tabs__list c-tabs__list--splitted nav nav-tabs" v-if="isCoworker()">
              <li class="c-tabs__item"><span :class="'c-tabs__link trigger '+(activeProfileTab === 'stats' ? 'active' : '')" v-on:click="toggleStatsTab()">Показатели</span></li>
              <li class="c-tabs__item"><span :class="'c-tabs__link show trigger ' +(activeProfileTab === 'profile' ? 'active' : '')" v-on:click="toggleProfileTab()">Профиль</span></li>
            </ul>
            <div class="c-tabs">
              <div class="c-tabs__content tab-content" id="nav-user-tabs-content">
                <div class="c-tabs__pane active" id="nav-user-home" role="tabpanel" aria-labelledby="nav-user-home-tab">
                  <div class="row">
                    <div class="col-lg-2 u-text-center">
                      <div class="c-avatar c-avatar--xlarge u-inline-block u-mt-xsmall">
                        <img class="c-avatar__img" :src="renderAvatar(avatar)" onerror="window.setDefaultAvatar(this)">
                      </div>
                    </div>
                    <div class="col-10">
                      <div class="row">
                        <div class="col-12">
                          <div class="n-profile-field u-mb-medium">
                            <h4 class="n-profile-fullname u-text-bold u-mb-zero" v-html="renderUserFullName(this)"></h4>
                            <div v-if="allowRenderProfileProfession()" class="n-profile-profession u-text-small u-text-mute" v-html="renderProfileProfession()"></div>
                            <i class="trigger fa fa-cog n-edit-user-icon u-text-mute" v-if="allowModifyUser()" v-on:click="toggleEditMode()"></i>
                          </div>
                        </div>
                      </div>
                      <div class="row" v-if="activeProfileTab === 'profile'">
                        <div class="col-12">
                          <div class="n-profile-row">
                            <div class="n-profile-row-key">Дата рождения:</div>
                            <div class="n-profile-row-val" v-html="renderBirthday()"></div>
                          </div>
                          <div class="n-profile-row">
                            <div class="n-profile-row-key">Город:</div>
                            <div class="n-profile-row-val">Санкт-Петербург</div>
                          </div>
                          <div class="n-profile-row">
                            <div class="n-profile-row-key">Емайл:</div>
                            <div class="n-profile-row-val" v-html="(email && email.length) ? email : '- - -'"></div>
                          </div>
                          <div class="n-profile-row">
                            <div class="n-profile-row-key">Телефон:</div>
                            <div class="n-profile-row-val" v-html="(phone && phone.length) ? phone : '- - -'"></div>
                          </div>
                          <div class="c-divider u-mt-small u-mb-small u-float-left u-width-100"></div>
                          <div class="n-profile-row" v-if="(specialization && specialization.length)">
                            <div class="n-profile-row-key">Специализация:</div>
                            <div class="n-profile-row-val" v-html="(specialization && specialization.length) ? specialization : '- - -'"></div>
                          </div>
                          <div class="n-profile-row" v-if="(expirience && expirience.length)">
                            <div class="n-profile-row-key">Опыт работы:</div>
                            <div class="n-profile-row-val" v-html="expirience"></div>
                          </div>
                          <div class="n-profile-row">
                            <div class="n-profile-row-key">Интересы:</div>
                            <div class="n-profile-row-val" v-html="(about && about.length) ? about : '- - -'"></div>
                          </div>

                        </div>
                        <div class="col-12" v-if="displayWriteMessage()">
                          <div class="u-mt-small m-w-220">
                            <router-link :to="'/messages/dialog?p='+user_id" class="c-btn c-btn--info u-width-100 u-mb-xsmall n-btn-with-icon">Написать<i class="fa fa-envelope"></i></router-link>
                          </div>
                        </div>

                      </div>
                      <div v-if="activeProfileTab === 'stats'">

                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div><!-- // .col-12 -->
        </div>

      </div>
      <div class="container-fluid" v-if="mode === 'edit' && allowModifyUser()">
        <div class="row">
          <div class="col-xl-4 col-lg-5">
            <article class="c-stage" id="stages">
              <div class="c-stage__panel collapse show" id="stage-panel1">
                <div class="u-p-medium">
                  <h5 class="u-h6 u-mb-medium">Данные для входа</h5>
                  <div class="row">
                    <div class="c-field u-mb-small">
                      <label class="c-field__label" for="user-modify-login">Логин</label>
                      <input class="c-input" type="text" v-model="e_username" id="user-modify-login"
                             placeholder="Введите логин">
                    </div>
                    <div class="c-field u-mb-small">
                      <label class="c-field__label" for="user-modify-password">Пароль</label>
                      <input class="c-input" type="password" v-model="e_password" id="user-modify-password"
                             placeholder="Введите пароль">
                    </div>
                    <div class="c-field u-mb-medium">
                      <label class="c-field__label" for="user-modify-password2" v-html="getRepeatPassword()"></label>
                      <input class="c-input" type="password" v-model="e_password2" id="user-modify-password2"
                             placeholder="Повторите пароль">
                    </div>
                  </div>
                </div>
              </div><!-- // .c-stage__panel -->


            </article><!-- // .c-stage -->


          </div>

          <div class="col-xl-8 col-lg-7">
            <div class="c-card u-mb-medium">
              <div class="u-p-medium">
                <div class="row">
                  <div class="col-xl-3 col-lg-3">
                    <div class="u-text-center">
                      <div class="n-avatar u-width-100 u-mb-xsmall">
                        <img id="user-profile-avatar" class="u-width-100" :src="renderEAvatar()"
                             onerror="window.setDefaultAvatar(this)">
                      </div>
                      <div>
                        <button class="c-btn c-btn--info u-width-100 u-mb-xsmall n-btn-with-icon"
                                @click="changeAvatarDialog">Изменить аватар<i class="fa fa-pencil"></i></button>

                      </div>
                    </div>
                  </div>
                  <div class="col-xl-9 col-lg-9">
                    <div class="row u-relative">
                      <i class="trigger fa fa-cog u-text-mute n-toggle-default-user-mode" v-on:click="toggleDefaultMode()"></i>
                      <div class="col-12">
                        <h5 class="u-h6 u-mb-small">Персональные данные</h5>
                      </div>
                      <div class="col-xl-6">

                        <div class="c-field u-mb-small">
                          <label class="c-field__label" for="user-modify-name">Имя</label>
                          <input class="c-input" type="text" v-model="e_first_name" id="user-modify-name"
                                 placeholder="Введите имя">
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label" for="user-modify-thirdname">Отчество</label>
                          <input class="c-input" type="text" v-model="e_third_name" id="user-modify-thirdname"
                                 placeholder="Введите отчество">
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label" for="user-modify-lastname">Фамилия</label>
                          <input class="c-input" type="text" v-model="e_last_name" id="user-modify-lastname"
                                 placeholder="Введите фамилию">
                        </div>
                        <div class="c-field u-mb-small" v-if="allowExpirience()">
                          <label class="c-field__label">Опыт работы:</label>
                          <div class="plus-minus-controls">
                            <input class="c-input" type="text" v-model="e_expirience"
                                   placeholder="Укажите опыт работы">
                          </div>
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label">Интересы</label>
                          <textarea v-model="e_about" class="c-input" style="    height: 118px;"></textarea>
                        </div>


                      </div>
                      <div class="col-xl-6">
                        <div class="c-field u-mb-small">
                          <label class="c-field__label">День рождения</label>
                          <datepicker :clear-button="true" v-model="e_birthday" placeholder="Выберите дату"
                                      :input-class="'c-input trigger'" language="ru"
                                      :monday-first="true"></datepicker>
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label" for="user-modify-phone">Телефон</label>
                          <input class="c-input" type="text" v-model="e_phone" id="user-modify-phone"
                                 placeholder="Введите телефон">
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label" for="user-modify-email">Электронная почта</label>
                          <input class="c-input" type="text" v-model="e_email" id="user-modify-email"
                                 placeholder="Введите адрес электронной почты">
                        </div>
                        <div class="c-field u-mb-small">
                          <label class="c-field__label">Группа пользователя</label>
                          <usertypeSelector id="user-modify-group" :allowed="getAllowedUserTypes()"
                                            :value="e_usertype ? e_usertype : 0"></usertypeSelector>
                        </div>
                        <div class="c-field u-mb-small" v-if="allowSpecialization()">
                          <label class="c-field__label">Специализация</label>
                          <input type="text" class="c-input" v-model="e_specialization">
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="u-text-right">
                          <div class="c-field u-mb-small">
                            <div class="card-error-container" v-html="error"></div>
                            <button v-if="allowModifyUser()" v-bind:class="error.length ? 'c-btn c-btn--danger' : 'c-btn c-btn--info'"
                                    type="button"
                                    v-on:click="modifyUser">
                              сохранить <i class="m-loader" v-if="process" aria-hidden="true"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <uploadForm></uploadForm>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component'
  import Inputmask from 'inputmask';
  import usertypeSelector from '@/components/elements/usertypeSelector.vue';
  import uploadForm from '@/components/elements/uploadForm.vue';
  import preloader from '@/components/elements/preloader.vue';
  import Datepicker from 'vuejs-datepicker';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import profileSummariesMixin from '@/mixins/profileSummariesMixin.vue';
  import summariesFunctionsMixin from '@/mixins/summariesFunctionsMixin.vue';
  const pageData = {headerClass: 'u-mb-large', bodyClass: 'mh-scroll'};



  export default {
    props: ['uid'],
    extends: Component,
    mixins: [permissionsMixin, profileSummariesMixin, summariesFunctionsMixin],
    data() {
      return {
        activeStatsBtn: 'all',
        pageData: pageData,
        username: '',
        e_username: '',
        e_first_name: '',
        e_last_name: '',
        e_third_name: '',
        e_usertype: '',
        e_email: '',
        e_phone: '',
        e_password: '',
        e_password2: '',
        e_avatar: '',
        e_birthday: '',
        e_about: '',
        e_specialization: '',
        e_expirience: '',
        first_name: '',
        last_name: '',
        third_name: '',
        usertype: '',
        created_by: 0,
        email: '',
        phone: '',
        password: '',
        password2: '',
        avatar: '',
        birthday: '',
        about: '',
        specialization: '',
        expirience: '',
        error: '',
        mode: 'default',
        process: false,
        user_id: null,
        exists: false,
        loading: true,
        activeProfileTab: 'profile',
        fields: ['user_id', 'usertype', 'first_name', 'last_name', 'third_name', 'username', 'password',
          'password2', 'specialization', 'email', 'phone', 'avatar', 'birthday', 'about', 'expirience', 'created_by']
      }
    },
    beforeMount() {
      if (!this.user_id) {
        this.user_id = this.getUserId();
      }
      if (this.user_id == this.$store.state.user.user_id) {
        this.$router.push('/profile');
      }
      this.$store.commit('titleStatement', false);
    },
    created() {
      this.$store.commit('titleStatement', false);
      this.$on('changeUserType', (val) => {
        this.e_usertype = val;
      });
    },
    computed: {
      allowModifyGroup() {
        let groups = ['admin'];
        return groups.indexOf(this.$store.state.user.usertype) !== -1;
      },
    },
    async mounted() {
      await this.getUser();
      this.setMask()
    },
    watch: {
      uid: async function (oldv, newv) {
        if (oldv === newv) {
          return;
        }
        await this.getUser();
      },
    },
    methods: {
      allowModifyUser() {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(this.$store.state.user.user_id == this.user_id) { return 1; }
        if(this.created_by == this.$store.state.user.user_id) {
          return 1;
        }
        return 0;
      },
      getAllowedUserTypes() {
        if(!this.$store.state.user) { return []; }
        if(this.$store.state.user.usertype === 'admin') {
          return this.$store.state.usertypes;
        }
        let arr = [];
        let ut = JSON.parse(JSON.stringify(this.$store.state.usertypes));
        if(this.$store.state.usertype === 'client') {
          if(this.user_id == this.$store.state.user.user_id) {
            arr = ['client'];
          } else {
            arr = ['observer'];
          }
        }
        if(this.$store.state.usertype === 'hr') { arr = ['client', 'observer', 'trainee', 'estimator', 'designer', 'manager', 'hr']; }
        let groups = ['manager', 'foreman', 'estimator', 'designer'];
        if(groups.indexOf(this.$store.state.usertype) !== -1) {
          if(this.$store.state.user.user_id === this.user_id) {
            arr = [this.$store.state.usertype];
          } else {
            arr = ['client', 'observer'];
          }
        }
        if(!arr.length) { return []; }
        for(let i = 0; i < arr.length; i++) {
          delete ut[arr[i]];
        }
        return ut;
      },
      toggleActiveStatsBtn(x) {
        this.activeStatsBtn = x;
        // all month today range

      },
      getSum(name) {
        // if(this.activeMode === 'summ') { return this.summaries.total[name]; }
        if(!this.summaries[this.activeStatsBtn]) { return this.summaries.total[name]; }
        return this.summaries[this.activeStatsBtn][name];
      },
      toggleStatsTab() {
        this.activeProfileTab = 'stats';
        $('#profile-summary-controls-wrapper-overlay').animate({ width: '0' }, 400);
      },
      toggleProfileTab() {
        this.activeStatsBtn = 'all';
        $('#profile-summary-controls-wrapper-overlay').animate({ width: '100%' }, 400);
        this.activeProfileTab = 'profile';
      },
      allowExpirience() {
        if(!this.$store.state.user) { return 0; }
        let groups = ['foreman', 'manager', 'designer', 'admin'];
        return groups.indexOf(this.e_usertype) !== -1;
      },
      allowSpecialization() {
        if(!this.$store.state.user) { return 0; }
        let groups = ['foreman', 'manager', 'designer', 'admin'];
        return groups.indexOf(this.e_usertype) !== -1;
      },
      renderBirthday() {
        return this.birthday ? window.dateFormatter.reformatDate(this.birthday) : 'не указан';
      },
      allowRenderProfileProfession() {
        if(!this.usertype) { return 0; }
        if(!this.$store.state.usertypes[this.usertype]) { return 0; }
        const groups = ['admin'];
        if(groups.indexOf(this.usertype) !== -1) { return 0; }
        return 1;
      },
      renderProfileProfession() {
        return this.$store.state.usertypes[this.usertype] ? this.$store.state.usertypes[this.usertype].title : '';
      },
      setMask() {
        let el = document.getElementById('user-modify-phone');
        if (!el) { return; }
        let im = new Inputmask("+7 (999)-999-99-99");
        im.mask(el);
      },
      toggleEditMode() {
        this.mode = 'edit';
        $('#profile-summary-controls-wrapper-overlay').animate({ width: '100%' }, 400);
        setTimeout(() => {
          this.setMask();
        }, 400);
      },
      toggleDefaultMode() {
        this.fillEditFields();
        this.mode = 'default';
        if(this.activeProfileTab === 'stats') {
          $('#profile-summary-controls-wrapper-overlay').animate({ width: '0' }, 400);
        } else {
          $('#profile-summary-controls-wrapper-overlay').animate({ width: '100%' }, 400);
        }


      },

      displayWriteMessage() {
        if (!this.exists) {
          return 0;
        }
        if (!this.$store.state.user) {
          return 0;
        }
        if (!this.user_id) {
          return 0;
        }
        if (this.$store.state.user.user_id === this.user_id) {
          return 0;
        }
        return 1;
      },
      fillEditFields() {
        for (let i = 0; i < this.fields.length; i++) {
          this['e_' + this.fields[i]] = this[this.fields[i]];
        }
      },
      async getUser() {
        this.loading = true;
        this.user_id = this.getUserId();
        let user = (await axios.get('/api/profile?user_id'+this.user_id)).data;
        user = (user.result && user.user) ? user.user : {};
        for (let i = 0; i < this.fields.length; i++) {
          this[this.fields[i]] = user[this.fields[i]];
        }
        if(this.isCoworker() && user.user_id) {
          let summariesData = await axios.post('/api/get-account-summaries', { user_id: user.user_id });
          if(summariesData.data) {
            this.setAccountSummaries(summariesData.data.summaries);
          }
        }
        this.fillEditFields();
        this.user_id = user ? user.user_id : 0;
        if (user.user_id) {
          this.pageData.title = (this.$store.state.user && this.$store.state.user.user_id == this.user_id) ? 'Мой профиль' : 'Профиль пользователя';
          this.pageData.metaTitle = this.pageData.title;
          this.exists = true;
        } else {
          if(this.allowModify()) {
            this.pageData.title = 'Создание пользователя';
            this.pageData.metaTitle = 'Создание пользователя';
            this.user_id = 0;
            this.mode = 'edit';
          } else {
            this.$router.push('/not-found');
          }
        }
        this.$store.commit('titleStatement', true);
        this.page();
        this.process = false;
        this.$store.dispatch('setComponentReady', true);
        this.loading = false;
      },
      changeAvatarDialog() {
        window.Uploader.addCallback(this.confirmChangeAvatar);
        window.Uploader.selectFile();
      },
      renderAvatar() {
        if (!this.avatar) {
          return window.getDefaultAvatar();
        }
        return window.image('/images/sm/' + this.avatar);
      },
      renderEAvatar() {
        if (!this.e_avatar) {
          return window.getDefaultAvatar();
        }
        return window.image('/images/sm/' + this.e_avatar);
      },
      confirmChangeAvatar() {
        let form = $('#uploadForm');
        if (!form.length) {
          return;
        }
        let formData = new FormData(form[0]);
        let userId = this.user_id;
        if (userId) {
          formData.append('user_id', userId);
        }
        axios.post('/api/users/modify/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if (parseInt(response.status) === 200) {
            if (response.data.result) {
              this.e_avatar = response.data.files[0].filename;
            } else {

            }
            window.Uploader.reset();
          }
        });

      },
      async modifyUser() {
        if (this.process) {
          return;
        }
        this.process = true;
        let data = this.collectUserData();

        let response;
        try {
          response = (await axios.post('/api/modify-user', data)).data;
        } catch (e) {
          this.process = false;
          return false;
        }
        this.process = false;
        this.error = response.display ? response.display : '';
        if (response.result) {
          if (response.user.user_id == this.$store.state.user.user_id) {
            this.$store.dispatch('setUser', response.user);
          }
          if(this.user_id) {

          } else {
            this.$router.replace(window.location.pathname+'?user_id='+response.user.user_id);
          }
          for(let prop in response.user) {
            this[prop] = response.user[prop];
          }
          this.user_id = response.user.user_id;
          this.mode = 'default';
        }
      },
      collectUserData() {
        let data = {};
        for (let i = 0; i < this.fields.length; i++) {
          data[this.fields[i]] = this['e_' + this.fields[i]];
        }
        let birthday = new Date(this.e_birthday);
        let birthdayDay = birthday.getDate();
        data.birthday = isNaN(birthdayDay) ? false : (birthday.getFullYear()+'-'+(birthday.getMonth()+1)+'-'+birthdayDay);
        return data;
      },
      getUserId() {
        return window.location.getParameter('user_id');
      },
      getRepeatPassword() {
        return this.user_id ? 'Старый пароль' : 'Повторите пароль';
      }
    },
    components: {
      usertypeSelector, uploadForm, preloader, Datepicker
    }
  }
</script>
