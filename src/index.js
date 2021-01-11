import $ from 'zepto-webpack'
import './index.scss'
const url = `http://pv.sohu.com/cityjson?ie=utf-8`

const getLocation = () => {
  $('head').append(`<script src=${url}></script>`)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, { timeout: 10000 })
  } else {
    alert('Geolocation is not supported by this browser!')
  }
}

const success = position => {
  console.log('告诉我结果', position)
  const { latitude, longitude } = position.coords
  // axios.get(url).then(res => {
  //   console.log('......', res)
  // })
  initEl()

  // console.log(returnCitySN)
}

const error = e => {
  alert('不好意思，获取位置失败，请稍候重试')
  initEl()
}

const initEl = () => {
  console.log('$', $)
  $("<div class='xt-weather' />", {
    text: '合肥',
    class: 'xt-weather-hover',
    id: 'weather-basic',
  })
  // const el = document.createElement('div')
  // el.setAttribute('id', 'weather')
  // el.classList.add('xt-weather')
  // el.innerHTML = `<span class='xt-weather-hover' id='weather-basic'>合肥</span>`
  // el.setAttribute('style', `position:relative;`)
  // document.body.appendChild(el)
  // const elc = document.createElement('div')
  // elc.classList.add('xt-weather-detail')
  // elc.setAttribute('style', ``)
  // el.appendChild(elc)
  // const basic = document.getElementById('weather-basic')
  // basic.addEventListener('mouseenter', function () {
  //   elc.classList.add('xt-weather-container')
  // })
  // el.addEventListener('mouseleave', function () {
  //   elc.classList.remove('xt-weather-container')
  // })
}

getLocation()
