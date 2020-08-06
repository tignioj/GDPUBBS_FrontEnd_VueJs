<template>
  <div class="mdui-m-t-2">
    <div v-show="hasLoaded" id="content" class="mdui-container">
      <div>
        <div> 大板块:{{ this.blockBigUid == '' ? '所有大板块' : this.blockBigUid }}</div>
        <div> 小板块:{{ this.blockMinUid == '' ? '所有小板块' : this.blockMinUid }}</div>
        <div> 输入内容:{{ this.searchInput }}</div>
      </div>
      <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1  mdui-grid-list ">
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
              <div class="mdui-card-header-title">{{ post.postUser.userAccount }}
                <span>{{ post.postPrivilege.postPrivilegeDesc }}</span>
              </div>

              <div class="mdui-card-header-subtitle">{{ post.postDate | date-format }}</div>
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
              <div class="mdui-card-primary-title">{{ post.postTitle }}</div>
              <div v-if="post.postTag && post.postTag.length > 0" class="mdui-card-primary-subtitle">
                <PostViewTag :tags="post.postTag" v-if="post.postTag.length"/>
              </div>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{ post.postContent }}</div>

          </router-link>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <button class="mdui-btn mdui-ripple">点赞:{{ post.postGood }}</button>
            <button class="mdui-btn mdui-ripple">踩:{{ post.postBad }}</button>
            <button class="mdui-btn mdui-ripple">评论:{{ post.postComments }}</button>
            <button
              v-if="post.postUser.userUid ===  loggedInuserUid"
              @click="$router.push(globaRouterURL.POST_EDIT + '/' + post.postUid)" class="mdui-btn mdui-ripple">编辑
            </button>
            <button
              v-if="(post.postUser.userUid ===  loggedInuserUid) || (userProfile && userProfile.userPri.userPrivilegeId === 2)"
              @click="deletePost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">删除
            </button>

            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
            </button>
          </div>
        </div>

        <!--如果没有帖子-->
        <div v-if="!posts.length">暂时没有帖子哈~</div>
      </div>
<!--      <div id="indicatorresult">-->
<!--      </div>-->
      <Indicator ref="indicator" @reqDataList="reqDataList" />
    </div>
    <div v-show="!hasLoaded">
      <div class="mdui-progress">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {getPostsBySearch} from '../../api'
import PostViewTag from '../PostView/PostViewTag'
import {mapState} from 'vuex'
import Indicator from '../Indicator'
import mdui from 'mdui'

const currentSearchPosition = 'current_searchresult_position'
const currentSearchText = 'current_searchresult_text'
const currentSearchCurrentPageCode = 'current_searchresult_pageCode'

export default {
  name: 'SearchResult',
  components: {Indicator, PostViewTag},
  data () {
    return {
      hasLoaded: false,
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      loggedInuserUid: null,
      posts: []
    }
  },
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
  mounted () {
    this.searchInput = this.$route.query.searchInput
    this.blockMinUid = this.$route.query.blockMinUid
    this.blockBigUid = this.$route.query.blockBigUid
    this.hasLoaded = false
    const self = this
    let s = sessionStorage.getItem(currentSearchText)
    let pc = sessionStorage.getItem(currentSearchCurrentPageCode)
    if (s !== null) {
      this.searchInput = s
    }
    let pageCode
    if (pc != null) {
      try {
        pageCode = parseInt(pc)
      } catch (e) {
        pageCode = 1
      }
      this.$refs.indicator.currentPageCode = pageCode
    }
    this.reqPosts(pageCode, this.$refs.indicator.elementMaxSize).then(re => {
      self.hasLoaded = true
      let p = sessionStorage.getItem(currentSearchPosition)

      if (p !== null) {
        self.$nextTick(() => {
          window.scrollTo(0, p)
        })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf(this.globaRouterURL.PROFILE_OTHER) === 0 || to.path.indexOf(this.globaRouterURL.POST_VIEW) === 0) {
      this.saveCurrentInfo()
    } else {
      this.removeCurrentInfo()
    }
    next()
  },
  methods: {
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(currentSearchPosition, pos)
      sessionStorage.setItem(currentSearchText, this.searchInput)
      sessionStorage.setItem(currentSearchCurrentPageCode, this.$refs.indicator.currentPageCode)
    },
    removeCurrentInfo () {
      sessionStorage.removeItem(currentSearchPosition)
      sessionStorage.removeItem(currentSearchText)
      sessionStorage.removeItem(currentSearchCurrentPageCode)
    },
    async reqPosts (currentPageCode, elementMaxSize) {
      if (currentPageCode === null) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }

      let re = await getPostsBySearch(this.blockBigUid, this.blockMinUid, this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
        console.log(re.code)
        this.$refs.indicator.initIndicator(re.data)
        this.posts = re.data.content
      } else {
        // this.$router.replace('/login')
        mdui.snackbar({
          message: '服务器错误'
        })
      }
    }
  }
}
</script>

<style scoped>
#indicatorresult {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
