<template>
  <div class="social-container">
    <div
      class="box"
      @click="handleClick('wechat')">
      <span
        :style="{backgroundColor:'#6ba2d6'}"
        class="container">
        <i
          icon-class="wechat"
          class="iconfont icon-weixin"/>
      </span>
      <p class="title">微信</p>
    </div>
    <div
      class="box"
      @click="handleClick('tencent')">
      <span
        :style="{backgroundColor:'#8dc349'}"
        class="container">
        <i
          icon-class="qq"
          class="iconfont icon-qq1"/>
      </span>
      <p class="title">QQ</p>
    </div>
    <div
      class="box"
      @click="handleClick('gitee')">
      <span
        :style="{backgroundColor:'#bf3030'}"
        class="container">
        <i
          icon-class="qq"
          class="iconfont icon-logo_gitee_icon"/>
      </span>
      <p class="title">Gitee</p>
    </div>
    <div
      class="box"
      @click="handleClick('osc')">
      <span
        :style="{backgroundColor:'#007B25'}"
        class="container">
        <i
          icon-class="qq"
          class="iconfont icon-OSChina_logo_"/>
      </span>
      <p class="title">开源中国</p>
    </div>
  </div>
</template>

<script>
import { openWindow } from '@/util/util'

export default {
  name: 'SocialSignin',
  methods: {
    handleClick(thirdpart) {
      let url
      const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect')
      if (thirdpart === 'wechat') {
        const appid = 'wxd1678d3f83b1d83a'
        url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX-LOGIN&response_type=code&scope=snsapi_login#wechat_redirect`
      } else if (thirdpart === 'tencent') {
        const client_id = '101322838'
        url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-LOGIN&client_id=${client_id}&redirect_uri=${redirect_uri}`
      } else if (thirdpart === 'gitee') {
        const client_id = 'c771eff6cf10c5353bc60eaf0c4a265ebdb91750e2fc844b61dbf75ace702723'
        url = `https://gitee.com/oauth/authorize?response_type=code&client_id=${client_id}&state=GITEE-LOGIN&redirect_uri=${redirect_uri}`
      } else if (thirdpart === 'osc') {
        const client_id = 'uLJ41IGu7qAGmzSVHwF4'
        url = `https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=${client_id}'&state=OSC-LOGIN&redirect_uri=${redirect_uri}`
      }
      openWindow(url, thirdpart, 540, 540)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .social-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .box {
      cursor: pointer;
    }

    .iconfont {
      color: #fff;
      font-size: 30px;
    }

    .container {
      $height: 50px;
      display: inline-block;
      width: $height;
      height: $height;
      line-height: $height;
      text-align: center;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .title {
      text-align: center;
    }
  }
</style>
