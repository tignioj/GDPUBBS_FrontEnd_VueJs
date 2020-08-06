<template>
  <div class="mdui-container">
    <h1>添加帖子到:</h1>
    <span
      v-if="currentminblock && currentminblock">{{ currentbigblock.bBlockName }}->{{
        currentminblock.blockMinName
      }}</span>

    <form ref="form" id="form" method="post" enctype="multipart/form-data"
          action="/api/post/add"
    >
      <p>帖子谁可以看见？</p>
      <div
        v-for="(pri, index)  in postPriList" :key="index"
      >
        <label class="mdui-radio">
          <input type="radio" name="postPrivilege.postPrivilegeId" v-bind:value="pri.postPrivilegeId"
                 :checked="pri.postPrivilegeId === postPri"
          />
          <i class="mdui-radio-icon"></i>
          {{ pri.postPrivilegeDesc }}
        </label>
        <br/>
      </div>
      <input name="postMBlock.belongToBigBlock.bBlockUid" type="hidden" v-model="currentbigblock.bBlockUid"/>
      <input name="postMBlock.blockMinUid" type="hidden" v-model="currentminblock.blockMinUid"/>
      <div class="mdui-textfield">
        <label class="mdui-textfield-label">标题(必填)</label>
        <input name="postTitle" id="title" v-model="postTitle" class="mdui-textfield-input" type="text" required/>
      </div>
      <!--      <div class="mdui-textfield">-->
      <!--        <label class="mdui-textfield-label">标签(选填), 以逗号分隔</label>-->
      <!--        <input name="postTitle" id="tags" v-model="postTagString" class="mdui-textfield-input" type="text" required/>-->
      <!--      </div>-->

      <!-- 在超小屏幕设备上，第一列 100% 宽度，第二列 50% 宽度。在小屏幕及以上设备上，第一列为 66.6% 宽度，第二列为 33.3% 宽度。 -->
<!--      <div class="mdui-p-t-2">标签(选填)</div>-->
<!--      <div class="mdui-chip"-->
<!--           v-for="(tag, index)  in postTags" :key="'k' + tag.tagId"-->
<!--      >-->
<!--        <span class="mdui-chip-title">{{ tag.tagName }}</span>-->
<!--        <span class="mdui-chip-delete" @click.prevent="postTags.splice(index,1)"><i-->
<!--          class="mdui-icon material-icons">cancel</i></span>-->
<!--      </div>-->
<!--      &lt;!&ndash;        <input :name="'tags[' + index + ']'" :value="user.userUid" type="hidden"/>&ndash;&gt;-->
<!--      <div class="mdui-row  mdui-p-b-2">-->
<!--        <div class="mdui-col-xs-12 mdui-col-sm-8">-->
<!--          <div class="mdui-textfield mdui-p-b-2 mdui-p-t-2">-->
<!--            <input-->
<!--              v-model="postTagString"-->
<!--              class="mdui-textfield-input" type="text" placeholder="添加标签"/>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="mdui-col-xs-12 mdui-col-sm-4 mdui-p-b-2 mdui-p-t-2">-->
<!--          <button-->
<!--            class="mdui-btn mdui-color-theme-accent mdui-ripple  mdui-btn-block"-->
<!--            @click.prevent="getTags()"-->
<!--          >搜索-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->


      <div class="mdui-textfield ">
        <label class="mdui-textfield-label">音乐链接(可选)</label>
        <input name="musicLink" v-model="postMusicLink" class="mdui-textfield-input" type="text"/>
      </div>
      <div class="mdui-textfield ">
        <label class="mdui-textfield-label">视频链接(可选)</label>
        <input name="videoLink" v-model="postVideoLink" class="mdui-textfield-input" type="text"/>
      </div>

      <div class="mdui-textfield">
        <label class="mdui-textfield-label">帖子内容(必填)</label>
        <textarea name="postContent" v-model="postContent" class="mdui-textfield-input" maxlength="10000"
                  placeholder="输入内容；（支持Markdown）" required></textarea>
        <div class="mdui-textfield-error">内容不能为空</div>
      </div>

      <!--      <input name="fileupload" id="file" type="file" multiple="multiple" accept="image/jpeg,image/gif,image/png"-->
      <!--             style="display:none"/>-->
      <input @change="fileChange(this)" name="fileupload" ref="imgFile" type="file"
             accept="image/jpeg,image/gif,image/png"
             style="display:none"/>
      <span>封面图片(可选)</span>

      <!-- 图片预览 -->
      <div v-show="this.postImg" class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img ref="previewImg" :src="this.base64Img"/>
              <input name="postImg" type="hidden" v-model="this.postImg">
              <div class="mdui-card-menu">
                <!-- 删除图片按钮 -->
                <button type="button" @click.stop="imgDelete()"
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
    <button ref="submitBtn" v-show="this.loggedInuserUid !== ''" @click.stop="submit()" style="float:right"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2"
    >发布
    </button>
    <button
      style="float:right"
      @click.stop="$router.push(globaRouterURL.LOGIN)"
      class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2"
      v-show="this.loggedInuserUid === ''">
      游客请先登录后发布
    </button>

    <button @click="preview()" style="float:left"
            class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2">预览
    </button>

  </div>

</template>

<script>
import {mapState} from 'vuex'
import mdui from 'mdui'
import {addPost, getTagsByName, reqPostPrivilege} from '../../../api'

export default {
  name: 'PostsAdd',
  data () {
    return {
      postTagString: '',
      hasLoaded: false,
      postTags: [],
      loggedInuserUid: '',
      imgsFile: [],
      postTitle: '',
      postMusicLink: '',
      postVideoLink: '',
      postUser: null,
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
  computed: {
    ...mapState(['currentbigblock', 'currentminblock', 'userProfile'])
    // 当前所在大板块
    // currentminblock: {}, // 当前所在的小版块
  },
  watch: {
    currentbigblock () {
      this.postBigBlogUid = this.currentbigblock
    },
    currentminblock () {
      this.postMinBlockUid = this.currentminblock
    },
    'userProfile': {
      deep: true,
      handler (val) {
        if (val) {
          console.log(val)
          this.postUser = val
          this.loggedInuserUid = val.userUid
        }
      }
    }
  },
  methods: {
    getTags () {
      const self = this
      getTagsByName(this.postTagString).then(re => {
        if (re.code === 0) {
          self.postTags = re.data
          self.postTags.forEach(item => {
            console.log(item.tagName, item.tagId)
          })
        }
      }).catch(err => {
        mdui.snackbar({
          message: '请求标签出错' + err
        })
      })
    },
    imgDelete () {
      let fileEle = this.$refs.imgFile
      fileEle.value = ''
      fileEle.outerHtml = fileEle.outerHTML
      this.imgsFile = []
      this.base64Img = null
      this.postImg = null
    },
    preview () {
      let content = this.postContent.trim()
      let title = this.postTitle
      let musicLink = this.musicLink
      let videoLink = this.videoLink
      console.log(title, content, this.base64Img, musicLink, videoLink)
      const self = this
      // 注意：如果路由里面没有写name属性，而这里却用name的话，会返回到'/'，可以通过name路由传参而不显示在url上
      // 2. 如果配置了path, 没有配置name, 只能通过query传参，这样子会显示在URL上面
      this.$router.push({
          name: self.globaRouterURL.POST_PREVIEW,
          params: {
            title: title,
            content: content,
            base64Img: this.base64Img,
            musicLink: musicLink,
            videoLink: videoLink
          }
        }
      )
      // self.$router.push({path: '/previewpost', params: {text: '# abc'}})
      // self.$router.push('/previewpost')
    },
    submit: function (event) {
      if (this.postTitle === null || this.postTitle === undefined || this.postTitle.trim() === '') {
        mdui.snackbar({
          message: '标题不能为空',
          position: 'top'
        })
        this.$refs.form['postTitle'].focus()
        return
      }

      if (this.postContent === null || this.postContent === undefined || this.postContent.trim() === '') {
        mdui.snackbar({
          message: '内容不能为空',
          position: 'top'
        })
        this.$refs.form['postContent'].focus()
        return
      }
      let formData = new FormData(this.$refs.form)

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
          // this.$store.dispatch('postCountAddOne', 1)

          self.imgsFile = []
          self.postBigBlogUid = null
          self.musicLink = ''
          self.postMusicLink = ''
          self.postVideoLink = ''
          self.postMinBlockUid = null
          self.base64Img = null
          self.postTitle = ''
          self.postContent = ''

          mdui.snackbar({
            message: '创建成功，自动跳转到帖子',
            buttonText: '取消',
            onClick: function () {
              self.$router.replace('/post/view/' + obj.data)
            },
            onButtonClick: function () {
              view = false
            },
            onClose: function () {
              view = false
            },
            onClosed: function () {
              view = false
            }
          })
          setTimeout(function () {
            if (view) {
              self.$router.replace('/post/view/' + obj.data)
            }
          }, 3000)
        }
      }).catch(err => {
        mdui.snackbar({
          message: '服务器出错',
          position: 'top'
        })
        console.log(err)
      })
    },
    fileChange () {
      let fileEle = document.getElementById('file')
      const self = this
      console.log(fileEle.files)
      self.imgsFile = []
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
    // 上传图片文件
    if (this.userProfile !== '') {
      this.loggedInuserUid = this.userProfile.userUid
    }
  }
}
</script>

<style scoped>

</style>
