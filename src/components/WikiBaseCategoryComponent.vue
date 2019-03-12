<script>
  import WikiCategoryComponent from '@/components/WikiCategoryComponent.vue';
  import categoryMixin from '@/mixins/categoryMixin.vue';
  const pageData = {title: 'База знаний', metaTitle: 'База знаний', headerClass: 'u-mb-medium'};
  export default {
    extends: WikiCategoryComponent,
    async created() {
      this.$store.commit('titleStatement', true);
    },
    async mounted() {
      this.init();
      this.content = [];
      this.contentReady = true;
      this.tree = await this.getCategoryTree();
      this.$store.dispatch('setComponentReady', true);
    },
    data() {
      return {
        pageData: pageData
      };
    }
  }
</script>
