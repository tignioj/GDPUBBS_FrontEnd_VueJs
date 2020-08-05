<template>
  <div v-if="blockbigDetail">
    <div class="mdui-container">
      <h1>{{blockbigDetail.bBlockName}}</h1>
      <div>
        <ul class="mdui-list">
          <li class="mdui-list-item mdui-ripple">创建者: {{blockbigDetail.bBlockUser.userAccount}}</li>
          <li class="mdui-list-item mdui-ripple">创建时间：{{blockbigDetail.bBlockCreatedTime | date-format}}</li>
          <li class="mdui-list-item mdui-ripple">描述: {{blockbigDetail.bBlockDesc}}</li>
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
        @click="$router.push(globaRouterURL.BLOCKMIN_LIST + '/' + blockbigDetail.bBlockUid + '?bbname=' + blockbigDetail.bBlockName)"
      >查看所有小板块</button>

      <BlockMinList v-if="blockbigDetail" :blockbigDetail="blockbigDetail" />


      <div v-if="blockMins.length > 0"
           class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
        <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 "
             v-for="(bm, index)  in blockMins" :key="index"
        >
          <!--          <a :href="'/document/browse.html?postUid=' + block.postUid" class="docLink" style="display:none;"></a>-->
          <!-- 卡片头部，包含头像、标题、副标题 -->
          <router-link tag="div" :to="'/userinfoother/' + bm.blockMinUser.userAccount">
            <div class="mdui-card-header">
              <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(bm.blockMinUser.userAvatar)"/>
              <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
              <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
              <div class="mdui-card-header-title">{{bm.blockMinUser.userAccount}}</div>
              <div class="mdui-card-header-subtitle">{{bm.blockMinCreatedTime | date-format}}</div>
            </div>
          </router-link>

          <router-link :to="globaRouterURL.BLOCKMIN_DETAIL + '/' + bm.blockMinUid" tag="div">
            <!-- 卡片的标题和副标题 -->
            <div class="mdui-card-primary">
              <div class="mdui-card-primary-title">{{bm.blockMinName}}</div>
            </div>

            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{bm.blockMinDesc}}</div>
          </router-link>

          <!-- 卡片的按钮 -->
          <div class="mdui-card-actions">
            <button
              v-if="(bm.blockMinUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 3))"
              @click="$router.push(globaRouterURL.BLOCKMIN_UPDATE+ '/' + bm.blockMinUid)"
              class="mdui-btn mdui-ripple">编辑
            </button>
            <button
              v-if="(bm.blockMinUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 3))"
              @click="deleteBlockMin(bm.blockMinName, bm.blockMinUid)" class="mdui-btn mdui-ripple">删除
            </button>
            <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i>
            </button>
          </div>
        </div>


        <!--如果没有帖子-->
        <div v-if="blockMins.length === 0">暂时没有帖子哈~</div>
      </div>

    </div>
  </div>
</template>

<script>
  import {reqBlockDetail} from '../../../api'
  import {mapState} from 'vuex'
  import BlockMinList from '../BlockMin/BlockMinList'

  export default {
    name: 'BlockBigDetail',
    components: {BlockMinList},
    data () {
      return {
        loggedInuserUid: '',
        blockbigDetail: null,
        blockMins: [],
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
      this.loadBlockBigDetails(id)
    },
    methods: {
      loadBlockBigDetails (uid) {
        const self = this
        reqBlockDetail(uid).then(re => {
          console.log(re)
          self.blockbigDetail = re
          self.blockMins = re.bBlockMblocks
          self.grantedUsers = re.blockBigManagersList
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>

<style scoped>
#indicator {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
