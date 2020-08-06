<template>
  <div id="myposts">
    <div v-show="hasLoaded" id="content" class="mdui-container">
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

      <div id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-1 mdui-row-xl-1  mdui-grid-list ">
        <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 " v-for="(post, index) in myposts"
             :key="index">
          <a :href="'/document/browse.html?postUid=' + post.postUid" class="docLink" style="display:none;"></a>
          <!-- 卡片头部，包含头像、标题、副标题 -->
          <router-link tag="div" :to="'/userinfoother/' + post.postUser.userAccount">
            <div class="mdui-card-header">
              <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(post.postUser.userAvatar)"/>
              <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
              <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
              <div class="mdui-card-header-title">{{ post.postUser.userAccount }}</div>
              <div class="mdui-card-header-subtitle">{{ post.postDate | date-format }}</div>
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
              <div class="mdui-card-primary-title">{{ post.postTitle }}</div>
              <div class="mdui-card-primary-subtitle">
                <PostViewTag :tags="post.postTag" v-if="post.postTag.length"/>
              </div>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{ post.postContent }}</div>

          </router-link>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <!--            <button class="mdui-btn mdui-ripple">点赞:{{post.postGood}}</button>-->
            <button @click="$router.push(globaRouterURL.POST_EDIT + '/' + post.postUid)" class="mdui-btn mdui-ripple">编辑
            </button>
            <button @click="deletePost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">删除</button>

            <button class="mdui-btn mdui-ripple">评论数量:{{ post.postComments }}</button>
            <!--            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>-->
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
            </button>
          </div>
        </div>

        <!--如果没有帖子-->
        <div v-if="myposts.length === 0">暂时没有帖子哈~</div>
      </div>
<!--      <div v-show="myposts.length >0" class="mdui-m-t-2" id="indicator">-->
<!--      </div>-->
      <Indicator  v-show="myposts.length >0" ref="indicator" @reqDataList="reqDataList"/>

    </div>
    <div v-show="!hasLoaded">
      <div class="mdui-progress">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>

  </div>
</template>

<script>
import mdui from 'mdui'
import {reqMyPostsPage, deleteOnePost} from '../../api'
import PostViewTag from '../../components/PostView/PostViewTag'
import {mapState} from 'vuex'
import Indicator from '../../components/Indicator'

const myPostsLocation = 'myposts_location'
const myPostsSearchText = 'myposts_search_text'
const myPostsPageCode = 'myposts_pagecode'

export default {
  name: 'MyPosts',
  components: {Indicator, PostViewTag},
  data () {
    return {
      hasLoaded: false,
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      loggedInuserUid: null,
      myposts: [],
      indicatorsIndex: [],
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
    this.loadMyPosts()
  },
  methods: {
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    search () {
      sessionStorage.setItem(myPostsSearchText, this.searchInput)
      sessionStorage.removeItem(myPostsLocation)
      sessionStorage.removeItem(myPostsPageCode)
      this.$refs.indicator.currentPageCode = 1
      this.loadMyPosts()
    },
    async loadMyPosts () {
      this.hasLoaded = false
      let pc = sessionStorage.getItem(myPostsPageCode)
      let currentPageCode = (pc === null) ? 1 : parseInt(pc)
      let text = sessionStorage.getItem(myPostsSearchText)
      this.searchInput = (text === null) ? '' : text
      await this.reqPosts(currentPageCode, this.$refs.indicator.elementMaxSize)
      this.hasLoaded = true
      this.$nextTick(() => {
        let pos = sessionStorage.getItem(myPostsLocation)
        console.log('scrollto', pos)
        if (pos !== null) {
          window.scrollTo(0, pos)
        }
      })
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(myPostsLocation, pos)
      sessionStorage.setItem(myPostsSearchText, this.searchInput)
      sessionStorage.setItem(myPostsPageCode, this.currentPageCode)
    },
    deletePost (postTitle, postUid) {
      const self = this
      mdui.dialog({
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
        this.reqPosts()
      }
    },
    async reqPosts (currentPageCode, elementMaxSize) {
      if (!currentPageCode) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }
      sessionStorage.setItem(myPostsPageCode, currentPageCode)
      let re = await reqMyPostsPage(this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
        this.$refs.indicator.currentPageCode = currentPageCode
        this.$refs.indicator.initIndicator(re.data)
        this.myposts = re.data.content
      } else {
        mdui.snackbar({
          message: '服务器错误'
        })
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.saveCurrentInfo()
    next()
  }
}
</script>

<style scoped>
#indicator {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}

</style>
