<!--  -->
 <template>
  <el-form :inline="true" :model="state.queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="开始时间：" prop="startDate">
      <el-date-picker v-model="state.queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="出库开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：" prop="endDate">
      <el-date-picker v-model="state.queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="出库结束时间">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="员工姓名：" prop="agentId">
      <el-select v-model="state.queryForm.agentId" filterable clearable placeholder="选择出库单录入人员">
        <el-option v-for="item in state.agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询
      </el-button>
    </el-form-item>

  </el-form>
  <el-table :data="state.tableData" v-loading="state.loadTable" show-summary :summary-method="getSummaries"
    :tree-props="{ children: 'childrens' }" row-key="id" border>
    <el-table-column type="index" width="50" />
    <el-table-column prop="agentName" label="姓名" />
    <el-table-column prop="date" label="日期" />
    <el-table-column prop="totalPrice" label="总业绩" />
    <el-table-column prop="profits" label="利润" />
  </el-table>
  <el-pagination v-model:currentPage="state.currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="state.pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="state.total" @size-change="v=>handleSizeChange(v)"
    @current-change="v=>handleCurrentChange(v)">
  </el-pagination>

</template>

  <script setup>
import { reactive } from 'vue'
import moment from 'moment'
import {
  getOutboundList, customerList, getRepoList, getCategoryTree, getUnitList
} from '@/api/common'
import { userList } from '@/api/user'
import remoteMix from '@/mixin/remote'

const state = reactive({
  tableData: [],
  agentData: [],//用户
  queryForm: {
    code: '',
    startDate: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    endDate: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    categoryId: '',
    agentData: '',
    customerId: '',// 客户
    minDebts: false
  },
  currentPage: 1,
  pageSize: 10,
  total: 0,
  loadTable: false,
})
const { remoteCustomeData } = remoteMix(state)
/**
 * 获取列表
 */
const getTableData = async () => {
  state.loadTable = true
  const params = Object.assign({}, state.queryForm, {
    pageSize: state.pageSize,
    pageNo: state.currentPage
  })
  //是否只看欠款
  params.minDebt = params.minDebts ? 0 : null;
  //产品id如果是数组取最后一位
  Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.map(v => v.at(-1)).join(','))

  console.log(params)
  const res = await getOutboundList(params)
  res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
  state.loadTable = false
}
/**
 * 分页记录数改变
 */
const handleSizeChange = (value) => {
  state.pageSize = value
  getTableData()
}
/**
 * 分页页数改变
 */
const handleCurrentChange = (value) => {
  state.currentPage = value
  getTableData()
}
//查询产品树、用户列表、供应商
const getUnitAndCategoryData = async () => {
  state.loadignData = true
  const res = await userList().finally(() => {
    state.loadignData = false
  })
  res.code === 200 && (state.agentData = res.message.data)// 用户
  console.log(JSON.stringify(state.unitData))
}

const getSummaries = param => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = ''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = ` ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)} 元`
    } else {
      sums[index] = ''
    }
  })
  return sums
}
//查询产品树
getUnitAndCategoryData()
//查询批次列表
getTableData()

  </script>