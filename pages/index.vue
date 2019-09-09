<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        wechat
      </h1>
      <div>
        姓名：{{name}}  城市：{{city}}
      </div>
      <div class="links">
        <span class="button--green" @click="scanQRCode">
          扫描二维码
        </span>
        <span  class="button--grey" @click="takePhoto">
        <!-- <span  class="weui-btn weui-btn_primary" @click="takePhoto"> -->
          获取照片
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Logo from '~/components/Logo.vue'
  let wx
  if (process.client) {
    wx = require('weixin-js-sdk') // 这里的意思就是写你在window对象上的操作，可以翻译为下面这段代码
  }

  export default {
    components: {
      Logo
    },
    data: () => ({
      name: '',
      city: ''
    }),
    async created () {
      if (process.client) {
        try {
          /* eslint-disable */
          let params = new URLSearchParams(document.location.search.substring(1))
          const code = params.get('code')
          let {data:userInfo} =  await axios.get(`/api/auth?code=${code}`)
          if (userInfo) {
            this.name = userInfo.nickname
            this.city = userInfo.city
          }
          let { data:config } = await axios.post(`/api/signature`,{
            url: location.href
          })
          this.initWXConfig(config)
        } catch (e) {
          console.error(e)
        }
      }
    },
    methods: {
      initWXConfig({ appId, timestamp, nonceStr, signature }) {
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名
          jsApiList: ['scanQRCode','chooseImage'] // 必填，需要使用的JS接口列表
        })
      },
      scanQRCode() {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            alert(result)
          }
        })
      },
      takePhoto() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          }
        });
      }
    }
  }
</script>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>