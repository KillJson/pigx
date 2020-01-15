<template>
  <div/>
</template>

<script>
import request from '@/router/axios'
import { getQueryString } from '@/util/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Authredirect',
  computed: {
    ...mapGetters(['tagWel'])
  },
  created() {
    const url = window.location.href.replace('#/authredirect', '')
    const code = getQueryString(url, 'code')
    let state = getQueryString(url, 'state')
    const type = state.split('-')[1]
    state = state.split('-')[0]
    // 登录请求
    if (type === 'LOGIN') {
      window.opener.location.href = `${window.location.origin}/#/login?state=${state}&code=${code}&time=` + new Date().getTime()
      window.close()
    } else {
      this.bind(state, code)
    }
  },
  methods: {
    bind: function(state, code) {
      request({
        url: '/admin/social/bind',
        method: 'post',
        params: { state, code }
      }).then(() => {
        this.$alert('社交账号绑定成功', '成功', {
          confirmButtonText: '确定',
          callback: () => {
            window.close()
          }
        })
      })
    }
  }
}
</script>

<style>
</style>
