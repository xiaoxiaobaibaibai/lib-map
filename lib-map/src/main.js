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
