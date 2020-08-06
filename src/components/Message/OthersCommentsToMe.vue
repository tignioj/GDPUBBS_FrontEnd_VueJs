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
      <div v-if="othersCommentsToMe.length >0" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">

        <div id="postComment" class="mdui-collapse" mdui-collapse>
          <div class="mdui-collapse-item  mdui-m-t-1" v-for="(comment, index) in othersCommentsToMe" :key="index"
               @click="(othersCommentsToMe && comment.post) ?goToPost(comment.post.postUid, comment.id):''"
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
                    {{ comment.fromUser.userAccount }}
                    {{ comment.type === 'comment_reply' ? '回复了你的评论' : '回复帖子' }}:
                    <span class="mdui-float-right">
                      {{ comment.post ? comment.post.postTitle : '帖子已删除' }}
                    </span>
                  </div>
                  <!--评论日期-->
                  <div class="mdui-card-header-subtitle">{{ comment.replyDate | date-format }}</div>
                </div>
                <!--评论图片-->
                <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
                <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
                  <img :src="myglobalfun.imgBaseUrl(comment.imgUrl)"
                       v-if="comment.imgUrl"/>
                </div>

                <!--评论内容-->
                <!-- 卡片的内容 -->
                <div class="mdui-card-content">
                  <div v-if="comment.postComment">
                    原评论: {{ comment.postComment.postCommentFromuser.userAccount }}: {{ comment.summary }}
                    <div>
                      {{ comment.fromUser.userAccount }}:{{ comment.content }}
                    </div>
                  </div>
                  <div v-else>
                    原帖: {{ comment.fromUser.userAccount }}: {{ comment.summary }}
                    <div>
                      {{ comment.fromUser.userAccount }}:{{ comment.content }}
                    </div>
                  </div>
                </div>

                <!-- 卡片的按钮 -->
                <div class="mdui-card-actions">
                  <!--                  <button class="mdui-btn mdui-ripple">赞{{comment.postCommentGood}}</button>-->
                  <!--                  <button class="mdui-btn mdui-ripple">踩{{comment.postCommentBad}}</button>-->
                  <!--                <button class="mdui-btn mdui-ripple">编辑</button>-->
                  <!--                  <button @click.stop="deleteComment(comment.postCommentUid)" class="mdui-btn mdui-ripple">删除</button>-->
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
      <!--      <div v-show="othersCommentsToMe.length > 0" class="mdui-m-t-2" id="indicatortome"></div>-->
      <!--      <div v-show="othersCommentsToMe.length > 0" class="mdui-m-t-2" id="indicatortome"></div>-->
      <Indicator v-show="othersCommentsToMe.length >0" ref="indicator" @reqDataList="reqDataList"/>
    </div>
    <div v-if="!hasLoaded">
      <div class="mdui-progress">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {deleteOneCommentByUid, reqCommentsPageToMe} from '../../api'
import {mapState} from 'vuex'
import mdui from 'mdui'
import Indicator from '../Indicator'

const otherCommentsToMeLocation = 'other_comments_to_me_location'
const otherCommentsToMeSearchText = 'other_comments_to_me_search_text'
const otherCommentsToMePageCode = 'other_comments_to_me_pagecode'

export default {
  name: 'OthersCommentsToMe',
  components: {Indicator},
  computed: {
    ...mapState(['userProfile'])
  },
  watch: {
    'userProfile': {
      deep: true,
      handler (val) {
        if (val !== '') {
          console.log(val)
          this.loggedInuserUid = val.userUid
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      hasLoaded: false,
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      loggedInuserUid: null,
      othersCommentsToMe: []
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
      sessionStorage.setItem(otherCommentsToMePageCode, currentPageCode)
      console.log('currentPageCode:', currentPageCode)
      let re = await reqCommentsPageToMe(
        this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
        this.$refs.indicator.currentPageCode = currentPageCode
        this.$refs.indicator.initIndicator(re.data)
        this.othersCommentsToMe = re.data.content
      } else {
        mdui.snackbar({
          message: '服务器出错'
        })
      }
    },
    async confirmDelete (uid) {
      let re = await deleteOneCommentByUid(uid)
      console.log(re)
      if (re.code === 0) {
        console.log(re.data)
        mdui.snackbar({
          message: '删除成功'
        })
        this.reqComments()
      }
    },
    async reqComments () {
      let pc = sessionStorage.getItem(otherCommentsToMePageCode)
      let currentPageCode = (pc === null) ? 1 : parseInt(pc)
      let text = sessionStorage.getItem(otherCommentsToMeSearchText)
      this.searchInput = (text === null) ? '' : text


      await this.reqPosts(currentPageCode, this.$refs.indicator.elementMaxSize)
      this.hasLoaded = true
      this.$nextTick(() => {
        let pos = sessionStorage.getItem(otherCommentsToMeLocation)
        console.log('scrollto', pos)
        if (pos !== null) {
          window.scrollTo(0, pos)
        }
      })
    },
    goToPost (id, place) {
      this.$router.push('/post/view/' + id + '?position=' + place)
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(otherCommentsToMeLocation, pos)
      sessionStorage.setItem(otherCommentsToMeSearchText, this.searchInput)
      sessionStorage.setItem(otherCommentsToMePageCode, this.$refs.indicator.currentPageCode)
    },
    search () {
      sessionStorage.setItem(otherCommentsToMeSearchText, this.searchInput)
      sessionStorage.removeItem(otherCommentsToMeLocation)
      sessionStorage.removeItem(otherCommentsToMePageCode)
      this.$refs.indicator.currentPageCode = 1
      this.reqComments()
    }
  },

  mounted () {
    this.hasLoaded = false
    if (this.$parent.active === 1) {
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

#indicatortome {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
