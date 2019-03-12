<template>
  <div class="funnel-item">
    <div class="funnel-item-row-1">
      <div class="funnel-item-client-name" v-html="item.first_name"></div>
      <div class="funnel-item-date" v-html="renderDate(item.created_at)"></div>
    </div>
    <router-link class="funnel-item-row-2 c-color-info2" tag="div" :to="link" v-html="item.title"></router-link>
    <div class="funnel-item-row-3" v-if="item.price || (item.tags && item.tags.length)">
      <div class="funnel-item-row-cost" v-html="item.price.toLocaleString() + ' руб'" v-if="item.price"></div>
      <div class="funnel-item-row-tags">
        <div class="funnel-item-row-tag" v-for="tag, tagIndex in item.tags" v-if="tagIndex < 2" >
          <span v-html="tag"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['item', 'renderDate', 'link'],
    data() {
      return {

      };
    }
  }
</script>
