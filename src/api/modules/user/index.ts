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
  // 打印发送的参数
  console.log('🚀 getUserList 发送参数:', params)

  return http
    .get<{
      code: string
      message: string
      data: {
        users: UserInfo.ResUserList[]
        pagination: { total: number; page: number; limit: number }
      }
    }>(`${_API}/users`, params)
    .then((res) => {
      // 打印完整的响应对象
      console.log('🔍 getUserList 响应对象 res:', res)

      // 打印响应中的 code 和 msg
      console.log('🔍 getUserList 响应 code:', res.code)
      console.log('🔍 getUserList 响应 msg:', res.msg)

      // 打印响应中的 data 结构
      console.log('🔍 getUserList 响应 data:', res.data)

      // 打印即将返回的 data.data（注意：这里可能存在层级问题）
      console.log('🔍 getUserList 返回的数据:', res.data.data)

      return res.data // 返回 { users, pagination }
    })
    .catch((error) => {
      // 打印错误信息
      console.error('🛑 getUserList 错误捕获:', {
        message: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status
      })

      // 打印完整的错误对象
      console.error('🛑 getUserList 错误对象:', error)

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
