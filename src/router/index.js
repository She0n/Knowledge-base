import Vue from 'vue';
import Router from 'vue-router';
import notFoundComponent from '@/components/errors/notFoundComponent.vue';
import logoutComponent from '@/components/auth/logoutComponent.vue';
import professionModifyComponent from '@/components/professionModifyComponent.vue';
import hrStatsComponent from '@/components/hrStatsComponent.vue';
import prodStatsComponent from '@/components/prodStatsComponent.vue';
import salesStatsComponent from '@/components/salesStatsComponent.vue';
import ContactsComponent from '@/components/ContactsComponent.vue';
import store from '@/store/index.js';
import CoworkersComponent from '@/components/CoworkersComponent.vue';
import WorkerModifyComponent from '@/components/WorkerModifyComponent.vue';
import ContactComponent from '@/components/ContactComponent.vue';
import CompanyComponent from '@/components/CompanyComponent.vue';



import moderateComponent from '@/components/moderateComponent.vue';
import testsComponent from '@/components/testsComponent.vue';
import modifyTestComponent from '@/components/modifyTestComponent.vue';
import mainPageComponent from '@/components/mainPageComponent.vue';
import WikiComponent from '@/components/WikiComponent.vue';
import WikiModifyCategoryComponent from '@/components/WikiModifyCategoryComponent.vue';
import WikiModifyMaterialComponent from '@/components/WikiModifyMaterialComponent.vue';

Vue.use(Router);
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/moderate',
    component: moderateComponent
  },
  {
    path: '/tests',
    component: testsComponent
  },
  {
    path: '/main/modify-test',
    component: modifyTestComponent
  },
  {
    path: '/main',
    component: mainPageComponent
  },
  {
    path: '/main/modify-category',
    name: 'wiki-modify-category',
    component: WikiModifyCategoryComponent
  },
  {
    path: '/main/modify-material',
    name: 'wiki-modify-material',
    component: WikiModifyMaterialComponent
  },
  {
    path: '/wiki/:alias',
    component: WikiComponent
  },
  {
    path: '/wiki/:parentAlias/:alias',
    component: WikiComponent
  },
  {
    path: '/wiki',
    name: 'wiki',
    component: WikiComponent
  },





  {
    path: '/crm/contacts',
    name: 'crm-contacts',
    component: ContactsComponent
  },
  {
    path: '/crm/contacts/companies',
    name: 'crm-contacts-companies',
    component: ContactsComponent
  },
  {
    path: '/crm/contacts/profile',
    name: 'crm-contact-profile',
    component: ContactComponent
  },
  {
    path: '/crm/contacts/companies/profile',
    name: 'crm-company-profile',
    component: CompanyComponent
  },
  {
    path: '/stats/hr',
    component: hrStatsComponent
  },
  {
    path: '/stats/prod',
    component: prodStatsComponent
  },
  {
    path: '/stats/sales',
    component: salesStatsComponent
  },
  {
    path: '/coworkers',
    component: CoworkersComponent
  },
  {
    path: '/profile',
    component: WorkerModifyComponent,
  },
  {
    path: '/coworkers/profile',
    component: WorkerModifyComponent,
  },
  {
    path: '/coworkers/workmans/profile',
    component: WorkerModifyComponent
  },
  {
    path: '/coworkers/professions',
    component: CoworkersComponent
  },
  {
    path: '/coworkers/professions/profession',
    component: professionModifyComponent
  },
  {
    path: '/coworkers/workmans',
    component: CoworkersComponent,
  },
  {
    path: '/logout',
    component: logoutComponent
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: notFoundComponent
  }
];
let res = new Router({
  routes: routes,
  mode: 'history',
});
res.beforeEach((to, from, next) => {
  if(store.state.networkError) {
    //next(false);
    // return;
  }
  if (!to.matched.length) {
    next('/not-found');
  } else {
    next();
  }
});
export default res;
