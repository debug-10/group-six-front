import { SysManager } from '@/api/interface'
import { ResPage } from '@/api/interface'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 管理员管理模块
 */
// * 获取管理员列表
export const getManagerPage = (params: SysManager.ReqGetManagerParams) => {
  return http.post<ResPage<SysManager.ResManagerList>>(_API + `/sys/manager/page`, params)
}

// * 新增管理员
export const addManager = (params: SysManager.ReqEditManagerParams) => {
  return http.post(_API + `/sys/manager/add`, params)
}

// * 编辑管理员
export const editManager = (params: SysManager.ReqEditManagerParams) => {
  return http.post(_API + `/sys/manager/edit`, params)
}

// * 删除管理员
export const deleteManager = (params: number[]) => {
  return http.post(_API + `/sys/manager/remove`, params)
}

// * 修改密码
export const changePassword = (params: { id: number; password: string }) => {
  return http.post(_API + `/sys/manager/changePassword`, params)
}

// 获取管理员信息
export const getManagerInfoApi = () => {
  return http.post<SysManager.ResManagerList>(_API + '/sys/manager/getManagerInfo', {}, { headers: { noLoading: true } })
}

// * 权限分配
export const assignManagerRole = (params: { managerId: number; roleId: number; permissions?: string }) => {
  return http.post(_API + `/sys/manager/assignRole`, params)
}

// * 获取可分配的角色列表
export const getAssignableRoles = () => {
  return http.get(_API + `/sys/manager/roles`)
}
