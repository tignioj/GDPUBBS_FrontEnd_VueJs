<template>
  <div>
<!--    <ProfileTopBar/>-->
    <div v-if="userProfile">
      <!-- 内容 -->
      <div class="mdui-container">
        <!-- 头像等信息 -->
        <div class="mdui-card mdui-hoverable mdui-m-t-2">
          <!-- 卡片头部，包含头像、标题、副标题 -->
          <div class="mdui-card-header">
            <img  class="mdui-card-header-avatar" :src="userProfile.userAvatar"/>

            <div class="mdui-card-header-title">{{userProfile.userAccount}}[{{userProfile.userPri.userPrivilegeDesc}}]</div>
            <div class="mdui-card-header-subtitle" @click="$router.push('/userinfome/' + userProfile.userAccount)">
              查看主页或编辑资料
            </div>
            <div class="mdui-card-menu" style="float:right">
              <button class="mdui-btn mdui-btn-icon mdui-text-color-grey"><i class="mdui-icon material-icons">keyboard_arrow_right</i>
              </button>
            </div>
          </div>

          <!-- 卡片的内容 -->
          <div class="mdui-card-content">{{userProfile.userDesc}}</div>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <div class="mdui-row-xs-3">
              <div class="mdui-col">
                <!-- 在此处的标签居中必须搭配text-align:center和mdui-center -->
                <span class="mdui-center" style="text-align: center">{{userProfile.followToUser}}</span>
                <button class="mdui-btn mdui-btn-block  mdui-ripple">关注</button>
              </div>
              <div class="mdui-col">
                <span class="mdui-center" style="text-align: center">{{userProfile.followToUser}}</span>
                <button class="mdui-btn mdui-btn-block  mdui-ripple">粉丝</button>
              </div>
              <div class="mdui-col">
                <span class="mdui-center" style="text-align: center">{{userProfile.posts}}</span>
                <button class="mdui-btn mdui-btn-block  mdui-ripple"
                        @click="$router.push(globaRouterURL.MY_POSTS)">
                  帖子</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能分类 -->
      <div id="funCategory" class="mdui-container mdui-m-t-1">
        <div class="mdui-tab mdui-tab-full-width mdui-color-transparent" mdui-tab>
          <a href="#example6-tab1" class="mdui-ripple ">
            <i class="mdui-icon material-icons">favorite</i>
            <label>我的关注</label>
          </a>
          <a href="#example6-tab2" class="mdui-ripple">
            <i class="mdui-icon material-icons">star</i>
            <label>我的收藏</label>
          </a>
          <a href="#example6-tab3" class="mdui-ripple">
            <i class="mdui-icon material-icons">notifications</i>
            <label>我的消息</label>
          </a>
          <a href="#example6-tab3" class="mdui-ripple">
            <i class="mdui-icon material-icons">perm_contact_calendar</i>
            <label>黑名单</label>
          </a>
        </div>
        <div class="mdui-tab mdui-tab-full-width mdui-color-theme-0" mdui-tab>
          <a href="#example6-tab1" class="mdui-ripple">
            <i class="mdui-icon material-icons">format_paint</i>
            <label>主题风格</label>
          </a>
          <a href="#example6-tab2" class="mdui-ripple">
            <i class="mdui-icon material-icons">brightness_medium</i>
            <label>夜间模式</label>
          </a>
          <a href="#example6-tab3" class="mdui-ripple">
            <i class="mdui-icon material-icons">insert_photo</i>
            <label>我的相册</label>
          </a>
          <a href="#example6-tab3" class="mdui-ripple">
            <i class="mdui-icon material-icons">settings</i>
            <label>更多设置</label>
          </a>
        </div>

        <!--        管理-->

        <div v-if="userProfile !== ''" class="mdui-row mdui-row-gapless">
          <div class="mdui-col-xs-3 mdui-center" v-if="userProfile.userPri.userPrivilegeId >= 5">
            <div class="mdui-tab mdui-tab-full-width mdui-color-theme-0" mdui-tab>
              <a @click="$router.push('/privilege/list')" href="#example6-tab2" class="mdui-ripple">
                <i class="mdui-icon material-icons">assignment_ind</i>
                <label>权限管理</label>
              </a>
            </div>
          </div>


          <div class="mdui-col-xs-3 mdui-center" v-if="userProfile.userPri.userPrivilegeId >= 4" >
            <div class="mdui-tab mdui-tab-full-width mdui-color-theme-0" mdui-tab>
              <a @click="$router.push('/blockbig/list')" href="#example6-tab2" class="mdui-ripple">
                <i class="mdui-icon material-icons">web</i>
                <label>管理大板块</label>
              </a>
            </div>
          </div>

          <div class="mdui-col-xs-3 mdui-center" v-if="userProfile.userPri.userPrivilegeId >= 3">
            <div class="mdui-tab mdui-tab-full-width mdui-color-theme-0" mdui-tab>
              <a @click="$router.push('/blickmin/list')" href="#example6-tab2" class="mdui-ripple">
                <i class="mdui-icon material-icons">dashboard</i>
                <label>管理小板块</label>
              </a>
            </div>
          </div>

          <div class="mdui-col-xs-3 mdui-center" v-if="userProfile.userPri.userPrivilegeId >= 2">
            <div class="mdui-tab mdui-tab-full-width mdui-color-theme-0" mdui-tab>
              <a @click="$router.push(globaRouterURL.POST_MANAGE)" href="#example6-tab2" class="mdui-ripple">
                <i class="mdui-icon material-icons">apps</i>
                <label>管理帖子</label>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
    <div class="mdui-container mdui-p-t-2" v-else>
      <button @click="$router.push(globaRouterURL.LOGIN)"
              class="mdui-btn mdui-color-theme mdui-btn-raised  mdui-btn-block mdui-color-theme-accent mdui-ripple">
        点击登陆
      </button>
    </div>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import {mutation} from 'mdui/dist/js/mdui'
  import ProfileTopBar from '../../components/TopBar/ProfileTopBar/ProfileTopBar'

  export default {
    name: 'Profile',
    components: {ProfileTopBar},
    computed: {
      ...mapState(['userProfile'])
    },
    mounted () {
      mutation()
      this.myglobalfun.cleanTopTabCard()
      console.log(this.userProfile)
    }
  }
</script>

<style scoped>

</style>
