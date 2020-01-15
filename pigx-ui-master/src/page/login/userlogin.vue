<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0">
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        size="small"
        auto-complete="off"
        placeholder="请输入用户名"
        @keyup.enter.native="handleLogin">
        <i
          slot="prefix"
          class="icon-yonghu"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        :type="passwordType"
        v-model="loginForm.password"
        size="small"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin">
        <i
          slot="suffix"
          class="el-icon-view el-input__icon"
          @click="showPassword"/>
        <i
          slot="prefix"
          class="icon-mima"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            :maxlength="code.len"
            v-model="loginForm.code"
            size="small"
            auto-complete="off"
            placeholder="请输入验证码"
            @keyup.enter.native="handleLogin">
            <i
              slot="prefix"
              class="icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <span
              v-if="code.type == 'text'"
              class="login-code-img"
              @click="refreshCode">{{ code.value }}</span>
            <img
              v-else
              :src="code.src"
              class="login-code-img"
              @click="refreshCode">
              <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
          </div>
        </el-col>
      </el-row>

    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from '@/util/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Userlogin',
  data() {
    return {
      socialForm: {
        code: '',
        state: ''
      },
      loginForm: {
        username: 'admin',
        password: '123456',
        code: '',
        redomStr: ''
      },
      checked: false,
      code: {
        src: '/code',
        value: '',
        len: 4,
        type: 'image'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.refreshCode()
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['tagWel'])
  },
  props: [],
  methods: {
    refreshCode() {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`)
    },
    showPassword() {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.$router.push({ path: this.tagWel.value })
          }).catch(() => {
            this.refreshCode()
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
