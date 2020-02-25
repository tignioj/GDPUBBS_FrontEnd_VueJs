<template>
  <div class="mdui-container">
    <PostViewAppBar/>

    <!-- 帖子信息 -->
    <div @click="$router.push('/userinfoother/' + apost.postUser.userAccount)" id="postInfo"
         class="mdui-card mdui-hoverable mdui-m-t-1">
      <!--如果apost不为才加载，否则报错空指针异常-->
      <li class="mdui-list-item mdui-ripple" v-if="apost">
        <!-- 用户头像 -->
        <div class="mdui-list-item-avatar"><img :src="this.myglobalfun.imgBaseUrl(apost.postUser.userAvatar)"/></div>
        <div class="mdui-list-item-content">
          <!-- 用户名称 -->
          <div class="mdui-list-item-title">{{apost.postUser.userAccount}}</div>
          <div class="mdui-list-item-text mdui-list-item-one-line"><span class="mdui-text-color-theme-text">{{apost.postDate | date-format}}</span>
          </div>
        </div>
        <div @click.stop="favourUser(apost.postUser.userAccount)" class="mdui-chip">
          <span class="mdui-chip-title">关注</span>
        </div>
      </li>
    </div>


    <!-- 内容 -->
    <div id="postContent" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1">
    </div>

    <PostViewComments :apostUid="apost.postUid" v-if="apost"/>
    <!--底部栏-->
    <PostViewBottom/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import marked from 'marked'
  import PostViewBottom from '../../components/PostView/PostViewBottom.vue'
  import PostViewAppBar from '../../components/PostView/PostViewAppBar'
  import PostViewComments from '../../components/PostView/PostViewComments'

  export default {
    name: 'PostsView',
    components: {PostViewComments, PostViewAppBar, PostViewBottom},
    /**
     * 在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳，
     * 所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。
     * 与之对应的就是mounted()钩子函数，
     * 因为该钩子函数执行时所有的DOM挂载和渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题 。
     * 链接：https://www.jianshu.com/p/a7550c0e164f
     */
    created () {
      /**
       * 创建后，马上请求一篇文章
       */
      const id = this.$route.params.id
      this.$store.dispatch('getpostbyuid', {
        id: id,
        // 文章请求完成后，执行回调函数
        callback: () => {
          // 执行回调函数时, 此时页面尚未渲染，需要等待渲染完成后，再插入新的Dom

          /* 解决不能换行问题 */
          let re = /\n/g
          let content = this.apost.postContent.replace(re, '\n\n')

          /* 转换markdown为html文本 */
          let contentHtml = marked(content)
          document.getElementById('postContent').innerHTML = contentHtml

          this.$nextTick(() => {
            this.setImgSize()
          })
        }
      })
    },
    computed: {
      /* 拿到帖子后，有一个回调函数 */
      ...mapState(['apost'])
    },
    mounted () {
      this.myglobalfun.cleanTopTabCard()
    },
    methods: {
      /**
       * 防止图片超出屏幕范围
       * @param imgs
       */
      setImgSize () {
        let imgs = document.getElementsByTagName('img')
        let clientWidth = document.body.clientWidth
        for (let i = 0; i < imgs.length; i++) {
          let nimg = new Image()
          let img = imgs[i]
          nimg.src = img.src

          // 获取图片信息, 必须使用onload，否则读取为0
          nimg.onload = function () {
            if (img.width > clientWidth) {
              img.style.width = '100%'
            }
          }
        }
      },
      favourUser (userAccount) {
        console.log('关注', userAccount)
      }
    }
  }
</script>

<style scoped>

</style>
