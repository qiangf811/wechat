const axios = require('axios')
const { API_URL, WECHAT_FLAT_MENU } = require('./constant')
const utils = require('./utils')
const WechatUser = require('../../mongoose/models/wechat-user')

const messageHandler = {
  // 文本消息
  text ({ FromUserName, ToUserName, Content }, res) {
    let content = '编辑@+您想说的话，我们可以收到'
    if (/^\@.*/.test(Content)) {
      content = '已经收到您的建议，会及时处理！'
    }
    res.send(utils.formatter.text({
      FromUserName,
      ToUserName,
      Content: content
    }))
  },
  // 图片消息
  image () {

  },
  // 声音消息
  voice () {

  },
  // 视频消息
  video () {

  },
  // 短视频消息
  shortvideo () {

  },
  // 地理消息
  location () {

  },
  // 连接消息
  link () {

  }
}

const eventHandler = {
  // 关注
  async subscribe ({ FromUserName: openId }, req, res) {
    try {
      const { wechatToken } = req.app
      // 根据关注的用户的openId和token获取用户信息
      const { data } = await axios.get(API_URL.GET_USER_INFO(wechatToken, openId))
      if (data && data.openid) {
        // 先查询数据库中是否已有该用户的信息，如果没有则新建
        WechatUser.findByOpenId(data.openid, (err, row) => {
          if (err) return res.send('success')
          if (!row) {
            let user = new WechatUser(data)
            user.save((err, row) => {
              if (err) {
                console.log(err)
                return res.send('success')
              }
              console.log('用户关注，插入数据库成功')
              return res.send('success')
            })
          }
        })
      }
    } catch (error) {
      console.error(error)
      res.send('success')
    }
  },
  // 取消关注
  unsubscribe ({ FromUserName }, req, res) {
    // 删除库中的数据
    const openid = FromUserName
    if (openid) {
      WechatUser.findOneAndRemove({
        openid
      }, function (err) {
        if (err) {
          console.log('删除用户失败', err)
          return res.send('success')
        }
        console.log('删除取关用户成功')
        return res.send('success')
      })
    } else {
      console.error('删除用户失败，没有获取到正确的openid')
      res.send('success')
    }
  },
  // 点击菜单拉取消息时的事件推送
  CLICK ({ FromUserName, ToUserName, EventKey }, req, res) {
    const key = EventKey
    const buttom = WECHAT_FLAT_MENU.find(item => item.key === key)
    res.send(utils.formatter.text({
      FromUserName,
      ToUserName,
      Content: `你点击的按钮是-${buttom.name}`
    }))
  },
  // 点击菜单跳转链接时的事件推送
  VIEW (body, req, res) {
    res.send('')
  }
}
exports.receiveMessage = (req, res) => {
  const buffer = []
  req.on('data', function (data) {
    buffer.push(data)
  })
  req.on('end', async () => {
    try {
      const msg = await utils.parserXML(buffer)
      const { MsgType: messageType, Event: eventName } = msg // 获取消息类型
      if (messageType === 'event' && eventHandler[eventName]) { // 事件类消息处理
        eventHandler[eventName](msg, req, res)
      } else if (messageHandler[messageType]) { // 消息类型处理
        messageHandler[messageType](msg, res)
      } else { // 异常发送任意响应
        console.log('未匹配到任何消息')
        return res.send('')
      }
    } catch (error) {
      console.log('公众号消息事件Error:', error)
      res.send('')
    }
  })
}
