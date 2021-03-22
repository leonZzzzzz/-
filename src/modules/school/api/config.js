import axios from 'axios'
import qs from 'qs'
import router from '../router/index'
// import Vue from 'vue'
import Vue from '../main'
import { Message } from 'element-ui'
axios.defaults.timeout = 60000 //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //配置请求头

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? Vue.base.baseHost + Vue.base.projectName() : Vue.base.projectName()
console.log(axios.defaults.baseURL)
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    // debugger
    if (res.data.code == 20000 || res.data.code == 50104) {
      return res
    } else {
      if (res.data.code === 50103) {
        Vue.$router.replace('/login')
      }
      Message.error(res.data.message)
      // Vue.$router.replace("/login");
      return Promise.reject(res)
    }
  },
  function axiosRetryInterceptor(err) {
    console.log('axiosRetryInterceptor === ', err)
    Message.error('请求错误，请重新登录')
    // Vue.$router.replace("/login");
    return Promise.reject(err)
  }
)
export default {
  postImg: function(url, params) {
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

  post2: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          traditional: true
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

  post: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(params))
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

  json: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/json'
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

  get: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: params })
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
  put: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, qs.stringify(params))
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
  delete: function(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, { params: params })
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
  }
}
