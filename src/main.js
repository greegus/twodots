import Vue from 'vue'
import App from './App.vue'

import store from 'store'
import router from 'router'

import VueLastModal from 'vue-last-modal'
Vue.use(VueLastModal)

import './assets/styles/styles.css'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
