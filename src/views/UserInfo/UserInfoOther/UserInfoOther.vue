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
          <div class="mdui-card-header-subtitle">
            {{userProfile.followToUser}} 关注
            {{userProfile.followToUser}} 粉丝
            {{userProfile.posts}} 帖子
          </div>
          <div class="mdui-card-menu" style="float:right">
            <div class="mdui-chip">
              <span class="mdui-chip-title">关注</span>
            </div>
          </div>
        </div>

        <!-- 卡片的内容 -->
        <div class="mdui-card-content">{{userProfile.userDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserInfoTopBar from '../../../components/TopBar/UserInfoTopBar/UserInfoTopBar'
  import {reqOtherUserProfile} from '../../../api'

  export default {
    name: 'UserInfoOther',
    components: {UserInfoTopBar},
    data () {
      return {
        profile: ''
      }
    },
    computed: {
      userProfile () {
        return this.profile
      }
    },
    methods: {
      async reqProfile () {
        const params = this.$route.params
        console.log(params.id)
        let result = await reqOtherUserProfile(params.id)
        if (result.code === 0) {
          this.profile = result.data
        }
      },
      /**
       * 返回性别对应的符号
       */
      gender (genderText) {
        if (genderText === '男') {
          return '🚹'
        } else if (genderText === '女') {
          return '🚺'
        } else {
          return ''
        }
      }
    },
    created () {
      this.reqProfile()
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
