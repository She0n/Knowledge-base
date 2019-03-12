<template>
  <div class="funnel-fast-add-wrapper" >

    <div :class="'funnel-fast-add '+(expanded ? 'funnel-fast-add-expanded' : '')" @click="expanded = !expanded" :key="'fast-lead-1'" >
      <span>Быстрое добавление</span>
      <svg width="16" class="transition-03" :style="expanded ? '' : 'opacity: 0'" version="1.1" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 64 64" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 64 64">
        <g>
          <path fill="#fff" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
        </g>
      </svg>
    </div>
    <div class="funnel-fast-add-body" v-if="expanded" :key="'fast-lead-2'">
      <input type="text" v-model="fastLead.title" @keyup="submitEnter($event)" placeholder="Название сделки" class="d-input">
      <input type="text" v-model="fastLead.price" maxlength="7" @keyup="submitEnter($event)" onkeypress="return validateNumericInput(event)" placeholder="Цена сделки" class="d-input">
      <input type="text" v-model="fastLead.first_name" @keyup="submitEnter($event)" placeholder="Имя контакта" class="d-input">
      <sInput :field="{ type: 'contact-autocomplete', title: 'Телефон', placeholder: 'Телефон', relatedObject: fastLead, relatedKey: 'contact_id' }" v-model="fastLead.phone"></sInput>
      <input type="text" v-model="fastLead.email" @keyup="submitEnter($event)" placeholder="Емайл" class="d-input">
      <div class="funnel-fast-add-btns">
        <button class="d-btn d-btn--success" @click="create()"><span class="m-loader m-loader-small2 m-loader-white" v-if="process"></span>добавить</button>
      </div>
    </div>
  </div>
</template>
<script>
  import Inputmask from 'inputmask';
  import sInput from '@/components/elements/sInput.vue';
  export default {
    props: {
      fastLead: {},
      submit: {},
      process: {
        type: Boolean,
        default: false,
      },
      titlePlaceholder: {
        default: 'Название сделки'
      },
      create: {

      },
    },
    data() {
      return {
        expanded: false
      };
    },
    methods: {
      closeExpand() {
        this.expanded = false;
      },
      submitEnter(e) {
        if (e.key !== 'Enter') {
          return;
        }
        if (e.shiftKey !== false) {
          return;
        }
        this.submit();
      },
      setMasks() {
        let els = document.getElementsByClassName('phone');
        if(!els) { return; }
        for(let i = 0; i < els.length; i++) {
          let im = new Inputmask('+7 (999)-999-99-99');
          im.mask(els[i]);
        }
      },
    },
    components: {
      sInput
    }
  }
</script>
