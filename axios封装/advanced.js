/**
 * 另一个版本的API模块
 */

import Axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import Qs from 'qs'
import Token from '@/util/token'
import { callForceLogin as NativeLogin } from '@/util/app'
import { BASE_URL } from '@/util/global'

// config可配置参数
const FLAGS = {
  // 是否显示请求中效果：默认false
  FLAG_INDICATOR: '_INDICATOR',
  // 是否拼接请求字符串到url：默认true
  FLAG_URLENCODED: '_URLENCODED',
  // 是否显示错误信息：默认为false
  FLAG_TOAST: '_TOAST',
  // 是否自动带上token：默认true
  FLAG_TOKEN: '_TOKEN',
  // 是否允许同时进行多个请求：默认false
  FLAG_MULTIPLE: '_MULTIPLE'
}

// 前调后调默认处理
function buildBaseInterceptors(instance) {
  const interceptorsReq = instance.interceptors.request
  const interceptorsRes = instance.interceptors.response

  // 闭包变量
  let indicator_index = 0
  let indicator_opened = false
  let running_urls = []

  // 监听前调
  // 1. 打开请求中效果
  interceptorsReq.use(config => {
    if (config[FLAGS.FLAG_INDICATOR]) {
      indicator_index++
      setTimeout(() => {
        if (indicator_index && !indicator_opened) {
          Indicator.open()
          indicator_opened = true
        }
      }, 500)
    }
    return config
  })
  // 2. 是否格式化请求字符串
  interceptorsReq.use(config => {
    if (config[FLAGS.FLAG_URLENCODED]) {
      if (typeof config.data !== 'string') {
        config.data = Qs.stringify(config.data)
      }
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
  })
  // 3. 防止重点
  interceptorsReq.use(config => {
    const url = config.url
    if (!config[FLAGS.FLAG_MULTIPLE]) {
      if (running_urls.indexOf(url) === -1) {
        running_urls.push(url)
        return config
      } else {
        return Promise.reject({
          config,
          _REJECTED_TYPE: FLAGS.FLAG_MULTIPLE
        })
      }
    }
    return config
  })
  // 4. 添加token
  interceptorsReq.use(config => {
    if (config[FLAGS.FLAG_TOKEN]) {
      const params = config.params || {}
      params.tk = Token.get()
      config.params = params
    }
    return config
  })

  // 监听后调
  // 0. TODO: GET失败进行重试
  interceptorsRes.use(null, error => {
    const method = error.config.method
    if (method && method.toUpperCase() === 'GET') {
      console.log('GET报错重试的逻辑待补完')
    }
    return Promise.reject(error)
  })
  // 1. 关闭请求中效果
  interceptorsRes.use(
    res => {
      if (res.config[FLAGS.FLAG_INDICATOR]) {
        if (!--indicator_index) {
          indicator_opened = false
          Indicator.close()
        }
      }
      return res
    },
    error => {
      if (error.config && error.config[FLAGS.FLAG_INDICATOR]) {
        if (!--indicator_index) {
          indicator_opened = false
          Indicator.close()
        }
      }
      return Promise.reject(error)
    }
  )
  // 2. 去掉重点锁
  interceptorsRes.use(
    res => {
      const config = res.config
      if (!config[FLAGS.FLAG_MULTIPLE]) {
        const i = running_urls.indexOf(config.url)
        running_urls.splice(i, 1)
      }
      return res
    },
    err => {
      const config = err.config
      if (!config[FLAGS.FLAG_MULTIPLE]) {
        const i = running_urls.indexOf(config.url)
        running_urls.splice(i, 1)
      }
      return Promise.reject(err)
    }
  )
  // Max - 2. 识别错误码
  interceptorsRes.use(res => {
    const codes = res.config._validCodes
    if (codes && codes.length) {
      if (codes.indexOf(res.data[res.config._codeKey]) === -1)
        return Promise.reject(res)
    }
    return res
  })
  // Max - 2 + 0.1. 显示错误信息
  interceptorsRes.use(null, error => {
    if (error.config[FLAGS.FLAG_TOAST]) {
      if (error.data && error.data[error.config._msgKey]) {
        Toast(error.data[error.config._msgKey])
      } else if (!error._REJECTED_TYPE) {
        Toast('网络发生错误，请重试')
      }
    }
    return Promise.reject(error)
  })
  // Max - 2 + 0.2 token失效后的登录跳转
  interceptorsRes.use(null, error => {
    if (error.data && error.data[error.config._codeKey] === 202) {
      if (!error.data[error.config._codeKey]) Toast('请重新登录')
      NativeLogin()
    }
    return Promise.reject(error)
  })
  // Max. 只取返回对象的data，并且做字段过滤
  interceptorsRes.use(res => {
    const targetKey = res.config._targetKey
    if (targetKey) {
      return res.data[targetKey]
    } else {
      return res.data
    }
  })
}

class Ajax {
  constructor(config) {
    config = config || {}

    // 实例默认参数
    config.baseURL = config.baseURL || BASE_URL
    config._targetKey = config._targetKey || 'data'
    config._msgKey = config._msgKey || 'msg'
    config._codeKey = config._codeKey || 'status'
    config._validCodes = config._validCodes || [0, 100]

    // 实例默认配置
    config[FLAGS.FLAG_TOAST] = true
    config[FLAGS.FLAG_TOKEN] = true
    config[FLAGS.FLAG_URLENCODED] = true

    this.instance = Axios.create(config)

    buildBaseInterceptors(this.instance)
  }
  get() {
    return this.instance.get.apply(this.instance, arguments)
  }
  post() {
    return this.instance.post.apply(this.instance, arguments)
  }
  request() {
    return this.instance.request.apply(this.instance, arguments)
  }
}

export default new Ajax()

export { Ajax }
