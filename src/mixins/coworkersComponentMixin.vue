<script>
  export default {
    data() {
      return {};
    },
    methods : {
      refreshProfessions() {
        this.professions = JSON.parse(JSON.stringify(this.$store.state.professions));
      },
      async confirmFireUser() {
        const resp = await $http.post('/api/users/fire', { reason: this.$store.state.dialog.input, user_id: this.firingUserId, black_list: this.$store.state.dialog.checkbox });
        if(resp.result) {
          await this.getUsers(false, { start: true });
        } else {
          this.$store.commit('setDialogVals', { k: 'error', v: resp.display });
          return false;
        }
        return true;
      },
      confirmFireUserDialog(user) {
        this.firingUserId = user.user_id;
        this.confirm({
          title: 'Уволить сотрудника?',
          subtitle: false,
          color: 'danger',
          input: 'Причина увольнения',
          inputRequired: true,
          checkbox: 'В черный список',
          confirmText: 'Уволить',
          confirm: this.confirmFireUser
        });
      },
    }
  }
</script>
