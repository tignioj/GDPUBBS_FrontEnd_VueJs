<template>
  <div>
    Search Result
    <div>
      <div> big:{{this.$route.query.blockBigUid}}</div>
      <div> min:{{this.$route.query.blockMinUid}}</div>
      <div> in:{{this.$route.query.searchInput}}</div>
    </div>

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

      <div id="indicator">

      </div>

      <!--      <ul id="pageIndicator">-->
      <!--        <li><a @click="switchPage(1)">首页</a></li>-->
      <!--        <li v-show="isShowPrevious"><a @click="switchPage( currentPageCode-1)">&lt;</a></li>-->
      <!--        <li-->
      <!--          :class="{'mdui-color-theme': p === currentPageCode}"-->
      <!--          v-for="(p, index)  in indicatorsIndex" :key="index"-->
      <!--        ><a @click="switchPage(p)">{{p}}</a></li>-->
      <!--        <li v-show="isShowNext"><a @click="switchPage( currentPageCode+1)">&gt;</a></li>-->
      <!--        <li><a @click="switchPage(totalPageSize)">尾页</a></li>-->
      <!--      </ul>-->
    </div>
  </div>
</template>
<script>
  import {getPostsBySearch} from '../../api'
  export default {
    name: 'SearchResult',
    data () {
      return {
        searchInput: '',
        blockMinUid: '',
        blockBigUid: '',

        posts: [],
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
    mounted () {
      this.searchInput = this.$route.query.searchInput
      this.blockMinUid = this.$route.query.blockMinUid
      this.blockBigUid = this.$route.query.blockBigUid
      this.reqPosts(this.currentPageCode, this.elementMaxSize)
    },
    methods: {
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
        let buttonGroup = document.createElement("div")
        buttonGroup.classList.add("mdui-btn-group")

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
        this.posts = posts
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
      reqPosts (currentPageCode, elementMaxSize) {
        if (currentPageCode === null) {
          currentPageCode = 1
        } else if (currentPageCode < 1) {
          currentPageCode = 1
        }
        // sessionStorage.setItem(keyCurrentSearchPageCode, this.currentPageCode)
        this.currentPageCode = currentPageCode
        console.log('currentPageCode:', currentPageCode)

        getPostsBySearch(this.blockBigUid, this.blockMinUid, this.searchInput, currentPageCode, elementMaxSize)
          .then((re) => {
            this.setResultPosts(re)
          }).catch((e) => {
        })

        // this.$store.dispatch('getPostsByMinBlockUid', {
        //   currentblockuid: blockMinUid,
        //   pagecode: currentPageCode,
        //   pagesize: elementMaxSize
        // })
      }
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
