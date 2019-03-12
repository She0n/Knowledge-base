<script>
  export default {
    methods: {
      getClearCompany() {
        return {
          company_id: '',
          title: '',
          comment: '',
          phone: '',
          email: '',
          address: '',
          web_site: '',
          is_deleted: '',
          created_at: '',
          created_by: ''
        }
      },
      async modifyCompany() {
          if(this.companyModifyProcess) { return; }
          this.companyModifyProcess = true;
          const resp = await $http.post('/modify-company', this.company);
          if(resp) {
            if(resp.result) {
              // window.toastr.success('сохранено');
              if(this.modifyCallback) {
                this.modifyCallback();
              }
            } else {
              // window.toastr.error(resp.display);

            }
          }
          this.companyModifyProcess = false;

      }
    }
  }
</script>
