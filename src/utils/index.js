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
const getParentIdById = (data, pid, bData = []) => {
    if (!pid) return bData
    //根据pid查找单位数据
    const findPid = getDataById(data, pid)
    return getParentIdById(data, findPid[0]?.pid, bData.concat(findPid))
}

export const getDataById = (data, id) => {
    let a = []
    for (const item of data) {
        if (item.id == id) return [item]
        else if (Reflect.has(item, 'children')) {
            const findChildren = getDataById(item.children, id)
            if (findChildren.length) {
                a = a.concat(findChildren)
                return a
            }
        }
    }
    return a
}

/**
 * 根据id在树形结构查找节点
 */
export const getTreeDataById = (fData, id, f = {}) => {
    for (const item of fData) {
        if (item.id === id) {
            return item;
        }
        else if (Reflect.has(item, 'children')) {
            f = getTreeDataById(item.children, id, f);
            if (Object.keys(f).length) return f;
        }
    }
    return f
}

/**
 * loading
 * @returns 
 */
export const globalLoading = function (msg = "加载中") {
    return ElLoading.service({
        lock: true,
        text: msg,
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
    if (!unit1Data.length || !unit2Data.length) return { equal: false, totalPrice: 0 };
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



export const colorRgb = (color, opacity) => {
    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    color = color.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            colorNew = "#";
            for (const i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        let colorChange = [];
        for (const i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return `rgba(${colorChange.join(",")},${opacity})`;
    } else {
        return color;
    }
}

/**
 * 库存数量与出库数量单位转换
 * @param {*} inventoryId  库存数量单位id
 * @param {*} outboundId  出库数量单位id
 * @param {*} amount  出库数量
 * @param {*} unitData  数量单位数据
 */
export const convertedQuantityUnit = (inventoryId, outboundId, amount, unitData) => {
    if (inventoryId === outboundId) return amount
    // 通过库存单位id查找
    let allParentData = getParentIdById(unitData, inventoryId)
    // 通过库存单位id找出库单位
    let findIndex = allParentData.findIndex(v => v.id === outboundId)
    // 是否转换到低单位
    let hasToLowerUnit = false
    // 如果未找到出库单位id 使用出库单位id进行查找
    !~findIndex && (allParentData = getParentIdById(unitData, outboundId)) && (findIndex = allParentData.findIndex(v => v.id === inventoryId), hasToLowerUnit = true)
    // 如果单位存
    if (!!~findIndex) {
        const reduceRatioData = allParentData.slice(0, findIndex)
        const mathJsApplyName = hasToLowerUnit ? 'multiply' : 'divide'
        if (hasToLowerUnit) {
            reduceRatioData.reverse()
        }
        return reduceRatioData.reduce((p, v) => {
            return p = mathJs[mathJsApplyName](p, v.ratio)
        }, amount)
    } else { // 单位不存在
        return null
    }


}