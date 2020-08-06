<template>
  <div class="mdui-container">
    <div v-show="hasLoaded">
      <div id="content">
        <div v-if="blockbigs.length > 0" id="contentDoc"
             class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-xl-3  mdui-grid-list ">
          <div class="mdui-card mdui-col mdui-hoverable mdui-m-y-1 "
               v-for="(blockbig, index)  in blockbigs" :key="index"
          >
            <!--          <a :href="'/document/browse.html?postUid=' + block.postUid" class="docLink" style="display:none;"></a>-->
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <router-link tag="div" :to="'/userinfoother/' + blockbig.bBlockUser.userAccount">
              <div class="mdui-card-header">
                <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(blockbig.bBlockUser.userAvatar)"/>
                <!--        <img class="mdui-card-header-avatar" src="./user/avatar/default.jpg" />-->
                <!--        <img class="mdui-card-header-avatar" :src="post.postUser.userAvatar" />-->
                <div class="mdui-card-header-title">{{ blockbig.bBlockUser.userAccount }}</div>
                <div class="mdui-card-header-subtitle">{{ blockbig.bBlockCreatedTime | date-format }}</div>
              </div>
            </router-link>

            <router-link :to="globaRouterURL.BLOCKBIG_DETAIL + '/' + blockbig.bBlockUid" tag="div">
              <!-- 卡片的标题和副标题 -->
              <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">{{ blockbig.bBlockName }}</div>
              </div>

              <!-- 卡片的内容 -->
              <div class="mdui-card-content">{{ blockbig.bBlockDesc }}</div>
            </router-link>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">
              <button
                v-if="(blockbig.bBlockUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 4))"
                @click="$router.push(globaRouterURL.BLOCKBIG_UPDATE + '/' + blockbig.bBlockUid)"
                class="mdui-btn mdui-ripple">编辑
              </button>
              <button
                v-if="(blockbig.bBlockUser.userUid ===  loggedInuserUid  || (userProfile && userProfile.userPri.userPrivilegeId >= 4))"
                @click="deleteBlockBig(blockbig.bBlockName, blockbig.bBlockUid)" class="mdui-btn mdui-ripple">删除
              </button>
              <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                class="mdui-icon material-icons">expand_more</i>
              </button>
            </div>
          </div>
          <!--如果没有帖子-->
          <div v-if="!blockbigs.length">暂时没有帖子哈~</div>
        </div>

        <Indicator ref="indicator" @reqDataList="reqDataList" />
<!--        <div id="indicatorblockbig">-->
<!--        </div>-->
      </div>
      <button
        v-if="userProfile && userProfile.userPri.userPrivilegeId >= 4"
        class="mdui-fab mdui-color-theme-accent mdui-ripple mdui-fab-fixed mdui-m-b-4"
        @click="$router.push(globaRouterURL.BLOCKBIG_ADD)"
      ><i class="mdui-icon material-icons">add</i></button>

    </div>
    <div v-show="!hasLoaded" class="mdui-m-t-2">
      <div class="mdui-progress ">
        <div class="mdui-progress-indeterminate"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {blockBigList, delBlockBig} from '../../../api'
import {mapState} from 'vuex'
import mdui from 'mdui'
import Indicator from '../../Indicator'

const blockBigCurrentPageCode = 'blockBigCurrentPageCode'

export default {
  name: 'BlockBigList',
  components: {Indicator},
  mounted () {
    this.loadBlockBigs()
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
  data () {
    return {
      hasLoaded: false,
      loggedInuserPri: 1,
      searchInput: '',
      loggedInuserUid: null,
      blockbigs: []
    }
  },
  methods: {
    reqDataList ({currentPageCode, elementMaxSize, success, error}) {
      this.reqPosts(currentPageCode, elementMaxSize)
    },
    deleteBlockBig (name, uid) {
      const self = this
      mdui.dialog({
        title: '确认删除"' + name + '"吗?',
        buttons: [
          {
            text: '取消'
          },
          {
            text: '确认',
            onClick: function () {
              self.confirmDelete(uid)
            }
          }
        ]
      })
    },
    async confirmDelete (blockBigUid) {
      let post = await delBlockBig(blockBigUid)
      if (post.code === 0) {
        this.reqPosts(this.$refs.indicator.currentPageCode, this.$refs.indicator.elementMaxSize)
      }
    },
    loadBlockBigs () {
      this.hasLoaded = false
      this.reqPosts(this.$refs.indicator.currentPageCode, this.$refs.indicator.elementMaxSize)
    },
    async reqPosts (currentPageCode, elementMaxSize) {
      if (!currentPageCode) {
        currentPageCode = 1
      } else if (currentPageCode < 1) {
        currentPageCode = 1
      }
      sessionStorage.setItem(blockBigCurrentPageCode, currentPageCode)
      console.log('currentPageCode:', currentPageCode)

      let re = await blockBigList(this.searchInput, currentPageCode, elementMaxSize)
      this.hasLoaded = true
      console.log(re)
      if (re.code === 0) {
        console.log(re.code)
        // this.setResultPosts(re.data)
        this.$refs.indicator.currentPageCode = currentPageCode
        this.$refs.indicator.initIndicator(re.data)
        this.blockbigs = re.data.content
      } else {
        // this.$router.replace('/login')
      }
    }
  }
}
</script>

<style scoped>
#indicatorblockbig {
  display: flex;
  border: 1px solid black;
  justify-content: center;
  margin: 0 auto 50px auto;
}
</style>
