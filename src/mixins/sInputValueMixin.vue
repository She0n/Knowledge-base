<script>
  export default {
    data() {
      return {
        multiple: false,
        hasUpload: false,
        process: false
      }
    },
    methods: {
      handleFileFieldClick() {
        if(this.field.type === 'photo') {
          if(this.realValue) {
            this.setGalleryItem();
          } else {
            this.selectSingleImage();
          }
          return;
        }
        if(this.field.type === 'photogallery') {
          if(this.realValue.length) {
            this.setGalleryPhoto();
          } else {
            this.selectPhotoGallery();
          }
          return;
        }
        if(this.field.type === 'audio') {
          if(this.realValue) {
            this.setGalleryAudio();
          } else {
            this.selectSingleAudio();
          }
          return;
        }
        if(this.field.type === 'audiogallery') {
          if(this.realValue.length) {
            this.setGalleryAudio();
          } else {
            this.selectAudioGallery();
          }
        }
        // field.type === 'video'
        if(this.field.type === 'videogallery') {
          if(this.realValue.length) {
            this.setGalleryVideo();
          } else {
            this.selectVideoGallery();
          }
        }
      },
      fileFieldIconValue() {
        let ico = 'fa-refresh fa-spin cursor-default';
        if(!this.process) {
          if(this.field.type.indexOf('audio') !== -1) { ico = 'fa-file-volume-up'; }
          if(this.field.type.indexOf('video') !== -1) { ico = 'fa-file-video-o'; }
          if(this.field.type.indexOf('photo') !== -1) { ico = 'fa-file-image-o'; }
        }
        let isEmpty = (this.multiple ? !this.value.length : !this.value); // просмотреть
        let title = !isEmpty ? 'просмотреть' : 'загрузить';
        return '<span class="trigger '+(!isEmpty ? 'd-text-dark': '')+'">'+title+' <i class="d-ml-6 '+ico+' fa d-input-val-ico '+(!isEmpty ? 'active' : '')+'"></i></span>';
      },
      init() {
        this.hasUpload = ['photo', 'photogallery', 'video', 'videogallery', 'audio'].indexOf(this.field.type) !== -1;
        if(this.hasUpload) {
          if(this.field.type.indexOf('photo') !== -1) {
            this.acceptance = window.Uploader.images;
          }
          if(this.field.type.indexOf('video') !== -1) {
            this.acceptance = window.Uploader.video;
          }
          if(this.field.type.indexOf('audio') !== -1) {
            this.acceptance = window.Uploader.audio;
          }
        }
        if(this.field.type === 'responsible_user') {
          if(typeof this.value !== 'object' || !this.value) {
            this.realValue = {};
            return;
          }
        }
        if(this.field.type.indexOf('gallery') !== -1) {
          this.multiple = true;
          if(!Array.isArray(this.value)) {
            this.realValue = [];
            return;
          }
        }
      },
      setGalleryAudio() {
        let opts = {
          multiple: false,
          allowEdit: true,
          deleteCallback: this.deleteCallback,
          addCallback: this.addCallback,
          items: []
        };
        if(this.field.type === 'audio') {
          opts.items = [{
            value: this.realValue,
            type: 'audio',
            fullpath: window.config.serverLink+(this.field.path ? this.field.path : '') + '/'+this.realValue
          }];
        } else {
          opts.items = this.collectGalleryItems();
        }
        this.$store.dispatch('callGallery', opts);
      },
      selectAudioGallery() {
        if(this.process) { return; }
        let uploadFile = $(this.$refs.uploadFileRef);
        uploadFile.off('change.callback');
        uploadFile.on('change.callback', this.audioUploadCallback);
        $(this.$refs.uploadFileRef).trigger('click');
      },
      selectSingleAudio() {
        if(this.process) { return; }
        let uploadFile = $(this.$refs.uploadFileRef);
        uploadFile.off('change.callback');
        uploadFile.on('change.callback', this.audioUploadCallback);
        $(this.$refs.uploadFileRef).trigger('click');
      },
      renderImage(img) {
        return window.image(img);
      },
      setGalleryItem() {
        let opts = {
          allowEdit: typeof this.access !== 'undefined' ? this.access : true,
          multiple: false,
          deleteCallback: typeof this.access !== 'undefined' ? (this.access ? this.deleteCallback : () => {}) : this.deleteCallback,
          addCallback: typeof this.access !== 'undefined' ? (this.access ? this.addCallback : () => {}) : this.addCallback,
          items: [{
            value: this.realValue,
            type: 'photo',
            fullpath: this.renderImage((this.field.path ? this.field.path : '') + '/'+this.realValue)
          }]
        };
        this.$store.dispatch('callGallery', opts);
      },
      async videoUploadCallback(opts) {
        opts = opts ? opts : {};
        this.process = true;
        let form = $(this.$refs.uploadFormRef);
        if (!form.length) { return; }
        let formData = new FormData(form[0]);
        let resp = await $http.post('/api/files/upload-video', formData, { file: true });
        this.process = false;
        if(resp && resp.result) {
          if(this.field.type === 'video') {
            this.realValue= response.data.files[0].filename;
            // window.toastr.success('Видео загружено');
          } else {
            let vals = [];
            for(let i = 0; i < response.data.files.length; i++) {
              vals.push(response.data.files[i].filename);
            }
            this.realValue = this.realValue.concat(vals);
            // window.toastr.success('Видео загружено');
          }
          if(opts.success) {
            opts.success();
          }
        } else {
          this.alert({
            title: resp.display
          });
        }
      },
      async audioUploadCallback(opts) {
        opts = opts ? opts : {};
        this.process = true;
        let form = $(this.$refs.uploadFormRef);
        if (!form.length) { return; }
        let formData = new FormData(form[0]);
        let resp = await $http.post('/api/files/upload-audio', formData, { file: true });
        this.process = false;
        if(resp && resp.result) {
          if(this.field.type === 'audio') {
            this.realValue= resp.files[0].filename;
          } else {
            let vals = [];
            for(let i = 0; i < resp.files.length; i++) {
              vals.push(resp.files[i].filename);
            }
            this.realValue = this.realValue.concat(vals);
          }
          // window.toastr.success('Аудиозапись загружена');
          if(opts.success) {
            opts.success();
          }
        } else {
          this.alert({
            title: resp.display
          });
        }

      },
      async photoUploadCallback(opts) {
        opts = opts ? opts : {};
        this.process = true;
        let form = $(this.$refs.uploadFormRef);
        if (!form.length) { return; }
        let formData = new FormData(form[0]);
        let resp = await $http.post('/api/files/upload-photo', formData, { file: true });
        this.process = false;
        if(resp && resp.result) {
          if(this.field.type === 'photo') {
            this.realValue= resp.files[0].filename;
          } else {
            let vals = [];
            for(let i = 0; i < resp.files.length; i++) {
              vals.push(resp.files[i].filename);
            }
            this.realValue = this.realValue.concat(vals);
          }
          // window.toastr.success('Изображение загружено');
          if(opts.success) {
            opts.success();
          }
        } else {
          this.alert({
            title: resp.display
          });
        }

      },
      addCallback() {
        let isGallery = this.field.type.indexOf('gallery') !== -1;
        if(!isGallery) {
          if(this.field.type.indexOf('photo') !== -1) {
            this.selectSingleImage({ success: this.refreshGallery });
          }
          if(this.field.type.indexOf('video') !== -1) {
            // this.selectVideoGallery(); todo add single video
          }
          if(this.field.type.indexOf('audio') !== -1) {
            this.selectSingleAudio({ success: this.refreshGallery });
          }
          return;
        }
        if(this.field.type.indexOf('audio') !== -1) {
          this.selectAudioGallery({ success: this.refreshGallery });
        }
        if(this.field.type.indexOf('photo') !== -1) {
          this.selectPhotoGallery({ success: this.refreshGallery });
        }
        if(this.field.type.indexOf('video') !== -1) {
          this.selectVideoGallery({ success: this.refreshGallery });
        }

      },
      refreshGallery() {
        this.$store.commit('setGalleryOpts', {
          items: this.collectGalleryItems(),
          activeIndex: this.realValue.length-1,
          addCallback: this.addCallback,
          deleteCallback: this.deleteCallback,
          isActive: this.realValue.length
        });
      },
      deleteCallback() {
        let isGallery = this.field.type.indexOf('gallery') !== -1;
        // if gallery
        if(isGallery) {
          for(let i = 0; i < this.realValue.length; i++) {
            let row = this.realValue[i];
            if(row !== this.$store.state.gallery.items[this.$store.state.gallery.activeIndex].value) {
              continue;
            }
            this.realValue.splice(i, 1);
            let newIndex = this.$store.state.gallery.activeIndex-1;
            newIndex = newIndex < 0 ? 0 : newIndex;
            this.$store.commit('setGalleryOpts', {
              items: this.collectGalleryItems(),
              activeIndex: newIndex,
              addCallback: this.addCallback,
              deleteCallback: this.deleteCallback,
              isActive: this.realValue.length
            });
            break;
          }
        }
        if(!isGallery) {
          this.$store.commit('setGalleryOpts', {
            items: [],
            activeIndex: -1,
          });
          this.realValue = '';
          this.$store.commit('setGalleryState', 0);
        }
      },
      async selectSingleImage(opts) {
        opts = opts ? opts : {};
        if(this.process) { return; }
        let f = this.field.uploadPath ? this.field.uploadPath : null;
        let uploadFile = $(this.$refs.uploadFileRef);
        if(!uploadFile.length) { return; }
        uploadFile.off('change.callback');
        uploadFile.on('change.callback', () => {
          this.photoUploadCallback({
            uploadPath: f,
            success: opts.success
          });
        });
        uploadFile.trigger('click');
      },
      selectVideoGallery(opts){
        opts = opts ? opts : {};
        if(this.process) { return; }
        let uploadFile = $(this.$refs.uploadFileRef);
        uploadFile.off('change.callback');
        uploadFile.on('change.callback', () => {
          this.videoUploadCallback(opts);
        });
        uploadFile.trigger('click');
      },
      selectPhotoGallery(opts) {
        opts = opts ? opts : {};
        if(this.process) { return; }
        let f = this.field.uploadPath ? this.field.uploadPath : null;
        let uploadFile = $(this.$refs.uploadFileRef);
        uploadFile.off('change.callback');
        uploadFile.on('change.callback', () => {
          this.photoUploadCallback({
            uploadPath: f,
            success: opts.success
          });
        });
        uploadFile.trigger('click');
      },
      setGalleryPhoto() {
        let opts = {
          multiple: false,
          allowEdit: true,
          deleteCallback: this.deleteCallback,
          addCallback: this.addCallback,
          items: []
        };
        if(this.field.type === 'photo') {
          opts.items = [{
            value: this.realValue,
            type: 'photo',
            fullpath: window.config.serverLink+(this.field.path ? this.field.path : '') + '/'+this.realValue
          }];
        } else {
          opts.items = this.collectGalleryItems();
          opts.multiple = true;
        }
        this.$store.dispatch('callGallery', opts);
      },
      collectGalleryItems() {
        let items = [];
        for(let i = 0; i < this.realValue.length; i++) {
          items.push({
            value: this.realValue[i],
            type: this.field.type.replace('gallery', ''),
            fullpath: window.config.serverLink+(this.field.path ? this.field.path : '') + '/'+this.realValue[i]
          });
        }
        return items;
      },
      setGalleryVideo() {
        let opts = {
          multiple: false,
          allowEdit: true,
          deleteCallback: this.deleteCallback,
          addCallback: this.addCallback,
          items: []
        };
        if(this.field.type === 'video') {
          opts.items = [{
            value: this.realValue,
            type: 'video',
            fullpath: window.config.serverLink+(this.field.path ? this.field.path : '') + '/'+this.realValue
          }];
        } else {
          opts.items = this.collectGalleryItems();
        }
        this.$store.dispatch('callGallery', opts);
      },
    }
  }
</script>
