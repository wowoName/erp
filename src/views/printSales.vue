<!--  -->
 <template>
  <div class="print-purchase-con" id="print_area">
    <div class="main">
      <h2 class="title">XXX集团建设有限公司</h2>
      <h3 class="title">出库申请单</h3>
      <div class="print-header">
        <div class="header-item">
          <span>No：</span>{{printData.code}}
        </div>
        <div class="header-item">
          <span>申请人：</span>{{printData.applyUserName}}
        </div>
        <div class="header-item">
          <span>申请日期：</span>{{printData.applyDate}}

        </div>

      </div>
      <div class="print-header">
        <div class="header-item">
          <span>审核人：</span>
          {{printData.checkUserName}}
        </div>
        <div class="header-item"></div>
        <div class="header-item" style="float:right">
          <span>审核日期：</span>{{printData.auditDate}}
        </div>
      </div>

      <table>
        <tr>
          <td>No.</td>
          <td>产品名称</td>
          <td width='160'>采购数量</td>
          <td>单位</td>
          <td>仓库名称</td>

        </tr>
        <tr v-for="(item,index) in printData.children" :key="item.id">
          <td>{{index+1}}</td>
          <td>{{item.categoryName}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.unitName}}</td>
          <td>{{item.repoName}}</td>
        </tr>

      </table>
    </div>
  </div>
</template>

  <script>
import { reactive, toRefs, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import watermark from '@/utils/watermark.js'
import { getCurrentInstance } from 'vue'
import { ElMessage } from "element-plus";
// 打印
import print from 'print-js'
import {
  getDeliveryNoticeById
} from '@/api/common'
export default {

  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const state = reactive({
      isPrint: false,
      printData: {},
    })
    const route = useRoute()
    const id = route.query?.id || '';
    getDeliveryNoticeById({ id: id }).then(data => {
      const records = data.message.records
      if (data.code === 200 && records.length > 0) {

        state.printData = records[0]
        nextTick(() => {
          // 此处的style即为打印时的样式
          print({
            printable: 'print_area',
            type: 'html',
            targetStyles: ['*']
          })

        })
      } else {
        ElMessage({
          showClose: true,
          message: '未查找到数据',
          type: succsss
        })
      }

    })

    onMounted(() => {
      watermark(proxy.$el)

    })
    return {
      ...toRefs(state), //抛出
    }
  },
}
  </script>
  <style lang='scss' scoped>
.print-purchase-con {
  .main {
    margin: 0 auto;
    padding: 15px 10px;
    box-sizing: border-box;
    line-height: 45px;
    font-size: 18px;
    font-weight: 500;
    .title {
      text-align: center;
      line-height: 30px;
    }
    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      .header-item {
        width: calc(100% / 3);
        padding-left: 30px;
        box-sizing: border-box;
        white-space: nowrap;
        span {
          display: inline-block;
        }
      }
    }

    table {
      margin-top: 20px;
      width: 100%;
      border-collapse: collapse;
      border: none;
      td {
        border: 1px solid #d9d9d9;
        text-align: center;
        .price {
          display: inline-block;
          width: 60px;
        }
      }
    }
  }
}
</style>