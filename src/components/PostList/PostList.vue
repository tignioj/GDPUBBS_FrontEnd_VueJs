<template>

    <div id="content" class="mdui-container">
      <div id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
        <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 " v-for="(post, index) in currentblockposts" :key="index">
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

          <router-link :to="'/post/view/' + post.postUid" tag="div">

            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media">
              <!--图片地址 -->
              <img  v-if="post.postImg"  :src="myglobalfun.imgBaseUrl(post.postImg)" />
              <!-- 卡片中可以包含一个或多个菜单按钮 -->
              <!--        <div class="mdui-card-menu">-->
              <!--          <button class="mdui-btn mdui-btn-icon mdui-text-color-white"><i class="mdui-icon material-icons">share</i></button>-->
              <!--        </div>-->
            </div>

            <!-- 卡片的标题和副标题 -->
            <div class="mdui-card-primary">
              <div class="mdui-card-primary-title">{{post.postTitle}}</div>
              <div class="mdui-card-primary-subtitle">
                <PostViewTag :tags="post.postTag" v-if="post.postTag.length" />
              </div>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{post.postContent}}</div>

          </router-link>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <button class="mdui-btn mdui-ripple">点赞:{{post.postGood}}</button>
            <button class="mdui-btn mdui-ripple">踩:{{post.postBad}}</button>
            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i></button>
          </div>
        </div>

        <!--如果没有帖子-->
        <div v-if="!currentblockposts.length">暂时没有帖子哈~</div>
      </div>
    </div>

</template>

<script>
  import {mapState} from 'vuex'
  import PostViewTag from '../PostView/PostViewTag'

  export default {
    name: 'PostList',
    components: {PostViewTag},
    computed: {
      ...mapState(['currentminblock', 'indexposts']),
      currentblockposts () {
        let arr = []
        const {currentminblock, indexposts} = this
        // 如果当前分类下没有小版块
        if (typeof (currentminblock) === "undefined") {
          // 返回空串数组
          return []
        }
        indexposts.forEach(post => {
          if (post.postMBlock === currentminblock.blockMinUid) {
            arr.push(post)
          }
        })
        return arr
      }
    },
    created () {
      this.myglobalfun.addBodyComponentClass()
    }
  }
</script>

<style scoped>

</style>
