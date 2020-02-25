<template>
  <div>
    <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed mdui-appbar-scroll-hide">
      <TopHeaderBar
        :title="'用户信息'"
        :iconname="'arrow_back'"
        v-on:leftTopButtonClick="$router.back()"
      />

    </div>


  </div>
</template>

<script>
  import TopHeaderBar from '../TopHeaderBar'


  export default {
    name: 'UserInfoTopBar',
    components: {TopHeaderBar},
    methods: {

    }
  }
</script>

<style scoped>

</style>
