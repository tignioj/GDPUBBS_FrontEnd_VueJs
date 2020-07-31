<template>
  <div style="overflow: scroll" id="dialog-replys" class="mdui-dialog">

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

            <div class="mdui-card-header">
              <img class="mdui-card-header-avatar"
                   :src="myglobalfun.imgBaseUrl(commentReply.commentReplyFromuser.userAvatar)"/>
              <div class="mdui-card-header-title">{{ commentReply.commentReplyFromuser.userAccount }} 回复
                {{ commentReply.commentReplyTouser.userAccount }}
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
            <button
              v-if="commentReply.commentReplyFromuser.userUid == loggedInuserUid"
              @click.stop="deleteCommentReply(commentReply.commentReplyUid)"
              class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">delete</i>
            </button>
            <button
              @click="replyTo(
                            postCommentId,
                            commentReply.commentReplyFromuser.userUid,
                            commentReply.commentReplyFromuser.userAccount)"
              class="mdui-btn mdui-ripple">回复
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

    </div>

    <div class="mdui-dialog-actions">
      <div v-if="postComment" :id="'dialog-myreply'" v-show="showMyReplyFrame">
        <div class="mdui-dialog-content">
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

            <div v-if="postComment && postComment.postCommentFromuser" class="mdui-textfield">
              <label class="mdui-textfield-label">{{this.placeHolder}}</label>
              <!--        回复内容-->
              <!--              :placeholder="'回复:' + postComment.postCommentFromuser.userAccount"-->
              <textarea
                :placeholder="'回复:' + placeHolder"
                name="commentReplyContent" class="mdui-textfield-input" maxlength="10000"
                required
                rows="3"
                v-model="replyContent"
              >
                    </textarea>
              <div class="mdui-textfield-error">内容不能为空</div>
            </div>
            <!--回复的图片文件-->
            <input :id="'file' + postComment.postCommentUid" @change="fileChange($event)" name="fileupload" type="file"
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
          <!-- 添加图片按钮 -->
          <button @click="addFile()" class="mdui-fab mdui-color-theme mdui-ripple "><i
            class="mdui-icon material-icons">add</i>
          </button>
          <hr/>
          <br/>
          <!-- 提交按钮 -->
          <button
            @click="submit()" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent ">回复
          </button>
        </div>
      </div>

      <button class="mdui-btn mdui-ripple" @click="closeDialog();">关闭</button>

      <button class="mdui-btn mdui-ripple" @click="toggleMyReplyFrame()">
        {{ this.showMyReplyFrame ? '收起' : '显示' }}
        回复框
      </button>
    </div>


  </div>
</template>

<script>

import {mutation, snackbar, dialog, Dialog} from 'mdui'
import {mapState} from 'vuex'
import {getCommentRepliesByCommentUid, delCommentReply, addCommentReply} from '../../api'

export default {
  name: 'CommentReplyList',
  computed: {
    ...mapState(['userProfile'])
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
      dialogEle: null
    }
  },
  watch: {
    openReply: {
      handler (isShow) {
        // if (!isShow) {
        // }
      },
      immediate: true
    }
  },
  methods: {
    goToProfile (userAccount) {
      const self = this
      self.dialogObj.close()
      // this.dialogEle.addEventListener('closed.mdui.dialog', function () {
      self.$router.push(self.globaRouterURL.PROFILE_OTHER + '/' + userAccount)
      // })
      // self.$router.push(self.globaRouterURL.PROFILE_OTHER + '/' + userAccount)
    },
    closeDialog () {
      this.dialogObj.close()
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
        self.dialogObj = new Dialog('#dialog-replys', {
          history: false,
          modal: false,
          overlay: false,
          destroyOnClosed: true
        })
        document.getElementById('form' + postCommentUid)['commentReplyTouser.userUid'].value = toUserUid
        // document.getElementById('form' + postCommentUid)['commentReplyContent'].placeholder = '回复:' + toUserName
        this.placeholder = '回复:' + toUserName

        self.dialogObj.open()

        // 监听关闭
        self.dialogEle.addEventListener('close.mdui.dialog', function (e) {
          self.toggleMyReplyFrame(false)
          self.dialogObj = null
        })
      } else {
        self.showMyReplyFrame = true
        document.getElementById('form' + postCommentUid)['commentReplyTouser.userUid'].value = toUserUid
        document.getElementById('form' + postCommentUid)['commentReplyContent'].placeholder = '回复:' + toUserName
        this.$nextTick(() => {
          self.dialogObj.handleUpdate()
        })
      }

    },
    deleteCommentReply (uid) {
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
    confirmDelete (uid) {
      const self = this
      delCommentReply(uid).then((re) => {
        if (re.code === 0) {
          // 刷新页面
          // 重新请求评论数据
          snackbar({
            message: '删除成功'
          })
          self.replyContent = ''
          self.getCommentReplies()
        } else {
          snackbar({
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
      const self = this
      this.$emit('commentsUpdate')
      getCommentRepliesByCommentUid(this.postCommentId).then((re) => {
        if (re.code === 0) {
          self.comments = re.data
          self.$nextTick(() => {
            self.dialogObj.handleUpdate()
          })
          self.showMyReplyFrame = false
          mutation()
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    showReply (postComment) {
      this.getCommentReplies(postComment)
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
        snackbar({
          message: '内容不能为空！'
        })
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
            // 未登录
            self.dialogObj.close()
            this.$router.push('/login')
          }
          if (obj.code === 0) {
            // 回复数量加1
            // this.$store.dispatch('postCountAddOne', 1)
            // this.$emit('commentsUpdate')
            self.imgDelete()
            self.replyContent = ''
            snackbar({
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
    getCommentReplies (postComment) {
      const self = this
      this.postComment = postComment
      this.postCommentId = postComment.postCommentUid
      getCommentRepliesByCommentUid(postComment.postCommentUid).then((re) => {
        if (re.code === 0) {
          self.comments = re.data
          self.$nextTick(() => {
            let toUser = postComment.postCommentFromuser
            self.replyTo(postComment.postCommentUid, toUser.userUid, toUser.userAccount)
          })
          mutation()
        }
      }).catch((e) => {
        console.error(e)
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
