<script>
  import Datepicker from 'vuejs-datepicker';
  import nselect2 from '@/components/elements/nselect2.vue';
  import VueTagsInput from '@johmun/vue-tags-input/vue-tags-input/vue-tags-input.vue';
  import Inputmask from 'inputmask';
  export default {
    data() {
      return {
        fields: ['user_id', 'usertype', 'first_name', 'last_name', 'third_name', 'username', 'password',
          'password2', 'specialization', 'email', 'phone', 'avatar', 'birthday', 'about', 'expirience', 'created_by'],
        isHiddenPassportContainer: false,
        uploadPhotoProperty: 'photo1',
        uploadingProcess1: false,
        uploadingProcess2: false,
        selectedInstruments: [],
        instrumentMode: 'tags',
        areas: [],
        areasByIds: {},
        process: false,
        loading: true,
        routesByTypes: {
          workman: '/coworkers/workmans/profile',
          coworker: '/coworkers/profile',
          admin: '/coworkers/profile',
          client: '/crm/contacts/profile',
          contact: '/crm/contacts/profile'
        }
      };
    },
    computed: {
      filteredSpecialization() {
        return this.autocompleteSpecialization.filter((el) => {
          return (this.activeSpecialization && this.activeSpecialization.length) ? (el.text.toLowerCase().indexOf(this.activeSpecialization.toLowerCase()) !== -1) : true;
        });
      },
      filteredInstruments() {
        return this.autocompleteInstruments.filter((el) => {
          let t = el.text.toLowerCase();
          if(this.selectedInstruments.indexOf(t) !== -1) { return false; }
          return (this.activeInstrument && this.activeInstrument.length) ? (t.indexOf(this.activeInstrument.toLowerCase()) !== -1) : true;
        });
      },
    },
    methods: {
      calculateRouteByUsertype(t) {
        if(this.user_id === this.$store.state.user.user_id) { return '/profile'; }
        return this.routesByTypes[t] ? this.routesByTypes[t] : '/coworkers/profile';
      },
      addInstrument(a) {
        let i = this.selectedInstruments.indexOf(a);
        if(i === -1) {
          this.selectedInstruments.push(a);
        } else {
          this.selectedInstruments.splice(i, 1);
        }

        this.recalculateSelectedInstrumentTagsReverse();
      },
      recalculateSelectedInstrumentTagsReverse() {
        let selectedInst = [];
        let instTags = typeof this.edit_user.instrument === 'string' ? this.edit_user.instrument.split(', ') : [];
        for(let i = 0; i < instTags.length; i++) {
          let t = instTags[i].toString().trim();
          if(t.length && this.selectedInstruments.indexOf(t) !== -1) {
            selectedInst.push(t.toLowerCase());
          }
        }
        for(let i = 0; i < this.selectedInstruments.length; i++) {
          let t = this.selectedInstruments[i].toLowerCase();
          if(selectedInst.indexOf(t) !== -1) { continue; }
          selectedInst.push(t);
        }
        this.baseInstrumentTags = selectedInst.map(a => { return { text: a.toString().toLowerCase() }});
        console.log(selectedInst);
        this.edit_user.instrument = selectedInst.join(', ');
      },
      recalculateSelectedInstrumentsTags() {
        let selectedInst = [];
        let instTags = typeof this.edit_user.instrument === 'string' ? this.edit_user.instrument.split(', ') : [];
        for(let i = 0; i < instTags.length; i++) {
          let t = instTags[i].toString().trim().toLowerCase();
          if(t.length) {
            selectedInst.push(t);
          }
        }
        this.selectedInstruments = selectedInst;
      },

      fillEditFields() {
        for(let prop in this.user) {
          this.edit_user[prop] = this.user[prop];
        }
        let inst = [];
        let instTags = typeof this.edit_user.instrument === 'string' ? this.edit_user.instrument.split(', ') : [];
        for(let i = 0; i < instTags.length; i++) {
          let t = instTags[i].toString().trim();
          if(t.length) {
            inst.push({ text: t });
          }
        }
        this.baseInstrumentTags = inst;
        this.recalculateSelectedInstrumentsTags();
        let spec = [];
        let specTags = typeof this.edit_user.specialization === 'string' ? this.edit_user.specialization.split(', ') : [];
        for(let i = 0; i < specTags.length; i++) {
          let t = specTags[i].toString().trim();
          if(t.length) {
            spec.push({ text: t });
          }
        }
        this.baseSpecializationTags = spec;
      },
      computeUsertype() {
        let allow = ['admin', 'client', 'coworker', 'observer', 'workman', 'contact'];
        if(allow.indexOf(this.user.usertype) !== -1) { return; }
        this.user.usertype = 'coworker';
      },
      instrumentsChangeHandler(a) {
        let finish = [];
        for(let i = 0; i < a.length; i++) {
          finish.push(a[i].text.toString().trim());
        }
        finish = finish.join(', ');
        this.edit_user.instrument = finish;
        this.recalculateSelectedInstrumentsTags();

        return finish;
      },
      specializationChangeHandler(a) {
        let finish = [];
        for(let i = 0; i < a.length; i++) {
          finish.push(a[i].text.toString().trim());
        }
        return this.edit_user.specialization = finish.join(', ');
      },
      changeAvatarDialog() {
        if(!this.allowModifyUser(this.edit_user)) { return; }
        this.$refs.avatarFormRef.select();
      },
      async confirmChangeAvatar() {
        let formData = new FormData(this.$refs.avatarFormRef.$el);
        const resp = await $http.post('/api/users/modify/upload-avatar', formData, { file: true });
        if(resp) {
          if(resp.result) {
            this.edit_user.avatar = resp.files[0].filename;
          } else {
            this.alert({
              title: resp.display
            });
          }
        }
      },
      addEvents() {
        window.addEventListener('keydown', this.keypressSave);
      },
      dropEvents() {
        window.removeEventListener('keydown', this.keypressSave);
      },
      keypressSave(e) {
        if(e.ctrlKey || e.metaKey){
          if(e.key === 's' && this.activeTab === 'settings') {
            e.preventDefault();
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) { //hack for ie
              return;
            }
            this.modifyUser();
          }

        }
      },
      collectUserData() {
        let data = JSON.parse(JSON.stringify(this.edit_user));
        return data;
      },
      getUserId() {
        return this.$route.query.user_id;
      },
      calculatePageTitleText() {
        if(this.user.usertype === 'coworker' || this.user.usertype === 'admin') { return '<span class="d-color-success">Сотрудник офиса</span>'; }
        if(this.user.usertype === 'workman') { return '<span class="d-color-info">Строитель</span>'; }
        if(this.user.usertype === 'client') { return 'Клиент'; }
        if(this.user.usertype === 'observer') { return 'Наблюдатель'; }
        if(this.user.usertype === 'contact') { return 'Контакт'; }
        return 'пользователя';
      },
      getRepeatPassword() {
        return this.user_id ? 'Старый пароль' : 'Повторите пароль';
      },
      async getInstruments() {
        const resp = $http.get('/users/get-instruments');
        this.instruments = typeof resp === 'object' && resp ? resp : {};
        let ai = [];
        for(let prop in this.instruments) {
          ai.push({ text: this.instruments[prop].title });
        }
        this.autocompleteInstruments = ai;
      },

      getPermissionKeyByType() {
        let key = this.calculateCreatingUsertype();
        if(key === 'client' || key === 'observer' || key === 'contact') {
          return 'createClients';
        }
        if(key === 'coworker' || key === 'workman') {
          return 'modifyCoworkers';
        }
      },
      calculateCreatingUsertype() {
        if(this.creating_usertype) { return this.creating_usertype; }
        if(window.location.pathname.indexOf('clients') !== -1) { return 'client'; }
        if(window.location.pathname.indexOf('observers') !== -1) { return 'observer'; }
        if(window.location.pathname.indexOf('workmans') !== -1) { return 'workman'; }
        if(window.location.pathname === '/crm/contacts/profile') { return 'contact'; }
        return 'coworker';
      },
      allowWatchConfidencialInformation(user) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(this.$store.state.user.usertype !== 'coworker') { return 0; }
        if(user.usertype === 'admin') { return 0; }
        if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id]) { return 0; }
        if(this.isCoworker(user)) {
          if(this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions.crm.watchCoworkersPersonalData) {
            return 1;
          }
        }
        if(user.usertype === 'client') {
          if(this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions.crm.watchClientPersonalData) {
            return 1;
          }
        }
        return 0;
      },
      getClearUser() {
        return {
          user_id: 0,
          username: '',
          first_name: '',
          last_name: '',
          third_name: '',
          usertype: '',
          created_by: 0,
          created_at: '',
          email: '',
          phone: '',
          phone2: '',
          passport_data: {
            series: '',
            author: '',
            code: '',
            date: '',
            registration: '',
            photo1: '',
            photo2: ''
          },
          comment: '',
          description: '',
          priceModes: [],
          password: '',
          password2: '',
          profession_id: 0,
          avatar: '',
          birthday: '',
          about: '',
          specialization: '',
          expirience: '',
          is_legal_worker: false,
          instrument: '',
          test_results: '',
          area_id: 0,
          children: '',
          birthplace_city: '',
          fact_address: ''
        };
      },
      isFieldEmpty(a) {
        return window.isFieldEmpty(a);
      },
      parseUser(source, target) {
        let except = ['passport_data', 'priceModes'];
        if(source.birthday) {
          source.birthday = window.dateFormatter.reformatDateToDotted(source.birthday);
        }
        for (let prop in target) {
          if(except.indexOf(prop) !== -1) { continue; }
          target[prop] = source[prop];
        }
        if(typeof target.additional !== 'object' || !target.additional) { target.additional = {}; }
        if(source.passport_data) {
          for(let prop in target.passport_data) {
            target.passport_data[prop] = source.passport_data[prop] ? source.passport_data[prop] : '';
          }
        }
        if(target.passport_data) {
          if(target.passport_data.date) {
            target.passport_data.date = window.dateFormatter.reformatDateToDotted(target.passport_data.date);
          }
        }
      },
      async modifyUser() {
        if (this.process) {
          return;
        }
        this.process = true;
        let data = this.collectUserData();
        let response = (await $http.post('/api/modify-user', data));
        this.process = false;
        if (response && response.result) {
          if (response.user.user_id == this.$store.state.user.user_id) {
            this.$store.dispatch('setUser', response.user);
          }
          this.parseUser(response.user, this.user);

          // window.toastr.success(response.display);
          if(this.modifyCallback) {
            this.modifyCallback();
          }
          if(this.showCallback) {
            this.showCallback();
          }
        } else {
         this.alert(response.display);
        }

      },
    },
    components: {
      Datepicker, nselect2, VueTagsInput
    }
  }
</script>
