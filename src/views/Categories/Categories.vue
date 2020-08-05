<template>
  <div>
    <!--        分类-->
    <div class="mdui-container">
      <h1>分类查询帖子</h1>
      <div>
        <div id="categoryBB">
          <span>大板块：</span>
          <select @change="bigSelectionChange" class="mdui-select" id="blockBigSelect">
            <!--          <option v-if="this.blockBigUid.trim().length > 0" selected>请选择大板块</option>-->
            <option value="" selected>查询所有</option>
            <option
              :value="category.bBlockUid"
              v-for="(category, index)  in this.categories" :key="index"
            >{{ category.bBlockName }}
            </option>
          </select>
        </div>
        <div id="categoryBM">
          <span>小板块：</span>
          <select @change="minSelectionChange" class="mdui-select" id="blockMinSelect"
          >
            <option value="" selected>查询所有</option>
            <option :value="blockMin.blockMinUid"
                    v-for="(blockMin, index)  in this.blockMinOptionsArr" :key="index"
            >{{ blockMin.blockMinName }}
            </option>
          </select>
        </div>
      </div>
      <div class="mdui-textfield">
        <input v-model="searchInput" class="mdui-textfield-input" type="text" placeholder="支持检索帖子内容和用户名"/>
      </div>
      <div class="mdui-col">
        <button @click="search" class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">搜索</button>
      </div>
    </div>

    <div class="mdui-container">
      <h1>所有大板块</h1>
    </div>
    <BlockBigList/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
// import mdui from 'mdui'
import {mutation, Select} from 'mdui/dist/js/mdui'
import BlockBigList from '../../components/Category/BlockBig/BlockBigList'

export default {
  name: 'Categories',
  components: {BlockBigList},
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
    'indexcategory': {
      deep: true,
      handler (val) {
        this.initCategory(val)
      }
    }
  },
  mounted () {
    this.myglobalfun.cleanTopTabCard()
    this.initCategory(this.indexcategory)
  },
  data () {
    return {
      searchInput: '',
      blockMinUid: '',
      blockBigUid: '',
      categories: [],
      blockMinOptionsArr: [],

      // mdui对象，可以不用管
      bm: null,
      bb: null
      // mdui对象结束
    }
  },
  methods: {
    initCategory (categories) {
      if (categories.length === 0) {
        return
      }
      this.categories = categories
      const self = this
      if (self.bb == null) {
        this.$nextTick(() => {
          let bbELe = document.getElementById('blockBigSelect')
          self.bb = new Select(bbELe)
        })
      }
      if (self.bm == null) {
        this.$nextTick(() => {
          self.bm = new Select(document.getElementById('blockMinSelect'))
        })
      }
      mutation()
    },
    bigSelectionChange (e) {
      const self = this
      console.log(e)
      let ele = document.getElementById('blockBigSelect')
      let options = ele.options
      let selectedIndex = options.selectedIndex
      let value = options[selectedIndex].value
      this.blockBigUid = value
      this.blockMinUid = ''
      document.getElementById('blockMinSelect').options.selectedIndex = 0

      let hasChange = false
      for (let i = 0; i < this.indexcategory.length; i++) {
        if (this.indexcategory[i].bBlockUid === value) {
          this.blockMinOptionsArr = this.indexcategory[i].bBlockMblocks
          hasChange = true
          break
        }
      }
      if (!hasChange) {
        this.blockMinOptionsArr = []
      }
      mutation()
      console.log(this.blockMinOptionsArr)
      // 对象没有就创建，有就更新数据，一定要在$nextTick中更新，否则无效
      // 因为实际上，调用了mutation之后，才会执行$nextTick方法
      this.$nextTick(() => {
        self.bm.handleUpdate()
      })
    },
    minSelectionChange (e) {
      let ele = document.getElementById('blockMinSelect')
      if (ele != null) {
        let options = ele.options
        let selectedIndex = options.selectedIndex
        let value = options[selectedIndex].value
        this.blockMinUid = value
      }
    },
    search () {
      const self = this
      console.log('search..')
      // this.$router.push({
      //   name: 'SearchResult',
      //   params: {
      //     searchInput: self.searchInput,
      //     blockBigUid: self.blockBigUid,
      //     blockMinUid: self.blockMinUid
      //   }
      // })
      this.$router.push({
        path: this.globaRouterURL.CATEGORIES_RESULT,
        query: {
          searchInput: self.searchInput,
          blockBigUid: self.blockBigUid,
          blockMinUid: self.blockMinUid
        }
      })
    }
  }
}
</script>

<style scoped>

/*#categoryDiv {*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  justify-content: space-around;*/
/*}*/
</style>
