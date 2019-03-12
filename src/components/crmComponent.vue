<template>
  <div>
    <div class="c-toolbar u-block u-p-zero u-mb-medium">
        <div class="funnel-toolbar-wrapper">
          <div class="funnel-corner" id="funnels-dd-wrapper" @mouseover="funnelsExpanded = true" @mouseleave="funnelsExpanded = false;">
            <div v-if="funnelsExists" >
              <h2 :class="'c-navbar__title u-mr-auto  lh-38 '+(category.funnels.length > 1 ? 'trigger' : '')"  v-html="activeFunnel.title"></h2>
              <div class="funnels-list-dd" v-show="funnelsExpanded" v-if="category.funnels.length > 1">
                <div class="funnels-list-arr">
                  <router-link  :to="createLinkWithProp({ mode: mode, funnel_id: item.funnel_id })" :key="item.funnel_id" class="funnel-list-item u-text-dark-hover " v-for="item in category.funnels">
                    <div v-html="item.title"></div>
                  </router-link>
                </div>
              </div>
              <div class="funnel-corner-icons">
                <router-link :to="createLinkWithProp({ mode: null })" :class="'c-toolbar__icon has-divider trigger '+(mode === 'kanban' ? 'is-active' : '')">
                  <i class="fa fa-th-large"></i>
                </router-link>
                <router-link :to="createLinkWithProp({ mode: 'list' })" :class="'c-toolbar__icon trigger '+(mode === 'list' ? 'is-active' : '')">
                  <i class="fa fa-navicon"></i>
                </router-link>
              </div>
            </div>
          </div>
          <div class="leads-search-wrapper">
              <input type="text" placeholder="Поиск по сделкам" v-model="searchData.q" class="c-input c-input-blank c-input-large">
          </div>
          <div class="leads-actions-corner">
            <i class="fa fa-sliders icon-extra-1 u-color-info-hover" v-show="false" title="Настроить воронку"></i>
            <router-link :to="makeLeadLink({ lead_id: null })">
              <button class="c-btn c-btn--blue" ><i class="fa fa-plus u-mr-xsmall"></i>Создать лида</button>
            </router-link>
          </div>
        </div>
    </div>
    <div v-if="mode === 'list'">
      LIST
    </div>
    <div class="funnels-cols-wrapper" v-else>
    <div class="funnels-cols c-scrollbar-transparent" v-dragscroll:nochilddrag>
      <div class="funnel-col" v-for="col, colIndex in activeFunnel.cols">
          <div class="funnel-col-title" v-html="col.title" data-dragscroll></div>
          <div class="funnel-col-delimeter" :style="'background-color: #'+(col.color)" data-dragscroll></div>
          <fastLead :fastLead="fastLead" ref="fastLead" v-if="colIndex === 0" :create="createFastLeadEx" :submit="createFastLeadEx"></fastLead>
          <Container :group-name="'funnel-cols'" :key="col.col_id" :get-child-payload="itemIndex => getChildPayload(col, itemIndex)"  @drop="dropLeadIntoCol(colIndex, $event)"   class="funnel-col-list">
            <Draggable v-for="item in col.items" :key="'col-'+col.col_id+'-item-'+item.lead_id" >
              <funnelCard :item="item" :link="makeLeadLink({ lead_id: item.lead_id })" :renderDate="renderDate"></funnelCard>
            </Draggable>
          </Container>
      </div>
    </div>
    </div>

      <leadComponent :show="modalMode === 'lead'"  ></leadComponent>

  </div>
</template>
<script>
  import Inputmask from 'inputmask';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import applyDrag from '@/helpers/applyDrag';
  import Component from '@/components/Component.vue';
  import { dragscroll } from 'vue-dragscroll/src/main';
  import baseKanbanMixin from '@/mixins/baseKanbanMixin.vue';
  import fastLead from '@/components/elements/fastLead.vue';
  import baseLeadsMixin from '@/mixins/baseLeadsMixin.vue';
  import extendedLeadsMixin from '@/mixins/extendedLeadsMixin.vue';
  import funnelCard from '@/components/elements/funnelCard.vue';
  import leadComponent from '@/components/leadComponent.vue';
  export default {
    mixins: [Component, baseKanbanMixin, baseLeadsMixin, extendedLeadsMixin],
    directives: {
      dragscroll: dragscroll
    },
    data() {
      return {
        pageData: { title: 'Лиды', metaTitle: 'Лиды', headerClass: 'u-hidden', style: 'page-w-header' },
        activeFunnelId: 0,
        funnelsExists: true,
        activeFunnel: this.getClearFunnel(),
        category: this.getClearCategory(),
        mode: 'kanban',
        fastLeadExpanded: false,
        funnelsExpanded: false,
        prevRoute: {
          path: '',
          query: {}
        },
        categoryFunnelsByIds: {},
        /*

         */
      };
    },
    destroyed() {
        this.$store.commit('setCrmChannelData', {
          channel: null,
          callback: null
        });
    },
    async created() {
      this.page();
      await this.getLeadsCategories();
      this.category = this.leadsCategories.leads;
      setTimeout(() => {
        this.recalculateView();
        this.$store.dispatch('setComponentReady', true);
      }, 200);


    },
    computed: {
    },
    watch: {
      $route(v) {
        this.recalculateView(v);
      },
    },
    methods: {

      async getLeadsCallback() {
        let cat = this.extractCategoryFromPath(this.$route.path);
        let leads = await this.getLeads({ returning: true, category: cat, funnel_id: this.activeFunnel.funnel_id });
        if(!this.allowRefreshLeads) {
          this.refreshLeadsCallback = () => {
            this.clearActiveFunnelItems();
            leads.list = Array.isArray(leads.list) ? leads.list : [];
            this.setActiveFunnelLeads(leads.list);
          }
        }
        this.clearActiveFunnelItems();
        leads.list = Array.isArray(leads.list) ? leads.list : [];
        this.setActiveFunnelLeads(leads.list);

      },
      async createFastLeadEx() {
        let cat = this.extractCategoryFromPath(this.$route.path);
        let resp = await this.createFastLead({
          category: cat,
          funnel_col: this.activeFunnel.cols[0].col_id,
        });
        if(resp.result) {
          this.$refs.fastLead[0].expanded = false;
          this.fastLead = this.getClearFastLead();
        } else {
          this.$msg.error(resp.display);
        }
        await this.getLeads({ start: true, category: cat, funnel_id: this.activeFunnel.funnel_id });
      },
      setMasks() {
        let els = document.getElementsByClassName('phone');
        if(!els) { return; }
        for(let i = 0; i < els.length; i++) {
          let im = new Inputmask('+7 (999)-999-99-99');
          im.mask(els[i]);
        }
      },
      async dropLeadIntoCol(colIndex, dropResult) {
        this.$set(this.activeFunnel.cols[colIndex], 'items', applyDrag(this.activeFunnel.cols[colIndex].items, dropResult));
        this.allowRefreshLeads = true;
        if(dropResult.addedIndex === null) { return; }
        if(!dropResult.payload) { return; }
        let newColId = this.activeFunnel.cols[colIndex].col_id;
        let result = await this.changeLeadFunnelCol({
          lead_id: dropResult.payload.lead_id,
          funnel_col: newColId
        });
        if(!result.result) {
          this.$msg.error(result.display);
        } else {

        }
      },
      createLinkWithProp(opts) {
          let params = Object.assign({}, this.$route.query);
          for(let prop in opts) {
            if(prop === 'mode') {
              if(opts[prop] === 'kanban') {
                opts[prop] = null;
              }
            }
            if(opts[prop]) {
              params[prop] = opts[prop];
            } else {
              delete params[prop];
            }
          }
          return this.$route.path+window.serialize(params);
      },
      recalculateSubscription() {
        let old = this.channels[0] ? this.channels[0] : null;
        let n = this.category+'-'+(this.activeFunnel.funnel_id ? this.activeFunnel.funnel_id : '');
        if(old !== n) {
          this.unsubscribe(old);
          this.subscribe(n);
        }
      },
      async recalculateView(v) {
        let r = v ? v : this.$route;
        await this.calculateActiveFunnel();
        this.recalculateSubscription();
        this.recalculateModalMode();
        this.funnelsExpanded = false;
        if(r.query.mode === 'list') {
          this.mode = 'list';
        } else {
          this.mode = 'kanban';
        }
        this.prevRoute.path = this.$route.path;
        this.prevRoute.query = this.$route.query;
      },
      async calculateActiveFunnel() {
        let funnelId = this.$route.query.funnel_id ? this.$route.query.funnel_id : (this.category.funnels[0] ? this.category.funnels[0].funnel_id : 0);
        if(this.activeFunnel.funnel_id === funnelId) { return; }
        if(!funnelId) {
          this.funnelsExists = false;
          return;
        }
        if(!this.funnelsByIds[funnelId]) {
          this.$router.push('/not-found');
          return;
        }
        this.$set(this, 'activeFunnel', this.funnelsByIds[funnelId]);
        this.searchData = this.getClearSearchData();
        let cat = this.extractCategoryFromPath(this.$route.path);
        this.$store.commit('setCrmChannelData', {
          channel: cat+'-'+this.activeFunnel.funnel_id,
          callback: this.getLeadsCallback
        });
        await this.getLeads({ start: true, funnel_id: this.activeFunnel.funnel_id });
      },
    },
    components: {
      Container, Draggable, fastLead, funnelCard, leadComponent
    },
  }
</script>
