// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import mdui from 'mdui'
import store from './store'
import 'mdui/dist/css/mdui.css'
import './filters'
import myglobalfun from './kits/myglobalfun.js'

Vue.use(mdui)
Vue.use(myglobalfun)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
