<script>
  export default {
    data() {
      return {
        companies_q: '',
        companies_p: '',
        companies_loading: false,
        companies_completing: false,
        companies: [],
        companies_total: 0,
        companies_ready: false,
        companiesSearchTimeout: false
      };
    },
    methods: {
      forceCompaniesSearch() {
        if(this.companiesSearchTimeout) {
          clearTimeout(this.companiesSearchTimeout);
        }
        this.companiesSearchTimeout = setTimeout(() => {
          this.p = 1;
          this.getCompanies();
        }, 200);
      },
      async completeCompaniesList() {
        this.companies_p++;
        await this.getCompanies({ completing: true });
      },
      displayShowMoreCompaniesRow() {
        if(!this.companies) { return 0; }
        if(!this.companies.length) { return 0; }
        if(this.companies_total <= this.companies.length) { return 0; }
        return 1;
      },
      confirmDropCompanyDialog(c) {
        let that = this;
        this.$dialog.fns.confirm({
          title: 'Подтверждение',
          text: 'Вы уверены что хотите удалить эту компанию?',
          confirm: async function() {
            const resp = await $http.post('/companies/delete', { company_id: c.company_id });
            if(resp) {
              if(resp.result) {
                that.getCompanies({ start: true });
              } else {
                // window.toastr.error(resp.display);
              }
            }
          },
          });

      },
      async getCompanies(opts = {}) {
        if(opts.completing) {
          this.companies_loading = false;
          this.companies_completing = true;
        } else {
          this.companies_loading = true;
          this.companies_completing = false;
        }
        const resp = await $http.post('/get-companies', {
          q: this.companies_q,
          p: this.companies_p,
          start: opts.start ? opts.start : null
        });
        let nc = [];
        let t = 0;
        if(resp) {
          if(resp.list) {
            nc = resp.list;
          }
          t = resp.total ? resp.total : 0;
        }
        if(opts.completing) {
          nc = this.companies.concat(nc);
        }
        this.companies_total = t;
        this.companies = nc;
        this.companies_ready = true;
      },
      companyModifyCallback() {
        this.getCompanies({
          start: true
        });
        this.$router.push(this.clearLinkView());
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
      }
    }
  }
</script>
