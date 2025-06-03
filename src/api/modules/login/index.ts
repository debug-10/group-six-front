import { Login } from '@/api/interface/index'
import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 登录模块
 */
// * 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(_API + '/sys/auth/login', params, {
    headers: { noLoading: true }
  })
}

// * 用户退出登录
export const logoutApi = () => {
  return http.post(_API + '/sys/auth/logout')
}

// * 获取当前用户信息
export const getUserInfoApi = () => {
  return http.post<Login.ResLogin['user']>(_API + '/sys/auth/userinfo', {}, { headers: { noLoading: true } })
}
