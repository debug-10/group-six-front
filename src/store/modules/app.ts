import { defineStore } from 'pinia'
import { pinia } from '../index'
import { AppState, ThemeProps, AssemblySizeType, UserinfoType } from '../interface'
import { DEFAULT_PRIMARY } from '@/configs/config'
import { getManagerInfoApi } from '@/api/modules/manager'

export const useAppStore = defineStore({
  id: 'AppState',
  state: (): AppState => ({
    token: '',
    userInfo: {}, // 登录信息存储字段-建议每个项目换一个字段，避免与其他项目冲突
    assemblySize: 'default', //"default", "large", "small"
    theme: {
      // 布局切换 ==>  纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns
      layout: 'vertical',
      // 默认 primary 主题颜色
      primary: DEFAULT_PRIMARY,
      // 深色模式
      isDark: false,
      // 灰色模式
      isGrey: false,
      // 色弱模式
      isWeak: false,
      // 折叠菜单
      isCollapse: false,
      // 面包屑导航
      breadcrumb: true,
      // 面包屑导航图标
      breadcrumbIcon: true,
      // 标签页
      tabs: true,
      // 标签页图标
      tabsIcon: true,
      // 页脚
      footer: true,
      // 当前页面是否全屏
      maximize: false,
      // 侧边栏反转 (目前仅支持 'vertical' 模式)
      asideInverted: true
    }
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserinfo(userinfo: UserinfoType) {
      this.userInfo = userinfo
    },
    setAssemblySizeSize(assemblySize: AssemblySizeType) {
      this.assemblySize = assemblySize
    },
    // Set GlobalState
    setTheme(...args: ObjToKeyValArray<ThemeProps>) {
      this.$patch({
        theme: {
          [args[0]]: args[1]
        }
      })
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        const { data } = await getManagerInfoApi()
        this.setUserinfo(data)
        return data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    // 登出
    logout() {
      this.setToken('')
      this.setUserinfo(null)
      // 清除其他状态...
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(pinia)
}
