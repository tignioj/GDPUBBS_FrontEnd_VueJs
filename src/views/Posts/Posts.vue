<template>
  <div>
    <PostsTopBar/>
    <PostList  ref="postlist"/>
    <!--      添加帖子按钮-->
    <div class="mdui-fab-wrapper mdui-m-b-5" id="fab">
      <button class="mdui-fab mdui-ripple mdui-color-theme" @click="$router.push('/post/add/')">
        <i class="mdui-icon material-icons">add</i>
      </button>
    </div>
  </div>
</template>
<script>
import PostsTopBar from '../../components/TopBar/PostsTopBar/PostsTopBar.vue'
import PostList from '../../components/PostList/PostList.vue'
import mdui from 'mdui'

export default {
  name: 'Posts',
  data () {
    return {
      fab: null,
      drawer: null
    }
  },
  components: {
    PostList,
    PostsTopBar
  },
  mounted () {
    // globalfun.addBodyComponentClass()
    // 必须执行这个方法才会创建Fab的悬浮按钮
    // eslint-disable-next-line no-unused-vars
    if (!this.fab) {
      this.fab = new mdui.Fab('#fab')
    }
    if (!this.drawer) {
      this.drawer = new mdui.Drawer('#main-drawer')
    }
  },
  activated () {
    this.myglobalfun.addBodyComponentClass()
    mdui.mutation()
  },
  // 点击后拿到数据返回给下单地址
  beforeRouteLeave (to, from, next) {
    if (to.name === 'home') {
      to.query.temp = '这里是参数，选中后的地址'
    }
    this.$refs.postlist.saveCurrentInfo()
    this.drawer && this.drawer.close()
    document.body.classList.remove('mdui-lcoked')
    next() // 一定不要忘记写
  }
}
</script>

<style scoped>

</style>
