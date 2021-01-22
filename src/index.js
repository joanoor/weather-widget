import $ from 'zepto-webpack'
import './index.scss'
import { dayjs, autoImport, setCurve, carouselBlock } from './utils'
import MINA from './nature'

autoImport(require.context('./styles', false, /\w+\.(scss|css)$/)) // 自动引入样式

const URL =
  'http://forecast.ecitydata.com:8666/test-open-api/portal/weather/visual'

const MODE = navigator.userAgent.toLowerCase()
const isDev = process.env.NODE_ENV === 'development'
console.log(MODE)
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const BGTYPE = {
  CLOUDYDAY: 'xt-cloudday', // 白天，多云的背景
  HEAVYDAY: 'xt-heavyday', // 白天，阴的背景
  FINEDAY: 'xt-fineday', // 晴天，万里无云时的背景
  STARRY: 'xt-starry', // 晴天夜晚星空的背景
  NIGHT: 'xt-night', // 晴天夜晚（没有星星）的背景
}

const initEl = () => {
  $.ajax({
    type: 'GET',
    url: URL,
    success: function (res) {
      if (res.code === '0') {
        res.data.hourlyWeather.forEach(v => {
          v.time2 = v.time.split(' ')[1]
          v.time = dayjs(v.time).format('MM/DD') + ' ' + v.time.split(' ')[1]
        })
        new weatherWidget(res.data)
      }
    },
  })
}

class weatherWidget {
  constructor(data) {
    this.responseData = data
    this.setBG(data) // 设置界面背景
    this.initElement(data) // 初始化界面元素
  }
  setBG(data) {
    const sunRiseTime = new Date(`${data.todayWeather.date} 06:54`).getTime()
    const sunGlowTime = new Date(`${data.todayWeather.date} 17:30`).getTime()
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

  initElement(data) {
    let _this = this
    let img = require(`./imgs/weathericon/${data.nowWeather.code}.png`)
    $('#xt-weather').append(
      `
      <div class="xt-weather-hover xt-weather-flex xt-weather-flex-align-center" id="weather-basic">
        <span>${data.city}</span>
        <span></span>
        <img src="${img}"></img>
        <span>${data.nowWeather.temp}</span>
      </div>
      <div class="xt-weather-container-normal" id="weather-detail">
      </div>
      `
    )
    // 设置大小尺寸
    if (!MODE.includes('mobile')) {
      $('.xt-weather-container-normal').css({
        width: '320px',
      })
    } else {
      if (!MODE.includes('ipad')) {
        $('.xt-weather-container-normal').css({
          width: '100vw',
          height: '100vh',
        })
      } else {
        $('.xt-weather-container-normal').css({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }
    // 显示
    $('#weather-basic').on('mouseenter', function () {
      $('#weather-detail').toggle(true).addClass(_this.ACTIVECLASS)
      $('#weather-detail').ready(function () {
        carouselBlock(data.weekWeather)
        setCurve(
          data.hourlyWeather,
          _this.linecolor,
          _this.color1,
          _this.color2
        )
      })
    })

    // 隐藏
    if (!isDev) {
      $('#xt-weather').on('mouseleave', function () {
        $('#weather-detail').toggle(false).removeClass(_this.ACTIVECLASS)
      })
    }
    $('#weather-detail').append(
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
    this.createNINA(data.nowWeather.mina)
    this.createBaseInfo(data)
  }

  // 创建元素动画
  createNINA(data) {
    let arr = data.split(',')
    arr.forEach(v => {
      MINA[v]()
    })
  }

  createBaseInfo(data) {
    const { tips, nowWeather, todayWeather } = data
    $('#weather-detail').append(
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
      <div class="xt-weather-forecast-container">
        <ul class="xt-weather-forecast-swiper"></ul>
        <div class="xt-weather-forecast-swiper-left xt-weather-hover"></div>
        <div class="xt-weather-forecast-swiper-right xt-weather-hover"></div>
      </div>
      <div class="xt-weather-realcurve" id="realcurve"></div>
      <div class="xt-weather-datasource">数据服务来自满星数据</div>
      `
    )
  }
}

if (isDev) {
  initEl()
}

export default initEl
