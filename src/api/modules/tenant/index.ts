import { Tenant } from '@/api/interface'
import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 租户管理模块
 */

// * 创建租户
export const createTenantApi = (params: Tenant.TenantCreateDTO) => {
  return http.post<{ tenant_id: number }>(_API + '/tenants', params, {
    headers: { noLoading: false }
  })
}

// * 分页查询租户
export const getTenantPageApi = (params: Tenant.TenantQuery) => {
  return http.get<Tenant.TenantListResponse>(_API + '/tenants', params)
}

// * 更新租户
export const updateTenantApi = (params: Tenant.TenantUpdateDTO) => {
  return http.put<void>(_API + `/tenants/${params.tenantId}`, params, {
    headers: { noLoading: false }
  })
}

// * 更新租户状态
export const updateTenantStatusApi = (params: Tenant.TenantStatusDTO) => {
  return http.put<void>(_API + `/tenants/${params.tenantId}`, params, {
    headers: { noLoading: false }
  })
}

// * 删除租户
export const deleteTenantApi = (tenantId: number) => {
  return http.delete(_API + `/tenants/${tenantId}`)
}
