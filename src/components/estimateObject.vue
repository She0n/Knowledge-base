<template>
 <div class="parent-object-wrapper" v-if="item.active">
   <div class="parent-object-title">
     <i class="fa fa-tint u-mr-xsmall"></i><span v-html="item.title"></span>
   </div>
   <div v-for="category in item.tree">
     <div v-if="category.active" class="estimate-tree-object-jobs-categories dropdown-parent-container">
       <div class="estimate-tree-object-jobs-categories-title u-relative  trigger" v-on:click="toggleDDTab($event)">
         <i aria-hidden="true" class="fa fa-folder-open-o u-mr-xsmall"></i>
         <span v-html="category.title"></span>
         <i class="fa fa-angle-down estimate-dropdown-toggler" ></i>
       </div>
       <div class="dropdown-child-container">
         <div v-for="job_id in category.selectedJobIds" class="u-float-left u-width-100 parent-job-wrapper-2">
           <jobComponent  :brms="brms" :wrms="wrms" :is_temp="false"  :activeObject="item"  :job="category.jobsByIds[job_id]" :activePriceMode="activePriceMode" ></jobComponent>
         </div>
         <div v-for="fjob in category.foreign_jobs" class="u-float-left u-width-100 parent-job-wrapper-2">
           <jobComponent  :brms="brms" :wrms="wrms" :is_temp="false"  :activeObject="item"  :job="fjob" :activePriceMode="activePriceMode" ></jobComponent>
         </div>
         <div v-for="tjob, tempIndex in category.temp_jobs" class="u-float-left u-width-100 parent-job-wrapper-2">
           <jobComponent :brms="brms" :wrms="wrms" :is_temp="true"  :activeObject="item"  :job="tjob" :activePriceMode="activePriceMode" ></jobComponent>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>
<script>
  import jobComponent from '@/components/jobComponent.vue';
  export default {
    props: ['item', 'activePriceMode', 'wrms', 'brms',],
    data() {
      return {

      };
    },
    methods: {
      toggleDDTab(e) {
        let el = e.target.closest('.dropdown-parent-container');
        if (!el) {
          return;
        }
        $(el).find('.dropdown-child-container').first().slideToggle(200);
      },
    },
    components:  { jobComponent }
  }
</script>
