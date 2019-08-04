import Vue from 'vue'
import App from './App.vue'

import store from 'store'
import router from 'router'

import './registerServiceWorker'
import './assets/styles/styles.css'

import VueLastModal from 'vue-last-modal'
Vue.use(VueLastModal)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
