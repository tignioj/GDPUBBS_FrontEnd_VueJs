<template>
  <div>
    <div id="img-header-div" v-if="this.base64Img">
      <img class="img-header" :src="this.base64Img"/>
    </div>
    <div class="mdui-container">
      <h1 v-text="this.title"></h1>
      <!-- 内容 -->
      <div class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-3 mdui-p-y-1">
        <video v-if="this.videoLink" class="mdui-center" style="max-width: 100%" :src="this.videoLink"
               controls="controls"></video>
        <audio v-if="this.musicLink" style="width: 100%" :src="this.musicLink" controls="controls">
        </audio>
        <div class="mdui-m-t-2" v-html="this.contentHTML">

        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'PostAddPreview',
  data () {
    return {
      contentHTML: '',
      base64Img: null,
      title: '',
      musicLink: '',
      videoLink: ''
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
  },
  deactivated () {
    console.log('preview deactivated')
  },
  mounted () {
    this.myglobalfun.cleanTopTabCard()
    console.log(' preview mounted')
    this.title = this.$route.params.title
    this.videoLink = this.$route.params.videoLink
    this.musicLink = this.$route.params.musicLink
    this.contentHTML = this.parseMd(this.$route.params.content)
    console.log(this.title, this.contentHTML)
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
#img-header-div {
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
