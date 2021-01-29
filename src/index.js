import $ from 'zepto-webpack'
import './index.scss'
import { dayjs, autoImport, setCurve, carouselBlock } from './utils'
import MINA from './nature'

autoImport(require.context('./styles', false, /\w+\.(scss|css)$/)) // 自动引入样式

const URL =
  'http://forecast.ecitydata.com:8666/test-open-api/portal/weather/visual'

const MODE = navigator.userAgent.toLowerCase()
const isDev = process.env.NODE_ENV2 === 'development'
console.log(MODE)
console.log('process.env.NODE_ENV2', process.env.NODE_ENV2)
const BGTYPE = {
  CLOUDYDAY: 'xt-cloudday', // 白天，多云的背景
  HEAVYDAY: 'xt-heavyday', // 白天，阴的背景
  FINEDAY: 'xt-fineday', // 晴天，万里无云时的背景
  STARRY: 'xt-starry', // 晴天夜晚星空的背景
  NIGHT: 'xt-night', // 晴天夜晚（没有星星）的背景
}

const initEl = option => {
  console.log('此时的Option', option)
  $.ajax({
    type: 'GET',
    url: URL,
    success: function (res) {
      if (res.code === '0') {
        res.data.hourlyWeather.forEach(v => {
          v.time2 = v.time.split(' ')[1]
          v.time = dayjs(v.time).format('MM/DD') + ' ' + v.time.split(' ')[1]
        })
        new weatherWidget(res.data, option)
      }
    },
  })
}

class weatherWidget {
  constructor(data, option) {
    this.responseData = data
    this.setBG(data) // 设置界面背景
    this.initElement(data, option) // 初始化界面元素
  }
  setBG(data) {
    const sunRiseTime = new Date(`${data.todayWeather.date} 06:00`).getTime()
    const sunGlowTime = new Date(`${data.todayWeather.date} 18:00`).getTime()
    const nowTime = new Date().getTime()
    if (nowTime >= sunRiseTime && nowTime <= sunGlowTime) {
      switch (parseInt(data.nowWeather.code)) {
        case 100:
          this.ACTIVECLASS = BGTYPE.FINEDAY
          break
        case 104:
          this.color1 = 'rgb(111, 124, 133)'
          this.color2 = 'rgb(145, 155, 159)'
          this.ACTIVECLASS = BGTYPE.HEAVYDAY
          break
        case 101:
        case 102:
        case 103:
          this.ACTIVECLASS = BGTYPE.CLOUDYDAY
          break
        case 305:
        case 306:
        case 307:
          this.linecolor = 'rgb(111, 124, 133)'
          this.color1 = 'rgb(111, 124, 133)'
          this.color2 = 'transparent'
          this.ACTIVECLASS = BGTYPE.HEAVYDAY
          break
        default:
          this.ACTIVECLASS = BGTYPE.FINEDAY
      }
    } else {
      switch (data.nowWeather.code) {
        case 150:
          this.ACTIVECLASS = BGTYPE.STARRY
          break
        case 153:
          this.ACTIVECLASS = BGTYPE.NIGHT
          break
        case 154:
          this.ACTIVECLASS = BGTYPE.HEAVYDAY
          break
        case 350:
        case 351:
        case 399:
          this.ACTIVECLASS = BGTYPE.HEAVYDAY
          break
        case 456:
        case 457:
        case 499:
          this.ACTIVECLASS = BGTYPE.HEAVYDAY
          break
        default:
          this.ACTIVECLASS = BGTYPE.NIGHT
      }
    }
  }

  initElement(data, option) {
    this.$xtWeather = $(`#${option.id}`)
    let img = require(`./imgs/weathericon/${data.nowWeather.code}.png`)
    let $basic = $(`
    <div class="xt-weather-hover xt-weather-basic xt-weather-flex xt-weather-flex-align-center" id="${option.id}-basic">
      <span>${data.city}</span>
      <span></span>
      <img src="${img}"></img>
      <span>${data.nowWeather.temp}</span>
    </div>
    `)
    if (option.showBasic) {
      this.$xtWeather.append($basic)
    }
    let $normal = $(`<div class="${option.id}1-container-normal xt-weather-container-normal" id="${option.id}-detail">
    </div>`)
    console.log('option.beAbsolute', option.beAbsolute)
    $(`.${option.id}1-container-normal`).css({
      position: option.beAbsolute,
    })

    this.$xtWeather.append($normal)
    this.$xtDetail = $(`#${option.id}-detail`)

    // 设置大小尺寸
    if (!MODE.includes('mobile')) {
      $(`.${option.id}1-container-normal`).css({
        width: '320px',
        position: option.beAbsolute,
      })
    } else {
      if (!MODE.includes('ipad')) {
        $(`.${option.id}1-container-normal`).css({
          width: '100vw',
          height: '100vh',
          position: option.beAbsolute,
        })
      } else {
        $(`.${option.id}1-container-normal`).css({
          width: window.innerWidth,
          height: window.innerHeight,
          position: option.beAbsolute,
        })
      }
    }
    if (option.showBasic) {
      this.$xtDetail.addClass('noshowweather')
    }

    this.$xtDetail.append(
      `
      <div class="xt-weather-title">
        <div class="xt-weather-location xt-weather-flex xt-weather-flex-align-center">
          <div class="xt-weather-location-icon"></div>
          <span class="xt-weather-hover">${data.city}</span>
        </div>
        <span class="xt-weather-time">${dayjs().format('YYYY年MM月DD日')}</span>
      </div>
      `
    )
    this.createNINA(data.nowWeather.mina, `#${option.id}-detail`)
    this.createBaseInfo(data, option)
  }

  // 创建元素动画
  createNINA(data, id) {
    let arr = data.split(',')
    arr.forEach(v => {
      MINA[v](id)
    })
  }

  createBaseInfo(data, option) {
    let _this = this
    const { tips, nowWeather, todayWeather } = data
    this.$xtDetail.append(
      `
      <div class="xt-weather-real">
        <div class="xt-weather-real-block">
          <div class="xt-weather-real-block-upper">${
            nowWeather.temp.split('℃')[0]
          }°</div>
          <div>${nowWeather.windDirection + '   ' + nowWeather.windScale}</div>
        </div>
        <div class="xt-weather-real-block">
          <div class="xt-weather-real-block-upper">
            <div class="todayweather"><span>${todayWeather.text}</span>${
        todayWeather.low + '~' + todayWeather.high
      }</div>
            
          </div>
          <div>相对湿度 ${nowWeather.humidity}</div>
        </div>

      </div>
      <div class="xt-weather-forecast" >
        ${tips}
      </div>
      <div class="${
        option.id
      }1-forecast-container xt-weather-forecast-container">
        <ul class="${
          option.id
        }1-forecast-swiper xt-weather-forecast-swiper"></ul>
        <div class="${
          option.id
        }1-forecast-swiper-left xt-weather-forecast-swiper-left xt-weather-hover"></div>
        <div class="${
          option.id
        }1-forecast-swiper-right xt-weather-forecast-swiper-right xt-weather-hover"></div>
      </div>
      <div class="xt-weather-realcurve" id="${option.id}-curve"></div>
      <div class="xt-weather-datasource">数据服务来自满星数据</div>
      `
    )

    // 显示
    if (option.showBasic) {
      $(`#${option.id}-basic`).on('mouseenter', function () {
        _this.$xtDetail.toggle(true).addClass(_this.ACTIVECLASS)
        _this.$xtDetail.ready(function () {
          carouselBlock(data.weekWeather, option)
          setCurve(
            `${option.id}-curve`,
            data.hourlyWeather,
            _this.linecolor,
            _this.color1,
            _this.color2
          )
        })
      })
      // 隐藏
      // if (!isDev) {
      this.$xtWeather.on('mouseleave', function () {
        _this.$xtDetail.toggle(false).removeClass(_this.ACTIVECLASS)
      })
      // }
    } else {
      this.$xtDetail.toggle(true).addClass(_this.ACTIVECLASS)
      this.$xtDetail.ready(function () {
        carouselBlock(data.weekWeather, option)
        setCurve(
          `${option.id}-curve`,
          data.hourlyWeather,
          _this.linecolor,
          _this.color1,
          _this.color2
        )
      })
    }
  }
}

if (isDev) {
  initEl({
    id: 'xt-weather',
    showBasic: false,
    beAbsolute: 'absolute',
  })
  initEl({
    id: 'xt-weather2',
    showBasic: true,
    beAbsolute: 'absolute',
  })
}

export default initEl
