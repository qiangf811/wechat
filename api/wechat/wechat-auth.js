const url = require('url')
const axios = require('axios')
const { API_URL } = require('./constant')
const WechatUser = require('../../mongoose/models/wechat-user')
exports.wechatAuth = async (req, res) => {
  try {
    const { code } = url.parse(req.url, true).query
    const { data } = await axios.get(API_URL.WEB_ACCESS_TOKEN_URL(code))
    const { access_token, openid, errcode } = data
    if (errcode) {
      return res.status(500).end()
    }
    WechatUser.findByOpenId(openid, (err, row) => {
      if (err) return res.status(500).end()
      return res.json(row)
    })
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
}
