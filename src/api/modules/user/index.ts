import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 用户管理模块
 */
export namespace User {
  // 用户实体（对应 UserDTO）
  export interface UserItem {
    id: number
    username: string
    password?: string
    phone?: string
    nickname?: string
    avatarUrl?: string
    tenantId?: number
    role: number
    status: number
    createTime?: string
    updateTime?: string
  }

  // 分页请求参数
  export interface UserQueryParams {
    page?: number
    limit?: number
    status?: number
    role?: number
  }

  // 创建或更新用户的提交数据
  export interface UserSubmitParams {
    username: string
    password?: string
    phone?: string
    nickname?: string
    avatarUrl?: string
    tenantId?: number
    role: number
    status: number
  }
}

// * 创建用户
export const createUser = (data: User.UserSubmitParams) => {
  return http.post<{ user_id: number }>(_API + '/users', data)
}

// * 分页查询用户列表
export const getUserList = (params: User.UserQueryParams) => {
  return http.get<{
    users: User.UserItem[]
    pagination: { total: number; page: number; limit: number }
  }>(_API + '/users', params)
}

// * 获取单个用户
export const getUserById = (id: number) => {
  return http.get<{ user: User.UserItem }>(`${_API}/users/${id}`)
}

// * 更新用户
export const updateUser = (id: number, data: User.UserSubmitParams) => {
  return http.put<void>(`${_API}/users/${id}`, data)
}

// * 删除用户
export const deleteUser = (id: number) => {
  return http.delete<void>(`${_API}/users/${id}`)
}
