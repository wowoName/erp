<!--可视化图标基础组件  -->
 <template>
  <div class="charts-main" ref="charts"> </div>
</template>

  <script setup>
import { watch, ref, defineProps, nextTick, onMounted } from 'vue'
import { showMessage } from '@/utils'

import ChartsLine from '@charts/charts-line'
import ChartsBar from '@charts/charts-bar'
import ChartsScatter from '@charts/charts-scatter'
const charts = ref(null)
const props = defineProps({
  chartsData: {
    type: Object,
    default: () => ({})
  },
  chartsType: {
    type: String,
    default: 'line'
  }
})
let chartsObj = null
// 渲染折线图
function renderCharts(lineData) {
  const chartOption = {
    container: charts.value,// proxy.$el,
    ...lineData
  }
  if (chartsObj) {
    chartsObj.renderCharts(chartOption)
    return
  }

  const chartsType = props.chartsType
  switch (chartsType) {
    case 'line':
      chartsObj = new ChartsLine(chartOption);
      break;
    case 'bar':
      chartsObj = new ChartsBar(chartOption);
      break;
    case 'scatter':
      chartsObj = new ChartsScatter(chartOption);
      break;
    default:
      showMessage('error', '位置类型，无法绘制');
      break;
  }

}


onMounted(() => {
  // 监听 折线图数据变化
  watch(
    () => props.chartsData,
    (value) => {
      nextTick(() => {

        renderCharts(value)
      })
    },
    {
      deep: true,
      immediate: true
    })
})

  </script>
  <style lang='scss' scoped>
.charts-main {
  width: 100%;
  height: 300px;
  background-color: #ffffff;
  padding: 15px 10px;
  box-sizing: border-box;
}
</style>