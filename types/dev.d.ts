/** 用户信息 */
declare interface UserType {
  pkId: number
  wxOpenId: string
  account: string
  nickname: string
  avatar?: any
  phone: string
  gender: number
  birthday: string
  bonus: number
  remark: string
  deleteFlag: number
  createTime?: string
  updateTime?: string
  enabled: number
}

/** 用户分页请求参数信息 */
declare interface ReqPageUser {
  page: number
  limit: number
  order?: string
  asc?: boolean
  nickname?: string
  phone?: string
}
