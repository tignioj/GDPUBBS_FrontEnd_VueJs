<template>

  <div id="content" class="mdui-container">
    <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
      <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 "
           v-for="(post, index)  in posts" :key="index"
      >
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

    <ul id="pageIndicator">
      <li><a @click="switchPage( 1)">首页</a></li>
      <li v-show="isShowPrevious"><a @click="switchPage( currentPageCode-1)">上一页</a></li>
      <li
        :class="{'hlIndex': p === currentPageCode}"
        v-for="(p, index)  in indexs" :key="index"
      ><a @click="switchPage(p)">{{p}}</a></li>
      <li v-show="isShowNext"><a @click="switchPage( currentPageCode+1)">下一页</a></li>
      <li><a @click="switchPage(totalPageSize)">尾页</a></li>
    </ul>
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
        indexs: [],
        /* 当前第几页 */
        currentPageCode: 1,
        /* 一共多少页 */
        totalPageSize: 1,

        /* 一次请求最多显示多少条记录 */
        elementMaxSize: 5,

        /* 显示下标数量 */
        showIndicatorSize: 5,

        /* 是否显示上一页 */
        isShowPrevious: false,

        /* 是否显示下一页 */
        isShowNext: false
      }
    },
    methods: {
      setPosts (page) {
        localStorage.setItem('currentBlockMinUid', page.currentBlockMinUid)
        let posts = []
        let content = page.content
        content.forEach(post => {
          posts.push(post)
        })
        this.posts = posts
        this.blockminuid = page.currentBlockMinUid

        /**
         * 1. 分页必须的元素
         *  1) 当前页码 currentPageCode
         *  2） 一共多少页 totalPageSize
         *  3） 数据库中一共多少条记录 totalElements
         *
         */
        let tp = page.totalPage
        let te = page.totalElements

        // 1) 当前页码 currentPageCode
        let currentPageCode = localStorage.getItem('currentPageCode')
        if (currentPageCode === null) {
          currentPageCode = 1
        }
        this.currentPageCode = parseInt(currentPageCode)

        // 2）一共多少页 totalPageSize
        this.totalPageSize = tp

        // 3） 数据库中一共多少条记录 totalElements
        this.totalElements = te

        /**
         * 如何显示下标？
         * 1. 显示数量 showIndicatorSize
         * @type {number}
         */

        let indexs = []

        this.isShowNext = currentPageCode < tp
        this.isShowPrevious = currentPageCode > 1

        // 显示5个下标
        let showMax = parseInt(this.showIndicatorSize) + parseInt(currentPageCode)
        // 如果超过总页数，则
        if (showMax >= this.totalPageSize) {
          for (let i = this.totalPageSize - this.showIndicatorSize; i <= this.totalPageSize; i++) {
            if (i <= 0) {
              continue
            }
            indexs.push(i)
          }
        } else {
          for (let i = showMax - this.showIndicatorSize; i < showMax; i++) {
            if (i <= 0) {
              continue
            }
            indexs.push(i)
          }
        }
        this.indexs = indexs
      },
      /**
       * 请求帖子
       * @param currentPageCode 当前第几页
       * @param elementMaxSize 最多显示几条记录
       */
      switchPage (currentPageCode) {
        const self = this
        localStorage.setItem('currentPageCode', currentPageCode)
        this.$store.dispatch('getPostsByMinBlockUid', {
          currentblockuid: self.blockminuid,
          pagecode: currentPageCode,
          pagesize: self.elementMaxSize
        })
      },
      reqPosts (blockMinUid) {
        let currentPageCode = localStorage.getItem('currentPageCode')
        let elementMaxSize = this.elementMaxSize

        if (blockMinUid !== null) {
          if (currentPageCode === null) {
            currentPageCode = 1
          } else if (currentPageCode < 1) {
            currentPageCode = 1
          }
          this.$store.dispatch('getPostsByMinBlockUid', {
            currentblockuid: blockMinUid,
            pagecode: currentPageCode,
            pagesize: elementMaxSize
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
          localStorage.setItem('currentPageCode', '1')
          this.reqPosts(val.blockMinUid)
          // 帖子板块变化，则需要重置下标
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

  #pageIndicator {
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: center;

    margin: auto;
    list-style: none;
    /*border: 1px solid black;*/
  }

  #pageIndicator > li {
    padding: 0;
    margin: 0;
    border: 1px solid rebeccapurple;
  }

  #pageIndicator > li:hover {
    padding: 0;
    margin: 0;
    border: 1px solid rebeccapurple;
  }

  #pageIndicator > li > a {
    cursor: pointer;
    padding: 10px;
    display: block;
    text-decoration: none;
  }

  .hlIndex {
    background: rebeccapurple;
    color: white;
  }
</style>
