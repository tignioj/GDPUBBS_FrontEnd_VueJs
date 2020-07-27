/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */
import ajax, {reqBase64Img, reqBlob} from './ajax'

const BASE_URL = 'http://pc.wszjl.com:9999'
// const BASE_URL = 'http://www.wszjl.top:9999'
// const BASE_URL = '/api'

/**
 * 获取所有主页所有帖子
 */
export const reqIndexPosts = () => ajax(BASE_URL + '/index/posts')

// 获取所有的大板块
export const reqIndexblockbigs = () => ajax(BASE_URL + '/index/blockbigs')

/**
 * 根据id获取一篇文章
 * @param id
 * @returns {*|Promise<any>}
 */
export const reqAPostById = (id) => ajax(BASE_URL + `/post/id/${id}`)

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

/**
 * 评论分页查询
 */
export const reqCommentsPageByPostId = (text, id, pc, ps) => ajax(BASE_URL + '/commentspage?text=' + text + '&postuid=' + id + '&pc=' + pc + '&ps=' + ps)

// 密码登录
export const reqPwdLogin = ({username, pwd, code}) => ajax(BASE_URL + '/login/pwdlogin', {
  userAccount: username,
  userPassword: pwd,
  code
}, 'POST')

// 注册
export const reqPwdRegist = ({username, pwd, code}) => ajax(BASE_URL + '/login/pwdregist', {
  userAccount: username,
  userPassword: pwd,
  code
}, 'POST')

// 删除一个帖子
export const deleteOnePost = (postUid) => ajax(BASE_URL + '/post/delete', {
  postUid: postUid
}, 'POST')

// 获取别人对我的评论
// export const getCommentsToMe = () => ajax(BASE_URL + '/comments/tome')
export const reqCommentsPageToMe = (text, pc, ps) => ajax(BASE_URL + '/commentspage/tome?in=' + text + '&pc=' + pc + '&ps=' + ps)
// 获取我对别人评论
export const reqCommentsPageToOthers = (text, pc, ps) => ajax(BASE_URL + '/commentspage/toothers?in=' + text + '&pc=' + pc + '&ps=' + ps)

// 获取我对别人的评论
export const getCommentsToOthers = () => ajax(BASE_URL + '/comments/toothers')

// 删除我的一条评论
export const deleteOneCommentByUid = (uid) => ajax(BASE_URL + '/comments/del', {
  postCommentUid: uid
}, 'POST')

// 异步登出
export const reqLogout = () => ajax(BASE_URL + '/login/logout')

// 获取base64的图片，住主要用于验证码
export const reqbase64Img = (url) => reqBase64Img(BASE_URL + url)

// 获取blob文件， 也可以用于获取验证码
export const reqblob = (url) => reqBlob(BASE_URL + url)

// 实时获取用户信息，保持登陆
export const requserProfile = () => ajax(BASE_URL + '/login/userProfile')

// 编辑用户信息回显
export const getUserInfo = () => ajax(BASE_URL + '/user/getinfo')

// 保存用户编辑信息
export const saveUserInfo = (formData, config) => ajax(BASE_URL + '/user/saveinfo', formData, 'POST', config)

// 请求其它用户信息
export const reqOtherUserProfile = (userAccount) => ajax(BASE_URL + `/user/profile/${userAccount}`)

// 根据名称查询用户
export const getUsersByName = (userAccount) => ajax(BASE_URL + `/user/search?account=${userAccount}`)

// 请求我的帖子
// export const reqMyPosts = () => ajax(BASE_URL + '/post/myposts')
export const reqMyPostsPage = (text, pc, ps) => ajax(BASE_URL + '/post/mypostspage?in=' + text + '&pc=' + pc + '&ps=' + ps)


// 根据当前小板块查询帖子
export const reqPostsByMinBlockUid = (currentblockuid, pagecode, pagesize) => ajax(BASE_URL + '/posts/byminblock?uid=' + currentblockuid + '&pc=' + pagecode + '&ps=' + pagesize)

// 添加帖子
export const addPost = (formData, config) => ajax(BASE_URL + '/post/add', formData, 'POST', config)

// 添加评论
export const addComment = (formData, config) => ajax(BASE_URL + '/comments/add', formData, 'POST', config)

// 更新帖子
export const postUpdate = (formData, config) => ajax(BASE_URL + '/post/update', formData, 'POST', config)

// 搜索帖子
export const getPostsBySearch = (blockBig, blockMin, searchInput, pageCode, pageSize) => ajax(
  BASE_URL + '/posts/search?in=' + searchInput + '&pc=' + pageCode + '&ps=' + pageSize + '&bm=' + blockMin + '&bb=' + blockBig)

// 根据一级评论的ID获取二级评论
export const getCommentRepliesByCommentUid = (commentUid) => ajax(BASE_URL + '/commentreply/getbycommentuid?uid=' + commentUid)

// 添加二级评论
export const addCommentReply = (formDate, config) => ajax(BASE_URL + '/commentreply/add', formDate, 'POST', config)

// 删除二级评论
export const delCommentReply = (uid) => ajax(BASE_URL + '/commentreply/del?uid=' + uid)

// 帖子权限
export const reqPostPrivilege = () => ajax(BASE_URL + '/pri/all')

// ===================== 大板块 =======================

// 添加大板块
export const addBlockBig = (formDate, config) => ajax(BASE_URL + '/blockbig/add', formDate, 'POST', config)

// 大板块分页
export const blockBigList = (searchInput, pageCode, pageSize) => ajax(
  BASE_URL + '/blockbig/list?in=' + searchInput + '&pc=' + pageCode + '&ps=' + pageSize)

// 更新大板块
export const updateBlockBig = (formDate, config) => ajax(BASE_URL + '/blockbig/update', formDate, 'POST', config)
// 删除大板块
export const delBlockBig = (uid) => ajax(BASE_URL + '/blockbig/delete?uid=' + uid)

// 大板块详情
export const reqBlockDetail = (uid) => ajax(BASE_URL + '/blockbig/detail?uid=' + uid)

// 大板块根据UID查询(包含子列表）
export const reqBlockBigByUid = (uid) => ajax(BASE_URL + '/blockbig/get?uid=' + uid)

// ==================== 小板块 ===============
// 添加小板块
export const addBlockMin = (formDate, config) => ajax(BASE_URL + '/blockmin/add', formDate, 'POST', config)

// 小板块分页
export const blockMinListByBlockBigUid = (bbuid, searchInput, pageCode, pageSize) => ajax(
  BASE_URL + '/blockmin/listbybbuid?uid=' + bbuid + '&in=' + searchInput + '&pc=' + pageCode + '&ps=' + pageSize)

// 更新小板块
export const updateBlockMin = (formDate, config) => ajax(BASE_URL + '/blockmin/update', formDate, 'POST', config)
// 删除小板块
export const delBlockMin = (uid) => ajax(BASE_URL + '/blockmin/delete?uid=' + uid)

// 小板块详情
export const reqBlockMinDetail = (uid) => ajax(BASE_URL + '/blockmin/detail?uid=' + uid)

// 小板块编辑回显
// export const reqBlockMinBeforUpdate = (uid) => ajax(BASE_URL + '/blockmin/get?uid=' + uid)
export const reqBlockMinByBlockUid = (uid) => ajax(BASE_URL + '/blockmin/listbybbuid?uid=' + uid)

export const avatar404 = () => ajax(BASE_URL + '/image/avatar404')
