import { defineStore } from 'pinia'
import { pinia } from '../index'
import { PermissionState } from '../interface'
import { useAppStoreWithOut } from './app'
import { getShowMenuList } from '@/utils/util'

// 在 store 定义之前定义菜单配置
const PLATFORM_CONFIGS = {
  // 运营平台配置
  OPERATION_MENUS: {
    homePath: '/home',
    menuList: [
      {
        path: '/system',
        name: 'system',
        component: 'Layout',
        meta: {
          title: '系统管理',
          icon: 'Setting',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/system/manager',
            name: 'manager',
            component: '/System/Manager',
            meta: {
              title: '管理员管理',
              icon: 'User',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
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
          icon: 'Platform',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/platform/version',
            name: 'platformVersion',
            component: '/Platform/Version',
            meta: {
              title: '版本管理',
              icon: 'Document',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/platform/protocol',
            name: 'protocol',
            component: '/Platform/ProtocolView',
            meta: {
              title: '协议管理',
              icon: 'Document',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
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
          icon: 'OfficeBuilding',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/tenant/school',
            name: 'school',
            component: '/Tenant/School',
            meta: {
              title: '学校管理',
              icon: 'School',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/tenant/community',
            name: 'community',
            component: '/Tenant/Community',
            meta: {
              title: '小区管理',
              icon: 'House',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/tenant/station',
            name: 'station',
            component: '/Tenant/Station',
            meta: {
              title: '驿站管理',
              icon: 'Shop',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          }
        ]
      },
      {
        path: '/tenant',
        name: 'tenant',
        component: 'Layout',
        meta: {
          title: '设备管理',
          icon: 'OfficeBuilding',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: '/statistics',
        name: 'statistics',
        component: 'Layout',
        meta: {
          title: '统计管理',
          icon: 'DataAnalysis',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/statistics/station',
            name: 'stationStats',
            component: '/Statistics/StationStats',
            meta: {
              title: '驿站统计',
              icon: 'PieChart',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/statistics/device',
            name: 'deviceStats',
            component: '/Statistics/DeviceStats',
            meta: {
              title: '设备统计',
              icon: 'PieChart',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/statistics/user',
            name: 'userStats',
            component: '/Statistics/UserStats',
            meta: {
              title: '用户统计',
              icon: 'PieChart',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/statistics/alarm',
            name: 'alarmStats',
            component: '/Statistics/AlarmStats',
            meta: {
              title: '告警统计',
              icon: 'Warning',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
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
          icon: 'Iphone',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/app/user',
            name: 'appUser',
            component: '/User/UserManage',
            meta: {
              title: '用户管理',
              icon: 'User',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/app/version',
            name: 'appVersion',
            component: '/App/Version',
            meta: {
              title: '版本管理',
              icon: 'Document',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          }
        ]
      }
    ],
    buttonList: ['sys:manager:add', 'sys:manager:view', 'sys:manager:edit', 'sys:manager:assign-role', 'sys:manager:reset-psw', 'sys:manager:remove']
  },
  // 物联网平台配置
  IOT_MENUS: {
    homePath: '/iot/dashboard',
    menuList: [
      {
        path: '/iot-admin',
        name: 'iotAdmin',
        component: 'Layout',
        meta: {
          title: '管理员',
          icon: 'UserFilled',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/iot-admin/account',
            name: 'account',
            component: '/IoTAdmin/Account',
            meta: {
              title: '账号管理',
              icon: 'UserFilled',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/iot-admin/device-bind',
            name: 'deviceBind',
            component: '/IoTAdmin/DeviceBind',
            meta: {
              title: '设备绑定',
              icon: 'Connection',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          }
        ]
      },
      {
        path: '/iot-device',
        name: 'iotDevice',
        component: '/IoTDevice/DeviceManage',
        meta: {
          title: '设备管理',
          icon: 'Monitor',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: '/device-connect',
        name: 'deviceConnect',
        component: 'Layout',
        meta: {
          title: '设备对接',
          icon: 'Connection',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/device-connect/camera',
            name: 'camera',
            component: '/DeviceConnect/Camera',
            meta: {
              title: '摄像头',
              icon: 'VideoCamera',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/access',
            name: 'access',
            component: '/DeviceConnect/Access',
            meta: {
              title: '门禁',
              icon: 'Key',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/air',
            name: 'air',
            component: '/DeviceConnect/Air',
            meta: {
              title: '空调',
              icon: 'Wind',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/sensor',
            name: 'sensor',
            component: '/DeviceConnect/Sensor',
            meta: {
              title: '温湿度',
              icon: 'Thermometer',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/smoke',
            name: 'smoke',
            component: '/DeviceConnect/Smoke',
            meta: {
              title: '烟感',
              icon: 'Warning',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/light',
            name: 'light',
            component: '/DeviceConnect/Light',
            meta: {
              title: '灯光',
              icon: 'Sunny',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/device-connect/switch',
            name: 'switch',
            component: '/DeviceConnect/Switch',
            meta: {
              title: '开关',
              icon: 'Switch',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          }
        ]
      },
      {
        path: '/iot-alarm',
        name: 'iotAlarm',
        component: '/IoTAlarm/AlarmManage',
        meta: {
          title: '告警',
          icon: 'Warning',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: '/iot-statistics',
        name: 'iotStatistics',
        component: 'Layout',
        meta: {
          title: '统计管理',
          icon: 'DataAnalysis',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: '/iot-statistics/device',
            name: 'iotDeviceStats',
            component: '/IoTStatistics/DeviceStats',
            meta: {
              title: '设备统计',
              icon: 'PieChart',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/iot-statistics/user',
            name: 'iotUserStats',
            component: '/IoTStatistics/UserStats',
            meta: {
              title: '用户统计',
              icon: 'PieChart',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          },
          {
            path: '/iot-statistics/alarm',
            name: 'iotAlarmStats',
            component: '/IoTStatistics/AlarmStats',
            meta: {
              title: '告警统计',
              icon: 'Warning',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            }
          }
        ]
      },
      {
        path: '/iot/news', // 修改为与路由配置一致的路径
        name: 'iotNews',
        component: '/IoT/News/NewsManage', // 修改为正确的组件路径格式
        meta: {
          title: '资讯管理',
          icon: 'Document',
          isHide: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ],
    buttonList: []
  }
}

// 然后是 store 定义
export const usePermissionStore = defineStore({
  id: 'permission',
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
    // 简化后的 setPermissionByRole 方法
    setPermissionByRole() {
      const appStore = useAppStoreWithOut()
      const userInfo = appStore.userInfo

      if (!userInfo || !userInfo.role) {
        this.menuList = []
        this.buttonList = []
        this.homePath = '/'
        return
      }

      if (userInfo.role === 1) {
        // 管理员角色：可以访问两个平台，通过上级菜单分组
        this.menuList = [
          {
            path: '/operation-platform',
            name: 'operationPlatform',
            component: 'Layout',
            meta: {
              title: '运营平台',
              icon: 'Operation',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            },
            children: PLATFORM_CONFIGS.OPERATION_MENUS.menuList
          },
          {
            path: '/iot-platform',
            name: 'iotPlatform',
            component: 'Layout',
            meta: {
              title: '物联平台',
              icon: 'Monitor',
              isHide: false,
              isAffix: false,
              isKeepAlive: true
            },
            children: PLATFORM_CONFIGS.IOT_MENUS.menuList
          }
        ]
        this.buttonList = ['sys:manager:add', 'sys:manager:view', 'sys:manager:edit', 'sys:manager:assign-role', 'sys:manager:reset-psw', 'sys:manager:remove']
        this.homePath = '/home'
      } else if (userInfo.role === 2) {
        // 普通用户：只能访问物联平台
        this.menuList = PLATFORM_CONFIGS.IOT_MENUS.menuList
        this.buttonList = []
        this.homePath = '/iot/dashboard'
      } else {
        this.menuList = []
        this.buttonList = []
        this.homePath = '/'
      }
    },
    checkButtonAuth(key: string): boolean {
      return this.buttonList.includes(key)
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(pinia)
}
