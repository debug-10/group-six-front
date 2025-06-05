import http from '@/api'
import { _API } from '@/api/axios/servicePort'

// 用户管理接口定义
export namespace UserInfo {
  // 响应数据类型（列表）
  export interface ResUserList {
    id: number
    username: string
    phone: string
    nickname: string
    avatarUrl: string | null
    role: number // 3=普通用户
    status: number // 1=启用，0=禁用
    createTime: string
    updateTime: string
  }

  // 请求参数类型（新增/编辑）
  export interface ReqUserParams {
    username: string
    phone: string
    nickname?: string
    avatarUrl?: string
    status?: number
    password?: string // 新增/重置时使用
    submitPassword?: string // 确认密码
  }
}

// 分页查询用户列表
export const getUserList = (params: any) => {
  return http.get<UserInfo.ResUserList[]>(`${_API}/users`, params).then((res) => res.data)
}

// 新增用户
export const addUser = (data: UserInfo.ReqUserParams) => {
  return http.post(`${_API}/users`, data)
}

// 编辑用户
export const editUser = (id: number, data: UserInfo.ReqUserParams) => {
  return http.put(`${_API}/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return http.delete(`${_API}/users/${id}`)
}
