<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input :prefix-icon="User" v-model="loginForm.username" placeholder="用户名"> </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password" placeholder="密码" show-password autocomplete="new-password"> </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading"> 登录 </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Login } from '@/api/interface/index'
import { ElNotification } from 'element-plus'
import { loginApi } from '@/api/modules/login'
import { useAppStoreWithOut } from '@/store/modules/app'
import { getTimeState } from '@/utils/util'
import type { ElForm } from 'element-plus'
import { usePermissionStore } from '@/store/modules/permission'

const { push } = useRouter()
const route = useRoute()
const appStore = useAppStoreWithOut()

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({ username: '', password: '' })

const permissionStore = usePermissionStore()

const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // 1.执行登录接口
      const { data } = await loginApi(loginForm)
      console.log('登录返回数据:', data)

      // 2.保存token
      appStore.setToken(data.access_token)

      // 3.保存用户信息
      if (data.user) {
        appStore.setUserinfo(data.user)
      }

      // 4.根据用户角色初始化权限和菜单
      permissionStore.setPermissionByRole()

      // 5.根据用户角色跳转到不同的首页
      let redirectPath = '/home'
      if (data.user?.role === 1) {
        // 超管跳转到管理后台首页
        redirectPath = '/home'
      } else if (data.user?.role === 2) {
        // 租户管理员跳转到物联平台首页
        redirectPath = '/iot/dashboard'
      }
      const redirect = route.query.redirect as string
      push(redirect || redirectPath)

      ElNotification({
        title: getTimeState(),
        message: '登录成功',
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('登录失败:', error)
      ElNotification({
        title: '登录失败',
        message: error.message || '用户名或密码错误',
        type: 'error',
        duration: 3000
      })
    } finally {
      loading.value = false
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="less">
@import '../index.less';
</style>
