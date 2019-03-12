<template>
  <div class="container-fluid">
    <div class="row" >
      <div class="col-12 u-p-zero">
        <div class="c-toolbar u-mb-medium c-toolbar--small" >
          <div class="c-tabs__item" v-on:click="activeTab = 'contacts'"><span :class="'c-tabs__link trigger' +((activeTab === 'contacts') ? ' active' : '')">физические лица</span></div>
          <div class="c-tabs__item" v-on:click="activeTab = 'companies'"><span :class="'c-tabs__link trigger' +(activeTab === 'companies' ? ' active' : '')">компании</span></div>
        </div>
      </div>
      <div class="col-12" v-if="activeTab === 'contacts'">
        <div>
          <div class="c-card u-mb-medium n-mh-medium">
            <table class="c-table u-border-zero mh-200">
              <caption class="c-table__title">
                <div class="row">
                  <div class="col-12 col-md-9 col-sm-8">
                    <div class="search-caption">
                      <div class="search-caption-item search-caption-item-wide">
                        <div class="c-field u-mb-small">
                          <input type="text" class="c-input" v-model="q"  placeholder="Начните ввод" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-3 col-sm-4">
                    <div class="u-text-right">
                      <router-link :to="makeContactLink()"  class="btn-correct-1 c-btn c-btn--success" tag="button">
                        <i class="fa fa-plus u-mr-xsmall u-opacity-medium"></i>
                        <span>Создать контакт</span>
                      </router-link>
                    </div>
                  </div>
                </div>

              </caption>
              <thead class="c-table__head c-table__head--slim">
              <tr class="c-table__row">
                <th class="c-table__cell c-table__cell--head">Имя</th>
                <th class="c-table__cell c-table__cell--head u-hidden-down@tablet">Телефон</th>
                <th class="c-table__cell c-table__cell--head u-hidden-down@tablet">Емайл</th>
                <th class="c-table__cell c-table__cell--head u-hidden-down@tablet comment-cell">Примечание</th>
                <th class="c-table__cell c-table__cell--head u-text-right actions-cell-1"></th>
              </tr>
              </thead>
              <tbody>

              <tr :class="'c-table__row ' + (user.black_list ? 'c-table__row--danger' : '')"  v-for="(user, index) in users">
                <td class="c-table__cell">
                  <div class="o-media">
                    <router-link :to="makeContactLink({ item_id: user.user_id })" tag="a" class="u-color-primary">
                      <div class="o-media__img u-mr-xsmall">
                        <div class="c-avatar c-avatar--xsmall">
                          <img class="c-avatar__img" :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)">
                        </div>
                      </div>
                    </router-link>
                    <div class="o-media__body">
                      <router-link :to="makeContactLink({ item_id: user.user_id })" tag="a" class="u-color-primary">
                        <span v-html="renderUserRealName(user)"></span>
                        <small class="u-block u-text-mute">Контакт</small>
                      </router-link>
                      <small class="u-block u-hidden-up@mobile u-mt-small" v-if="user.phone">
                        <a :href="'tel:'+user.phone" class="u-text-dark">
                          <i class="fa fa-phone u-mr-xsmall mobile-only-icon"></i>
                          <span v-html="user.phone"></span>
                        </a>
                      </small>
                    </div>
                  </div>
                </td>
                <td class="c-table__cell u-hidden-down@tablet">
                  <div v-html="user.phone ? user.phone : ''"></div>
                  <small class="u-block u-text-mute" v-if="user.phone2" v-html="user.phone2"></small>
                </td>
                <td class="c-table__cell u-hidden-down@tablet">
                  <div v-html="user.email"></div>
                </td>
                <td class="c-table__cell u-hidden-down@tablet  comment-cell" v-html="user.comment"></td>
                <td class="c-table__cell u-text-right actions-cell-1">
                  <div class="dropdown c-dropdown" v-if="allowDropUser(user)">
                    <button class="dropdown-toggle clear-btn" type="button" :id="'dd-us-'+index" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <i class="fa fa-ellipsis-v trigger table-drop-icon u-text-mute" aria-hidden="true"></i>
                    </button>
                    <ul class="dropdown-menu c-dropdown__menu" :aria-labelledby="'dd-us-'+index">
                      <li class="c-dropdown__item dropdown-item trigger" v-if="allowDropUser(user)" v-on:click="confirmDropUserDialog(user)">удалить</li>
                    </ul>
                  </div>

                </td>
              </tr>
              <tr v-if="users.length === 0 && !loading">
                <td colspan="25">
                  <div class="empty-table-error-container u-text-mute u-text-center">Не найдено пользователей соответствующих вашему запросу</div>
                </td>
              </tr>
              <tr v-if="displayShowMoreRow()">
                <td colspan="25">
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
      </div>
      <div class="col-12" v-if="activeTab === 'companies'">
        <div class="c-card u-mb-medium n-mh-medium">
          <table class="c-table u-border-zero mh-200">
            <caption class="c-table__title">
              <div class="row">
                <div class="col-12 col-md-9 col-sm-8">
                  <div class="search-caption">
                    <div class="search-caption-item search-caption-item-wide">
                      <div class="c-field u-mb-small">
                        <input type="text" class="c-input" v-model="companies_q" placeholder="Начните ввод"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-3 col-sm-4">
                  <div class="u-text-right">
                    <router-link :to="makeCompanyLink()" class="btn-correct-1 c-btn c-btn--success" tag="button">
                      <i class="fa fa-plus u-mr-xsmall u-opacity-medium"></i>
                      <span>Создать компанию</span>
                    </router-link>
                  </div>
                </div>
              </div>

            </caption>
            <thead class="c-table__head c-table__head--slim">
            <tr class="c-table__row">
              <th class="c-table__cell c-table__cell--head">Имя</th>
              <th class="c-table__cell c-table__cell--head u-hidden-down@tablet">Телефон</th>
              <th class="c-table__cell c-table__cell--head u-hidden-down@tablet">Емайл</th>
              <th class="c-table__cell c-table__cell--head u-hidden-down@tablet comment-cell">Примечание</th>
              <th class="c-table__cell c-table__cell--head u-text-right actions-cell-1"></th>
            </tr>
            </thead>
            <tbody>
            <tr class="c-table__row"  v-for="a, b in companies">
              <td class="c-table__cell" >
                <router-link :to="makeCompanyLink({ item_id: a.company_id })" class="u-text-dark" v-html="a.title"></router-link>
              </td>
              <td class="c-table__cell" >
                <router-link :to="makeCompanyLink({ item_id: a.company_id })" class="u-text-dark" v-html="a.phone"></router-link>
              </td>
              <td class="c-table__cell" >
                <router-link :to="makeCompanyLink({ item_id: a.company_id })" class="u-text-dark" v-html="a.email"></router-link>
              </td>
              <td class="c-table__cell comment-cell" v-html="a.comment"></td>
              <td class="c-table__cell c-table__cell--head u-text-right actions-cell-1">
                <div class="dropdown c-dropdown" >
                  <button class="dropdown-toggle clear-btn" type="button" :id="'dd-c-'+b" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <i class="fa fa-ellipsis-v trigger table-drop-icon u-text-mute" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu c-dropdown__menu" :aria-labelledby="'dd-c-'+b">
                    <li class="c-dropdown__item dropdown-item trigger"  v-on:click="confirmDropCompanyDialog(a)">удалить</li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr v-if="displayShowMoreCompaniesRow()">
              <td colspan="25">
                <div class="u-text-center u-p-medium">
                  <button class="c-btn c-btn--main" v-on:click="completeCompaniesList()">
                    Показать еще <i class="fa fa-spinner preloader fa-spin fa-fw" v-if="completing" aria-hidden="true"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="companies.length === 0 && !companies_loading">
              <td colspan="25">
                <div class="empty-table-error-container u-text-mute u-text-center">Не найдено компаний соответствующих вашему запросу</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
    <overlayUserComponent :show="modalMode === 'contact'" ></overlayUserComponent>
    <overlayCompanyComponent :show="modalMode === 'company'" :modifyCallback="companyModifyCallback"></overlayCompanyComponent>
  </div>
</template>
<script>
  import Component from '@/components/Component'
  import nselect2 from '@/components/elements/nselect2.vue';
  import overlayUserComponent from '@/components/overlayUserComponent.vue';
  import overlayCompanyComponent from '@/components/overlayCompanyComponent.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import companiesMixin from '@/mixins/companiesMixin.vue';
  import modalRoutingMixin from '@/mixins/modalRoutingMixin.vue';
  export default {
    mixins: [Component, usersMixin, companiesMixin, modalRoutingMixin],
    data() {
      return {
        pageData: {title: 'Контакты', metaTitle: 'Контакты',},
        q: '',
        contacts: [],
        massActions: [

        ],
        users: [],
        usertypes: ['contact', 'client'],
        massAction: '',
        modalMode: '',
        activeTab: 'contacts'
      };
    },

    async created() {

      this.loading = 0;
      this.completing = 0;
      await this.getUsers();
      this.$store.dispatch('setComponentReady', true);
      setTimeout(() => {
        this.recalculateView();
      }, 950);
    },
    watch: {
      $route(v) {
        this.recalculateView(v);
      },
      loading(v) {
        if(!this.usersReady) { return; }
        this.$store.commit('loading', v);
      },
      activeTab(v) {
        this.recalculateActiveTab();
      },
      q () {
        if(!this.usersReady) { return; }
        this.forceSearch();
      },
      companies_q() {
        if(!this.companies_ready) { return; }
        this.forceCompaniesSearch();
      },
    },
    methods: {

      recalculateView(v) {
        let target = v ? v : this.$route;
        this.modalMode = target.query.view ? target.query.view : null;
      },
      recalculateActiveTab(v) {
        let t = v ? v : this.activeTab;
        if(t === 'contacts') {
          this.p = 1;
          this.q = '';
          this.getUsers();
        } else {
          this.companies_p = 1;
          this.companies_q = '';
          this.getCompanies();
        }
      },
      makeContactLink(opts = {}) {
        let params = Object.assign({}, this.$route.query);
        params.view = 'contact';
        if(opts.item_id) {
          params.item_id = opts.item_id;
        } else {
          delete params.item_id;
        }
        return this.$route.path+window.serialize(params);
      }
    },
    makeCompanyLink(opts = {}) {
      let params = Object.assign({}, this.$route.query);
      params.view = 'company';
      if(opts.item_id) {
        params.item_id = opts.item_id;
      } else {
        delete params.item_id;
      }
      return this.$route.path+window.serialize(params);
    },
    components: {
      nselect2,overlayUserComponent, overlayCompanyComponent
    }
  }
</script>
