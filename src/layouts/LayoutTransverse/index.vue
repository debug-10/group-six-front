<!-- 横向布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
        <span class="logo-text"> 资源管理系统</span>
      </div>
      <el-menu mode="horizontal" :default-active="activeMenu" :router="false" :unique-opened="true">
        <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem.children?.length" :index="subItem.path + 'el-sub-menu'" :key="subItem.path">
            <template #title>
              <el-icon>
                <component :is="subItem.meta.icon"></component>
              </el-icon>
              <span>{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menuList="subItem.children" />
          </el-sub-menu>
          <el-menu-item v-else :index="subItem.path" :key="subItem.path + 'el-menu-item'" @click="handleClickMenu(subItem)">
            <el-icon>
              <component :is="subItem.meta.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ subItem.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<script setup lang="ts" name="layoutTransverse">
import { computed } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'
import { useRoute, useRouter } from 'vue-router'
import Main from '@/layouts/components/Main/index.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()
const menuList = computed(() => permissionStore.getShowMenuList)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
