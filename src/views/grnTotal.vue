<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
    <el-form-item label="商品：">
      <el-cascader v-model="formInline.categoryId" size="mini" :options="categoryData" placeholder="请选择入库产品"
        :props="{ value: 'id', label: 'name', multiple: true }" collapse-tags clearable style="width:100%" />
    </el-form-item>
    <el-form-item label="仓库">
      <el-select v-model="formInline.repoId" filterable clearable placeholder="请选择仓库地址" style="width:100%">
        <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id">
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
    <el-table-column prop="repoName" label="仓库名称" />
    <el-table-column prop="categoryName" label="商品名称" />
    <el-table-column prop="amounts" label="数量">
      <template #default="scope">
        {{scope.row.amounts}} / {{scope.row.unitName}}
      </template>
    </el-table-column>
  </el-table>

</template>

  <script>
import { reactive, toRefs, ref, onMounted, readonly, toRaw } from 'vue';
import moment from 'moment'
import { globalLoading, showMessage, uuid } from '@/utils'
import { geGrnClassify, getCategoryTree, getRepoList } from '@/api/common'
export default {
  name: 'grnTotal',
  setup() {

    /**
     * 数据
     */
    let state = reactive({
      /**
       * 查询数据
       */
      formInline: {
        categoryId: [],
        repoId: '',
        startDate: moment(new Date(+new Date() - 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
      },
      tableData: [],
      loadingTbl: true,
      categoryData: [],
      repoData: []
    });
    /**
     * 方法
     */
    const methods = {
      /**
       * 查询
       */
      async onQuery() {
        const params = Object.assign({}, state.formInline)
        state.loadingTbl = true
        //产品id
        params.categoryId = params.categoryId.join(",")
        //仓库
        const repoId = params.repoId;
        params.repoId = Array.isArray(repoId) ? repoId.at(-1) : repoId;

        const responseData = await geGrnClassify(params)
        responseData.code === 200 && (state.tableData = responseData.message)

        state.loadingTbl = false
      },

    }
    //查询产品树、用户列表、供应商
    const getUnitAndCategoryData = async () => {
      state.loadignData = true
      const res = await Promise.all([getCategoryTree(), getRepoList({ name: '' })])

      res[0].code === 200 && (state.categoryData = res[0].message)// 产品
      res[1].code === 200 && (state.repoData = res[1].message)// 仓库


    }
    //查询产品树
    getUnitAndCategoryData()
    onMounted(() => {
      //查询客户数据
      methods.onQuery()

    })
    return {
      ...toRefs(state),
      ...methods
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