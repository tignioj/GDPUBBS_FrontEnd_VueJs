<template>
  <div>
    <div>
      <!-- 回复 -->
      <div v-if="othersCommentsToMe.length >0" class="mdui-card mdui-hoverable mdui-m-t-1 mdui-p-x-1 mdui-p-y-1">
        <div id="postComment" class="mdui-collapse" mdui-collapse>
          <div class="mdui-collapse-item  mdui-m-t-1" v-for="(comment, index) in othersCommentsToMe" :key="index"
               @click="comment.postCommentPost?goToPost(comment.postCommentPost.postUid, comment.postCommentPlace):''"

          >
            <div class="mdui-collapse-item-header">
              <div class="mdui-card">
                <!-- 卡片头部，包含头像、标题、副标题 -->
                <!--用户-->
                <div class="mdui-card-header">
                  <!--评论者头像-->
                  <img class="mdui-card-header-avatar"
                       :src="myglobalfun.imgBaseUrl(comment.postCommentFromuser.userAvatar)"/>
                  <div class="mdui-card-header-title"
                  >
                    {{comment.postCommentFromuser.userAccount}}
                    回复帖子:
                    {{comment.postCommentPost?comment.postCommentPost.postTitle : '帖子已删除'}}
                  </div>
                  <!--评论日期-->
                  <div class="mdui-card-header-subtitle">{{comment.postCommentDate | date-format }}</div>
                </div>

                <!--评论图片-->
                <!-- 卡片的媒体内容，可以包含图片、视频等媒体内容，以及标题、副标题 -->
                <div class="mdui-card-media mdui-m-l-2 my-img my-img-rounded">
                  <img :src="myglobalfun.imgBaseUrl(comment.postCommentImg)"
                       v-if="comment.postCommentImg"/>
                </div>

                <!--评论内容-->
                <!-- 卡片的内容 -->
                <div class="mdui-card-content">{{comment.postCommentContent}}</div>

                <!-- 卡片的按钮 -->
                <div class="mdui-card-actions">
                  <button class="mdui-btn mdui-ripple">赞{{comment.postCommentGood}}</button>
                  <button class="mdui-btn mdui-ripple">踩{{comment.postCommentBad}}</button>
                  <!--                <button class="mdui-btn mdui-ripple">编辑</button>-->
                  <!--                  <button @click.stop="deleteComment(comment.postCommentUid)" class="mdui-btn mdui-ripple">删除</button>-->
                  <button class="mdui-btn mdui-btn-icon mdui-float-right"><i
                    class="mdui-icon material-icons">expand_more</i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        没有评论哈
      </div>
    </div>
  </div>
</template>

<script>
  import {getCommentsToMe} from '../../api'

  const otherCommentsToMeLocation = 'other_comments_to_me_location'

  export default {
    name: 'OthersCommentsToMe',
    data () {
      return {
        othersCommentsToMe: []
      }
    },
    methods: {
      async reqComments () {
        let re = await getCommentsToMe()
        console.log(re)
        if (re.code === 0) {
          let d = re.data
          console.log(d.comments)
          this.othersCommentsToMe = d.comments
          this.$nextTick(() => {
            let pos = sessionStorage.getItem(otherCommentsToMeLocation)
            console.log('scrollto', pos)
            if (pos !== null) {
              window.scrollTo(0, pos)
            }
          })
        }
      },
      goToPost (id, place) {
        let pos = window.pageYOffset
        sessionStorage.setItem(otherCommentsToMeLocation, pos)
        console.log('pos:', pos)
        this.$router.push('/post/view/' + id + '?position=' + place)
      }
    },
    mounted () {
      this.reqComments()
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
