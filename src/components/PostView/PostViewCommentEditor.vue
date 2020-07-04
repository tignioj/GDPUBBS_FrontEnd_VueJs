<template>
  <div id="commentEditor">
    <h1>回复</h1>
    <form id="form" method="post" enctype="multipart/form-data"
          action="/api/comments/add"
    >
      <div class="mdui-textfield">
        <!--        所属帖子-->
        <input name="postCommentPost.postUid" type="hidden" v-model="postUid"/>
        <!--        回复内容-->
        <textarea
          name="postCommentContent" id="content" class="mdui-textfield-input" maxlength="10000"
          placeholder="回复内容" required
          rows="3"
          v-model="postContent"
        >
        </textarea>
        <div class="mdui-textfield-error">内容不能为空</div>
      </div>
      <!--回复的图片文件-->
      <input @change="fileChange(this)" name="fileupload" id="file" type="file" accept="image/jpeg,image/gif,image/png"
             style="display:none"/>
      <!-- 图片预览 -->
      <div v-show="this.postImg" class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img id="previewImg" :src="this.base64Img"/>
              <!--              图片地址-->
              <input name="postCommentImg" type="hidden" v-model="this.postImg">
              <div class="mdui-card-menu">
                <!-- 删除图片按钮 -->
                <button type="button" @click="imgDelete()" id="deleteImg"
                        class="mdui-btn mdui-btn-icon mdui-text-color-white"><i
                  class="mdui-icon material-icons">close</i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <!-- 添加图片按钮 -->
    <button @click="addFile()" id="addButton" class="mdui-fab mdui-color-theme mdui-ripple "><i
      class="mdui-icon material-icons">add</i>
    </button>
    <hr/>
    <br/>
    <!-- 提交按钮 -->
    <button id="submitBtn"
            @click="submit()" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">保存
    </button>

  </div>

</template>

<script>
  import mdui from 'mdui'
  import {addComment} from '../../api'

  export default {
    name: 'PostViewCommentEditor',
    props: ['postUid'],
    data () {
      return {
        postContent: '',
        imgsFile: [],
        postImg: null,
        base64Img: null
      }
    },
    methods: {
      imgDelete () {
        let fileEle = document.getElementById('file')
        fileEle.value = ''
        fileEle.outerHtml = fileEle.outerHTML
        this.base64Img = null
        this.postImg = null
      },
      fileChange () {
        let fileEle = document.getElementById('file')
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
          // previewImg.src = reader.result
        }, false)
        // 调用reader.readAsDataURL()方法，把图片转成base64
        reader.readAsDataURL(f)
      },
      addFile () {
        let fileEle = document.getElementById('file')
        fileEle.click()
      },
      submit: function (event) {
        if (this.postContent.trim().length === 0) {
          return
        }

        let formData = new FormData(document.getElementById('form'))
        // // 下面是表单绑定的data 数据
        // 根据后台接收参数格式进行修改
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // vue-resource
        // axios.post('api/comments/add', formData, config)
        addComment(formData, config)
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
              this.$emit('commentsUpdate')
              this.imgDelete()
              this.postContent = ''
              mdui.snackbar({
                message: '回复成功'
              })
              // 刷新页面
              // 重新请求评论数据

              // let NewPage = "_empty" + "?time=" + new Date().getTime() / 500
              // console.log('refresh page')
              // this.$router.push(NewPage)
              // this.$router.go(-1)
            }
          }).catch(err => {
          // error callback
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  /*#commentEditor {*/
  /*  background: white;*/
  /*  border: 10px solid red;*/
  /*  z-index: 1;*/
  /*}*/
</style>
