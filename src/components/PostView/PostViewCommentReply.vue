<template>
      <div class="mdui-collapse-item-body mdui-shadow-1 mdui-m-x-1">
        <div v-for="(commentReply,index) in comments" :key="index">

        <div class="mdui-card">
          <!-- 卡片头部，包含头像、标题、副标题 -->
          <div class="mdui-card-header">
            <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(commentReply.commentReplyFromuser.userAvatar)" />
            <div class="mdui-card-header-title">{{commentReply.commentReplyFromuser.userAccount}} 回复 {{commentReply.commentReplyTouser.userAccount}}</div>
            <div class="mdui-card-header-subtitle">{{commentReply.commentReplyDate | date-format }}</div>
          </div>
          <!-- 卡片的内容 -->
          <div class="mdui-card-content">{{commentReply.commentReplyContent}}</div>
        </div>
      </div>

    </div>

</template>

<script>
  import {mutation} from 'mdui'
  export default {
    props: ['replys'],
    name: 'PostViewCommentReply',
    data () {
      return {
        comments: []
      }
    },
    created () {
      this.comments = this.replys
    },
    mounted () {
        mutation()
    }
  }
</script>

<style scoped>

</style>
