<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div v-else>
        <div class="row">
          <div class="col-12">
            <div class="box-shadow-wrapper d-bg-semi-gray d-border-radius">
              <div class="table-form-header d-bg-white">
                <div class="row ">
                  <div class="col-12 col-xl-6 d-pr-zero d-pr-25">
                    <div class="justify-content-between d-flex">
                      <div class="">
                        <div class=" d-ph-25">
                        <router-link :to="'/coworkers'+(office ? '' : '/workmans')" :class="'d-mr-20 d-text-dark active-underline d-pv-12 d-inline-block '+(activeTab === 'workers' ? 'd-active-'+color : '')">
                          Сотрудники
                        </router-link>
                        <router-link :to="'/coworkers/professions'" :class="'d-text-dark  active-underline d-pv-12 d-inline-block '+(activeTab !== 'workers' ? 'd-active-'+color : '')">
                          Должности
                        </router-link>
                        </div>
                      </div>
                      <div class="">
                        <sInput v-model="office" v-if="activeTab === 'workers'" :class="'d-pv-12 d-input--'+color" :field="{ type: 'double-toggler', titles: ['Строители', 'Офис'] }"></sInput>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-6 d-pl-zero">
                    <div class="d-pv-12 d-ph-25 d-text-dark" v-if="activeTab === 'workers'">
                      Фильтры поиска сотрудников
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-border-bottom"></div>
                  </div>
                </div>
                <div class="row" v-if="activeTab === 'professions'">
                  <div class="col-12">
                    <div class="d-pv-25 d-ph-25">
                      <div class=" d-flex">
                        <div class="flex-grow-1 d-mr-12">
                          <div class="iconed-input-wrapper d-mb-20">
                            <input type="text" class="d-input-cf d-width-100" v-model="profsq" placeholder="Поиск должности">
                            <i class="fa fa-search"></i>
                          </div>
                        </div>
                        <div>
                          <router-link to="/coworkers/professions/modify"  :class="'d-inline-block d-btn d-btn--'+(color)">Создать должность</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="activeTab === 'workers'">
                  <div class="col-12 col-xl-6 d-border-right d-pr-zero">
                    <div class="d-pv-25 d-ph-25">
                      <div class="d-flex d-pb-12">
                        <div class="flex-grow-1 d-mr-12">
                          <div class="iconed-input-wrapper d-mb-20">
                          <input type="text" class="d-input-cf d-width-100" v-model="q" placeholder="Поиск сотрудника">
                          <i class="fa fa-search"></i>
                        </div>
                          <div v-if="activeTab === 'workers'">
                            <sInput v-model="fired" v-if="havePermission('crm', 'fireCoworkers')" :field="{ title: 'Искать среди уволенных сотрудников', type: 'checkbox' }"></sInput>
                          </div>
                        </div>
                        <div>
                          <router-link :to="office ? '/coworkers/profile' : '/coworkers/workmans/profile'" :class="'d-inline-block d-btn d-btn--'+color">Создать сотрудника</router-link>
                        </div>
                      </div>
                      <div :class="'d-input--'+color">
                        <div class="d-inline-block trigger" @click="fired = !fired">
                          <div :class="'checkbox-simulator d-mr-12 '+(fired ? 'active' : '')" ></div>
                          <span>Искать среди уволенных сотрудников</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-xl-6 d-pl-zero">
                    <div class="d-pv-25 d-ph-25">
                      <div class="row">
                        <div class="col-12 col-xl-5 d-pr-12">
                          <sInput v-model="selectedAreas" :class="'d-mb-12 d-input--'+color" :field="{ title: 'Район', placeholderVal: 'Любой',  type: 'multiselect', values: areas, select_key: 'area_id', nullable: true }"></sInput>
                          <sInput v-model="selectedExpirience" :class="'d-input--'+color" :field="{ title: 'Опыт работы',  type: 'select', values: possibleExpiriences, placeholderVal: 'Любой', nullable: true }" ></sInput>
                        </div>
                        <div class="col-12 col-xl-7 d-pl-zero">
                          <sInput v-model="selectedAge" :class="'d-mb-12 d-input--'+color" :field="{ title: 'Возраст',  type: 'select', values: possibleAges, placeholderVal: 'Любой', nullable: true }" ></sInput>
                          <button class="d-btn d-btn--secondary d-btn--danger-hover d-width-100" @click="clearUserFilters()">Сбросить все фильтры</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="d-border-bottom"></div>
                  </div>
                </div>
              </div>
              <div v-if="activeTab === 'professions'">
                <div class="d-pv-25 d-ph-25">
                  <table>
                    <thead>
                    <th class="th-cell d-text-left">Должность</th>
                    <th class="th-cell d-text-center">Сотрудников</th>
                    <th class="th-cell d-text-left">Системы</th>
                    <th class="th-cell"></th>
                    </thead>
                    <tbody>
                    <tr class="table-row" v-if="!filteredProfessions.length">
                      <td class="td-cell empty-table-err" colspan="20">Поиск не дал результатов</td>
                    </tr>
                      <tr class="table-row" v-for="(prof, index) in filteredProfessions">
                        <router-link :to="'/coworkers/professions/profession?profession_id='+prof.profession_id" tag="td" class="td-cell d-text-left d-text-dark trigger" v-html="prof.title"></router-link>
                        <router-link :to="'/coworkers/professions/profession?profession_id='+prof.profession_id" tag="td" class="td-cell d-text-center d-text-dark trigger" v-html="prof.total ? prof.total : 0"></router-link>
                        <router-link :to="'/coworkers/professions/profession?profession_id='+prof.profession_id" tag="td" class="td-cell d-text-left d-text-dark trigger ">
                          <div class="prof-access" v-if="prof.permissions.crm.access">
                            <i class="fa fa-check-circle d-mr-12 d-color-danger"></i>
                            <span>ERP</span>
                          </div>
                          <div class="prof-access" v-if="prof.permissions.personal_area.access">
                            <i class="fa fa-check-circle d-mr-12 d-color-success"></i>
                            <span>Личный кабинет</span>
                          </div>
                          <div class="prof-access" v-if="prof.permissions.calculator.access">
                            <i class="fa fa-check-circle d-mr-12 d-color-info"></i>
                            <span>Сметный калькулятор</span>
                          </div>
                          <div class="prof-access" v-if="prof.permissions.knowledge_base.access">
                            <i class="fa fa-check-circle d-mr-12 d-color-warning"></i>
                            <span>База знаний</span>
                          </div>
                        </router-link>
                        <td class="td-cell  d-text-right">
                          <dropdown v-if="allowDropProfession(prof)">
                            <template slot="button">
                              <i class="fa fa-ellipsis-v trigger table-drop-icon d-text-semi-dark d-text-dark-hover fs-21" aria-hidden="true"></i>
                            </template>
                            <div class="dropdown-item" v-on:click="confirmDropProfDialog(prof)">удалить</div>
                          </dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-if="activeTab === 'workers'">
                <div class="d-pv-12 d-ph-25">
                  <table v-if="!office">
                    <thead>
                      <th class="th-cell d-text-left">ФИО</th>
                      <th class="th-cell">Телефон</th>
                      <th class="th-cell">Специальность</th>
                      <th class="th-cell">Опыт работы</th>
                      <th class="th-cell">Рейтинг</th>
                      <th class="th-cell d-text-left">Район проживания</th>
                      <th class="th-cell comment-cell">Примечание</th>
                      <th class="th-cell"></th>
                    </thead>
                    <tbody v-if="!componentReady">
                      <tr class="table-row" v-for="i in 20">
                        <td class="td-cell trigger">
                          <div class="d-flex">
                            <div class="avatar avatar-medium d-mr-12">
                              <img :src="renderUserAvatar()"  class="avatar-img">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <div class="d-text-dark skeleton-string d-mb-12"></div>
                              <div class="d-text-mute d-text-small skeleton-string-sm"></div>
                            </div>
                          </div>
                        </td>
                        <td class="td-cell trigger d-text-center">
                          <div class="skeleton-string d-inline-block"></div>
                        </td>
                        <td class="td-cell trigger d-text-center ">
                          <div class="skeleton-string d-inline-block"></div>
                        </td>
                        <td class="td-cell trigger d-text-center">
                          <div class="skeleton-string d-inline-block"></div>
                        </td>
                        <td class="td-cell trigger d-text-center">
                          <div class="skeleton-string-sm d-inline-block"></div>
                        </td>
                        <td class="td-cell trigger ">
                          <div class="skeleton-string d-inline-block"></div>
                        </td>
                        <td class="td-cell trigger d-text-center comment-cell">
                          <div class="skeleton-string d-inline-block"></div>
                        </td>
                        <td class="td-cell  d-text-right"></td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr class="table-row" v-if="!users.length">
                        <td class="td-cell empty-table-err" colspan="20">Поиск не дал результатов</td>
                      </tr>
                      <tr class="table-row" v-for="user,index in users">
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger">
                          <div class="d-flex">
                            <div class="avatar avatar-medium d-mr-12">
                              <img :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this, 'workman')"  class="avatar-img">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <div class="d-text-dark" v-html="renderUserRealName(user)"></div>
                              <div class="d-text-mute d-text-small">строитель</div>
                            </div>
                          </div>
                        </router-link>
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="user.phone"></router-link>
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html=" user.specialization ? user.specialization : ''"></router-link>
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="renderUserExperience(user)"></router-link>
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="renderRating(user)"></router-link>
                        <router-link :to="'/coworkers/workmans/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-dark" v-html="areasByIds[user.area_id] ? areasByIds[user.area_id].title : ''"></router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark comment-cell" v-html="user.comment"></router-link>
                        <td class="td-cell  d-text-right">
                          <dropdown v-if="allowDropUser(user) || allowFireUser(user)">
                            <template slot="button">
                              <i class="fa fa-ellipsis-v d-text-dark-hover trigger table-drop-icon d-text-semi-dark fs-21" aria-hidden="true"></i>
                            </template>
                            <div class="dropdown-item" v-if="allowFireUser(user)" v-on:click="confirmFireUserDialog(user)">уволить</div>
                            <div class="dropdown-item" v-if="allowDropUser(user)" v-on:click="confirmDropUserDialog(user)">удалить</div>
                          </dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table v-if="office">
                    <thead>
                      <th class="th-cell d-text-left">ФИО</th>
                      <th class="th-cell d-text-left">Район проживания</th>
                      <th class="th-cell">Возраст сотрудника</th>
                      <th class="th-cell ">Стаж работы</th>
                      <th class="th-cell">Телефон</th>
                      <th class="th-cell">Контактная почта</th>
                      <th class="th-cell"></th>
                    </thead>
                    <tbody v-if="!componentReady">
                    <tr class="table-row" v-for="i in 20">
                      <td class="td-cell trigger">
                        <div class="d-flex">
                          <div class="avatar avatar-medium d-mr-12">
                            <img :src="renderUserAvatar()"  class="avatar-img">
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <div class="d-text-dark skeleton-string d-mb-12"></div>
                            <div class="d-text-mute d-text-small skeleton-string-sm"></div>
                          </div>
                        </div>
                      </td>
                      <td class="td-cell trigger">
                        <div class="skeleton-string"></div>
                      </td>
                      <td class="td-cell trigger d-text-center">
                        <div class="skeleton-string d-inline-block"></div>
                      </td>
                      <td class="td-cell trigger d-text-center">
                        <div class="skeleton-string d-inline-block"></div>
                      </td>
                      <td class="td-cell trigger d-text-center">
                        <div class="skeleton-string-sm d-inline-block"></div>
                      </td>
                      <td class="td-cell trigger d-text-center">
                        <div class="skeleton-string d-inline-block"></div>
                      </td>
                      <td class="td-cell  d-text-right"></td>
                    </tr>
                    </tbody>
                    <tbody v-else>
                      <tr class="td-row" v-if="!users.length">
                        <td class="td-cell empty-table-err" colspan="20">Поиск не дал результатов</td>
                      </tr>
                      <tr v-for="user, index in users" class="table-row">
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger">
                          <div class="d-flex">
                            <div class="avatar avatar-medium d-mr-12">
                              <img :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)"  class="avatar-img">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <div class="d-text-dark" v-html="renderUserRealName(user)"></div>
                              <div class="d-text-mute d-text-small" v-html="renderUserProfessionSpecialization(user)"></div>
                            </div>
                          </div>
                        </router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-dark" v-html="areasByIds[user.area_id] ? areasByIds[user.area_id].title : ''"></router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="renderUserAge(user)"></router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="renderUserExperience(user)"></router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="user.phone"></router-link>
                        <router-link :to="'/coworkers/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="user.email"></router-link>
                        <td class="td-cell  d-text-right">
                          <dropdown v-if="allowDropUser(user) || allowFireUser(user)">
                            <template slot="button">
                              <i class="fa fa-ellipsis-v d-text-dark-hover trigger table-drop-icon d-text-semi-dark fs-21" aria-hidden="true"></i>
                            </template>
                            <div class="dropdown-item" v-if="allowFireUser(user)" v-on:click="confirmFireUserDialog(user)">уволить</div>
                            <div class="dropdown-item" v-if="allowDropUser(user)" v-on:click="confirmDropUserDialog(user)">удалить</div>
                          </dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import usersList from '@/components/users/usersList.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import coworkersComponentMixin from '@/mixins/coworkersComponentMixin.vue';
  import areasMixin from '@/mixins/areasMixin.vue';
  import routingMixin from '@/mixins/routingMixin.vue';
  export default {
    mixins: [usersMixin, commonMixin, permissionsMixin, coworkersComponentMixin, areasMixin, routingMixin, Component],
    data() {
      return {
        usertypes: [],
        users: [],
        fireReason: '',
        fire_black_list: false,
        firingUserId: null,
        q: '',
        profsq: '',
        active: false,
        p: 1,
        selectedAreas: [],
        selectedExpirience: null,
        areas: [],
        selectedAge: '',
        fired: false,
        searchTimeout: null,
        professions: [],
        activeTab: 'workers',
        office: this.isOfficeActive(),
        searchLock: false,
        possibleAges: {
          'lower20': { title: 'До 20-ти лет' },
          '20_25': { title: '20-25 лет' },
          '25_35': { title: '25-35 лет' },
          'over35': { title: 'Более 35 лет' },
        },
        possibleExpiriences: {
          'lower3': { title: 'менее 3-х лет' },
          'over3': { title: 'более 3-х лет' },
          'over5': { title: 'более 5-ти лет' },
          'over10': { title: 'более 10-ти лет' },
        }
      }
    },
    computed: {
      color() {
        return this.office || this.activeTab === 'professions' ? 'success' : 'info';
      },
      pageData() {
        let cw = 'Сотрудники компании';
        if(this.activeTab === 'workers') {
          let t = cw+ ' <span class="d-color-'+this.color+'">'+('('+this.pagePostTitle+')</span>');
          return { title: t, metaTitle: cw };
        }
        if(this.activeTab === 'professions') {
          let t = 'Должности';
          return { title: t, metaTitle: t };
        }
        return { title: '', metaTitle: '' };
      },
      pagePostTitle() {
        if(this.office) { return 'Офис'; }
        return 'Строители';
      },
      filteredProfessions() {
        return this.professions.filter((el) => {
          return (this.profsq && this.profsq.length) ? (el.title.toLowerCase().indexOf(this.profsq.toLowerCase()) !== -1) : true;
        });
      },
    },
    async mounted () {
      this.recalculateView();
      await this.getAreas();
      await this.refreshProfessions();
      await this.getProfessionsTotals();
      await this.getUsers();
      this.componentReady = true;
      this.addEvents();
    },
    destroyed() {
      this.removeEvents();
    },
    watch: {
      q(v) {
        this.forceSearch();
      },
      usertypes() {
        this.forceSearch();
      },
      selectedAge() {
        this.forceSearch();
      },
      selectedAreas() {
        this.forceSearch();
      },
      selectedExpirience() {
        this.forceSearch();
      },
      fired() {
        this.forceSearch();
      },
      office(v) {
        if(!this.componentReady) { return; }
        this.p = 1;

        this.$router.push(this.determineCoworkersPath(v));
      },
      activeTab(v) {
        if(!this.componentReady) { return; }
        this.$router.push(v === 'workers' ? this.determineCoworkersPath(this.office) : '/coworkers/professions');
      },
      $route(v) {
        if(!this.componentReady) { return; }
        this.searchLock = true;
        this.recalculateView(v);
        setTimeout(() => {
          this.searchLock = false;
        }, 150);
      },
      usertypes() {
        if(!this.componentReady) { return; }
        this.clearUserFilters();
        this.getUsers();
      },
    },
    methods: {
      async getProfessionsTotals() {
        let profsByIds = {};
        this.professions.forEach((x) => {
          this.$set(x, 'total', 0);
          profsByIds[x.profession_id] = x;
        });
        const resp = await $http.get('/professions/totals');
        if(typeof resp.list === 'object' && resp.list) {
          for(let prop in resp.list) {
            if(!profsByIds[prop]) { continue; }
            profsByIds[prop].total = resp.list[prop];
          }
        }
      },
      addEvents() {
        window.addEventListener('scroll', this.showMoreUsers);
      },
      removeEvents() {
        window.removeEventListener('scroll', this.showMoreUsers);
      },
      showMoreUsers() {
        if(this.$route.path !== '/coworkers' && this.$route.path !== '/coworkers/workmans') { return; }
        if(!window.bottomAchieved()) { return; }
        if(!this.displayShowMoreRow()) { return; }
        this.completeUsersList();

      },
      clearUserFilters() {
        this.selectedAreas = [];
        this.selectedAge = null;
        this.p = 1;
        this.q = '';
        this.selectedExpirience = '';
        this.fired = false;
        this.getUsers();
      },
      isOfficeActive(v) {
        let t = v ? v : this.$route;
        return t.path === '/coworkers';
      },
      determineCoworkersPath(v) {
        return !v ? '/coworkers/workmans' : '/coworkers';
      },
      recalculateView(v) {
        let t = v ? v : this.$route;
        this.activeTab = t.path === '/coworkers/professions' ? 'professions' : 'workers';
        if(t.path === '/coworkers') {
          this.office = true;
        }
        if(t.path === '/coworkers/workmans') {
          this.office = false;
        }
        if(this.activeTab === 'workers') {
          if(this.office) {
            this.usertypes = ['admin', 'coworker'];
          } else {
            this.usertypes = ['workman'];
          }
        }
        this.page();
      },
      confirmDropProfDialog(prof) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype !== 'admin') { return 0; }
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены, что хотите удалить эту профессию?',
          confirm: async function() {
            const resp = await $http.post('/professions/delete', { profession_id: prof.profession_id });
              if(resp.result) {
                await that.$store.dispatch('getAppData');
                setTimeout(() => {
                  that.refreshProfessions();
                }, 120);
              } else {
                this.alert(resp.display);
              }
          },
        });
        return 1;
      },
      allowDropProfession(prof) {
        if(prof.protection) { return 0; }
        if(!this.$store.state.user) { return 0; }
        return this.$store.state.user.usertype === 'admin';
      },
    },
    components: {

    }
  }
</script>
