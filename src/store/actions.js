/*
通过mutation间接更新state的多个方法的对象
 */
import {
  CHANGE_CURRENT_BLOCKBIG,
  CHANGE_CURRENT_BLOCKMIN,
  RECEIVE_INDEX_BIGBLOCKS,
  RECEIVE_INDEX_POSTS,
  RECEIVE_APOST_BYID,
  RECEIVE_COMMENTS_BY_POSTID,
  RECEIVE_USER_PROFILE,
  RESET_USER_INFO,
  POST_ADD_ONE,
  CHANGE_CURRENT_POSTS_BY_BLOCKMIN
} from './mutation-types'

import {
  reqIndexblockbigs,
  reqIndexPosts,
  reqAPostById,
  reqCommentsByPostId,
  reqLogout,
  reqPostsByMinBlockUid
} from '../api'

export default {
// 同步更新当前所在大板块
  changecurrentbigblock ({commit}, currentbigblock) {
    commit(CHANGE_CURRENT_BLOCKBIG, {currentbigblock})
  },
  changecurrentminblock ({commit}, currentminblock) {
    localStorage.setItem('currentBlockMinUid', currentminblock.blockMinUid)
    commit(CHANGE_CURRENT_BLOCKMIN, {currentminblock})
  },
  changepostsbyminblock ({commit}, posts) {
    commit(CHANGE_CURRENT_POSTS_BY_BLOCKMIN, {posts})
  },
  /**
   * 异步获取主页所有文章
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async getindexposts ({commit}) {
    // 发送异步ajax请求
    const result = await reqIndexPosts()
    // 提交一个mutation
    // if (result.code === 0) {
    const indexposts = result
    commit(RECEIVE_INDEX_POSTS, {indexposts})
    // }
  },
  async getPostsByMinBlockUid ({commit}, {currentblockuid, pagecode, pagesize}) {
    const result = await reqPostsByMinBlockUid(currentblockuid, pagecode, pagesize)
    let page = result.data
    console.log('get:', page)
    commit(CHANGE_CURRENT_POSTS_BY_BLOCKMIN, {page})
  },
  /**
   * 异步获取主页上的侧栏，顶栏（即分类）信息
   * @param commit
   * @param state
   * @returns {Promise<void>}
   */
  async getindexblocksbigs ({commit}) {
    // 发送异步ajax请求
    const result = await reqIndexblockbigs()
    // 提交一个mutation
    // if (result.code === 0) {
    const indexcategory = result
    commit(RECEIVE_INDEX_BIGBLOCKS, {indexcategory})
    // }
  },
  async getpostbyuid ({commit}, {id, callback}) {
    const result = await reqAPostById(id)
    if (result.code === 0) {
      const apost = JSON.parse(result.data)
      console.log(apost)
      commit(RECEIVE_APOST_BYID, {apost})
    }
    callback(result)
  },
  async getcommentsbypostuid ({commit}, {id, callback}) {
    const result = await reqCommentsByPostId(id)
    const comments = result
    commit(RECEIVE_COMMENTS_BY_POSTID, {comments})
    callback && callback()
  },
  // 同步记录用户信息
  recordUser ({commit}, userProfile) {
    commit(RECEIVE_USER_PROFILE, {userProfile})
  },
  // 同步帖子数量+1且更新首页的帖子
  postCountAddOne ({commit}, count) {
    commit(POST_ADD_ONE, {count})
  },
  // 异步登出
  async logout ({commit}) {
    const result = await reqLogout()
    if (result.code === 0) {
      commit(RESET_USER_INFO)
    }
  }
}

/**
 * 语法解释：
 * getAddress({commit,state}, param){
 *   commit('EVENT', playload)
 *
 *   axios.get(param)
 * }
 * 名词：参数解构
 * {commit, state}
 * 被外部调用时，action函数接收一个与store实例具有相同方法和属性的context对象
 * {commit, state}实质上是从 context中拿到这两个属性值
 * context.commit, context.state
 * 在形参中用此方法，就可以免去每次调用context.commit,而是可以直接用commit
 *
 * 等同于
 * getAddress(context) {
 *   context.commit('EVENT', playload)
 *   context.state...
 * }
 */

/**
 * 语法解释2
 * async的用法，它作为一个关键字放到函数前面，用于表示函数是一个异步函数，因为async就是异步的意思， 异步函数也就意味着该函数的执行不会阻塞后面代码的执行
 */


