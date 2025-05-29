import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 分类管理模块
 */
export const CategoryApi = {
  // 查询用户列表
  page: (params: any) => http.post(_API + '/category/page', params),
  // 添加分类
  add: (params: any) => http.post(_API + '/category/add', params),
  // 编辑分类
  edit: (params: any) => http.post(_API + '/category/edit', params),
  // 删除分类
  delete: (params: number[]) => http.post(_API + '/category/remove', params)
}
