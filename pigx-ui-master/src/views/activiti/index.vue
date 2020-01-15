<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @row-save="handleSave"
        @row-del="rowDel">
        <template
          slot-scope="scope"
          slot="menuBtn">
          <el-dropdown-item
            v-if="permissions.act_model_manage"
            divided
            @click.native="handleView(scope.row,scope.index)">模型图
          </el-dropdown-item>
          <el-dropdown-item
            v-if="permissions.act_model_manage"
            divided
            @click.native="handleDeploy(scope.row,scope.index)">部署
          </el-dropdown-item>
          <el-dropdown-item
            v-if="permissions.act_model_manage"
            divided
            @click.native="handleDel(scope.row,scope.index)">删除
          </el-dropdown-item>

        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, deploy, fetchList } from '@/api/activiti/activiti'
import { tableOption } from '@/const/crud/activiti/activiti'
import { mapGetters } from 'vuex'

export default {
  name: 'Activiti',
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {
  },
  mounted: function() {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    handleView(row) {
      const name = `模型id为${row.id}的${row.name}流程图`,
        src = `/activti/detail/${row.id}`
      this.$router.push({
        path: src,
        query: {
          name: name
        }
      })
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    handleDeploy: function(row) {
      var _this = this
      this.$confirm('是否确认部署ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return deploy(row.id)
      }).then(() => {
        this.getList(this.page)
        _this.$message({
          showClose: true,
          message: '部署成功',
          type: 'success'
        })
      }).catch(function() {
      })
    },
    rowDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(() => {
        this.getList(this.page)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function() {
      })
    },
    /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      })
    },
    /**
       * 搜索回调
       */
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    },
    /**
       * 刷新回调
       */
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

