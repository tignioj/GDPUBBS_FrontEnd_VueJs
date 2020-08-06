<template>
  <!-- 回复 -->
  <div
    v-show="comments.length > 0"
    class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">
    <div id="postComment" class="mdui-collapse " mdui-collapse>
      <div :id="'#' + postComment.postCommentPlace"
           class="mdui-collapse-item  mdui-collapse-item-open mdui-m-t-1" v-for="(postComment, index) in comments"
           :key="index"
      >
        <!--      <div @click.prevent="showReply(postComment.postCommentUid)" :id="'#' + postComment.postCommentPlace"-->
        <!--           class="mdui-collapse-item  mdui-m-t-1" v-for="(postComment, index) in comments" :key="index"-->
        <!--      >-->
        <!--        <a :href="'#' + 1" :name="'#' + postComment.postCommentPlace">#{{postComment.postCommentPlace}}</a>-->
        <div class="mdui-collapse-item-header"
             :class="postComment.postCommentPlace==$route.query.position ? 'active' : null"
        >
          <!--          <a :id="'#' + postComment.postCommentPlace" >#{{postComment.postCommentPlace}}</a>-->
          <div class="mdui-card">
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <!--用户-->

            <!--            <div @click.prevent="this.globaRouterURL.PROFILE_OTHER  + '/' + postComment.postCommentFromuser.userAccount" >-->
            <div>
              <router-link tag="div" :to="'/userinfoother/' + postComment.postCommentFromuser.userAccount">
                <div class="mdui-card-header">
                  <!--评论者头像-->
                  <img class="mdui-card-header-avatar"
                       :src="myglobalfun.imgBaseUrl(postComment.postCommentFromuser.userAvatar)"/>
                  <div class="mdui-card-header-title mdui-typo">
                    {{ postComment.postCommentPlace }}楼
                    <a> {{ postComment.postCommentFromuser.userAccount }} </a>
                    <span style="color: red" v-if="postComment.postCommentFromuser.userUid === postUserUid">
                  楼主
                  </span>
                    <button v-if="!seeHimOnlyFlag" @click.stop="seeHimOnly(postComment.postCommentFromuser.userUid)"
                            class="seehim-btn mdui-text-color-theme-text">
                      只看它
                    </button>
                    <button v-else @click.stop="unSeeHimOnly()" class="seehim-btn mdui-text-color-theme-text">
                      取消只看它
                    </button>
                  </div>
                  <!--评论日期-->
                  <div class="mdui-card-header-subtitle">{{ postComment.postCommentDate | date-format }}</div>
                </div>
              </router-link>
            </div>

            <!--评论图片-->
            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
              <img :src="myglobalfun.imgBaseUrl(postComment.postCommentImg)" v-if="postComment.postCommentImg"/>
            </div>

            <!--评论内容-->
            <!-- 卡片的内容 -->
            <div class="mdui-card-content">
              {{ postComment.postCommentContent }}
            </div>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">

              <button @click.stop="addCommentGood(postComment.postCommentUid)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">thumb_up</i>
              </button>
              {{ postComment.postCommentGood }}

              <button @click.stop="addCommentBad(postComment.postCommentUid)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">thumb_down</i>
              </button>
              {{ postComment.postCommentBad }}

              <button @click.stop="showReply(postComment)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">comment</i>
              </button>
              {{ postComment.commentReplyCount }}

              <button
                v-if="postComment.postCommentFromuser.userUid ===  loggedInuserUid"
                @click.stop="deleteComment(postComment.postCommentUid)"
                class="mdui-btn mdui-btn-icon ">
                <i class="mdui-icon material-icons">delete</i></button>

              <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                class="mdui-icon material-icons">expand_more</i></button>
            </div>
          </div>
        </div>
        <div class="mdui-collapse-item-body mdui-shadow-1 mdui-m-x-1">

          <!--          <div class="mdui-m-x-1 mdui-typo"-->
          <!--               v-for="(commentReply,index) in getCommentReply(postComment.postCommentUid)" :key="index"-->
          <!--          >-->
          <div class="mdui-m-x-1 mdui-typo"
               v-for="(commentReply,index) in postComment.postCommentReply.slice(0,5)" :key="index"
          >
            <a
              @click="$router.push(globaRouterURL.PROFILE_OTHER + '/' + commentReply.commentReplyFromuser.userAccount)"
            P>
              {{ commentReply.commentReplyFromuser.userAccount }}
            </a>

            <span v-if="postComment.postCommentFromuser.userUid !== commentReply.commentReplyTouser.userUid">
                      回复
                    <a
                      @click="$router.push(globaRouterURL.PROFILE_OTHER + '/' + commentReply.commentReplyTouser.userAccount)"
                    > {{ commentReply.commentReplyTouser.userAccount }} </a>
                    </span> :
            <span @click.stop="showReply(postComment, commentReply.commentReplyFromuser)">
            {{ commentReply.commentReplyContent }}
            </span>
            <!--            {{commentReply.commentReplyFromuser}}: {{commentReply.commentReplyContent}}-->
          </div>

          <div v-if="postComment.commentReplyCount >= 5" class="mdui-m-x-1 mdui-typo">
            <a @click="showReply(postComment)">点击查看更多评论</a>
          </div>
        </div>

      </div>
    </div>


    <!--二级评论-->
    <!--        <PostViewCommentReply :replys="postComment.postCommentReply" :postComment="postComment"/>-->
    <CommentReplyList @commentsUpdate="commentsUpdate" ref="commentReply"/>

<!--    <div class="mdui-m-t-2" id="indicatorcomment">-->
<!--    </div>-->
    <Indicator ref="indicator"
               @reqDataList="reqDataList"
               :maxsize="this.elementMaxSize"
    />
  </div>


</template>

<script>
import {mapState} from 'vuex'
import mdui from 'mdui'
import {
  deleteOneCommentByUid,
  reqCommentsPageByPostId,
  addPostCommentBad,
  addPostCommentGood
} from '../../api'
import CommentReplyList from './CommentReplyList'
import Indicator from '../Indicator'

const postCommentsLocation = 'post_comments_location'
const postCommentsSearchText = 'post_comments_search_text'
const postCommentsByUserId = 'post_comments_byUserId'
const postCommentsPageCode = 'post_comments_pagecode'

export default {
  components: {Indicator, CommentReplyList},
  props: ['apostUid', 'postUserUid', 'commentPlace', 'elementMaxSize'],
  name: 'PostViewComments',
  computed: {
    ...mapState(['userProfile'])
  },
  data () {
    return {
      fruits: ['大西瓜皮', '香蕉皮', '臭鸡蛋'],
      goToLastPage: false,
      position: null,
      seeHimOnlyFlag: false,
      seeByUserId: '',
      loggedInuserUid: '',
      id: '',
      // 搜索
      text: '',
      postUid: '',
      searchInput: '',
      comments: []
    }
  },
  methods: {
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    async addCommentGood (uid) {
      this.saveCurrentInfo()
      let re = await addPostCommentGood(uid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '你给层主点击了个赞'
        })
        this.reqComments()
      }
    },
    async addCommentBad (uid) {
      this.saveCurrentInfo()
      let re = await addPostCommentBad(uid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '你向层主扔了一块' + this.fruits[Math.floor((Math.random() * this.fruits.length))]
        })
        this.reqComments()
      }
    },
    seeHimOnly (userUid) {
      sessionStorage.setItem(postCommentsByUserId, userUid)
      sessionStorage.setItem(postCommentsPageCode, '1')
      this.$refs.indicator.currentPageCode = 1
      this.seeHimOnlyFlag = true
      this.seeByUserId = userUid
      this.reqComments()
    },
    unSeeHimOnly () {
      this.seeHimOnlyFlag = false
      sessionStorage.removeItem(postCommentsByUserId)
      this.seeByUserId = ''
      this.reqComments()
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(postCommentsLocation, pos)
      sessionStorage.setItem(postCommentsSearchText, this.searchInput)
      sessionStorage.setItem(postCommentsPageCode, this.$refs.indicator.currentPageCode)
      console.log(pos)
    },
    deleteBlockMin (name, uid) {
      const self = this
      mdui.dialog({
        title: '确认删除"' + name + '"吗?',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmDelete(uid)
            }
          }
        ]
      })
    },
    loadBlockBloMin () {
      this.reqPosts(this.$refs.indicator.currentPageCode, this.elementMaxSize)
    },
    async reqPosts (currentPageCode, elementMaxSize) {
      if (!currentPageCode) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }
      sessionStorage.setItem(postCommentsPageCode, currentPageCode)
      let re = await reqCommentsPageByPostId(this.seeByUserId, this.searchInput, this.postUid, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
        // this.setResultPosts(re.data)
        this.$refs.indicator.currentPageCode = currentPageCode
        this.$refs.indicator.initIndicator(re.data)
        this.comments = re.data.content
      } else {
        // this.$router.replace('/login')
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
        sessionStorage.removeItem(postCommentsPageCode)
        this.reqComments()
      }
    },
    deleteComment (uid) {
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
              self.confirmDelete(uid)
            }
          }
        ]
      })
    },
    removeCurrentInfo () {
      sessionStorage.removeItem(postCommentsLocation)
      sessionStorage.removeItem(postCommentsPageCode)
      sessionStorage.removeItem(postCommentsSearchText)
    },
    showReply (postComment, replyToUser) {
      this.saveCurrentInfo()
      // this.$refs.commentReply.getCommentReplies()
      // this.$refs['commentReply'].getCommentReplies()
      console.log(postComment)
      this.$refs.commentReply.showReply(postComment, replyToUser)
    },
    async reqComments () {
      this.id = this.$route.params.id
      this.postUid = this.id
      if (this.userProfile !== '') {
        this.loggedInuserUid = this.userProfile.userUid
      }
      let pc = sessionStorage.getItem(postCommentsPageCode)
      if (pc) {
         try {
           pc = parseInt(pc)
         } catch (e) {
           pc = 1
         }
      } else {
        pc = 1
      }
      this.$refs.indicator.currentPageCode = pc
      let text = sessionStorage.getItem(postCommentsSearchText)
      this.searchInput = (text === null) ? '' : text

      console.log('评论请求中...')
      await this.reqPosts(pc, this.$refs.indicator.elementMaxSize)
      console.log('评论请求成功')

      console.log('请求二级评论')
      const self = this
      // this.$nextTick()将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
      this.$nextTick(() => {
        // let place = this.$route.query.position
        let place = self.position
        if (place) {
          this.scrollToElement(place)
        } else {
          let pos = sessionStorage.getItem(postCommentsLocation)
          console.log('scrollto', pos)
          if (pos !== null) {
            window.scrollTo(0, pos)
          }
        }
      })
    },
    scrollToElement (place) {
      let e = document.getElementById('#' + place)
      if (e !== null) {
        e.scrollIntoView({
          block: 'center',
          inline: 'center'
        })
        // this.$emit('scrollToEle', e)
      }
    },
    commentsUpdate (args) {
      // 更新评论
      if (args) {
        if (args.goToLastPage) {
          this.goToLastPage = true
          this.position = args.position
          this.$refs.indicator.currentPageCode = args.lastPage
          sessionStorage.setItem(postCommentsPageCode, args.lastPage)
        }
      }
      this.reqComments()
      this.$emit('commentBottomUpdate')
    }
  },
  // beforeDestroy () {
  //   sessionStorage.removeItem(postCommentsSearchText)
  //   sessionStorage.removeItem(postCommentsByUserId)
  // },
  watch: {
    'userProfile':
      {
        deep: true,
        handler (val) {
          if (val !== '') {
            console.log(val)
            this.loggedInuserUid = val.userUid
          }
        }
      }
  },
  mounted () {
    this.reqComments()
    // Event.$on('commentsUpdate', age => {
    //   this.reqComments()
    // })
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

.active {
  box-shadow: 5px 5px 5px #888888;
}

/*#indicatorcomment {*/
/*  display: flex;*/
/*  border: 1px solid black;*/
/*  justify-content: center;*/
/*  margin: 0 auto 50px auto;*/
/*}*/

.seehim-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
}

.seehim-btn:hover {
  transition: background-color;
  transition-duration: 100ms;
  background-color: lavender;
}
</style>
