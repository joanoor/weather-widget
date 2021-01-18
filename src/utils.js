const echarts = require('echarts')
require('echarts/lib/chart/line')

// 自动引入
export const autoImport = files => {
  files.keys().map(files)
}

// 创建曲线
export const setCurve = () => {
  let chart = echarts.init(document.getElementById('realcurve'))
  let option = {
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 20,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // show: true,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#fff',
        // margin: -50,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },

    series: [
      {
        data: [120, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
  }
  chart.setOption(option)
}
