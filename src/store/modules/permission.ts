import { defineStore } from 'pinia'
import { pinia } from '../index'
import { PermissionState } from '../interface'
import { useAppStoreWithOut } from './app'
import { getShowMenuList } from '@/utils/util'

export const usePermissionStore = defineStore({
  id: 'PermissionState',
  // 修改第11行的默认首页路径
  state: (): PermissionState => ({
    routeName: '',
    homePath: '/home',
    buttonList: [],
    menuList: [],
    breadcrumbList: {}
  }),
  getters: {
    getMenuList: (state) => state.menuList,
    getBreadcrumbList: (state) => state.breadcrumbList,
    getShowMenuList: (state) => getShowMenuList(state.menuList),
    getFlatMenuList: (state) => {
      // 扁平化菜单列表
      const flatMenuList: any[] = []
      const flattenMenu = (menus: any[]) => {
        menus.forEach((menu) => {
          if (menu.children && menu.children.length > 0) {
            flattenMenu(menu.children)
          } else {
            flatMenuList.push(menu)
          }
        })
      }
      flattenMenu(state.menuList)
      return flatMenuList
    },
    getAuthButtonList: (_state) => {
      return {
        systemManager: {
          add: true,
          edit: true,
          delete: true,
          status: true,
          export: true,
          view: true,
          'reset-psw': true,
          'assign-role': true,
          remove: true
        },
        systemRole: {
          add: true,
          edit: true,
          delete: true
        }
        // 可以根据需要添加其他页面的按钮权限
      }
    }
  },
  actions: {
    // 根据用户角色设置菜单和权限
    setPermissionByRole() {
      const appStore = useAppStoreWithOut()
      const userInfo = appStore.userInfo

      if (!userInfo || !userInfo.role) {
        this.menuList = []
        this.buttonList = []
        return
      }

      // 运营平台菜单配置
      this.menuList = [
        {
          path: '/system',
          name: 'system',
          component: 'Layout',
          meta: {
            title: '系统管理',
            icon: 'Setting'
          },
          children: [
            {
              path: '/system/manager',
              name: 'manager',
              component: '/System/Manager',
              meta: {
                title: '管理员管理',
                icon: 'User'
              }
            },
            {
              path: '/system/role',
              name: 'role',
              component: '/System/Role',
              meta: {
                title: '权限管理',
                icon: 'Lock'
              }
            },
            {
              path: '/system/menu',
              name: 'menu',
              component: '/System/Menu',
              meta: {
                title: '菜单管理',
                icon: 'Menu'
              }
            }
          ]
        },
        {
          path: '/platform',
          name: 'platform',
          component: 'Layout',
          meta: {
            title: '平台管理',
            icon: 'Platform'
          },
          children: [
            {
              path: '/platform/version',
              name: 'platformVersion',
              component: '/Platform/Version',
              meta: {
                title: '版本管理',
                icon: 'Document'
              }
            },
            {
              path: '/platform/protocol',
              name: 'protocol',
              component: '/Platform/ProtocolView',
              meta: {
                title: '协议管理',
                icon: 'Document'
              }
            }
          ]
        },
        {
          path: '/tenant',
          name: 'tenant',
          component: 'Layout',
          meta: {
            title: '租户管理',
            icon: 'OfficeBuilding'
          },
          children: [
            {
              path: '/tenant/school',
              name: 'school',
              component: '/Tenant/School',
              meta: {
                title: '学校管理',
                icon: 'School'
              }
            },
            {
              path: '/tenant/community',
              name: 'community',
              component: '/Tenant/Community',
              meta: {
                title: '小区管理',
                icon: 'House'
              }
            },
            {
              path: '/tenant/station',
              name: 'station',
              component: '/Tenant/Station',
              meta: {
                title: '驿站管理',
                icon: 'Location'
              }
            }
          ]
        },
        {
          path: '/device',
          name: 'device',
          component: '/Device/DeviceManage',
          meta: {
            title: '设备管理',
            icon: 'Monitor'
          }
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: 'Layout',
          meta: {
            title: '统计管理',
            icon: 'DataAnalysis'
          },
          children: [
            {
              path: '/statistics/tenant',
              name: 'tenantStats',
              component: '/Statistics/TenantStats',
              meta: {
                title: '租户统计',
                icon: 'PieChart'
              }
            },
            {
              path: '/statistics/device',
              name: 'deviceStats',
              component: '/Statistics/DeviceStats',
              meta: {
                title: '设备统计',
                icon: 'PieChart'
              }
            },
            {
              path: '/statistics/user',
              name: 'userStats',
              component: '/Statistics/UserStats',
              meta: {
                title: '用户统计',
                icon: 'PieChart'
              }
            },
            {
              path: '/statistics/alarm',
              name: 'alarmStats',
              component: '/Statistics/AlarmStats',
              meta: {
                title: '告警统计',
                icon: 'Warning'
              }
            }
          ]
        },
        {
          path: '/app',
          name: 'app',
          component: 'Layout',
          meta: {
            title: 'App管理',
            icon: 'Iphone'
          },
          children: [
            {
              path: '/app/user',
              name: 'appUser',
              component: '/User/UserManage',
              meta: {
                title: '用户管理',
                icon: 'User'
              }
            },
            {
              path: '/app/version',
              name: 'appVersion',
              component: '/App/Version',
              meta: {
                title: '版本管理',
                icon: 'Document'
              }
            }
          ]
        }
      ]

      // 修改第243-254行的角色首页路径设置
      // 根据角色设置首页路径
      switch (userInfo.role) {
        case 1: // 超级管理员
          this.homePath = '/admin/home'
          break
        case 2: // 租户管理员
          this.homePath = '/tenant/home'
          break
        case 3: // 普通用户
          this.homePath = '/user/home'
          break
        default:
          this.homePath = '/home'
      }

      // 如果用户有自定义权限，解析权限JSON
      if (userInfo.permissions) {
        try {
          const permissions = JSON.parse(userInfo.permissions)
          this.buttonList = permissions.buttons || []
        } catch (error) {
          console.error('解析用户权限失败:', error)
          this.buttonList = []
        }
      }
    },

    // 检查按钮权限
    checkButtonAuth(key: string): boolean {
      return this.buttonList.includes(key)
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(pinia)
}
