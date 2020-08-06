<template>
  <div>
    <div v-show="hasLoaded">
      <div class="mdui-row  mdui-p-b-2">
        <div class="mdui-col-xs-12 mdui-col-sm-8">
          <div class="mdui-textfield mdui-p-b-2 mdui-p-t-2">
            <input
              v-model="searchInput"
              class="mdui-textfield-input" type="text" placeholder="搜索回复内容"/>
          </div>
        </div>
        <div class="mdui-col-xs-12 mdui-col-sm-4 mdui-p-b-2 mdui-p-t-2">
          <button
            class="mdui-btn mdui-color-theme-accent mdui-ripple  mdui-btn-block"
            @click.prevent="search()"
          >搜索
          </button>
        </div>
      </div>

      <!-- 回复 -->
      <div v-if="myCommentsToOthers.length >0" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">
        <div id="postComment" class="mdui-collapse" mdui-collapse>
          <div class="mdui-collapse-item  mdui-m-t-1" v-for="(comment, index) in myCommentsToOthers" :key="index"
               @click="(myCommentsToOthers && comment.post)?goToPost(comment.post.postUid, comment.id):''"
          >
            <div class="mdui-collapse-item-header">
              <div class="mdui-card">
                <!-- 卡片头部，包含头像、标题、副标题 -->
                <!--用户-->
                <div class="mdui-card-header">
                  <!--评论者头像-->
                  <img class="mdui-card-header-avatar"
                       :src="myglobalfun.imgBaseUrl(comment.fromUser.userAvatar)"/>
                  <div class="mdui-card-header-title">
                    我回复了 {{ comment.type === 'post_comment' ? '帖子' : '评论' }}
                    <span class="mdui-float-right">
                    {{ comment.post ? comment.post.postTitle : '原文已删除' }}
                  </span>
                  </div>
                  <!--评论日期-->
                  <div class="mdui-card-header-subtitle">{{ comment.replyDate | date-format }}</div>
                </div>
                <!--评论内容-->
                <!-- 卡片的内容 -->
                <div class="mdui-card-content">
                  <div>
                    原文： {{ comment.toUser.userAccount }}:{{ comment.summary }}
                  </div>
                  <div>
                    我:{{ comment.content }}
                  </div>
                </div>

                <!--评论图片-->
                <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
                <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
                  <img :src="myglobalfun.imgBaseUrl(comment.imgUrl)"
                       v-if="comment.imgUrl"/>
                </div>


                <!-- 卡片的按钮 -->
                <div class="mdui-card-actions">
                  <!--                <button class="mdui-btn mdui-ripple">赞{{comment.postCommentGood}}</button>-->
                  <!--                <button class="mdui-btn mdui-ripple">踩{{comment.postCommentBad}}</button>-->
                  <!--                <button class="mdui-btn mdui-ripple">编辑</button>-->
                  <button @click.stop="deleteComment(comment.id, comment.type)" class="mdui-btn mdui-ripple">删除</button>
                  <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                    class="mdui-icon material-icons">expand_more</i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        没有评论哈
      </div>
      <!--      <div v-show="myCommentsToOthers.length >0" class="mdui-m-t-2" id="indicatortoother"></div>-->
      <Indicator  v-show="myCommentsToOthers.length >0" ref="indicator" @reqDataList="reqDataList"/>
    </div>
    <div v-if="!hasLoaded">
      <div class="mdui-progress">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>

import {deleteOneCommentByUid, delCommentReply, reqCommentsPageToOthers} from '../../api'
import mdui from 'mdui'
import Indicator from '../Indicator'

const myCommentsToOthersLocation = 'my_comments_to_others_location'
const myCommentsToOthersSearchText = 'my_comments_to_others_search_text'
const myCommentsToOthersPageCode = 'my_comments_to_others_pagecode'

export default {
  name: 'MyCommentsToOthers',
  components: {Indicator},
  data () {
    return {
      hasLoaded: false,
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      loggedInuserUid: null,
      myCommentsToOthers: []
    }
  },
  methods: {
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    async reqPosts (currentPageCode, elementMaxSize) {
      if (!currentPageCode) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }
      sessionStorage.setItem(myCommentsToOthersPageCode, currentPageCode)
      let re = await reqCommentsPageToOthers(
        this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      this.hasLoaded = true
      if (re.code === 0) {
        this.$refs.indicator.currentPageCode = currentPageCode
        this.$refs.indicator.initIndicator(re.data)
        this.myCommentsToOthers = re.data.content
      } else {
        mdui.snackbar({
          message: '服务器出错'
        })
      }
    },
    reqComments () {
      let pc = sessionStorage.getItem(myCommentsToOthersPageCode)
      let currentPageCode = (pc === null) ? 1 : parseInt(pc)
      let text = sessionStorage.getItem(myCommentsToOthersSearchText)
      this.searchInput = (text === null) ? '' : text
      this.reqPosts(currentPageCode, this.$refs.indicator.elementMaxSize)
      this.$nextTick(() => {
        let pos = sessionStorage.getItem(myCommentsToOthersLocation)
        console.log('scrollto', pos)
        if (pos !== null) {
          window.scrollTo(0, pos)
        }
      })
    },
    goToPost (id, place) {
      this.$router.push('/post/view/' + id + '?position=' + place)
    },
    async confirmDeletePostComment (uid) {
      let re = await deleteOneCommentByUid(uid)
      console.log(re)
      if (re.code === 0) {
        console.log(re.data)
        mdui.snackbar({
          message: '删除成功'
        })
        let pos = window.pageYOffset
        sessionStorage.setItem(myCommentsToOthersLocation, pos)
        this.reqPosts(this.$refs.indicator.currentPageCode, this.$refs.indicator.elementMaxSize)
      }
    },
    async confirmDeleteCommentsReply (uid) {
      let re = await delCommentReply(uid)
      console.log(re)
      if (re.code === 0) {
        console.log(re.data)

        mdui.snackbar({
          message: '删除成功'
        })
        let pos = window.pageYOffset
        sessionStorage.setItem(myCommentsToOthersLocation, pos)
        this.reqPosts(this.$refs.indicator.currentPageCode, this.$refs.indicator.elementMaxSize)
      }
    },
    search () {
      sessionStorage.setItem(myCommentsToOthersSearchText, this.searchInput)
      sessionStorage.removeItem(myCommentsToOthersLocation)
      sessionStorage.removeItem(myCommentsToOthersPageCode)
      this.$refs.indicator.currentPageCode = 1
      this.reqComments()
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(myCommentsToOthersLocation, pos)
      sessionStorage.setItem(myCommentsToOthersSearchText, this.searchInput)
      sessionStorage.setItem(myCommentsToOthersPageCode, this.$refs.indicator.currentPageCode)
    },
    deleteComment (uid, type) {
      const self = this
      mdui.dialog({
        title: '确认删除吗',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              if (type === 'post_comment') {
                self.confirmDeletePostComment(uid)
              } else if (type === 'comments_reply') {
                self.confirmDeleteCommentsReply(uid)
              }
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.hasLoaded = false
    if (this.$parent.active === 0) {
      this.reqComments()
    }
  }
}
</script>

<style scoped>
.my-img {
  width: 50% !important;
}

.my-img-rounded img {
  border-radius: 10px;
}

@media screen and (min-width: 600px) {
  .my-img {
    width: 60%;
  }
}

@media screen and (min-width: 768px) {
  .my-img {
    width: 50%;
  }
}

#indicatortoother {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
