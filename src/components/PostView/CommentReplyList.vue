<template>
  <div id="reply-dialog" style="position:relative;">
    <div style="overflow-y: scroll" id="dialog-replys" class="mdui-dialog">

      <!--        <div :id="'dialog-myreply'" class="mdui-dialog">-->

      <div class="mdui-dialog-content">
        <button v-if="postComment && postComment.postCommentFromuser" class="mdui-btn mdui-ripple mdui-btn-block "
                @click.stop="replyTo(
                              postComment.postCommentUid,
                              postComment.postCommentFromuser.userUid,
                              postComment.postCommentFromuser.userAccount)">
          回复层主: {{ postComment.postCommentFromuser.userAccount }}
        </button>

        <div v-if="postComment && comments.length >0">
          <div v-for="(commentReply,index) in comments" :key="index" class="mdui-card">
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <div @click="goToProfile(postComment.postCommentFromuser.userAccount)">

              <div class="mdui-card-header mdui-typo">
                <img class="mdui-card-header-avatar"
                     :src="myglobalfun.imgBaseUrl(commentReply.commentReplyFromuser.userAvatar)"/>
                <div class="mdui-card-header-title">
                  <a> {{ commentReply.commentReplyFromuser.userAccount }} </a>
                  <span v-if="commentReply.commentReplyTouser.userUid!==postComment.postCommentFromuser.userUid">
                    回复
                    <a>
                  {{ commentReply.commentReplyTouser.userAccount }}
                    </a>
                  </span>
                </div>
                <div class="mdui-card-header-subtitle">{{ commentReply.commentReplyDate | date-format }}</div>
              </div>
            </div>
            <!--          评论图片-->
            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
              <img :src="myglobalfun.imgBaseUrl(commentReply.commentReplyImg)" v-if="commentReply.commentReplyImg"/>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{ commentReply.commentReplyContent }}</div>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">
              <!--            <button-->
              <!--              v-if="commentReply.commentReplyFromuser.userUid == loggedInuserUid"-->
              <!--              @click.stop="deleteCommentReply(commentReply.commentReplyUid)"-->
              <!--              class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">delete</i>-->
              <!--            </button>-->

              <button @click.stop="addReplyGood(commentReply.commentReplyUid, $event)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">thumb_up</i>
              </button>
              {{ commentReply.commentReplyGood }}
              <button @click.stop="addReplyBad(commentReply.commentReplyUid)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">thumb_down</i>
              </button>
              {{ commentReply.commentReplyBad }}

              <button
                @click="replyTo(
                            postCommentId,
                            commentReply.commentReplyFromuser.userUid,
                            commentReply.commentReplyFromuser.userAccount)"
                class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">comment</i>
              </button>

              <button
                v-if="(commentReply.commentReplyFromuser.userUid ===  loggedInuserUid
              || (userProfile && userProfile.userPri.userPrivilegeId >= 2))"
                @click.stop="deleteCommentReply(commentReply.commentReplyUid)" class="mdui-btn mdui-btn-icon">
                <i class="mdui-icon material-icons">delete</i>
              </button>
              <!--      <button v-if="postComment && postComment.postCommentFromuser" class="mdui-btn mdui-ripple mdui-btn-block "-->
              <!--              @click.stop="replyTo(-->
              <!--                        postComment.postCommentUid,-->
              <!--                        postComment.postCommentFromuser.userUid,-->
              <!--                        postComment.postCommentFromuser.userAccount)">-->
              <!--        回复层主: {{ postComment.postCommentFromuser.userAccount}}-->
              <!--      </button>-->
            </div>
          </div>
        </div>

        <div v-show="comments.length > 0" id="indicatorreply">
        </div>

        <div style="height: 129px"></div>
      </div>

      <!--    <div class="mdui-dialog-actions" style="height: 129px">-->
      <!--    </div>-->
      <div style="position:fixed; bottom: 0; width: 100%; background-color: white">
        <div class="mdui-grid-list">
          <div v-if="postComment" :id="'dialog-myreply'">
            <div class="mdui-dialog-content mdui-row-xs-1 mdui-p-y-0">
              <div class="mdui-col-xs-11">
                <form :id="'form' + postComment.postCommentUid" method="post" enctype="multipart/form-data"
                >
                  <!--        所属楼层id-->
                  <input name="commentReplyComment.postCommentUid" type="hidden" :value="postComment.postCommentUid"/>


                  <!--          所属楼层内容概览-->
                  <input name="commentReplyCommentSummary" type="hidden" :value="postComment.postCommentContent"/>

                  <!--        所属帖子id-->
                  <input name="belongToPost.postUid" type="hidden" :value="postComment.postCommentPost"/>
                  <!--        回复谁:回复这个评论的发起者: 由外界提供-->
                  <input type="hidden" name="commentReplyTouser.userUid"/>
                  <!--        所在楼层-->
                  <!--            <input type="hidden" name="commentReplyComment" :value="postComment.postCommentPlace">-->

                  <div v-if="postComment && postComment.postCommentFromuser"
                       class="mdui-textfield mdui-p-a-0">
                    <label class="mdui-textfield-label">{{ this.placeHolder }}</label>
                    <!--        回复内容-->
                    <!--              :placeholder="'回复:' + postComment.postCommentFromuser.userAccount"-->
                    <textarea
                      ref="replytextarea"
                      :placeholder="placeHolder"
                      name="commentReplyContent" class="mdui-textfield-input" maxlength="10000"
                      required
                      rows="1"
                      v-model="replyContent"
                    >
                    </textarea>
                  </div>
                  <!--回复的图片文件-->
                  <input :id="'file' + postComment.postCommentUid" @change="fileChange($event)" name="fileupload"
                         type="file"
                         accept="image/jpeg,image/gif,image/png"
                         style="display:none"/>
                  <!-- 图片预览 -->
                  <div v-show="this.postImg" class="mdui-row-xs-1 mdui-row-md-3">
                    <div class="mdui-col">
                      <div class="mdui-card mdui-m-t-1">
                        <div class="mdui-card-media">
                          <img class="dialog-img" :src="this.base64Img"/>
                          <!--              图片地址-->
                          <input name="commentReplyImg" type="hidden" v-model="this.postImg">
                          <div class="mdui-card-menu">
                            <!-- 删除图片按钮 -->
                            <button type="button" @click="imgDelete()"
                                    class="mdui-btn mdui-btn-icon mdui-text-color-white"><i
                              class="mdui-icon material-icons">close</i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <!--          &lt;!&ndash; 添加图片按钮 &ndash;&gt;-->
                <!--          <button @click="addFile()" class="mdui-fab mdui-color-theme mdui-ripple "><i-->
                <!--            class="mdui-icon material-icons">add</i>-->
                <!--          </button>-->
                <!-- 提交按钮 -->

              </div>
              <div class="mdui-col-xs-1  mdui-valign" style="height: 81px">
                <!-- 添加图片按钮 -->
                <button @click="addFile()" class="mdui-btn mdui-btn-icon mdui-center mdui-color-theme-accent "><i
                  class="mdui-icon material-icons">add</i>
                </button>
              </div>
            </div>
          </div>

        </div>
        <div class="mdui-dialog-actions">
          <button class="mdui-btn mdui-ripple" @click="closeDialog();">关闭</button>
          <button
            v-if="loggedInuserUid"
            @click="submit()"
            class="mdui-btn mdui-ripple ">回复
          </button>

          <!--      <button v-show="loggedInuserUid" class="mdui-btn mdui-ripple" @click="toggleMyReplyFrame()">-->
          <!--        {{ this.showMyReplyFrame ? '收起' : '显示' }}-->
          <!--        回复框-->
          <!--      </button>-->
          <button @click="$router.push(globaRouterURL.LOGIN)" class="mdui-btn mdui-ripple" v-show="!loggedInuserUid">
            游客登陆后回复
          </button>
        </div>
      </div>
    </div>
    <button style="position:fixed; top: 0px; right: -50px">关闭</button>
  </div>
</template>

<script>

import mdui from 'mdui'
import {mapState} from 'vuex'
import {
  addCommentReplyGood,
  addCommentReplyBad,
  getCommentRepliesByCommentUid,
  delCommentReply,
  addCommentReply,
} from '../../api'

export default {
  name: 'CommentReplyList',
  computed: {
    ...mapState(['userProfile'])
  },
  beforeDestroy () {
    document.body.classList.remove('mdui-lock')
    this.dialogObj && this.dialogObj.close()
    this.dialogObj && this.dialogObj.destroy()
    this.dialogObj = null
  },
  data () {
    return {
      postComment: [],
      loggedInuserUid: '',
      placeHolder: '',
      repleyObj: {},
      openReply: false,
      comments: [],
      postCommentId: '',
      replyContent: '',
      imgsFile: [],
      showMyReplyFrame: false,
      postImg: null,
      base64Img: null,
      dialogObj: null,
      dialogEle: null,

      // 分页
      searchInput: '',
      indicatorsIndex: [],
      /* 当前第几页 */
      currentPageCode: 1,
      /* 一共多少页 */
      totalPageSize: 1,
      /* 一次请求最多显示多少条记录 */
      elementMaxSize: 20,
      /* 显示下标数量 */
      showIndicatorSize: 5,

      /* 是否显示上一页 */
      isShowPrevious: false,

      /* 是否显示下一页 */
      isShowNext: false

    }
  },
  watch: {
    openReply: {
      handler (isShow) {
        // if (!isShow) {
        // }
      },
      immediate: true
    },
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
  methods: {
    async addReplyBad (uid) {
      // this.saveCurrentInfo()
      let re = await addCommentReplyBad(uid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '点赞成功'
        })
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
      }
    },
    refreshCommentsReply () {
      this.getCommentReplies(() => {
        this.replyTo(
          this.postComment.postCommentUid,
          this.postComment.postCommentFromuser.userUid,
          this.postComment.postCommentFromuser.userAccount)

        this.$nextTick(() => {
          // let toUser = self.postComment.postCommentFromuser
          // self.replyTo(self.postComment.postCommentUid, toUser.userUid, toUser.userAccount)
          setTimeout(function () {
            this.dialogObj && this.dialogObj.handleUpdate()
          })
          this.$refs.replytextarea.focus()
        })
        mdui.mutation()
      })
    },
    async addReplyGood (uid, e) {
      // this.saveCurrentInfo()
      let re = await addCommentReplyGood(uid)
      if (re.code === 0) {
        mdui.snackbar({
          message: '点赞成功'
        })
        let h = e.target.scrollHeight
        this.reqPosts(this.currentPageCode, this.elementMaxSize)
        this.dialogEle.scrollTo(0, h)
      }
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
      let re = await getCommentRepliesByCommentUid(this.postCommentId, this.searchInput, currentPageCode, elementMaxSize)
      console.log(re)
      if (re.code === 0) {
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
      let indicatorEle = document.getElementById('indicatorreply')
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
    goToProfile (userAccount) {
      if (this.dialogObj) {
        this.dialogObj.close()
        this.dialogObj.destroy()
        this.dialogObj = null
      }
      const self = this
      // this.dialogEle.addEventListener('closed.mdui.dialog', function () {
      self.$router.push(self.globaRouterURL.PROFILE_OTHER + '/' + userAccount)
      // })
      // self.$router.push(self.globaRouterURL.PROFILE_OTHER + '/' + userAccount)
    },
    closeDialog () {
      if (this.dialogObj) {
        this.dialogObj.close()
        this.dialogObj.destroy()
        this.dialogObj = null
      }
    },
    toggleMyReplyFrame (b) {
      if (b !== undefined) {
        this.showMyReplyFrame = b
      } else {
        this.showMyReplyFrame = !this.showMyReplyFrame
      }
      this.$nextTick(() => {
        if (this.dialogObj) {
          this.dialogObj.handleUpdate()
        }
      })
    },
    replyTo (postCommentUid, toUserUid, toUserName) {
      const self = this
      self.dialogEle = document.getElementById('dialog-replys')

      if (self.dialogObj == null) {
        self.dialogObj = new mdui.Dialog('#dialog-replys', {
          history: false,
          modal: true,
          overlay: false
        })

        // self.dialogEle.appendChild(closeBtn)
        // document.getElementById('reply-dialog').appendChild(closeBtn)

        document.getElementById('form' + postCommentUid)['commentReplyTouser.userUid'].value = toUserUid
        // document.getElementById('form' + postCommentUid)['commentReplyContent'].placeholder = '回复:' + toUserName
        self.placeHolder = '回复:' + toUserName
        self.dialogObj.open()

        // 监听关闭
        self.dialogEle.addEventListener('close.mdui.dialog', function (e) {
          self.toggleMyReplyFrame(false)
          self.currentPageCode = 1
          // self.dialogObj = null
        })
      } else {
        document.getElementById('form' + postCommentUid)['commentReplyTouser.userUid'].value = toUserUid
        // document.getElementById('form' + postCommentUid)['commentReplyContent'].placeholder = '回复:' + toUserName
        self.placeHolder = '回复:' + toUserName
        // this.$nextTick(() => {
        //   self.dialogObj.handleUpdate()
        // })
      }
    },
    deleteCommentReply (uid) {
      const self = this
      self.dialogObj.close()
      mdui.dialog({
        title: '确认删除吗',
        buttons: [
          {
            text: '取消',
            onClick: function () {
              // self.dialogObj.open()
            }
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmDelete(uid)
            }
          }
        ],
        onClose: function () {
          self.dialogObj.open()
        }
      })
    },
    confirmDelete (uid) {
      const self = this
      delCommentReply(uid).then((re) => {
        if (re.code === 0) {
          // 刷新页面
          // 重新请求评论数据
          mdui.snackbar({
            message: '删除成功'
          })
          self.replyContent = ''
          this.currentPageCode = 1
          self.refreshCommentReply()
        } else {
          mdui.snackbar({
            message: '删除失败了'
          })
        }
      }).catch((e) => {
      })
    },
    imgDelete () {
      let fileEle = document.getElementById('file' + this.postCommentId)
      fileEle.value = ''
      fileEle.outerHtml = fileEle.outerHTML
      this.base64Img = null
      this.postImg = null
      this.$nextTick(() => {
        if (this.dialogObj) {
          this.dialogObj.handleUpdate()
        }
      })
    },
    refreshCommentReply () {
      this.$emit('commentsUpdate')
      const self = this
      this.reqPosts(this.currentPageCode, this.elementMaxSize).then(re => {
        self.$nextTick(() => {
          this.dialogObj.handleUpdate()
        })
      })
    },
    showReply (postComment, replyToUser) {
      this.postComment = postComment
      this.getCommentReplies(() => {
        if (replyToUser) {
          this.replyTo(
            this.postComment.postCommentUid,
            replyToUser.userUid,
            replyToUser.userAccount
          )
        } else {
          this.replyTo(
            this.postComment.postCommentUid,
            this.postComment.postCommentFromuser.userUid,
            this.postComment.postCommentFromuser.userAccount)
        }
        this.$nextTick(() => {
          // let toUser = self.postComment.postCommentFromuser
          // self.replyTo(self.postComment.postCommentUid, toUser.userUid, toUser.userAccount)
          setTimeout(function () {
            this.dialogObj && this.dialogObj.handleUpdate()
          })
          this.$refs.replytextarea.focus()
        })
        mdui.mutation()
      })

    },
    fileChange (event) {
      let fileEle = event.target
      const self = this
      console.log(fileEle.files)
      let f = fileEle.files[0]
      self.imgsFile.push(f)
      let reader = new FileReader()
      // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
      reader.addEventListener('load', function () {
        self.base64Img = reader.result
        self.postImg = f.name
        console.log(f.name)
        self.$nextTick(() => {
          setTimeout(function () {
            self.dialog.handleUpdate()
          }, 0)
        })
        // previewImg.src = reader.result
      }, false)
      // 调用reader.readAsDataURL()方法，把图片转成base64
      reader.readAsDataURL(f)
    },
    addFile () {
      let fileEle = document.getElementById('file' + this.postCommentId)
      fileEle.click()
    },
    submit: function (event) {
      if (this.replyContent.trim().length === 0) {
        mdui.snackbar({
          message: '内容不能为空！'
        })
        this.$refs.replytextarea.focus()
        // document.getElementById('form' + this.postCommentUid)['commentReplyContent'].focous()
        return
      }
      let formData = new FormData(document.getElementById('form' + this.postCommentId))

      // // 下面是表单绑定的data 数据
      // 根据后台接收参数格式进行修改
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const self = this
      // vue-resource
      // axios.post('api/comments/add', formData, config)
      addCommentReply(formData, config)
        .then(res => {
          console.log(res.data)
          // success callback
          let obj = res
          if (obj.code === 1) {
            self.dialogObj.close()
            if (self.msg.err_no_login) {
              this.$router.push('/login')
            } else {
              mdui.snackbar({
                message: '出错' + self.msg
              })
            }
          }
          if (obj.code === 0) {
            // 回复数量加1
            // this.$store.dispatch('postCountAddOne', 1)
            // this.$emit('commentsUpdate')
            self.imgDelete()
            self.replyContent = ''
            mdui.snackbar({
              message: '回复成功'
            })
            // 刷新页面
            // 重新请求评论数据
            self.refreshCommentReply()

            // let NewPage = "_empty" + "?time=" + new Date().getTime() / 500
            // console.log('refresh page')
            // this.$router.push(NewPage)
            // this.$router.go(-1)
          }
        }).catch(err => {
        // error callback
        console.error(err)
      })
    },
    getCommentReplies (callback) {
      this.postCommentId = this.postComment.postCommentUid
      this.reqPosts(this.currentPageCode, this.elementMaxSize).then(re => {
        callback && callback(re)
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
#indicatorreply {
  display: flex;
  border: 1px solid black;
  justify-content: center;
}

</style>
