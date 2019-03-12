<script>
  const coworkerGroups = ['coworker', 'workman'];
  export default {
    data() {
      return {};
    },
    methods: {
      isAdmin(u) {
        let b = u ? u : this.$store.state.user;
        if (!b) { return 0; }
        let groups = ['admin'];
        if (groups.indexOf(b.usertype) === -1) { return 0; }
        return 1;
      },
      isCoworker(u) {
        let c = u ? u.usertype : (this.$store.state.user ? this.$store.state.user.usertype : '');
        return (coworkerGroups.indexOf(c) !== -1);
      }
    }
  }
</script>
