## xt-weather-widget
A weather widget based on zepto.

## Usage
1. `$ npm i xt-weather-widget`
2. Add ```<div class="xt-weather" id="xt-weather"></div>``` in any place you want to put it.
3. `import initEl from 'xt-weather-widget'`
4. After page loaded. You can perform `initEl(option)`
   | params | value |
   | :----- | :----- |
   | id | type: string , required |
   | showBasic | type: boolean ,default:true|
   | position | type: string , default:'position' |
  
## 中文
1. 安装xt-weather-widget
   `$ npm i xt-weather-widget`
2. 在任何你想展示weather-widget的地方，添加如下元素：
   ```
   <div class="xt-weather" id="xt-weather"></div>
   ```
3. 在代码中引入 `import initEl from 'xt-weather-widget'`
4. 在页面加载完成之后，执行 `initEl(option)`
   其中option选项的内容如下
   | params | value |
   | :----- | :----- |
   | id | 字符串，就是上面填入的元素id值，必填 |
   | showBasic | 布尔值，默认值为true|
   | position | 字符串，默认值为'absolute' |

更行记录：
1. 2021年2月26日 14:33:26，修改接口（域名变化）