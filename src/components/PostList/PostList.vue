<template>

  <div id="content" class="mdui-container">
    <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">

      <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 " v-for="(post, index)
        in posts" :key="index">
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
            <img v-if="post.postImg" :src="myglobalfun.imgBaseUrl(post.postImg)"/>
            <!-- 卡片中可以包含一个或多个菜单按钮 -->
            <!--        <div class="mdui-card-menu">-->
            <!--          <button class="mdui-btn mdui-btn-icon mdui-text-color-white"><i class="mdui-icon material-icons">share</i></button>-->
            <!--        </div>-->
          </div>

          <!-- 卡片的标题和副标题 -->
          <div class="mdui-card-primary">
            <div class="mdui-card-primary-title">{{post.postTitle}}</div>
            <div v-if="post.postTag" class="mdui-card-primary-subtitle">
              <PostViewTag :tags="post.postTag" v-if="post.postTag.length"/>
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
          <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
          </button>
        </div>
      </div>

      <!--如果没有帖子-->
      <div v-if="!posts.length">暂时没有帖子哈~</div>
    </div>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import PostViewTag from '../PostView/PostViewTag'

  export default {
    name: 'PostList',
    components: {PostViewTag},
    data () {
      return {
        blockminuid: '',
        posts: [],
        pagecode: 1,
        pagesize: 1
      }
    },
    methods: {
      setPosts (page) {
        localStorage.setItem('currentBlockMinUid', page.currentBlockMinUid)
        let arr = []
        let content = page.content
        content.forEach(post => {
          arr.push(post)
        })
        this.posts = arr
        let te = page.totalElements
        let tp = page.totalPage

        let pc = 1
        let ps = tp / te
        localStorage.setItem('pageCode', pc)
        localStorage.setItem('pageSize', ps)
      },
      reqPosts (blockMinUid) {
        let pc = localStorage.getItem('pageCode')
        let ps = localStorage.getItem('pageSize')
        if (blockMinUid !== null) {
          if (pc === null) {
            pc = 1
          }
          if (ps === null) {
            ps = 5
          }
          console.log('mounted postlist')
          this.$store.dispatch('getPostsByMinBlockUid', {
            currentblockuid: blockMinUid,
            pagecode: pc,
            pagesize: ps
          })
        }
      }
    },
    mounted () {
      let currentBlockMinUid = localStorage.getItem('currentBlockMinUid')
     this.reqPosts(currentBlockMinUid)
    },
    watch: {
      'currentpostsbyblockmin': {
        deep: true,
        handler (val) {
          this.setPosts(val)
        }
      },
      'currentminblock': {
        deep: true,
        handler (val) {
          this.reqPosts(val.blockMinUid)
        }
      }
    },
    computed: {
      ...mapState(['currentminblock', 'currentpostsbyblockmin'])
    },
    created () {
      this.myglobalfun.addBodyComponentClass()
      // 请求帖子
      // this.$store.dispatch('getPostsByMinBlockUid', {})
    }
  }
</script>

<style scoped>

</style>
