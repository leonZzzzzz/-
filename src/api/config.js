import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { Message } from 'element-ui'
import { BASEURL } from '@/utils/config'

axios.defaults.timeout = 600000 //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //配置请求头
axios.defaults.baseURL = BASEURL

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  res => {
    const codeList = [20000, 50104, 40000, 91001, 91002, 91003, 91004, 32001]
    if (codeList.includes(res.data.code)) {
      return res
    } else if (res.data.code == 50103) {
      if (res.config.method == 'post') {
        store.commit('setIsPostTypeApi', true)
      } else {
        store.commit('setIsPostTypeApi', false)
      }
      store.commit('updateSession', true)
      return Promise.reject(res)
    } else {
      Message.error(res.data.message)
      return Promise.reject(res)
    }
  },
  function axiosRetryInterceptor(err) {
    Message.error('请求错误')
    return Promise.reject(err)
  }
)

export default {
  postImg: function (url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/form-data',
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(
          res => {
            resolve(res)
          },
          err => {
            reject(err)
          }
        )
        .catch(error => {
          reject(error)
        })
    })
  },
  get(url, params) {
    return axios.get(url, { params })
  },
  post(url, params) {
    return axios.post(url, qs.stringify(params))
  },
  json(url, params) {
    return axios.post(url, params)
  },
  upload(url, params) {
    return axios.post(url, params, {
      headers: {
        'Content-Type': 'application/form-data'
      }
    })
  }
}
