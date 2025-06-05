import { ResPage } from '@/api/interface'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

// 定义新闻管理相关接口类型
export namespace News {
  // 新闻列表请求参数
  export interface ReqNewsParams {
    page?: number
    limit?: number
    title?: string
    visibleRange?: number
    tenantId?: number
  }

  // 新闻列表响应数据
  export interface NewsVO {
    id: number
    title: string
    // 移除content字段，与后端保持一致
    visibleRange?: number // 改为可选
    tenantId?: number
    createTime: string // 后端使用LocalDateTime，前端使用string
    // 添加租户名称字段
    tenantName?: string
  }

  // 新闻详情响应数据
  export interface NewsDetailVO extends NewsVO {
    content: string
  }

  // 新增新闻请求参数
  export interface ReqCreateNewsParams {
    title: string
    content: string
    visibleRange: number
    tenantId?: number
  }

  // 编辑新闻请求参数
  export interface ReqUpdateNewsParams {
    id: number
    title?: string
    content?: string
    visibleRange?: number
    tenantId?: number
  }
}

/**
 * @name 公告管理模块
 */
// * 获取公告列表
export const getNewsList = (params: News.ReqNewsParams) => {
  return http.get<ResPage<News.NewsVO>>(_API + `/api/news/list`, params)
}

// * 获取公告详情
export const getNewsById = (id: number) => {
  return http.get<News.NewsDetailVO>(_API + `/api/news/${id}`)
}

// * 新增公告
export const addNews = (params: News.ReqCreateNewsParams) => {
  return http.post<number>(_API + `/api/news`, params)
}

// * 编辑公告
export const updateNews = (id: number, params: News.ReqUpdateNewsParams) => {
  return http.put(_API + `/api/news/${id}`, params)
}

// * 删除公告
export const deleteNews = (id: number) => {
  return http.delete(_API + `/api/news/${id}`)
}
