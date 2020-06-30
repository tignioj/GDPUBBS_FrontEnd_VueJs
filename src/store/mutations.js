/*
直接更新state的多个方法的对象
 */
// import Vue from 'vue'
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

export default {
  [CHANGE_CURRENT_BLOCKBIG] (state, {currentbigblock}) {
    state.currentbigblock = currentbigblock
  },
  [CHANGE_CURRENT_BLOCKMIN] (state, {currentminblock}) {
    state.currentminblock = currentminblock
  },
  [RECEIVE_INDEX_BIGBLOCKS] (state, {indexcategory}) {
    state.indexcategory = indexcategory
  },
  [RECEIVE_INDEX_POSTS] (state, {indexposts}) {
    state.indexposts = indexposts
  },
  [RECEIVE_APOST_BYID] (state, {apost}) {
    state.apost = apost
  },
  [RECEIVE_COMMENTS_BY_POSTID] (state, {comments}) {
    state.comments = comments
  },
  [RECEIVE_USER_PROFILE] (state, {userProfile}) {
    state.userProfile = userProfile
  },
  [RESET_USER_INFO] (state) {
    state.userProfile = ''
  },
  [POST_ADD_ONE] (state, {count}) {
    state.userProfile.posts = parseInt(state.userProfile.posts) + count
  },
  // 注意参数名称必须和调用时候的一样
  [CHANGE_CURRENT_POSTS_BY_BLOCKMIN] (state, {page}) {
    console.log('commit:', page)
    state.currentpostsbyblockmin = page
  }
}
