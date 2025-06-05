import { ResultData } from '@/api/interface'
import request from './axios/reuqest'

export default {
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return request.service.post(url, params, _object)
  },
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return request.service.get(url, { params, ..._object })
  },
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return request.service.put(url, params, _object)
  },
  delete<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return request.service.delete(url, { params, ..._object })
  }
}
