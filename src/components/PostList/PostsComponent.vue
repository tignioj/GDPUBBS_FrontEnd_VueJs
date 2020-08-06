<template>
  <div v-if="posts.length > 0" class="mdui-row-xs-1   mdui-grid-list ">
    <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 my-card"
         v-for="(post, index)  in posts" :key="index"
    >
      <!--          <a :href="'/document/browse.html?postUid=' + post.postUid" class="docLink" style="display:none;"></a>-->
      <!-- 卡片头部，包含头像、标题、副标题 -->
      <router-link tag="div" :to="'/userinfoother/' + post.postUser.userAccount">
        <div class="mdui-card-header">
          <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(post.postUser.userAvatar)"/>
          <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
          <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
          <div class="mdui-card-header-title">{{ post.postUser.userAccount }}
            <span>{{ post.postPrivilege.postPrivilegeDesc }}</span>
          </div>
          <div class="mdui-card-header-subtitle">最后修改时间：{{ post.postDate | date-format }}
          </div>
        </div>
      </router-link>
      <router-link :to="'/post/view/' + post.postUid" tag="div">

        <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
        <div class="mdui-card-media">
          <!--图片地址 -->
          <img v-if="post.postImg" :src="myglobalfun.imgBaseUrl(post.postImg)"/>
          <!-- 卡片中可以包含一个或多个菜单按钮 -->
          <!--        <div class="mdui-card-menu">-->
          <!--          <button class="mdui-btn mdui-btn-icon mdui-text-color-white"><i class="mdui-icon material-icons">share</i></button>-->
          <!--        </div>-->

          <video v-if="post.videoLink" :src="post.videoLink" controls="controls"></video>
          <audio v-if="post.musicLink" class="audio" :src="post.musicLink" controls="controls">
          </audio>
        </div>

        <!-- 卡片的标题和副标题 -->
        <div class="mdui-card-primary blur-bg">
          <div class="mdui-card-primary-title">{{ post.postTitle }}</div>
          <div v-if="post.postTag" class="mdui-card-primary-subtitle">
            <PostViewTag :tags="post.postTag" v-if="post.postTag.length"/>
          </div>
        </div>

        <!-- 卡片的内容 -->
        <div class="mdui-card-content">{{ post.postContent }}</div>

      </router-link>
      <!-- 卡片的按钮 -->
      <div class="mdui-card-actions">
        <button @click="postGood(post.postUid)" class="mdui-btn mdui-btn-icon">
          <i class="mdui-icon material-icons">thumb_up</i>
        </button>
        {{ post.postGood }}

        <button @click="postBad(post.postUid)" class="mdui-btn mdui-btn-icon">
          <i class="mdui-icon material-icons">thumb_down</i>
        </button>
        {{ post.postBad }}

        <button class="mdui-btn mdui-btn-icon">
          <i class="mdui-icon material-icons">comment</i>
        </button>
        {{ post.postCommentReply + post.postComments }}

        <button class="mdui-btn mdui-btn-icon">
          <i class="mdui-icon material-icons">remove_red_eye</i>
        </button>
        {{ post.postViewCount }}

        <button
          v-if="post.postUser.userUid ===  loggedInuserUid"
          @click="$router.push(globaRouterURL.POST_EDIT + '/' + post.postUid)" class="mdui-btn mdui-ripple">编辑
        </button>
        <button
          v-if="(post.postUser.userUid ===  loggedInuserUid) ||
              (userProfile && userProfile.userPri.userPrivilegeId >= 2)"
          @click="deletePost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">删除
        </button>
        <button
          v-if="(userProfile && userProfile.userPri.userPrivilegeId >= 2)"
          @click="banThisPost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">封禁
        </button>
        <!--            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>-->
        <button class="mdui-btn mdui-btn-icon mdui-float-right share-link"
                :data-clipboard-text="baseUrl + '/#/post/view/' + post.postUid"
        >
          <i class="mdui-icon material-icons">share</i>
        </button>
      </div>
    </div>
    <!--如果没有帖子-->
  </div>
</template>

<script>
import PostViewTag from '../PostView/PostViewTag'
import mdui from 'mdui'
import {addPostBad, addPostGood, deleteOnePost, postBan} from '../../api'

export default {
  name: 'PostsComponent',
  components: {PostViewTag},
  data () {
    return {
      fruits: ['大西瓜皮', '香蕉皮', '臭鸡蛋'],
      baseUrl: window.location.origin
    }
  },
  props: ['posts', 'loggedInuserUid', 'userProfile'],
  methods: {
    async confirmDelete (postUid) {
      let post = await deleteOnePost(postUid)
      if (post.code === 0) {
        this.refreshPosts()
      }
    },
    async confirmBan (postUid) {
      let post = await postBan(postUid, true)
      if (post.code === 0) {
        mdui.snackbar({
          message: '封禁成功'
        })
        this.refreshPosts()
      } else {
        mdui.snackbar({
          message: '封禁失败,原因:' + post.data
        })
      }
    },
    refreshPosts () {
      this.$emit('refreshPosts')
    },
    deletePost (postTitle, postUid) {
      const self = this
      mdui.dialog({
        title: '确认删除"' + postTitle + '"吗?',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmDelete(postUid)
            }
          }
        ]
      })
    },
    updatePostInfo (uid, re) {
      let info = re.data
      for (let i = 0; i < this.posts.length; i++) {
        let p = this.posts[i]
        if (p.postUid === uid) {
          p.postGood = info.postGood
          p.postBad = info.postBad
          p.postViewCount = info.postViewCount
          p.postCommentCount = info.commentCount
        }
      }
    },
    async postBad (uid) {
      let re = await addPostBad(uid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '你向楼主扔了一块' + this.fruits[Math.floor((Math.random() * this.fruits.length))]
        })
        this.updatePostInfo(uid, re)
      }
    },
    async postGood (uid) {
      // this.saveCurrentInfo()
      let re = await addPostGood(uid)

      if (re.code === 0) {
        mdui.snackbar({
          message: '点赞成功'
        })
        this.updatePostInfo(uid, re)
      }
    },
    banThisPost (postTitle, postUid) {
      const self = this
      mdui.dialog({
        title: '确认封禁"' + postTitle + '"吗?',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmBan(postUid)
            }
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
.audio {
  width: 100%;
}
</style>
