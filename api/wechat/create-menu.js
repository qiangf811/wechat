const axios = require('axios')
const { WECHAT_MENU, API_URL } = require('./constant')
exports.createMenu = async (token) => {
  try {
    axios.post(API_URL.CREATE_MENU(token), WECHAT_MENU)
  } catch (error) {

  }
}
