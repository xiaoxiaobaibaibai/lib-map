import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/customStyle.less'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(Antd)
// Vue.use(BaiduMap, {
//   ak: 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj'
// })

Vue.prototype.$getAxios = (url, data, cb, errCb = (err) => {
  console.log(err)
}) => {
  axios.get(url,{
    params: data
  }).then(res => cb(res.data)).catch(err => errCb(err))
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
