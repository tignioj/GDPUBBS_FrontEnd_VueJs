<template>
  <!-- 回复 -->
  <div class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">


    <div id="postComment" class="mdui-collapse" mdui-collapse>
      <div @click="showReply(postComment.postCommentUid)" :id="'#' + postComment.postCommentPlace"
           class="mdui-collapse-item  mdui-m-t-1" v-for="(postComment, index) in comments" :key="index"
      >
        <!--        <a :href="'#' + 1" :name="'#' + postComment.postCommentPlace">#{{postComment.postCommentPlace}}</a>-->
        <div class="mdui-collapse-item-header"
             :class="postComment.postCommentPlace==$route.query.position ? 'active' : null"
        >
          <!--          <a :id="'#' + postComment.postCommentPlace" >#{{postComment.postCommentPlace}}</a>-->
          <div class="mdui-card">
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <!--用户-->
            <div class="mdui-card-header">
              <!--评论者头像-->
              <img class="mdui-card-header-avatar"
                   :src="myglobalfun.imgBaseUrl(postComment.postCommentFromuser.userAvatar)"/>
              <div class="mdui-card-header-title">{{postComment.postCommentFromuser.userAccount}}</div>
              <!--评论日期-->
              <div class="mdui-card-header-subtitle">{{postComment.postCommentDate | date-format }}</div>
            </div>
            <!--评论图片-->
            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
              <img :src="myglobalfun.imgBaseUrl(postComment.postCommentImg)" v-if="postComment.postCommentImg"/>
            </div>

            <!--评论内容-->
            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{postComment.postCommentContent}}</div>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">
              <button class="mdui-btn mdui-ripple">点赞{{postComment.postCommentGood}}</button>
              <button class="mdui-btn mdui-ripple">踩{{postComment.postCommentBad}}</button>
              <!--              <button class="mdui-btn mdui-ripple"-->
              <!--                      @click.stop="replyTo(-->
              <!--                        postComment.postCommentUid,-->
              <!--                        postComment.postCommentFromuser.userUid,-->
              <!--                        postComment.postCommentFromuser.userAccount)">-->
              <!--                评论{{postComment.postCommentReply.length}}-->
              <!--              </button>-->
              <button class="mdui-btn mdui-ripple">
                评论{{postComment.postCommentReply.length}}
              </button>
              <button
                v-if="postComment.postCommentFromuser.userUid ===  loggedInuserUid"
                @click.stop="deleteComment(postComment.postCommentUid)" class="mdui-btn mdui-btn-icon mdui-float-right">
                <i
                  class="mdui-icon material-icons">delete</i></button>
              <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                class="mdui-icon material-icons">expand_more</i></button>
            </div>
          </div>
        </div>

        <!--二级评论-->
        <!--        <PostViewCommentReply :replys="postComment.postCommentReply" :postComment="postComment"/>-->
        <PostViewCommentReply @changeReplycount="changeReplyCount" :ref="'commentReply' + postComment.postCommentUid"
                              :postComment="postComment"/>
      </div>

    </div>
    <div class="mdui-m-t-2" id="indicator">
    </div>
  </div>


</template>

<script>
  import {mapState} from 'vuex'
  import PostViewCommentReply from './PostViewCommentReply'
  import {dialog, snackbar} from 'mdui'
  import {deleteOneCommentByUid, reqCommentsPageByPostId} from '../../api'

  export default {
    components: {PostViewCommentReply},
    props: ['apostUid', 'commentPlace'],
    name: 'PostViewComments',
    computed: {
      ...mapState(['userProfile'])
    },
    data () {
      return {
        loggedInuserUid: '',
        id: '',
        // 搜索
        text: '',
        postUid: '',
        searchInput: '',
        comments: [],
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
      loadBlockMins () {
        // this.searchInput = this.$route.query.searchInput
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
      },
      changeReplyCount () {
        this.reqComments()
      },
      deleteBlockMin (name, uid) {
        const self = this
        dialog({
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
      // async confirmDelete (blockBigUid) {
      //   let post = await delBlockMin(blockBigUid)
      //   if (post.code === 0) {
      //     this.reqPosts(this.currentPageCode, this.elementMaxSize)
      //   }
      // },
      loadBlockBloMin () {
        // this.searchInput = this.$route.query.searchInput
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
      },
      setResultPosts (page) {
        let list = []
        let content = page.content
        content.forEach(post => {
          list.push(post)
        })
        this.comments = list

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
        let re = await reqCommentsPageByPostId(this.searchInput, this.postUid, currentPageCode, elementMaxSize)
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
      async confirmDelete (uid) {
        let re = await deleteOneCommentByUid(uid)
        console.log(re)
        if (re.code === 0) {
          console.log(re.data)
          snackbar({
            message: '删除成功'
          })
          this.reqComments()
        }
      },
      deleteComment (uid) {
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
                self.confirmDelete(uid)
              }
            }
          ]
        })
      },
      replyTo (postUid, userUid, userName) {
        let refname = 'commentReply' + postUid
        let ref = this.$refs[refname][0]
        ref.replyTo(postUid, userUid, userName)
      },
      showReply (postUid) {
        // this.$refs.commentReply.getCommentReplies()
        // this.$refs['commentReply'].getCommentReplies()
        let refname = 'commentReply' + postUid
        let ref = this.$refs[refname][0]
        ref.showReply()
      },
      reqComments (callback) {
        console.log('评论请求中...')
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
        callback && callback()
      },
      commentsUpdate () {
        // 更新评论
        // this.reqPosts(this.currentPageCode, this.elementMaxSize)
        this.reqPosts(this.totalPageSize, this.elementMaxSize)
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.postUid = this.id
      if (this.userProfile !== '') {
        this.loggedInuserUid = this.userProfile.userUid
      }
      this.reqComments(() => {
        console.log('评论请求成功')
        // this.$nextTick()将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        this.$nextTick(() => {
          let place = this.$route.query.position
          if (place !== undefined) {
            let e = document.getElementById('#' + place)
            if (e !== null) {
              e.scrollIntoView({
                block: 'center',
                inline: 'center'
              })
              // this.$emit('scrollToEle', e)
            }
          }
        })
      })
      // Event.$on('commentsUpdate', age => {
      //   this.reqComments()
      // })
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

  .active {
    box-shadow: 5px 5px 5px #888888;
  }

  #indicator {
    display: flex;
    border: 1px solid black;
    justify-content: center;
    margin: 0 auto 50px auto;
  }
</style>
