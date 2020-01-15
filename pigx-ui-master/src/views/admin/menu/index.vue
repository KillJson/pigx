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
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-button-group>
          <el-button
            v-if="menuManager_btn_add"
            type="primary"
            icon="plus"
            @click="handlerAdd">添加
          </el-button>
          <el-button
            v-if="menuManager_btn_edit"
            type="primary"
            icon="edit"
            @click="handlerEdit">编辑
          </el-button>
          <el-button
            v-if="menuManager_btn_del"
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
            :default-expanded-keys="aExpandedKeys"
            :filter-node-method="filterNode"
            :props="defaultProps"
            class="filter-tree"
            node-key="id"
            highlight-current
            @node-click="getNodeData"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"/>
        </el-col>
        <el-col
          :span="16"
          style="margin-top:15px;">
          <el-card class="box-card">
            <el-form
              ref="form"
              :label-position="labelPosition"
              :model="form"
              :rules="rules"
              label-width="80px">
              <el-form-item
                label="父级节点"
                prop="parentId">
                <el-input
                  v-model="form.parentId"
                  :disabled="true"
                  placeholder="请输入父级节点"/>
              </el-form-item>
              <el-form-item
                v-if="form.menuId"
                label="节点ID"
                prop="menuId">
                <el-input
                  v-model="form.menuId"
                  :disabled="formEdit || formStatus === 'update'"
                  type="number"
                  placeholder="请输入节点ID"/>
              </el-form-item>
              <el-form-item
                label="标题"
                prop="name">
                <el-input
                  v-model="form.name"
                  :disabled="formEdit"
                  placeholder="请输入标题"/>
              </el-form-item>
              <el-form-item
                label="类型"
                prop="type">
                <el-radio v-model="form.type" :disabled="formEdit" label="0">菜单</el-radio>
                <el-radio v-model="form.type" :disabled="formEdit" label="1">按钮</el-radio>
              </el-form-item>

              <el-form-item
                v-if="form.type === '1'"
                label="权限标识"
                prop="permission">
                <el-input
                  v-model="form.permission"
                  :disabled="formEdit"
                  placeholder="请输入权限标识"/>
              </el-form-item>
              <el-form-item
                v-if="form.type === '0'"
                label="地址"
                prop="component">
                <el-input
                  v-model="form.path"
                  :disabled="formEdit"
                  placeholder="/xx/xxx || http://"/>
              </el-form-item>
              <el-form-item
                v-if="form.type === '0'"
                label="图标"
                prop="icon">
                <avue-icon-select
                  v-model="form.icon"
                  :icon-list="iconList"
                  :disabled="formEdit"
                  placeholder="请输入图标"/>
              </el-form-item>
              <el-form-item
                v-if="form.type === '0'"
                label="排序"
                prop="sort">
                <el-input
                  v-model="form.sort"
                  :disabled="formEdit"
                  type="number"
                  placeholder="请输入排序"/>
              </el-form-item>
              <el-form-item
                v-if="form.type === '0'"
                label="路由缓冲"
                prop="type">
                <el-switch
                  v-model="form.keepAlive"
                  :disabled="formEdit"
                  :active-value="&quot;0&quot;"
                  :inactive-value="&quot;1&quot;"
                  active-color="#13ce66"
                  inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item v-if="formStatus === 'update'">
                <el-button
                  type="primary"
                  @click="update">更新
                </el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus === 'create'">
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
import { addObj, delObj, fetchMenuTree, getObj, putObj } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import iconList from '@/const/iconList'

export default {
  name: 'Menu',
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: '菜单',
        1: '按钮'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      iconList: iconList,
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['0', '1'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: undefined,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      rules: {
        menuId: [{ required: true, message: '节点ID不合法', trigger: 'blur' }],
        name: [{ required: true, message: '标题不合法', trigger: 'blur' }],
        type: [{ required: true, message: '类型不合法', trigger: 'blur' }],
        path: [{ validator: this.checkPath, trigger: 'blur' }]
      }
    }
  },

  computed: {
    ...mapGetters(['elements', 'permissions'])
  },
  created() {
    this.getList()
    this.menuManager_btn_add = this.permissions['sys_menu_add']
    this.menuManager_btn_edit = this.permissions['sys_menu_edit']
    this.menuManager_btn_del = this.permissions['sys_menu_del']
  },
  methods: {
    getList() {
      fetchMenuTree(this.listQuery).then(response => {
        this.treeData = response.data.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    nodeExpand(data) {
      const aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], oNode => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys() {
      const oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          const oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
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
    checkPath(rule, value, callback) {
      if (this.form.type === '1') {
        callback()
      } else if (this.validatenull(value)) {
        callback(new Error('请输入前端组件'))
      } else {
        callback()
      }
    },
    handlerEdit() {
      if (this.form.menuId) {
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
        if (valid) {
          putObj(this.form).then(() => {
            this.getList()
            this.formEdit = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    create() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList()
            this.formEdit = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: this.currentId,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      }
    }
  }
}
</script>

