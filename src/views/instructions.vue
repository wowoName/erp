<!--  -->
 <template>
  <el-descriptions title="使用说明" :column="1">
    <el-descriptions-item v-for="(item,index) in infos" :label="item.label" :key="index">
      <template #label>
        <span class="instruction-title">{{item.label}}:</span>
      </template>
      <div v-html="item.desc" class="instruction-item"></div>
    </el-descriptions-item>
  </el-descriptions>
</template>

  <script setup>
const infos = [{
  label: '系统主页',
  desc: `统计最近一段时间出入库信息。包括 单量、来往金额、欠款总额、利润总额<br/> 
     商品销售量排名柱状图：按照时间统计当前时间段内商品销售排名情况<br/>
     商品销售量分布折线图：按照时间统计各个时间段内商品销售分布情况。为未来产品销售提供一定参考<br/>
  `
}, {
  label: '用户管理',
  desc: `未系统添加用户。包括管理员、采购员、销售员、仓库管理员。菜单进行了权限管理（按钮级别权限暂未添加）`
}, {
  label: '客户管理',
  desc: `管理客户<br/>
   购买统计：可以查看客户的购货金额、支付金额、以及欠款金额。作为催收欠款的依据<br/>
   客户支付力统计柱状图：默认查询所有客户的购买信息。购买总金额、总支付金额、欠款额度对比<br/>
   购买商品离散图：默认展示商品在各个时间段的销售情况。可按照某个用户、一定时间查看商品购买行为<br/>
  `
}, {
  label: '商品管理',
  desc: `管理商品公司产品
  `
}, {
  label: '批次管理',
  desc: `商品入库批次统计。可按照商品种类进行查询，查看产品批次录入情况。包括产品入库仓库，采购价格、批次产品库存量
  `
}, {
  label: '单位管理',
  desc: `进行商品单位管理。出入库产品可以选择任一对应单位进行操作。（下一级单位按照与上一级单位转换比例进行转换）
  `
}, {
  label: '仓库管理',
  desc: `管理公司仓库
  `
}, {
  label: '供应商管理',
  desc: `管理公司产品供应商
  `
}, {
  label: '采购管理',
  desc: `公司采购产品，采购员通过提交申请，由管理员进行审核。审核通过之后，采购员打印采购通知单进行采购。采购完毕产品，由管理员或者仓库管理员进行产品的入库操作
  `
}, {
  label: '销售管理',
  desc: `销售员提交产品销售申请，由管理员进行审核。审核完毕，在出库管理模块进行商品的出库操作
  `
}, {
  label: '入库管理',
  desc: `入库管理：商品可以通过审核通过采购单进行导入，也可以直接将产品进行录入仓库。按照时间，供货商，操作人，欠款情况，查看采购产品来往货款<br/>
  入库统计：按照商品、仓库、时间维度进行查看商品的入库数量信息<br/>
  入库汇总：按照年、月、日统计商品入库数量、购买金额、待付款金额、已付款金额变化。
  `
}, {
  label: '出库管理',
  desc: `同入库管理
  `
}, {
  label: '库存盘点',
  desc: `可以按照商品类型、批次、存储仓库 进行库存的盘点
  `
}, {
  label: '其他',
  desc: `语言：java、vue;<br/>
    <span style="font-size:28px;color:#0CB96E">万事不尽如意，生活总要继续</span>。<br/>
   生活所迫，后端有偿`
}]
  </script>
  <style lang='scss' scoped>
.instruction-title {
  color: #19d11b;
  font-size: 20px;
}
</style>