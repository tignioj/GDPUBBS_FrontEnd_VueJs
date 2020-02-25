<template>
  <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed mdui-appbar-scroll-hide">
    <TopHeaderBar
      :title="'登陆'"
      :iconname="'arrow_back'"
      v-on:leftTopButtonClick="$router.back()"
    />
  </div>
</template>

<script>
  import TopHeaderBar from '../TopHeaderBar'
  export default {
    name: 'LoginTopBar',
    components: {TopHeaderBar},
    mounted () {
      /**
       * 这样可以包装每次刷新都重新执行一次这个方法
       */
      this.$nextTick(() => {
        this.myglobalfun.cleanTopTabCard()
      })
    }
  }
</script>

<style scoped>

</style>
