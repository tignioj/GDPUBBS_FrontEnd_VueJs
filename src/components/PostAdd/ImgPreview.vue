<template>
    <div>
      <div class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img id="img" :src="this.aimg" />
              <div class="mdui-card-menu">
                <!-- 删除图片按钮 -->
                <button id="deleteImg" class="mdui-btn mdui-btn-icon mdui-text-color-white"><i
                  class="mdui-icon material-icons">close</i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'ImgPreview',
    props: ['imgdata'],
    data () {
      this.aimg = this.imgdata
    }
  }
</script>

<style scoped>

</style>
