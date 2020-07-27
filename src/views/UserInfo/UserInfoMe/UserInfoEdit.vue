<template>
  <div class="mdui-container">

    <form id="form">
      <input name="userUid" v-model="userUid" type="hidden"/>

      <!--回复的图片文件-->
      <input @change="fileChange(this)" name="fileupload" id="file" type="file" accept="image/jpeg,image/gif,image/png"
             style="display:none"/>
      <!--      头像-->
      <!-- 图片预览 -->
      <div v-show="this.postImg" class="mdui-row-xs-1 mdui-row-md-3">
        <div class="mdui-col">
          <div class="mdui-card mdui-m-t-1">
            <div class="mdui-card-media">
              <img id="previewImg" :src="this.base64Img"/>
              <!--              图片地址-->
              <input name="userAvatar" type="hidden" v-model="this.postImg">
              <div class="mdui-card-menu">
                <!-- 删除图片按钮 -->
                <button type="button" @click.prevent="imgDelete()" id="deleteImg"
                        class="mdui-btn mdui-btn-icon mdui-text-color-white"><i
                  class="mdui-icon material-icons">close</i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!this.postImg">你还没有设置头像</div>
      <!-- 添加图片按钮 -->
      <button class="mdui-btn mdui-m-t-2  mdui-color-theme-accent mdui-ripple"
              @click.prevent="addFile($event)">点击按钮切换头像
      </button>

      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">account_circle</i>
        <label class="mdui-textfield-label">用户昵称</label>
        <input class="mdui-textfield-input" name="userNickName" v-model="userNickName" type="text"/>
      </div>
      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">account_balance</i>
        <label class="mdui-textfield-label">学号</label>
        <input class="mdui-textfield-input" name="userStuNum" v-model="userStuNum" type="text"/>
      </div>
      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">face</i>
        <label class="mdui-textfield-label">性别</label>
        <div style="border-bottom: 0; overflow: unset" class="mdui-textfield-input">
          <div class="mdui-row-gapless" style="margin-left: 0px">
            <div class="mdui-col-xs-6 mdui-center">
              <label style="line-height: 0; display: inline" class="mdui-p-t-0 mdui-p-b-0 mdui-radio">
                <input type="radio" v-model="userGender" name="userGender" value="男"/>
                <i style="top: 0" class="mdui-radio-icon"></i>
                男
              </label>
            </div>
            <div class="mdui-col-xs-6 mdui-center">
              <label style="line-height: 0; display: inline" class="mdui-p-t-0 mdui-p-b-0 mdui-radio">
                <input type="radio" v-model="userGender" name="userGender" value="女" checked/>
                <i style="top: 0" class="mdui-radio-icon"></i>
                女
              </label>
            </div>
          </div>

        </div>
      </div>
      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">featured_play_list</i>
        <label class="mdui-textfield-label">简介</label>
        <input class="mdui-textfield-input" name="userDesc" v-model="userDesc" type="text"/>
      </div>
      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">email</i>
        <label class="mdui-textfield-label">邮箱</label>
        <input class="mdui-textfield-input" name="userEmail" v-model="userEmail" type="text"/>
      </div>
      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">phone_android</i>
        <label class="mdui-textfield-label">手机号</label>
        <input class="mdui-textfield-input" name="userPhone" v-model="userPhone" type="text"/>
      </div>

      <div class="mdui-textfield">
        <i class="mdui-icon material-icons">location_city</i>
        <label class="mdui-textfield-label">城市</label>
        <input class="mdui-textfield-input" name="userCity" v-model="userCity" type="text"/>
      </div>

      <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple"
              @click.prevent="save($event)">保存
      </button>

    </form>


  </div>
</template>

<script>
  import mdui from 'mdui'
  import {getUserInfo, saveUserInfo} from '../../../api'

  export default {
    name: 'UserInfoEdit',
    data () {
      return {
        userUid: '',
        postImg: null,
        base64Img: '',
        userDesc: '',
        userPhone: '',
        userEmail: '',
        userGender: '',
        userStuNum: '',
        userNickName: '',
        userCity: '',
        imgsFile: []
      }
    },
    mounted () {
      this.loadUserInfo()
    },
    methods: {
      save (e) {
        this.submit()
      },
      loadUserInfo () {
        const self = this
        getUserInfo().then(re => {
          console.log(re)
          if (re.code === 0) {
            let u = re.data
            self.postImg = u.userAvatar
            self.userAccount = u.userAccount
            self.userDesc = u.userDesc
            self.userUid = u.userUid
            self.userStuNum = u.userStuNum
            self.userCity = u.userCity
            self.userGender = u.userGender
            self.userEmail = u.userEmail
            self.userPhone = u.userPhone
            self.userNickName = u.userNickName
            this.base64Img = this.postImg
          }
        }).catch(err => {
          console.error(err)
        })
      },
      imgDelete () {
        let fileEle = document.getElementById('file')
        fileEle.value = ''
        fileEle.outerHtml = fileEle.outerHTML
        this.base64Img = null
        this.postImg = null
      },
      fileChange () {
        let fileEle = document.getElementById('file')
        const self = this
        console.log(fileEle.files)
        let f = fileEle.files[0]
        self.imgsFile.push(f)
        let reader = new FileReader()
        // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
        reader.addEventListener('load', function () {
          self.base64Img = reader.result
          self.postImg = f.name
          console.log(f.name)
          // previewImg.src = reader.result
        }, false)
        // 调用reader.readAsDataURL()方法，把图片转成base64
        reader.readAsDataURL(f)
      },
      addFile () {
        let fileEle = document.getElementById('file')
        fileEle.click()
      },
      submit: function (event) {
        if (this.userNickName.trim().length === 0) {
          mdui.snackbar({
            message: '回复不能为空！'
          })
          return
        }

        let formData = new FormData(document.getElementById('form'))
        // // 下面是表单绑定的data 数据
        // 根据后台接收参数格式进行修改
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // vue-resource
        // axios.post('api/comments/add', formData, config)
        saveUserInfo(formData, config)
          .then(res => {
            console.log(res.data)
            // success callback
            let obj = res
            if (obj.code === 1) {
              // 未登录
              this.$router.push('/login')
            }

            if (obj.code === 0) {
              mdui.snackbar({
                message: '保存成功'
              })
              self.$router.go(0)
              // 刷新页面
              // 重新请求评论数据
              // let NewPage = "_empty" + "?time=" + new Date().getTime() / 500
              // console.log('refresh page')
              // this.$router.push(NewPage)
              // this.$router.go(-1)
            } else if (obj.code === 1) {
              this.$router.push('/login')
            }
          }).catch(err => {
          // error callback
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>
