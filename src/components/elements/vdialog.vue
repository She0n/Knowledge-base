<template>
  <transition name="fade">
  <div class="dialog-component" v-if="$store.state.dialog.items.length" :mounted="mountEl()">
    <div :class="'dialog-window '+($store.state.dialog.items[0].color)+' '+(display ? 'dialog-window-open' : '')" >
      <div class="window-close-icon" @click="removeItem()">
        <svg width="14" version="1.1" xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 64 64" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 64 64">
          <g>
            <path fill="#000" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
          </g>
        </svg>
      </div>
      <div class="window-icon" >
        <img :src="'/static/images/'+$store.state.dialog.items[0].icon+'-'+$store.state.dialog.items[0].color+'.svg'" v-if="$store.state.dialog.items[0].icon">
      </div>
     <div class="window-title" v-html="$store.state.dialog.items[0].title"></div>
     <div v-if="$store.state.dialog.items[0].subtitle">
     <div class="delimeter"></div>
     <div class="window-subtitle"  v-html="$store.state.dialog.items[0].subtitle"></div>
     </div>
     <div class="d-mb-30" v-else>

     </div>
      <div class="window-error" v-html="$store.state.dialog.error ? $store.state.dialog.error : ''"></div>
     <div class="window-inputs" v-if="$store.state.dialog.items[0].checkbox || $store.state.dialog.items[0].input">
       <div>
        <input type="text" class="d-input-cf d-width-100 d-text-center" v-model="input" :placeholder="$store.state.dialog.items[0].input" v-if="$store.state.dialog.items[0].input" />
       </div>
       <div class="d-mt-20 d-inline-block ">
         <div :class="'trigger d-input--'+$store.state.dialog.items[0].color" @click="checkbox = !checkbox">
           <span :class="'checkbox-simulator trigger d-mr-10 '+(checkbox ? 'active': '')"  v-if="$store.state.dialog.items[0].checkbox"></span>
           <span class="" v-html="$store.state.dialog.items[0].checkbox"></span>
         </div>
       </div>
     </div>
     <div class="window-buttons" v-if="$store.state.dialog.items[0].type === 'confirm'">
       <button :class="'d-btn d-btn--'+$store.state.dialog.items[0].color" v-if="typeof $store.state.dialog.items[0].confirm === 'function'" @click="confirmCallback()">
         <loader v-if="lock"></loader>
         <span :class="lock ? 'opacity-0' : ''" v-html="$store.state.dialog.items[0].confirmText" ></span>
       </button>
       <button class="d-btn d-btn--secondary" v-html="$store.state.dialog.items[0].cancelText" v-if="typeof $store.state.dialog.items[0].cancel === 'function'" @click="cancelCallback()"></button>
     </div>
    </div>

    <div class="dialog-backdrop" @click="removeItem()"></div>

  </div>
  </transition>
</template>
<style lang="scss" >
  $blue: #1875f0;
  $green: #4cc68b;
  $danger: #f7396b;
  .window-inputs {
    padding: 0 0;
  }
  .window-error {
    text-align: center;
    padding: 0 0 12px;
    color: #f7396b;
  }
  .window-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    .d-btn {
      min-width: 46%;
    }
  }
  .dialog-component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog-backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.19);
  }
  .dialog-window.dialog-window-open {
    transform: scale(1);
  }
  .dialog-window {
    background: #fff;
    z-index: 1;
    border-radius: 5px;
    border: solid 2px rgb(174, 174, 174);
    transition: all 0.3s ease;
    transform: scale(0);
    padding: 31px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    &:hover.info {
      border-color: $blue;
      .window-close-icon {
        &:hover {
          border-color: $blue;
          background: $blue;
        }
        svg path {
          //fill: #fff;
        }
      }
    }
    // danger
    &:hover.danger {
      border-color: $danger;
      .window-close-icon {
        &:hover {
          border-color: $danger;
          background: $danger;
        }
      }
    }
    // success
    &:hover.success {
      border-color: $green;
      .window-close-icon {
        &:hover {
          border-color: $green;
          background: $green;
        }
      }
    }
  }
  .window-title {
    color: #2c2c2c;
    font-size: 20px;
    font-weight: 500;
    max-width: 300px;
    text-align: center;
    padding: 0 30px;
  }
  .window-subtitle {
    font-size: 14px;
    text-align: center;
  }
  .delimeter {
    background: #707070;
    height: 1px;
    margin: 11px auto;
    opacity: 0.12;
    width: 187px;
  }
  .window-close-icon {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    right: 0;
    top: -21px;
    margin: 0 auto;
    text-align: center;
    border-radius: 100%;
    border: solid 2px rgb(174, 174, 174);
    line-height: 40px;
    background: #fff;
    cursor: pointer;
    &:hover {
      svg path {
        fill: #fff;
      }
    }
    svg {
      width: 14px;
    }
  }
  .window-icon {
    text-align: center;
    margin: 12px 0 5px;
    img {
      height: 24px;
    }
  }
</style>
<script>
  export default {
    data() {
      return {
        display: false,
        checkbox: false,
        input: '',
        lock: false
      };
    },
    watch: {
      '$store.state.dialog.items.length'(v) {
        this.checkbox = false;
        if(!v) {
          this.destroyEl();
        }
      },
      checkbox(v) {
        this.$store.commit('setDialogVals', { checkbox: v });
      },
      input(v) {
        this.$store.commit('setDialogVals', { input: v });
      }
    },
    methods: {
      async confirmCallback() {
        if(this.lock) { return; }
        if(!this.$store.state.dialog.items[0].confirm) { return; }
        this.lock = true;
        let res = await this.$store.state.dialog.items[0].confirm();
        this.lock = false;
        if(typeof res === 'undefined' || res) {
          this.removeItem();
        }
      },
      cancelCallback() {
        this.lock = false;
        if(this.$store.state.dialog.items[0].cancel) {
          this.$store.state.dialog.items[0].cancel();
        }
        this.removeItem();

      },
      removeItem() {
        this.$store.commit('removeDialogItem');
      },
      mountEl() {
        setTimeout(() => {
          this.display = true;
        }, 120);
      },
      destroyEl() {
        this.display = false;
      }
    }
  }
</script>
