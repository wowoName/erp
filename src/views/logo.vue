<!--  -->
 <template>
  <!-- 表格 -->
  <el-table :data="tableData" v-loading="loadingTbl" v-tableHeight style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="date" label="日期" />
    <el-table-column prop="userName" label="姓名" />
    <el-table-column prop="ip" label="ip" />
    <el-table-column prop="address" label="地址" />
  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[5,10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>

</template>

  <script>
import { reactive, toRefs } from 'vue';
import { getLogoList } from '@/api/common'
export default {
  name: 'logo',
  setup() {

    /**
     * 数据
     */
    let data = reactive({
      tableData: [],
      currentPage: 1,//当前页数
      pageSize: 10,
      total: 0,
      loadingTbl: true,
      customerDailog: false,//操作客户dialog

    });

    /**
     * 方法
     */
    const methods = {
      /**
       * 查询
       */
      async onQuery() {
        const params = Object.assign({}, data.formInline, {
          pageSize: data.pageSize,
          pageNo: data.currentPage
        })
        data.loadingTbl = true
        const responseData = await getLogoList(params)
        responseData.code === 200 && (data.tableData = responseData.message.records) && (data.total = responseData.message.total);
        data.loadingTbl = false
      },


      /**
       * 分页记录数改变
       */
      handleSizeChange(value) {
        data.pageSize = value
        methods.onQuery()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        data.currentPage = value
        methods.onQuery()
      }
    }

    //查询客户数据
    methods.onQuery()
    return {
      ...toRefs(data),
      ...methods,
    }
  }
}
  </script>
  <style lang='scss' scoped></style>