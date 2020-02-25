<template>
  <div>
    <div class="mdui-toolbar mdui-color-theme">
      <a @click="$emit('leftTopButtonClick')" href="javascript:;" class="mdui-btn mdui-btn-icon" ><i class="mdui-icon material-icons">{{iconname}}</i></a>
      <a href="javascript:;" class="mdui-typo-title">{{title}}</a>
      <div class="mdui-toolbar-spacer"></div>

      <!--      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>-->
      <!--      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>-->
      <!--      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></a>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TopHeaderBar',
    props: ['title', 'iconname']
  }
</script>

<style scoped>

</style>
