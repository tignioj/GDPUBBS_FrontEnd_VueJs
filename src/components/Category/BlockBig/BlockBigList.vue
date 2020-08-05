<template>
  <div class="mdui-container">
    <div v-show="hasLoaded">
      <div id="content">
        <div v-if="blockbigs.length > 0" id="contentDoc"
             class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
          <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 "
               v-for="(blockbig, index)  in blockbigs" :key="index"
          >
            <!--          <a :href="'/document/browse.html?postUid=' + block.postUid" class="docLink" style="display:none;"></a>-->
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <router-link tag="div" :to="'/userinfoother/' + blockbig.bBlockUser.userAccount">
              <div class="mdui-card-header">
                <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(blockbig.bBlockUser.userAvatar)"/>
                <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
                <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
                <div class="mdui-card-header-title">{{ blockbig.bBlockUser.userAccount }}</div>
                <div class="mdui-card-header-subtitle">{{ blockbig.bBlockCreatedTime | date-format }}</div>
              </div>
            </router-link>

            <router-link :to="globaRouterURL.BLOCKBIG_DETAIL + '/' + blockbig.bBlockUid" tag="div">
              <!-- 卡片的标题和副标题 -->
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">{{ blockbig.bBlockName }}</div>
              </div>

              <!-- 卡片的内容 -->
              <div class="mdui-card-content">{{ blockbig.bBlockDesc }}</div>
            </router-link>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">
              <button
                v-if="(blockbig.bBlockUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 4))"
                @click="$router.push(globaRouterURL.BLOCKBIG_UPDATE + '/' + blockbig.bBlockUid)"
                class="mdui-btn mdui-ripple">编辑
              </button>
              <button
                v-if="(blockbig.bBlockUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 4))"
                @click="deleteBlockBig(blockbig.bBlockName, blockbig.bBlockUid)" class="mdui-btn mdui-ripple">删除
              </button>
              <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                class="mdui-icon material-icons">expand_more</i>
              </button>
            </div>
          </div>
          <!--如果没有帖子-->
          <div v-if="!blockbigs.length">暂时没有帖子哈~</div>
        </div>

        <div id="indicatorblockbig">
        </div>
      </div>
      <button
        v-if="userProfile && userProfile.userPri.userPrivilegeId >= 4"
        class="mdui-fab mdui-color-theme-accent mdui-ripple mdui-fab-fixed mdui-m-b-4"
        @click="$router.push(globaRouterURL.BLOCKBIG_ADD)"
      ><i class="mdui-icon material-icons">add</i></button>

    </div>
    <div v-show="!hasLoaded" class="mdui-m-t-2">
      <div class="mdui-progress ">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {blockBigList, delBlockBig} from '../../../api'
import {mapState} from 'vuex'
import mdui from 'mdui'

export default {
  name: 'BlockBigList',
  mounted () {
    this.loadBlockBigs()
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
  data () {
    return {
      hasLoaded: false,
      loggedInuserPri: 1,
      searchInput: '',
      loggedInuserUid: null,
      blockbigs: [],
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
    deleteBlockBig (name, uid) {
      const self = this
      mdui.dialog({
        title: '确认删除"' + name + '"吗?',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmDelete(uid)
            }
          }
        ]
      })
    },
    async confirmDelete (blockBigUid) {
      let post = await delBlockBig(blockBigUid)
      if (post.code === 0) {
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
      }
    },
    loadBlockBigs () {
      this.hasLoaded = false
      // this.searchInput = this.$route.query.searchInput
      this.reqPosts(this.currentPageCode, this.elementMaxSize)
    },
    setResultPosts (page) {
      let list = []
      let content = page.content
      content.forEach(post => {
        list.push(post)
      })
      this.blockbigs = list
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

      let re = await blockBigList(this.searchInput, currentPageCode, elementMaxSize)
      this.hasLoaded = true
      console.log(re)
      if (re.code === 0) {
        console.log(re.code)
        this.setResultPosts(re.data)
      } else {
        // this.$router.replace('/login')
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

      let indicatorEle = document.getElementById('indicatorblockbig')
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
    }
  }
}
</script>

<style scoped>
#indicatorblockbig {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
