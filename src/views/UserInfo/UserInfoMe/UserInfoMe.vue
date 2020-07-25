<template>
  <div>
<!--    <UserInfoTopBar-->
<!--      :user-profile="userProfile"-->
<!--    />-->

    <div class="mdui-container">
      <!-- 头像等信息 -->
      <div class="mdui-card mdui-hoverable mdui-m-t-2">
        <!-- 卡片头部，包含头像、标题、副标题 -->
        <div class="mdui-card-header">
          <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(userProfile.userAvatar)"/>
          <div class="mdui-card-header-title">
            {{userProfile.userAccount}}
            <span v-text="gender(userProfile.userGender)"></span>
          </div>
          <div class="mdui-card-header-subtitle" @click="$router.push('/userinfome/' + userProfile.userAccount)">
            {{userProfile.followToUser}} 关注
            {{userProfile.followToUser}} 粉丝
            {{userProfile.posts}} 帖子
          </div>
          <div class="mdui-card-menu" style="float:right">
            <div class="mdui-chip">
              <span class="mdui-chip-title">编辑资料</span>
            </div>
          </div>
        </div>

        <!-- 卡片的内容 -->
        <div class="mdui-card-content">{{userProfile.userDesc}}</div>
      </div>
    </div>

    <div>
      <div class="mdui-container mdui-p-t-2">
        <button @click="logout"
                class="mdui-btn mdui-color-theme mdui-btn-raised  mdui-btn-block mdui-color-theme-accent mdui-ripple">
          退出登陆
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {dialog} from 'mdui'
  import UserInfoTopBar from '../../../components/TopBar/UserInfoTopBar/UserInfoTopBar'
  import {mapState} from 'vuex'

  export default {
    name: 'UserInfoMe',
    components: {UserInfoTopBar},
    data () {
      return {
        imgSrc: ''
      }
    },
    computed: {
      ...mapState(['userProfile'])
    },
    methods: {
      /**
       * 返回性别对应的符号
       */
      gender (genderText) {
        if (genderText === '男') {
          return "🚹"
        } else if (genderText === '女') {
          return "🚺"
        } else {
          return ""
        }
      },
      logout () {
        dialog({
          title: '退出登陆吗',
          buttons: [
            {
              text: '取消'
            },
            {
              text: '确认',
              onClick: this.backToProfile
            }
          ]
        })
      },
      /**
       * 退出登陆
       */
      backToProfile () {
        console.log('退出登陆了')
        this.$store.dispatch('logout')

        // 由于mdui的对话框弹出时会更改路由，因此需要等其关闭后再重新更改路由
        setTimeout(() => {
          this.$router.push('/profile')
          let path = this.$route.path
          console.log(path)
        }, 100)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.myglobalfun.cleanTopTabCard()
      })
    }
  }


</script>

<style scoped>

</style>
