import http from '@/api'
import { _API } from '@/api/axios/servicePort'
import { ResPage } from '@/api/interface'

/**
 * @name 数据大屏模块
 */
export namespace Dashboard {
  // 设备区域统计
  export interface DeviceDistrictStat {
    district: string
    count: number
  }

  // 地图设备点位
  export interface DeviceMapItem {
    name: string
    value: [number, number] // 经纬度
  }

  // 告警等级分布
  export interface AlarmLevelStat {
    level: number // 1-低 2-中 3-高
    count: number
  }

  // 告警趋势
  export interface AlarmTrendItem {
    date: string
    count: number
  }
}

// * 获取设备区域统计
export const getDeviceDistrictStats = (params = {}) => {
  return http.get<ResPage<Dashboard.DeviceDistrictStat>>(_API + '/api/dashboard/summary', params)
}

// * 获取设备地图点位
export const getDeviceMap = (params = {}) => {
  return http.get<ResPage<Dashboard.DeviceMapItem>>(_API + '/api/dashboard/deviceMap', params)
}

// * 获取告警等级分布
export const getAlarmLevelStats = (params = {}) => {
  return http.get<ResPage<Dashboard.AlarmLevelStat>>(_API + '/api/dashboard/alarmLevelStats', params)
}

// * 获取告警趋势数据
export const getAlarmTrend = (params = {}) => {
  return http.get<ResPage<Dashboard.AlarmTrendItem>>(_API + '/api/dashboard/alarmTrend', params)
}
