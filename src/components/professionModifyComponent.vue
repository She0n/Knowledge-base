<template>
  <div class="profession-page">
    <permissionDeniedComponent v-if="permissionDenied" :title="permissionDeniedTitle" :description="permissionDeniedDesc" />
    <div class="d-card d-flex d-pv-40 d-ph-20 d-mb-20">
      <input type="text" v-model="profession.title" class="d-input-cf flex-grow-1" placeholder="Название должности">
      <button class="d-btn d-btn--success d-ml-12" v-on:click="modifyProfession()" v-html="profession.profession_id ? 'сохранить должность' : 'создать должность'"></button>
    </div>
    <div class="row">
      <div class="col-12 col-sm-6 col-xl-3  d-mb-50" v-for="prof, profKey in profKeys">
        <div class="d-flex flex-wrap flex-column d-height-100">
        <div class="d-card d-p-20 d-mb-20 d-width-100 proff-access-card"> <!-- (!profession.permissions[profKey].access ? ' locked-frame' : '') -->
          <div class="d-text-center d-text-dark d-mb-20" v-html="prof.title"></div>
          <sInput class="d-mb-20" :field="{ title: 'Доступ', type: 'toggler' }" v-model="profession.permissions[profKey].access"></sInput>
        </div>
        <div :class="'d-card d-p-20 flex-grow-1 d-width-100 '+(profession.permissions[profKey].access ? '' : 'locked-card')">
          <sInput v-for="item, k in permissionsData[profKey]" v-if="k !== 'access'" class="d-mb-12" :field="{ title: item.title, type: 'toggler' }" :key="'perm-'+k" v-model="profession.permissions[profKey][k]" ></sInput>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue';
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  export default {
    extends: Component,
    mixins: [permissionsMixin],
    data() {
      return {
        profKeys: {
          crm: {
            title: 'ERP'
          },
          knowledge_base: {
            title: 'База знаний'
          },
          personal_area: {
            title: 'Личный кабинет'
          },
          calculator: {
            title: 'Сметный калькулятор'
          }
        },
        profession: {
          profession_id: 0,
          title: '',
          permissions: {
            crm: {
              access: false
            },
            knowledge_base: {
              access: false
            },
            personal_area: {
              access: false
            },
            calculator: {
              access: false
            }
          },
          ordering: 0,
        },
        permissionsData: {
          crm: {
            access: false,
          },
          knowledge_base: {
            access: false
          },
          personal_area: {
            access: false
          },
          calculator: {
            access: false
          }
        },
        process: false
      };
    },
    computed: {
      pageData() {
        let t = this.profession.profession_id ? 'Редактирование должности' : 'Создание должности';
        return { title: t, metaTitle: t };
      }
    },
    watch: {
      'profession.permissions.crm.access'(v) {
        if(v) { return; }
        for(let prop in this.permissionsData.crm) {
          this.profession.permissions.crm[prop] = false;
        }
      },
      'profession.permissions.knowledge_base.access'(v) {
        if(v) { return; }
        for(let prop in this.permissionsData.knowledge_base) {
          this.profession.permissions.knowledge_base[prop] = false;
        }
      },
      'profession.permissions.personal_area.access'(v) {
        if(v) { return; }
        for(let prop in this.permissionsData.personal_area) {
          this.profession.permissions.personal_area[prop] = false;
        }
      },
      'profession.permissions.calculator.access'(v) {
        if(v) { return; }
        for(let prop in this.permissionsData.calculator) {
          this.profession.permissions.calculator[prop] = false;
        }
      }
    },
    async created() {
      let professionId = this.$route.query.profession_id;
      if(this.$store.state.professionsByIds[professionId]) {
        this.profession = JSON.parse(JSON.stringify(this.$store.state.professionsByIds[professionId]));
      }
      await this.getPermissionsObject();
      if(!this.isAdmin()) {
        this.permissions({
          permissionDenied: true,
          title: 'Недостаточно прав',
          description: 'У вас нет прав для редактирования должностей'
        });
        return;
      }
      this.$store.dispatch('setComponentReady', true);
    },
    methods: {
      async modifyProfession() {
        if(this.process) { return; }
        this.process = 1;
        const resp = await $http.post('/modify-profession', this.profession);
        this.process = 0;
        if(resp) {
          if(resp.result) {
            await this.$store.dispatch('getAppData');
            this.$router.push('/coworkers/professions');
            // window.toastr.success(resp.display);
          } else {
            this.alert({ title: resp.display });
          }
        }
      },
      async getPermissionsObject() {
        const resp = await $http.get('/get-permissions-object');
        if(typeof resp === 'object' && resp) {
          this.$set(this, 'permissionsData', resp);
          for(let prop in this.permissionsData) {
            for(let prop2 in this.permissionsData[prop]) {
              this.profession.permissions[prop][prop2] = Boolean(this.profession.permissions[prop][prop2]);
            }
          }
        }
      },
    }
  }
</script>
