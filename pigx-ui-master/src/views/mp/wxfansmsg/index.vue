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
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @row-save="handleSave"
        @row-del="rowDel">
        <template
          slot-scope="scope"
          slot="menu">
          <el-button
            v-if="permissionList.addBtn"
            type="text"
            icon="el-icon-check"
            @click="reply(scope.row,scope.index)">回复
          </el-button>
        </template>
      </avue-crud>
      <el-dialog :visible.sync="dialogFormVisible" title="回复消息">
        <avue-crud
          ref="crudLog"
          :page="pageRes"
          :data="tableResData"
          :option="tableResOption"
          @row-save="handleResSave"
          @row-del="rowResDel"/>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { addObj, addResObj, delObj, delResObj, fetchList, fetchResList } from '@/api/mp/wxfansmsg'
import { tableOption, tableResOption } from '@/const/crud/mp/wxfansmsg'
import { mapGetters } from 'vuex'

export default {
  name: 'Wxfansmsg',
  data() {
    return {
      searchForm: {},
      dialogFormVisible: false,
      tableData: [],
      tableResData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      pageRes: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tableResOption: tableResOption,
      msgId: undefined
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.mp_wxfansmsg_add, false),
        delBtn: this.vaildData(this.permissions.mp_wxfansmsg_del, false),
        editBtn: this.vaildData(this.permissions.mp_wxfansmsg_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    getResList(pageRes, params) {
      fetchResList(Object.assign({
        current: pageRes.currentPage,
        size: pageRes.pageSize
      }, params)).then(response => {
        this.tableResData = response.data.data.records
        this.pageRes.total = response.data.data.total
      })
    },
    rowDel: function(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(() => {
        _this.tableData.splice(index, 1)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getList(this.page)
      }).catch(function() {
      })
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.tableResData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      })
    },
    rowResDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delResObj(row.id)
      }).then(() => {
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getResList(this.pageRes, { fansMsgId: this.msgId })
      }).catch(function() {
      })
    },
    handleResSave: function(row, done) {
      row.fansMsgId = this.msgId
      addResObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '发送成功',
          type: 'success'
        })
        done()
        this.getResList(this.pageRes, { fansMsgId: this.msgId })
      })
    },
    /**
       * 刷新回调
       */
    refreshChange() {
      this.getList(this.page)
    },
    /**
       * 搜索回调
       */
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    },
    reply: function(row) {
      this.msgId = row.id
      this.dialogFormVisible = true
      this.getResList(this.pageRes, { fansMsgId: this.msgId })
      // 同时刷新 客户消息列表
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
