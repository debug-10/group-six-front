import http from '@/api'
import { _API } from '@/api/axios/servicePort'

// 用户管理接口定义
export namespace UserInfo {
  export interface ResUserList {
    id: number
    username: string
    phone: string
    nickname: string
    avatarUrl: string | null
    role: number
    status: number
    createTime: string
    updateTime: string
  }

  export interface ReqUserParams {
    username: string
    phone: string
    nickname?: string
    avatarUrl?: string
    status?: number
    password?: string
    submitPassword?: string
  }
}

// 分页查询用户列表
export const getUserList = (params: any) => {
  console.log('getUserList 发送参数:', params) // 调试请求参数
  return http
    .get<{
      code: number
      message: string
      data: { users: UserInfo.ResUserList[]; pagination: { total: number; page: number; limit: number } }
    }>(`${_API}/users/userInfo`, { params })
    .then((res) => {
      if (res.data.code !== 100) {
        throw new Error(res.data.message || '获取用户列表失败')
      }
      return res.data.data // 返回 { users, pagination }
    })
    .catch((error) => {
      console.error('getUserList 错误:', error.response?.data?.message || error.message)
      throw error
    })
}

// 新增用户
export const addUser = (data: UserInfo.ReqUserParams) => {
  return http.post<{ code: number; message: string; data: { user_id: number } }>(`${_API}/users`, data).then((res) => {
    if (res.data.code !== 100) {
      throw new Error(res.data.message || '新增用户失败')
    }
    return res.data.data
  })
}

// 编辑用户
export const editUser = (id: number, data: UserInfo.ReqUserParams) => {
  return http.put<{ code: number; message: string }>(`${_API}/users/${id}`, data).then((res) => {
    if (res.data.code !== 100) {
      throw new Error(res.data.message || '编辑用户失败')
    }
    return res.data
  })
}

// 删除用户
export const deleteUser = (id: number) => {
  return http.delete<{ code: number; message: string }>(`${_API}/users/${id}`).then((res) => {
    if (res.data.code !== 100) {
      throw new Error(res.data.message || '删除用户失败')
    }
    return res.data
  })
}
