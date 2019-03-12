<template>
  <div class="row vh-100">
    <div class="o-page__card u-align-self-center ">

      <div class="c-card u-mb-small">
        <header class="c-card__header u-text-center u-pt-large">
                    <span class="c-card__icon">
                        <i class="fa fa-lock"></i>
                    </span>
          <h1 class="u-text-big u-mb-zero">
             <em class="u-block u-text-mute u-text-large" v-html="(title && title.length) ? title : 'Доступ запрещен'"></em>
          </h1>
        </header>

        <div class="c-card__body">
          <h2 class="u-h5 u-text-center u-mb-medium" v-html="(description && description.length) ? description : 'Недостаточно прав для просмотра этой страницы'"></h2>

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
  export default {
    props: ['title', 'description'],
    data() {
      return {

      };
    }

  }
</script>
