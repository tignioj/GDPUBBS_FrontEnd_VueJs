<template>
  <!-- 导航栏 -->
  <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed mdui-appbar-scroll-hide">
    <!-- <div id="navigationBar" class="mdui-appbar mdui-appbar-fixed"> -->
    <!-- <div id="navigationBar" class="mdui-appbar"> -->
    <TopHeaderBar
      :title="currentbigblock.bBlockName"
      :iconname="'menu'"
      v-on:leftTopButtonClick="toggleSideBar"
    />

    <TopTabCard
      :currentbigblock="currentbigblock"
      :currentminblock="currentminblock"
      v-on:changeMinBlock="changeMinBlock"
    />

  </div>
</template>

<script>
import mdui from 'mdui'
import {mapState} from 'vuex'
import TopTabCard from '../TopTabCard'
import TopHeaderBar from '../TopHeaderBar'

const postsCurrentPageCode = 'key_current_page_code_in_postlist'
const postsReadingLocation = 'posts_readingLocation'
const postsSearchText = 'posts_searchText'


export default {
  name: 'PostsTopBar',
  components: {TopHeaderBar, TopTabCard},
  computed: {
    // 把状态属性拿来，如果属性变化，则相应的数据也会变化
    ...mapState(['currentbigblock', 'currentminblock', 'indexcategory'])
  },
  created () {
    /* 初始化数据 */
    /* 改变全局状态 */
    // this.$store.dispatch('changecurrentbigblock', this.indexcategory[0])
    /* 改变全局状态 */
    // this.$store.dispatch('changecurrentminblock', this.indexcategory[0].bBlockMblocks[0])
  },
  mounted () {
    /* 重新渲染mdui组件 */
    mdui.mutation()
  },
  watch: {
    /* 监听大板块数据变化 */
    currentbigblock () {
      mdui.mutation()
    },
    /* 监听小板块数据变化 */
    currentminblock (value) {
      // console.log(value)
      // if (typeof (currentminblock) === "undefined") {
      // }
      /* mdui的一个bug，删掉该指示器 */
      this.$nextTick(() => {
        let e = document.getElementsByClassName('mdui-tab-indicator')
        if (typeof (e) !== 'undefined' && typeof (e[0]) !== 'undefined') {
          try {
            e[0].parentNode.removeChild(e[0])
          } catch (e) {
          }
        }
      })
      mdui.mutation()
    }
  },
  methods: {
    removeCurrentPostsInfo () {
      sessionStorage.removeItem(postsReadingLocation)
      sessionStorage.removeItem(postsSearchText)
      sessionStorage.removeItem(postsCurrentPageCode)
    },
    changeMinBlock (mblock) {
      this.removeCurrentPostsInfo()
      this.$store.dispatch('changecurrentminblock', mblock)
    },
    toggleSideBar () {
      var inst = new mdui.Drawer('#main-drawer')
      inst.toggle()
    }
  }
}

</script>

<style>

</style>
