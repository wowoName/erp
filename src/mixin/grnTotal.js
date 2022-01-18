import { reactive } from 'vue'
import { geGrnTotal } from '@/api/common'
import moment from 'moment'
export default () => {
    // 出库统计卡片展示数据数据
    let grnTotalData = [{
        key: 'total',
        icon: 'box',
        color: '#40c9c6',
        title: '入库量',
        number: 0,
        unit: '单'
    }, {
        key: 'allPrice',
        icon: 'money',
        color: '#36a3f7',
        title: '进货总金额',
        number: 0,
        unit: '元'
    }, {
        key: 'allRealCo',
        icon: 'money',
        color: '#34bfa3',
        title: '进货总支付',
        number: 0,
        unit: '元'
    }, {
        key: 'allDebt1',
        icon: 'money',
        color: '#f4516c',
        title: '进货总欠款',
        number: 0,
        unit: '元'
    }]


    /**
    * 获取近三个月入库单统计
    */
    async function getGrnTotal() {
        const params = {
            totalType: 'month',
            startDate: moment(new Date(+new Date() - 3 * 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59')
        }
        const res = await geGrnTotal(params)
        if (res.message.length === 0) return grnTotalData;
        const grnTotalDataRes = res.message[0]
        for (const grnItem of grnTotalData) {
            grnItem.number = grnTotalDataRes[grnItem.key]
        }
        return grnTotalData
    }
    /**
     * 近三个月 出库统计折线图数据
     */
    async function getGrnLineData() {
        const params = {
            totalType: 'day',
            startDate: moment(new Date(+new Date() - 3 * 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59')
        }
        const res = await geGrnTotal(params)
        const lineData = res.message
        return {
            title: '入库信息变化曲线',
            xAxisData: lineData.map(v => v.date),
            data: [{
                name: '入库单量',
                lineColor: '#37ed97',
                xData: lineData.map(v => v.total)
            }, {
                name: '货款总金额',
                lineColor: '#2184e7',
                xData: lineData.map(v => v.allPrice)
            }, {
                name: '欠款金额',
                lineColor: '#b7eb0e',
                xData: lineData.map(v => v.allDebt)
            }, {
                name: '付款金额',
                lineColor: '#e61f16',
                xData: lineData.map(v => v.allRealCo)
            }]
        }
    }

    return {
        getGrnLineData,
        getGrnTotal
    }
}