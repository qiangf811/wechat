const { fetchAccessToken, fetchJsapiTicket } = require('./fetch-accesstoken')
const { wechatcheck } = require('./wechat-check')
const { createMenu } = require('./create-menu')
const { receiveMessage } = require('./receive-message')
const { pushImgMessage } = require('./push-message')
const { fethSignature } = require('./wechat-jssdk')
const { wechatAuth } = require('./wechat-auth')
const { APP_ID } = require('./constant')

const initwechat = async app => {
  try {
    app.appId = APP_ID
    app.wechatToken = await fetchAccessToken()
    app.jsapi_ticket = await fetchJsapiTicket(app.wechatToken)
    createMenu(app.wechatToken)
    setInterval(async () => {
      app.wechatToken = await fetchAccessToken()
      app.jsapi_ticket = await fetchJsapiTicket(app.wechatToken)
    }, 1000 * 60 * 60 * 2)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  initwechat,
  wechatcheck,
  receiveMessage,
  pushImgMessage,
  fethSignature,
  wechatAuth
}
