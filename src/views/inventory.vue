<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">

    <el-form-item label="商品：">
      <el-cascader v-model="formInline.categoryId" size="mini" @change="getGrnDetailSpecie" :options="categoryData"
        placeholder="请选择入库产品" :props="{ value: 'id', label: 'name', multiple: true }" collapse-tags clearable
        style="width:100%" />
    </el-form-item>

    <el-form-item label="批次：">
      <el-select v-model="formInline.specieId" :loading="loadingSpecie" clearable placeholder="选择商品批次"
        style="width:100%">
        <el-option v-for="item in specieData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="仓库：">
      <el-select v-model="formInline.repoId" clearable placeholder="请选择仓库地址" style="width:100%">
        <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="分批次统计：" class="radio-button-item">
      <el-radio-group v-model="formInline.groupByCategory" @change="onQuery()">
        <el-radio-button label="1">是</el-radio-button>
        <el-radio-button label="0">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
    </el-form-item>

  </el-form>
  <!-- 表格 -->
  <el-table :data="tableData" v-loading="loadingTbl" show-summary style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="repoName" label="仓库名称" />
    <el-table-column prop="categoryName" label="商品名称" />
    <el-table-column prop="stock" label="批次名称" v-if="formInline.groupByCategory === '1'">
      <template #default="scope">
        {{scope.row.specieInfos?.batchName}}
      </template>
    </el-table-column>
    <el-table-column prop="stock" label="库存" sortable>
      <template #default="scope">
        {{scope.row.stock}} / {{scope.row.unitName}}
      </template>
    </el-table-column>

    <el-table-column prop="stock" label="进价" v-if="formInline.groupByCategory === '1'">
      <template #default="scope">
        {{scope.row.specieInfos?.cost}} / {{scope.row.specieInfos?.unitName}}
      </template>
    </el-table-column>
  </el-table>

  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="v=>handleSizeChange(v)"
    @current-change="v=>handleCurrentChange(v)">
  </el-pagination>

</template>

  <script>
import { reactive, toRefs, onMounted, nextTick } from 'vue';
import { getInventoryList, getCategoryTree, getRepoList, getListByCategoryId } from '@/api/common'
export default {
  name: 'inventory',
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
        specieId: '',
        groupByCategory: '1'
      },
      tableData: [],
      loadingTbl: true,
      categoryData: [],
      repoData: [],
      specieData: [],
      loadingSpecie: false,//加载批次中
      currentPage: 1,//当前页数
      pageSize: 10,
      total: 0,
    });
    /**
     * 方法
     */
    const methods = {
      /**
       * 查询
       */
      async onQuery() {
        const params = Object.assign({
          pageSize: state.pageSize,
          pageNo: state.currentPage
        }, state.formInline)
        state.loadingTbl = true
        //产品id
        params.categoryId = params.categoryId.join(",")
        //仓库
        const repoId = params.repoId;
        params.repoId = Array.isArray(repoId) ? repoId.at(-1) : repoId;

        //批次
        const specieId = params.specieId;
        params.specieId = Array.isArray(specieId) ? specieId.at(-1) : specieId;

        // 是否按照商品进行产线
        params.groupByCategory = params.groupByCategory === '0'


        const responseData = await getInventoryList(params).finally(() => {
          state.loadingTbl = false
        })
        if (responseData.code === 200) {
          let tblData = responseData.message.records;
          state.total = responseData.message.total;
          /**
           * 按照商品类型统计
           * 批次名称不显示
           */
          // if (state.formInline.groupByCategory === '0') {
          //   tblData.forEach(v => {
          //     v.specieInfos.batchName = ''
          //     v.specieInfos.cost = ''
          //     v.specieInfos.costUnitName = ''

          //   })
          // }
          state.tableData = tblData
        }

      },
      /**
       * 根据选择的商品获取产品批次数
       */
      async getGrnDetailSpecie(value) {

        if (value.length === 0) {
          state.specieData = []
          state.formInline.specieId = ''
          return
        }
        state.loadingSpecie = true

        const categoryId = value.flat(2).join(',')
        const res = await getListByCategoryId({ categoryIds: categoryId }).finally(() => {
          state.loadingSpecie = false
        })

        res.code === 200 && (state.specieData = res.message)
      },
      /**
      * 分页记录数改变
      */
      handleSizeChange(value) {
        state.pageSize = value
        this.onQuery()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        state.currentPage = value
        this.onQuery()
      }
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