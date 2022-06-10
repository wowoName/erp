
import { getSuppliersByName, getCustomersByName } from '@/api/common'

import { computed, ref } from 'vue'

export default function (state) {
    const name = ref("remote")
    /**
     * 远程搜索 供应商
     * @param {*} supplierName  搜索内容
     * @param {*} originalDataKey  原数据可以
     * @param {*} loadingKey loadingkey
     */
    async function remoteSupplierData(supplierName, originalDataKey, loadingKey) {
        state[loadingKey] = true
        state[originalDataKey] = []
        const res = await getSuppliersByName({
            name: supplierName
        })
        state[originalDataKey] = res.code === 200 ? (res?.message?.records ?? res?.message) : [];
        state[loadingKey] = false
    }

    /**
     * 远程搜索 客户
     * @param {*} customName 搜索内容
     * @param {*} originalDataKey 存储数据key
     * @param {*} loadingKey loadingkey
     * @returns 
     */
    async function remoteCustomeData(customName, originalDataKey, loadingKey) {
        const res = await getCustomersByName({
            name: customName
        })
        return res.code === 200 ? res.message : [];
    }

    return {
        remoteSupplierData,
        remoteCustomeData,
        name
    }

}
