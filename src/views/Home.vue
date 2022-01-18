<!--  -->
 <template>
  <div class="home-con">
    <CommonCard title="近三个月入库量信息总汇" :panel-data="grnTotalData" :line-data="grnLineData" />
    <CommonCard title="近三个月出库量信息总汇" :panel-data="outboundTotalData" :line-data="outboundLineData" />

    <el-row>
      <el-col :span="24">
        <div class="col-search-item">
          <el-form :inline="true" :model="outboundRakingForm" size="small">
            <el-form-item label="开始时间：">
              <el-date-picker v-model="outboundRakingForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker v-model="outboundRakingForm.endDate" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="结束时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button @click="getOutboundRakingData">
                <el-icon style="vertical-align: middle;">
                  <search />
                </el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col>
        <BaseCharts :chartsData="outboundRakingData" charts-type="bar" style="height:410px"
          v-loading="loadingOutboundRaking" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="col-search-item">
          <el-form :inline="true" :model="scatterFrom" size="small">
            <el-form-item label="开始时间：">
              <el-date-picker v-model="scatterFrom.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
              <el-date-picker v-model="scatterFrom.endDate" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="结束时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="统计维度：" class="radio-button-item">
              <el-radio-group v-model="scatterFrom.totalType" @change="getCategorySalesData">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button @click="getCategorySalesData">
                <el-icon style="vertical-align: middle;">
                  <search />
                </el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col>
        <!-- charts-type="scatter" -->
        <BaseCharts :chartsData="scatterData" style="height:410px" v-loading="loadingScatterData" />
      </el-col>
    </el-row>

  </div>
</template>

  <script>
import { reactive, toRefs, computed, toRaw } from 'vue'
import CommonCard from '@temp/commonCard.vue'
// 入库统计数据
import grntotalDataMix from '@/mixin/grnTotal'
// 出库统计数据
import outboundTotalMix from '@/mixin/outboundTotal'
import { getOutboundRaking, getCategorySales } from '@/api/common'

import BaseCharts from '@temp/BaseCharts.vue'
import moment from 'moment'

export default {
  name: 'home',
  components: {
    CommonCard,
    BaseCharts
  },
  setup(props, context) {
    console.log('%c 技术支持联系QQ：1069722589', 'color:red')
    let state = reactive({
      grnTotalData: [],
      grnLineData: [],
      outboundTotalData: [],
      outboundLineData: [],
      contrast: [],//出入库对比数据
      outboundRakingData: [],//产品销售量排名 折线图

      scatterFrom: {
        startDate: moment(new Date(+new Date() - 365 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
        totalType: 'month',//商品销售分布离散图统计类型
      },
      scatterData: {//近一年各产品销售变化曲线
        title: '商品销售分布折线图',
        xAxisData: [],
        data: [],
        showLabel: true
      },
      loadingScatterData: false,

      outboundRakingForm: {
        startDate: moment(new Date(+new Date() - 365 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
      },
      loadingOutboundRaking: false

    })
    // 引入 入库近三个月数据统计
    const { getGrnLineData, getGrnTotal } = grntotalDataMix();
    getGrnTotal().then(data => state.grnTotalData = data)
    getGrnLineData().then(data => state.grnLineData = data)
    // 出入近三个月统计
    const { getoutBoundLineData, getoutboundTotal } = outboundTotalMix();
    getoutboundTotal().then(data => state.outboundTotalData = data)
    getoutBoundLineData().then(data => state.outboundLineData = data)

    // 出入库单
    state.contrast = computed(() => {
      return {
        title: '出入库单量变量曲线',
        xData: state.grnLineData.xAxisData,
        data: [{
          name: '入库单量',
          lineColor: '#37ed97',
          xData: state.grnLineData?.data?.[0]?.xData ?? []
        }, {
          name: '出库量',
          lineColor: '#ff0000',
          xData: state.outboundLineData?.data?.[0]?.xData ?? []
        },]
      }
    })

    const methods = {
      /**
       * 按时间统计各商品销售排名
       */
      getOutboundRakingData() {
        state.loadingOutboundRaking = true
        getOutboundRaking(state.outboundRakingForm).then(data => {
          if (data.code === 200) {
            const rankingData = data.message;
            state.outboundRakingData = {
              title: '近一年各商品销售排名',
              xAxisData: rankingData.map(v => v.categoryName),
              data: [{
                name: '商品销售排名',
                data: rankingData.map(v => ({ value: v.total, unitName: v.unitName }))
              }]
            }
          }
        }).finally(() => {
          state.loadingOutboundRaking = false
        });
      },
      // 近一年商品销售分布离散图
      getCategorySalesData() {
        state.loadingScatterData = true
        const params = Object.assign({}, toRaw(state.scatterFrom))
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
              // const seriesItem = {
              //   name: iterator[0].categoryName,
              //   data: xAxisData.map(v => {
              //     //根据日期查找 数据
              //     const curData = iterator.find(cv => cv.date === v)
              //     return {
              //       value: [v, curData?.allAmount ?? null],
              //       unitName: curData?.unitName ?? '',
              //       categoryName: curData?.categoryName ?? ''
              //     }
              //   })
              // }
              // seriesData.push(seriesItem)
              seriesData.push({
                name: iterator[0].categoryName,
                xData: xAxisData.map(v => {
                  const curData = iterator.find(cv => cv.date === v)
                  return {
                    value: curData?.allAmount ?? 0,
                    unitName: curData?.unitName ?? ''
                  }
                })
              })
            }

            state.scatterData.data = seriesData
            state.scatterData.xAxisData = xAxisData
          }
        }).finally(() => {
          state.loadingScatterData = false
        })
      }
    }
    // 商品销售排名
    methods.getOutboundRakingData()
    // 进一年各商品销售分布图
    methods.getCategorySalesData()

    return {
      ...toRefs(state),
      ...methods
    }
  }
}
  </script>
  <style lang='scss' scoped>
.home-con {
  padding: 15px;
  box-sizing: border-box;
  background-color: #f0f2f5;
}
.col-search-item {
  margin-top: 15px;
  padding: 18px 15px 0;
  background-color: #ffffff;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 5px;
    right: 5px;
    height: 1px;
    background-color: #f0f2f5;
  }
}

</style>