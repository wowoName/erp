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
    BarChart
} from 'echarts/charts';

import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, DataZoomComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
);

export default class ChartsLine {
    charts = null
    options = {
        container: null,
        data: [],
        xAxisData: [],
        title: '',
        labelType: 'normal'
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
            xAxis: {
                // type: 'category',
                data: this.options.xAxisData,
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
            tooltip: {
                show: true
            },

            grid: {
                top: 80,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true
            },
            label: this.getLabelConfig()
        }
    }
    getLineOptions(item) {

        return {
            name: item.name,
            data: item.data,
            itemStyle: {
                color: item?.color ?? '#2184e7'
            },
            type: 'bar',
            barWidth: 30
        }
    }
    //内部标题
    getLabelConfig() {
        const label = this.options.labelType
        let labelCofig = {
            normal: {
                show: true,
                position: "top",
                distance: 10,
                fontSize: 16,
                color: "#2184e7",
                formatter: ({ data }) => {
                    return data.value + '' + data.unitName
                }
            },
            inside: {
                show: true,
                position: 'insideBottom',
                distance: 60,
                align: 'center',
                verticalAlign: 'bottom',
                color: "#333333",
                formatter: value => {
                    return value.data.value.toString().split('').join('\n')
                },
                fontSize: 16,
                rich: {
                    name: {}
                }
            }
        }

        return labelCofig[label]

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