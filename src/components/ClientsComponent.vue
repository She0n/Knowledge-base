<template>
  <div>
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div v-else>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <ul class="c-tabs__list c-tabs__list--splitted nav nav-tabs  u-mb-a2 simplified-head">
              <li class="c-tabs__item" v-on:click="activeTab = 'clients'"><span :class="'c-tabs__link trigger' +((activeTab === 'clients') ? ' active' : '')">Клиенты</span></li>
              <li class="c-tabs__item" v-on:click="activeTab = 'observers'"><span :class="'c-tabs__link trigger' +(activeTab === 'observers' ? ' active' : '')">Наблюдатели</span></li>
            </ul>
          </div>
        </div>
      </div>
      <usersList :usertypes="usertypes" :modifyLink="modifyLink" :isPage="true"  />
    </div>
    <overlayUserComponent :show="modalMode === 'client' || modalMode === 'observer'" :creating_usertype="modalMode"></overlayUserComponent>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import usersList from '@/components/users/usersList.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  import overlayUserComponent from '@/components/overlayUserComponent.vue';
  let pageData = { title: 'Клиенты', metaTitle: 'Клиенты', headerClass: 'u-mb-medium' };
  export default {
    mixins: [permissionsMixin, Component],
    data() {
      return {
        pageData: pageData,
        activeTab: 'clients',
        usertypes: ['client'],
        modifyLink: '/clients?view=client',
        modalMode: '',
      }
    },
    created() {
      setTimeout(() => {
        this.recalculateView();
      }, 950);
    },
    watch: {
      $route(v) {
        this.recalculateView(v);
      },
      activeTab() {
        if(this.activeTab === 'clients') {
          this.usertypes = ['client'];
          this.modifyLink = '/clients?view=client';
        } else {
          this.usertypes = ['observer'];
          this.modifyLink = '/clients?view=observer';
        }
      },
    },
    methods: {
      recalculateView(v) {
        let target = v ? v : this.$route;
        this.modalMode = target.query.view ? target.query.view : null;
      },
    },
    components: {
      usersList, overlayUserComponent
    }
  }
</script>
