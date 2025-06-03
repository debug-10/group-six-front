// * 请求响应参数(不包含data)
export interface Result {
  code: string
  msg: string
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data: T
}

// * 分页响应参数
export interface ResPage<T> {
  list: T[]
  page: number
  limit: number
  total: number
}

// * 分页请求参数
export interface ReqPage {
  page: number
  limit: number
}

// * 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
  }
  export interface ResLogin {
    access_token: string
    user: {
      id: number
      username: string
      phone: string
      nickname: string
      avatarUrl: string
      tenantId: number
      role: number // 1: 超级管理员, 2: 租户管理员, 3: 普通用户
      status: number
      permissions?: string // JSON字符串，存储用户权限
    }
  }
}

// * 管理员管理模块
export namespace SysManager {
  export interface ReqGetManagerParams extends ReqPage {
    username?: string
    phone?: string
    nickname?: string
    tenantId?: number
    role?: number
    status?: number
  }

  export interface ResManagerList {
    id: number
    username: string
    phone: string
    nickname: string
    avatarUrl: string
    status: number
    createTime: string
    tenantId: number
    role: number
    permissions?: string // 保留权限字段
  }

  export interface ReqEditManagerParams {
    id?: number
    username: string
    phone?: string
    nickname?: string
    avatarUrl?: string
    status: number
    tenantId?: number
    role: number
    password?: string
    submitPassword?: string // 用于确认密码
    permissions?: string // 保留权限字段
  }

  export interface ReqEditPasswordParams {
    id: number
    oldPassword: string
    newPassword: string
  }
}
