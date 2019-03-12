<template>
  <div>
    <div :class="'overlay-modal-outer '+(show ? '' : 'overlay-translated')">
      <div class="overlay-modal-outer-backdrop" @click="$router.push(clearLinkView())"></div>
      <div class="overlay-modal-inner c-scrollbar">
        <div class="overlay-modal-wrap flex-wrap">
          <div class="overlay-lead-modal-fw u-width-100">
            <div class="overlay-modal-header u-pv-small u-ph-medium u-mb-small c-card">
              <div class="overlay-modal-title">
                <input type="text" class="overlay-modal-title-input" placeholder="Сделка #xxxxxxx" v-model="e_lead.name">
              </div>
              <div class="overlay-modal-tags-wrapper" >
                <div :class="'overlay-modal-tags-capture-wrapper u-mt-small u-mb-medium '+(tagsInputInFocus ? 'in-focus' : '')">
                  <div class="trigger overlay-modal-tag except-outfocus" @click="focusActiveLead($event)" v-if="!e_lead.tags.length && !hideTaggingTooltip">
                    <div >#тегировать</div>
                  </div>
                  <div class="overlay-modal-tag" v-for="tag, i in e_lead.tags" @click="e_lead.tags.splice(i, 1)">
                    <div v-html="tag"></div>
                  </div>
                  <div class="overlay-modal-tag-input">
                    <input type="text" id="overlay-modal-tags-input" :placeholder="tagsInputInFocus ? 'Ремонт квартир' : ''" ref="tagsInput" @focus="focusTagsInput($event)" @keyup="submitEnter($event, createTag)"  v-model="activeTag">
                  </div>
                </div>
                <div class="overlay-modal-tags-capture-preloader" v-if="tagsLoadingProcess">
                  <div class="m-loader"></div>
                </div>
                <div class="overlay-modal-tags-dd-wrapper" v-show="tagsInputInFocus && displayAutocompleteTags.length">
                  <div class="overlay-modal-tags-dd-inner">
                    <div class="overlay-modal-dd-tag-wrapper" v-for="item, index in displayAutocompleteTags" v-if="e_lead.tags.indexOf(item) === -1" @click="createTag(item)">
                      <div class="overlay-modal-dd-tag" v-html="item"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="overlay-modal-funnels-wrapper" v-if="$parent.leadsCategories">
                <div class="overlay-modal-active-lead-funnel u-mb-xsmall" v-if="!$parent.eActiveLeadComputedData.category.static">
                  <span v-html="$parent.eActiveLeadComputedData.activeFunnel.title"></span>
                </div>
                <div v-if="$parent.eActiveLeadComputedData.category.static" class="overlay-modal-funnel-items">
                  <div v-for="a, b in $parent.eActiveLeadComputedData.category.cols" :class="'overlay-modal-funnel-item '+($parent.isActiveStaticCol(b) ? 'active' : '')" >
                    <span v-html="a.title"></span>
                  </div>
                </div>
                <div class="overlay-modal-funnel-items" v-else>
                  <div v-for="a, b in $parent.eActiveLeadComputedData.activeFunnel.cols" :title="a.title" :class="'overlay-modal-funnel-item '+($parent.isActiveFunnelCol(b) ? 'active' : '')">
                    <span v-html="a.title"></span>
                  </div>
                </div>
                <div class="overlay-modal-funnel-buttons u-mt-small">
                  <button class="d-btn d-btn--success u-mr-3">Следующий этап</button>
                  <button class="d-btn d-btn--danger">Проиграна</button>
                </div>

              </div>

              <!-- end of tags -->
            </div>
          </div>
          <div class="u-flex u-relative u-width-100">
          <div class="overlay-lead-modal-left">
            <div class="overlay-modal-lead-body  c-card">
              <div class="c-toolbar c-toolbar--small">
                <div class="c-tabs__item" v-for="item, index in cardStructure" @click="activeTab = item.lead_field_category_id">
                  <span :class="'c-tabs__link trigger '+(activeTab === item.lead_field_category_id ? 'active' : '')" v-html="item.title"></span>
                </div>
              </div>
              <div class="u-p-medium ">
                <div v-for="item, index in cardStructure" v-if="item.lead_field_category_id === activeTab">
                    <sInput v-for="field in item.fields" :nullable="true" :field="modifyLeadField(field)" :key="field.field_id"></sInput>
                    <div v-if="index === 0" class="lead-main-card-additional">
                      <div class="lead-main-card-row">
                        <div :class="'lead-main-card-row-placeholder '+(createContactActive ? 'cursor-default' : '')" @click="createContactActive = true">
                            <div class="lead-main-card-row-placeholder-avatar">
                              <div class="c-project__profile c-project__profile--btn u-mr-xsmall" >
                                <i class="fa fa-plus"></i>
                              </div>
                            </div>
                            <div class="lead-main-card-row-placeholder-name">
                              <input type="text" v-model="createContact.contact_name" placeholder="Название контакта" v-if="createContactActive">
                              <span v-html="'Добавить контакт'" v-else></span>
                            </div>
                        </div>

                          <div v-if="createContactActive" class="u-pb-medium u-pt-xsmall">
                            <sInput :field="{ type: 'text', title: 'Имя' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Отчество' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Фамилия' }" ></sInput>
                            <sInput :field="{ type: 'phone', title: 'Телефон' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Email' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Компания' }" ></sInput>
                            <sInput :field="{ type: 'checkbox', title: 'Встреча проведена' }" ></sInput>
                            <div class="overlay-input u-mt-medium">
                              <div class="linked-form__field linked-form__field-text">
                                <div class="linked-form__field__label">
                                  <span class="u-color-info-hover trigger" @click="createContactActive = false; createContact = getClearContact() ">отменить</span>
                                </div>

                              </div>
                            </div>
                          </div>

                      </div>
                      <!-- end of contacts -->
                      <div class="lead-main-card-row">
                        <div :class="'lead-main-card-row-placeholder '+(createCompanyActive ? 'cursor-default': '')" @click="createCompanyActive = true">
                          <div class="lead-main-card-row-placeholder-avatar">
                            <div class="c-project__profile c-project__profile--btn u-mr-xsmall" >
                              <i class="fa fa-plus"></i>
                            </div>
                          </div>
                          <div class="lead-main-card-row-placeholder-name">
                            <input type="text" v-model="createCompanyContact.contact_name" placeholder="Название компании" v-if="createCompanyActive">
                            <span v-html="'Добавить компанию'" v-else></span>
                          </div>
                        </div>

                          <div v-if="createCompanyActive" class="u-pb-medium u-pt-xsmall">
                            <sInput :field="{ type: 'text', title: 'Название' }" ></sInput>
                            <sInput :field="{ type: 'phone', title: 'Телефон' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Email' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Адрес' }" ></sInput>
                            <sInput :field="{ type: 'text', title: 'Web сайт' }" ></sInput>
                            <div class="overlay-input u-mt-medium">
                              <div class="linked-form__field linked-form__field-text">
                                <div class="linked-form__field__label">
                                  <span class="u-color-info-hover trigger" @click="createCompanyActive = false; createCompany = getClearCompanyContact() ">отменить</span>
                                </div>
                              </div>
                            </div>
                          </div>

                      </div>
                      <!-- end of companies -->

                    </div>
                </div>
              </div>
            </div>
          </div>
        <div class="overlay-lead-modal-right c-card">
          <div class="overlay-lead-modal-right-notes">
            <button @click="modifyLead()">сохранить лида</button>
          </div>
          <div class="overlay-lead-modal-right-new-msg">
            <div class="n-add-post-header-wrapper u-border-bottom">
              <div class="u-p-medium n-padding-x-1">
                <div class="n-add-post-header">
                  <div class="n-add-post-avatar">
                    <div class="c-avatar c-avatar--xsmall"><img
                      :src="renderUserAvatar($store.state.user)"
                      onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
                  </div>
                  <div class="n-add-post-area">
                    <textarea placeholder="Добавить запись" class="c-input" style="height: 42px;"></textarea></div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" >
      <div class="modal-overlay-backdrop" @click="$router.push(clearLinkView())" v-if="show"></div>
    </transition>
    <!--
    <overlayUserComponent class="overlay-level-2" :transfered_user_id="modalUserId" :show="showContact" :parentShowCallback="contactShowCallback"></overlayUserComponent>
    -->
  </div>
</template>
<script>
  import extendedLeadsMixin from '@/mixins/extendedLeadsMixin.vue';
  import keypressMixins from '@/mixins/keypressMixins.vue';
  import sInput from '@/components/elements/sInput.vue';
  import commonMixin from '@/mixins/commonMixin.vue';
  import overlayUserComponent from '@/components/overlayUserComponent.vue';
  export default {
    props: {
      show: {},
      modalUserId: null
    },
    mixins: [extendedLeadsMixin, keypressMixins, commonMixin],
    data() {
      return {
        allowEditLead: false,
        tagsLoadingProcess: false,
        hideTaggingTooltip: false,
        tagsInputInFocus: false,
        autocompleteTags: [],
        baseAutocompleteTags: [],
        autocompleteTagsTimeout: null,
        activeTag: '',
        activeTab: '',
        tagsOutsideClicks: 0,
        cardStructure: [],
        showContact: false,
        createContactActive: false,
        createCompanyActive: false,
        createCompanyContact: this.getClearCompanyContact(),
        createContact: this.getClearContact(),
        lead: this.getClearLead(),
        e_lead: this.getClearLead(),
        eActiveLeadFieldsValues: {

        },
      };
    },
    async created() {
      await this.getCardStructure();
      this.resetCardView();
    },
    destroyed() {
      window.removeEventListener('click', this.blurTagsInput);
    },
    computed: {
      eLeadFunnelCol() {
        return this.e_lead.category+'_'+this.e_lead.funnel_col;
      },
      displayAutocompleteTags() {
        return this.autocompleteTags.filter((el) => {
          if(this.e_lead.tags.indexOf(el) !== -1) { return false; }
          return (this.activeTag && this.activeTag.length) ? (el.toLowerCase().indexOf(this.activeTag.toLowerCase()) !== -1) : true;
        });
      },
      eActiveLeadIndividualContacts() {
        let a = [];
        for(let i = 0; i < this.e_activeLead.contacts.length; i++) {
          let row = this.e_activeLead.contacts[i];
          if(row.user_id) {
            a.push(row);
          }
        }
        return a;
      },
      eActiveLeadCorporateContacts() {
        let a = [];
        for(let i = 0; i < this.e_activeLead.contacts.length; i++) {
            let row = this.e_activeLead.contacts[i];
            if(row.type) {
              a.push(row);
            }
        }
        return a;
      },
      activeLeadFunnel() {

      },
      eLeadFieldsByIdsIndexes() {
        let a = {};
        for(let i = 0; i < this.e_lead.fields.length; i++) {
          a[this.e_lead.fields[i].field_id] = i;
        }
        return a;
      },
    },
    watch: {
      activeTag(v) {
        if(!v) { return; }
        if(!v.length) { return; }
        if(this.autocompleteTagsTimeout) { clearTimeout(this.autocompleteTagsTimeout); }
        this.autocompleteTagsTimeout = setTimeout(this.getAutocompleteTags, 200);
      },
      tagsInputInFocus(v) {
        if(!v) { return; }
        this.getAutocompleteTags();
      },
      show(v) {
        if(v) {
          document.body.classList.add('overlay-modal-mode');
        } else {
          document.body.classList.remove('overlay-modal-mode');
        }
      }
    },
    methods: {
      getClearContact() {
        return {
          user_id: 0,
          phone: '',
          phone2: '',
          email: '',
          first_name: '',
          last_name: '',
          third_name: '',
          avatar: '',
          company: '',
          meeted: false,
          contact_name: ''
        };
      },
      getClearCompanyContact() {
        return {
          company_id: 0,
          contact_name: '',
          title: '',
          phone: '',
          email: '',
          web: ''
        };
      },
      contactShowCallback() {
        this.showContact = false;
      },
      modifyLeadField(f) {
        if(f.type.indexOf('audio') !== -1) {
          f.path = '/audio';
        }
        if(f.type.indexOf('video') !== -1) {
          f.path = '/video';
        }
        if(f.type.indexOf('photo') !== -1) {
          f.path = '/images';
        }
        if(f.type.indexOf('gallery')) {
          if(!Array.isArray(f.value)) {
            f.value = [];
          }
        }
        if(f.type === 'responsible_user') {
          f.users_loading = false;
          f.usertypes = ['coworker', 'admin'];
          if(!f.value) {
            f.value = {};
          }
        }
        if(!f.value) {
          f.value = '';
        }
        return f;
      },
      renderLeadStatusPlaceholder() {
        let s = '<span>';
        // category first
        if(!this.leadsCategories) { return ''; }
        if(!this.leadsCategories[this.e_lead.category]) { return ''; }
        s += this.leadsCategories[this.e_lead.category].title + ' ';
        s += $parent.funnelColsByPath[this.eLeadFunnelCol] ? $parent.funnelColsByPath[this.eLeadFunnelCol].title : 'Не выбрано';
        s += '</span>';
        return s;
      },
      getFunnelColPath(cat, col) {
        return cat+'_'+col;
      },
      resetCardView() {
        if(this.cardStructure) {
          if(this.cardStructure.length) {
            this.activeTab = this.cardStructure[0].lead_field_category_id;
          }
        }
      },
      getClearLead() {
        return {
          lead_id: 0,
          title: '',
          tags: [],
          fields: [],
          category: null,
          funnel_col: null,
          contact_ids: [],
          contacts: [],
          new_contact: {
            user_id: '',
            first_name: '',
            last_name: '',
            third_name: '',
            username: '',
            avatar: ''
          },
          new_company: {

          }
        };
      },
      setLead(lead) {
        let newLead = this.getClearLead();
        const except = ['new_contact', 'new_company'];
        for(let prop in newLead) {
          if(except.indexOf(prop) !== -1) { continue; }
          if(typeof lead[prop] === 'undefined') { continue; }
          newLead[prop] = lead[prop];
        }
        // base fields are set
        this.activeLead = newLead;
        this.e_activeLead = JSON.parse(JSON.stringify(newLead));
        this.recalculateActiveLeadComputedData();
      },
      async getCardStructure() {
        const resp = await $http.get('/get-lead-card-structure');
        if(!Array.isArray(resp)) { resp = []; }
        this.cardStructure = resp;
        for(let i = 0; i < this.cardStructure.length; i++) {
          let col = this.cardStructure[i];
          for(let j = 0; j < col.fields.length; j++) {
            let f = col.fields[j];
            let baseVal = '';
            if(f.type.indexOf('gallery') !== -1) {
              baseVal = [];
            }

            this.$set(this.eActiveLeadFieldsValues, f.field_id, {
              field_id: f.field_id,
              value: baseVal
            });
          }

        }
      },
      focusTagsInput(e) {
        this.tagsInputInFocus = true;
        this.tagsOutsideClicks = 0;
        window.addEventListener('click', this.blurTagsInput);
      },
      async getAutocompleteTags() {
        if(!this.activeTag || !this.activeTag.trim().length) {
          if(this.baseAutocompleteTags.length) {
            this.autocompleteTags = JSON.parse(JSON.stringify(this.baseAutocompleteTags));
            return;
          }
        }
        this.tagsLoadingProcess = true;
        const resp = await $http.post('/get-autocomplete-tags', { q: this.activeTag });
        if(resp) {
          if(!Array.isArray(resp.list)) {
              resp.list = [];
          }
          this.autocompleteTags = resp.list;
        }
        this.tagsLoadingProcess = false;
      },
      focusActiveLead($e) {
        this.hideTaggingTooltip = true;
        this.$refs.tagsInput.focus();
        this.focusTagsInput($e);
      },
      createTag(x) {
        if(!x) {
          if(!this.activeTag) { return; }
          if(!this.activeTag.length) { return; }
          x = this.activeTag;
        }
        x = x.trim();
        if(!x.length) { return; }
        if(this.e_lead.tags.indexOf(x) !== -1) {
          return;
        }
        this.e_lead.tags.push(x);
        this.activeTag = '';
        this.$refs.tagsInput.focus();
      },
      blurTagsInput(e) {

        if(e.target.classList.contains('except-outfocus') || e.target.closest('.except-outfocus') || e.target.closest('.overlay-modal-tags-dd-wrapper') || e.target.classList.contains('.overlay-modal-tags-dd-wrapper') || e.target.id === 'overlay-modal-tags-input') {
          this.$refs.tagsInput.focus();
          if(!this.e_lead.tags.length) {
            this.hideTaggingTooltip = false;
          }
          return;
        }
        this.tagsInputInFocus = false;
        if(!this.e_lead.tags.length) {
          this.hideTaggingTooltip = false;
        }
        window.removeEventListener('click', this.blurTagsInput);
      },
    },
    components: {
      sInput, overlayUserComponent
    }
  }
</script>
