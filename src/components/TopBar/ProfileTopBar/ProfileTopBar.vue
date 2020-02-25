<template>
  <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed mdui-appbar-scroll-hide">
    <TopHeaderBar
      :title="'用户'"
      :iconname="'menu'"
    />
  </div>
</template>

<script>
  import TopHeaderBar from '../TopHeaderBar'

  export default {
    name: 'ProfileTopBar',
    components: {TopHeaderBar}
  }
</script>

<style scoped>

</style>
