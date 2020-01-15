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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @row-del="rowDel">
        <template
          slot-scope="scope"
          slot="menu">
          <el-button
            v-if="permissions.sys_dict_add"
            type="text"
            size="mini"
            icon="el-icon-menu"
            @click="handleItem(scope.row,scope.index)">字典项
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :table-loading="tableLoading"
      title="字典项管理"
      width="90%"
      @close="dialogFormVisible=false">
      <avue-crud
        ref="crudItem"
        :data="tableDictItemData"
        :permission="permissionList"
        v-model="form"
        :before-open="handleBeforeOpen"
        :option="tableDictItemOption"
        :table-loading="tableLoading"
        @row-update="handleItemUpdate"
        @row-save="handleItemSave"
        @row-del="rowItemDel"/>
    </el-dialog>
  </div>
</template>

<script>
import { addItemObj, addObj, delItemObj, delObj, fetchItemList, fetchList, putItemObj, putObj } from '@/api/admin/dict'
import { tableDictItemOption, tableOption } from '@/const/crud/admin/dict'
import { mapGetters } from 'vuex'

export default {
  name: 'Dict',
  data() {
    return {
      searchForm: {},
      form: {
        type: undefined,
        dictId: undefined
      },
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
      tableData: [],
      tableDictItemData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tableDictItemOption: tableDictItemOption
    }
  },
  created() {
  },
  mounted: function() {
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_dict_add, false),
        delBtn: this.vaildData(this.permissions.sys_dict_del, false),
        editBtn: this.vaildData(this.permissions.sys_dict_edit, false)
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

    getDictItemList(dictId, type) {
      this.dictType = type
      this.dictId = dictId
      this.dialogFormVisible = true
      this.tableLoading = true
      fetchItemList(Object.assign({
        current: this.page.currentPage,
        size: this.page.pageSize
      }, { dictId: dictId })).then(response => {
        this.tableDictItemData = response.data.data.records
        this.tableLoading = false
      })
    },
    handleBeforeOpen(done) {
      this.form.type = this.dictType
      this.form.dictId = this.dictId
      done()
    },
    rowDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除数据类型为"' + row.type + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row)
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
    handleUpdate: function(row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getList(this.page)
        done()
      })
    },
    handleSave: function(row, done) {
      addObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getList(this.page)
        done()
      })
    },
    handleItemSave: function(row, done) {
      addItemObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.getDictItemList(row.dictId, row.type)
        done()
      })
    },
    handleItemUpdate: function(row, index, done) {
      putItemObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getDictItemList(row.dictId, row.type)
        done()
      })
    },
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    },
    handleItem: function(row) {
      this.getDictItemList(row.id, row.type)
    },
    rowItemDel: function(row) {
      var _this = this
      this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delItemObj(row.id)
      }).then(() => {
        this.getDictItemList(row.dictId, row.type)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

