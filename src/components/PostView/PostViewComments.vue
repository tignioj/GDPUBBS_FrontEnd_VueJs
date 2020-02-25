<template>
  <!-- 回复 -->
  <div class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">

    <div id="postComment" class="mdui-collapse" mdui-collapse>
      <div class="mdui-collapse-item  mdui-m-t-1" v-for="(postComment, index) in comments" :key="index">

        <div class="mdui-collapse-item-header">
          <div class="mdui-card">
            <!-- 卡片头部，包含头像、标题、副标题 -->
            <!--用户-->
            <div class="mdui-card-header">
              <!--评论者头像-->
              <img class="mdui-card-header-avatar" :src="myglobalfun.imgBaseUrl(postComment.postCommentFromuser.userAvatar)" />
              <div class="mdui-card-header-title">{{postComment.postCommentFromuser.userAccount}}</div>
              <!--评论日期-->
              <div class="mdui-card-header-subtitle">{{postComment.postCommentDate | date-format }}</div>
            </div>

            <!--评论图片-->
            <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
            <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
              <img  :src="myglobalfun.imgBaseUrl(postComment.postCommentImg)" v-if="postComment.postCommentImg" />
            </div>


            <!--评论内容-->
            <!-- 卡片的内容 -->
            <div class="mdui-card-content">{{postComment.postCommentContent}}</div>

            <!-- 卡片的按钮 -->
            <div class="mdui-card-actions">
              <button class="mdui-btn mdui-ripple">点赞{{postComment.postCommentGood}}</button>
              <button class="mdui-btn mdui-ripple">踩{{postComment.postCommentBad}}</button>
              <button class="mdui-btn mdui-ripple">评论{{postComment.postCommentReply.length}}</button>
              <button class="mdui-btn mdui-btn-icon mdui-float-right"><i class="mdui-icon material-icons">expand_more</i></button>
            </div>
          </div>
        </div>

<!--二级评论-->
        <PostViewCommentReply :replys="postComment.postCommentReply"/>
      </div>

    </div>
  </div>




</template>

<script>
  import {mapState} from 'vuex'
  import PostViewCommentReply from './PostViewCommentReply'
  export default {
    components: {PostViewCommentReply},
    props: ['apostUid'],
    name: 'PostViewComments',
    computed: {
      ...mapState(['comments'])
    },
    created () {
      /**
       * 创建后，马上请求一篇文章
       */
      const id = this.$route.params.id
      this.$store.dispatch('getcommentsbypostuid', {id: id,
        // 文章请求完成后，执行回调函数
        callback: () => {
          // 执行回调函数时, 此时页面尚未渲染，需要等待渲染完成后，再插入新的Dom
          this.$nextTick(() => {
          })
        }
      })
    }
  }
</script>

<style scoped>
  .my-img {
    width: 50% !important;
  }

  .my-img-rounded img {
    border-radius: 10px;
  }

  @media screen and (min-width: 600px) {
    .my-img {
      width: 60%;
    }
  }
  @media screen and (min-width: 768px) {
    .my-img {
      width: 50%;
    }
  }
</style>
