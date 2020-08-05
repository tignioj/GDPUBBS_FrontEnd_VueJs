<template>
  <div>
    <div v-show="hasLoaded">
      <div v-if="canRead">
        <div style="z-index: -100" id="img-header-div" v-if="apost && apost.postImg">
          <img class="img-header" :src="apost.postImg"/>
        </div>
        <div class="mdui-container ">
          <!--      <PostViewAppBar/>-->
          <!-- 帖子信息 -->
          <div id="postInfo"
               class="mdui-card mdui-hoverable mdui-m-t-1 mdui-typo">
            <!--如果apost不为才加载，否则报错空指针异常-->
            <li class="mdui-list-item mdui-ripple" @click="$router.push('/userinfoother/' + apost.postUser.userAccount)"
                v-if="apost">
              <!-- 用户头像 -->
              <div class="mdui-list-item-avatar">
                <img alt="用户头像"
                     :src="this.myglobalfun.imgBaseUrl(apost.postUser.userAvatar)"/>
              </div>
              <div class="mdui-list-item-content">
                <!-- 用户名称 -->
                <div class="mdui-list-item-title">
                  {{ apost.postUser.userAccount }}
                  <button v-if="!seeHimOnlyFlag" @click.stop="seeHimOnly(apost.postUser.userUid)"
                          class="seehim-btn">
                    只看它
                  </button>
                  <button v-else @click.stop="unSeeHimOnly()" class="seehim-btn">
                    取消只看它
                  </button>
                </div>
                <div class="mdui-list-item-text mdui-list-item-one-line"><span
                  class="mdui-text-color-theme-text">{{ apost.postDate | date-format }}</span>
                </div>
              </div>
              <div @click.stop="favourUser(apost.postUser.userAccount)" class="mdui-chip">
                <span class="mdui-chip-title">关注</span>
              </div>
            </li>
            <li class="mdui-list-item " v-if="apost">
              当前位置： <a @click="goToBlockMins(apost.postMBlock)">{{ apost.postMBlock.blockMinName }}</a> ->
              {{ apost.postTitle }}
            </li>
          </div>

          <!-- 内容 -->
          <div id="postContent" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1"
               v-html="contentHTML"
          >

            <div class="mdui-progress">
              <div class="mdui-progress-indeterminate"></div>
            </div>
          </div>

          <PostViewCommentEditor
            v-if="apost"
            class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1" id="postViewCommentEditor"
            @commentsUpdate="commentsUpdate"
            :postUserUid="apost.postUser.userUid"
            :elementMaxSize="this.elementMaxSize"
            :post-uid="this.$route.params.id"
          />

          <PostViewComments
            v-if="apost"
            ref="comments"
            :postUserUid="apost.postUser.userUid"
            :commentPlace="postCommentPlace"
            :elementMaxSize="elementMaxSize"
            :apostUid="apost.postUid" v-show="apost.postComments > 0"
          />
          <!--底部栏-->
          <!--      传给组件一个方法-->
          <PostViewBottom ref="commentsBottom" v-if="apost" :postUid="apost.postUid" @showEditor="showEditor"/>
        </div>
      </div>
      <div v-else>
        {{ this.errorMsg }}
      </div>
    </div>
    <div v-show="!hasLoaded">
      <div class="mdui-progress ">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
    <button @click="scrollToTop()" class="mdui-fab mdui-color-pink-accent mdui-fab-fixed mdui-ripple mdui-m-b-5 ">
      <i class="mdui-icon material-icons">arrow_upward</i>
    </button>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {addPostView} from '../../api'
import PostViewBottom from '../../components/PostView/PostViewBottom.vue'
import PostViewAppBar from '../../components/PostView/PostViewAppBar'
import PostViewComments from '../../components/PostView/PostViewComments'
import PostViewCommentEditor from '../../components/PostView/PostViewCommentEditor'

// import hljs from 'highlight.js'
// import 'highlight.js/styles/googlecode.css' // 样式文件
// import 'highlight.js/styles/atom-one-dark.css'
// import 'highlight.js/styles/monokai-sublime.css';

export default {
  name: 'PostsView',
  components: {PostViewCommentEditor, PostViewComments, PostViewAppBar, PostViewBottom},
  /**
   * 在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳，
   * 所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。
   * 与之对应的就是mounted()钩子函数，
   * 因为该钩子函数执行时所有的DOM挂载和渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题 。
   * 链接：https://www.jianshu.com/p/a7550c0e164f
   */
  created () {
    // this.initMarkDownOption()
    /**
     * 创建后，马上请求一篇文章
     */
    const id = this.$route.params.id
    this.hasLoaded = false
    const self = this
    this.$store.dispatch('getpostbyuid', {
      id: id,
      // 文章请求完成后，执行回调函数
      success: () => {
        // 执行回调函数时, 此时页面尚未渲染，需要等待渲染完成后，再插入新的Dom
        /* 解决不能换行问题 */
        // let re = /\n/g
        // let content = this.apost.postContent.replace(re, '\n\n')
        addPostView(self.apost.postUid)
        let content = self.apost.postContent
        console.log(self.apost)
        self.postCommentCount = self.apost.postComments
        self.postUid = self.apost.postUid
        /* 转换markdown为html文本 */
        let contentHtml = self.parseMd(content)
        // document.getElementById('postContent').innerHTML = contentHtml
        self.contentHTML = contentHtml

        self.$nextTick(() => {
          // this.setImgSize()
          let place = self.$route.query.position
          if (place !== undefined) {
            let e = document.getElementById('#' + place)
            if (e !== undefined && e !== null) {
              // window.scrollTo(0, e.offsetTop - document.getElementsByClassName('header')[0].offsetHeight)
              //   console.log('scroll to ' + place, e.offsetTop)
              e.scrollIntoView({
                block: 'center',
                inline: 'center'
              })
              // this.$emit('scrollToEle', e)
            }
          }
        })
      },
      error: (re) => {
        self.canRead = false
        self.errorMsg = re.msg
      },
      finish: (re) => {
        self.hasLoaded = true
      }
    })
  },
  computed: {
    /* 拿到帖子后，有一个回调函数 */
    ...mapState(['apost'])
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === this.globaRouterURL.PROFILE_OTHER) {
      this.$refs.comments.saveCurrentInfo()
    }
    if (to.path === this.globaRouterURL.APP_HOME) {
      this.$refs.comments.removeCurrentInfo()
    }
    next()
  },
  data () {
    return {
      seeHimOnlyFlag: false,
      errorMsg: '',
      hasLoaded: false,
      canRead: true,
      postUid: '',
      elementMaxSize: 10,
      postCommentPlace: null,
      contentHTML: ''
    }
  },
  mounted () {
    this.myglobalfun.cleanTopTabCard()
    // 由于Dialog会给Body添加这个class,而从Dialog打开状态跳转到其它路由时，Dialog没有正常关闭
    // 因此我们需要手动去除
    document.body.classList.remove('mdui-locked')
    let p = this.$route.query.position
    if (p !== undefined) {
      this.postCommentPlace = p
    }
  },
  methods: {
    seeHimOnly (uid) {
      this.$refs.comments.seeHimOnly(uid)
      this.seeHimOnlyFlag = true
    },
    unSeeHimOnly (uid) {
      this.$refs.comments.unSeeHimOnly()
      this.seeHimOnlyFlag = false
    },
    goToBlockMins (mblock) {
      this.$store.dispatch('changecurrentminblock', mblock)
      this.$router.push(this.globaRouterURL.APP_HOME)
    },
    scrollToTop () {
      window.scrollTo(0, 0)
      this.$refs.comments.saveCurrentInfo()
    },
    commentsUpdate (args) {
      this.$refs.comments.commentsUpdate(args)
    },
    commentBottomUpdate () {
      this.$refs.commentsbottom.commentsBottomUpdate()
    },
    // 滚动到评论编辑器
    showEditor (isShow) {
      // this.isShowEditor = isShow
      this.$nextTick(() => {
        let ed = document.getElementById('postViewCommentEditor')
        console.log('scroll to view:', ed)
        ed.scrollIntoView({behavior: 'auto', block: 'center', inline: 'center'})
        // ed.scrollTo(0, 100)
      })
    },
    favourUser (userAccount) {
      console.log('关注', userAccount)
    },
    /**
     * 解析markDown文字成html
     */
    parseMd (mdText) {
      console.log(this.md.markdownParse)
      let html = this.md.markdownParse(mdText)
      return html
      // this.initMarkDownOption()
      // return marked(mdText)
    }
  }
}
</script>

<style>
@import "../../common/css/highlight-darcular.css";
@import "../../common/css/markdown-parser.css";

.markdown-code {
  border: 1px solid rgba(0, 0, 0, .12);
  border-radius: 5px;
}

#img-header-div {
  height: 100px;
}

.img-header {
  height: auto;
  width: 100%;
}

.img {
  height: auto;
  max-width: 100%;
}

.seehim-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
}

.seehim-btn:hover {
  transition: background-color;
  transition-duration: 100ms;
  background-color: lavender;
}
</style>
