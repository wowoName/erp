import { reactive } from 'vue'
import { getOutboundTotal } from '@/api/common'
import moment from 'moment'
export default () => {
    // 出库统计卡片展示数据数据
    let outboundTotalData = [{
        key: 'total',
        icon: 'box',
        color: '#40c9c6',
        title: '出库量',
        number: 0,
        unit: '单'
    }, {
        key: 'allPrice',
        icon: 'money',
        color: '#36a3f7',
        title: '销售总金额',
        number: 0,
        unit: '元'
    }, {
        key: 'allRealCo',
        icon: 'money',
        color: '#34bfa3',
        title: '客户实付金额',
        number: 0,
        unit: '元'
    }, {
        key: 'allDebt',
        icon: 'money',
        color: '#f4516c',
        title: '待收欠款总金额',
        number: 0,
        unit: '元'
    }]

    /**
    * 获取近三个月出库单统计
    */
    async function getoutboundTotal() {
        const params = {
            totalType: 'year',
            startDate: moment(new Date(+new Date() - 3 * 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59')
        }
        const res = await getOutboundTotal(params)
        if (res.message.length === 0) return outboundTotalData;
        const getOutboundTotalDatas = res.message[0]
        for (const grnItem of outboundTotalData) {
            grnItem.number = getOutboundTotalDatas[grnItem.key]
        }
        return outboundTotalData
    }
    /**
     * 近三个月 出库统计折线图数据
     */
    async function getoutBoundLineData() {
        const params = {
            totalType: 'day',
            startDate: moment(new Date(+new Date() - 3 * 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(new Date()).format('YYYY-MM-DD 23:59:59')
        }
        const res = await getOutboundTotal(params)
        const lineData = res.message
        return {
            title: '出库信息变化曲线',
            xAxisData: lineData.map(v => v.date),
            data: [{
                id: 1,
                name: '出库单量',
                lineColor: '#37ed97',
                xData: lineData.map(v => v.total)
            }, {
                id: 2,
                name: '总销售额',
                lineColor: '#2184e7',
                xData: lineData.map(v => v.allPrice)
            }, {
                id: 3,
                name: '待付款金额',
                lineColor: '#b7eb0e',
                xData: lineData.map(v => v.allDebt)
            }, {
                id: 4,
                name: '已付款金额',
                lineColor: '#2e2df1',
                xData: lineData.map(v => v.allRealCo)
            }, {
                id: 5,
                name: '利润总额',
                lineColor: '#ff0000',
                xData: lineData.map(v => v.allProfits)
            }]
        }
    }

    return {
        getoutBoundLineData,
        getoutboundTotal
    }
}