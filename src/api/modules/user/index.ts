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

  // 用户更新参数接口
  export interface UpdateUserParams {
    username?: string
    phone?: string
    nickname?: string
    avatarUrl?: string
    role: number
    password?: string
  }
}

// * 获取单个用户
export const getUserById = (id: number) => {
  return http.get<{ user: User.UserItem }>(`${_API}/users/${id}`)
}


// 更新用户信息
export const updateUser = (id: number, data: UserInfo.UpdateUserParams) => {
  console.log('🚀 updateUser 请求:', `${_API}/users/${id}`, data)
  return http.put<{ code: number; message: string }>(`${_API}/users/${id}`, data)
}

// 切换用户状态
export const toggleUserStatus = (id: number) => {
  console.log('🚀 toggleUserStatus 请求:', `${_API}/users/status/${id}`)
  return http.put<{ code: number; message: string }>(`${_API}/users/status/${id}`)

}
