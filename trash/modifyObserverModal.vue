<template>
  <div class="c-modal  modal fade" id="modify-observer-modal" tabindex="-1" role="dialog" aria-labelledby="usersModal">
    <div class="c-modal__dialog modal-dialog" role="document">
      <div class="c-modal__content modal-content">
        <header class="c-modal__header">
          <h1 class="c-modal__title" v-html="title"></h1>
          <span class="c-modal__close" data-dismiss="modal" aria-label="Close"><i class="fa fa-close"></i></span>
        </header>
        <div class="c-modal__body">
          <div class="row">
            <div class="col-12">
              <div class="u-text-center">
                <form onsubmit="return false;" id="users-modal-form">
                  создание обса
                </form>
              </div>
            </div>

          </div>

        </div><!-- // .c-plans__body -->

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['title', 'created'],
    data() {
      return {
        ev: 'changeUserType',
      };
    },
    created () {
      this.$on(this.ev, (val) => {
        if(!Array.isArray(this.selectedUserTypes)) {
          this.selectedUserTypes = [val];
          return;
        }
        let index = this.selectedUserTypes.indexOf(val);
        if(index === -1) {
          this.selectedUserTypes.push(val);
        } else {
          this.selectedUserTypes.splice(index, 1);
        }
      });
    },
    mounted() {

    },
    watch: {

    },
    methods: {

    },
    components: {

    }
  }
</script>
