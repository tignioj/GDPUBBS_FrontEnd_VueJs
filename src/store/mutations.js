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
  RESET_USER_INFO
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
  }
}
