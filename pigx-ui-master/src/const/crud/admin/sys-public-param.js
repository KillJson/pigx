/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 150,
  align: 'center',
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: 'mini',
  editBtn: true,
  delBtn: true,
  addBtn: true,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
    {
      label: '名称',
      search: true,
      prop: 'publicName',
      rules: [
        { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: '请输入中文、英文、数字包括下划线', trigger: 'blur' }
      ]
    },
    {
      label: '键',
      prop: 'publicKey',
      rules: [
        { required: true, message: '请输入键', trigger: 'blur' },
        { pattern: /^[A-Z_]+$/, message: '请输入大写英文、下划线', trigger: 'blur' }
      ]

    },
    {
      label: '值',
      overHidden: true,
      prop: 'publicValue',
      rules: [
        { required: true, message: '请输入值', trigger: 'blur' }
      ]
    },
    {
      label: '编码',
      prop: 'validateCode'
    },
    {
      label: '作用',
      prop: 'system',
      type: 'select',
      dicUrl: '/admin/dict/type/dict_type',
      addDisplay: false,
      editDisplay: false,
      search: true
    },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      type: 'select',
      dicUrl: '/admin/dict/type/status_type'
    },
    {
      label: '类型',
      prop: 'publicType',
      width: 80,
      type: 'select',
      dicUrl: '/admin/dict/type/param_type',
      rules: [{
        required: true,
        message: '请选择类型',
        trigger: 'blur'
      }]
    }
  ]
}
