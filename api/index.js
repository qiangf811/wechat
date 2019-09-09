
const express = require('express')
const wechat = require('./wechat')
require('../mongoose/mongodb').connection()

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
module.exports = {
  path: '/api',
  handler: router
}
