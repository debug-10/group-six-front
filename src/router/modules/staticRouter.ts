import { RouteRecordRaw } from 'vue-router'

/**
 * staticRouter(静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login.vue'),
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/layouts/indexAsync.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled'
        }
      },
      // 系统管理
      {
        path: '/system',
        name: 'system',
        meta: {
          title: '系统管理',
          icon: 'Setting'
        },
        children: [
          {
            path: '/system/manager',
            name: 'systemManager',
            component: () => import('@/views/System/Manager.vue'),
            meta: {
              title: '管理员管理',
              icon: 'User'
            }
          },
          {
            path: '/system/role',
            name: 'systemRole',
            component: () => import('@/views/System/Role.vue'),
            meta: {
              title: '权限管理',
              icon: 'Lock'
            }
          },
          {
            path: '/system/menu',
            name: 'systemMenu',
            component: () => import('@/views/System/Menu.vue'),
            meta: {
              title: '菜单管理',
              icon: 'Menu'
            }
          }
        ]
      },
      // 平台管理
      {
        path: '/platform',
        name: 'platform',
        meta: {
          title: '平台管理',
          icon: 'Monitor'
        },
        children: [
          {
            path: '/platform/version',
            name: 'platformVersion',
            component: () => import('@/views/Platform/Version.vue'),
            meta: {
              title: '版本管理',
              icon: 'Promotion'
            }
          }
        ]
      },
      // 租户管理
      {
        path: '/tenant',
        name: 'tenant',
        meta: {
          title: '租户管理',
          icon: 'OfficeBuilding'
        },
        children: [
          {
            path: '/tenant/school',
            name: 'tenantSchool',
            component: () => import('@/views/Tenant/TenantManage.vue'),
            meta: {
              title: '学校管理',
              icon: 'School'
            }
          },
          {
            path: '/tenant/package',
            name: 'tenantPackage',
            component: () => import('@/views/Tenant/PackageManage.vue'),
            meta: {
              title: '套餐管理',
              icon: 'Wallet'
            }
          }
          // ... 其他租户管理子路由
        ]
      },
      // 设备管理
      {
        path: '/device',
        name: 'device',
        component: () => import('@/views/Device/DeviceManage.vue'),
        meta: {
          title: '设备管理',
          icon: 'Monitor'
        }
      },
      // 统计管理
      {
        path: '/statistics',
        name: 'statistics',
        meta: {
          title: '统计管理',
          icon: 'DataAnalysis'
        },
        children: [
          {
            path: '/statistics/tenant',
            name: 'statisticsTenant',
            component: () => import('@/views/IoT/Statistics/Device.vue'),
            meta: {
              title: '数据大屏',
              icon: 'PieChart'
            }
          }
          // ... 其他统计管理子路由
        ]
      }
      // App管理
      // {
      //   path: '/app',
      //   name: 'app',
      //   meta: {
      //     title: 'App管理',
      //     icon: 'Iphone'
      //   },
      //   children: [
      //     {
      //       path: '/app/user',
      //       name: 'appUser',
      //       component: () => import('@/views/User/index.vue'),
      //       meta: {
      //         title: '用户管理',
      //         icon: 'User'
      //       }
      //     },
      //     {
      //       path: '/app/version',
      //       name: 'appVersion',
      //       component: () => import('@/views/App/Version.vue'),
      //       meta: {
      //         title: '版本管理',
      //         icon: 'Promotion'
      //       }
      //     }
      //   ]
      // }
    ]
  }
]

/**
 * errorRouter(错误页面路由)
 */
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/Error/403.vue'),
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/Error/404.vue'),
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/Error/500.vue'),
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue')
  }
]
