<script>
  export default {
    methods: {
      allowMessage(u) {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.user_id === u.user_id) { return 0; }
        if(u.usertype === 'workman') { return 0; }
        if(this.$store.state.user.usertype === 'admin') { return 1; }
        return 0;
      },
      isHr() {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype !== 'coworker') { return 0; }
        if(!this.$store.state.user.profession_id) { return 0; }
        let prof = this.$store.state.professionsByIds[this.$store.state.user.profession_id];
        if(!prof) { return 0; }
        return (prof.permissions.crm.modifyCoworkers && prof.permissions.crm.watchCoworkersPersonalData && prof.permissions.crm.fireCoworkers);
      },
      rusificate(a,b,c,d) {
        return window.rusificate(a,b,c,d);
      },
      canModifyCoworkers() {
        if(!this.$store.state.user) { return 0; }
        if(this.$store.state.user.usertype !== 'coworker') { return 0; }
        if(!this.$store.state.user.profession_id) { return 0; }
        let prof = this.$store.state.professionsByIds[this.$store.state.user.profession_id];
        if(!prof) { return 0; }
        return (prof.permissions.crm.modifyCoworkers);
      },
      renderCommaBr(a) {
        let b = a.split(',');
        let str = '';
        let comma = '';
        for(let i = 0; i < b.length; i++) {
          str += comma+b[i];
          comma = ', <br/>';
        }
        return str;
      },
      renderUserRealName(user) {
        return window.renderUserRealName(user);
      },
      renderUserType (us) {
        if(!us) { return ''; }
        if(!us.usertype) { return ''; }
        if(us.usertype === 'coworker' || us.usertype === 'admin') {
          if(!us.profession_id) {
            if(!this.$store.state.usertypes[us.usertype]) { return 'Сотрудник'; }
            return this.$store.state.usertypes[us.usertype].title;
          }
          if(this.$store.state.professionsByIds[us.profession_id]) {
            return this.$store.state.professionsByIds[us.profession_id].title;
          }
          if(!this.$store.state.usertypes[us.usertype]) { return 'Сотрудник'; }
          return this.$store.state.usertypes[us.usertype].title;
        }
        if(!this.$store.state.usertypes[us.usertype]) { return ''; }
        return this.$store.state.usertypes[us.usertype].title;
      },
      renderUserProfessionSpecialization(user) {
        let t = user.profession_id ? this.renderUserProfession(user) : (user.specialization ? user.specialization : '')
        if(t.length) { return t; }
        return this.renderUserType(user);
      },
      renderUserProfession(us) {
        if(!us) { return ''; }
        if(!us.usertype) { return ''; }
        if(us.usertype !== 'coworker' && us.usertype !== 'admin') { return ''; }
        if(this.$store.state.professionsByIds[us.profession_id]) {
            return this.$store.state.professionsByIds[us.profession_id].title;
        }
        return '';
      },
      renderBirthday(b) {
        return b ? window.dateFormatter.reformatDate(b) : 'не указан';
      },
      renderFailClass(total, failed) {
        if(!failed) { return 'u-color-success2'; }
        if(!total) { return 'u-color-success2'; }
        let percent = (failed/total*100);
        if(percent < 25) { return 'u-color-warning'; }
        return 'd-color-danger';
      },
      renderUserInitials(user) {
        return window.renderUserInitials(user);
      },
      renderUserAvatar(user, size) {
        if(!user || !user.avatar) { return window.getDefaultAvatar(user); }
        return window.image('/images/'+(typeof size === 'string' ? (size ? size+'/' : '') : 'xs/')+user.avatar);
      },
      renderUserAvatarError(e, user) {
        e.target.src = window.getDefaultAvatar(user)
      },
      isSelf(user) {
        if(!this.$store.state.user) { return 0; }
        return this.$store.state.user.user_id == user.user_id;
      }
    }
  }
</script>
