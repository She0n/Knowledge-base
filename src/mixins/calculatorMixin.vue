<script>
  export default {
    data() {
      return {
        limits: {
          fare: { min: 0, max: 0 },
          discount: { min: 0, max: 0 },
          salary: { min: 0, max: 0 },
          garbage: { min: 0, max: 0 },
          old_object: { min: 0, max: 0 },
          garbage_additional: { min: 0, max: 0 }
        }
      }
    },
    methods: {
      isFieldEmpty(a) {
        if (!a) {
          return 1;
        }
        if (typeof a === 'string') {
          if (!a.trim().length) {
            return 1;
          }
        }
        return 0;
      },
      toggleDDTab(e) {
        let el = e.target.closest('.dropdown-parent-container');
        if (!el) {
          return;
        }
        $(el).find('.dropdown-child-container').first().slideToggle(200);
      },
      calculateJobTotal(opts) {
        let mod = opts.mode ? opts.mode : 'comfort';
        let vol;
        vol  = parseFloat(opts.volume);
        vol = vol ? vol : 0;
        let val = parseInt(vol*opts.job.prices[mod]);
        val = val ? val : 0;
        let res = val;
        if(res < 0) { return 0; }
        return res;
      },
      toVolumePerParent(a) {
        a = toInt(a);
        return a > 1 ? a : 1;
      },
      computeChildVolume(a,b,f) {
        a = parseFloat(a);
        b = parseFloat(b);
        if(!a || !b) {
          return '';
        }
        if(a < 0 || b < 0) { return ''; }
        return f ? b : parseFloat(a*b);
      },
      getJobTitle(job) {
        if(!job.second_title) { return job.title; }
        if(typeof job.second_title !== 'string') { return job.title; }
        return job.second_title.trim().length ? job.second_title : job.title;
      },
      async getLimits() {
        const resp = await $http.get('/calc/get-limits');
        return resp;
      },
      unpackLimits(limits) {
        if(!limits) { return; }
        let keys = ['garbage', 'discount', 'salary', 'fare', 'old_object', 'garbage_additional', 'materials'];
        for(let i = 0; i < keys.length; i++) {
          let k = keys[i];
          if(!limits[k]) { continue; }
          this.limits[k].min = limits[k].min;
          this.limits[k].max = limits[k].max;
          if(limits[k].default) {
            this.limits[k].default = limits[k].default;
          }
        }
      },
      setCategories(a) {
        let b = [
          { id: 0, title: 'Общие работы' },
        ];
        if (!a) { this.categories = b; return; }
        if (!Array.isArray(a)) { this.categories = b; return; }
        this.categories = a;
      }
    }
  }
</script>
