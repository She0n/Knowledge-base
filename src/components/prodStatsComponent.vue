<template>
  <div class="row vh-100">
    <div class="o-page__card u-align-self-center ">

      <div class="c-card u-mb-small">
        <header class="c-card__header u-text-center u-pt-large">
                    <span class="c-card__icon">
                        <i class="fa fa-chain-broken"></i>
                    </span>
          <h1 class="u-text-big u-mb-zero">
            Ooops. <em class="u-block u-text-mute u-text-large">Раздел в разработке</em>
          </h1>
        </header>

        <div class="c-card__body">
          <h2 class="u-h5 u-text-center u-mb-medium">
            Принесите банку сгущенки программисту, чтобы ускорить разработку
          </h2>

        </div>
      </div>

      <div class="o-line u-justify-center">
        <router-link to="/" class="u-text-mute" >
          <i class="fa fa-long-arrow-left u-mr-xsmall"></i>На главную
        </router-link>
      </div>

    </div>
  </div>
</template>
<script>
  import Component from '@/components/Component.vue'
  let pageData = { title: 'Раздел в разработке', metaTitle: 'Раздел в разработке', headerClass: 'u-mb-small' }
  export default {
    extends: Component,
    mounted() {
      this.$store.dispatch('setComponentReady', true);
    },
    data () {
      return {
        pageData
      }
    }
  }
</script>
