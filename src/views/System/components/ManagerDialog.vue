<template>
  <Dialog :model-value="dialogVisible" :title="dialogProps.title" :fullscreen="dialogProps.fullscreen" :max-height="dialogProps.maxHeight" :cancel-dialog="cancelDialog">
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item v-if="dialogProps.title !== '重置'" label="用户名" prop="username">
          <el-input v-model="dialogProps.row!.username" placeholder="请填写用户名（2-20字）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="昵称" prop="nickname">
          <el-input v-model="dialogProps.row!.nickname" placeholder="请填写昵称" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="手机号" prop="phone">
          <el-input v-model="dialogProps.row!.phone" placeholder="请填写手机号" clearable></el-input>
        </el-form-item>
        <!-- 移除头像上传部分 -->
        <el-form-item v-if="dialogProps.title !== '重置'" label="头像URL" prop="avatarUrl">
          <el-input v-model="dialogProps.row!.avatarUrl" placeholder="请填写头像URL" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title === '新增' || dialogProps.title === '重置'" label="密码" prop="password">
          <el-input v-model="dialogProps.row!.password" show-password type="password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title === '新增' || dialogProps.title === '重置'" label="确认密码" prop="submitPassword">
          <el-input v-model="dialogProps.row!.submitPassword" show-password type="password" placeholder="请再次填写密码"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="角色" prop="role">
          <el-select v-model="dialogProps.row!.role" filterable placeholder="请选择角色" class="w-full">
            <el-option label="超级管理员" :value="1" />
            <el-option label="租户管理员" :value="2" />
            <el-option label="普通用户" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '重置'" label="状态" prop="status">
          <el-radio-group v-model="dialogProps.row!.status">
            <el-radio :label="1" border>正常</el-radio>
            <el-radio :label="0" border>停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
// 移除 UploadImg 导入
import { getManagerInfoApi } from '@/api/modules/manager'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { status: 1, role: 3 },
  labelWidth: 160,
  fullscreen: true,
  maxHeight: '500px'
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '字数为2-20个字' }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '密码不能为空'
    }
  ],
  submitPassword: [
    {
      required: true,
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value) {
          return callback(new Error('确认密码不能为空'))
        }
        if (dialogProps.value.row.password && dialogProps.value.row.submitPassword && dialogProps.value.row.password !== dialogProps.value.row.submitPassword) {
          return callback(new Error('两次输入的密码不一致'))
        }
        return callback()
      },
      trigger: ['blur']
    }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(dialogProps.value.row).then((_) => {
        // 如果被编辑的是当前用户，则刷新
        if (dialogProps.value.row.id === appStore.$state.userInfo.id)
          getManagerInfoApi().then((res) => {
            appStore.setUserinfo(res.data)
          })
      })
      ElMessage.success({ message: `${dialogProps.value.title}管理员成功！` })
      dialogProps.value.getTableList!()
      dialogVisible.value = false
      ruleFormRef.value!.resetFields()
      cancelDialog(true)
    } catch (error) {
      console.log(error)
    }
  })
}

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = { status: 1, role: 3 }
    ruleFormRef.value!.resetFields()
  }
}
</script>

<style scoped lang="less"></style>
