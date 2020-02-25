<template>

    <!-- 抽屉 -->
    <div id="main-drawer" class="mdui-drawer mdui-drawer-close" >
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
        name: "SideBar",
      computed: {
        ...mapState(['indexcategory'])
      },
      created () {
          /* 创建之后，马上请求主页帖子分类信息和帖子信息 */
        this.$store.dispatch('getindexblocksbigs')
        this.$store.dispatch('getindexposts')
      },
      watch: {
          indexcategory () {
            /* 当帖子信息有数据之后，马上初始化当前数据 */
            this.$store.dispatch('changecurrentbigblock', this.indexcategory[0])
            this.$store.dispatch('changecurrentminblock', this.indexcategory[0].bBlockMblocks[0])
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
            this.$store.dispatch('changecurrentminblock', bigblock.bBlockMblocks[0])
          } else {
            this.$store.dispatch('changecurrentminblock')
          }
        }
      }
    }
</script>

<style>

</style>
