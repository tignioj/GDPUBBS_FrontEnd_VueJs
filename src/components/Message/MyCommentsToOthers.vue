<template>
  <div>
    <!-- 回复 -->
    <div v-if="myCommentsToOthers.length >0" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">
      <div id="postComment" class="mdui-collapse" mdui-collapse>
        <div class="mdui-collapse-item  mdui-m-t-1" v-for="(comment, index) in myCommentsToOthers" :key="index"
             @click="(myCommentsToOthers && comment.post)?goToPost(comment.post.postUid, comment.id):''"
        >
          <div class="mdui-collapse-item-header">
            <div class="mdui-card">
              <!-- 卡片头部，包含头像、标题、副标题 -->
              <!--用户-->
              <div class="mdui-card-header">
                <!--评论者头像-->
                <img class="mdui-card-header-avatar"
                     :src="myglobalfun.imgBaseUrl(comment.fromUser.userAvatar)"/>
                <div class="mdui-card-header-title"
                >
                  {{comment.fromUser.userAccount}}
                  回复帖子:
                  {{comment.post ? comment.post.postTitle: '帖子已删除'}}
                </div>
                <!--评论日期-->
                <div class="mdui-card-header-subtitle">{{comment.replyDate | date-format }}</div>
              </div>

              <!--评论图片-->
              <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
              <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
                <img :src="myglobalfun.imgBaseUrl(comment.imgUrl)"
                     v-if="comment.imgUrl"/>
              </div>

              <!--评论内容-->
              <!-- 卡片的内容 -->
              <div class="mdui-card-content">{{comment.content}}</div>

              <!-- 卡片的按钮 -->
              <div class="mdui-card-actions">
                <!--                <button class="mdui-btn mdui-ripple">赞{{comment.postCommentGood}}</button>-->
                <!--                <button class="mdui-btn mdui-ripple">踩{{comment.postCommentBad}}</button>-->
                <!--                <button class="mdui-btn mdui-ripple">编辑</button>-->
                <button @click.stop="deleteComment(comment.id, comment.type)" class="mdui-btn mdui-ripple">删除</button>
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
    <div v-show="myCommentsToOthers.length >0" class="mdui-m-t-2" id="indicator"></div>
  </div>
</template>
<script>

  import {deleteOneCommentByUid, delCommentReply, reqCommentsPageToOthers} from '../../api'
  import {dialog, snackbar} from 'mdui'

  const myCommentsToOtherLocation = 'my_comments_to_other_location'

  export default {
    name: 'MyCommentsToOthers',
    data () {
      return {
        searchInput: '',
        blockMinUid: '',
        blockBigUid: '',
        loggedInuserUid: null,
        myCommentsToOthers: [],
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
        let re = await reqCommentsPageToOthers(
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
        this.myCommentsToOthers = posts
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
      async reqComments () {
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
      },
      goToPost (id, place) {
        let pos = window.pageYOffset
        sessionStorage.setItem(myCommentsToOtherLocation, pos)
        console.log('pos:', pos)
        this.$router.push('/post/view/' + id + '?position=' + place)
      },
      async confirmDeletePostComment (uid) {
        let re = await deleteOneCommentByUid(uid)
        console.log(re)
        if (re.code === 0) {
          console.log(re.data)

          snackbar({
            message: '删除成功'
          })

          let pos = window.pageYOffset
          sessionStorage.setItem(myCommentsToOtherLocation, pos)

          this.reqPosts(this.currentPageCode, this.elementMaxSize)
        }
      },
      async confirmDeleteCommentsReply (uid) {
        let re = await delCommentReply(uid)
        console.log(re)
        if (re.code === 0) {
          console.log(re.data)

          snackbar({
            message: '删除成功'
          })

          let pos = window.pageYOffset
          sessionStorage.setItem(myCommentsToOtherLocation, pos)

          this.reqPosts(this.currentPageCode, this.elementMaxSize)
        }
      },
      deleteComment (uid, type) {
        const self = this
        dialog({
          title: '确认删除吗',
          buttons: [
            {
              text: '取消'
            },
            {
              text: '确认',
              onClick: function () {
                if (type === 'post_comment') {
                  self.confirmDeletePostComment(uid)
                } else if (type === 'comments_reply') {
                  self.confirmDeleteCommentsReply(uid)
                }
              }
            }
          ]
        })
      }
    },
    mounted () {
      this.reqComments()
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

  #indicator {
    display: flex;
    border: 1px solid black;
    justify-content: center;
    margin: 0 auto 50px auto;
  }
</style>
