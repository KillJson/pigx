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
  viewBtn: true,
  addBtn: false,
  editBtn: false,
  align: 'center',
  column: [
    {
      label: '主键',
      prop: 'id',
      hide: false
    },
    {
      label: '公众号',
      prop: 'wxAccountName'
    },
    {
      label: '用户标识',
      prop: 'openid',
      overHidden: true
    },
    {
      label: '昵称',
      prop: 'nickname'
    },
    {
      label: '消息类型',
      prop: 'msgType'
    },
    {
      label: '内容',
      prop: 'content'
    },
    {
      label: '已回复',
      prop: 'isRes',
      type: 'select',
      dicUrl: '/admin/dict/type/response_type',
      search: true
    },
    {
      label: '创建时间',
      prop: 'createTime'
    },
    {
      label: '头像地址',
      prop: 'headimgUrl',
      type: 'upload',
      imgWidth: 60,
      imgFullscreen: true,
      editDisplay: false,
      addDisplay: false,
      listType: 'picture-img'
    }
  ]
}

export const tableResOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  viewBtn: true,
  editBtn: false,
  delBtn: true,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '回复人',
      prop: 'userName',
      addDisplay: false
    },
    {
      label: '回复内容',
      prop: 'resContent',
      type: 'textarea',
      span: 24,
      minRows: 5
    },
    {
      label: '时间',
      prop: 'createTime',
      addDisplay: false
    }
  ]
}
