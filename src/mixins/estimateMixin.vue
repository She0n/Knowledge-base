<script>
  const estimateObjectsList = ['job_changes_map', 'disable_map', 'rms_volumes_by_map', 'rms_disable_map', 'rms_changes_map', 'job_volumes_by_map'];
  const purifyFields = ['childs', 'id', 'category_id', 'title', 'hide_in_excel', 'volume_type', 'summ_in_excel', 'active', 'volume', 'prices', 'is_foreign', 'attention'];
  const rmFields = ['title', 'price', 'manufacturer', 'shop', 'comment'];
  const jobMapFields = ['title', 'hide_in_excel'];
  export default {
    data() {
      return {
        limits: {
          fare: { min: 0, max: 0 },
          discount: { min: 0, max: 0 },
          salary: { min: 0, max: 0 },
          garbage: { min: 0, max: 0 },
          old_object: { min: 0, max: 0 },
          garbage_additional: { min: 0, max: 0 },
          materials: { min: 0, max: 0, default: 3 },
        }
      };
    },
    methods: {

      parseJobMap(map) {
        let a = map.split('_');
        let c = a[0];
        a.splice(0, 1);
        return {
          category_id: c,
          items: a,
        };
      },
      iterateToggleJob(job, object, force) {
        force = force ? force : undefined;
        this.toggleJobAction(job, force, object);
        if(job.childObjects) {
          for(let i = 0; i < job.childObjects.length; i++) {
            let child1 = job.childObjects[i];
            this.toggleJobAction(child1, force, object);
            if(child1.childObjects) {
              for(let j = 0; j < child1.childObjects.length; j++) {
                let child2 = child1.childObjects[j];
                this.toggleJobAction(child2, force, object);
              }
            }
          }
        }
      },
      toggleJobAction(job, force, object) {
        job.off = force;
        if(job.off) {
          object.disable_map[job.map] = true;
        } else {
          delete object.disable_map[job.map];
        }
        for(let i = 0; i < job.rms.length; i++) {
          job.rms[i].off =job.off;
        }
        for(let i = 0; i < job.temp_rms.length; i++) {
          job.temp_rms[i].off = job.off;
        }
      },
      forceObject (a, k) { if(!a[k] || (typeof a[k] !== 'object')) { a[k] = {}; } },
      forceMinMaxRange(opts) {
        opts.val = parseInt(opts.val);
        opts.val = !isNaN(opts.val) ? opts.val : 0;
        opts.val = opts.val < opts.min ? (opts.def ? opts.def : opts.min) : opts.val;
        opts.val = opts.val > opts.max ? (opts.def ? opts.def : opts.max) : opts.val;
        return opts.val;
      },
      extractRoughMaterials(objects, target) {
        target.rmsByIds = {};
        if (!Array.isArray(objects)) {
          target.rough_materials = [];
          return;
        }
        target.rough_materials = objects;
        for (let i = 0; i < target.rough_materials.length; i++) {
          let rm = target.rough_materials[i];
          if(rm.material_type !== 'white') { rm.material_type = 'black'; }
          target.rmsByIds[target.rough_materials[i].id] = rm;
        }
      },
      setCategories(cats, target) {
        if (!Array.isArray(cats)) { target.categories = []; return; }
        target.categories = cats;
      },
      setJobs(jobs, target) {
        target.jobsByIds = {};
        if (!Array.isArray(jobs)) { target.jobs = []; return; }
        for (let i = 0; i < jobs.length; i++) {
          jobs[i].active = 0;
          jobs[i].volume = '';
          if(!Array.isArray(jobs[i].childs)) { jobs[i].childs = []; }
          jobs[i].category_id = toInt(jobs[i].category_id);
          jobs[i].is_foreign = false;
          target.jobsByIds[jobs[i].id] = jobs[i];
        }
        target.jobs = jobs;
      },
      parseIncomingEstimate(estimate, target) {
        this.forceObject(estimate, 'object_jobs');
        let fields = ['object_jobs', 'estimate_id', 'address', 'object_type', 'building_type', 'client', 'phone'];
        for(let i = 0; i < fields.length; i++) {
          target[fields[i]] = estimate[fields[i]];
        }
        target.activePriceMode = estimate.price_mode ? estimate.price_mode : 'comfort';
        // set a_data
        this.extractRoughMaterials(estimate.a_rough_materials, estimate);
        this.setCategories(estimate.a_categories, estimate);
        this.setJobs(estimate.a_jobs, estimate);
        for (let i = 0; i < estimate.objects_list.length; i++) {
          this.fullHandleObject({
            object: estimate.objects_list[i],
            a_categories: estimate.a_categories,
            a_jobs: estimate.a_jobs,
            estimate: estimate
          });
        }
        this.fullHandleObject({
          object: estimate.object_jobs,
          a_categories: estimate.a_categories,
          a_jobs: estimate.a_jobs,
          estimate: estimate
        });
        target.garbage_removal = this.forceMinMaxRange({
          val: estimate.garbage_removal,
          min: this.limits.garbage.min,
          max: this.limits.garbage.max,
          target: estimate
        });
        target.fare = this.forceMinMaxRange({
          val: estimate.fare,
          min: this.limits.fare.min,
          max: this.limits.fare.max,
          target: estimate
        });
        target.salary_percent = this.forceMinMaxRange({
          val: estimate.salary_percent,
          min: this.limits.salary.min,
          max: this.limits.salary.max,
          target: estimate
        });
        target.discount = this.forceMinMaxRange({
          val: estimate.discount,
          min: this.limits.discount.min,
          max: this.limits.discount.max,
          target: estimate
        });
        target.materials = this.forceMinMaxRange({
          val: estimate.materials,
          min: this.limits.materials.min,
          max: this.limits.materials.max,
          def: this.limits.materials.default,
          target: estimate.target
        });
        target.calculated = true;
      },
      fullHandleObject(opts) {
        for(let i = 0; i < estimateObjectsList.length; i++) {
          this.forceObject(opts.object, estimateObjectsList[i]);
        }
        opts.object.active = true; // todo false
        opts.object.tree = this.buildBaseJobsTree({
          cats: opts.a_categories,
          jobs: opts.a_jobs,
          job_changes_map: opts.object.job_changes_map,
          estimate: opts.estimate
        });
        opts.object.treeByIds = this.makeTreeByIds(opts.object.tree);
        this.syncJobChangesMapWithObject(opts.object, opts.estimate);
        this.syncIncomingObjectChanges(opts.object, opts.estimate);
        this.activateObjectJobs(opts.object, opts.object.jobs, opts.estimate);
        this.disableObjectJobsByMap(opts.object);
        this.handleObjectTempJobs(opts.object);
      },
      activateObjectJobs(object, base, estimate) {
        base = Array.isArray(base) ? base : [];
        let jobsByIds = {};
        for(let j = 0; j < object.tree.length; j++) {
          for(let jj = 0; jj < object.tree[j].jobs.length; jj++) {
            let job = object.tree[j].jobs[jj];
            jobsByIds[job.id] = job;
          }
        }
        for(let i = 0; i < base.length; i++) {
          if(!jobsByIds[base[i].job_id]) { base.splice(i, 1); i--; continue; }
          jobsByIds[base[i].job_id].volume = base[i].volume;
          this.addJobToPriceListSimple({ job: jobsByIds[base[i].job_id], object: object, estimate: estimate });
        }
      },
      addJobToPriceListSimple(opts) {
        let object = opts.object;
        let job = opts.job;
        if(job.active) { return; }
        job.active = 1;
        job.off = false;
        object.treeByIds[opts.estimate.jobsByIds[job.id].category_id].selectedJobIds.push(job.id);
        for(let i = 0; i < job.childObjects.length; i++) {
          let child1 = job.childObjects[i];
          if(child1.is_foreign) {
            if(object.treeByIds[opts.estimate.jobsByIds[child1.id].category_id]) {
              object.treeByIds[opts.estimate.jobsByIds[child1.id].category_id].foreign_jobs.push(child1);
            }
          }
          for(let ii = 0; ii < child1.childObjects.length; ii++) {
            let child2 = child1.childObjects[ii];
            if(child2.is_foreign) {
              if(object.treeByIds[opts.estimate.jobsByIds[child2.id].category_id]) {
                object.treeByIds[opts.estimate.jobsByIds[child2.id].category_id].foreign_jobs.push(child2);
              }
            }
          }
        }
      },
      handleObjectTempJobs(object) {
        this.forceArray(object, 'temp_jobs');
        for(let i = 0; i < object.temp_jobs.length; i++) {
          let j = object.temp_jobs[i];
          this.reformatJobRms(j);
          if(!object.treeByIds[j.category_id]) {
            object.treeByIds[0].temp_jobs.push(j);
          } else {
            object.treeByIds[j.category_id].temp_jobs.push(j);
          }
        }
      },
      forceArray(a, b) {
        if(!Array.isArray(a[b])) { a[b] = []; }
      },
      reformatJobRms(job) {
        job.rms = Array.isArray(job.rms) ? job.rms : [];
        job.temp_rms = Array.isArray(job.temp_rms) ? job.temp_rms : [];
        for(let i = 0; i < job.temp_rms.length; i++) {
          let rm = job.temp_rms[i];
          rm.volume = typeof rm.volume !== 'undefined' ? rm.volume : '';
          rm.computedTotal = 0;
          rm.off = Boolean(rm.off);
        }
      },
      disableObjectJobsByMap(object) {
        for(let prop in object.disable_map) {
          if(!object.disable_map[prop]) { continue; }
          let job = this.getJobByMap(prop, object);
          if(!job) {
            continue;
          }
          this.iterateToggleJob(job, object, true);
        }
      },
      syncIncomingObjectChanges(object, estimate) {
        for(let prop in object.job_volumes_by_map) {
          let job = this.getJobByMap(prop, object);
          if(!job) { continue; }
          job.volume = object.job_volumes_by_map[prop];
        }
        for(let prop in object.rms_changes_map) {
          let data = this.getRmByMap(prop, object);
          if(!data) { continue; }
          for(let prop2 in object.rms_changes_map[prop]) {
            data.rm[prop2] = object.rms_changes_map[prop][prop2];
          }
          if(!this.isDefaultRm(data.rm, estimate)) {
            data.rm.altered = true;
          }
        }
        for(let prop in object.rms_disable_map) {
          let data = this.getRmByMap(prop, object);
          if(!data) { continue; }
          data.rm.off = true;
        }
        for(let prop in object.temp_rms_by_job_map) {
          let temp_rms = object.temp_rms_by_job_map[prop];
          if(!Array.isArray(temp_rms)) { continue; }
          let job = this.getJobByMap(prop, object);
          if(!job) { continue; }
          for(let r = 0; r < temp_rms.length; r++) {
            temp_rms[r].off = Boolean(temp_rms[r].off);
            temp_rms[r].computedTotal = 0;
            temp_rms[r].mathVolume = 0;
            temp_rms[r].volume = temp_rms[r].volumeLock ? temp_rms[r].volume : 0;
            job.temp_rms.push(temp_rms[r]);
          }
        }
      },
      parseRmMap(map) {
        let a = map.split('_');
        let c = a[0];
        let d = a[a.length-1];
        a.splice(0, 1);
        a.splice(a.length-1, 1);
        return {
          category_id: c,
          items: a,
          rm_index: d
        };
      },
      getJobByMap(map, object) {
        let mapData = this.parseJobMap(map);
        return this.getJobByMapData(mapData, object);
      },
      getJobByMapData(mapData, object) {
        let cat = object.treeByIds[mapData.category_id];
        if(!cat) { return 0; }
        let job = cat.jobsByIds[mapData.items[0]];
        if(mapData.items.length === 1) { return job ? job : false; }
        let job2 = job.childObjects[mapData.items[1]];
        if(mapData.items.length === 2) { return job2 ? job2 : false; }
        let job3 = job2.childObjects[mapData.items[2]];
        if(mapData.items.length === 3) { return job3 ? job3 : false; }
        return false;
      },
      getRmByMap(map, object) {
        let mapData = this.parseRmMap(map);
        let job = this.getJobByMapData(mapData, object);
        if(!job) { return false; }
        if(!job.rms) { return false; }
        return job.rms[mapData.rm_index] ? { job: job, rm: job.rms[mapData.rm_index] } : false;
      },
      isDefaultJob(source, target) {
        for(let i = 0; i < jobMapFields.length; i++){
          let f = jobMapFields[i];
          if(source[f] != target[f]) {
            return 0;
          }
        }
        if(target.level && !target.volumeLock) { return 0; }
        for(let prop in source.prices){
          let a = parseFloat(source.prices[prop]);
          let b = parseFloat(target.prices[prop]);
          a = !a ? 0 : a;
          b = !b ? 0 : b;
          if(a != b) { return 0; }
        }
        return 1;
      },
      isDefaultRm(rm, estimate) {
        if(!rm.volumeLock) { return 0; }
        if(rm.volume_per_unit != rm.default_volume_per_unit) { return 0; }
        for(let i = 0; i < rmFields.length; i++) {
          if(rm[rmFields[i]] != estimate.rmsByIds[rm.id][rmFields[i]]) {
            if(typeof rm[rmFields[i]] === 'string' && !rm[rmFields[i]].length && !estimate.rmsByIds[rm.id][rmFields[i]]) {
              continue;
            }
            return 0;
          }
        }
        return 1;
      },
      syncJobChangesMapWithObject(object, estimate) {
        for(let prop in object.job_changes_map) {
          if(!object.job_changes_map[prop]) { continue; }
          let mjob = this.getJobByMap(prop, object);

          let rjob = object.job_changes_map[prop];
          mjob.title = object.job_changes_map[prop].title;
          for(let priceIndex in object.job_changes_map[prop].prices) {
            let price = parseInt(object.job_changes_map[prop].prices[priceIndex]);
            mjob.prices[priceIndex] = isNaN(price) ? '' : price;
          }
          mjob.hide_in_excel = object.job_changes_map[prop].hide_in_excel;
          mjob.volumeLock = Boolean(object.job_changes_map[prop].volumeLock);
          if(this.isDefaultJob(estimate.jobsByIds[mjob.id], {
              title: rjob.title, prices: JSON.parse(JSON.stringify(rjob.prices)), hide_in_excel: rjob.hide_in_excel, volumeLock: Boolean(rjob.volumeLock), level: mjob.level
            })) {
            mjob.altered = false;
            delete object.job_changes_map[prop];// = false;
          } else {
            mjob.altered = true;
          }
        }
      },
      makeTreeByIds(tree) {
        let result = {};
        for(let i = 0; i < tree.length; i++) {
          result[tree[i].id] = tree[i];
        }
        return result;
      },
      purifyJob(jobId, estimate) {
        let job = {};
        for(let i = 0; i < purifyFields.length; i++) {
          let f = estimate.jobsByIds[jobId][purifyFields[i]];
          job[purifyFields[i]] = (typeof f === 'object' && f) ? JSON.parse(JSON.stringify(f)) : f;
        }
        job.rough_materials = Array.isArray(estimate.jobsByIds[jobId].rough_materials) ? JSON.parse(JSON.stringify(estimate.jobsByIds[jobId].rough_materials)) : [];
        job.rms = [];
        job.mathVolume = 0;
        job.computedTotal = 0;
        for(let i = 0; i < job.rough_materials.length; i++) {
          if(!estimate.rmsByIds[job.rough_materials[i].id]) { job.rough_materials.splice(i, 1); i--; continue; }
          let rm = {
            id: job.rough_materials[i].id,
            volume_per_unit: job.rough_materials[i].volume_per_unit,
            default_volume_per_unit: job.rough_materials[i].volume_per_unit,
            title: estimate.rmsByIds[job.rough_materials[i].id].title,
            price: estimate.rmsByIds[job.rough_materials[i].id].price,
            volume: '',
            volumeLock: true,
            off: false,
            computedTotal: '',
            altered: false,
            material_type: estimate.rmsByIds[job.rough_materials[i].id].material_type === 'white' ? 'white' : 'black'
          };
          job.rms.push(rm);
          job.temp_rms = [];
        }
        return job;
      },
      buildBaseJobsTree(opts) {
        let cats = opts.cats;
        let jobs = opts.jobs;
        opts.job_changes_map = (typeof job_changes_map === 'object' && job_changes_map) ? job_changes_map : {};
        let job_changes_map = opts.job_changes_map;
        let aCategoriesByIds = {};
        let newCategories = [];
        for (let i = 0; i < cats.length; i++) {
          newCategories.push(JSON.parse(JSON.stringify(cats[i])));
        }
        for (let i = 0; i < newCategories.length; i++) {
          aCategoriesByIds[newCategories[i].id] = newCategories[i];
          let cat = aCategoriesByIds[newCategories[i].id];
          cat.jobs = [];
          cat.jobsByIds = {};
          cat.foreign_jobs = [];
          cat.temp_jobs = [];
          cat.selectedJobIds = [];
          cat.active = true; // todo false
        }
        let newJobs = [];
        for(let i = 0; i < jobs.length; i++) {
          let job = this.purifyJob(jobs[i].id, opts.estimate);
          job.altered = false;
          job.volumeLock = true;
          newJobs.push(job);
        }
        for (let i = 0; i < newJobs.length; i++) {
          if (!aCategoriesByIds[opts.estimate.jobsByIds[newJobs[i].id].category_id]) { continue; } // job category doesn't exist
          if(opts.estimate.jobsByIds[newJobs[i].id].job_type !== 'white') { continue; } // fill tree with only white jobs
          let newJob = JSON.parse(JSON.stringify(newJobs[i]));
          newJob.map = opts.estimate.jobsByIds[newJob.id].category_id+'_'+newJob.id;
          newJob.childs = Array.isArray(newJob.childs) ? newJob.childs : [];
          newJob.childObjects = [];
          newJob.volumeLock = false;
          for(let ii = 0; ii < newJob.childs.length; ii++) {
            if(!opts.estimate.jobsByIds[newJob.childs[ii].id]) { newJob.childs.splice(ii, 1); ii--; continue; }
            let newChild = this.purifyJob(newJob.childs[ii].id, opts.estimate);
            newChild.computedVolume = 0;
            newChild.computedTotal = 0;
            newChild.volumeLock = true;
            if(opts.estimate.jobsByIds[newChild.id].category_id && (opts.estimate.jobsByIds[newChild.id].category_id !== opts.estimate.jobsByIds[newJob.id].category_id)) {
              newChild.links = [newJobs[i].id];
              newChild.is_foreign = true;
            }
            newChild.off = false;
            newChild.map = newJob.map+'_'+ii;
            newChild.level = 2;
            newChild.childObjects = [];
            newChild.volume_per_parent = newJob.childs[ii].volume ? newJob.childs[ii].volume : 1;
            for(let j = 0; j < newChild.childs.length; j++) {
              let newChild2 = this.purifyJob(newChild.childs[j].id, opts.estimate);
              newChild2.computedVolume = 0;
              newChild2.computedTotal = 0;
              newChild2.volume_per_parent = newChild.childs[j].volume ? newChild.childs[j].volume : 1;
              newChild2.is_fixed = newChild.childs[j].is_fixed;
              newChild2.level = 3;
              newChild2.off = false;
              newChild2.volumeLock = true;
              newChild2.map = newChild.map+'_'+j;
              if(opts.estimate.jobsByIds[newChild2.id].category_id && (opts.estimate.jobsByIds[newChild2.id].category_id !== opts.estimate.jobsByIds[newChild.id].category_id)) {
                newChild2.is_foreign = true;
              }
              if(newChild2.is_foreign || newChild.is_foreign) {
                newChild2.links = [jobs[i].id, ii];
              }

              newChild.childObjects.push(newChild2);

            }
            newJob.childObjects.push(newChild);
          }
          aCategoriesByIds[opts.estimate.jobsByIds[newJob.id].category_id].jobs.push(newJob);
          this.mapJobRms(newJob);
        }
        for(let i = 0; i < newCategories.length; i++) {
          let cat = newCategories[i];
          for(let j = 0; j < cat.jobs.length; j++) {
            cat.jobsByIds[cat.jobs[j].id] = cat.jobs[j];
          }
        }
        return newCategories;
      },
      mapJobRms(job) {
        for(let i = 0; i < job.rms.length; i++) {
          job.rms[i].map = job.map+'_'+i;
        }
        job.temp_rms = Array.isArray(job.temp_rms) ? job.temp_rms : [];
        if(!job.childObjects) { return; }
        if(!job.childObjects.length) { return; }
        for(let i = 0; i < job.childObjects.length; i++) {
          this.mapJobRms(job.childObjects[i]);
        }
      },
      iterateRecalcRms(job, vol, opts) {
        for(let r = 0; r < job.rms.length; r++) {
          let rm = job.rms[r];
          this.iterateRecalcRm(rm, vol);
          if(rm.off || job.off) {
           continue;
          }
          opts.rmTotal += rm.computedTotal;
          if(rm.material_type === 'white') {
            opts.wrmTotal += rm.computedTotal;
          } else {
            opts.brmTotal += rm.computedTotal;
          }
        }
        for(let r = 0; r < job.temp_rms.length; r++) {
          let rm = job.temp_rms[r];
          this.iterateRecalcRm(rm, vol);
          if(rm.off || job.off) {
            continue;
          }
          opts.rmTotal += rm.computedTotal;
          if(rm.material_type === 'white') {
            opts.wrmTotal += rm.computedTotal;
          } else {
            opts.brmTotal += rm.computedTotal;
          }
        }
      },
      iterateRecalcRm(rm, vol) {
        let mathRmVolume;
        if(rm.volumeLock) {
          if(vol) {
            mathRmVolume = this.toFixed(rm.volume_per_unit*vol);
            rm.volume = mathRmVolume;
          } else {
            rm.volume = '';
          }
        }  else {
          mathRmVolume = this.toFixed(rm.volume);
        }
        rm.mathVolume = mathRmVolume;

        rm.computedTotal = parseInt((mathRmVolume*rm.price));
      },
      iterateRecalcObject(object, opts) {
        let db = object.title === 'Кухня-Балкон';
        object.totals = this.getClearTotals();
        for (let j = 0; j < object.tree.length; j++) {
          let cat = object.tree[j];
          for (let l = 0; l < cat.jobs.length; l++) {
            let job = cat.jobs[l];
            if (!job.active) { continue; }
            job.mathVolume = this.toFixed(job.volume);
            job.computedTotal = this.calculateJobTotal({
              volume: job.volume,
              job: job,
              mode: opts.estimate.price_mode
            });
            opts.jobTotal += job.computedTotal;
            object.totals.jobs += job.computedTotal;
            this.iterateRecalcRms(job, job.mathVolume, opts);
            for (let i = 0; i < job.childObjects.length; i++) {
              let childJob = job.childObjects[i];
              if(childJob.volumeLock) {
                childJob.volume = this.computeChildVolume(job.volume, childJob.volume_per_parent, job.childs[i].is_fixed);
                childJob.mathVolume = childJob.volume;
              } else {
                childJob.mathVolume = this.toFixed(childJob.volume);
              }
              childJob.computedTotal = this.calculateJobTotal({
                volume: childJob.mathVolume,
                job: childJob,
                mode: opts.estimate.price_mode
              });

              this.iterateRecalcRms(childJob, childJob.mathVolume, opts);
              if(!childJob.off) {
                opts.jobTotal += childJob.computedTotal;
                object.totals.jobs += childJob.computedTotal;
              }

              if (childJob.childObjects.length) {
                for (let j = 0; j < childJob.childObjects.length; j++) {
                  let child2Job = childJob.childObjects[j];
                  if(child2Job.volumeLock) {
                    child2Job.volume = this.computeChildVolume(childJob.volume, child2Job.volume_per_parent, child2Job.is_fixed);
                    child2Job.mathVolume = child2Job.volume;
                  } else {
                    child2Job.mathVolume = this.toFixed(child2Job.volume);
                  }
                  if(childJob.off && !child2Job.off) {
                    this.toggleJobAction(child2Job, true, object);
                  }
                  this.iterateRecalcRms(child2Job, child2Job.volume, opts);
                  child2Job.computedTotal = this.calculateJobTotal({
                    volume: child2Job.mathVolume,
                    job: child2Job,
                    mode: opts.estimate.price_mode,
                  });
                  if(!child2Job.off) {
                    opts.jobTotal += child2Job.computedTotal;
                    object.totals.jobs += child2Job.computedTotal;
                  }
                }
              }
            }
          }
          for(let l = 0; l < cat.temp_jobs.length; l++) {
            let tjob = cat.temp_jobs[l];
            tjob.mathVolume = this.toFixed(tjob.volume);
            tjob.computedTotal = this.calculateJobTotal({
              volume: tjob.mathVolume,
              job: tjob,
              mode: opts.estimate.price_mode
            });
            this.iterateRecalcRms(tjob, tjob.mathVolume, opts, tjob.category_id);
            opts.jobTotal += tjob.computedTotal;
            object.totals.jobs += tjob.computedTotal;
          }
        }
      },
      computeChildVolume(a,b,f) {
        a = parseFloat(a);
        b = parseFloat(b);
        if(!a || !b) {
          return '';
        }
        if(a < 0 || b < 0) { return ''; }
        return this.toFixed(f ? b : parseFloat(a*b));
      },
      toFixed(a, b = 2) {
        a = parseFloat(a);
        let c = a.toString().split('.');
        if(!c[1]) { return a; }
        if(c[1].toString().length < b) { return a; }
        return parseFloat(c[0]+'.'+(c[1].substr(0, 2)));
      },
      recalculateCosts(estimate) {
        if(!estimate.estimate_id) { return 0; }
        if (!estimate.objects_list) { return 0; }
        let opts = {
          jobTotal: 0,
          rmTotal: 0,
          wrmTotal: 0,
          brmTotal: 0,
          estimate: estimate,
        };
        this.iterateRecalcObject(estimate.object_jobs, opts);
        for (let i = 0; i < estimate.objects_list.length; i++) {
          this.iterateRecalcObject(estimate.objects_list[i], opts);
        }
        /*
        jobsBase: 0,
          jobs: 0,
          garbage: 0,
          fare: 0,
          materials: 0,
          wrms: 0,
          brms: 0,
          rms: 0,
          discount: 0,
          final_price: 0,
         */
        estimate.totals.jobsBase = opts.jobTotal;
        estimate.totals.jobs = estimate.discount ? parseInt(opts.jobTotal / 100 * (100 - estimate.discount)) : opts.jobTotal;
        estimate.totals.garbage = parseInt(estimate.totals.jobs/100*estimate.garbage_removal);
        estimate.totals.fare = parseInt(estimate.totals.jobsBase/100*estimate.fare);
        estimate.totals.materials = parseInt(estimate.totals.jobsBase/100*estimate.materials);
        opts.rmTotal = parseInt(opts.rmTotal);
        estimate.totals.rms = opts.rmTotal;
        estimate.totals.wrms = opts.wrmTotal;
        estimate.totals.brms = opts.brmTotal;
        estimate.totals.base_price = (opts.jobTotal + opts.rmTotal);
        return estimate.totals.final_price = (estimate.totals.jobs + opts.rmTotal + estimate.totals.fare + estimate.totals.garbage + estimate.totals.materials);
      },
    }
  }
</script>
