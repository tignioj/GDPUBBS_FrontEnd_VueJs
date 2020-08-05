<template>

  <div class="mdui-container">

    <div id="content" class="mdui-m-t-2">
      <!--            <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">-->
      <div v-if="!hasLoaded">
        <div class="mdui-progress">
          <div class="mdui-progress-indeterminate"></div>
        </div>
      </div>
      <div v-else-if="hasLoaded">
        <div v-if="posts.length > 0" id="contentDoc" class="mdui-row-xs-1   mdui-grid-list ">
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
              <div class="mdui-card-media" style="max-height: 300px; overflow: hidden">
                <!--图片地址 -->
                <img v-if="post.postImg" :src="myglobalfun.imgBaseUrl(post.postImg)"/>
                <!-- 卡片中可以包含一个或多个菜单按钮 -->
                <!--        <div class="mdui-card-menu">-->
                <!--          <button class="mdui-btn mdui-btn-icon mdui-text-color-white"><i class="mdui-icon material-icons">share</i></button>-->
                <!--        </div>-->
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
                      :data-clipboard-text="getURL(post.postUid)">
                <i class="mdui-icon material-icons">share</i>
              </button>
            </div>
          </div>
          <!--如果没有帖子-->
        </div>
        <div v-else-if="posts.length === 0">
          <h1>
            此处一片荒凉，快来发第一篇帖子~
          </h1>
          <button class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple mdui-color-theme-accent"
                  @click="$router.push('/post/add/')"
          >发帖
          </button>
        </div>
        <div v-else-if="currentminblock === undefined">
          <h1>
            还没有板块，暂时不开放
          </h1>
        </div>
      </div>
      <div v-show=" hasLoaded && posts.length>0" id="indicatorposts">
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import PostViewTag from '../PostView/PostViewTag'
import mdui from 'mdui'
import ClipboardJS from 'clipboard'
import {postBan, deleteOnePost, addPostGood, addPostBad} from '../../api'

const postsCurrentPageCode = 'key_current_page_code_in_postlist'
const postsReadingLocation = 'posts_readingLocation'
const postsSearchText = 'posts_searchText'

export default {
  name: 'PostList',
  components: {PostViewTag},
  data () {
    return {
      hasLoaded: false,
      clipboard: null,
      loggedInuserUid: '',
      blockminuid: '',
      posts: [],
      indexs: [],
      searchInput: '',

      /* 是否显示分页 */
      isShowIndicator: false,

      indicatorsIndex: [],
      /* 当前第几页 */
      currentPageCode: 1,
      /* 一共多少页 */
      totalPageSize: 1,
      /* 一次请求最多显示多少条记录 */
      elementMaxSize: 5,
      /* 显示下标数量 */
      showIndicatorSize: 5,

      fruits: ['大西瓜皮', '香蕉皮', '臭鸡蛋'],

      /* 是否显示上一页 */
      isShowPrevious: false,

      /* 是否显示下一页 */
      isShowNext: false
    }
  },
  methods: {
    getURL (postUid) {
      return window.location.origin + '/#/post/view/' + postUid
    },
    // shareLink () {
    //   let clipBoardContent = window.location.href
    //   window.clipboardData.setData('Text', clipBoardContent)
    //   mdui.snackbar({
    //     message: '复制链接成功'
    //   })
    // },
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
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(postsReadingLocation, pos)
      sessionStorage.setItem(postsSearchText, this.searchInput)
      sessionStorage.setItem(postsCurrentPageCode, this.currentPageCode)
      console.log(pos)
    },
    removeCurrentInfo () {
      sessionStorage.removeItem(postsReadingLocation)
      sessionStorage.removeItem(postsSearchText)
      sessionStorage.removeItem(postsCurrentPageCode)
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
      let currentBlockMinUid = sessionStorage.getItem('currentBlockMinUid')
      this.blockminuid = currentBlockMinUid
      let currentPageCode = parseInt(sessionStorage.getItem(postsCurrentPageCode))
      if (typeof currentPageCode !== 'number') {
        currentPageCode = 1
      }
      this.currentPageCode = currentPageCode
      if (this.userProfile !== '') {
        this.loggedInuserUid = this.userProfile.userUid
      }
      this.reqPosts(currentPageCode, this.elementMaxSize)
    },
    parseIndicator (pageObj) {
      let totalPageSize = this.totalPageSize
      let currentPageCode = this.currentPageCode
      let showIndicatorSize = this.showIndicatorSize
      let indicatorsIndex = this.indicatorsIndex
      let getUserList = this.reqPosts
      let elementMaxSize = this.elementMaxSize

      totalPageSize = pageObj.totalPage
      let indexs = []
      // 显示5个下标
      let showMax = showIndicatorSize * (Math.floor((currentPageCode - 1) / showIndicatorSize) + 1)
      for (let i = showMax - showIndicatorSize + 1; i <= showMax; i++) {
        if (i > totalPageSize) {
          break
        }
        indexs.push(i)
      }
      indicatorsIndex = indexs

      let indicatorEle = document.getElementById('indicatorposts')
      indicatorEle.innerHTML = ''
      let buttonGroup = document.createElement('div')
      buttonGroup.classList.add('mdui-row')
      buttonGroup.classList.add('mdui-btn-group')

      let first = document.createElement('button')
      first.classList.add('mdui-btn')
      first.addEventListener('click', function () {
        getUserList(1, elementMaxSize)
      })
      first.appendChild(document.createTextNode('首页'))
      buttonGroup.appendChild(first)

      let previous = document.createElement('button')
      previous.classList.add('mdui-btn')
      if (currentPageCode === 1) {
        previous.setAttribute('disabled', true)
        first.setAttribute('disabled', true)
      }
      previous.addEventListener('click', function () {
        getUserList(currentPageCode - 1, elementMaxSize)
      })

      previous.appendChild(document.createTextNode('<'))
      buttonGroup.appendChild(previous)

      for (let i = 0; i < indicatorsIndex.length; i++) {
        let pageNum = indicatorsIndex[i]
        // let html = '<a href="./index.html?pc="' + pageNum + '&ps=' + elementMaxSize +
        let aEle = document.createElement('button')
        // aEle.classList.add('indicator-link')
        aEle.classList.add('mdui-btn')
        if (currentPageCode === pageNum) {
          aEle.classList.add('mdui-btn-active')
          // aEle.classList.add('mdui-color-pink')
        }
        // aEle.href = '/index.html?pc=' + pageNum + '&ps=' + elementMaxSize;
        // aEle.href = '/index.html?pc=' + pageNum + '&ps=' + elementMaxSize;
        aEle.addEventListener('click', function () {
          getUserList(pageNum, elementMaxSize)
        })
        aEle.appendChild(document.createTextNode(pageNum))
        buttonGroup.appendChild(aEle)
      }

      let next = document.createElement('button')
      next.classList.add('mdui-btn')
      next.addEventListener('click', function () {
        getUserList(currentPageCode + 1, elementMaxSize)
      })
      next.appendChild(document.createTextNode('>'))
      buttonGroup.appendChild(next)

      let last = document.createElement('button')
      last.classList.add('mdui-btn')
      last.addEventListener('click', function () {
        getUserList(pageObj.totalPage, elementMaxSize)
      })
      last.appendChild(document.createTextNode('尾页'))
      if (currentPageCode === totalPageSize) {
        next.setAttribute('disabled', true)
        last.setAttribute('disabled', true)
      }
      buttonGroup.appendChild(last)

      indicatorEle.appendChild(buttonGroup)
    },
    setPosts (page) {
      sessionStorage.setItem('currentBlockMinUid', page.currentBlockMinUid)
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
      // let currentPageCode = parseInt(localStorage.getItem(keyCurrentPageCode))
      // if (typeof currentPageCode !== "number") {
      //   currentPageCode = 1
      // }
      // this.currentPageCode = currentPageCode

      // 2）一共多少页 totalPageSize
      this.totalPageSize = tp

      // 3） 数据库中一共多少条记录 totalElements
      this.totalElements = te

      this.parseIndicator(page)
    },
    reqPosts (currentPageCode, elementMaxSize) {
      this.hasLoaded = false
      sessionStorage.setItem(postsCurrentPageCode, currentPageCode)
      let blockMinUid = this.blockminuid
      if (blockMinUid !== null) {
        if (currentPageCode === null) {
          currentPageCode = 1
        } else if (currentPageCode < 1) {
          currentPageCode = 1
        }
        this.currentPageCode = currentPageCode
        this.$store.dispatch('getPostsByMinBlockUid', {
          currentblockuid: blockMinUid,
          pagecode: currentPageCode,
          pagesize: elementMaxSize
        })
      }
    }
  },
  mounted () {
    this.hasLoaded = false
    if (this.userProfile) {
      this.loggedInuserUid = this.userProfile.userUid
    }
    // this.refreshPosts()
  },
  watch: {
    'userProfile': {
      deep: true,
      handler (val) {
        if (val !== '') {
          console.log(val)
          this.loggedInuserUid = val.userUid
        }
      }
    },
    'currentpostsbyblockmin': {
      deep: false,
      immediate: false,
      handler (val) {
        const self = this
        this.setPosts(val)
        this.hasLoaded = true
        this.$nextTick(() => {
          let pos = sessionStorage.getItem(postsReadingLocation)
          console.log('scrollto', pos)
          if (pos !== null) {
            window.scrollTo(0, pos)
          }
          if (self.clipboard == null) {
            self.clipboard = new ClipboardJS('.share-link')
            self.clipboard.on('success', function (e) {
              mdui.snackbar({
                message: '已经复制帖子链接 ' + e.text + '，快去分享吧'
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
        if (!val.blockMinUid) {
          return
        }
        // 处理空帖子的情况
        if (val === undefined || val === null) {
          this.blockminuid = ''
          this.posts = []
          this.indicatorsIndex = []
        } else {
          this.blockminuid = val.blockMinUid
          this.reqPosts(1, this.elementMaxSize)
        }
        // 帖子板块变化，则需要重置下标
        sessionStorage.setItem(postsCurrentPageCode, '1')
      },
      immediate: true
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
