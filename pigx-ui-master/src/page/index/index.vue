<template>
  <div
    :class="{'avue--collapse':isCollapse}"
    class="avue-contail">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top/>
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags/>
        <!-- 主体视图层 -->
        <el-scrollbar style="height:100%">
          <keep-alive>
            <router-view
              v-if="$route.meta.$keepAlive"
              class="avue-view"/>
          </keep-alive>
          <router-view
            v-if="!$route.meta.$keepAlive"
            class="avue-view"/>
        </el-scrollbar>

      </div>
    </div>
    <div
      class="avue-shade"
      @click="showCollapse"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
import admin from '@/util/admin'
import { getStore } from '@/util/store.js'
import * as SockJS from 'sockjs-client'
import Stomp from 'stomp-websocket'
import store from '@/store'

export default {
  name: 'Index',
  components: {
    top,
    tags,
    sidebar
  },
  data() {
    return {
      // 刷新token锁
      refreshLock: false,
      // 刷新token的时间
      refreshTime: '',
      // 计时器
      timer: ''
    }
  },
  created() {
    // 实时检测刷新token
    this.refreshToken()
  },
  destroyed() {
    clearInterval(this.refreshTime)
    clearInterval(this.timer)
    this.disconnect()
  },
  mounted() {
    this.init()
    this.initWebSocket()
  },
  computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website', 'expires_in']),
  methods: {
    showCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    // 屏幕检测
    init() {
      this.$store.commit('SET_SCREEN', admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen())
        }, 0)
      }
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: 'access_token',
          debug: true
        })

        if (this.validatenull(token)) {
          return
        }

        if (this.expires_in <= 1000 && !this.refreshLock) {
          this.refreshLock = true
          this.$store
            .dispatch('RefreshToken')
            .catch(() => {
              clearInterval(this.refreshTime)
            })
          this.refreshLock = false
        }
        this.$store.commit('SET_EXPIRES_IN', this.expires_in - 10)
      }, 10000)
    },
    initWebSocket() {
      this.connection()
      const self = this
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send('test')
        } catch (err) {
          console.log('断线了: ' + err)
          self.connection()
        }
      }, 5000)
    },
    connection() {
      const token = store.getters.access_token
      const TENANT_ID = getStore({ name: 'tenantId' }) ? getStore({ name: 'tenantId' }) : '1'
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      // 建立连接对象
      this.socket = new SockJS('/act/ws')// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = null
      // 向服务器发起websocket连接
      this.stompClient.connect(headers, () => {
        this.stompClient.subscribe('/task/' + this.userInfo.username + '-' + TENANT_ID + '/remind', (msg) => { // 订阅服务端提供的某个topic;
          this.$notify({
            title: '协同提醒',
            type: 'warning',
            dangerouslyUseHTMLString: true,
            message: msg.body + '任务，请及时处理',
            offset: 60
          })
        })
      }, (err) => {

      })
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    }
  }
}
</script>
