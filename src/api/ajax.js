/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import axios from 'axios'

export default function ajax (url, data = {}, type = 'GET', config) {
  // 初始化配置
  if (config === undefined) {
    config = {}
  }
  /* 跨域请求 */
  config.withCredentials = true

  return new Promise(function (resolve, reject) {
    // 执行异步ajax请求
    let promise
    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = axios.get(url, config)
    } else {
      // 发送post请求
      /* 跨域请求 */
      promise = axios.post(url, data, config)
    }

    promise.then(function (response) {
      // 成功了调用resolve()
      resolve(response.data)
    }).catch(function (error) {
      // 失败了调用reject()
      reject(error)
    })
  })
}

export function reqBase64Img (url) {
  return new Promise(function (resolve, reject) {
    let promise
    promise = axios
      .get(url, {
        responseType: 'arraybuffer',
        withCredentials: true
      })
      // eslint-disable-next-line node/no-deprecated-api
      .then(response => new Buffer(response.data, 'binary').toString('base64'))

    promise.then(function (response) {
      // 成功了调用resolve()
      resolve('data:image/jpeg;base64,' + response)
    }).catch(function (error) {
      // 失败了调用reject()
      reject(error)
    })
  })
}

/**
 * 请求blob对象
 * @param url
 * @returns {Promise<any>}
 */
export function reqBlob (url) {
  return new Promise(function (resolve, reject) {
    let promise
    promise = axios.get(url, {
      responseType: 'blob'
    })

    promise.then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/*
const response = await ajax()
const result = response.data

const resule = await ajax()
 */
