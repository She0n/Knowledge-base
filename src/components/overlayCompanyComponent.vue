<template>
  <div>
    <div :class="'overlay-modal-outer '+(show ? '' : 'overlay-translated')">
      <div class="overlay-modal-outer-backdrop" @click="showCallback()"></div>
      <div class="overlay-modal-inner overlay-modal-inner2 c-scrollbar">
        <div class="overlay-modal-wrap c-scrollbar">
          <div class="u-width-100 c-scrollbar">
            <div class="c-card u-mb-small u-width-100 u-pv-xsmall u-ph-medium u-flex">
              <h5 class="u-mb-zero">Карточка компании</h5>
            </div>
            <div class="c-card u-width-100 u-p-medium">
              <sInput :field="{ title: 'Название', type: 'text' }" v-model="company.title"></sInput>
              <sInput :field="{ title: 'Телефон', type: 'text', mask: '+7 (999)-999-99-99' }" v-model="company.phone"></sInput>
              <sInput :field="{ title: 'Емайл', type: 'text' }" v-model="company.email"></sInput>
              <sInput :field="{ title: 'Адрес', type: 'text' }" v-model="company.address"></sInput>
              <sInput :field="{ title: 'Вебсайт', type: 'text' }" v-model="company.web_site"></sInput>
              <div class="u-mt-large u-mb-large">&nbsp;</div>
              <div class="u-mb-large">
                <div class="u-text-center">
                  <button class="c-btn c-btn--success" v-on:click="modifyCompany()">
                    <span class="m-loader" v-if="process"></span>
                    <span v-html="company.company_id ? 'Сохранить' : 'Создать'"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <transition name="fade" >
      <div class="modal-overlay-backdrop" @click="showCallback()" v-if="show"></div>
    </transition>
  </div>
</template>
<script>
  import modalRoutingMixin from '@/mixins/modalRoutingMixin.vue';
  import companyMixin from '@/mixins/companyMixin.vue';
  import sInput from '@/components/elements/sInput.vue';
  export default {
    props: ['show', 'parentShowCallback', 'modifyCallback'],
    mixins: [companyMixin, modalRoutingMixin],
    data() {
      return {
        company: this.getClearCompany(),
        process: '',
      }
    },
    watch: {
      $route(v) {
        if(!this.show) { return; }
        if(this.$route.query.item_id) {
          this.getCompany();
        } else {
          this.company = this.getClearCompany();
        }
      },
      show(v) {
        if(v) {
          document.body.classList.add('overlay-company-mode');
        } else {
          document.body.classList.remove('overlay-company-mode');
        }
      },
    },
    methods: {
      async getCompany() {
        const resp = await $http.post('/get-company', { company_id: this.$route.query.item_id });
        if(resp) {
          if(resp.result) {
            this.company = resp.company;
            return;
          }
        }
        this.company = this.getClearCompany();
      },
    },
    components: {
      sInput
    }
  }
</script>
