<script>
  export default {
    methods: {
      confirm(a) {
        let item = this.getClearDialogItem(a, 'confirm');
        this.$store.commit('addDialogItem', item);
      },
      alert(a) {
        let item = this.getClearDialogItem(a, 'alert');
        this.$store.commit('addDialogItem', item);
      },
      getClearDialogItem(a, type) {
        let color;
        if(typeof a === 'object' && a && a.color) {
          color = a.color;
        } else {
          color = (type === 'alert' ? 'danger' : 'info');
        }
        let base = {
          icon: '',
          title: '',
          subtitle: a.subtitle ? a.subtitle : (type === 'alert' ? (color === 'success' ? 'действие выполнено' : 'ошибка') : 'подтверждение'),
          type: type,
          color: color,
          confirmText: 'Подтвердить',
          cancelText: 'Отменить',
          checkbox: false,
          input: false,
          confirm: () => {},
          cancel: () => {},
        };
        if(typeof a === 'string') {
          base.title = a;
        } else {
          for(let prop in a) {
            base[prop] = a[prop];
          }
        }
        return base;
      }
    }
  }
</script>
