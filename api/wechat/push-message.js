const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { API_URL } = require('./constant')
const FormData = require('form-data')

exports.pushImgMessage = async (token) => {
  try {
    // const url = await getImgUrl(token)
    // console.log(url)
    const message = {
      'filter': {
        'is_to_all': true
      },
      'text': {
        'content': '哈哈哈哈 发送于14：15'
      },
      'msgtype': 'text'
    }
    const { data } = await axios.post(API_URL.SEND_ALL_MESSAGE(token), message)
    if (data.errcode === 0) {
      console.log('消息发送成功')
    } else {
      console.log(data)
      console.log('消息发送失败')
    }
  } catch (error) {
    console.error(error)
  }
}

function getImgUrl (token) {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new FormData()
      form.append('media', fs.createReadStream(path.resolve(process.cwd(), 'api/wechat/active.gif')))
      axios.post(API_URL.IMG_UPLOAD(token), { media: form }, {
        headers: {
          ...form.getHeaders()
        }
      }).then(response => {
        if (response.data.errcode === 0) {
          console.log('图片上传成功')
          resolve(response.data.url)
        } else {
          console.log(response.data)
          console.log('图片上传失败')
          reject(new Error('图片上传失败'))
        }
      }).catch(error => {
        console.log(error)
      })
    } catch (error) {
      console.error(error)
      reject(new Error('图片上传失败'))
    }
  })
}
