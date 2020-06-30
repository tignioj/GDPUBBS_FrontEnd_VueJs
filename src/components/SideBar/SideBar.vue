<template>

  <!-- 抽屉 -->
  <div id="main-drawer" class="mdui-drawer mdui-drawer-close">
    <ul class="mdui-list">
      <li class="mdui-subheader">所有版块</li>
      <li class="mdui-list-item mdui-ripple"
          v-for="(bigblock, index) in indexcategory" :key="index"
          @click="changeBigBlock(bigblock)"
      >
        <i class="mdui-list-item-icon mdui-icon material-icons">move_to_inbox</i>
        <div class="mdui-list-item-content">{{bigblock.bBlockName}}</div>
      </li>
      <li class="mdui-subheader">Subheader</li>
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">delete</i>
        <div class="mdui-list-item-content">Trash</div>
      </li>
      <li class="mdui-list-item mdui-ripple">
        <i class="mdui-list-item-icon mdui-icon material-icons">error</i>
        <div class="mdui-list-item-content">Spam</div>
      </li>
    </ul>
  </div>

</template>

<script>
  import {mutation} from 'mdui/dist/js/mdui'
  import {mapState} from 'vuex'

  export default {
    name: 'SideBar',
    computed: {
      ...mapState(['indexcategory'])
    },
    created () {
      /* 创建之后，马上请求主页帖子分类信息和帖子信息 */
      // 请求大板块
      this.$store.dispatch('getindexblocksbigs')
      // this.$store.dispatch('getindexposts')
    },
    watch: {
      indexcategory () {
        /* 当帖子信息有数据之后，马上初始化当前数据 */
        // 先从localStorage拿，看下有没有当前minblocks
        let currentBigBlockIndex = localStorage.getItem('currentBigBlockIndex')
        currentBigBlockIndex = (currentBigBlockIndex === null ? 0 : currentBigBlockIndex)
        // 设置当前bigblock数据
        let bb = this.indexcategory[currentBigBlockIndex]
        this.$store.dispatch('changecurrentbigblock', bb)
        // 设置当前minblock数据

        let currentMinBlockIndex = localStorage.getItem('currentMinBlockIndex')
        currentMinBlockIndex = (currentMinBlockIndex === null ? 0 : currentMinBlockIndex)
        let bm = this.indexcategory[currentBigBlockIndex].bBlockMblocks[currentMinBlockIndex]
        this.$store.dispatch('changecurrentminblock', bm)

        // this.$store.dispatch('getPostsByMinBlockUid', {
        //     currentblockuid: bm.blockMinUid,
        //     pagecode: 1,
        //     pagesize: 3
        //   }
        // )
      }
    },
    mounted () {
      /* 重新渲染mdui组件 */
      mutation()
    },
    methods: {
      changeBigBlock (bigblock) {
        /* 更改数据 */
        this.$store.dispatch('changecurrentbigblock', bigblock)
        if (bigblock.bBlockMblocks.length !== 0) {
          let bb = bigblock.bBlockMblocks[0]
          this.$store.dispatch('changecurrentminblock', bb)
        } else {
          this.$store.dispatch('changecurrentminblock')
        }
      }
    }
  }
</script>

<style>

</style>
