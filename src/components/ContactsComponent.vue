<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div v-else>
      <div class="row">
        <div class="col-12">
          <div class="box-shadow-wrapper d-bg-semi-gray d-border-radius">
            <div class="table-form-header d-bg-white">
              <div class="row ">
                <div class="col-12 d-pr-zero d-pr-25">
                  <div class="justify-content-between d-flex">
                    <div class="">
                      <div class=" d-ph-25">
                        <router-link :to="'/crm/contacts'" :class="'d-mr-20 d-text-dark active-underline d-pv-12 d-inline-block '+(activeTab === 'contacts' ? 'd-active-'+color : '')">
                          Физ. лица
                        </router-link>
                        <router-link :to="'/crm/contacts/companies'" :class="'d-text-dark  active-underline d-pv-12 d-inline-block '+(activeTab === 'companies' ? 'd-active-'+color : '')">
                          Компании
                        </router-link>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="col-12">
                  <div class="d-border-bottom"></div>
                </div>
              </div>
              <div class="row" v-if="activeTab === 'companies'">
                <div class="col-12">
                  <div class="d-pv-25 d-ph-25">
                    <div class=" d-flex">
                      <div class="flex-grow-1 d-mr-12">
                        <div class="iconed-input-wrapper d-mb-20">
                          <input type="text" class="d-input-cf d-width-100" v-model="companiesq" placeholder="Поиск компании">
                          <i class="fa fa-search"></i>
                        </div>
                      </div>
                      <div>
                        <router-link to="/crm/contacts/companies/profile"  :class="'d-inline-block d-btn d-btn--'+(color)">Создать компанию</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-if="activeTab === 'contacts'" :mounted="addUserEvents()" :destroyed="removeUserEvents()">
                <div class="col-12 d-border-right d-pr-zero">
                  <div class="d-pv-25 d-ph-25">
                    <div class="d-flex d-pb-12">
                      <div class="flex-grow-1 d-mr-12">
                        <div class="iconed-input-wrapper d-mb-20">
                          <input type="text" class="d-input-cf d-width-100" v-model="q" placeholder="Поиск контакта">
                          <i class="fa fa-search"></i>
                        </div>
                        <div v-if="activeTab === 'workers'">
                          <sInput v-model="fired" v-if="havePermission('crm', 'fireCoworkers')" :field="{ title: 'Искать среди уволенных сотрудников', type: 'checkbox' }"></sInput>
                        </div>
                      </div>
                      <div>
                        <router-link to="/crm/contacts/profile" :class="'d-inline-block d-btn d-btn--'+color">Создать контакт</router-link>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="col-12">
                  <div class="d-border-bottom"></div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'companies'">
              <div class="d-pv-25 d-ph-25">
                <table>
                    <thead>
                      <th class="th-cell d-text-left">Название</th>
                      <th class="th-cell d-text-center">Телефон</th>
                      <th class="th-cell d-text-left">Емайл</th>
                      <th class="th-cell"></th>
                    </thead>
                  <tbody>
                  <tr class="td-row" v-if="!companies.length">
                    <td class="td-cell empty-table-err" colspan="20">Поиск не дал результатов</td>
                  </tr>
                  <tr class="c-table__row"  v-for="a, b in companies">
                    <td class="td-cell" >
                      <router-link :to="'/crm/contacts/companies/profile?company_id='+a.company_id" class="u-text-dark" v-html="a.title"></router-link>
                    </td>
                    <td class="td-cell" >
                      <router-link :to="'/crm/contacts/companies/profile?company_id='+a.company_id" class="u-text-dark" v-html="a.phone"></router-link>
                    </td>
                    <td class="td-cell" >
                      <router-link :to="'/crm/contacts/companies/profile?company_id='+a.company_id" class="u-text-dark" v-html="a.email"></router-link>
                    </td>
                    <td class="td-cell comment-cell" v-html="a.comment"></td>
                    <td class="td-cell  d-text-right">
                      <dropdown v-if="allowDropUser({ usertype: 'client' })">
                        <template slot="button">
                          <i class="fa fa-ellipsis-v d-text-dark-hover trigger table-drop-icon d-text-semi-dark fs-21" aria-hidden="true"></i>
                        </template>
                        <div class="dropdown-item"  v-on:click="confirmDropCompanyDialog(a)">удалить</div>
                      </dropdown>
                    </td>
                  </tr>

                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="activeTab === 'contacts'">
              <div class="d-pv-12 d-ph-25">
                <table>
                  <thead>
                  <th class="th-cell d-text-left">ФИО</th>
                  <th class="th-cell">Телефон</th>
                  <th class="th-cell">Контактная почта</th>
                  <th class="th-cell">Заведен в системе</th>
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
                    <td class="td-cell d-text-center trigger">
                      <div class="skeleton-string d-inline-block"></div>
                    </td>
                    <td class="td-cell trigger d-text-center">
                      <div class="skeleton-string d-inline-block"></div>
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
                    <router-link :to="'/crm/contacts/profile?user_id='+user.user_id" tag="td" class="td-cell trigger">
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
                    <router-link :to="'/crm/contacts/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="user.phone"></router-link>
                    <router-link :to="'/crm/contacts/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="user.email"></router-link>
                    <router-link :to="'/crm/contacts/profile?user_id='+user.user_id" tag="td" class="td-cell trigger d-text-center d-text-dark" v-html="renderDate(user.created_at)"></router-link>
                    <td class="td-cell  d-text-right">
                      <dropdown v-if="allowDropUser(user)">
                        <template slot="button">
                          <i class="fa fa-ellipsis-v d-text-dark-hover trigger table-drop-icon d-text-semi-dark fs-21" aria-hidden="true"></i>
                        </template>
                        <div class="dropdown-item"  v-on:click="confirmDropUserDialog(user)">удалить</div>
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
  import companiesMixin from '@/mixins/companiesMixin.vue';
  export default {
    mixins: [usersMixin, commonMixin, permissionsMixin, coworkersComponentMixin, areasMixin,  companiesMixin, Component],
    data() {
      return {
        usertypes: ['client', 'observer', 'contact'],
        users: [],
        orderBy: 'created_at desc',
        q: '',
        companiesq: '',
        active: false,
        p: 1,
        selectedAreas: [],
        selectedExpirience: null,
        areas: [],
        selectedAge: '',
        fired: false,
        searchTimeout: null,
        professions: [],
        activeTab: 'contacts',
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
        return this.activeTab === 'contacts' ? 'success' : 'info';
      },
      pageData() {
        let cw = 'Контакты';
        let pt = this.activeTab === 'contacts' ? 'физ. лица' : 'компании';
        let t = cw+ ' <span class="d-color-'+this.color+'">'+('('+pt+')</span>');
        return { title: t, metaTitle: cw };
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
      companies_q() {
        if(!this.companies_ready) { return; }
        this.forceCompaniesSearch();
      },
      activeTab(v) {
        if(!this.componentReady) { return; }
        this.$router.push(v === 'contacts' ? '/crm/contacts' : '/crm/contacts/companies');
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
      addUserEvents() {
        window.addEventListener('scroll', this.showMoreUsers);
      },
      removeUserEvents() {
        window.removeEventListener('scroll', this.showMoreUsers);
      },
      showMoreUsers() {
        if(!window.bottomAchieved()) { return; }
        if(!this.displayShowMoreRow()) { return; }
        this.completeUsersList();

      },
      clearUserFilters() {
        this.searchLock = true;
        this.selectedAreas = [];
        this.selectedAge = null;
        this.p = 1;
        this.q = '';
        this.selectedExpirience = '';
        this.fired = false;
        this.searchLock = false;
        this.getUsers();
      },
      recalculateView(v) {
        let t = v ? v : this.$route;
        let oldTab = this.activeTab;
        this.activeTab = t.path === '/crm/contacts' ? 'contacts' : 'companies';
        if(oldTab !== this.activeTab) {
          if(this.activeTab === 'contacts') {
            this.clearUserFilters();
          } else {
            this.companies_p = 1;
            this.companies_q = '';
            this.getCompanies();
          }
        }
        this.page();
        console.log('recalcted');
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
