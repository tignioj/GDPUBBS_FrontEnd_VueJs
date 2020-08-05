<template>
  <div>
    <div id="img-header-div" v-if="this.base64Img">
      <img class="img-header" :src="this.base64Img"/>
    </div>
    <div class="mdui-container">
      <h1 v-text="this.title"></h1>
      <!-- 内容 -->
      <div id="postContent" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1"
           v-html="this.content">
      </div>

    </div>
  </div>

</template>

<script>
  export default {
    name: 'PostAddPreview',
    data () {
      return {
        content: '',
        base64Img: null,
        title: ''
      }
    },
    beforeCreate () {
      console.log('beforeCreate')
    },
    beforeUpdate () {
      console.log('beforeUpdate')
    },
    updated () {
      console.log('preview update')
    },
    activated () {
      console.log('preview activated')
      // this.myglobalfun.cleanBodyComponentClass()
      // this.title = this.$route.params.title
      // this.content = this.parseMd(this.$route.params.content)
      // debugger
      // console.log(this.title, this.content)
      // this.base64Img = this.$route.params.base64Img
    },
    deactivated () {
      console.log('preview deactivated')
    },
    mounted () {
      this.myglobalfun.cleanTopTabCard()
      console.log(' preview mounted')
      this.title = this.$route.params.title
      this.content = this.parseMd(this.$route.params.content)
      console.log(this.title, this.content)
      this.base64Img = this.$route.params.base64Img
    },
    beforeMount () {
      console.log('beforemount')
    },
    beforeDestroy () {
      console.log('beforeDestroy')
    },
    destroyed () {
      console.log('destroyed')
    },
    methods: {
      /**
       * 解析markDown文字成html
       */
      parseMd (mdText) {
        // this.initMarkDownOption()
        return this.md.markdownParse(mdText)
      }
    }
  }
</script>

<style scoped>
  #img-header-div{
    height: 100px;
    width: 100%;
  }
  .img-header {
    z-index: -1;
    height: auto;
    position: absolute;
    max-width: 100%;
    min-width: 100%;
  }
</style>
