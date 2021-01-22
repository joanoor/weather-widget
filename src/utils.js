const echarts = require('echarts')
const isToday = require('dayjs/plugin/isToday')
const isTomorrow = require('dayjs/plugin/isTomorrow')
require('echarts/lib/chart/line')
export const dayjs = require('dayjs')
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

// 自动引入
export const autoImport = files => {
  files.keys().map(files)
}

// 创建曲线
export const setCurve = (
  data,
  linecolor = 'rgba(255,255,255,0.7)',
  color1 = 'rgb(62,118,196)',
  color2 = 'transparent'
) => {
  let xdatas = [],
    ydatas = []
  data.forEach(v => {
    xdatas.push(v.time2)
    ydatas.push(parseFloat(v.temp.split('℃')[0]))
  })
  let chart = echarts.init(document.getElementById('realcurve'))
  let option = {
    grid: {
      top: 5,
      left: -10,
      right: -10,
      bottom: 20,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderWidth: 0,
      borderColor: 'red',
      textStyle: {
        color: 'white',
        fontSize: 12,
      },
      formatter(params) {
        let tmp = data[params[0].dataIndex]
        let str = tmp.time + '<br />'
        str += tmp.text + ' ' + tmp.temp
        return str
      },
    },
    xAxis: {
      type: 'category',
      data: xdatas,
      // show: true,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#fff',

        interval: 3,
        // align: 'left',
        padding: [0, -10, 0, 30],
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
        data: ydatas,
        type: 'line',
        smooth: true,
        symbol: 'none',
        emphasis: {
          lineStyle: {
            width: 0.5,
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: color1, // 0% 处的颜色
            },
            {
              offset: 1,
              color: color2, // 100% 处的颜色
            },
          ]),
        },
        lineStyle: {
          normal: {
            color: linecolor,
            width: 0.5,
          },
        },
      },
    ],
  }
  chart.setOption(option)
}

// 设置轮播
export const carouselBlock = data => {
  data.forEach(v => {
    v.date2 = dayjs(v.date).format('MM/DD')
  })

  $('.xt-weather-forecast-container').on('mouseenter', function () {
    $('.xt-weather-forecast-swiper-left').toggle(true)
    $('.xt-weather-forecast-swiper-right').toggle(true)
  })
  $('.xt-weather-forecast-container').on('mouseleave', function () {
    $('.xt-weather-forecast-swiper-left').toggle(false)
    $('.xt-weather-forecast-swiper-right').toggle(false)
  })
  let theight = $('.xt-weather-forecast-container').height()
  if ($('.weather-week').length === 0) {
    for (let item of data) {
      let img = require(`./imgs/weathericon/${item.code}.png`)
      let $block = $(
        `
        <li class="xt-weather-forecast-swiper-item">
        <div class="xt-weather-flex xt-weather-flex-just-between">
          <div class="weather-week">${item.date2} ${
          dayjs(item.date).isToday()
            ? '今天'
            : dayjs(item.date).isTomorrow()
            ? '明天'
            : item.week
        }</div>
          <div class="weather-text">${item.text}</div>
        </div>
          <div class="xt-weather-flex xt-weather-flex-just-between xt-weather-flex-align-center">
            <img class="weather-icon" src="${img}"/>
            <div>${item.low.split('℃')[0] + '/' + item.high}</div>
          </div>
        </li>
        `
      )
      $(`.xt-weather-forecast-swiper`).append($block)
    }
  }
  $('.xt-weather-forecast-swiper-left').attr(
    'style',
    `transform:translateY(${theight / 2}px);margin-top:-16px`
  )
  $('.xt-weather-forecast-swiper-right').attr(
    'style',
    `transform:translateY(${theight / 2}px);margin-top:-16px;right:0`
  )
  new Swiper().init()
}

// 轮播类
class Swiper {
  constructor() {
    this.w = $('.xt-weather-forecast-swiper-item').width()
    this.num = 0
    this.len =
      $('.xt-weather-forecast-swiper .xt-weather-forecast-swiper-item').length -
      1
  }
  init() {
    this.lrClick()
  }
  lrClick() {
    $('.xt-weather-forecast-swiper-left').click(() => {
      this.num--
      if (this.num < 0) {
        this.num = 0
        return
      }
      let cssTrx = -this.num * this.w
      $('.xt-weather-forecast-swiper').css({
        transform: `translateX(${cssTrx}px)`,
      })
    })

    $('.xt-weather-forecast-swiper-right').click(() => {
      this.num++
      if (this.num > this.len) {
        this.num = this.len
        return
      }
      let cssTrx = -this.num * this.w
      $('.xt-weather-forecast-swiper').css({
        transform: `translateX(${cssTrx}px)`,
      })
    })
  }
}
