<template>
  <div class="o-media u-mb-small" >
    <div class="o-media__img u-mr-small">
      <div class="c-avatar c-avatar--xsmall avatar-over">
        <img :src="renderUserAvatar(user)" onerror="window.setDefaultAvatar(this)" class="c-avatar__img"></div>
    </div>
    <div class="o-media__body">
      <h6 class=" u-mb-zero u-text-small" v-html="renderUserRealName(user)"></h6>
      <p class="u-text-mute u-text-xsmall" v-html="renderUserType(user)"></p>
      <div class="drop-related-user u-text-dark-hover" @click="$parent.$emit('dropRelatedUser', { list: list, index: index})">-</div>
    </div>
  </div>
</template>
<script>
  import commonMixin from '@/mixins/commonMixin.vue';
  export default {
    props: ['user', 'drop', 'list', 'index'],
    mixins: [commonMixin],
    methods: {

    }
  }
</script>
