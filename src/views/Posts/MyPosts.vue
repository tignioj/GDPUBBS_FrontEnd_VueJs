<template>
  <div id="myposts">
<!--    <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed">-->
<!--      &lt;!&ndash; <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed"> &ndash;&gt;-->
<!--      &lt;!&ndash; <div id="navigationBar" class="mdui-appbar"> &ndash;&gt;-->
<!--      <div class="mdui-toolbar mdui-color-theme">-->
<!--        <a  class="mdui-btn mdui-btn-icon" @click.prevent="$router.back()"><i class="mdui-icon material-icons">arrow_back</i></a>-->
<!--        <a href="javascript:;" class="mdui-typo-title">我的帖子</a>-->
<!--        <div class="mdui-toolbar-spacer"></div>-->
<!--        <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>-->
<!--        <a href="javascript:;" @click="$router.go(0)" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>-->
<!--        <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></a>-->
<!--      </div>-->
<!--    </div>-->
    <div id="content" class="mdui-container">
      <div id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
        <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 " v-for="(post, index) in myposts"
             :key="index">
          <a :href="'/document/browse.html?postUid=' + post.postUid" class="docLink" style="display:none;"></a>
          <!-- 卡片头部，包含头像、标题、副标题 -->
          <router-link tag="div" :to="'/userinfoother/' + post.postUser.userAccount">
            <div class="mdui-card-header">
              <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(post.postUser.userAvatar)"/>
              <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
              <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
              <div class="mdui-card-header-title">{{post.postUser.userAccount}}</div>
              <div class="mdui-card-header-subtitle">{{post.postDate | date-format}}</div>
            </div>
          </router-link>

          <router-link :to="globaRouterURL.POST_VIEW + '/' + post.postUid" tag="div">

            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media">
              <!--图片地址 -->
              <img v-if="post.postImg" :src="myglobalfun.imgBaseUrl(post.postImg)"/>
              <!-- 卡片中可以包含一个或多个菜单按钮 -->
              <!--        <div class="mdui-card-menu">-->
              <!--          <button class="mdui-btn mdui-btn-icon mdui-text-color-white"><i class="mdui-icon material-icons">share</i></button>-->
              <!--        </div>-->
            </div>

            <!-- 卡片的标题和副标题 -->
            <div class="mdui-card-primary">
              <div class="mdui-card-primary-title">{{post.postTitle}}</div>
              <div class="mdui-card-primary-subtitle">
                <PostViewTag :tags="post.postTag" v-if="post.postTag.length"/>
              </div>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{post.postContent}}</div>

          </router-link>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <!--            <button class="mdui-btn mdui-ripple">点赞:{{post.postGood}}</button>-->
            <button @click="$router.push(globaRouterURL.POST_EDIT + '/' + post.postUid)" class="mdui-btn mdui-ripple">编辑
            </button>
            <button @click="deletePost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">删除</button>
            <!--            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>-->
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
            </button>
          </div>
        </div>

        <!--如果没有帖子-->
        <div v-if="myposts.length === 0">暂时没有帖子哈~</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {reqMyPosts, deleteOnePost} from '../../api'
  import {dialog} from 'mdui'

  export default {
    name: 'MyPosts',
    data () {
      return {
        myposts: []
      }
    },
    created () {
      this.reqposts()
    },
    methods: {
      deletePost (postTitle, postUid) {
        const self = this
        dialog({
          title: '确认删除' + postTitle + '吗',
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
      async confirmDelete (postUid) {
        let post = await deleteOnePost(postUid)
        if (post.code === 0) {
          this.reqposts()
        }
      },
      async reqposts () {
        let posts = await reqMyPosts()
        this.myposts = JSON.parse(posts.data)
      }
    }
  }
</script>

<style scoped>

</style>
