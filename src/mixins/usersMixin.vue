<script>
  export default {
    data() {
      return {
        passportFields: {
          series: { title: 'Серия и номер',  placeholder: '4010 255786', mask: '9999 999999' },
          author: { title: 'Кем выдан', placeholder: 'ТП №26 Отдела УФМС РОССИИ в Кировском районе Санкт-Петербурга' },
          date: { title: 'Дата выдачи', placeholder: 'Выберите дату выдачи', type: 'text', mask: '99.99.9999' },
          code: { title: 'Код подразделения', placeholder: '786-0666', mask: '999-999' },
          registration: { title: 'Регистрация', placeholder: 'г. Санкт-Петербург Дачный проспект 34 к. 1 кв. 58' },
        },
        loginFields: {
          username: { title: 'Логин', placeholder: 'Введите логин', type: 'text' },
          password: { title: 'Пароль', placeholder: '******', type: 'password' },
          password2: { title: 'Повторите пароль', placeholder: '******', type: 'password' },
        },
        instruments: {},
        autocompleteInstruments: [],
        autocompleteSpecialization: [{ text: 'Демонтажник' }, { text: 'Электрик' }, { text: 'Сантехник' }, { text: 'Плотник'} , { text: 'Каменщик' },
          { text: 'Плиточник' }, { text: 'Отделочник' }, { text: 'Монтажник вентиляционных систем' }, { text: 'Отделочник-универсал' },
          { text: 'Сварщик' }, { text: 'Маляр-штукатур' }, { text: 'Разнорабочий' }, { text: 'Гипрочник' }, { text:'Инженер-наладчик вентиляционных систем' },
          { text: 'Инженер' }, { text: 'Столяр' }, { text: 'Электромонтажник' }, { text: 'Бригадир' } , { text: 'Прораб' }],
        personalFieldsA: {
          last_name: { title: 'Фамилия', placeholder: 'Укажите фамилию' },
          first_name: { title: 'Имя', placeholder: 'Укажите имя' },
          third_name: { title: 'Отчество', placeholder: 'Укажите отчество' },
        },
        contactFields: {
          phone: { title: 'телефон', placeholder: 'Введите номер телефона' },
          phone2: { title: 'альт. телефон', placeholder: 'Альтернативный номер телефона' },
          email: { title: 'емайл', placeholder: 'Укажите емайл' }
        },
        activeInstrument: '',
        activeSpecialization: '',
        baseInstrumentTags: [],
        baseSpecializationTags: [],
      };
    },
    methods: {
      recalculateView(v) {
        let target = v ? v : this.$route;
        this.modalMode = target.query.view ? target.query.view : null;
      },
      modifyUserCallback() {
        this.getUsers(false, { start: true });
      },
      ceil(a) {
        return Math.ceil(a);
      },
      allowFireUser(user) {
        if(user.is_fired) { return 0; }
        if(user.protection) { return 0; }
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(!this.isCoworker(user)) { return 0; }
        if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id]) { return 0; }
        if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions.crm) { return 0; }
        if(this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions.crm.fireCoworkers) { return 1; }
        return 0;
      },
      renderRating(user) {
        let stars = user.user_id.toString();
        stars = stars[stars.length-1];
        stars = Math.ceil(stars/2);
        if(stars < 3) { stars = 3; }
        let s = '';
        for(let i = 0; i < 5; i++) {
          s+= '<i class="fa fa-star fs-14 '+(i < stars ? 'd-color-warning' : 'd-text-mute ')+' d-mr-3"></i>';
        }
        return s;
      },
      allowDropUser(user) {
          if(user.protection) { return 0; }
          if(!this.$store.state.user) { return 0; }
          if(this.$store.state.user.usertype === 'admin') { return 1; }
          if(user.usertype === 'admin') { return 0; }
          if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id]) { return 0; }
          if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id].crm) { return 0; }
          if(this.$store.state.user.usertype === 'coworker') {
            if(user.usertype === 'coworker') {
              if(this.$store.state.professionsByIds[this.$store.state.user.profession_id].crm.deleteCoworkers) { return 1; }
            }
            if(user.usertype === 'client' || user.usertype === 'contact' || user.usertype === 'observer') {
              if(this.$store.state.professionsByIds[this.$store.state.user.profession_id].crm.deleteClients) { return 1; }
            }
          }
          return 0;
      },
      allowModifyUser(user, ignoreself) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(user.usertype === 'admin') { return 0; }
        if(this.$store.state.user.usertype !== 'coworker') { return 0; }
        if(user.user_id == this.$store.state.user.user_id && !ignoreself) { return 1; }
        return (user.usertype === 'client' || user.usertype === 'observer') ? this.havePermission('crm', 'modifyClients') : this.havePermission('crm', 'modifyCoworkers');
      },
      async completeUsersList() {
        if(this.loading || this.completing) { return; }
        this.p = this.p+1;
        await this.getUsers(true);
      },
      renderUserRealName (user) {
        return window.renderUserRealName(user);
      },
      renderUserAge(user) {
        return window.renderUserAge(user);
      },
      renderUserExperience(user) {
        return window.renderUserExperience(user);
      },
      renderUserListAvatar(user) {
        if(!user || !user.avatar || !user.avatar.toString().length) {
          if(user.usertype === 'client') { return '/static/images/default-client.png'; }
          return window.getDefaultAvatar();
        }
        return window.image('/images/xs/'+user.avatar);
      },
      confirmDropUserDialog(user) {
        let that = this;
        if(user.protection) {
          this.alert({
            title: 'Этот пользователь не может быть удален',
            icon: 'danger',
          });
          return;
        }
        this.confirm({
          title: 'Вы уверены что хотите удалить этого пользователя?',
          color: 'danger',
          confirm: async () => {
            const resp = await $http.post('/api/users/delete', { user_id: user.user_id });
              if(resp.result) {
                this.alert({
                  title: 'Пользователь успешно <br/>удален',
                  color: 'success',
                });
              } else {
                this.alert({
                  title: resp.display,
                  color: 'danger'
                });
              }
          }
        });


      },
      displayShowMoreRow() {
        if(!this.users) { return 0; }
        if(!this.users.length) { return 0; }
        if(this.total <= this.users.length) { return 0; }
        return 1;
      },
      forceSearch() {
        if(!this.componentReady) { return; }
        if(this.searchLock) { return; }
        if(this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
          this.p = 1;
          this.getUsers();
        }, 200);
      },
      async getUsers(defarg = false, opts = {}) {
        if(this.loading || this.completing) { return; }
        this.loading = !defarg;
        this.completing = defarg;
        let resp = await $http.post('/api/users', {
          p: this.p,
          q: this.q,
          expirience: this.selectedExpirience,
          age: this.selectedAge,
          areas_ids: this.selectedAreas,
          start: opts.start,
          usertypes: this.usertypes,
          order_by: this.orderBy,
          fired: this.fired
        });
        if(this.loading) {
          this.users = [];
        }
        let users = [];
        if(resp && resp.list) {
          for(let i = 0; i < resp.list.length; i++) {
            users.push(resp.list[i]);
          }
          this.users = this.users.concat(users);
          this.total = resp.total;
          this.perPage = resp.perPage;
        } else {
          if(!this.completing) {
            this.total = 0;
            this.perPage = 60;
          }
        }
        this.loading = false;
        this.completing = false;
        this.usersReady = true;
      },
      renderWorkmanAvatar(user) {
        if(!user || !user.avatar) { return '/static/images/worker2.png'; }
        return window.image('/images/xs/'+user.avatar);
      },
      havePermission(a, b) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        if(this.$store.state.user.usertype !== 'coworker') { return 0; }
        if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id]) { return 0; }
        if(!this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions[a]) { return 0; }
        return this.$store.state.professionsByIds[this.$store.state.user.profession_id].permissions[a][b];
      }
    }
  }
</script>
