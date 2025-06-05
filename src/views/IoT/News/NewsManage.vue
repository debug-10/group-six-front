<template>
  <div class="news-manage">
    <div class="table-box">
      <ProTable ref="proTable" title="公告管理" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增公告</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteNewsItem(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <NewsDialog ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="NewsManage">
import { ref, reactive } from 'vue'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import NewsDialog from './components/NewsDialog.vue'
import { CirclePlus, Download, View, EditPen, Delete } from '@element-plus/icons-vue'
import { useDownload } from '@/hooks/useDownload'
import { useHandleData } from '@/hooks/useHandleData'
import { getNewsList, deleteNews } from '@/api/modules/news'
import { News } from '@/api/modules/news'
import { ElMessage as _ElMessage } from 'element-plus'
// import { h } from 'vue'
// import { ElTag } from 'element-plus'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 如果表格需要初始化请求参数，直接定义传给 ProTable
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理
const dataCallback = (data: any) => {
  // 检查数据格式，如果data本身是数组，则直接使用
  const list = Array.isArray(data) ? data : data.list || []
  return {
    list: list,
    total: list.length, // 如果后端没有返回total，则使用数组长度
    pageNum: 1, // 默认页码
    pageSize: 10 // 默认每页条数
  }
}

// 获取 ProTable 元素，调用其获取刷新数据方法
const getTableList = (params: any) => {
  let newParams = { ...params }
  return getNewsList(newParams)
}

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'index', label: '公告id', width: 80 },
  {
    prop: 'title',
    label: '标题',
    search: { el: 'input' }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 250 }
])

// 下载文件
const downloadFile = () => {
  useDownload(getNewsList, '公告数据')
}

// 删除公告
const deleteNewsItem = async (row: News.NewsVO) => {
  await useHandleData(deleteNews, row.id, `删除【${row.title}】公告`)
  proTable.value?.getTableList()
}

// 打开 dialog(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof NewsDialog>>()
const openDrawer = (title: string, row: Partial<News.NewsVO> = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row },
    getTableList: () => proTable.value?.getTableList()
  }
  dialogRef.value?.acceptParams(params)
}
</script>

<style scoped lang="less">
.news-manage {
  .table-box {
    margin: 10px;
  }
}
</style>
