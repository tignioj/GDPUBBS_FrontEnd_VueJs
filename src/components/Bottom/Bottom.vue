<template>

    <!-- 底部 -->
    <div class="mdui-bottom-nav  mdui-bottom-nav-text-auto mdui-color-theme">
        <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white" :class="{'mdui-bottom-nav-active': this.$route.path === '/posts'}" @click="goTo('/posts')">
            <i class="mdui-icon material-icons">home</i>
            <label>首页</label>
        </a>
        <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white" :class="{'mdui-bottom-nav-active': this.$route.path === '/categories'}"  @click="goTo('/categories')">
          <i class="mdui-icon material-icons">search</i>
            <label>搜帖</label>
        </a>
        <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white" :class="{'mdui-bottom-nav-active': this.$route.path === '/messages'}"  @click="goTo('/messages')">
            <i class="mdui-icon material-icons">message</i>
            <label>消息</label>
        </a>
        <a href="javascript:void(0);" class="mdui-ripple mdui-ripple-white" :class="{'mdui-bottom-nav-active': this.$route.path === '/profile'}"  @click="goTo('/profile')">
            <i class="mdui-icon material-icons">account_circle</i>
            <label>个人</label>
        </a>
    </div>

</template>

<script>
  export default {
      name: "Bottom",
      methods: {
          goTo (path) {
              this.$router.replace(path)
          }
      }
  }
</script>

<style>

</style>

