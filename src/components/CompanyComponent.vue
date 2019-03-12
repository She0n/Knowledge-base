<template>
  <div>
    company
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import companyMixin from '@/mixins/companyMixin.vue';
  export default {
    mixins: [Component, companyMixin],
    data() {
      return {
        company: this.getClearCompany(),
        e_company: this.getClearCompany()
      };
    },
    computed: {
      pageData() {
        let t = this.company.company_id ? 'профиль компании' : 'создание компании';
        return { title: t, metaTitle: t };
      }
    }
  }
</script>
