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

            <button class="mdui-btn mdui-ripple">评论数量:{{post.postComments}}</button>
            <!--            <button class="mdui-btn mdui-ripple">评论:{{post.postComments}}</button>-->
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
            </button>
          </div>
        </div>

        <!--如果没有帖子-->
        <div v-if="myposts.length === 0">暂时没有帖子哈~</div>
      </div>
      <div v-show="myposts.length >0" class="mdui-m-t-2" id="indicator">
      </div>
    </div>

  </div>
</template>

<script>
  import {reqMyPostsPage, deleteOnePost} from '../../api'
  import {dialog} from 'mdui'
  import PostViewTag from '../../components/PostView/PostViewTag'
  import {mapState} from 'vuex'

  const myPostsLocation = 'myposts_location'
  const myPostsSearchText = 'myposts_search_text'
  const myPostsPageCode = 'myposts_pagecode'

  export default {
    name: 'MyPosts',
    components: {PostViewTag},
    data () {
      return {
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
      search () {
        sessionStorage.setItem(myPostsSearchText, this.searchInput)
        sessionStorage.removeItem(myPostsLocation)
        sessionStorage.removeItem(myPostsPageCode)
        this.currentPageCode = 1
        this.loadMyPosts()
      },
      async loadMyPosts () {
        let pc = sessionStorage.getItem(myPostsPageCode)
        this.currentPageCode = (pc === null) ? this.currentPageCode : parseInt(pc)
        let text = sessionStorage.getItem(myPostsSearchText)
        this.searchInput = (text === null) ? '' : text

        await this.reqPosts(this.currentPageCode, this.elementMaxSize)
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
          this.reqPosts()
        }
      },
      /**
       * 分页
       * @param pageObj
       */
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
        console.log(showMax)
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
      setResultPosts (page) {
        let posts = []
        let content = page.content
        content.forEach(post => {
          posts.push(post)
        })
        this.myposts = posts
        // this.blockminuid = page.currentBlockMinUid

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
        // let currentPageCode = sessionStorage.getItem('currentPageCode')
        // if (currentPageCode === null) {
        //   currentPageCode = 1
        // }
        // this.currentPageCode = parseInt(currentPageCode)

        // 2）一共多少页 totalPageSize
        this.totalPageSize = tp

        // 3） 数据库中一共多少条记录 totalElements
        this.totalElements = te

        /**
         * 如何显示下标？
         * 1. 显示数量 showIndicatorSize
         * @type {number}
         */
        this.isShowNext = this.currentPageCode < tp
        this.isShowPrevious = this.currentPageCode > 1

        this.parseIndicator(page)
      },
      async reqPosts (currentPageCode, elementMaxSize) {
        if (currentPageCode === null) {
          currentPageCode = 1
        } else if (currentPageCode < 1) {
          currentPageCode = 1
        }
        // sessionStorage.setItem(keyCurrentSearchPageCode, this.currentPageCode)
        this.currentPageCode = currentPageCode
        console.log('currentPageCode:', currentPageCode)

        let re = await reqMyPostsPage(this.searchInput, currentPageCode, elementMaxSize)
        console.log(re)
        if (re.code === 0) {
          console.log(re.code)
          this.setResultPosts(re.data)
        } else {
          this.$router.replace('/login')
        }

        // this.$store.dispatch('getPostsByMinBlockUid', {
        //   currentblockuid: blockMinUid,
        //   pagecode: currentPageCode,
        //   pagesize: elementMaxSize
        // })
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
