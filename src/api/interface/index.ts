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

// * 设备管理模块
export namespace Device {
  export interface DeviceCreateDTO {
    deviceMac: string
    name: string
    type: number
    tenantId: number
    status: number
    temperature: number
    humidity: number
    location: string
  }

  export interface DeviceUpdateDTO {
    id: number
    name: string
    status: number
    temperature: number
    humidity: number
    location: string
  }

  export interface DeviceStatusDTO {
    id: number
    status: number
  }

  export interface DeviceQuery extends ReqPage {
    userId?: number
    tenantId?: number
    status?: number
    type?: number
  }

  export interface DeviceVO {
    id: number
    deviceMac: string
    name: string
    type: number
    status: number
    temperature: number
    humidity: number
    tenantId: number
    createTime: string
    updateTime: string
    location: string
  }

  export interface DevicePagination {
    total: number
    page: number
    limit: number
  }

  export interface DeviceListResponse {
    pagination: DevicePagination
    devices: DeviceVO[]
  }
}

// * 租户管理模块
export namespace Tenant {
  export interface TenantCreateDTO {
    tenantName: string
    packageType: number
    adminUsername: string
    status: number
    creatorId: number
  }

  export interface TenantUpdateDTO {
    tenantId: number
    tenantName: string
    packageType: number
    adminUsername: string
    status: number
  }

  export interface TenantStatusDTO {
    tenantId: number
    status: number
  }

  export interface TenantQuery extends ReqPage {
    creatorId?: number
    status?: number
    packageType?: number
  }

  export interface TenantVO {
    tenantId: number
    tenantName: string
    packageType: number
    status: number
    creatorId: number
    createTime: string
    updateTime: string
  }

  export interface TenantPagination {
    total: number
    page: number
    limit: number
  }

  export interface TenantListResponse {
    pagination: TenantPagination
    tenants: TenantVO[]
  }
}
