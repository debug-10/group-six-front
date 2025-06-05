import { Device } from '@/api/interface'
import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 设备管理模块
 */

// * 创建设备
export const createDeviceApi = (params: Device.DeviceCreateDTO) => {
  return http.post<number>(_API + '/devices', params, {
    headers: { noLoading: false }
  })
}

// * 分页查询设备
export const getDevicePageApi = (params: Device.DeviceQuery) => {
  return http.post<Device.DeviceListResponse>(_API + '/devices/page', params, {
    headers: { noLoading: false }
  })
}

// * 更新设备
export const updateDeviceApi = (params: Device.DeviceUpdateDTO) => {
  return http.post<void>(_API + '/devices/update', params, {
    headers: { noLoading: false }
  })
}

// * 导出设备
export const exportDeviceApi = (params: Device.DeviceQuery) => {
  return http.post(_API + '/devices/export', params, {
    responseType: 'blob',
    headers: { noLoading: false }
  })
}

// * 更新设备状态
export const updateDeviceStatusApi = (params: Device.DeviceStatusDTO) => {
  return http.post<void>(_API + '/devices/status', params, {
    headers: { noLoading: false }
  })
}

// * 删除设备
export const deleteDeviceApi = (id: number) => {
  return http.post<void>(
    _API + `/devices/delete/${id}`,
    {},
    {
      headers: { noLoading: false }
    }
  )
}
