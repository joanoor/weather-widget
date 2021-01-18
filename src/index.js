import $ from 'zepto-webpack'
import './index.scss'
import { autoImport, setCurve } from './utils'
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
} from './nature'

const dayjs = require('dayjs')
autoImport(require.context('./styles', false, /\w+\.(scss|css)$/)) // 自动引入样式

const MODE = navigator.userAgent.toLowerCase()
const isDev = process.env.NODE_ENV === 'development'
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const responseData = {
  id: 171, // nature
  desc: '今天白天晴，夜晚晴，比昨天暖和很多，现在10°，风很大，空气一般。',
  forecasts: [
    {
      name: '周一',
      temperature: '10°',
    },
    {
      name: '周二',
      temperature: '10°',
    },
    {
      name: '周三',
      temperature: '10°',
    },
    {
      name: '周四',
      temperature: '10°',
    },
    {
      name: '周五',
      temperature: '10°',
    },
    {
      name: '周六',
      temperature: '10°',
    },
    {
      name: '周日',
      temperature: '10°',
    },
  ],
}

let ACTIVECLASS
const BGTYPE = {
  CLOUDYDAY: 'xt-cloudday', // 多云时的背景
  STARRY: 'xt-starry', // 晴天夜晚星空的背景
  FINEDAY: 'xt-fineday', // 晴天，万里无云时的背景
  NIGHT: 'xt-night', // 晴天夜晚（没有星星）的背景
}

const sunRiseTime = new Date('2021-01-15 06:54:33').getTime()
const sunGlowTime = new Date('2021-01-15 17:54:32').getTime()
const nowTime = new Date().getTime()
if (nowTime >= sunRiseTime && nowTime <= sunGlowTime) {
  ACTIVECLASS = BGTYPE.CLOUDYDAY
} else {
  ACTIVECLASS = BGTYPE.STARRY
}

// let script1 = document.createElement('script')
// script1.src = 'http://pv.sohu.com/cityjson?ie=utf-8'
// document.head.appendChild(script1)

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      timeout: 3000,
    })
  } else {
    alert('Geolocation is not supported by this browser!')
  }
}

const handleSuccess = position => {
  const { latitude, longitude } = position.coords
  initEl()
}

const handleError = e => {
  initEl()
  alert('不好意思，获取位置失败，请稍候重试')
}

const initEl = () => {
  $('#xt-weather').append(
    `
    <div class="xt-weather-hover" id="weather-basic">合肥</div>
    <div class="xt-weather-container-normal xt-weather-absolute" id="weather-detail"></div>
    `
  )
  if (!MODE.includes('mobile')) {
    $('.xt-weather-container-normal').css({
      width: '320px',
      height: '630px',
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
    $('#weather-detail').toggle(true).addClass(ACTIVECLASS)
    $('#weather-detail').ready(function () {
      carouselBlock()
      setCurve()
    })
  })

  // 隐藏
  if (!isDev) {
    $('#xt-weather').on('mouseleave', function () {
      $('#weather-detail').toggle(false).removeClass(ACTIVECLASS)
    })
  }

  $('#weather-detail').append(
    `
    <div class="xt-weather-title">
      <div class="xt-weather-location xt-weather-flex xt-weather-flex-align-center">
        <div class="xt-weather-location-icon"></div>
        <span class="xt-weather-hover">合肥</span>
      </div>
      <span class="xt-weather-time">${dayjs().format('YYYY年MM月DD日')}</span>
    </div>
    `
  )
  createNINA(responseData.id)
  createBaseInfo(responseData.id)
}

const createBaseInfo = data => {
  $('#weather-detail').append(
    `
    <div class="xt-weather-real">
      <div class="xt-weather-real-block">
        <div class="xt-weather-real-block-upper">1°</div>
        <div>西风 5级</div>
      </div>
      <div class="xt-weather-real-block">
        <div class="xt-weather-real-block-upper">
          <div>晴</div>
          <div>AQI 良</div>
        </div>
        <div>UV 3</div>
      </div>
      <div class="xt-weather-real-block">
        <div class="xt-weather-real-block-upper"></div>
        <div>相对湿度 20%</div>
      </div>
    </div>
    <div class="xt-weather-forecast" >
      ${responseData.desc}
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

const carouselBlock = () => {
  $('.xt-weather-forecast-container').on('mouseenter', function () {
    $('.xt-weather-forecast-swiper-left').toggle(true)
    $('.xt-weather-forecast-swiper-right').toggle(true)
  })
  $('.xt-weather-forecast-container').on('mouseleave', function () {
    $('.xt-weather-forecast-swiper-left').toggle(false)
    $('.xt-weather-forecast-swiper-right').toggle(false)
  })
  let theight = $('.xt-weather-forecast-container').height()
  let list = responseData.forecasts
  for (let item of list) {
    let $block = $(
      `
      <li class="xt-weather-forecast-swiper-item">
        <div>${item.name}</div>
        <div>${item.temperature}</div>
      </li>
      `
    )
    $(`.xt-weather-forecast-swiper`).append($block)
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

// 创建元素动画
const createNINA = data => {
  switch (data) {
    // 雾天
    case 163:
      $('#weather-detail').append(
        `
        <div class="xt-fog xt-fog1"></div>
        <div class="xt-fog xt-fog2"></div>
        `
      )
      break
    // 雪天
    case 164:
      genSnow()
      break
    // 雨天
    case 165:
      genOvercast()
      genRain()
      break
    // 晴天
    case 166:
      $('#weather-detail').append(
        `
        
        `
      )
      break
    // 多云
    case 167:
      genSun()
      genCloud()
      break
    // 月亮
    case 168:
      genMoon()
      break
    // 月亮
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
        this.num = this.len
      }
      console.log(this.num)
      let cssTrx = -this.num * this.w
      $('.xt-weather-forecast-swiper').css({
        transform: `translateX(${cssTrx}px)`,
      })
    })

    $('.xt-weather-forecast-swiper-right').click(() => {
      this.num++
      if (this.num > this.len) {
        this.num = 0
      }
      let cssTrx = -this.num * this.w
      $('.xt-weather-forecast-swiper').css({
        transform: `translateX(${cssTrx}px)`,
      })
    })
  }
}

if (isDev) {
  $(window).ready(function () {
    getLocation()
  })
}
export default initEl
