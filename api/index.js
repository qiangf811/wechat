
const express = require('express')
const wechat = require('./wechat')
// require('../mongoose/mongodb').connection()
const axios = require('axios')
const app = express()
const router = express.Router()

// Transform req & res to have the same API as express So we can use res.status() & res.json()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

wechat.initwechat(app)
router.get('/wx.do', wechat.wechatcheck)
router.post('/wx.do', wechat.receiveMessage)
router.post('/signature', wechat.fethSignature)
router.get('/auth', wechat.wechatAuth)
setTimeout(async () => {
  try {
    console.log('即将发送请求')
    const { data } = await axios.post('http://02b9f26fb7f74f8b:6b78c57d7c474730a324805b219e8b44@10.138.188.206:9001/verify/target/add?dbName=2222')
    console.log('请求结束', JSON.stringify(data))
  } catch (error) {
    console.error('请求失败')
    console.error(error)
  }
}, 10000)
module.exports = {
  path: '/api',
  handler: router
}
