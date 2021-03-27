import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//其对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//请求路径配置
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)
  var y = date.getFullYear()
  var m = (date.getMonth() + "").padStart(2, '0')
  var d = (date.getDate() + "").padStart(2, '0')
  var hh = (date.getHours() + "").padStart(2, '0')
  var mm = (date.getMinutes() + "").padStart(2, '0')
  var ss = (date.getSeconds() + "").padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')