<template>
  <span>
    <i
      class="icon-bofangqi-suoping"
      @click="handleLock"/>
    <el-dialog
      :visible.sync="box"
      title="设置锁屏密码"
      width="30%"
      append-to-body>
      <el-form
        ref="form"
        :model="form"
        label-width="80px">
        <el-form-item
          :rules="[{ required: true, message: '锁屏密码不能为空'}]"
          label="锁屏密码"
          prop="passwd">
          <el-input
            v-model="form.passwd"
            placeholder="请输入锁屏密码"/>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="handleSetLock">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopLock',
  data() {
    return {
      box: false,
      form: {
        passwd: ''
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['lockPasswd'])
  },
  methods: {
    handleSetLock() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_LOCK_PASSWD', this.form.passwd)
          this.handleLock()
        }
      })
    },
    handleLock() {
      if (this.validatenull(this.lockPasswd)) {
        this.box = true
        return
      }
      this.$store.commit('SET_LOCK')
      setTimeout(() => {
        this.$router.push({ path: '/lock' })
      }, 100)
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
</style>
