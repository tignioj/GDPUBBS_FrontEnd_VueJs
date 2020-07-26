<template>
  <div @click.stop class="mdui-collapse-item-body mdui-shadow-1 mdui-m-x-1">
    <!--    TODO:: 添加二级回复时，一级回复的数量增加-->
    <div :id="'dialog'+ postCommentId" class="mdui-dialog">
      <div class="mdui-dialog-content">
        <form :id="'form' + postComment.postCommentUid" method="post" enctype="multipart/form-data"
        >
          <!--        所属帖子id-->
          <input name="commentReplyComment.postCommentUid" type="hidden" :value="postComment.postCommentUid"/>
          <!--        回复谁:回复这个评论的发起者-->
          <input type="hidden" name="commentReplyTouser.userUid"/>
          <!--        所在楼层-->
          <input type="hidden" name="commentReplyComment" :value="postComment.postCommentPlace">
          <!--        -->
          <div class="mdui-textfield">
            <!--        回复内容-->
            <textarea
              name="commentReplyContent" class="mdui-textfield-input" maxlength="10000"
              :placeholder="'回复' + postComment.postCommentFromuser.userAccount" required
              rows="3"
              v-model="replyContent"
            >
                </textarea>
            <div class="mdui-textfield-error">内容不能为空</div>
          </div>
          <!--回复的图片文件-->
          <input :id="'file' + postComment.postCommentUid" @change="fileChange(this)" name="fileupload" type="file"
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
        <!-- 关闭按钮 -->
        <button
          @click="dialog.close()" style="float:left"
          class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">关闭
        </button>
        <!-- 提交按钮 -->
        <button
          @click="submit()" style="float:right"
          class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">回复
        </button>
      </div>
    </div>

    <button class="mdui-btn mdui-ripple mdui-btn-block "
            @click.stop="replyTo(
                        postComment.postCommentUid,
                        postComment.postCommentFromuser.userUid,
                        postComment.postCommentFromuser.userAccount)">
      回复层主: {{ postComment.postCommentFromuser.userAccount}}
    </button>
    <div>
      <div v-for="(commentReply,index) in comments" :key="index" class="mdui-card">
        <!-- 卡片头部，包含头像、标题、副标题 -->
        <div class="mdui-card-header">
          <img class="mdui-card-header-avatar"
               :src="myglobalfun.imgBaseUrl(commentReply.commentReplyFromuser.userAvatar)"/>
          <div class="mdui-card-header-title">{{commentReply.commentReplyFromuser.userAccount}} 回复
            {{commentReply.commentReplyTouser.userAccount}}
          </div>
          <div class="mdui-card-header-subtitle">{{commentReply.commentReplyDate | date-format }}</div>
        </div>
        <!--评论图片-->
        <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
        <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
          <img :src="myglobalfun.imgBaseUrl(commentReply.commentReplyImg)" v-if="commentReply.commentReplyImg"/>
        </div>

        <!-- 卡片的内容 -->
        <div class="mdui-card-content">{{commentReply.commentReplyContent}}</div>

        <!-- 卡片的按钮 -->
        <div class="mdui-card-actions">
          <button
            v-if="commentReply.commentReplyFromuser.userUid == loggedInuserUid"
            @click.stop="deleteCommentReply(commentReply.commentReplyUid)"
            class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">delete</i>
          </button>
          <button
            @click="replyTo(postCommentId, commentReply.commentReplyFromuser.userUid, commentReply.commentReplyFromuser.userAccount)"
            class="mdui-btn mdui-ripple">回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mutation, snackbar, dialog, Dialog} from 'mdui'
  import {mapState} from 'vuex'
  import {getCommentRepliesByCommentUid, delCommentReply, addCommentReply} from '../../api'

  export default {
    props: ['postComment'],
    name: 'PostViewCommentReply',
    computed: {
      ...mapState(['userProfile'])
    },
    data () {
      return {
        loggedInuserUid: '',
        repleyObj: {},
        openReply: false,
        comments: [],
        postCommentId: '',
        replyContent: '',
        imgsFile: [],
        postImg: null,
        base64Img: null,
        dialog: null,
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
      replyTo (postCommentUid, toUserUid, toUserName) {
        this.dialogEle = document.getElementById('dialog' + postCommentUid)
        document.getElementById('form' + postCommentUid)['commentReplyTouser.userUid'].value = toUserUid
        document.getElementById('form' + postCommentUid)['commentReplyContent'].placeholder = '回复:' + toUserName
        this.dialog = new Dialog(this.dialogEle)
        this.dialog.open()
        // 监听关闭
        this.dialogEle.addEventListener('close.mdui.dialog', function (e) {
        })
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
          this.dialog.handleUpdate()
        })
      },
      fileChange () {
        let fileEle = document.getElementById('file' + this.postCommentId)
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
        self.dialog.close()
        // vue-resource
        // axios.post('api/comments/add', formData, config)
        addCommentReply(formData, config)
          .then(res => {
            console.log(res.data)
            // success callback
            let obj = res
            if (obj.code === 1) {
              // 未登录
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
              self.getCommentReplies()

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
      showReply () {
        this.openReply = !this.openReply
        if (this.openReply) {
          this.getCommentReplies()
        } else {
          this.comments = []
        }
      },
      getCommentReplies () {
        const self = this
        let uid = self.postComment.postCommentUid
        if (self.userProfile !== '') {
          self.loggedInuserUid = self.userProfile.userUid
        }
        this.postCommentId = uid
        if (self.openReply) {
          getCommentRepliesByCommentUid(uid).then((re) => {
            if (re.code === 0) {
              self.$nextTick(() => {
                self.comments = re.data
                self.$emit('changeReplycount', self.comments.length)
              })
              mutation()
            }
          }).catch((e) => {
            console.error(e)
          })
        }
      }
    },
    mounted () {
      // var inst = new Collapse(selector, options);
      this.$nextTick(() => {
        this.getCommentReplies()
      })
      mutation()
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

  .dialog-img {
    max-height: 100%;
  }

</style>
