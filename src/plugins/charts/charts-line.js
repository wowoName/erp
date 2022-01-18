import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import {
    LineChart
} from 'echarts/charts';

import {
    SVGRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, SVGRenderer]
);

export default class ChartsLine {
    charts = null
    options = {
        container: null,
        data: [],
        xAxisData: [],
        title: '',
        showLabel: false
    }
    constructor(options) {
        this.options = Object.assign(this.options, options)
        this.initCharts()
        this.renderCharts()
    }
    initCharts() {
        if (!this.options.container || this.charts) return
        this.charts = echarts.init(this.options.container);
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
        //折线图系列
        for (const iterator of lineData) {
            seriesData.push(this.getLineOptions(iterator))
        }
        return seriesData
    }
    getCommonOptions() {
        let labelConfig = {
        }
        if (this.options.showLabel) {
            labelConfig = {
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#00b3f4',
                    },
                    formatter: value => {
                        return value.value + '' + value.data.unitName
                    }
                },
            }
        }

        return {
            ...labelConfig,
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
                type: 'category',
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
                    // margin:文字到x轴的距离
                    // margin: 15
                },

                boundaryGap: false
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
                    show: false
                }
            },
            dataZoom: {
                type: 'inside',
                minValueSpan: 1
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
                left: 10,
                right: 0,
                bottom: 0,
                containLabel: true
            }

        }
    }
    getLineOptions(item) {
        const lineColor = item.lineColor
        let config = {}
        //自定义颜色
        if (lineColor) {
            config = {
                lineStyle: {
                    color: lineColor,
                    width: 2
                },

                itemStyle: {
                    color: lineColor,
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: this._hexToRgb(lineColor, 0.6),
                        },
                        {
                            offset: 1,
                            color: this._hexToRgb(lineColor, 0),
                        }
                        ], false),
                    }
                },
            }
        }
        return {
            name: item.name,
            data: item.xData,

            ...config,

            symbol: 'circle',
            symbolSize: 8,

            showSymbol: true,
            showAllSymbol: true,
            type: 'line',
            smooth: true
        }
    }
    _hexToRgb(hex, opacity = 1) {
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    }
    /**
     * 
     * @param {*} options  
     */
    setLineOption(options = {}) {
        this.charts && this.charts.setOption(options);
    }
}