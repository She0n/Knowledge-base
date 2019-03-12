<template>
  <div class="c-stage u-mb-small u-p-medium n-padding-x-4">
    <form onsubmit="return false;">
      <div class="row">
        <div class="col-12 col-md-5 col-sm-5 col-lg-5 col-xl-5">
          <div class="c-field field-search">
            <span class="c-field__addon"><i class="fa fa-search"></i></span>
            <input class="c-input" v-model="q" autocomplete="off" id="autocomplete-input" type="text" placeholder="Начните ввод запроса">
            <div :class="'autocomplete-list '+ (autocompleteHidden ? 'hidden' : '')" v-if="autocomplete.length">
              <div class="autocomplete-item" v-for="item in autocomplete">
                <router-link :to="item.link+'#material-'+item.material_id"
                             class="u-text-dark u-text-13" v-on:click="hideAutocomplete()">
                  <span v-html="item.title"></span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7 col-sm-7  col-lg-7 col-xl-7">
          <div class="search-btns">
            <router-link to="/main/modify-category" class="c-btn">
              <span v-html="$store.state.canModerate ? 'Создать раздел' : 'Предложить раздел'"></span>
            </router-link>
            <router-link to="/main/modify-material" class="c-btn c-btn__error">
              <span v-html="$store.state.canModerate ? 'Создать статью' : 'Предложить статью'"></span>
            </router-link>
            <router-link to="/main/modify-test" class="c-btn c-btn__warning">
              Создать тест
            </router-link>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import permissionsMixin from '@/mixins/permissionsMixin.vue';
  export default {
    props: ['tests'],
    mixins: [permissionsMixin],
    data() {
      return {
        autocompleteHidden: false,
        cancelRequest: null,
        autocomplete: [],
        q: '',
      };
    },
    watch: {
      q() {
        this.fastSearch();
      },
    },
    mounted() {
      this.init();
    },
    destroyed() {
      this.removeEventListener();
    },
    methods: {
      fastSearch() {
        if (this.q.length < 2) {
          this.autocomplete = [];
          this.hideAutocomplete();
          return;
        }
        let that = this;
        clearTimeout(this.timeout);
        setTimeout(async () => {
          if (typeof that.cancelRequest === 'function') {
            that.cancelRequest();
          }
          let resp = await $http.post('/search-content', {
            q: this.q.length > 2 ? this.q : '',
            fts: true,
            /*cancelToken: new window.axios.CancelToken(function executor(c) {
              that.cancelRequest = c;
            })*/
          });
          if (resp) {
            that.autocomplete = Array.isArray(resp.materials) ? resp.materials : [];
          } else {
            that.autocomplete = [];
          }
          that.showAutocomplete();
        }, 350);
      },
      init() {
        $(document).on('click.autocomplete', this.forceHideAutocomplete);
      },
      removeEventListener() {
        $(document).off('click.autocomplete', this.forceHideAutocomplete);
      },
      forceHideAutocomplete(e) {
        if (e.target.classList.contains('autocomplete-input')) {
          return;
        }
        this.autocomplete = [];
        return;
      },
      hideAutocomplete() {
        this.autocompleteHidden = true;
      },
      showAutocomplete() {
        this.autocompleteHidden = false;
      },
    }
  }
</script>
