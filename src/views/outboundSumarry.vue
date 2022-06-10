<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
    <el-form-item label="统计维度：">
      <el-select v-model="formInline.totalType" @change="onQuery" clearable placeholder="选择入库单录入人员">
        <el-option v-for="item in totalTypeData" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间：" prop="startDate">
      <el-date-picker v-model="formInline.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="录入订单开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：" prop="endDate">
      <el-date-picker v-model="formInline.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="录入订单结束时间">
      </el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
    </el-form-item>

  </el-form>
  <!-- 表格 -->
  <el-table :data="tableData" v-loading="loadingTbl" v-tableHeight show-summary style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="date" label="日期" />
    <el-table-column prop="allPrice" label="总销售额" />
    <el-table-column prop="allRealCo" label="已付款金额" />
    <el-table-column prop="allDebt" label="待付款金额" />
    <el-table-column prop="allProfits" label="利润总额" />
    <el-table-column prop="total" label="出库单量">
      <template #default="scope">
        {{scope.row.total}}单
      </template>
    </el-table-column>
  </el-table>

  <!-- 折线图 -->
  <el-row>
    <el-col :span="24">
      <BaseCharts :chartsData="lienData" />
    </el-col>
  </el-row>
</template>

  <script>
import { reactive, toRefs, ref, onMounted, readonly, toRaw } from 'vue';
import moment from 'moment'
import { getOutboundTotal } from '@/api/common'
import BaseCharts from '@temp/BaseCharts.vue'
export default {
  name:'outboundSumarry',
  components: {
    BaseCharts
  },
  setup() {

    /**
     * 数据
     */
    let data = reactive({
      /**
       * 查询数据
       */
      formInline: {
        totalType: 'month',
        startDate: moment(new Date(+new Date() - 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
      },
      tableData: [],
      loadingTbl: true,
      lienData: {
        title: '出库信息变化曲线',
        xAxisData: [],
        data: []
      }
    });
    // 统计类型
    const totalTypeData = readonly([{
      name: '年',
      value: 'year'
    }, {
      name: '月',
      value: 'month'
    }, {
      name: '日',
      value: 'day'
    }])
    const chartLine = ref(null)
    /**
     * 方法
     */
    const methods = {
      /**
       * 查询
       */
      async onQuery() {
        const params = Object.assign({}, data.formInline)
        data.loadingTbl = true
        const responseData = await getOutboundTotal(params)
        responseData.code === 200 && (data.tableData = responseData.message)
        //绘制入库量变化曲线
        renderLineCharts()
        data.loadingTbl = false
      },

    }
    /**
     * 绘制折线图
     */
    const renderLineCharts = () => {
      const lineData = toRaw(data.tableData)

      data.lienData.xAxisData = lineData.map(v => v.date)
      data.lienData.data = [{
        name: '出库单量',
        lineColor: '#37ed97',
        xData: lineData.map(v => v.total)
      }, {
        name: '总销售额',
        lineColor: '#2184e7',
        xData: lineData.map(v => v.allPrice)
      }, {
        name: '待付款金额',
        lineColor: '#b7eb0e',
        xData: lineData.map(v => v.allDebt)
      }, {
        name: '已付款金额',
        lineColor: '#2e2df1',
        xData: lineData.map(v => v.allRealCo)
      }, {
        name: '利润总额',
        lineColor: '#ff0000',
        xData: lineData.map(v => v.allProfits)
      }]


      // optionsData.container = chartLine.value
      // chartLineObject = new ChartsLine(optionsData)

    }

    onMounted(() => {
      //查询客户数据
      methods.onQuery()

    })
    return {
      ...toRefs(data),
      ...methods,
      totalTypeData

    }
  }
}
  </script>
  <style lang='scss' scoped>
.charts-line-con {
  width: 100%;
  height: 300px;
  margin: 30px 0;
}
</style>