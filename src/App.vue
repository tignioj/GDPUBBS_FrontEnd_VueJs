<template>
  <div id="app">
<!--    <NavigationBar v-show="$route.meta.showNavigationBar"/>-->
    <SideBar v-show="$route.meta.showSideBar"/>
<!--    <router-view/>-->

    <!--缓存想要缓存的页面，实现后退不刷新-->
    <!--加上v-if的判断，可以自定义想要缓存的组件，自定义在router里面-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>


    <Bottom v-show="$route.meta.showBottom"/>
  </div>
</template>

<script>
  import Bottom from './components/Bottom/Bottom.vue'

  import SideBar from "./components/SideBar/SideBar.vue"
  import {requserProfile} from './api'

  export default {
    components: {
      SideBar,
      Bottom
    },
    mounted () {
      this.getProfile()
    },
    methods: {
      async getProfile () {
        const result = await requserProfile('/login/userProfile')
        if (result.code === 0) {
          this.$store.dispatch('recordUser', result.data)
        }
      }
    }
  }
</script>
<style>

</style>
