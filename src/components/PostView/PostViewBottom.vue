<template>

  <div id="bottomNav" class="mdui-bottom-nav  mdui-color-theme">
    <a href="javascript:void(0)" @click="openCommentEditor(true)" class="mdui-ripple mdui-ripple-white ">
      <i class="mdui-icon material-icons">edit</i>
      <label>回复{{ replyCount }}</label>
    </a>
    <a @click="postGood" href="javascript:void(0);" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">thumb_up</i>
      <label>点赞{{ goodCount }}</label>
    </a>

    <a @click="postBad" href="javascript:void(0)" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">thumb_down</i>
      <label>踩踩{{ badCount }}</label>
    </a>
    <a @click="postFavour" href="javascript:void(0);" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">star_border</i>
      <label>收藏{{ favourCount }}</label>
    </a>
  </div>

</template>

<script>

import {addPostBad, addPostGood, reqAPostViewInfoById} from '../../api'
import mdui from 'mdui'

export default {
  name: 'PostViewBottom',
  props: ['postUid'],
  data () {
    return {
      goodCount: 0,
      badCount: 0,
      favourCount: 0,
      replyCount: 0
    }
  },
  methods: {
    goTo (path) {
      this.$router.replace(path)
    },
    commentsBottomUpdate () {
      debugger
      this.loadViewInfo(this.postUid)
    },
    async postFavour () {
      mdui.snackbar({
        message: '功能开发中...',
        position: 'top'
      })
    },
    async postBad () {
      let re = await addPostBad(this.postUid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '踩踩成功',
          position: 'top'
        })
        this.loadViewInfo(this.postUid)
      }
    },
    async postGood () {
      let re = await addPostGood(this.postUid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '点赞成功',
          position: 'top'
        })
        this.loadViewInfo(this.postUid)
      }
    },
    openCommentEditor (isShow) {
      console.log('open replyer')
      this.$emit('showEditor', isShow)
    },
    async loadViewInfo (postUid) {
      let re = await reqAPostViewInfoById(postUid)
      if (re.code === 0) {
        let p = re.data
        this.replyCount = p.commentCount
        this.badCount = p.postBad
        this.goodCount = p.postGood
        this.favourCount = p.postFavour
      }
    }
  },
  mounted () {
    document.body.classList.add('mdui-bottom-nav-fixed')
    this.loadViewInfo(this.postUid)
  }
}
</script>

<style>

</style>

