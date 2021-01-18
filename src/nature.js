// 云彩
export const genCloud = () => {
  let $cloud = $(`<div class="xt-cloud1 xt-weather-zindex90">
  </div>
  <div class="xt-cloud2 xt-weather-zindex80">
  </div>`)
  $('#weather-detail').append($cloud)
}

// 阴天
export const genOvercast = () => {
  $('#weather-detail').addClass('xt-weather-filter')
}

// 太阳
export const genSun = () => {
  let $sun = $(`<div class="xt-sun xt-weather-zindex100"></div>`)
  $('#weather-detail').append($sun)
}

// 月亮（圆月）
export const genMoon = () => {
  let $moon = $(`<div class="xt-moon"></div>`)
  for (let i = 0; i < 11; i++) {
    let $mooncrater = $(
      `<div class="xt-moon-crater xt-moon-crater-${i + 1}"></div>`
    )
    $moon.append($mooncrater)
  }
  $('#weather-detail').append($moon)
}

// 月亮（月牙）
export const genMoon2 = () => {
  let $moon = $(
    `
    <svg t="1610938534319" class="xt-moon2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2127" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path d="M557.8 727.2c-175-175-175-458.6 0-633.6 10.5-10.5 21.4-20.4 32.6-29.6-113.4 0.9-226.7 44.6-313.3 131.2-175 175-175 458.6 0 633.6 164.5 164.5 425 174.3 600.9 29.6-115.7 0.9-231.8-42.8-320.2-131.2z" p-id="2128" fill="#f6edbd"></path>
     
      <circle cx="400" cy="200" r="50" fill="#ece1a8"></circle>
      <circle cx="230" cy="500" r="80" fill="#ece1a8"></circle>
      <circle cx="500" cy="800" r="66" fill="#ece1a8"></circle>
      
    </svg>
    `
  )
  // for (let i = 0; i < 11; i++) {
  //   let $mooncrater = $(
  //     `<div class="xt-moon-crater xt-moon-crater-${i + 1}"></div>`
  //   )
  //   $moon.append($mooncrater)
  // }
  $('#weather-detail').append($moon)
}

// 雪
export const genSnow = () => {
  const count = 10
  for (let i = 0; i < count; i++) {
    let $bigSnow = $(`<div class="xt-snow xt-bigsnow-${i + 1}"></div>`)
    let $mediumSnow = $(`<div class="xt-snow xt-mediumsnow-${i + 1}"></div>`)
    let $smallSnow = $(`<div class="xt-snow xt-smallsnow-${i + 1}"></div>`)
    $('#weather-detail').append($bigSnow).append($mediumSnow).append($smallSnow)
  }
}

// 雨
export const genRain = () => {
  const counter = 100
  for (let i = 0; i < counter; i++) {
    let $hr = $('<hr />')
    if (i == counter - 1) {
      $hr.addClass('xt-weather-thunder')
    } else {
      $hr.css({
        left: Math.floor(Math.random() * window.innerWidth - 50) + 'px',
        animationDuration: 0.8 + Math.random() * 0.3 + 's',
        animationDelay: Math.random() * 5 + 's',
      })
    }
    $('#weather-detail').append($hr)
  }
}

// 星空
export const genStarry = () => {
  $('#weather-detail').append(
    `
    <div class="xt-stars"></div>
    `
  )
  const stars = 800 /*星星的密集程度，数字越大越多*/
  const $stars = $('.xt-stars')
  const r = 1000 /*星星的看起来的距离,值越大越远,可自行调制到自己满意的样子*/
  for (let i = 0; i < stars; i++) {
    let $star = $('<div/>').addClass('xt-star')
    $stars.append($star)
  }
  $('.xt-star').each(function () {
    let cur = $(this)
    let s = 0.2 + Math.random() * 1
    let curR = r + Math.random() * 300
    cur.css({
      transformOrigin: '0 0 ' + curR + 'px',
      transform:
        ' translate3d(0,0,-' +
        curR +
        'px) rotateY(' +
        Math.random() * 360 +
        'deg) rotateX(' +
        Math.random() * -50 +
        'deg) scale(' +
        s +
        ',' +
        s +
        ')',
    })
  })
}

// 流星
export const genMeteor = () => {
  for (let i = 0; i < 3; i++) {
    let $meteor = $('<div class="xt-star2"></div>')
    if (i === 1) {
      $meteor.addClass('xt-star2-second')
    } else if (i === 2) {
      $meteor.addClass('xt-star2-third')
    }
    $meteor.css({
      top: Math.random() * 10,
      left: Math.random() * 200 + 200,
    })
    $('#weather-detail').append($meteor)
  }
}
