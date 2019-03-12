<script>
  export default {
    methods: {
      renderRmTail(rm){
        if(!rm.price) { return ''; }
        let vt = this.$store.state.roughMaterialVolumeTypes[rm.volume_type] ? this.$store.state.roughMaterialVolumeTypes[rm.volume_type].title : this.$store.state.roughMaterialVolumeTypes.item.title;
        return rm.price.toLocaleString() + ' р. / <span class="est-col-vol-title">' + vt + '</span>';
      },
      renderSimpleJobTail(job) {
        let mode = this.activePriceMode ? this.activePriceMode : 'comfort';
        let price = parseInt(job.prices[mode]);
        let priceTitle;
        if(!price) {
          if(job.dynamic_price) {
            priceTitle = 'дог.';
          } else {
            return '';
          }
        }
        priceTitle = priceTitle ? priceTitle : price.toLocaleString() + ' р.';
        return priceTitle + this.renderHalfJobTail(job);
      },
      renderHalfJobTail(job) {
        let itemLength = this.$store.state.volumeTypes[job.volume_type] ? this.$store.state.volumeTypes[job.volume_type] : false;
        let itemTitle;
        if (!itemLength) {
          let keys = Object.keys(this.$store.state.volumeTypes);
          if (keys.length) {
            itemTitle = this.$store.state.volumeTypes[keys[0]] ? this.$store.state.volumeTypes[keys[0]].title : '';
          }
        } else {
          itemTitle = this.$store.state.volumeTypes[job.volume_type].title;
        }
        return ' / <span class="est-col-vol-title">' + itemTitle + '</span>';
      },
      renderFinishJobTail(job) {
        let itemLength = this.$store.state.volumeTypes[job.volume_type] ? this.$store.state.volumeTypes[job.volume_type] : false;
        let itemTitle;
        if (!itemLength) {
          let keys = Object.keys(this.$store.state.volumeTypes);
          if (keys.length) {
            itemTitle = this.$store.state.volumeTypes[keys[0]] ? this.$store.state.volumeTypes[keys[0]].title : '';
          }
        } else {
          itemTitle = this.$store.state.volumeTypes[job.volume_type].title;
        }
        let mode = this.activePriceMode ? this.activePriceMode : 'comfort';
        let price = job.prices[mode];
        price = price ? price : job.computedPrice;
        if(!price) { return ''; }
        let priceTitle = price.toLocaleString();
        return priceTitle + ' р.' + ' / <span class="est-col-vol-title">' + itemTitle + '</span>';
      },
      renderVolumeType(vt) {
        return this.$store.state.volumeTypes[vt] ? this.$store.state.volumeTypes[vt].title : ''
      },
      renderJobTypePostfix(job) {
        return '('+(job.job_type === 'black' ? 'черновая работа' : 'финишная работа')+')';
      },
      renderJobTypePostfixClass(job) {
        return ' ' + (job.job_type === 'black' ? 'u-text-mute' : 'u-color-success');
      },
      renderRmVolumeType(rm ,vol) {
        let val = typeof vol !== 'undefined' ? vol : rm.volume_per_unit;
        let vt = this.$store.state.roughMaterialVolumeTypes[rm.volume_type];
        if(vt) { return window.rusificate(val, vt.forms[0], vt.forms[1], vt.forms[2]); }
        return '';
      },
      renderLocaleString(a,b ) {
        if(isNaN(a)) { return ''; }
        return a.toLocaleString() + (b ? b : '');
      },
      renderJobTotal(opts) {
        // vol, job, mode, volume_per_parent
        let mod = opts.mode ? opts.mode : 'comfort';
        // opts.volume, opts.job, mod, opts.volume_per_parent
        let val = this.calculateJobTotal({
          volume: opts.volume,
          job: opts.job,
          mode: mod,
          is_fixed: opts.is_fixed,
          volume_per_parent: opts.volume_per_parent
        });
        if(!val) { return ''; }
        return val.toLocaleString() + ' р.';
      },
    }
  }
</script>
