<template>
  <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed mdui-color-theme">
    <!-- <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed"> -->
    <!-- <div id="navigationBar" class="mdui-appbar"> -->
    <div class="mdui-toolbar">

      <a  class="mdui-btn mdui-btn-icon" v-show="this.$route.meta.appBar.showBack" @click.prevent="$router.back()"><i class="mdui-icon material-icons">arrow_back</i></a>
      <a href="javascript:;" class="mdui-typo-title" v-text="this.$route.meta.appBar.title"></a>
      <div class="mdui-toolbar-spacer"></div>


      <div  v-show="this.$route.meta.appBar.showSearch" class="mdui-textfield mdui-textfield-expandable mdui-float-right">
        <button class="mdui-textfield-icon mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></button>
        <input class="mdui-textfield-input" type="text" id="appBarSearchInput" placeholder="Search"/>
        <button class="mdui-textfield-close mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">close</i></button>
      </div>


<!--      <a href="javascript:;" id="appbarSearch" v-show="this.$route.meta.appBar.showSearch" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>-->
      <a href="javascript:;"  @click="$router.go(0)" v-show="this.$route.meta.appBar.showReload" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>
      <a href="javascript:;" v-show="this.$route.meta.appBar.showMore" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PostViewAppBar',
    data () {
      return {
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.body.classList.add("mdui-appbar-with-toolbar")
      })
    }
  }
</script>

<style scoped>

</style>
