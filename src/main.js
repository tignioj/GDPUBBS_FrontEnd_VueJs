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
//
// router.beforeEach((to, from, next) => {
//   // console.log('之前:', 'to:', to.path, to.meta.keepAlive, ' from:', from.path, from.meta.keepAlive)
//   if (to.path === '/post/preview') {
//     debugger
//     from.meta.keepAlive = true
//   } else {
//     from.meta.keepAlive = false
//   }
//   // console.log('之后:', 'to:', to.path, to.meta.keepAlive, ' from:', from.path, from.meta.keepAlive)
//   next()
// })

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
