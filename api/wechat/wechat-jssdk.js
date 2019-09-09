const sha1 = require('sha1')
exports.fethSignature = (req, res) => {
  try {
    const { url } = req.body
    const params = {
      jsapi_ticket: req.app.jsapi_ticket,
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: url
    }
    const str = raw(params)
    params.signature = sha1(str)
    params.appId = req.app.appId
    res.json(params)
  } catch (error) {
    res.staus(500)
  }
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

/**
 * 生成签名的随机串
 * @return {字符串}
 */
function createNonceStr () {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 生成签名的时间戳
 * @return {字符串}
 */
function createTimestamp () {
  return parseInt(new Date().getTime() / 1000) + ''
}
