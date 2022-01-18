import httpFetch from '@/utils/https'
/** 注册分类 */
export const addCategory = (data = {}) => {
    return httpFetch.post('category/addCategory', data)
}

/** 获取分类列表 */
export const getCategory = (data = {}) => {
    return httpFetch.post('category/getCategories', data)
}
/** 获取分类列表树 */
export const getCategoryTree = (data = {}) => {
    return httpFetch.post('category/getCategoriesTree', data)
}

/** 修改类别*/
export const updateCategory = (data = {}) => {
    return httpFetch.post('category/update', data)
}
/** 删除类别*/
export const deleteCategory = id => {
    return httpFetch.post('category/deleteCategory?id=' + id)
}

/** 新增批次 */
export const addSpecie = (data = {}) => {
    return httpFetch.post('specie/add', data)
}

/** 批量新增批次*/
export const addSpecieList = (data = {}) => {
    return httpFetch.post('specie/addList', data)
}

/** 更新批次*/
export const updateSpecie = (data = {}) => {
    return httpFetch.post('specie/update', data)
}

/** 批次列表*/
export const getSpecieList = (data = {}) => {
    return httpFetch.post('specie/list', data)
}
/** 根据产品id获取对应批次*/
export const getListByCategoryId = (data = {}) => {
    return httpFetch.post('specie/listByCategoryId', data)
}



/** 添加客户 */
export const addCustomer = (data = {}) => {
    return httpFetch.post('customer/add', data)
}

/** 修改客户 */
export const updateCustomer = (data = {}) => {
    return httpFetch.post('customer/update', data)
}

/** 删除客户 */
export const removeCustomer = (data = {}) => {
    return httpFetch.post('customer/delete', data)
}
/** 客户列表 */
export const customerList = (data = {}) => {
    return httpFetch.post('customer/list', data)
}

/** 添加仓库 */
export const addRepo = (data = {}) => {
    return httpFetch.post('repo/add', data)
}

/** 更新仓库 */
export const updateRepo = (data = {}) => {
    return httpFetch.post('repo/update', data)
}

/** 仓库列表 */
export const getRepoList = (data = {}) => {
    return httpFetch.post('repo/list', data)
}

/** 删除仓库 */
export const deleteRepo = id => {
    return httpFetch.post('repo/delete?id=' + id)
}


/** 添加供应商 */
export const addSupplier = (data = {}) => {
    return httpFetch.post('supplier/add', data)
}

/** 更新供应商*/
export const updateSupplier = (data = {}) => {
    return httpFetch.post('supplier/update', data)
}

/**供应商列表 */
export const getSupplierList = (data = {}) => {
    return httpFetch.post('supplier/list', data)
}
/** 删除供应商*/
export const deleteSupplier = id => {
    return httpFetch.post('supplier/delete?id=' + id)
}



/** 添加单位 */
export const addUnit = (data = {}) => {
    return httpFetch.post('unit/add', data)
}

/** 更新单位*/
export const updateUnit = (data = {}) => {
    return httpFetch.post('unit/update', data)
}

/** 获取单位树*/
export const getUnitList = (data = {}) => {
    return httpFetch.post('unit/list', data)
}
/** 测试单位转换*/
export const getTest = (data = {}) => {
    return httpFetch.post('unit/test', data)
}


/** 入库*/
export const addGrnList = (data = {}) => {
    return httpFetch.post('grn/add', data)
}
//更新
export const updateGrnList = (data = {}) => {
    return httpFetch.post('grn/update', data)
}
// 删除 入库单
export const deleteGrnList = (data = {}) => {
    return httpFetch.post('grn/delete', data)
}
/** 获取入库表*/
export const getGrnList = (data = {}) => {
    return httpFetch.post('grn/list', data)
}


/** 获取入库明细表*/
export const getGrnDetailList = (data = {}) => {
    return httpFetch.post('grnDetail/list', data)
}

/** 导出入库表*/
export const exportGrnList = (data = {}) => {
    return httpFetch.get('grn/exportGrnList', data)
}

/** 入库統計、年月日 统计、开始 结束时间*/
export const geGrnTotal = (data = {}) => {
    return httpFetch.post('grn/total', data)
}
/** 入库按照 商品 最小单位、仓库进行数量统计*/
export const geGrnClassify = (data = {}) => {
    return httpFetch.post('grn/classify', data)
}



/** 出库*/
export const addOutbound = (data = {}) => {
    return httpFetch.post('outbound/add', data)
}

/** 出库*/
export const updateOutbound = (data = {}) => {
    return httpFetch.post('outbound/update', data)
}
/** 出库明细*/
export const getOutboundList = (data = {}) => {
    return httpFetch.post('outbound/list', data)
}
/**出库统计 */
export const getOutboundTotal = (data = {}) => {
    return httpFetch.post('outbound/total', data)
}

/** 导出入库表*/
export const exportOutboundList = (data = {}) => {
    return httpFetch.get('outbound/exportGrnList', data)
}


/** 出库按照 商品 最小单位、仓库进行数量统计*/
export const geOutboundClassify = (data = {}) => {
    return httpFetch.post('outbound/classify', data)
}

/** 按照时间维度（年 月 日 ）统计产品销售排名*/
export const getOutboundRaking = (data = {}) => {
    return httpFetch.post('outboundDetail/outboundRaking', data)
}

/**
 *  根据 时间范围 商品 用户、按照 年 月日 汇总统计销量
 * @param {*} data 
 * @returns 
 */
export const getCategorySales = (data = {}) => {
    return httpFetch.post('outboundDetail/categorySales', data)
}



/** 库存分页列表*/
export const getInventoryList = (data = {}) => {
    return httpFetch.post('inventory/list', data)
    // return httpFetch.post('inventory/allList', data)
}

/** 库存不分页列表*/
export const getInventoryAllList = (data = {}) => {
    return httpFetch.post('inventory/allList', data)
}

/** 删除库存*/
export const deleteInventoryList = (data = {}) => {
    return httpFetch.post('inventory/delete', data)
}

/** 根据名称搜索供应商*/
export const getSuppliersByName = (data = {}) => {
    return httpFetch.post('supplier/getSuppliersByName', data)
}

/** 根据名称搜索客户*/
export const getCustomersByName = (data = {}) => {
    return httpFetch.post('customer/getListByName', data)
}

/**
 *  前五十名客户 购买 欠费  实付金额 排名
 * @param {*} data 
 * startDate ?: Date 开始日期
 * endDate ?: Date 结束日期
 * @returns 
 */
export const getCustomerRaking = (data = {}) => {
    return httpFetch.post('outbound/customerRaking', data)
}












