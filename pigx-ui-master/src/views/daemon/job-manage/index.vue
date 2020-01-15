<template>
  <div class="jobmanage">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        v-model="form"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @row-save="save"
        @row-update="update"
        @refresh-change="refreshChange"
        @search-change="handleFilter"
        @search-reset="handleSearchReset">
        <template slot-scope="scope" slot="jobStatus">
          <div v-if="scope.row.jobStatus === '1'">
            <el-tag type="info">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
          <div v-else-if="scope.row.jobStatus === '2'">
            <el-tag type="success">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
          <div v-else-if="scope.row.jobStatus === '3'">
            <el-tag type="danger">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
        </template>
        <template slot-scope="scope" slot="jobExecuteStatus">
          <div v-if="scope.row.jobExecuteStatus === '0'">
            <el-tag type="success">{{ getDicNameJobExecuteStatus(scope.row.jobExecuteStatus) }}</el-tag>
          </div>
          <div v-else>
            <el-tag type="danger">{{ getDicNameJobExecuteStatus(scope.row.jobExecuteStatus) }}</el-tag>
          </div>
        </template>

        <template slot="cronExpressionForm" slot-scope="scope">
          <div class="cron">
            <el-popover v-model="cronPopover">
              <cron i18n="cn" @change="changeCron" @close="cronPopover=false"/>
              <el-input
                slot="reference"
                v-model="form.cronExpression"
                placeholder="请输入定时策略"
                @click="cronPopover=true"/>
            </el-popover>
          </div>
        </template>

        <template slot="menuLeft">
          <el-button v-if="permissions.job_sys_job_add" type="primary" @click="handleAdd">
            新建任务
          </el-button>
          <el-tooltip content="暂停全部运行状态的定时任务" placement="top">
            <el-button v-if="permissions.job_sys_job_shutdown_job" type="warning" @click="shutdownJobs">
              暂停全部任务
            </el-button>
          </el-tooltip>
          <el-tooltip content="启动全部暂停状态的定时任务" placement="top">
            <el-button v-if="permissions.job_sys_job_start_job" type="success" @click="startJobs">
              启动全部任务
            </el-button>
          </el-tooltip>
          <el-tooltip content="谨慎使用" placement="top">
            <el-button v-if="permissions.job_sys_job_refresh_job" type="danger" @click="refreshJobs">重置全部任务
            </el-button>
          </el-tooltip>
        </template>
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-info"
            @click="getJobLog(scope.row)">日志
          </el-button>
          <el-button
            v-if="permissions.job_sys_job_start_job"
            type="text"
            icon="el-icon-caret-right"
            @click="handleStartJob(scope.row)">启动
          </el-button>
          <el-button
            v-if="permissions.job_sys_job_shutdown_job"
            type="text"
            icon="el-icon-error"
            @click="handleShutDownJob(scope.row)">暂停
          </el-button>
          <el-button
            v-if="permissions.job_sys_job_edit"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,scope.index)">修改
          </el-button>
          <el-button
            v-if="permissions.job_sys_job_del"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row,scope.index)">删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog :visible.sync="dialogFormVisible" title="执行日志" width="90%" @close="closeJobLogDialog">
      <avue-crud
        ref="crudLog"
        :page="pageLog"
        :data="tableLogData"
        :option="tableLogOption"
        :table-loading="tableLogLoading"
        @on-load="getJobLogList"
        @refresh-change="getJobLogList">
        <template slot-scope="scope" slot="jobLogStatus">
          <div v-if="scope.row.jobLogStatus == 0">
            <el-tag type="success">{{ getDicNameJobExecuteStatus(scope.row.jobLogStatus) }}</el-tag>
          </div>
          <div v-else>
            <el-tag type="danger">{{ getDicNameJobExecuteStatus(scope.row.jobLogStatus) }}</el-tag>
          </div>
        </template>
      </avue-crud>
    </el-dialog>
  </div>

</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  getJobLogList,
  isValidTaskName,
  putObj,
  refreshJobsRa,
  shutDownJobRa,
  shutdownJobsRa,
  startJobRa,
  startJobsRa
} from '@/api/daemon/sys-job'
import { tableLogOption, tableOption } from '@/const/crud/daemon/sys-job'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import { cron } from 'vue-cron'

export default {
  name: 'SysManage',
  components: { cron },
  data() {
    return {
      form: {},
      cronPopover: false,
      queryParams: {}, // 全局检索条件
      tableData: [],
      tableLogData: [],
      dialogFormVisible: false,
      jobId: '',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条,
      },
      pageLog: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条,
      },
      tableLoading: false,
      tableLogLoading: false,
      tableOption: tableOption,
      tableLogOption: tableLogOption,
      JobExecuteStatusDicCache: [],
      JobStatusDicCache: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted: function() {
    this.getDicJobExecuteStatusCache('job_execute_status')// 获取定时任务运行时状态
    this.getDicJobStatusCache('job_status')// 获取定时任务状态
  },
  methods: {
    changeCron(val) {
      this.form.cronExpression = val
    },
    /**
       * 关闭执行日志对话框重置信息
       */
    closeJobLogDialog() {
      this.jobId = ''
      this.pageLog.total = 0
      this.pageLog.currentPage = 1
      this.pageLog.pageSize = 10
    },
    /**
       * 定时任务分页查询
       */
    getList() {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: this.page.currentPage,
        size: this.page.pageSize
      }, this.queryParams)).then(response => {
        this.tableData = response.data.data.records
        this.page.pageSize = response.data.data.pageSize
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    /**
       * 清除全局检索条件
       */
    handleSearchReset() {
      this.queryParams = {}
    },
    /**
       * 定时任务检索查询分页查询
       */
    handleFilter(params) {
      this.queryParams = params
      this.getList(this.page)
    },
    /**
       * 启动定时任务
       */
    handleStartJob(row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$confirm(
          '即将发布或启动(任务名称:' + row.jobName + '), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          startJobRa(row.jobId).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '启动成功',
                type: 'success'
              })
              this.refreshChange()
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '启动失败'
            })
          })
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '定时任务已运行'
        })
      }
    },
    /**
       * 新增定时任务
       */
    handleAdd() {
      this.$refs.crud.rowAdd()
    },
    /**
       * 修改定时任务
       */
    handleUpdate(row, index) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$refs.crud.rowEdit(row, index)
      } else {
        this.$notify.error({
          title: '错误',
          message: '运行中定时任务不可修改，请先暂停后操作'
        })
      }
    },
    /**
       * 暂停定时任务
       */
    handleShutDownJob(row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '2') {
        this.$confirm(
          '即将暂停(任务名称:' + row.jobName + '), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          shutDownJobRa(row.jobId).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.getList(this.page)
              this.$notify({
                title: '成功',
                message: '暂停成功',
                type: 'success'
              })
            }
            this.refreshChange()
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '暂停失败'
            })
          })
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '已暂停，不要重复操作'
        })
      }
    },
    /**
       * 刷新回调
       */
    refreshChange() {
      this.getList(this.page)
    },
    /**
       * 获取定时任务执行日志
       */
    getJobLog(row) {
      this.dialogFormVisible = true
      this.tableLogLoading = true
      this.jobId = row.jobId
      this.getJobLogList(this.pageLog)
    },
    /**
       * 获取定时任务执行日志
       */
    getJobLogList(page) {
      getJobLogList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, { jobId: this.jobId })).then(response => {
        this.tableLogData = response.data.data.records
        this.pageLog.total = response.data.data.total
        this.pageLog.pageSize = response.data.data.pageSize
        this.tableLogLoading = false
      })
    },
    /**
       * 暂停运行中定时任务
       */
    shutdownJobs() {
      this.$confirm(
        '即将暂停全部运行中定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        shutdownJobsRa().then(response => {
          const code = response.data.code
          const msg = response.data.msg
          if (code === 0) {
            this.getList(this.page)
            this.$notify({
              title: '成功',
              message: msg,
              type: 'success'
            })
            this.refreshChange()
          } else {
            this.$notify.error({
              title: '错误',
              message: '暂停失败'
            })
          }
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '暂停失败'
          })
        })
      })
    },
    /**
       * 启动全部暂停定时任务
       */
    startJobs() {
      this.$confirm(
        '即将启动全部暂定中定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        startJobsRa().then(response => {
          const code = response.data.code
          if (code === 0) {
            this.getList(this.page)
            this.$notify({
              title: '成功',
              message: '启动成功',
              type: 'success'
            })
            this.refreshChange()
          } else {
            this.$notify.error({
              title: '错误',
              message: '启动失败'
            })
          }
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '启动失败'
          })
        })
      })
    },
    /**
       * 刷新定时任务
       */
    refreshJobs() {
      this.$confirm(
        '即将刷新全部定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        refreshJobsRa().then(response => {
          const code = response.data.code
          if (code === 0) {
            this.getList(this.page)
            this.$notify({
              title: '成功',
              message: '重置成功',
              type: 'success'
            })
            this.refreshChange()
          } else {
            this.$notify.error({
              title: '错误',
              message: '重置失败'
            })
          }
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '重置失败'
          })
        }
        )
      })
    },
    /**
       * 新增定时任务持久化处理
       */
    save(row, done, loading) {
      isValidTaskName({
        'jobName': row.jobName,
        'jobGroup': row.jobGroup
      }).then(response => {
        const result = response.data.data
        if (result !== 0) {
          this.$notify.error({
            title: '错误',
            message: '任务名称与任务组重复，请确认后重新添加'
          })
        } else {
          addObj(row).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            loading()
          })
        }
        done()
        this.getList()
      })
    },
    /**
       * 更新定时任务持久化处理
       */
    update(row, index, done, loading) {
      putObj(row).then(() => {
        this.getList(this.page)
        done()
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.refreshChange()
      }).catch(() => {
        loading()
      })
    },
    /**
       * 删除定时任务持久化处理
       */
    handleDelete(row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$confirm('是否确认删除(任务名称:' + row.jobName + '), 是否继续?删除后不可恢复', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delObj(row.jobId)
        }).then(() => {
          this.getList(this.page)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.refreshChange()
        }).catch(function() {
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '运行中定时任务不可删除，请先暂停后操作'
        })
      }
    },
    /**
       * 获取字典显示名称并缓存
       */
    getDicJobExecuteStatusCache(type) {
      remote(type).then(response => {
        const code = response.data.code
        if (code === 0) {
          const _data = response.data.data
          this.JobExecuteStatusDicCache = _data
        }
      })
    },
    /**
       * 获取字典显示名称并缓存
       */
    getDicJobStatusCache(type) {
      remote(type).then(response => {
        const code = response.data.code
        if (code === 0) {
          const _data = response.data.data
          this.JobStatusDicCache = _data
        }
      })
    },
    /**
       * 获取字典定时任务执行状态字典值显示名称
       */
    getDicNameJobExecuteStatus(value) {
      let re = ''
      this.JobExecuteStatusDicCache.forEach(obj => {
        if (obj.value === value) {
          re = obj.label
          return
        }
      })
      return re
    },
    /**
       * 获取字典定时任务状态字典值显示名称
       */
    getDicNameJobStatus(value) {
      let re = ''
      this.JobStatusDicCache.forEach(obj => {
        if (obj.value === value) {
          re = obj.label
          return
        }
      })
      return re
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
