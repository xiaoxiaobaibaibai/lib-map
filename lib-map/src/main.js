import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import BaiduMap from 'vue-baidu-map'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(BaiduMap, {
  ak: 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
