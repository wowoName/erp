<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="queryForm" class="demo-form-inline">
    <el-form-item label="客户：">
      <el-select v-model="queryForm.customerId" remote filterable :loading="loadignData"
        :remote-method="query=>remoteCustomeData(query,'customerData','loadignData')" clearable placeholder="选择客户">
        <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="开始时间：" prop="startDate">
      <el-date-picker v-model="queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="出库开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：" prop="endDate">
      <el-date-picker v-model="queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="出库结束时间">
      </el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="getRakingData()">查询</el-button>
    </el-form-item>

  </el-form>

  <el-table :data="allRakingData" v-loading="loadingTbl" v-tableHeight style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="userName" label="姓名" />
    <el-table-column prop="allPrice" label="总金额" sortable />
    <el-table-column prop="allRealCo" label="总支付" sortable />
    <el-table-column prop="allDebt" label="总欠款" sortable />
  </el-table>
  <div>
    <el-divider>客户购买力柱状图</el-divider>
    <BaseCharts :chartsData="rakingData" charts-type="bar" style="height:410px" v-loading="loadingTbl" />
  </div>

  <div>
    <el-divider>购买商品离散图</el-divider>
    <div class="total-item-layout">
      <label for=""> 统计维度：</label>
      <el-radio-group v-model="scatterType" @change="getCategorySalesData" size="small">
        <el-radio-button label="day">日</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="year">年</el-radio-button>
      </el-radio-group>
    </div>
    <BaseCharts :chartsData="scatterData" charts-type="scatter" style="height:410px" v-loading="loadingScatter" />
  </div>

</template>

  <script>
import { reactive, toRefs, toRaw, watch, onMounted, onBeforeUnmount } from 'vue'
import BaseCharts from '@temp/BaseCharts.vue'
import { getCustomerRaking, customerList, getCategorySales } from '@/api/common'
import remoteMix from '@/mixin/remote'
import { globalLoading, showMessage } from '@/utils'

export default {
  name: 'customerAnalysis',
  components: {
    BaseCharts
  },
  setup(props, context) {

    const { remoteCustomeData } = remoteMix(state)
    let state = reactive({
      queryForm: {
        customerId: '',
        startDate: '',
        endDate: ''
      },
      customerData: [],//客户数据
      allRakingData: [],//消费排名折线图数据
      scatterData: {
        title: '购买商品离散图',
        data: []
      },//散点图数据
      rakingData: {
        title: '客户支付力统计',
        labelType: 'inside',
        xAxisData: [],
        data: []
      },
      loadingTbl: false,
      loadignData: false,//查询客户
      scatterType: 'month',//商品销售分布图统计类型
      loadingScatter: false
    })
    /**
   
   

/**
 * 获取客户数据
 */
    async function getNormalCustomerData() {
      const res = await customerList({ pageSize: 20, pageNo: 1 })
      res.code === 200 && (state.customerData = res.message.records)// 客户
    }

    const methods = {
      /**
       * 获取排名前五十客户 以及搜索
       */
      getRakingData() {
        state.loadingTbl = true
        const res = getCustomerRaking(state.queryForm).then(res => {
          if (res.code === 200) {
            const resData = res.message;
            state.allRakingData = res.message;
            state.rakingData.xAxisData = resData.map(v => v.userName)
            state.rakingData.data = [{
              name: '购买力',
              color: '#2184e7',
              data: resData.map(v => ({
                value: v.allPrice,
                unitName: '元'
              }))
            }, {
              name: '支付力',
              color: '#34bfa3',
              data: resData.map(v => ({
                value: v.allRealCo,
                unitName: '元'
              }))
            }, {
              name: '欠款',
              color: '#f4516c',
              data: resData.map(v => ({
                value: v.allDebt,
                unitName: '元'
              }))
            }]
          }
        }).finally(() => {
          state.loadingTbl = false
        })

        //商品分布
        this.getCategorySalesData()
      },
      /**
       *  按照时间 商品 客户 统计 年月日 内各个商品的销售分布
       */
      async getCategorySalesData() {
        state.loadingScatter = true
        const params = Object.assign({}, toRaw(state.queryForm))
        params.totalType = state.scatterType
        getCategorySales(params).then(res => {
          if (res.code === 200) {
            const scatterData = res.message;
            // 数据按照产品进行分组
            const groupByCategory = scatterData.reduce((p, cur) => {
              const categoryId = cur.categoryId;
              if (!p['category_' + categoryId]) {
                p['category_' + categoryId] = []
              }
              p['category_' + categoryId].push(cur)
              return p
            }, {});
            // x轴数据为日期
            const xAxisData = [...new Set(scatterData.map(v => v.date))]
            let seriesData = [];
            for (const item in groupByCategory) {
              const iterator = groupByCategory[item]
              const seriesItem = {
                name: iterator[0].categoryName,
                data: xAxisData.map(v => {
                  //根据日期查找 数据
                  const curData = iterator.find(cv => cv.date === v)
                  return {
                    value: [v, curData?.allAmount ?? null],
                    unitName: curData?.unitName ?? '',
                    categoryName: curData?.categoryName ?? ''
                  }
                })// iterator.map(v => [v.date, v.allAmount])
              }
              seriesData.push(seriesItem)
            }
            state.scatterData.data = seriesData
            console.log(seriesData)
          }
        }).finally(() => {
          state.loadingScatter = false
        })
      }
    }

    //获取排名前五十的客户数据
    methods.getRakingData()
    // 客户数据
    getNormalCustomerData()
    return {
      ...toRefs(state), //抛出
      ...methods,
      remoteCustomeData
    }
  },
}
  </script>
  <style lang='scss' scoped>
.total-item-layout {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
}
</style>