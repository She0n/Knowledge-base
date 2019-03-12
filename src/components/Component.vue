<script>
  import preloader from '@/components/elements/preloader.vue'
  import permissionDeniedComponent from '@/components/errors/permissionDeniedComponent.vue'
  import sInput from '@/components/elements/sInput.vue';
  import sValue from '@/components/elements/sValue.vue';
  export default {
    data () {
      return {
        permissionDenied: false,
        permissionDeniedTitle: '',
        permissionDeniedDesc: '',
        channels: [],
        componentReady: false,
      }
    },
    created () {
      this.$store.dispatch('setComponentReady', false);
    },
    watch: {
      'pageData.title'() {
        this.page();
      },
    },
   methods: {
    subscribe(v) {
      let target = v ? v : this.channels;
      if(!this.channels.length) { return; }
      this.$socket.subscribe(target);
    },
    unsubscribe(v) {
      let target =v ? v : this.channels;
      if(!this.channels.length) { return; }
      this.$socket.unsubscribe(target);
    },
    moduleX(a) {
      let b = a < 0 ? a*-1 : a;
      return b > 100 ? 100 : b;
    },
     isFieldEmpty(a) {
        return window.isFieldEmpty(a);
     },
    page() {
      this.$store.commit('page', this.pageData);
    },
     renderMonth() {
       let date = new Date();
       let month = date.getMonth();
       return window.dateFormatter.switchMonth(month)[0];
     },
    permissions(data) {
      if(!data.permissionDenied) { return 1; }
      this.permissionDenied = data.permissionDenied;
      this.permissionDeniedTitle = data.title;
      this.permissionDeniedDesc = data.description;
      this.$store.dispatch('setComponentReady', true);
      return 0;
    },
    renderImage(img) {
      return window.image(img);
    },
     parseJson(x) {
       return JSON.parse(x);
     },
    renderAvatar(img, type) {
      if(!img) { return window.getDefaultAvatar(); }
      let path = '/images/'+(type ? type+'/' : '' )+img;
      return this.renderImage(path);
    },

    renderMyAvatar(size) {
      if(!this.$store.state.user) { return window.getDefaultAvatar(); }
      if(!this.$store.state.user.avatar) { return window.getDefaultAvatar(); }
      size = size ? (size+'/') : '';
      return window.image('/images/'+size+this.$store.state.user.avatar);
    },

    renderSimpleDate(date) {
      return window.dateFormatter.reformatSimpleDate(date);
    },
    renderDate(date) {
      return window.dateFormatter.reformatDate(date);
    },
    renderDateString(a) {
      return window.dateFormatter.buildDateStringFromDate(a);
    },
    rusificate(a,b,c,d) {
      return window.rusificate(a,b,c,d);
    },
    renderUserRealName(user) {
      return window.renderUserRealName(user);
    },
    renderOrganizationPhone() {
      return window.config.phone;
    },
    renderUserFullName(user) {
      if(!user) { return ''; }
      if(!user.first_name && !user.last_name) { return user.username; }
      let name = '';
      if(user.last_name) { name += user.last_name+' '; }
      if(user.first_name) {
        name += user.first_name + ' ';
        if(user.third_name) {
          name += user.third_name + ' ';
        }
      }
      return name;
    },
    generateId () {
       return window.generateId();
    },
   },
    mounted() {
      this.page();
    },
    components: {
      preloader, permissionDeniedComponent, sInput, sValue
    }
  }
</script>
