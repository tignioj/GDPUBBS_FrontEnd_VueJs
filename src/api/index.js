/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */
import ajax, {reqBase64Img, reqBlob} from './ajax'
// const BASE_URL = 'http://localhost:9999'
const BASE_URL = '/api'

/**
 * 获取所有主页所有帖子
 */
export const reqIndexPosts = () => ajax(BASE_URL + '/index/posts')
export const reqIndexblockbigs = () => ajax(BASE_URL + '/index/blockbigs')

/**
 * 根据id获取一篇文章
 * @param id
 * @returns {*|Promise<any>}
 */
export const reqAPostById = (id) => ajax(BASE_URL + `/post/${id}`)

/**
 * 给帖子点赞或者踩
 * @param id 帖子id
 * @param type 0 为点赞， 1为踩
 * @returns {*|Promise<any>}
 */
export const judgeAPost = (id, type) => ajax(BASE_URL + `/judgepost`, {type, id}, 'POST')

/**
 * 根据帖子id查询所有评论
 * @param id
 * @returns {*|Promise|Promise<any>}
 */
export const reqCommentsByPostId = (id) => ajax(BASE_URL + `/comments/${id}`)

export const reqPwdLogin = ({username, pwd, code}) => ajax(BASE_URL + '/login/pwdlogin', {
  userAccount: username,
  userPassword: pwd,
  code
}, 'POST')

// 异步登出
export const reqLogout = () => ajax(BASE_URL + '/login/logout')

// 获取base64的图片，住主要用于验证码
export const reqbase64Img = (url) => reqBase64Img(BASE_URL + url)

// 获取blob文件， 也可以用于获取验证码
export const reqblob = (url) => reqBlob(BASE_URL + url)

// 实时获取用户信息，保持登陆
export const requserProfile = () => ajax(BASE_URL + '/login/userProfile')

// 请求其它用户信息
export const reqOtherUserProfile = (userAccount) => ajax(BASE_URL + `/user/profile/${userAccount}`)
