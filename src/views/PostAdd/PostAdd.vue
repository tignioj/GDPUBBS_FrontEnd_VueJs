<template>
  <div class="mdui-container">
    PostsAdd

    <div></div>


    <form id="form" method="post" enctype="multipart/form-data"
          action="/api/post/add"
    >
      <!--      <input name="post_bblock.bbl_name" type="hidden" id="bblock"/>-->
      <!--      <input name="post_mblock.mb_name" type="hidden" id="mblock"/>-->
      <input name="postMBlock.belongToBigBlock.bBlockUid" type="hidden" id="bblock"/>
      <input name="postMBlock.blockMinUid" type="hidden" id="mblock"/>
      <div class="mdui-textfield mdui-textfield-floating-label">
        <label class="mdui-textfield-label">标题</label>
        <input name="postTitle" id="title" class="mdui-textfield-input" type="text" required/>
        <div class="mdui-textfield-error">标题不能为空</div>
      </div>


      <div class="mdui-textfield">
        <textarea name="postContent" id="content" class="mdui-textfield-input" maxlength="10000"
                  placeholder="输入内容；（支持Markdown）" required></textarea>
        <div class="mdui-textfield-error">内容不能为空</div>
      </div>

      <input name="fileupload" id="file" type="file" multiple="multiple" accept="image/jpeg,image/gif,image/png"
             style="display:none"/>
      <span>上传图片</span>

      <!-- 图片预览 -->
      <div class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img id="img" src=""/>
              <div class="mdui-card-menu">
                <!-- 删除图片按钮 -->
                <button id="deleteImg" class="mdui-btn mdui-btn-icon mdui-text-color-white"><i
                  class="mdui-icon material-icons">close</i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="preview">
        image preview
      </div>
    </form>


    <!-- 添加图片按钮 -->
    <button id="addButton" class="mdui-fab mdui-color-theme mdui-ripple "><i class="mdui-icon material-icons">add</i>
    </button>
    <hr/>
    <!-- 提交按钮 -->
    <button id="submitBtn" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">发布
    </button>

    <button id="previewBtn" style="float:left"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">预览
    </button>

  </div>

</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'PostsAdd',
    data () {
      return {
        imgsFile: [],
        postBigBlogUid: null,
        postMinBlockUid: null
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
      preview () {
        let content = document.getElementById('content').value.trim()
        let title = document.getElementById('title').value.trim()

        // 注意：如果路由里面没有写name属性，而这里却用name的话，会返回到'/'，可以通过name路由传参而不显示在url上
        // 2. 如果配置了path, 没有配置name, 只能通过query传参，这样子会显示在URL上面
        this.$router.push({name: 'previewpost', params: {title: title, content: content}})
        // self.$router.push({path: '/previewpost', params: {text: '# abc'}})
        // self.$router.push('/previewpost')
      }
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

      fileEle.addEventListener('change', function () {
          console.log(this.files)
          for (let i = 0; i < this.files.length; i++) {
            let f = this.files[i]
            self.imgsFile.push(f)

            let reader = new FileReader()
            // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
            reader.addEventListener('load', function () {
              let div = document.createElement('div')
              let imgEle = document.createElement('img')
              let url = document.createElement('span')
              url.appendChild(document.createTextNode('图片链接：' + f.name))
              imgEle.setAttribute('src', reader.result)
              imgEle.setAttribute('width', '100')
              imgEle.setAttribute('height', '100')
              imgEle.setAttribute('alt', f.name)

              div.appendChild(imgEle)
              div.appendChild(url)
              document.getElementById('preview').appendChild(div)
              console.log('append:' + reader)
              // previewImg.src = reader.result
            }, false)
            // 调用reader.readAsDataURL()方法，把图片转成base64
            reader.readAsDataURL(f)
          }
        },
        false
      )

      // 删除图片文件
      document.getElementById('deleteImg').onclick = function () {
        fileEle.value = ''
        fileEle.outerHtml = fileEle.outerHTML
        previewImg.src = ''
      }

      // 监听提交按钮
      document.getElementById('submitBtn').onclick = function () {
        // 获取大板块
        // var category = document.getElementsByClassName('mdui-typo-title')[0].innerText
        // 获取子版块
        // var subCategory = document.getElementsByClassName('mdui-tab-active')[0].getElementsByTagName('label')[0].innerText
        // 给隐藏表单赋值
        // document.getElementById("bblock").value = category;
        // document.getElementById("mblock").value = subCategory;

        document.getElementById('bblock').value = self.currentbigblock.bBlockUid
        document.getElementById('mblock').value = self.currentminblock.blockMinUid
        // console.log(self.currentbigblock.bBlockUid)
        // console.log(self.currentminblock.blockMinUid)
        // 提交
        document.getElementById('form').submit()
      }
    }
  }
</script>

<style scoped>

</style>
