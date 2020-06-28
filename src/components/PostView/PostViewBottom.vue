<template>

  <div id="bottomNav" class="mdui-bottom-nav  mdui-color-theme">
    <a href="javascript:void(0)" @click="openCommentEditor(true)" class="mdui-ripple mdui-ripple-white ">
      <i class="mdui-icon material-icons">edit</i>
      <label>回复</label>
    </a>
    <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">thumb_up</i>
      <label>点赞</label>
    </a>
    <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">star_border</i>
      <label>收藏</label>
    </a>
    <a href="javascript:void(0)" class="mdui-ripple mdui-ripple-white">
      <i class="mdui-icon material-icons">more_vert</i>
      <label>更多</label>
    </a>
  </div>

</template>

<script>
  export default {
    name: "PostViewBottom",
    methods: {
      goTo (path) {
        this.$router.replace(path)
      },
      openCommentEditor (isShow) {
        console.log('open replyer')
        this.$emit('showEditor', isShow)
      }
    },
    mounted () {
      document.body.classList.add("mdui-bottom-nav-fixed")
    }
  }
</script>

<style>

</style>

