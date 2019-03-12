<script>
  export default {
    data() {
      return {
        leadsCategories: {},
        category: this.getClearCategory(),
        activeFunnel: this.getClearFunnel(),
        allowRefreshLeads: true,
        refreshLeadsCallback: null,
        funnelsByIds: {},
        funnelsColsByIds: {},

        eActiveLeadComputedData: {
          activeFunnel: {
            title: '',
            cols: []
          },
          category: {
            static: false,
            title: '',
            cols: []
          },
          activeColIndex: 0
        },
        modalMode: false,
      };
    },
    watch: {
      allowRefreshLeads(v) {
          if(v) {
            if(typeof this.refreshLeadsCallback === 'function') {
              this.refreshLeadsCallback();
              this.refreshLeadsCallback = null;
            }
          }
      }
    },
    computed: {
      funnelColsByPath() {
        let a = {};
        for(let prop in this.leadsCategories) {
          let cat = this.leadsCategories[prop];
          if(cat.cols) {
            for(let prop2 in cat.cols) {
              a[prop+'_'+prop2] = cat.cols[prop2];
            }
          } else {
            for(let i = 0; i < cat.funnels.length; i++) {
              let funnel = cat.funnels[i];
              for(let j = 0; j < funnel.cols.length; j++) {
                let col = funnel.cols[j];
                a[prop+'_'+col.col_id] = col;
              }
            }
          }
        }
        return a;
      }
    },
    methods: {
      async modifyLead() {
        const resp = await $http.post('/modify-lead', this.collectLeadData());
        if(resp) {
          if(resp.result) {

          } else {

          }
        }
      },
      collectLeadData() {
        let data = {};
        for(let prop in this.e_activeLead) {
          data[prop] = this.e_activeLead;
        }
        return data;
      },
      async getLeadById(id) {
        const resp = await $http.post('/get-lead-by-id', { lead_id: id });
        if(resp) {
          if(resp.result) {
            return resp.lead;
          }
        }
        return null;
      },
      recalculateActiveLeadComputedData() {
        // calculate category
        // calculate active funnel

        if(!this.leadsCategories[this.e_activeLead.category]) {
          this.e_activeLead.category = 'callcenter';
          this.activeLead.category = 'callcenter';
        }
        if(this.e_activeLead.category !== 'callcenter') {

          if(!this.funnelsColsByIds[this.e_activeLead.funnel_col]) {
            let fk = this.leadsCategories[this.e_activeLead.category].funnels[0];
            this.activeLead.funnel_col = fk.cols[0].col_id;
            this.e_activeLead.funnel_col = fk.cols[0].col_id;
          }
        } else {
          if(this.leadsCategories.callcenter) {
            if(!this.leadsCategories.callcenter.cols[this.e_activeLead.funnel_col]) {
              let fk = Object.keys(this.leadsCategories.callcenter.cols);
              this.activeLead.funnel_col = fk;
              this.e_activeLead.funnel_col = fk;
            }
          }
        }
        this.eActiveLeadComputedData.category = this.leadsCategories[this.e_activeLead.category];
        if(this.e_activeLead.category === 'callcenter') {
          this.eActiveLeadComputedData.activeFunnel = {
            title: 'callcenter',
            cols: this.leadsCategories[this.e_activeLead.category].cols
          };
        } else {
          this.eActiveLeadComputedData.activeFunnel = this.funnelsByIds[this.funnelsColsByIds[this.e_activeLead.funnel_col].funnel_id];
          let aci = 0;
          for(let i = 0; i < this.eActiveLeadComputedData.activeFunnel.cols.length; i++) {
            let col = this.eActiveLeadComputedData.activeFunnel.cols[i];
            if(col.col_id == this.e_activeLead.funnel_col) {
              aci = i;
              break;
            }
          }
          this.eActiveLeadComputedData.activeColIndex = aci;
        }


      },

      async recalculateModalMode(v) {
        let target = v ? v : this.$route;
        this.modalMode = target.query.view;
        if(this.modalMode === 'lead') {
          let itemId = parseInt(target.query.item_id);
          this.activeLead.lead_id = itemId ? itemId : 0;
          if(this.activeLead.lead_id) {
            let lead = await this.getLeadById(itemId);
            if(lead) {
              this.setLead(lead);

              return;
            }
          }
          this.activeLead = this.getClearLead();
          this.activeLead.category = this.extractCategoryFromPath(this.$route.path);
          if(this.category.cols) {
            let fk = Object.keys(this.category.cols);
            this.activeLead.funnel_col = fk[0] ? this.category.cols[fk[0]] : null;
          } else {
            let fk = this.activeFunnel.cols;
            this.activeLead.funnel_col = fk[0] ? fk[0].col_id : null;
          }


          this.e_activeLead = JSON.parse(JSON.stringify(this.activeLead));
          this.recalculateActiveLeadComputedData();
        }
      },
      getClearCategory() {
        return {
          funnels: [],
          title: '',
          cols: [],
        };
      },
      getChildPayload(col, index) {
        return col.items[index];
      },
      extractCategoryFromPath(p) {
        let cat = p.split('/')[2];
        if(!cat) { return null; }
        cat = cat.toLowerCase();
        let d = cat.indexOf('-');
        if(d === -1) { return cat; }
        cat = cat.split('');
        cat[d+1] = cat[d+1].toUpperCase();
        cat.splice(d, 1);
        cat = cat.join('');
        return cat;
      },
      async createFastLead(opts) {
        opts = opts ? opts : {};
        if(!opts.category) { opts.category = this.extractCategoryFromPath(this.$route.path); }
        if(this.process) { return; }
        this.process = true;
        let fastLeadData = Object.assign({}, this.fastLead, opts);
        const resp = await $http.post('/create-fast-lead', fastLeadData);
        this.process = false;
        return resp ? resp : {};
      },
      clearActiveFunnelItems() {
        if(Array.isArray(this.activeFunnel.cols)) {
          for(let i = 0; i < this.activeFunnel.cols.length; i++) {
            this.$set(this.activeFunnel.cols[i], 'items', []); //.items = [];
          }
        } else {
          for(let prop in this.activeFunnel.cols) {
            this.$set(this.activeFunnel.cols[prop], 'items', []); //.items = [];
          }
        }
      },
      getClearFunnel() {
        return {
          funnel_id: 0,
          title: '',
          cols: [],
          protected: false
        };
      },
      setActiveFunnelLeads(leads) {
        if(Array.isArray(this.activeFunnel.cols)) {
          let colsByIds = {};
          if(!this.activeFunnel.cols.length) { return; }
          for(let i = 0; i < this.activeFunnel.cols.length; i++) {
            let row = this.activeFunnel.cols[i];
            colsByIds[row.col_id] = row;
          }
          for(let i = 0; i < leads.length; i++) {
            let row = leads[i];
            let target = !colsByIds[leads[i].funnel_col] ? this.activeFunnel.cols[0] : colsByIds[leads[i].funnel_col];
            if(!target) { continue; }
            target.items.push(row);
          }
          for(let i = 0; i < this.activeFunnel.cols.length; i++) {
            let row = this.activeFunnel.cols[i];
          }
        } else {
          for(let i = 0; i < this.activeFunnel.cols.length; i++) {
            this.activeFunnel.cols[i].items = [];
          }
          for(let i = 0; i < leads.length; i++) {
            let row = leads[i];
            if(!this.activeFunnel.cols[row.funnel_col]) { continue; }
            if(!this.activeFunnel.cols[row.funnel_col].items) { continue; }
            this.activeFunnel.cols[row.funnel_col].items.push(row);
          }
        }
        console.log('set active funnel leads');
      },
      isActiveStaticCol(key) {
        let keys = Object.keys(this.eActiveLeadComputedData.category.cols);
        let index = keys.indexOf(key);
        let activeColIndex = keys.indexOf(this.e_activeLead.funnel_col);
        return activeColIndex === index;
      },
      isActiveFunnelCol(index) {
        return (index <= this.eActiveLeadComputedData.activeColIndex);
      },
      async getLeads(opts) {
        opts = opts ? opts : {};
        let searchData = Object.assign({}, this.searchData, opts);
        const resp = await $http.post('/get-leads', searchData);
        if(opts.returning) { return resp; }
        if(resp) {
          this.clearActiveFunnelItems();
          resp.list = Array.isArray(resp.list) ? resp.list : [];
          this.setActiveFunnelLeads(resp.list);
        }
      },
      async getLeadsCategories() {
        const resp = await $http.get('/get-leads-categories');
        if(typeof resp === 'object' && resp) {
          this.$set(this, 'leadsCategories', resp);
          let funnelsByIds = {};
          let colsByIds = {};
          if(resp.leads) {
            for(let i = 0; i < resp.leads.funnels.length; i++) {
              let row = resp.leads.funnels[i];
              funnelsByIds[row.funnel_id] = row;
              for(let j = 0; j < row.cols.length; j++) {
                let col = row.cols[j];
                colsByIds[col.col_id] = col;
              }
            }
            this.$set(this, 'funnelsColsByIds', colsByIds);
            console.log(this.funnelsColsByIds);
            this.$set(this, 'funnelsByIds', funnelsByIds);
          }
          return resp;
        }
        return resp;
      },
      async changeLeadFunnelCol(opts) {
        const resp = await $http.post('/change-lead-funnel-col', opts);
        if(resp) {
          if(resp) {
            return resp;
          }
        }
        return resp;
      },

    }
  }
</script>
