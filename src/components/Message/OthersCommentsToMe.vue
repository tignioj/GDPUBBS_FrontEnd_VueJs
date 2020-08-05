<template>
  <div>
    <div v-show="hasLoaded">
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

      <!-- 回复 -->
      <div v-if="othersCommentsToMe.length >0" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">

        <div id="postComment" class="mdui-collapse" mdui-collapse>
          <div class="mdui-collapse-item  mdui-m-t-1" v-for="(comment, index) in othersCommentsToMe" :key="index"
               @click="(othersCommentsToMe && comment.post) ?goToPost(comment.post.postUid, comment.id):''"
          >
            <div class="mdui-collapse-item-header">
              <div class="mdui-card">
                <!-- 卡片头部，包含头像、标题、副标题 -->
                <!--用户-->
                <div class="mdui-card-header">
                  <!--评论者头像-->
                  <img class="mdui-card-header-avatar"
                       :src="myglobalfun.imgBaseUrl(comment.fromUser.userAvatar)"/>
                  <div class="mdui-card-header-title">
                    {{ comment.fromUser.userAccount }}
                    {{ comment.type === 'comment_reply' ? '回复了你的评论' : '回复帖子' }}:
                    <span class="mdui-float-right">
                      {{ comment.post ? comment.post.postTitle : '帖子已删除' }}
                    </span>
                  </div>
                  <!--评论日期-->
                  <div class="mdui-card-header-subtitle">{{ comment.replyDate | date-format }}</div>
                </div>
                <!--评论图片-->
                <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
                <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
                  <img :src="myglobalfun.imgBaseUrl(comment.imgUrl)"
                       v-if="comment.imgUrl"/>
                </div>

                <!--评论内容-->
                <!-- 卡片的内容 -->
                <div class="mdui-card-content">
                  <div v-if="comment.postComment">
                    原评论: {{ comment.postComment.postCommentFromuser.userAccount }}: {{ comment.summary }}
                    <div>
                      {{ comment.fromUser.userAccount }}:{{ comment.content }}
                    </div>
                  </div>
                  <div v-else>
                    原帖: {{ comment.fromUser.userAccount }}: {{ comment.summary }}
                    <div>
                      {{ comment.fromUser.userAccount }}:{{ comment.content }}
                    </div>
                  </div>
                </div>

                <!-- 卡片的按钮 -->
                <div class="mdui-card-actions">
                  <!--                  <button class="mdui-btn mdui-ripple">赞{{comment.postCommentGood}}</button>-->
                  <!--                  <button class="mdui-btn mdui-ripple">踩{{comment.postCommentBad}}</button>-->
                  <!--                <button class="mdui-btn mdui-ripple">编辑</button>-->
                  <!--                  <button @click.stop="deleteComment(comment.postCommentUid)" class="mdui-btn mdui-ripple">删除</button>-->
                  <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                    class="mdui-icon material-icons">expand_more</i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        没有评论哈
      </div>
      <div v-show="othersCommentsToMe.length > 0" class="mdui-m-t-2" id="indicatortome"></div>
    </div>
    <div v-if="!hasLoaded">
      <div class="mdui-progress">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {deleteOneCommentByUid, reqCommentsPageToMe} from '../../api'
import {mapState} from 'vuex'
import mdui from 'mdui'

const otherCommentsToMeLocation = 'other_comments_to_me_location'
const otherCommentsToMeSearchText = 'other_comments_to_me_search_text'
const otherCommentsToMePageCode = 'other_comments_to_me_pagecode'

export default {
  name: 'OthersCommentsToMe',
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
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      loggedInuserUid: null,
      othersCommentsToMe: [],
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
    async reqPosts (currentPageCode, elementMaxSize) {
      if (currentPageCode === null) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }
      // sessionStorage.setItem(keyCurrentSearchPageCode, this.currentPageCode)
      this.currentPageCode = currentPageCode
      console.log('currentPageCode:', currentPageCode)
      let re = await reqCommentsPageToMe(
        this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
        this.setResultPosts(re.data)
      } else {
        // this.$router.replace('/login')
      }
    },
    setResultPosts (page) {
      let posts = []
      let content = page.content
      content.forEach(post => {
        posts.push(post)
      })
      this.othersCommentsToMe = posts
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
      console.log(indicatorsIndex)

      let indicatorEle = document.getElementById('indicatortome')

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
    async confirmDelete (uid) {
      let re = await deleteOneCommentByUid(uid)
      console.log(re)
      if (re.code === 0) {
        console.log(re.data)
        mdui.snackbar({
          message: '删除成功'
        })
        this.reqComments()
      }
    },
    async reqComments () {
      // let re = await getCommentsToMe()
      // let re = await getCommentsToMe()

      let pc = sessionStorage.getItem(otherCommentsToMePageCode)
      this.currentPageCode = (pc === null) ? this.currentPageCode : parseInt(pc)
      let text = sessionStorage.getItem(otherCommentsToMeSearchText)
      this.searchInput = (text === null) ? '' : text

      await this.reqPosts(this.currentPageCode, this.elementMaxSize)
      this.hasLoaded = true
      this.$nextTick(() => {
        let pos = sessionStorage.getItem(otherCommentsToMeLocation)
        console.log('scrollto', pos)
        if (pos !== null) {
          window.scrollTo(0, pos)
        }
      })
    },
    goToPost (id, place) {
      this.$router.push('/post/view/' + id + '?position=' + place)
    },
    saveCurrentInfo () {
      let pos = window.pageYOffset
      sessionStorage.setItem(otherCommentsToMeLocation, pos)
      sessionStorage.setItem(otherCommentsToMeSearchText, this.searchInput)
      sessionStorage.setItem(otherCommentsToMePageCode, this.currentPageCode)
    },
    search () {
      sessionStorage.setItem(otherCommentsToMeSearchText, this.searchInput)
      sessionStorage.removeItem(otherCommentsToMeLocation)
      sessionStorage.removeItem(otherCommentsToMePageCode)
      this.currentPageCode = 1
      this.reqComments()
    }
  },

  mounted () {
    this.hasLoaded = false
    if (this.$parent.active === 1) {
      this.reqComments()
    }
  }
}
</script>

<style scoped>
.my-img {
  width: 50% !important;
}

.my-img-rounded img {
  border-radius: 10px;
}

@media screen and (min-width: 600px) {
  .my-img {
    width: 60%;
  }
}

@media screen and (min-width: 768px) {
  .my-img {
    width: 50%;
  }
}

#indicatortome {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
