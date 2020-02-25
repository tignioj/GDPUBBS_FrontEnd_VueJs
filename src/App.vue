<template>
  <div id="app">
<!--    <NavigationBar v-show="$route.meta.showNavigationBar"/>-->
    <SideBar v-show="$route.meta.showSideBar"/>
    <router-view/>
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
