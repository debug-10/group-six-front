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
        <el-form-item label="标题" prop="title">
          <el-input v-model="dialogProps.row!.title" placeholder="请填写公告标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="dialogProps.row!.content" type="textarea" rows="6" placeholder="请填写公告内容" clearable></el-input>
        </el-form-item>
        <el-form-item label="可见范围" prop="visibleRange">
          <el-radio-group v-model="dialogProps.row!.visibleRange">
            <el-radio :label="1" border>所有用户可见</el-radio>
            <el-radio :label="2" border>指定租户可见</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId" v-if="dialogProps.row!.visibleRange === 2">
          <el-input v-model="dialogProps.row!.tenantId" placeholder="请填写租户ID" clearable></el-input>
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
import { ref, reactive, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { addNews, updateNews, getNewsById } from '@/api/modules/news'
import { News } from '@/api/modules/news'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: Partial<News.NewsVO & { content?: string }>
  labelWidth?: number
  maxHeight?: number | string
  getTableList?: () => void
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { visibleRange: 1 }, // 默认值为1，对应"所有用户可见"
  labelWidth: 100,
  fullscreen: false,
  maxHeight: '500px'
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
  // 如果是查看或编辑，需要获取详细信息
  if (params.title === '查看' || params.title === '编辑') {
    if (params.row.id) {
      getNewsById(params.row.id).then((res) => {
        dialogProps.value.row = { ...dialogProps.value.row, ...res.data }
      })
    }
  }
}

defineExpose({
  acceptParams
})

// 监听可见范围变化，当不是指定租户可见时，清空租户ID
watch(
  () => dialogProps.value.row.visibleRange,
  (newVal) => {
    if (newVal !== 2 && dialogProps.value.row.tenantId) {
      dialogProps.value.row.tenantId = undefined
    }
  }
)

const rules = reactive({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度为2-100个字符', trigger: 'blur' }
  ],
  content: { required: true, message: '内容不能为空', trigger: 'blur' },
  visibleRange: { required: true, message: '请选择可见范围', trigger: 'change' },
  tenantId: { required: true, message: '指定租户可见时，租户ID不能为空', trigger: 'blur' }
})

const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      if (dialogProps.value.title === '新增') {
        const params: News.ReqCreateNewsParams = {
          title: dialogProps.value.row.title!,
          content: dialogProps.value.row.content!,
          visibleRange: dialogProps.value.row.visibleRange!,
          tenantId: dialogProps.value.row.tenantId
        }
        await addNews(params)
        ElMessage.success('新增公告成功！')
      } else if (dialogProps.value.title === '编辑') {
        const params: News.ReqUpdateNewsParams = {
          id: dialogProps.value.row.id!,
          title: dialogProps.value.row.title,
          content: dialogProps.value.row.content,
          visibleRange: dialogProps.value.row.visibleRange,
          tenantId: dialogProps.value.row.tenantId
        }
        await updateNews(dialogProps.value.row.id!, params)
        ElMessage.success('编辑公告成功！')
      }
      dialogProps.value.getTableList?.()
      dialogVisible.value = false
      resetForm()
    } catch (error) {
      console.error(error)
    }
  })
}

const cancelDialog = () => {
  dialogVisible.value = false
  resetForm()
}

const resetForm = () => {
  dialogProps.value.row = { visibleRange: 1 } // 默认值为1
  ruleFormRef.value?.resetFields()
}
</script>

<style scoped lang="less">
.w-full {
  width: 100%;
}
</style>
