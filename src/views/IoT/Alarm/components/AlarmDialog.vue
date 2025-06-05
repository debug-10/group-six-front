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
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="dialogProps.row!.deviceId" placeholder="请填写设备ID" clearable :disabled="dialogProps.isView"></el-input>
        </el-form-item>

        <el-form-item label="告警类型" prop="type">
          <el-select v-model.number="dialogProps.row!.type" placeholder="请选择告警类型" clearable style="width: 100%" :disabled="dialogProps.isView">
            <el-option label="离线" :value="1"></el-option>
            <el-option label="警报" :value="2"></el-option>
            <el-option label="损坏" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警级别" prop="level">
          <el-select v-model.number="dialogProps.row!.level" placeholder="请选择告警级别" clearable style="width: 100%" :disabled="dialogProps.isView">
            <el-option label="低" :value="1"></el-option>
            <el-option label="中" :value="2"></el-option>
            <el-option label="高" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警信息" prop="message">
          <el-input v-model="dialogProps.row!.message" type="textarea" rows="6" placeholder="请填写告警信息" clearable :disabled="dialogProps.isView"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model.number="dialogProps.row!.status" placeholder="请选择状态" clearable style="width: 100%" :disabled="dialogProps.isView">
            <el-option label="未处理" :value="0"></el-option>
            <el-option label="已处理" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">
          {{ dialogProps.title === '新增' ? '创建' : '保存' }}
        </el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { addAlarm, updateAlarm, getAlarmById } from '@/api/modules/alarm'
import { Alarm } from '@/api/modules/alarm'

// 告警类型枚举
const ALARM_TYPE = {
  OFFLINE: 1,
  ALERT: 2,
  DAMAGE: 3
}

interface DialogProps {
  title: '新增' | '编辑' | '查看'
  isView: boolean
  fullscreen?: boolean
  row: Partial<Alarm.AlarmVO> & {
    type?: number
    level?: number
    status?: number
  }
  labelWidth?: number
  maxHeight?: number | string
  getTableList?: () => void
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '新增',
  row: {
    status: 0,
    level: 1,
    type: ALARM_TYPE.OFFLINE
  },
  labelWidth: 120,
  maxHeight: '600px',
  fullscreen: false
})

// 接收参数并处理数据
const acceptParams = (params: DialogProps): void => {
  console.log('接收的参数:', params)

  dialogProps.value = {
    ...dialogProps.value,
    ...params,
    isView: params.title === '查看'
  }

  dialogVisible.value = true

  if (['编辑', '查看'].includes(params.title)) {
    const id = Number(params.row.id)

    if (isNaN(id) || id <= 0) {
      ElMessage.error('无效的告警ID')
      dialogVisible.value = false
      return
    }

    getAlarmById(id)
      .then((res) => {
        console.log('接口返回的数据:', res.data)

        // 从嵌套结构中获取alarm对象
        const alarmData = res.data.alarm

        dialogProps.value.row = {
          id: id,
          deviceId: alarmData.deviceId || '',
          type: Number(alarmData.type) || ALARM_TYPE.OFFLINE,
          level: Number(alarmData.level) || 1,
          status: Number(alarmData.status) || 0,
          message: alarmData.message || ''
        }
      })
      .catch(() => {
        ElMessage.error('获取告警详情失败')
        dialogVisible.value = false
      })
  } else if (params.title === '新增') {
    dialogProps.value.row = {
      ...dialogProps.value.row,
      id: undefined,
      deviceId: '',
      message: ''
    }
  }
}

defineExpose({ acceptParams })

// 表单验证规则
const rules = reactive({
  deviceId: [{ required: true, message: '设备ID不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
  level: [{ required: true, message: '请选择告警级别', trigger: 'change' }],
  message: [
    { required: true, message: '告警信息不能为空', trigger: 'blur' },
    { min: 10, message: '告警信息至少10字', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

const ruleFormRef = ref<FormInstance>()

// 提交表单
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return

    try {
      const { id, ...formData } = dialogProps.value.row

      // 确保枚举值为数字类型
      formData.type = Number(formData.type)
      formData.level = Number(formData.level)
      formData.status = Number(formData.status)

      if (dialogProps.value.title === '新增') {
        await addAlarm(formData as Alarm.ReqCreateAlarmParams)
        ElMessage.success('告警创建成功！')
      } else if (dialogProps.value.title === '编辑') {
        // 确保ID为数字类型
        if (isNaN(Number(id))) {
          throw new Error('无效的告警ID')
        }

        await updateAlarm(id! as number, formData as Alarm.ReqUpdateAlarmParams)
        ElMessage.success('告警更新成功！')
      }

      dialogProps.value.getTableList?.() // 刷新表格
      dialogVisible.value = false // 关闭弹窗
    } catch (error) {
      ElMessage.error('操作失败：' + (error.message || '请检查输入'))
      console.error(error)
    }
  })
}

// 取消对话框
const cancelDialog = () => {
  dialogVisible.value = false
}
</script>

<style scoped lang="less">
.w-full {
  width: 100%;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-textarea__inner {
  min-height: 120px;
}

.el-select {
  width: 100%;
}
</style>
