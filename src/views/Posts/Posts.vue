<template>
    <div>
      <PostsTopBar/>
      <PostList/>
    </div>
</template>
<script>
  import PostsTopBar from '../../components/TopBar/PostsTopBar/PostsTopBar.vue'
  import PostList from '../../components/PostList/PostList.vue'
  export default {
    name: 'Posts',
    components: {
      PostList,
      PostsTopBar
    },
    mounted () {
      // globalfun.addBodyComponentClass()
    }
  }
</script>

<style scoped>

</style>
