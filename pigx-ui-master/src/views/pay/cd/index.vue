<template>
  <basic-container>
    <div style="text-align: center;">
      <el-row>
        <el-col :span="24"><h2>扫码支付</h2></el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <qrcode :value="msg" :options="options"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><h4>请使用微信或支付宝（沙箱）手机客户端扫一扫</h4></el-col>
      </el-row>
      <el-row>
        1. 请勿大额支付，无法退还请知悉
      </el-row>
      <el-row>
        2. 支付宝目前是沙箱，有正式账号的老铁欢迎提供测试 - -
      </el-row>
      <el-row>
        <el-radio v-model="amount" label="1">0.01 元</el-radio>
        <el-radio v-model="amount" label="2">0.02 元</el-radio>
        <el-radio v-model="amount" label="3">0.03 元</el-radio>
      </el-row>
    </div>
  </basic-container>
</template>

<style>
</style>

<script>
import VueQrcode from '@xkeshi/vue-qrcode'

const protocol = window.location.protocol
const host = window.location.host

export default {
  components: {
    'qrcode': VueQrcode
  },
  data() {
    return {
      amount: '1',
      msg: '',
      options: {
        size: 300
      }
    }
  },
  watch: {
    amount: function(amount) {
      this.msg = `${protocol}//${host}/pay/goods/buy?amount=${amount}`
    }
  },
  created() {
    this.msg = `${protocol}//${host}/pay/goods/buy?amount=1`
  }
}
</script>
