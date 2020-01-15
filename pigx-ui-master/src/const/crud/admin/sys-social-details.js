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
  align: 'center',
  viewBtn: true,
  column: [{
    label: 'ID',
    prop: 'id',
    hide: true,
    addDisplay: false,
    editDisabled: true
  },
  {
    label: '类型',
    prop: 'type',
    type: 'select',
    dicUrl: '/admin/dict/type/social_type',
    search: true,
    rules: [{
      required: true,
      message: '请选择类型',
      trigger: 'blur'
    }]
  },
  {
    label: '描述',
    prop: 'remark'
  },
  {
    label: 'appId',
    prop: 'appId',
    overHidden: true,
    rules: [{
      required: true,
      message: '请输入appId',
      trigger: 'blur'
    }]
  },
  {
    label: 'appSecret',
    prop: 'appSecret',
    overHidden: true,
    rules: [{
      required: true,
      message: '请输入appSecret',
      trigger: 'blur'
    }]
  },
  {
    label: '回调地址',
    prop: 'redirectUrl',
    hide: true,
    rules: [{
      required: true,
      message: '请输入回调地址',
      trigger: 'blur'
    }]
  },
  {
    valueFormat: 'timestamp',
    format: 'yyyy-MM-dd hh:mm:ss',
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    addDisplay: false,
    editDisabled: true
  }
  ]
}
