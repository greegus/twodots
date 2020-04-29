import Vue from 'vue'

import store from 'store'
import router from 'router'

// Last Modal
import VueLastModal from 'vue-last-modal'
Vue.use(VueLastModal)

// App
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
