const TOKEN = 'qiangfeng'
const APP_ID = 'wxfeab4479b74284bb'
const APP_SECRET = 'b561a4b0aa99fc6571df75dd93b627ad'
const WECHAT_APP_URL = 'http://843tgd.natappfree.cc'
const WECHAT_API_URL_PREFIX = 'https://api.weixin.qq.com/cgi-bin'
const ACCESS_TOKEN_URL = `${WECHAT_API_URL_PREFIX}/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`

const API_URL = {
  CREATE_MENU: token => `${WECHAT_API_URL_PREFIX}/menu/create?access_token=${token}`,
  GET_USER_INFO: (token, openId) => `${WECHAT_API_URL_PREFIX}/user/info?access_token=${token}&openid=${openId}&lang=zh_CN`,
  IMG_UPLOAD: token => `${WECHAT_API_URL_PREFIX}/media/uploadimg?access_token=${token}`,
  SEND_ALL_MESSAGE: token => `${WECHAT_API_URL_PREFIX}/message/mass/sendall?access_token=${token}`,
  JS_API_TICKET: token => `${WECHAT_API_URL_PREFIX}/ticket/getticket?access_token=${token}&type=jsapi`,
  WEB_ACCESS_TOKEN_URL: code => `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`
}
const WECHAT_MENU = {
  'button': [
    {
      'type': 'click',
      'name': '今日歌曲',
      'key': 'V1001_TODAY_MUSIC'
    },
    {
      'name': '菜单',
      'key': '22222',
      'sub_button': [
        {
          'type': 'view',
          'name': '强峰的网站',
          'key': 'V1001_GOOD',
          'url': `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${WECHAT_APP_URL}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`
        },
        {
          'type': 'click',
          'name': '赞一们',
          'key': 'V1001_GOOD222'
        }]
    }]
}
const WECHAT_FLAT_MENU = WECHAT_MENU.button.reduce((reslut, item) => {
  if (!item.sub_button) {
    reslut.push(item)
  } else {
    reslut = reslut.concat(item.sub_button)
  }
  return reslut
}, [])

module.exports = {
  TOKEN,
  APP_ID,
  APP_SECRET,
  WECHAT_API_URL_PREFIX,
  ACCESS_TOKEN_URL,
  WECHAT_MENU,
  API_URL,
  WECHAT_FLAT_MENU
}
