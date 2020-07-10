<template>
  <div class="mdui-container">
    <h1>添加帖子到:</h1>
    <span>{{currentbigblock.bBlockName}}->{{currentminblock.blockMinName}}</span>


    <form id="form" method="post" enctype="multipart/form-data"
          action="/api/post/add"
    >
      <p>帖子谁可以看见？</p>
      <div
        v-for="(pri, index)  in postPriList" :key="index"
      >
        <label class="mdui-radio" >
          <input type="radio" name="postPrivilege.postPrivilegeId" v-bind:value="pri.postPrivilegeId"
                 :checked="pri.postPrivilegeId === postPri"
          />
          <i class="mdui-radio-icon"></i>
          {{pri.postPrivilegeDesc}}
        </label>
        <br/>
      </div>


      <!--      <input name="post_bblock.bbl_name" type="hidden" id="bblock"/>-->
      <!--      <input name="post_mblock.mb_name" type="hidden" id="mblock"/>-->
      <input name="postMBlock.belongToBigBlock.bBlockUid" type="hidden" id="bblock"/>
      <input name="postMBlock.blockMinUid" type="hidden" id="mblock"/>
      <div class="mdui-textfield mdui-textfield-floating-label">
        <label class="mdui-textfield-label">标题</label>
        <input name="postTitle" id="title" v-model="postTitle" class="mdui-textfield-input" type="text" required/>
        <div class="mdui-textfield-error">标题不能为空</div>
      </div>

      <div class="mdui-textfield">
        <textarea name="postContent" id="content" v-model="postContent" class="mdui-textfield-input" maxlength="10000"
                  placeholder="输入内容；（支持Markdown）" required></textarea>
        <div class="mdui-textfield-error">内容不能为空</div>
      </div>

      <!--      <input name="fileupload" id="file" type="file" multiple="multiple" accept="image/jpeg,image/gif,image/png"-->
      <!--             style="display:none"/>-->
      <input @change="fileChange(this)" name="fileupload" id="file" type="file" accept="image/jpeg,image/gif,image/png"
             style="display:none"/>
      <span>上传图片</span>

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
    <button id="addButton" class="mdui-fab mdui-color-theme mdui-ripple "><i class="mdui-icon material-icons">add</i>
    </button>
    <hr/>
    <!-- 提交按钮 -->
    <button id="submitBtn" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2"
    >发布
    </button>

    <button id="previewBtn" style="float:left"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">预览
    </button>

  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import mdui from 'mdui'
  import {addPost,reqPostPrivilege} from '../../../api'

  export default {
    name: 'PostsAdd',
    data () {
      return {
        imgsFile: [],
        postTitle: '',
        postContent: '',
        postBigBlogUid: null,
        // 帖子权限
        postPriList: [],
        postPri: 1,
        postImg: '',
        postMinBlockUid: null,
        base64Img: null
      }
    },
    // 修改列表页的meta值，false时再次进入页面会重新请求数据。
    beforeRouteLeave (to, from, next) {
      if (to.path === '/previewpost') {
        to.meta.keepAlive = true
      } else {
        to.meta.keepAlive = false
      }
      next()
    },
    computed: {
      ...mapState(['currentbigblock', 'currentminblock'])
      // 当前所在大板块
      // currentminblock: {}, // 当前所在的小版块
    },
    watch: {
      currentbigblock () {
        this.postBigBlogUid = this.currentbigblock
      },
      currentminblock () {
        this.postMinBlockUid = this.currentminblock
      }
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
      preview () {
        let content = document.getElementById('content').value.trim()
        let title = document.getElementById('title').value.trim()
        console.log(title, content, this.base64Img)
        // 注意：如果路由里面没有写name属性，而这里却用name的话，会返回到'/'，可以通过name路由传参而不显示在url上
        // 2. 如果配置了path, 没有配置name, 只能通过query传参，这样子会显示在URL上面
        this.$router.push({
            name: '/post/preview',
            params: {title: title, content: content, base64Img: this.base64Img}
          }
        )
        // self.$router.push({path: '/previewpost', params: {text: '# abc'}})
        // self.$router.push('/previewpost')
      },
      submit: function (event) {
        // event.preventDefault()
        let formData = new FormData(document.getElementById('form'))

        // // 下面是表单绑定的data 数据
        // formData.append('name', this.name);
        // formData.append('age', this.age);
        // formData.append('file', this.file);

        // 根据后台接收参数格式进行修改
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // vue-resource
        // axios.post('api/post/add', formData, config)
        addPost(formData, config).then(res => {
          console.log(res.data)
          // success callback
          let obj = res
          let view = true
          const self = this
          if (obj.code === 1) {
            // 未登录
            this.$router.push('/login')
          }

          if (obj.code === 0) {
            // 帖子数量加1
            this.$store.dispatch('postCountAddOne', 1)

            self.imgsFile = []
            self.postBigBlogUid = null
            self.postMinBlockUid = null
            self.base64Img = null
            self.postTitle = ''
            self.postContent = ''

            mdui.snackbar({
              message: '创建成功，3秒后自动跳转到帖子',
              buttonText: '取消',
              onClick: function () {
                self.$router.replace('/post/view/' + obj.data)
              },
              onButtonClick: function () {
                view = false
              },
              onClose: function () {
              }
            })
            if (view) {
              setTimeout(function () {
                self.$router.replace('/post/view/' + obj.data)
              }, 3000)
            }
          }
        }).catch(err => {
          // error callback
          console.log(err)
        })
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
      }
    },
    activated () {
      reqPostPrivilege().then((re) => {
        if (re.code === 0) {
          this.postPriList = re.data
          console.log(this.postPriList)
        }
      })
      this.myglobalfun.cleanTopTabCard()
    },
    mounted () {
      let self = this
      // 上传图片文件
      let addButtonEle = document.getElementById('addButton')

      let fileEle = document.getElementById('file')
      // let previewImg = document.getElementById('img')
      addButtonEle.onclick = function () {
        fileEle.click()
      }

      // 文章预览
      document.getElementById('previewBtn').addEventListener('click', function () {
        self.preview()
      })
      // 删除图片文件
      document.getElementById('deleteImg').onclick = function () {
        let previewImg = document.getElementById('previewImg')
        if (previewImg !== undefined && previewImg !== null) {
          fileEle.value = ''
          fileEle.outerHtml = fileEle.outerHTML
          previewImg.src = ''
        }
      }

      // 监听提交按钮
      document.getElementById('submitBtn').onclick = function () {
        document.getElementById('bblock').value = self.currentbigblock.bBlockUid
        document.getElementById('mblock').value = self.currentminblock.blockMinUid
        // console.log(self.currentbigblock.bBlockUid)
        // console.log(self.currentminblock.blockMinUid)
        // 提交
        // document.getElementById('form').submit()
        self.submit()
      }
    }
  }
</script>

<style scoped>

</style>
