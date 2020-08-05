<template>
  <div class="mdui-container">
    <ul id="indicator-tap">
      <li class="mdui-btn " style="width: 100%" v-for="(tab,index) in tabs" :key="index" @click="toggle(index)"
          :class="{'mdui-btn-active mdui-btn-bold':active==index}">
        {{ tab.type }}
      </li>
    </ul>
    <!--:is实现多个组件实现同一个挂载点-->
    <component v-if="loggedInuserUid" ref="component" :is="currentView"></component>

    <div class="mdui-typo mdui-text-center" v-else> 你还没有登录哦, <a @click="$router.push(globaRouterURL.LOGIN)">点击这里去登录 </a>
    </div>
  </div>
</template>

<script>
import MyCommentsToOthers from '../../components/Message/MyCommentsToOthers.vue'
import OthersCommentsToMe from '../../components/Message/OthersCommentsToMe.vue'
import {mapState} from 'vuex'

const currentTabKey = 'current_tab_key'

const myCommentsToOthersLocation = 'my_comments_to_others_location'
const myCommentsToOthersPageCode = 'my_comments_to_others_pagecode'

const otherCommentsToMeLocation = 'other_comments_to_me_location'
const otherCommentsToMePageCode = 'other_comments_to_me_pagecode'

export default {
  name: 'Message',
  components: {
    MyCommentsToOthers,
    OthersCommentsToMe
  },
  data () {
    return {
      loggedInuserUid: '',
      active: 0,
      currentView: MyCommentsToOthers,
      tabs: [
        {
          type: '我的回复',
          view: MyCommentsToOthers
        },
        {
          type: '回复我的',
          view: OthersCommentsToMe
        }
      ]
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
      }
    }
  },
  methods: {
    toggle (i) {
      this.active = parseInt(i)
      this.currentView = this.tabs[i].view
      sessionStorage.setItem(currentTabKey, i)
      sessionStorage.removeItem(otherCommentsToMeLocation)
      sessionStorage.removeItem(myCommentsToOthersLocation)

      sessionStorage.removeItem(myCommentsToOthersPageCode)
      sessionStorage.removeItem(otherCommentsToMePageCode)
    }
  },
  created () {
    this.myglobalfun.cleanTopTabCard()
    let tab = sessionStorage.getItem(currentTabKey)
    console.log(tab)
    if (tab !== null) {
      this.active = parseInt(tab)
      this.currentView = this.tabs[tab].view
    }
  },
  mounted () {
    if (this.userProfile !== '') {
      this.loggedInuserUid = this.userProfile.userUid
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.comonent !== undefined) {
      this.$refs.component.saveCurrentInfo()
    }
    next()
  }
}
</script>

<style scoped>

#indicator-tap {
  display: flex;
  padding: 0;
}
</style>
