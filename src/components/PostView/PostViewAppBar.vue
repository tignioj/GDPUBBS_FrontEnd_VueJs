<template>
  <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed">
    <!-- <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed"> -->
    <!-- <div id="navigationBar" class="mdui-appbar"> -->
    <div class="mdui-toolbar mdui-color-theme">
      <a  class="mdui-btn mdui-btn-icon" @click.prevent="$router.back()"><i class="mdui-icon material-icons">arrow_back</i></a>
      <a href="javascript:;" class="mdui-typo-title">浏览帖子</a>
      <div class="mdui-toolbar-spacer"></div>
      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>
      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>
      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PostViewAppBar',
    mounted () {
      this.$nextTick(() => {
        document.body.classList.add("mdui-appbar-with-toolbar")
      })
    }
  }
</script>

<style scoped>

</style>
