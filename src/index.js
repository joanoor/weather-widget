import $ from 'zepto-webpack'
import './index.scss'
import { dayjs, autoImport, setCurve, carouselBlock, notify } from './utils'
import {
  genCloud,
  genOvercast,
  genSun,
  genMoon,
  genMoon2,
  genSnow,
  genRain,
  genStarry,
  genMeteor,
  genWind,
  genFog,
  genHeavy,
} from './nature'
autoImport(require.context('./styles', false, /\w+\.(scss|css)$/)) // 自动引入样式

const URL =
  'http://forecast.ecitydata.com:8666/test-open-api/portal/weather/visual'

const MODE = navigator.userAgent.toLowerCase()
const isDev = process.env.NODE_ENV === 'development'
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
    this.setBG(data)
    // this.getLocation(data)

    this.initElement(data)
  }
  setBG(data) {
    const sunRiseTime = new Date(`${data.todayWeather.date} 06:54`).getTime()
    const sunGlowTime = new Date(`${data.todayWeather.date} 17:30`).getTime()
    const nowTime = new Date().getTime()
    if (nowTime >= sunRiseTime && nowTime <= sunGlowTime) {
      if (data.nowWeather.code === '104') {
        this.color1 = 'rgb(111, 124, 133)'
        this.color2 = 'rgb(145, 155, 159)'
        this.ACTIVECLASS = BGTYPE.HEAVYDAY
      } else if (data.nowWeather.code === '101') {
        this.ACTIVECLASS = BGTYPE.CLOUDYDAY
      } else if (data.nowWeather.code === '100') {
        this.ACTIVECLASS = BGTYPE.FINEDAY
      }
    } else {
      if (data.nowWeather.code === '154') {
        this.ACTIVECLASS = BGTYPE.NIGHT
      }
    }
  }
  getLocation(data) {
    let _this = this
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          _this.handleSuccess(position, data)
        },
        function (e) {
          _this.handleError(e, data)
        },
        {
          timeout: 3000,
        }
      )
    } else {
      alert('Geolocation is not supported by this browser!')
    }
  }
  handleSuccess(position, data) {
    const { latitude, longitude } = position.coords
    this.initElement(data)
  }
  handleError(e, data) {
    this.initElement(data)
    // alert('不好意思，获取位置失败，请稍候重试')
    notify('不好意思，获取位置失败，请稍候重试')
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
      <div class="xt-weather-container-normal xt-weather-absolute" id="weather-detail">
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
        setCurve(data.hourlyWeather, _this.color1, _this.color2)
      })
    })

    // 隐藏
    $('#xt-weather').on('mouseleave', function () {
      $('#weather-detail').toggle(false).removeClass(_this.ACTIVECLASS)
    })

    // $('#weather-detail').append(
    //   `
    //   <div class="xt-weather-title">
    //     <div class="xt-weather-location xt-weather-flex xt-weather-flex-align-center">
    //     </div>
    //     <span class="xt-weather-time">${dayjs().format('YYYY年MM月DD日')}</span>
    //   </div>
    //   `
    // )
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
    this.createNINA(data.nowWeather.code)
    this.createBaseInfo(data)
  }

  // 创建元素动画
  createNINA(data) {
    switch (parseInt(data)) {
      // 白天多云
      case 101:
        genSun()
        genCloud()
        break
      // 少云
      case 102:
        genSun()
        genCloud()
        break
      // 白天阴天
      case 104:
        genHeavy()
        break
      // 大风
      case 162:
        genSun()
        genWind()
        break
      // 雾天
      case 163:
        genSun()
        genFog()
        break
      // 雪天
      case 164:
        genSnow()
        break
      // 雨天
      case 307:
        genOvercast()
        genRain()
        break
      // 晴
      case 100:
        genSun()
        break

      // 晚上阴天
      case 154:
        genMoon2()
        genCloud()
        break
      // 月亮
      case 168:
        genMoon()
        break
      // 月牙
      case 169:
        genMoon2()
        break
      // 星空
      case 170:
        genMoon()
        genStarry()
        break
      // 流星
      case 171:
        genMoon2()
        genMeteor()
        break
    }
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

// initEl()

export default initEl
