<template>
  <div class="mdui-container">
    <ul id="indicator-tap">
      <li class="mdui-btn " style="width: 100%" v-for="(tab,index) in tabs" :key="index" @click="toggle(index)"
          :class="{'mdui-btn-active mdui-btn-bold':active==index}">
        {{ tab.type }}
      </li>
    </ul>
    <!--:is实现多个组件实现同一个挂载点-->
    <component ref="component" :is="currentView"></component>
  </div>
</template>

<script>
import MyCommentsToOthers from '../../components/Message/MyCommentsToOthers.vue'
import OthersCommentsToMe from '../../components/Message/OthersCommentsToMe.vue'

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
  methods: {
    toggle (i) {
      this.active = i
      this.currentView = this.tabs[i].view
      sessionStorage.setItem(currentTabKey, i)
      sessionStorage.removeItem(otherCommentsToMeLocation)
      sessionStorage.removeItem(myCommentsToOthersLocation)

      sessionStorage.removeItem(myCommentsToOthersPageCode)
      sessionStorage.removeItem(otherCommentsToMePageCode)
    }
  },
  mounted () {
    this.myglobalfun.cleanTopTabCard()
    let tab = sessionStorage.getItem(currentTabKey)
    console.log(tab)
    if (tab !== null) {
      this.active = tab
      this.currentView = this.tabs[tab].view
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$refs.component.saveCurrentInfo()
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
