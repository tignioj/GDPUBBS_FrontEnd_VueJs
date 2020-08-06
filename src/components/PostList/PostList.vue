<template>
  <div class="mdui-container">
    <div v-if="this.blockminName === '网抑'" class="mdui-card mdui-m-t-2">
      <div class="mdui-card-header">
        <img class="mdui-card-header-avatar" src="http://myimg.wszjl.top/images/icon/wy.ico"/>
        <div class="mdui-card-header-title">网易云官方</div>
        <div class="mdui-card-header-subtitle">音乐的力量</div>
      </div>
      <div class="mdui-card-media">
        <img src="http://myimg.wszjl.top/images/background/cover/snjxy.jpg"/>
        <audio class="audio" src="http://music.wszjl.top/1.mp3" controls="controls">
        </audio>
      </div>

      <div class="mdui-card-primary">
        <div class="mdui-card-primary-title mdui-typo"><a
          href="https://music.163.com/#/song?id=1384026889">CMJ-所念皆星河</a></div>
        <div class="mdui-card-primary-subtitle"> 已经六年级了啊，好想爱这个世界</div>
      </div>
      <div class="mdui-card-content">却已经失去了爱的能力</div>
    </div>
    <div v-if="this.blockminName === '网抑'" class="mdui-card mdui-m-t-2">
      <!-- 卡片头部，包含头像、标题、副标题 -->
      <div class="mdui-card-header">
        <img class="mdui-card-header-avatar" src="http://myimg.wszjl.top/images/icon/bilibili.ico"/>
        <div class="mdui-card-header-title">Bilibili</div>
        <div class="mdui-card-header-subtitle">网抑云终结者</div>
      </div>

      <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
      <div class="mdui-card-media">
        <video src="http://video.wszjl.top/wyyzjz.mp4" controls="controls"></video>
      </div>

      <!-- 卡片的标题和副标题 -->
      <div class="mdui-card-primary">
        <div class="mdui-card-primary-title mdui-typo"><a href="https://www.bilibili.com/video/BV15D4y1U7F1/">为什么海水和眼泪都是咸的 </a>
        </div>
        <!--        <div class="mdui-card-primary-subtitle"></div>-->
      </div>
      <!-- 卡片的内容 -->
      <!--      <div class="mdui-card-content">为什么</div>-->
    </div>

    <div id="content" class="mdui-m-t-2">
      <!--            <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">-->
      <div v-if="!hasLoaded">
        <div class="mdui-progress">
          <div class="mdui-progress-indeterminate"></div>
        </div>
      </div>
      <div v-else-if="hasLoaded">
        <PostsComponent v-if="posts.length > 0"
                        :posts="posts"
                        @refreshPosts="refreshPosts"
                        :user-profile="userProfile"
                        :logged-inuser-uid="loggedInuserUid"/>
        <div v-else-if="currentminblock && posts.length === 0">
          <h1>
            此处一片荒凉，快来发第一篇帖子~
          </h1>
          <button class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple mdui-color-theme-accent"
                  @click="$router.push('/post/add/')"
          >发帖
          </button>
        </div>
        <div v-else-if="!currentminblock">
          <h1>
            还没有板块，暂时不开放
          </h1>
        </div>
      </div>
      <Indicator v-show=" hasLoaded && posts.length>0" ref="indicator" @reqDataList="reqDataList"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import PostViewTag from '../PostView/PostViewTag'
import mdui from 'mdui'
import ClipboardJS from 'clipboard'
import Indicator from '../Indicator'
import PostsComponent from './PostsComponent'

const postsCurrentPageCode = 'key_current_page_code_in_postlist'
const postsReadingLocation = 'posts_readingLocation'
const postsSearchText = 'posts_searchText'
const postCurrentMinBlockUid = 'postCurrentMinBlockUid'

export default {
  name: 'PostList',
  components: {PostsComponent, PostViewTag, Indicator},
  data () {
    return {
      page: null,
      blockminName: null,
      baseUrl: '',
      hasLoaded: false,
      clipboard: null,
      loggedInuserUid: '',
      blockminuid: '',
      posts: [],
      searchInput: '',
      fruits: ['大西瓜皮', '香蕉皮', '臭鸡蛋']
    }
  },
  activated () {
    let c = sessionStorage.getItem(postCurrentMinBlockUid)
    this.blockminuid = c
    // this.refreshPosts()
  },
  methods: {
    loadPosts () {
      this.baseUrl = window.location.origin
      this.hasLoaded = false

      if (this.userProfile) {
        this.loggedInuserUid = this.userProfile.userUid
      }
      let currentBlockMinUid = sessionStorage.getItem(postCurrentMinBlockUid)
      this.blockminuid = currentBlockMinUid
      let currentPageCode
      try {
        currentPageCode = parseInt(sessionStorage.getItem(postsCurrentPageCode))
      } catch (err) {
        currentPageCode = 1
      }
      if (this.userProfile !== '') {
        this.loggedInuserUid = this.userProfile.userUid
      }
      this.reqPosts(currentPageCode, this.elementMaxSize)
    },
    /**
     * 提供给分页组件的方法
     * @param currentPageCode
     * @param elementMaxSize
     * @param success
     * @param error
     */
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(postCurrentMinBlockUid, this.blockminuid)
      sessionStorage.setItem(postsReadingLocation, pos)
      sessionStorage.setItem(postsSearchText, this.searchInput)
      sessionStorage.setItem(postsCurrentPageCode, this.$refs.indicator.currentPageCode)
      console.log(pos)
    },
    removeCurrentInfo () {
      sessionStorage.removeItem(postCurrentMinBlockUid)
      sessionStorage.removeItem(postsReadingLocation)
      sessionStorage.removeItem(postsSearchText)
      sessionStorage.removeItem(postsCurrentPageCode)
    },
    refreshPosts () {
      let currentBlockMinUid = sessionStorage.getItem(postCurrentMinBlockUid)
      this.blockminuid = currentBlockMinUid
      let currentPageCode
      try {
        currentPageCode = parseInt(sessionStorage.getItem(postsCurrentPageCode))
      } catch (err) {
        currentPageCode = 1
      }
      this.$refs.indicator.currentPageCode = currentPageCode
      if (this.userProfile !== '') {
        this.loggedInuserUid = this.userProfile.userUid
      }
      this.reqPosts(currentPageCode, this.elementMaxSize)
    },
    reqPosts (currentPageCode, elementMaxSize) {
      if (!currentPageCode) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      } else {
        try {
          currentPageCode = parseInt(currentPageCode)
        } catch (e) {
          currentPageCode = 1
        }
      }
      this.hasLoaded = false
      sessionStorage.setItem(postsCurrentPageCode, currentPageCode)
      let blockminuid = sessionStorage.getItem(postCurrentMinBlockUid)
      if (blockminuid !== null) {
        if (currentPageCode === null) {
          currentPageCode = 1
        } else if (currentPageCode < 1) {
          currentPageCode = 1
        }
        this.$store.dispatch('getPostsByMinBlockUid', {
          currentblockuid: blockminuid,
          pagecode: currentPageCode,
          pagesize: elementMaxSize
        })
      }
    }
  },
  mounted () {
    /**
     * 首次加载周期：
     *  watch -> currentminblock = null
     *  Indicator.mounted
     *  PostList.mounted
     *  watch -> currentminblock = 有数据了
     *    请求帖子
     *  watch -> currentposts 有数据了
     *    初始化Indicator
     */

    /**
     * 从其它页面返回
     * watch -> currentminblock 有数据
     * 加载数据
     */

    this.loadPosts()
  },
  beforeDestroy () {
    this.clipboard && this.clipboard.destroy()
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
    },
    'currentpostsbyblockmin': {
      deep: false,
      immediate: true,
      handler (val) {
        if (!val.content) {
          return
        }
        this.page = val
        let page = val
        const self = this
        this.posts = page.content
        this.blockminuid = page.currentBlockMinUid
        sessionStorage.setItem(postCurrentMinBlockUid, page.currentBlockMinUid)
        this.$nextTick(() => {
          this.hasLoaded = true
          let pc = sessionStorage.getItem(postsCurrentPageCode)
          try {
            pc = parseInt(pc)
          } catch (e) {
            pc = 1
          }
          this.$refs.indicator.currentPageCode = pc
          this.$refs.indicator.initIndicator(page)

          let pos = sessionStorage.getItem(postsReadingLocation)
          console.log('scrollto', pos)
          if (pos !== null) {
            window.scrollTo(0, pos)
          }
          if (self.clipboard == null) {
            self.clipboard = new ClipboardJS('.share-link')
            self.clipboard.on('success', function (e) {
              mdui.snackbar({
                message: '已经复制帖子链接 ' + e.text + '，快去分享吧',
                position: 'top'
              })
              console.info('Action:', e.action)
              console.info('Text:', e.text)
              console.info('Trigger:', e.trigger)
              e.clearSelection()
            })

            self.clipboard.on('error', function (e) {
              console.error('Action:', e.action)
              console.error('Trigger:', e.trigger)
            })
          }
        })
      }
    },
    'currentminblock': {
      deep: false,
      handler (val) {
        // 处理空帖子的情况
        if (!val || !val.blockMinUid) {
          this.blockminuid = ''
          this.posts = []
          this.indicatorsIndex = []
        } else {
          this.blockminName = val.blockMinName
          this.blockminuid = val.blockMinUid
          sessionStorage.setItem(postCurrentMinBlockUid, this.blockminuid)
          // 帖子板块变化，则需要重置下标
          sessionStorage.setItem(postsCurrentPageCode, '1')
          this.reqPosts(1, this.elementMaxSize)
        }
      },
      immediate: false
    }
  },
  computed: {
    ...mapState(['currentminblock', 'currentpostsbyblockmin', 'userProfile'])
  },
  created () {
    this.myglobalfun.addBodyComponentClass()
    // 请求帖子
    // this.$store.dispatch('getPostsByMinBlockUid', {})
  }
}
</script>

<style scoped>
#indicatorposts {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}


</style>
