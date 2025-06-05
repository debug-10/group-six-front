import { ResPage } from '@/api/interface'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

// 定义告警管理相关接口类型
export namespace Alarm {
  // 告警列表请求参数
  export interface ReqAlarmParams {
    page?: number
    limit?: number
    status?: number
    level?: number
  }

  // 告警列表响应数据
  export interface AlarmVO {
    id: number
    deviceId: string // 后端使用字符串类型
    type: number // 改为数字类型，与后端一致
    level: number
    message: string
    status: number
    createTime: string
  }

  // 告警详情响应数据
  export interface AlarmDetailVO extends AlarmVO {
    // 可以添加告警详情特有的字段
    detailInfo?: string
  }

  // 告警详情接口返回结构
  export interface AlarmDetailResponse {
    alarm: AlarmDetailVO
  }

  // 新增告警请求参数
  export interface ReqCreateAlarmParams {
    deviceId: string // 改为字符串类型
    type: number // 改为数字类型
    level: number
    message: string
    status?: number
  }

  // 编辑告警请求参数
  export interface ReqUpdateAlarmParams {
    deviceId?: string // 改为字符串类型
    type?: number // 改为数字类型
    level?: number
    message?: string
    status?: number
  }
}

/**
 * @name 告警管理模块
 */
// * 获取告警列表
export const getAlarmList = (params: Alarm.ReqAlarmParams) => {
  return http.get<ResPage<Alarm.AlarmVO>>(_API + `/alarms`, params)
}

// * 获取告警详情 - 修改返回类型
export const getAlarmById = (id: number) => {
  return http.get<Alarm.AlarmDetailResponse>(_API + `/alarms/${id}`)
}

// * 新增告警
export const addAlarm = (params: Alarm.ReqCreateAlarmParams) => {
  return http.post<{ alarm_id: number }>(_API + `/alarms`, params)
}

// * 编辑告警
export const updateAlarm = (id: number, params: Alarm.ReqUpdateAlarmParams) => {
  return http.put(_API + `/alarms/${id}`, params)
}

// * 删除告警
export const deleteAlarm = (id: number) => {
  return http.delete(_API + `/alarms/${id}`)
}
