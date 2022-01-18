<!--  -->
 <template>
  <div class="global-total-panel">
    <el-row>
      <el-col :span="24" style="margin-bottom:15px">
        <el-divider>
          <h2>{{title}}</h2>
        </el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" v-for="(item,index) in panelData" :key="item.key"
        style="margin-bottom:15px; padding: 0 15px;">
        <el-card shadow="always" :class="['global-total-'+index]">
          <div class="total-container">
            <component :is="item.icon" color="#ffffff" :height="iconSize" :width="iconSize" />
            <div class="card-item-con">
              <span class="card-item-title">{{item.title}}</span>
              <div class="card-item-num">
                <span v-num-split="item.number"></span>{{item.unit}}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
        <BaseCharts :charts-data="lineData" />
      </el-col>
    </el-row>
  </div>
</template>

  <script setup>
import { ref, defineProps, nextTick, onMounted } from 'vue'
import BaseCharts from './BaseCharts'
const iconSize = ref(48)//字体图标大小
/**
 * 定义props
 */
const props = defineProps({
  //标题
  title: {
    type: String,
    default: ''
  },
  panelData: {
    type: Array,
    default: () => []
  },
  lineData: {
    type: Object,
    default: () => ({})
  }
})



  </script>
  <style lang='scss' scoped>
$globalColors: (
  0: linear-gradient(to right, #34bba0, #18a689),
  1: linear-gradient(to right, #3f71da, #3b5999),
  2: linear-gradient(to right, #30b7e8, #2f86e0),
  3: linear-gradient(to right, #d8b82d, #ab9743),
);

@each $key, $value in $globalColors {
  .global-total-#{$key} {
    background: #{$value};
  }
}
.global-total-panel {
  margin-bottom: 15px;
  padding: 15px 10px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.total-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  .card-item-con {
    color: #ffffff;
    text-align: right;
    .card-item-title {
      display: inline-block;
      line-height: 18px;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .card-item-num {
      font-size: 20px;
    }
  }
}
</style>