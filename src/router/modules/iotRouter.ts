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
      // 物联大屏
      {
        path: '/iot/dashboard',
        name: 'iotDashboard',
        component: () => import('@/views/IoT/Dashboard/Dashboard.vue'),
        meta: {
          title: '物联大屏',
          icon: 'DataBoard'
        }
      },
      // 用户管理
      {
        path: '/iot/admin/accountmanage',
        name: 'iotAdminAccount',
        component: () => import('/src/views/IoT/Admin/AccountManage.vue'),
        meta: {
          title: '用户管理',
          icon: 'User'
        }
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
      // 公告管理
      {
        path: '/iot/news',
        name: 'iotNews',
        component: () => import('@/views/IoT/News/NewsManage.vue'),
        meta: {
          title: '公告管理',
          icon: 'Document'
        }
      }
    ]
  }
]
