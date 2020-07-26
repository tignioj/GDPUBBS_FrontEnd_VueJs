<template>
  <div v-if="blockminDetail">
    <div class="mdui-container">
      <h1>{{blockminDetail.blockMinName}}</h1>
      <div>
        <ul class="mdui-list">
          <li class="mdui-list-item mdui-ripple">创建者: {{blockminDetail.blockMinUser.userAccount}}</li>
          <li class="mdui-list-item mdui-ripple">创建时间：{{blockminDetail.bBlockCreatedTime | date-format}}</li>
          <li class="mdui-list-item mdui-ripple">描述: {{blockminDetail.blockMinDesc}}</li>
        </ul>
      </div>

      <div class="mdui-p-t-2"> 管理员：
        <div style="display: inline-block" v-for="(user, index)  in grantedUsers" :key="index"
        >
          <div class="mdui-chip"
               @click="$router.push(globaRouterURL.PROFILE_OTHER + '/' + user.userAccount)"
          >
            <img class="mdui-chip-icon" :src="myglobalfun.imgBaseUrl(user.userAvatar)"/>
            <span class="mdui-chip-title">{{user.userAccount}}</span>
            <!--          <input :name="'users[' + index + ']'" :value="user.userUid" type="hidden" />-->
          </div>
        </div>
      </div>


      <div class="mdui-divider mdui-m-t-2 mdui-m-b-2"></div>

      <button class="mdui-btn mdui-btn-block mdui-btn-raised mdui-ripple mdui-color-theme-accent"
              @click="seeAllPostsByBlockMinUid(blockMinUid)"
      >查看所有帖子
      </button>

      <!--      <button-->
      <!--        @click="$router.push(globaRouterURL.POST_ADD+ '/' + blockminDetail.bBlockUid  + '?bmname=' + blockminDetail.bBlockName)"-->
      <!--        class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-b-2"-->
      <!--      >添加帖子-->
      <!--      </button>-->


<!--      <div v-if="posts.length > 0"-->
<!--           class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">-->
<!--        <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 "-->
<!--             v-for="(p, index)  in posts" :key="index"-->
<!--        >-->
<!--          &lt;!&ndash;          <a :href="'/document/browse.html?postUid=' + block.postUid" class="docLink" style="display:none;"></a>&ndash;&gt;-->
<!--          &lt;!&ndash; 卡片头部，包含头像、标题、副标题 &ndash;&gt;-->
<!--          <router-link tag="div" :to="'/userinfoother/' + p.postUser.userAccount">-->
<!--            <div class="mdui-card-header">-->
<!--              <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(p.postUser.userAvatar)"/>-->
<!--              &lt;!&ndash;        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />&ndash;&gt;-->
<!--              &lt;!&ndash;        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />&ndash;&gt;-->
<!--              <div class="mdui-card-header-title">{{p.postUser.userAccount}}</div>-->
<!--              <div class="mdui-card-header-subtitle">{{p.postDate | date-format}}</div>-->
<!--            </div>-->
<!--          </router-link>-->

<!--          <router-link :to="globaRouterURL.POST_VIEW+ '/' + p.postUid" tag="div">-->
<!--            &lt;!&ndash; 卡片的标题和副标题 &ndash;&gt;-->
<!--            <div class="mdui-card-primary">-->
<!--              <div class="mdui-card-primary-title">{{p.postTitle}}</div>-->
<!--              <div v-if="p.postTag" class="mdui-card-primary-subtitle">-->
<!--                <PostViewTag :tags="p.postTag" v-if="p.postTag.length"/>-->
<!--              </div>-->
<!--            </div>-->

<!--            &lt;!&ndash; 卡片的内容 &ndash;&gt;-->
<!--            <div class="mdui-card-content">{{p.postContent}}</div>-->
<!--          </router-link>-->

<!--          &lt;!&ndash; 卡片的按钮 &ndash;&gt;-->
<!--          <div class="mdui-card-actions">-->
<!--            <button-->
<!--              v-if="(p.postUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 2))"-->
<!--              @click="$router.push(globaRouterURL.POST_EDIT+ '/' + p.postUid)"-->
<!--              class="mdui-btn mdui-ripple">编辑-->
<!--            </button>-->
<!--            <button-->
<!--              v-if="(p.postUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 2))"-->
<!--              @click="deletePost(p.postTitle, p.postUid)" class="mdui-btn mdui-ripple">删除-->
<!--            </button>-->
<!--            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash;如果没有帖子&ndash;&gt;-->
<!--        <div v-if="posts.length === 0">暂时没有帖子哈~</div>-->
<!--      </div>-->

    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {reqBlockMinDetail, reqBlockBigByUid} from '../../api'
  import PostViewTag from '../../components/PostView/PostViewTag'

  export default {
    name: 'BlockMinDetail',
    components: {PostViewTag},
    data () {
      return {
        loggedInuserUid: '',
        blockMinUid: '',
        blockBigUid: '',
        blockminDetail: null,
        posts: [],
        grantedUsers: []
      }
    },
    computed: {
      ...mapState(['userProfile'])
    },
    watch: {
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
    mounted () {
      const id = this.$route.params.id
      this.blockMinUid = id
      this.loadBlockBigDetails(id)
    },
    methods: {
      seeAllPostsByBlockMinUid (blockMinUid) {
        reqBlockBigByUid(this.blockBigUid).then(re => {
          this.$store.dispatch('changecurrentbigblock', re.data)
        })

        reqBlockMinDetail(blockMinUid).then(re => {
          this.$store.dispatch('changecurrentminblock', re)
        })
        this.$router.push(this.globaRouterURL.APP_HOME + '?blockminuid=' + blockMinUid)
      },
      loadBlockBigDetails (uid) {
        const self = this
        reqBlockMinDetail(uid).then(re => {
          console.log(re)
          self.blockminDetail = re
          self.blockBigUid = re.belongToBigBlock.bBlockUid
          self.posts = re.blockMinPosts
          self.grantedUsers = re.blockMinManagersList
        }).catch(e => {
          console.error(e)
        })
      },
      deletePost () {

      }
    }
  }
</script>

<style scoped>

</style>
