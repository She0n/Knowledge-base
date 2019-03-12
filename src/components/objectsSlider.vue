<template>
  <div :class="'object-items-slider n-carousel '+(hiddenNav ? ' n-carousel-hidden-nav' : '')" :id="id">
    <div class="object-items-slider-left object-item-slider-nav"><i class="fa fa-angle-left" v-on:click="prev()"></i></div>
    <div class="object-items-slider-right object-item-slider-nav"><i class="fa fa-angle-right" v-on:click="next()"></i></div>
    <div class="object-items-slider-inner n-carousel-inner">
      <div class="n-carousel-list">
        <div v-for="objectItem, index in items" class="n-carousel-item">
          <div class="object-item">
            <div class="object-item-inner stacked trigger">
              <div class="object-item-image-wrapper">
                <img src="/static/images/default-object-image.jpg">
              </div>
              <div class="object-item-title" v-html="objectItem.title"></div>
            </div>
          </div>
        </div>
        <div v-if="params.toFill.length" class="n-carousel-item n-carousel-item-fill" v-for="objectItem, index in params.toFill">
          <div class="object-item">
            <div class="object-item-inner stacked">
              <div class="object-item-image-wrapper">
                <img src="/static/images/default-object-image.jpg" alt="">
              </div>
              <div class="object-item-title">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        id: '',
        params: {
          width: 0,
          innerWidth: 0,
          itemWidth: 0,
          minItems: 0,
          toFill: []
        },
        hiddenNav: true,
        currentOffset: 0
      };
    },
    props: {

      items: {
        type: Array,
        default: []
      },
      fillEmpty: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      recalculateItems() {
        this.params.width = this.el.width();
        this.params.innerWidth = this.el.find('.n-carousel-inner').width();
        this.listEl = this.el.find('.n-carousel-list');
        this.params.listWidth = this.listEl.width();
        this.params.itemWidth = this.listEl.find('.n-carousel-item').outerWidth();
        this.params.minItems = Math.ceil(this.params.width/this.params.itemWidth);
        if(this.params.minItems > this.items.length) {
          let n = this.params.minItems - this.items.length;
          let arr = [];
          if(n > 0 && n !== Infinity) {
            for(let i = 0; i < n; i++) {
              arr.push('');
            }
          }
          this.params.toFill = arr;
        } else {
          this.params.toFill = [];
        }
        if(this.params.minItems <= this.items.length) {
          this.hiddenNav = false;
        }
      },
      next() {
        let nextOffset = this.currentOffset+1;
        if(nextOffset > this.items.length-this.params.minItems) {
          return;
        }
        let offset = -(this.params.itemWidth*nextOffset);
        if(nextOffset === (this.items.length-this.params.minItems)) {
          offset = -(this.params.listWidth-(this.params.innerWidth));
        }

        this.listEl.animate({ marginLeft: offset }, 265);
        this.currentOffset = nextOffset;
      },
      prev() {
          let nextOffset = this.currentOffset-1;
          if(nextOffset < 0) {
            return;
          }
          let offset = -(this.params.itemWidth*nextOffset);
          this.listEl.animate({ marginLeft: offset }, 265);
          this.currentOffset = nextOffset;
      },
      addEvents() {
        //window.addEventListener('resize', this.timeoutRecalculate);
      },
      dropEvents() {
        //window.removeEventListener('resize', this.timeoutRecalculate);
      },
      init() {
        this.el = $('#'+this.id);
        if(!this.el.length) { return; }
        this.recalculateItems();
        console.log('initiating slider');
      },
      timeoutRecalculate() {
        if(this.to) { clearTimeout(this.to); }
        this.to = setTimeout(() => {
          this.recalculateItems();
        }, 200);
      },
    },
    watch: {
      items() {
        this.timeoutRecalculate();
      }
    },
    mounted() {
      this.id = 'carousel-'+window.generateId();
      setTimeout(() => {
        this.init();
      }, 200);
      this.addEvents();
    },
    destroyed() {
      this.dropEvents();
    },
  }
</script>
