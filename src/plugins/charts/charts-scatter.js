import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent
} from 'echarts/components';
import {
    ScatterChart
} from 'echarts/charts';

import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, DataZoomComponent, GridComponent, LegendComponent, ScatterChart, CanvasRenderer]
);

export default class ChartsLine {
    charts = null
    options = {
        container: null,
        data: [],
        title: '',
    }
    constructor(options) {
        this.options = Object.assign(this.options, options)
        this.initCharts()
        this.renderCharts()
    }
    initCharts() {
        if (!this.options.container || this.charts) return
        this.charts = echarts.init(this.options.container, null);
    }
    /**
     * 渲染折线图
     * @param {*} options  配置信息
     */
    renderCharts(options = {}) {
        this.options = Object.assign(this.options, options);
        const chartOptions = {
            ...this.getCommonOptions(),
            series: this.getSeriesData()
        }
        this.setLineOption(chartOptions)
        setTimeout(() => {
            this.charts && this.charts.resize();
        }, 500)
    }
    getSeriesData() {
        let seriesData = []
        const lineData = this.options.data
        //图标图系列
        for (const iterator of lineData) {
            seriesData.push(this.getLineOptions(iterator))
        }
        return seriesData
    }
    getCommonOptions() {
        return {
            title: {
                text: this.options.title,
                textStyle: {
                    align: 'center',
                    color: '#000000',
                    fontSize: 20,
                },
                top: 0,
                left: 'center',
            },
            tooltip: {
                formatter: ({ data }) => {
                    const value = data.value
                    return '</p>' + value[0] + '年</p>' + data.categoryName + "【" + value[1] + data.unitName + '】'
                }
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#DCE2E8'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#556677'
                    },
                    // 默认x轴字体大小
                    fontSize: 12,
                    interval: 0,
                },
                // boundaryGap: false
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#DCE2E8'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#556677'
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#DCE2E8'
                    }
                }
            },
            dataZoom: {
                type: 'slider',
                start: 0,
                end: 100  //缩放组件显示70%的位置
            },
            legend: {
                type: 'scroll',
                left: 'center',
                top: 25,
                data: this.options.data.map(v => v.name)
            },

            grid: {
                top: 80,
                left: 0,
                right: 40,
                bottom: 80,
                containLabel: true
            },
        }
    }
    getLineOptions(item) {
        return {
            name: item.name,
            data: item.data,
            type: 'scatter',
            // 控制点大小标识 销售量
            symbolSize: function (data) {
                const size = data[1]
                let retSize = 8
                if (size > 100) retSize = 10
                else if (size > 300) retSize = 12
                else if (size > 500) retSize = 14
                else if (size > 800) retSize = 16
                else if (size > 1000) retSize = 18
                else if (size > 1500) retSize = 20
                else if (size > 2000) retSize = 22
                else if (size > 2500) retSize = 24
                else if (size > 3000) retSize = 26
                else if (size > 5000) retSize = 28
                else if (size > 8000) retSize = 30
                return retSize
            },
        }
    }
    /**
     * 
     * @param {*} options  
     */
    setLineOption(options = {}) {
        this.charts.setOption(options, true, true);
        // this.charts.resize();
    }
}