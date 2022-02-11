<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="申请单号：">
      <el-input v-model="queryForm.code" @keyup.enter.native="getTableData()" clearable placeholder="请输采购单号">
      </el-input>
    </el-form-item>
    <el-form-item label="开始时间：">
      <el-date-picker v-model="queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="申请开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：">
      <el-date-picker v-model="queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="申请结束时间">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="申请人：">
      <el-select v-model="queryForm.applyId" clearable filterable placeholder="选择申请人">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询
      </el-button>

    </el-form-item>

  </el-form>
  <el-table :data="tableData" v-loading="loadTable" @row-dblclick="selectedRow" row-key="id" border
    :tree-props="{ children: 'childrens' }">
    <el-table-column type="expand">
      <template #default="props">
        <div class="grn-detail-list">
          <el-table :data="props.row.children">
            <el-table-column prop="categoryName" label="产品名称"></el-table-column>
            <el-table-column prop="amount" label="采购数量">
              <template #default="propsc">
                {{propsc.row.amount}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>
            <el-table-column prop="repoName" label="仓库名称"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" />

    <el-table-column prop="code" label="单号" min-width="200" />
    <el-table-column label="出库产品" min-width="320">
      <template #default="props">
        <span v-html="getTblTemplate(props.row.children)"></span>
      </template>
    </el-table-column>
    <el-table-column prop="checkUserName" label="审核人" min-width="120" />
    <el-table-column prop="auditDate" label="审核日期" width="160" />
    <el-table-column prop="applyUserName" label="申请人" min-width="120" />
    <el-table-column prop="applyDate" label="申请日期" width="160" />

  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="v=>handleSizeChange(v)"
    @current-change="v=>handleCurrentChange(v)">
  </el-pagination>

</template>

  <script>
import { reactive, toRefs } from 'vue'
import moment from 'moment'
import {
  getDeliveryNoticeList, getRepoList, getCategoryTree, getUnitList
} from '@/api/common'
import { userList } from '@/api/user'

export default {
  name: 'grnManage',

  setup(props, context) {
    const { emit } = context;
    const state = reactive({
      tableData: [],
      agentData: [],//用户
      repoData: [],//仓库
      queryForm: {
        code: '',
        startDate: moment(new Date(+new Date() - 3 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
        categoryId: '',
        applyId: '',// 申请人
        status: 1
      },
      cascaderOptions: { value: 'id', label: 'name', multiple: true },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false,

    })

    const methods = {
      selectedRow(row) {
        emit('selectedPurchase', row)
      },
      /**
       * 显示明细
       */
      getTblTemplate(tblItems) {
        return tblItems.map(v => v.repoName + ' 采购 <span class="category-name">' + v.categoryName + '</span> ' + v.amount + '/' + v.unitName).join('<br />')
      },

      /**
       * 获取列表
       */
      async getTableData() {
        state.loadTable = true
        const params = Object.assign({}, state.queryForm, {
          pageSize: state.pageSize,
          pageNo: state.currentPage
        })
        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.map(v => v.at(-1)).join(','))

        const res = await getDeliveryNoticeList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
      },
      /**
       * 分页记录数改变
       */
      handleSizeChange(value) {
        state.pageSize = value
        this.getTableData()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        state.currentPage = value
        this.getTableData()
      }
    }
    //查询产品树、用户列表、供应商
    const getUnitAndCategoryData = async () => {
      state.loadignData = true
      const res = await Promise.all([userList(), getRepoList({ name: '' }), getUnitList()]).finally(() => {
        state.loadignData = false
      })
      res[0].code === 200 && (state.agentData = res[0].message.data)// 用户
      res[1].code === 200 && (state.repoData = res[1].message)// 仓库
      state.loadignData = false
    }
    //查询产品树
    getUnitAndCategoryData()
    //查询表格
    methods.getTableData()

    return {
      ...methods,
      ...toRefs(state), //抛出

    }
  },
}
  </script>
  <style lang='scss' scoped>
.grn-detail-list {
  margin: 15px;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.1);

  &-item {
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
.grn-detail-title {
  font-size: 25px;
  color: #409eff;
}

.form-pre-flex {
  display: flex;
  .form-pre-flex-btn {
    margin-left: 5px;
  }
}
</style>