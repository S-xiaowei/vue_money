import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import Base64 from '../src/assets/js/base64';

Vue.prototype.$Base64 = Base64;
axios.defaults.baseURL="http://localhost:8087";
Vue.prototype.$http = axios
axios.defaults.withCredentials=true;

Vue.config.productionTip = false

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
