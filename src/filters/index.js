
import Vue from 'vue'

/* 由于经过npm run build --report分析 monent的js文件庞大, 因此我们使用date-fns, 轻量级格式化库 */
// import Moment from 'moment'
import format from 'date-fns/format'

// 自定义名称：这里取为date-format
/**
 * 参数：第一个是要被过滤的日期字符串，第二个参数可选，如果传入则为传入的值，否则默认为'YYYY-MM-DD HH:mm:ss'
 */
Vue.filter('date-format', function (value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  // 弃用moment
  // return Moment(value).format(formatStr)

  // 使用date-fns
  return format(value, formatStr)
})


// 使过滤器生效，还需要在App.vue同级目录下的main.js下import该此js，以达到运行的效果
// import './filters' //加载过滤器


// 使用过滤器例子
// <div class="time">{{rating.rateTime | date-format}}</div>
