import http from '@/api'
import { _API } from '@/api/axios/servicePort'
import { ElMessage } from 'element-plus'

export namespace PackageAPI {
  export interface PackageItem {
    packageId: number
    permissions: number[]
  }
}

export const getPackageList = async () => {
  try {
    console.log('Requesting package list:', _API + '/api/packages')
    const res = await http.get<PackageAPI.PackageItem[]>(_API + '/api/packages')
    console.log('Raw response:', res)
    const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
    const list = data.map((item) => {
      try {
        return {
          ...item,
          permissions: typeof item.permissions === 'string' && item.permissions ? JSON.parse(item.permissions) : Array.isArray(item.permissions) ? item.permissions : []
        }
      } catch (e) {
        console.error(`Failed to parse permissions for package ${item.packageId}:`, e)
        return { ...item, permissions: [] }
      }
    })
    console.log('Parsed package list:', list)
    return { data: list }
  } catch (error: any) {
    console.error('Get package list error:', error.message, error.response?.data)
    ElMessage.error('获取套餐列表失败')
    throw error
  }
}

export const getPackageById = async (id: number) => {
  try {
    const res = await http.get<PackageAPI.PackageItem>(_API + `/api/packages/${id}`)
    const data = {
      ...res.data,
      permissions:
        typeof res.data.permissions === 'string' && res.data.permissions ? JSON.parse(res.data.permissions) : Array.isArray(res.data.permissions) ? res.data.permissions : []
    }
    return { data }
  } catch (error: any) {
    console.error('Get package by id error:', error.message, error.response?.data)
    ElMessage.error('获取套餐详情失败')
    throw error
  }
}

export const createPackage = async (data: PackageAPI.PackageItem) => {
  try {
    const res = await http.post<boolean>(_API + '/api/packages', {
      ...data,
      permissions: JSON.stringify(data.permissions)
    })
    return res
  } catch (error: any) {
    console.error('Create package error:', error.message, error.response?.data)
    ElMessage.error('创建套餐失败')
    throw error
  }
}

export const updatePackage = async (id: number, data: PackageAPI.PackageItem) => {
  try {
    const res = await http.put<boolean>(_API + `/api/packages/${id}`, {
      ...data,
      permissions: JSON.stringify(data.permissions)
    })
    return res
  } catch (error: any) {
    console.error('Update package error:', error.message, error.response?.data)
    ElMessage.error('更新套餐失败')
    throw error
  }
}

export const deletePackage = async (id: number) => {
  try {
    const res = await http.delete<boolean>(_API + `/api/packages/${id}`)
    return res
  } catch (error: any) {
    console.error('Delete package error:', error.message, error.response?.data)
    ElMessage.error('删除套餐失败')
    throw error
  }
}
