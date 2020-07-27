<template>

  <div class="mdui-container">

    <div id="content">
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
              <div class="mdui-card-header-subtitle">{{post.postDate | date-format}}
                <span>{{post.postPrivilege.postPrivilegeDesc}}</span>
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
            <!--            <button class="mdui-btn mdui-ripple">点赞:{{post.postGood}}</button>-->
            <button
              v-if="post.postUser.userUid ===  loggedInuserUid"
              @click="$router.push(globaRouterURL.POST_EDIT + '/' + post.postUid)" class="mdui-btn mdui-ripple">编辑
            </button>
            <button
              v-if="(post.postUser.userUid ===  loggedInuserUid) || (userProfile && userProfile.userPri.userPrivilegeId === 2)"
              @click="deletePost(post.postTitle, post.postUid)" class="mdui-btn mdui-ripple">删除
            </button>
            <!--            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>-->
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>

            </button>
          </div>
        </div>
        <!--如果没有帖子-->
      </div>

      <div v-if="currentminblock === undefined">
        <h1>
          还没有板块，暂时不开放
        </h1>
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

      <div v-show="posts.length>0" id="indicator">
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import PostViewTag from '../PostView/PostViewTag'
  import {dialog} from 'mdui'
  import {deleteOnePost} from '../../api'

  const keyCurrentPageCode = 'key_current_page_code_in_postlist'
  export default {
    name: 'PostList',
    components: {PostViewTag},

    data () {
      return {
        loggedInuserUid: '',
        blockminuid: '',
        posts: [],
        indexs: [],

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

        /* 是否显示上一页 */
        isShowPrevious: false,

        /* 是否显示下一页 */
        isShowNext: false
      }
    },
    methods: {
      deletePost (postTitle, postUid) {
        const self = this
        dialog({
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
      refreshPosts () {
        let currentBlockMinUid = localStorage.getItem('currentBlockMinUid')
        this.blockminuid = currentBlockMinUid
        let currentPageCode = parseInt(localStorage.getItem(keyCurrentPageCode))
        if (typeof currentPageCode !== 'number') {
          currentPageCode = 1
        }
        this.currentPageCode = currentPageCode
        if (this.userProfile !== '') {
          this.loggedInuserUid = this.userProfile.userUid
        }
        console.log(this.loggedInuserUid)
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

        let indicatorEle = document.getElementById('indicator')
        indicatorEle.innerHTML = ''
        let buttonGroup = document.createElement('div')
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
        localStorage.setItem(keyCurrentPageCode, currentPageCode)
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
      this.refreshPosts()
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
        deep: true,
        handler (val) {
          this.setPosts(val)
        }
      },
      'currentminblock': {
        deep: true,
        handler (val) {
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
          localStorage.setItem(keyCurrentPageCode, '1')
        }
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
  #indicator {
    display: flex;
    border: 1px solid black;
    justify-content: center;
    margin: 0 auto 50px auto;
  }
</style>
