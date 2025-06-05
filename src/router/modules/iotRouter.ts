import { RouteRecordRaw } from 'vue-router'

/**
 * iotRouter(物联平台路由)
 */
export const iotRouter: RouteRecordRaw[] = [
  {
    path: '/iot',
    name: 'iot',
    component: () => import('@/layouts/indexAsync.vue'),
    redirect: '/iot/dashboard',
    meta: {
      title: '物联平台',
      icon: 'Platform'
    },
    children: [
      {
        path: '/iot/dashboard',
        name: 'iotDashboard',
        component: () => import('@/views/IoT/Dashboard/Dashboard.vue'),
        meta: {
          title: '物联大屏',
          icon: 'DataBoard'
        }
      },
      // 管理员管理
      {
        path: '/iot/admin',
        name: 'iotAdmin',
        meta: {
          title: '管理员管理',
          icon: 'UserFilled'
        },
        children: [
          {
            path: '/iot/admin/account',
            name: 'iotAdminAccount',
            component: () => import('@/views/IoT/Admin/AccountManage.vue'),
            meta: {
              title: '账号管理',
              icon: 'User'
            }
          },
          {
            path: '/iot/admin/device-bind',
            name: 'iotAdminDeviceBind',
            component: () => import('@/views/IoT/Admin/DeviceBind.vue'),
            meta: {
              title: '设备绑定',
              icon: 'Link'
            }
          }
        ]
      },
      // 设备管理
      {
        path: '/iot/device',
        name: 'iotDevice',
        component: () => import('@/views/IoT/Device/DeviceManage.vue'),
        meta: {
          title: '设备管理',
          icon: 'Monitor'
        }
      },
      // 设备对接
      {
        path: '/iot/device-connect',
        name: 'iotDeviceConnect',
        meta: {
          title: '设备对接',
          icon: 'Connection'
        },
        children: [
          {
            path: '/iot/device-connect/camera',
            name: 'iotDeviceCamera',
            component: () => import('@/views/IoT/DeviceConnect/Camera.vue'),
            meta: {
              title: '摄像头',
              icon: 'VideoCamera'
            }
          },
          {
            path: '/iot/device-connect/access',
            name: 'iotDeviceAccess',
            component: () => import('@/views/IoT/DeviceConnect/Access.vue'),
            meta: {
              title: '门禁',
              icon: 'Key'
            }
          },
          {
            path: '/iot/device-connect/air',
            name: 'iotDeviceAir',
            component: () => import('@/views/IoT/DeviceConnect/Air.vue'),
            meta: {
              title: '空调',
              icon: 'Wind'
            }
          },
          {
            path: '/iot/device-connect/temperature',
            name: 'iotDeviceTemperature',
            component: () => import('@/views/IoT/DeviceConnect/Temperature.vue'),
            meta: {
              title: '温湿度',
              icon: 'Thermometer'
            }
          },
          {
            path: '/iot/device-connect/smoke',
            name: 'iotDeviceSmoke',
            component: () => import('@/views/IoT/DeviceConnect/Smoke.vue'),
            meta: {
              title: '烟感',
              icon: 'Warning'
            }
          },
          {
            path: '/iot/device-connect/light',
            name: 'iotDeviceLight',
            component: () => import('@/views/IoT/DeviceConnect/Light.vue'),
            meta: {
              title: '灯光',
              icon: 'Sunny'
            }
          },
          {
            path: '/iot/device-connect/switch',
            name: 'iotDeviceSwitch',
            component: () => import('@/views/IoT/DeviceConnect/Switch.vue'),
            meta: {
              title: '开关',
              icon: 'Switch'
            }
          }
        ]
      },
      // 告警管理
      {
        path: '/iot/alarm',
        name: 'iotAlarm',
        component: () => import('@/views/IoT/Alarm/AlarmManage.vue'),
        meta: {
          title: '告警',
          icon: 'Bell'
        }
      },
      // 统计管理
      {
        path: '/iot/statistics',
        name: 'iotStatistics',
        meta: {
          title: '统计管理',
          icon: 'DataAnalysis'
        },
        children: [
          {
            path: '/iot/statistics/device',
            name: 'iotStatisticsDevice',
            component: () => import('@/views/IoT/Statistics/DeviceStatistics.vue'),
            meta: {
              title: '设备统计',
              icon: 'Monitor'
            }
          },
          {
            path: '/iot/statistics/user',
            name: 'iotStatisticsUser',
            component: () => import('@/views/IoT/Statistics/UserStatistics.vue'),
            meta: {
              title: '用户统计',
              icon: 'User'
            }
          },
          {
            path: '/iot/statistics/alarm',
            name: 'iotStatisticsAlarm',
            component: () => import('@/views/IoT/Statistics/AlarmStatistics.vue'),
            meta: {
              title: '告警统计',
              icon: 'Warning'
            }
          }
        ]
      },
      // 资讯管理
      {
        path: '/iot/news',
        name: 'iotNews',
        component: () => import('@/views/IoT/News/NewsManage.vue'),
        meta: {
          title: '资讯管理',
          icon: 'Document'
        }
      }
    ]
  }
]
