// head dependencies
let $ = require('jquery');
window.jQuery = window.$ = window.jquery = $;
window.config = require('./modules/globals').default;

// core
import Vue from 'vue'
import App from './App'

// imports
import router from './router'
import store from './store/index.js'

import Socket from '@/plugins/Socket';
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import Message from 'vue-m-message'
import wysiwyg from "vue-wysiwyg";

import loader from './components/elements/loader.vue';
import vdialogMixin from './mixins/vdialogMixin.vue';
import dropdown from './components/elements/dropdown.vue';
import VueQuillEditor from 'vue-quill-editor';
import VuejsDialog from "vuejs-dialog";

// uses
Vue.use(Socket);

Vue.use(wysiwyg, {
  hideModules: {  code: true, orderedList: true, unorderedList: true, headings: true, table: true },
});
Vue.use(Message, {name: 'msg'});
Vue.use(VueQuillEditor);
Vue.use(VuejsDialog);

Vue.component('chart', ECharts);
Vue.component('loader', loader);
Vue.component('dropdown', dropdown);
Vue.mixin(vdialogMixin);

// injection
require('./modules/http');
require('./modules/sha256');
window.app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
