<template>
  <div>
    <headerElement :pageTitle="pageData.metaTitle" >
      <slot name="col-a">asd</slot>
    </headerElement>
    <div class="c-toolbar u-block u-p-zero u-mb-medium" v-if="false">
      <div class="funnel-toolbar-wrapper">
        <div class="leads-search-wrapper">
          <input type="text" placeholder="Поиск по заявкам" v-model="searchData.q" class="c-input c-input-blank c-input-large">
        </div>
        <div class="leads-actions-corner">
          <router-link :to="makeLeadLink({ lead_id: null })">
          <button class="c-btn c-btn--blue">Создать заявку</button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="funnels-cols c-scrollbar-transparent cursor-default" v-dragscroll:nochilddrag>
      <div class="funnel-cols-inner" data-dragscroll>
      <div class="funnel-col" v-for="col, colIndex in category.cols" data-dragscroll>
        <div class="funnel-col-title" data-dragscroll>
          <span v-html="col.title"></span>
          <span v-html="" :style="'color: #'+col.color">325</span>
        </div>
        <div class="funnel-col-delimeter" :style="'background-color: #'+(col.color)" data-dragscroll></div>
        <fastLead :fastLead="fastLead" ref="fastLead" v-if="colIndex === 'unsorted'" :create="createFastRequest" :submit="createFastRequest"></fastLead>
        <Container :group-name="'funnel-cols'" :key="col.col_id" :get-child-payload="itemIndex => getChildPayload(col, itemIndex)"  @drop="dropCategoryRequest('callcenter', colIndex, $event)"   class="funnel-col-list">
          <Draggable v-for="item in col.items" :key="'col-'+col.col_id+'-item-'+item.lead_id">
           <funnelCard :item="item" :link="makeLeadLink({ lead_id: item.lead_id })" :renderDate="renderDate"></funnelCard>
          </Draggable>
        </Container>
      </div>

      <div class="funnel-col funnel-col-drop-container cursor-default" v-if="leadsCategories.leads" data-dragscroll >
          <div class="funnel-col-title cursor-default" data-dragscroll >
            <span>Сделки</span>
            <span v-html="325" class="u-color-success"></span>
          </div>
          <div class="funnel-col-delimeter u-bg-success cursor-default"  data-dragscroll></div>
           <div class="funnel-col-box cursor-default" v-for="a, b in leadsCategories.leads.funnels" >
              <div class="funnel-col-box-title">
                <span v-html="a.title"></span>
                <span>325</span>
              </div>
              <div class="funnel-col-box-placeholder cursor-default" :style="'background-color: #'+a.color">
                <div class="funnel-col-box-dd-here cursor-default">Перетащите сделку сюда</div>
                  <Container  :group-name="'funnel-cols'"   @drop="dropCategoryRequest('leads', b, $event)"  :key="b" >

                  </Container>
              </div>
           </div>
      </div>

      </div>
    </div>
    <leadComponent :show="modalMode === 'lead'"  ></leadComponent>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import applyDrag from '@/helpers/applyDrag';
  import { dragscroll } from 'vue-dragscroll/src/main';
  import baseKanbanMixin from '@/mixins/baseKanbanMixin.vue';
  import baseLeadsMixin from '@/mixins/baseLeadsMixin.vue';
  import fastLead from '@/components/elements/fastLead.vue';
  import funnelCard from '@/components/elements/funnelCard.vue';
  import leadComponent from '@/components/leadComponent.vue';
  import extendedLeadsMixin from '@/mixins/extendedLeadsMixin.vue';
  import headerElement from '@/components/elements/headerElement.vue';
  export default {
    props: [],
    mixins: [Component, baseKanbanMixin, baseLeadsMixin, extendedLeadsMixin],
    directives: {
      dragscroll: dragscroll
    },
    data() {
      return {
        pageData: { title: 'Call-центр', metaTitle: 'Call-центр', showHeader: false },
      };
    },
    watch: {
      'searchData.q'() {
        this.timeoutSearch();
      },
      $route(v) {
        this.recalculateModalMode(v);
      },
    },
    destroyed() {
      this.$store.commit('setCrmChannelData', {
        channel: null,
        callback: null
      });
    },

    methods: {

      async getLeadsCallback() {
        let leads = await this.getLeads({ returning: true, category: 'callcenter' });
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
      async createFastRequest() {
        let resp = await this.createFastLead({
          category: 'callcenter',
          funnel_col: 'unsorted',
          postfix: 'заявки',
        });
        if(resp.result) {
          this.$refs.fastLead[0].expanded = false;
          this.fastLead = this.getClearFastLead();
        } else {
          this.$msg.error(resp.display);
        }
        //await this.getLeads({ start: true, category: 'callcenter' });
      },
      timeoutSearch() {
        this.searchData.p = 1;
        if(this.timeout) { clearTimeout(this.timeout); }
        this.timeout = setTimeout(() => {
          this.getLeads({ start: true, category: 'callcenter' });
        }, 200);
      },
      // refresh requests
      async dropCategoryRequest(categoryIndex, index, dropResult) {
        this.allowRefreshLeads = true;
        if(categoryIndex === 'callcenter') {
          this.category.cols[index].items = applyDrag(this.category.cols[index].items, dropResult);
        }
        if(dropResult.addedIndex === null) { return; }
        if(categoryIndex === 'callcenter') {
          let result = await this.changeLeadFunnelCol({
            lead_id: dropResult.payload.lead_id,
            category: 'callcenter',
            funnel_col: index
          });
          if(!result.result) {
            // window.toastr.error(result.display);
          }
          return;
        }
        let result = await this.changeLeadFunnelCol({
          lead_id: dropResult.payload.lead_id,
          category: null,
          funnel: this.leadsCategories[categoryIndex].funnels[index].funnel_id
        });
        if(!result.result) {
          this.$msg.error(result.display);
        } else {
          // window.toastr.success('Заявка передана раздел "('+this.leadsCategories[categoryIndex].funnels[index].title+')"');
        }
      },
    },
    async created() {
      await this.getLeadsCategories();
      this.category = this.leadsCategories.callcenter;
      this.$set(this.activeFunnel, 'cols', this.category.cols);
      this.activeFunnel.cols = this.category.cols;
      await this.getLeads({ start: true, category: 'callcenter' });
      this.$store.commit('setCrmChannelData', {
        channel: 'callcenter',
        callback: this.getLeadsCallback
      });
      this.recalculateModalMode();
      this.$store.dispatch('setComponentReady', true);
    },
    components: {
      Container, Draggable, fastLead, funnelCard, leadComponent, headerElement
    }
  }
</script>
