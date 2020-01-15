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
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select v-model="q.id" placeholder="请选择数据源">
              <el-option
                v-for="item in dataSourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="q.tableName" placeholder="表名称"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-setting" @click="setting" @close="dsBox=false">维护
            </el-button>
          </div>
        </el-col>
      </el-row>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange">
        <template
          slot-scope="scope"
          slot="menu">
          <el-button
            type="text"
            icon="el-icon-check"
            @click="handleDown(scope.row,scope.index)">生成
          </el-button>
        </template>
      </avue-crud>

      <el-dialog
        :visible.sync="box"
        title="生成配置"
        width="50%"
        lock-scroll>
        <div class="pull-auto">
          <avue-form
            ref="formData"
            :option="formOption"
            v-model="formData"
            @submit="gen()"/>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dsBox"
        :table-loading="tableLoading"
        title="数据源管理"
        width="90%"
        @close="dsBox=false">
        <avue-crud
          ref="data-source-settings-crud"
          v-model="dsForm"
          :page="dsPage"
          :data="tableDsData"
          :option="tableDsOption"
          :before-open="handleOpenBefore"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel"
          @refresh-change="refreshDsChange"
          @on-load="getDsList"/>
      </el-dialog>

    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchDsList, fetchList, fetchSelectDsList, handleDown, putObj } from '@/api/gen/gen'
import { formOption, tableDsOption, tableOption } from '@/const/crud/gen/gen'

export default {
  name: 'CodeGenerator',
  data() {
    return {
      dsBox: false,
      q: {},
      dataSourceList: [],
      tableData: [],
      tableDsData: [],
      formData: {},
      box: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dsPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dsForm: {},
      tableLoading: false,
      tableOption: tableOption,
      tableDsOption: tableDsOption,
      formOption: formOption
    }
  },
  created() {
    this.getdataSourceList()
  },
  methods: {
    getList(page) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, this.q)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    rowDel: function(row, index) {
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
        this.getDsList(this.page)
      }).catch(function() {
      })
    },
    handleOpenBefore: function(show) {
      this.dsForm.password = undefined
      show()
    },
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message.success('修改成功')
        done()
        this.getDsList(this.page)
      })
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row))
        this.$message.success('添加成功')
        done()
        this.getDsList(this.page)
      })
    },
    getDsList(page, params) {
      fetchDsList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params)).then(response => {
        this.tableDsData = response.data.data.records
        this.dsPage.total = response.data.data.total
      })
    },
    handleDown: function(row) {
      this.formData.tableName = row.tableName
      this.box = true
    },
    refreshChange() {
      this.getList(this.page)
    },
    refreshDsChange() {
      this.getDsList(this.page)
    },
    gen() {
      this.formData.id = this.q.id
      handleDown(this.formData).then(() => {
        this.box = true
      })
    },
    setting() {
      this.dsBox = true
    },
    search() {
      this.getList(this.page)
    },
    getdataSourceList() {
      fetchSelectDsList().then(response => {
        this.dataSourceList = response.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

