import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {Icon,Button,Input, Select, Carousel, Tooltip, Skeleton, Pagination } from 'ant-design-vue'
import {Cascader} from 'element-ui'
import customStyle from './assets/customStyle.less'
import 'echarts/lib/chart/pie'
import ECharts from 'vue-echarts'

import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/coord/cartesian/Grid'

Vue.component('v-chart', ECharts)
Vue.config.productionTip = false

// Vue.use(BaiduMap, {
//   ak: 'fw9CfWuMOO6cfrERuEFKL4FOIUGQQ3dj'
// })

Vue.use(Icon)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.use(Cascader,{ size: 'small', zIndex: 3000 })
Vue.use(Carousel)
Vue.use(Tooltip)
Vue.use(Skeleton)
Vue.use(Pagination)

Vue.prototype.$getAxios = (url, data, cb, errCb = (err) => {
  console.log(err)
}) => {
  return  axios.get(url,{
    params: data
  }).then(res => cb(res.data)).catch(err => errCb(err))
}


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
