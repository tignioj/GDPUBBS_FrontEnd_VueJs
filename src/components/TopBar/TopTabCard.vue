<template>
  <div>

    <div class="mdui-tab mdui-color-theme" mdui-tab>
      <a href="#posts" class="mdui-ripple mdui-ripple-white myclass"
         v-for="(mblock, index) in currentbigblock.bBlockMblocks" :key="index"
         :class="{'mdui-tab-active': currentminblock.blockMinName == mblock.blockMinName}"
         @click="$emit('changeMinBlock', mblock)"
      >
        <!-- <i class="mdui-icon material-icons">free_breakfast</i> -->
        <i class="mdui-icon material-icons">brightness_2</i>
        <label>{{mblock.blockMinName}}</label>
      </a>
      <a v-if="!currentminblock" href="javascript:void(0)" class="mdui-ripple mdui-ripple-white">
        <i class="mdui-icon material-icons">favorite</i>
        <label>此处暂时没有版块哈~ </label>
      </a>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'TopTabCard',
    props: ['currentbigblock', 'currentminblock']
  }
</script>

<style scoped>

</style>
