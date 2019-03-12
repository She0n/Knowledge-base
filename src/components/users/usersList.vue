<template>
  <div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div :class="'c-card c-card--responsive u-mb-medium' + (isPage ? ' n-mh-medium' : '')">
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
                    <router-link :to="modifyLink ? modifyLink : '/users?view=user'" class="c-btn c-btn--success" tag="button"><i class="fa fa-plus u-mr-xsmall u-opacity-medium"></i>Создать</router-link>
                  </div>
                </div>
              </div>
            </caption>
            <thead class="c-table__head c-table__head--slim">
            <tr class="c-table__row">
              <th class="c-table__cell c-table__cell--head">No.</th>
              <th class="c-table__cell c-table__cell--head">Имя</th>
              <th class="c-table__cell c-table__cell--head u-text-center">Телефон</th>
              <th class="c-table__cell c-table__cell--head u-text-right"></th>
            </tr>
            </thead>
            <tbody>
            <tr  v-if="loading">
              <td>
                <div class="c-card u-p-medium">
                  <preloader></preloader>
                </div>
              </td>
            </tr>
            <tr class="c-table__row"  v-for="(user, index) in users" v-if="!loading">
              <td class="c-table__cell u-text-mute">{{ user.user_id }}</td>
              <td class="c-table__cell">
              <router-link :to="(modifyLink ? modifyLink : '/users?view=user')+'&item_id='+user.user_id" tag="a" class="u-color-primary">
                <div class="o-media">
                  <div class="o-media__img u-mr-xsmall">
                    <div class="c-avatar c-avatar--xsmall">
                      <img class="c-avatar__img" :src="renderUserListAvatar(user)" onerror="window.setDefaultAvatar(this)">
                    </div>
                  </div>
                  <div class="o-media__body">
                    <span v-html="renderUserRealName(user)"></span>
                    <small class="u-block u-text-mute" v-html="renderUserType(user)"></small>
                  </div>
                </div>

                <small class="u-block u-text-mute"></small>
              </router-link>
              </td>
              <td class="c-table__cell u-text-center" v-html="user.phone ? user.phone : ''"></td>
              <td class="c-table__cell u-text-right">
                <i class="table-drop-icon trigger u-text-mute f-s-23" v-if="allowDropUser(user)" v-on:click="confirmDropUserDialog(user)">&times;</i>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !loading">
              <td colspan="5">
                <div class="empty-table-error-container u-text-mute u-text-center">Не найдено пользователей соответствующих вашему запросу</div>
              </td>
            </tr>
            <tr v-if="displayShowMoreRow()">
              <td colspan="5">
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
  </div>
  </div>
</template>
<script>
  import preloader from '@/components/elements/preloader.vue';
  import usersMixin from '@/mixins/usersMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    mixins: [usersMixin, commonMixin],
    props: {
      modifyLink: {
        type: String,
        default: ''
      },
      usertypes: {
        type: Array,
        default: []
      },
      isPage: {
        default: false
      }
    },
    data () {
      return {
        users: [],
        loading: false,
        completing: false,
        q: '',
        active: false,
        p: 1,
        searchTimeout: null,
      }
    },
    beforeCreate() {

    },
    async created() {
      await  this.getUsers();
      if(this.isPage) {
        this.$store.dispatch('setComponentReady', true);
      }
    },
    mounted () {

    },
    watch: {
      q () {
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
          this.p = 1;
          this.getUsers();
        }, 400);
      },
      usertypes() {
        this.p = 1;
        this.getUsers();
      }
    },
    methods: {


    },
    components: {
      preloader
    }
  }
</script>
