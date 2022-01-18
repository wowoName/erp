import { ElMessage, ElLoading } from "element-plus";
import { nextTick } from "vue";
import mathJs from './math'
/**
 * 查找计量单位根
 * @param {*} data 
 * @param {*} pid 
 * @param {*} bData 
 * @returns 
 */
const getParentIdById = (data, pid, bData) => {
    if (!pid) return bData
    //根据pid查找单位数据
    const findPid = getDataById(data, pid)
    return getParentIdById(data, findPid[0]?.pid, bData.concat(findPid))
}

export const getDataById = (data, id) => {
    let a = []
    for (const item of data) {
        if (item.id == id) return a = [item]
        else if (Reflect.has(item, 'children')) a = a.concat(getDataById(item.children, id))
    }
    return a
}
/**
 * loading
 * @returns 
 */
export const globalLoading = function () {
    return ElLoading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
}
/**
 * message 
 * @param {*} type 
 * @param {*} message 
 * @param {*} duration 
 */
export const showMessage = (type, message, duration = 3000) => {
    ElMessage({
        showClose: true,
        message: message,
        type,
        duration
    })
}



/**
 *  比较两个计量单位是否属于同一根
 * @param {*} data 
 * @param {*} unitId1 入库数量单位
 * @param {*} unitId2 批次数量单位
 * @param {*} speciePrice 批次价格
 * @param {*} amount 计算价格的数量
 * @returns 
 */
export const equalUnitRoot = (data, unitId1, unitId2, speciePrice, amount) => {
    const unit1Data = getParentIdById(data, unitId1, []),
        unit2Data = getParentIdById(data, unitId2, []);
    if (unit1Data.length === 0 || unit2Data.length === 0) return { equal: false, totalPrice: 0 };
    //比较根节点id是否一致
    const unit1DataRootId = unit1Data.slice(-1)[0].id,
        unit2DataRootId = unit2Data.slice(-1)[0].id;
    if (unit1DataRootId !== unit2DataRootId) return { equal: false, totalPrice: 0 };

    /**
     * 计算总价
     */
    // 1:批次转为根之后数量
    const specieRootAmount = unit2Data.reduce((total, c) => {
        if (c.ratio !== null) {
            total = mathJs.multiply(total, c.ratio)
        }
        return total
    }, 1);
    // 1单位根的价格
    const rootUnitPrice = specieRootAmount * speciePrice;

    // 计算数量为多少根单位
    const rukuRootAmount = unit1Data.reduce((total, c) => {
        if (c.ratio !== null) {
            total = mathJs.divide(total, c.ratio)
        }
        return total
    }, 1);

    return {
        equal: true,
        /**
         * 出入库量总价格= 一单位相对根的价格*一单位根数量*出库量 ）
         */
        totalPrice: mathJs.multiply(rukuRootAmount, rootUnitPrice, amount)
    }
}
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function downLoadFile(url) {
    const loading = globalLoading()
    let downLoadA = document.createElement('a')
    downLoadA.href = url
    downLoadA.style.display = 'none'
    downLoadA.click();
    nextTick(() => {
        downLoadA.remove()
        loading.close()
    })
}



