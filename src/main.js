import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$axios = axios;

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
