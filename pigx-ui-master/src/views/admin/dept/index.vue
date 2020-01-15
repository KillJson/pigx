`<!--
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
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-button-group>
          <el-button
            v-if="deptManager_btn_add"
            type="primary"
            icon="plus"
            @click="handlerAdd">添加
          </el-button>
          <el-button
            v-if="deptManager_btn_edit"
            type="primary"
            icon="edit"
            @click="handlerEdit">编辑
          </el-button>
          <el-button
            v-if="deptManager_btn_del"
            type="primary"
            icon="delete"
            @click="handleDelete">删除
          </el-button>
        </el-button-group>
      </div>

      <el-row>
        <el-col
          :span="8"
          style="margin-top:15px;">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="getNodeData"/>
        </el-col>
        <el-col
          :span="16"
          style="margin-top:15px;">
          <el-card class="box-card">
            <el-form
              ref="form"
              :label-position="labelPosition"
              :rules="rules"
              :model="form"
              label-width="80px">
              <el-form-item
                label="父级节点"
                prop="parentId">
                <el-input
                  v-model="form.parentId"
                  :disabled="formEdit"
                  placeholder="请输入父级节点"/>
              </el-form-item>
              <el-form-item
                v-if="formEdit"
                label="节点编号"
                prop="deptId">
                <el-input
                  v-model="form.deptId"
                  :disabled="formEdit"
                  placeholder="节点编号"/>
              </el-form-item>
              <el-form-item
                label="部门名称"
                prop="name">
                <el-input
                  v-model="form.name"
                  :disabled="formEdit"
                  placeholder="请输入名称"/>
              </el-form-item>
              <el-form-item
                label="排序"
                prop="sort">
                <el-input
                  v-model="form.sort"
                  :disabled="formEdit"
                  type="number"
                  placeholder="请输入排序"/>
              </el-form-item>
              <el-form-item v-if="formStatus == 'update'">
                <el-button
                  type="primary"
                  @click="update">更新
                </el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus == 'create'">
                <el-button
                  type="primary"
                  @click="create">保存
                </el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchTree, getObj, putObj } from '@/api/admin/dept'
import { mapGetters } from 'vuex'

export default {
  name: 'Dept',
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        parentId: [
          { required: true, message: '请输入父级节点', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请输入节点编号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      },
      labelPosition: 'right',
      form: {
        name: undefined,
        sort: undefined,
        parentId: undefined,
        deptId: undefined
      },
      currentId: 0,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    }
  },
  created() {
    this.getList()
    this.deptManager_btn_add = this.permissions['sys_dept_add']
    this.deptManager_btn_edit = this.permissions['sys_dept_edit']
    this.deptManager_btn_del = this.permissions['sys_dept_del']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data.data
      })
      this.currentId = data.id
      this.showElement = true
    },
    handlerEdit() {
      if (this.form.deptId) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd() {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        putObj(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    create() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        addObj(this.form).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        parentId: this.currentId
      }
    }
  }
}
</script>

