// 封装axios
import axios from 'axios'

let pending = [] //  存储每个请求的 axios标识(tag) 、取消函数(cancel)
const CancelToken = axios.CancelToken
const removePending = (config) => {
  for (let p in pending) {
    if(pending[p].tag === config.url) {
      pending[p].cancel()
      pending.splice(p, 1)
    }
  }
}

//  使用create方法创建axios实例，默认get

const Service = axios.create({
  method: 'get'
})

// 请求拦截器
Service.interceptors.request.use(config => {
  removePending(config) // 取消请求
  config.cancelToken = new CancelToken(c => {
    pending.push({tag: config.url, cancel: c})
  })
  return config
})

// 添加响应拦截器
Service.interceptors.response.use(response => {
  removePending(response.config) //取消响应
  return response.data
}, error => {
  return new Promise.reject(error)
})

export default Service
