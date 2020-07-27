<template>
  <div>
    <PostsTopBar/>
    <PostList/>

    <!--      添加帖子按钮-->
    <div class="mdui-fab-wrapper mdui-m-b-5" id="fab">
      <button class="mdui-fab mdui-ripple mdui-color-pink-accent">
        <i class="mdui-icon material-icons">add</i>
        <i class="mdui-icon mdui-fab-opened material-icons">mode_edit</i>
      </button>
      <div class="mdui-fab-dial" style="height: 0px;">
        <button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-pink" style="transition-delay: 0ms;">
          <a class="mdui-color-theme"
             @click="$router.push('/post/add/')"
          ><i class="mdui-icon material-icons">add_circle_outline</i></a>
        </button>
        <button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-red" style="transition-delay: 15ms;"><i
          class="mdui-icon material-icons">bookmark</i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import PostsTopBar from '../../components/TopBar/PostsTopBar/PostsTopBar.vue'
  import PostList from '../../components/PostList/PostList.vue'
  import mdui, {Drawer} from 'mdui'

  export default {
    name: 'Posts',
    components: {
      PostList,
      PostsTopBar
    },
    mounted: function () {
      // globalfun.addBodyComponentClass()
      // 必须执行这个方法才会创建Fab的悬浮按钮
      // eslint-disable-next-line no-unused-vars
      let fab = new mdui.Fab('#fab')
    },
    // 点击后拿到数据返回给下单地址
    beforeRouteLeave (to, from, next) {
      if (to.name === 'home') {
        to.query.temp = '这里是参数，选中后的地址'
      }
      var inst = new Drawer('#main-drawer')
      inst.close()
      console.log(to)
      console.log(from)
      next() // 一定不要忘记写
    }
  }
</script>

<style scoped>

</style>
