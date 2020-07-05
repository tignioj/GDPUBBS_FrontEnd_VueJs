<template>
  <div class="mdui-container">

    <!--        分类-->

    <div id="categoryDiv">
      <div id="categoryBB">
        <select @change="bigSelectionChange" class="mdui-select" id="blockBigSelect">
          <option :value="category.bBlockUid"
                  v-for="(category, index)  in this.categories" :key="index"
          >{{category.bBlockName}}
          </option>
        </select>
      </div>

      <div v-if="blockMinOptionsArr.length >0" id="categoryBM">
        <select @change="minSelectionChange" class="mdui-select" id="blockMinSelect"
        >
          <option :value="blockMin.blockMinUid"
                  v-for="(blockMin, index)  in this.blockMinOptionsArr" :key="index"
          >{{blockMin.blockMinName}}
          </option>
        </select>
      </div>

    </div>


    <div class="mdui-textfield">
      <i class="mdui-icon material-icons">search</i>
      <input v-model="searchInput" class="mdui-textfield-input" type="email" placeholder="Search"/>
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

      <ul id="pageIndicator">
        <li><a @click="switchPage(1)">首页</a></li>
        <li v-show="isShowPrevious"><a @click="switchPage( currentPageCode-1)">&lt;</a></li>
        <li
          :class="{'mdui-color-theme': p === currentPageCode}"
          v-for="(p, index)  in indexs" :key="index"
        ><a @click="switchPage(p)">{{p}}</a></li>
        <li v-show="isShowNext"><a @click="switchPage( currentPageCode+1)">&gt;</a></li>
        <li><a @click="switchPage(totalPageSize)">尾页</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getPostsBySearch} from '../../api'
  import {mapState} from 'vuex'
  // import mdui from 'mdui'
  import {mutation, Select} from 'mdui/dist/js/mdui'

  export default {
    name: 'Categories',
    computed: {
      ...mapState(['indexcategory'])
    },
    created () {
      /* 创建之后，马上请求主页帖子分类信息和帖子信息 */
      // 请求大板块
      this.$store.dispatch('getindexblocksbigs')
      // this.$store.dispatch('getindexposts')
    },
    watch: {
      'indexcategory': {
        deep: true,
        handler (val) {
          this.initCategory(val)
        }
      }
    },
    mounted () {
      this.myglobalfun.cleanTopTabCard()
      this.initCategory(this.indexcategory)
    },
    data () {
      return {
        searchInput: '',
        blockMinUid: '',
        blockBigUid: '',
        categories: [],
        blockMinOptionsArr: [],
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
        isShowNext: false,

        // mdui对象，可以不用管
        bm: null,
        bb: null
        // mdui对象结束
      }
    },
    methods: {
      initCategory (categories) {
        if (categories.length === 0) {
          return
        }
        this.categories = categories
        const self = this
        if (self.bb == null) {
          this.$nextTick(() => {
            let bbELe = document.getElementById('blockBigSelect')
            self.bb = new Select(bbELe)
          })
          mutation()
        }
        console.log(categories)
      },
      bigSelectionChange (e) {
        const self = this
        console.log(e)
        let ele = document.getElementById('blockBigSelect')
        let options = ele.options
        let selectedIndex = options.selectedIndex
        let value = options[selectedIndex].value
        this.blockBigUid = value

        for (let i = 0; i < this.indexcategory.length; i++) {
          if (this.indexcategory[i].bBlockUid === value) {
            this.blockMinOptionsArr = this.indexcategory[i].bBlockMblocks
            break
          }
        }

        console.log(this.blockMinOptionsArr)
        if (this.blockMinOptionsArr.length > 0) {
          if (self.bm == null) {
            this.$nextTick(() => {
              let bmEle = document.getElementById('blockMinSelect')
              self.bm = new Select(bmEle)
            })
          } else {
            this.$nextTick(() => {
              self.bm.handleUpdate()
            })
          }
        } else {
          self.bm = null
        }
        mutation()
      },
      minSelectionChange (e) {
        let ele = document.getElementById('blockMinSelect')
        if (ele != null) {
          let options = ele.options
          let selectedIndex = options.selectedIndex
          let value = options[selectedIndex].value
          this.blockMinUid = value
        }
      },
      search () {
      },
      setPosts (page) {
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
        let currentPageCode = sessionStorage.getItem('currentPageCode')
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
      reqPosts () {
        let currentPageCode = sessionStorage.getItem('currentPageCode')
        let elementMaxSize = this.elementMaxSize
        if (currentPageCode === null) {
          currentPageCode = 1
        } else if (currentPageCode < 1) {
          currentPageCode = 1
        }
        getPostsBySearch(this.blockBigUid, this.blockMinUid, this.searchInput, currentPageCode, elementMaxSize).then((re) => {
          console.log(re)
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

  #categoryDiv {
    display: flex;
    justify-content: space-around;
  }
</style>
