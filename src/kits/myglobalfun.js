import common from './common.js'
/**
 * 清除应用栏，侧栏，顶栏的空位
 */
const cleanBodyComponentClass = function () {
  document.body.classList.remove("mdui-appbar-with-tab-larger", "mdui-appbar-with-toolbar", "mdui-bottom-nav-fixed")
}

/**
 * 加上应用栏，侧栏，顶栏的空位
 */
const addBodyComponentClass = function () {
  document.body.classList.add("mdui-appbar-with-tab-larger", "mdui-appbar-with-toolbar", "mdui-bottom-nav-fixed")
}


/**
 * 只保留侧栏，顶部栏，清除应用栏
 */
const cleanTopTabCard = function () {
  addBodyComponentClass()
  document.body.classList.remove("mdui-appbar-with-tab-larger")
}

/**
 * 只保留侧栏
 */
const onlyTopHeaderBar = function () {
  addBodyComponentClass()
  document.body.classList.remove("mdui-appbar-with-tab-larger", "mdui-appbar-with-toolbar")
}



/**
 * 返回公共图片地址
 * @param url
 * @returns {string}
 */
const imgBaseUrl = function (url) {
  return common.imgurl + url
}

/* 必须提供install方法 */
const install = function (Vue, option) {
  Vue.prototype.myglobalfun = {
    cleanBodyComponentClass,
    cleanTopTabCard,
    addBodyComponentClass,
    imgBaseUrl,
    onlyTopHeaderBar
  }
}

export default {
  install
}
