const XMLJS = require('xml2js')

const builder = new XMLJS.Builder()
const parser = new XMLJS.Parser({ trim: true, explicitArray: false, explicitRoot: false })

const parserXML = msgbuffer => new Promise((resolve, reject) => {
  parser.parseString(msgbuffer.toString(), async (err, result) => {
    if (err) {
      console.log('公众号消息解析失败', err)
      return reject(err)
    }
    resolve(result)
  })
})

const formatter = {
  text ({ FromUserName, ToUserName, Content }) {
    return builder.buildObject({
      xml: {
        ToUserName: FromUserName,
        FromUserName: ToUserName,
        CreateTime: +new Date(),
        MsgType: 'text',
        Content: Content
      }
    })
  }
}

module.exports = {
  parserXML,
  formatter
}
