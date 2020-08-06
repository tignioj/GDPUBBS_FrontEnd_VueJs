<template>
  <div>
    <div class="mdui-toolbar mdui-color-theme">
      <a @click="$emit('leftTopButtonClick')" href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">{{ iconname }}</i></a>
      <a href="javascript:;" class="mdui-typo-title">{{ title }}</a>
      <div class="mdui-toolbar-spacer"></div>

      <!--      <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>-->
      <a href="javascript:;"  @click="$router.go(0)" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>
      <a @click="toggleDark()" v-if="!darkMode" href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">brightness_3</i></a>
      <a @click="toggleDark()" v-else href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">brightness_5</i></a>
    </div>
  </div>
</template>
<script>
const darkModeOrDayModeLocalStorageKey = 'darkModeOrDayModeLocalStorageKey'

export default {
  name: 'TopHeaderBar',
  props: ['title', 'iconname'],
  data () {
    return {
      darkMode: true
    }
  },
  methods: {
    toggleDark () {
      /* 默认是夜间，如果没有数据，则切换到日间模式 */
      let b = localStorage.getItem(darkModeOrDayModeLocalStorageKey)
      if (!b) {
        b = 'dark'
        this.darkMode = true
      }

      if (b === 'dark') {
        /* 切换到日间模式 */
        document.body.classList.remove('mdui-theme-layout-dark')
        document.body.classList.remove('mdui-theme-layout-auto')
        document.body.classList.add('mdui-theme-layout-light')
        localStorage.setItem(darkModeOrDayModeLocalStorageKey, 'light')
        this.darkMode = false
      } else {
        /* 切换到夜间模式 */
        document.body.classList.remove('mdui-theme-layout-light')
        document.body.classList.add('mdui-theme-layout-light')
        document.body.classList.add('mdui-theme-layout-auto')
        localStorage.setItem(darkModeOrDayModeLocalStorageKey, 'dark')
        this.darkMode = true
      }
    }
  }
}
</script>

<style scoped>

</style>
