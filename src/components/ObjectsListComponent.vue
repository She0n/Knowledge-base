<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="c-card u-mb-medium n-mh-medium">
            <table class="c-table u-mb-small u-border-zero">
              <caption class="c-table__title" v-if="displaySearchRow()">
                <div class="row">
                  <div class="col-12 col-md-9 col-sm-8">
                    <form onsubmit="return false;" class="row">
                      <div class="col-12 col-md-5 col-sm-5">
                        <div class="c-field has-addon-left">
                          <span class="c-field__addon"><i class="fa fa-search"></i></span>
                          <input class="c-input"  type="text" placeholder="Начните ввод">
                        </div>
                      </div>
                      <div class="col-12 col-sm-5">
                        <div class="c-choice c-choice--checkbox u-mt-xsmall" v-if="showActiveFilter()">
                          <input class="c-choice__input" id="active-objects-filter" v-model="active" name="active" type="checkbox">
                          <label class="c-choice__label" for="active-objects-filter">Не закрытые</label>
                        </div>
                      </div>
                      <div class="col-12 col-sm-4">

                      </div>
                    </form>

                  </div>
                  <div class="col-12 col-sm-4 col-md-3" v-if="showCreateBtn && canCreateObjects">
                    <div class="u-text-right">
                      <router-link to="/objects/object" tag="a" class="c-btn c-btn--success"><i class="fa fa-plus u-mr-small"></i>добавить новый</router-link>
                    </div>
                  </div>
                </div>

              </caption>
              <thead class="c-table__head c-table__head--slim">
              <tr class="c-table__row">
                <th class="c-table__cell c-table__cell--head">Объект</th>
                <th class="c-table__cell c-table__cell--head u-hidden-down@tablet">Срок сдачи</th>
                <th class="c-table__cell c-table__cell--head u-hidden-down@wide">Клиент</th>
                <th class="c-table__cell c-table__cell--head u-text-right"></th>
              </tr>
              </thead>

              <tbody v-if="loading">
              <tr>
                <td colspan="7">
                  <div class="empty-table-error-container u-text-center"><preloader/></div>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr v-if="objects.length === 0">
                <td colspan="7">
                  <div class="empty-table-error-container u-text-mute u-text-center" v-html="noObjectsMessage()"></div>
                </td>
              </tr>
              <tr class="c-table__row" v-for="object, index in objects">
                <td class="c-table__cell">
                  <router-link :to="link+'?object_id='+object.object_id" class="u-block">
                    <span v-html="object.relatedEstimate.address ? object.relatedEstimate.address : 'Нет адреса'" class="u-text-dark"></span>
                    <small class="u-block u-text-mute" v-if="object.relatedEstimate.estimate_id" v-html="(object.relatedEstimate.rooms_count +' ' +rusificate(object.relatedEstimate.rooms_count, 'помещение', 'помещения', 'помещений')) + ' &nbsp;&nbsp;-&nbsp;&nbsp; '+object.relatedEstimate.total_square+' м<sup>2</sup>'"></small>
                    <small class="u-block u-text-mute" v-else>нет сметы</small>
                  </router-link>
                </td>
                <td class="c-table__cell u-hidden-down@tablet">
                  <span v-html="renderDeadline(object.finish_date)"></span>
                  <small class="u-block u-text-mute" v-html="renderDeadlineSubtext(object)"></small>
                </td>

                <td class="c-table__cell u-hidden-down@wide">
                  <div class="o-media">
                    <div class="o-media__img u-mr-xsmall">
                      <div class="c-avatar c-avatar--xsmall">
                        <img class="c-avatar__img" :src="renderAvatar(((object.relatedClient && object.relatedClient.avatar) ? object.relatedClient.avatar : false), 'xs')" onerror="window.setDefaultAvatar(this)">
                      </div>
                    </div>
                    <div class="o-media__body">
                      <span class="u-text-dark" v-html="renderUserRealName(object.relatedClient) ? renderUserRealName(object.relatedClient) : 'Не назначен'"></span>
                      <small class="u-block u-text-mute">Клиент</small>
                    </div>
                  </div>
                </td>
                <td class="c-table__cell u-text-right">
                  <div class="dropdown c-dropdown">
                    <button type="button" :id="'dd-oa-'+index" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="true" class="dropdown-toggle clear-btn"><i aria-hidden="true"
                                                                                      class="fa fa-ellipsis-v trigger table-drop-icon u-text-mute"></i>
                    </button>
                    <ul :aria-labelledby="'dd-us-264'+index" class="dropdown-menu c-dropdown__menu">
                      <li class="c-dropdown__item dropdown-item trigger"><i
                        class="fa fa-trash u-t-icon u-mr-xsmall"></i> удалить
                      </li>
                    </ul>
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
  import modalComponent from '@/components/modalComponent.vue';
  import objectsMixin from '@/mixins/objectsMixin.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    mixins: [modalComponent, objectsMixin, commonMixin],
    props: {
      link: {
        type: String,
        default: '/objects/object'
      },
      showCreateBtn: {
        type: Boolean,
        default: false
      },
      isPage: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        objects: [],
        loading: false,
        completing: false,
        canCreateObjects: false,
        active: false,
      };
    },
    async mounted() {
      this.canCreateObjects = await this.$store.dispatch('havePermission', ['crm', 'createObjects']);
      await this.getObjects();
    },
    methods: {
      noObjectsMessage() {
        if(this.allowSearch()) {
          if(window.location.search && window.location.search.length) {
            return 'По вашему запросу не найдено ни одного объекта';
          } else {
            return this.allowForeign() ? 'Нет объектов в системе' : 'У вас нет объектов';
          }
        }
        return 'У вас нет объектов';
      },
      allowForeign() {
        return 1;
      },
      allowSearch() {
        return 1;
      },
      displaySearchRow() {
        return 1;
      },
      showActiveFilter () {
        if(!this.$store.state.user) { return 0; }
        let usertypes = ['admin'];
        return (usertypes.indexOf(this.$store.state.user.usertype) !== -1);
      },
      renderDeadline(date) {
        let formatted = window.dateFormatter.reformatDate(date);
        return formatted.length ? formatted : 'Не установлен';
      },
      renderDeadlineSubtext(o) {
        if(!o.finish_date) { return ''; }
        if(!o.start_date) { return ''; }
        let diff = (new Date(o.finish_date).getTime()) - (new Date().getTime());
        diff = parseInt(diff/1000/60/60/24);
        if(diff < 0) { return o.object_status === 'closes' ? 'Проект закрыт' : '<span class="d-color-danger">Просрочен</span>'; }
        if(diff < 30) {
          return 'через ' +diff+' '+ this.rusificate(diff, 'день', 'дня', 'дней');
        }
        let month = parseInt(diff/30);
        return 'через '+month+' '+this.rusificate(month, 'месяц', 'месяца', 'месяцев');
      },
      async getObjects(defarg = false, opts = {}) {
        if(this.loading || this.completing) { return; }
        this.loading = !defarg;

        if(this.loading) {
          this.objects = [];
        }
        this.completing = defarg;
        let resp = await $http.post('/objects', {
          p: this.p,
          q: this.q,
          start: opts.start
        });
        if(resp.list) {
          for(let i = 0; i < resp.list.length; i++) {
            this.objects.push(resp.list[i]);
          }
          this.total = resp.total;
          this.perPage = resp.perPage;
        } else {
          this.total = 0;
          this.perPage = 60;
        }
        this.loading = false;
        this.completing = false;
        if(this.isPage) {
          this.$store.dispatch('setComponentReady', true);
        }
      },
    },
    components: {
      preloader
    }
  }
</script>
