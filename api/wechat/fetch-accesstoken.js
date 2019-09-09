const axios = require('axios')
const { ACCESS_TOKEN_URL, API_URL } = require('./constant')
exports.fetchAccessToken = () => new Promise(async (resolve, reject) => {
  try {
    const { data } = await axios.get(ACCESS_TOKEN_URL)
    resolve(data.access_token)
  } catch (error) {
    reject(error)
  }
})

exports.fetchJsapiTicket = (token) => new Promise(async (resolve, reject) => {
  try {
    const { data } = await axios.get(API_URL.JS_API_TICKET(token))
    if (data.errcode === 0) {
      resolve(data.ticket)
    } else {
      reject(data.errmsg)
    }
  } catch (error) {
    reject(error)
  }
})
