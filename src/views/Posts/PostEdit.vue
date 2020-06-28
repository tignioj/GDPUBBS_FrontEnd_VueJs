<template>
  <div class="mdui-container">
    <h1>编辑帖子</h1>
    <div class="mdui-textfield mdui-textfield-floating-label">
      <label class="mdui-textfield-label">标题</label>
      <input v-if="this.post!=null && this.post.postTitle !==null" v-model="postTitle"
             name="postTitle" id="title" class="mdui-textfield-input" type="text" required/>
      <div class="mdui-textfield-error">标题不能为空</div>
    </div>


    <form id="form" method="post" enctype="multipart/form-data"
          action="/api/post/update"
    >
      <div class="mdui-textfield">

        <input v-if="this.post!=null" name="postUid" type="hidden" v-model="this.apost.postUid"/>

        <textarea v-if="this.post!=null"
                  name="postContent" id="content" class="mdui-textfield-input" maxlength="10000"
                  placeholder="输入内容；（支持Markdown）" required
                  @rows="this.rowCount"
                  v-model="postContent"
        >
        </textarea>
        <div class="mdui-textfield-error">内容不能为空</div>
      </div>

      <input @change="fileChange(this)" name="fileupload" id="file" type="file" accept="image/jpeg,image/gif,image/png"
             style="display:none"/>

      <!-- 图片预览 -->
      <div v-show="this.postImg" class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img id="previewImg" :src="this.base64Img"/>
              <input name="postImg" type="hidden" v-model="this.postImg">
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
            @click="save()" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">保存
    </button>

    <button id="previewBtn" style="float:left"
            @click="preview()"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">预览
    </button>

  </div>

</template>

<script>
  import {reqAPostById} from '../../api'
  import axios from 'axios'
  import mdui from 'mdui'

  export default {
    name: 'PostEdit',
    data () {
      return {
        post: null,
        postTitle: '',
        postContent: '',
        imgsFile: [],
        rowCount: 1,
        postImg: null,
        base64Img: null
      }
    },
    computed: {
      apost () {
        return this.post
      }
    },
    // 修改列表页的meta值，false时再次进入页面会重新请求数据。
    // beforeRouteLeave (to, from, next) {
    //   console.log('之前:', 'to:', to.path, to.meta.keepAlive, ' from:', from.path, from.meta.keepAlive)
    //   if (to.path === '/post/preview') {
    //     from.meta.keepAlive = true
    //   } else {
    //     from.meta.keepAlive = false
    //   }
    //   console.log('之后:', 'to:', to.path, to.meta.keepAlive, ' from:', from.path, from.meta.keepAlive)
    //   next()
    // },
    // created () {
    //   console.log('edit created')
    // },
    // activated () {
    //   console.log('edit activated')
    // },
    // deactivated () {
    //   console.log('edit deactivated')
    // },
    // updated () {
    //   console.log('edit update')
    // },
    mounted () {
      console.log('edit mounted')
      this.getpost()
      this.myglobalfun.cleanBodyComponentClass()
      // debugger
      this.$nextTick(() => {
        setTimeout(() => {
          // const self = this
        })
      })
    },
    methods: {
      imgDelete () {
        let fileEle = document.getElementById('file')
        fileEle.value = ''
        fileEle.outerHtml = fileEle.outerHTML
        this.post.postImg = null
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
      async getpost () {
        const uid = this.$route.params.id
        let res = await reqAPostById(uid)
        if (res.code === 0) {
          this.post = JSON.parse(res.data)
          this.postImg = this.post.postImg
          this.postTitle = this.post.postTitle
          this.postContent = this.post.postContent
          if (this.post.postImg !== undefined && this.post.postImg !== null) {
            this.base64Img = this.post.postImg
          }
        }
        try {
          let row = this.post.postContet.length / 100
          if (row > 40) {
            row = 40
          }
          this.rowCount = row
        } catch (e) {
        }
      },
      save () {
        this.submit()
      },
      submit: function (event) {
        let formData = new FormData(document.getElementById('form'))
        // // 下面是表单绑定的data 数据
        // 根据后台接收参数格式进行修改
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // vue-resource
        axios.post('api/post/update', formData, config).then(res => {
          console.log(res.data)

          // success callback
          let obj = res.data
          let view = true
          const self = this
          if (obj.code === 1) {
            // 未登录
            this.$router.push('/login')
          }

          if (obj.code === 0) {
            // 帖子数量加1
            // this.$store.dispatch('postCountAddOne', 1)

            mdui.snackbar({
              message: '修改成功，3秒后自动跳转到帖子',
              buttonText: '取消',
              onClick: function () {
                self.$router.push('/post/view/' + obj.data)
              },
              onButtonClick: function () {
                view = false
              },
              onClose: function () {
              }
            })
            if (view) {
              setTimeout(function () {
                self.$router.push('/post/view/' + obj.data)
              }, 3000)
            }
          }
        }).catch(err => {
          // error callback
          console.log(err)
        })
      },
      preview () {
        let content = this.postContent
        let title = this.postTitle
        console.log(title, content)

        // 注意：如果路由里面没有写name属性，而这里却用name的话，会返回到'/'，可以通过name路由传参而不显示在url上
        // 2. 如果配置了path, 没有配置name, 只能通过query传参，这样子会显示在URL上面
        this.$router.push(
          {
            name: '/post/preview',
            params: {title: title, content: content, base64Img: this.base64Img}
          }
        )
        // self.$router.push({path: '/previewpost', params: {text: '# abc'}})
        // self.$router.push('/previewpost')
      }
    }
  }
</script>
<style scoped>

</style>
