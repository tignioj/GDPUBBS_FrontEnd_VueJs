<template>
  <div>
    <div class="mdui-container">
      <form method="post" id="form" enctype="application/x-www-form-urlencoded">
        <!--      <input name="post_bblock.bbl_name" type="hidden" id="bblock"/>-->
        <!--      <input name="post_mblock.mb_name" type="hidden" id="mblock"/>-->
        <input name="bBlockIcon" type="hidden" id="mblock"/>
        <input name="bBlockUid" v-model="bBlockUid" type="hidden"/>

        <div class="mdui-textfield">
          <label class="mdui-textfield-label">大板块名称</label>
          <input v-model="bBlockName" name="bBlockName" id="title" class="mdui-textfield-input" type="text" required/>
          <div class="mdui-textfield-error">名称不能为空</div>
        </div>
        <div class="mdui-textfield">
          <label class="mdui-textfield-label">大板块描述</label>
          <textarea v-model="bBlockDesc" name="bBlockDesc" class="mdui-textfield-input" maxlength="10000"
                    placeholder="板块描述" required></textarea>
          <div class="mdui-textfield-error">描述不能为空</div>
        </div>


        <!-- 在超小屏幕设备上，第一列 100% 宽度，第二列 50% 宽度。在小屏幕及以上设备上，第一列为 66.6% 宽度，第二列为 33.3% 宽度。 -->
        <div class="mdui-p-t-2">授权给用户：</div>
        <div class="mdui-chip"
             v-for="(user, index)  in grantedUsers" :key="index"
        >
          <img class="mdui-chip-icon" :src="myglobalfun.imgBaseUrl(user.userAvatar)"/>
          <span class="mdui-chip-title">{{user.userAccount}}</span>
          <span class="mdui-chip-delete" @click.prevent="grantedUsers.splice(index,1)"><i
            class="mdui-icon material-icons">cancel</i></span>
          <!--          <input :name="'users[' + index + ']'" :value="user.userUid" type="hidden" />-->
        </div>
        <div class="mdui-row  mdui-p-b-2">
          <div class="mdui-col-xs-12 mdui-col-sm-8">
            <div class="mdui-textfield mdui-p-b-2 mdui-p-t-2">
              <input
                v-model="userAccount"
                class="mdui-textfield-input" type="text" placeholder="User Name"/>
            </div>
          </div>
          <div class="mdui-col-xs-12 mdui-col-sm-4 mdui-p-b-2 mdui-p-t-2">
            <button
              class="mdui-btn mdui-color-theme-accent mdui-ripple  mdui-btn-block"
              @click.prevent="getUsers()"
            >搜索
            </button>
          </div>
        </div>


        <div id="categoryBB">
          <button
            v-if="users.length > 0"
            class="mdui-btn mdui-color-theme-accent mdui-ripple  mdui-btn-block"
            @click.prevent="collapse = !collapse; $refs.result.style.display=collapse? 'none' : 'block'"
          >
            {{collapse ? '收起' : '展开'}}
          </button>
          <!--        <ul class="mdui-list" :style="'display:' +  collapse? 'hidden' : 'block'">-->
          <!--        <ul class="mdui-list" :style="{display:  collapse? 'hidden' : 'block'}">-->
          <ul class="mdui-list " ref="result" style="display: block">
            <label class="mdui-list-item mdui-ripple"
                   v-for="(user, index)  in users" :key="index"
            >
              <div class="mdui-list-item-avatar"><img :src="myglobalfun.imgBaseUrl(user.userAvatar)"/></div>
              <div class="mdui-list-item-content">{{user.userAccount}} | {{user.userPri.userPrivilegeDesc}}</div>
              <div class="mdui-checkbox">
                <input type="checkbox"
                       :checked="isChecked(user)"
                       @click="toggleGrantUser(user, $event)"/>
                <i class="mdui-checkbox-icon"></i>
              </div>
            </label>
          </ul>

        </div>

        <!-- 提交按钮 -->
        <button @click.prevent="submit()"
                class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-m-t-2 "
        >发布
        </button>
      </form>

    </div>

  </div>
</template>

<script>
  import {getUsersByName, reqBlockDetail, updateBlockBig} from '../../api'
  import mdui from 'mdui'

  export default {
    name: 'BlockBigUpdate',
    data () {
      return {
        collapse: false,
        users: [],
        grantedUsers: [],
        userAccount: '',
        bBlockDesc: '',
        bBlockName: '',
        bBlockUid: ''

      }
    },
    methods: {
      isChecked (user) {
        for (let i = 0; i < this.grantedUsers.length; i++) {
          if (this.grantedUsers[i].userUid === user.userUid) {
            return 'checked'
          }
        }
      },
      submit () {
        // event.preventDefault()
        let formData = new FormData(document.getElementById('form'))

        if (this.grantedUsers.length === 0) {
          mdui.snackbar({
            message: '请至少授权一个用户作为大版主'
          })
          return
        }

        this.grantedUsers.forEach(function (item, index, arr) {
          formData.append('users[]', item.userUid)
        })

        // // 下面是表单绑定的data 数据
        // formData.append('name', this.name);
        // formData.append('age', this.age);
        // formData.append('file', this.file);

        // 根据后台接收参数格式进行修改
        let config = {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }
        // vue-resource
        // axios.post('api/post/add', formData, config)
        updateBlockBig(formData, config).then(res => {
          console.log(res.data)
          // success callback
          let obj = res
          let view = true
          const self = this
          console.log(res)
          if (obj.code === 1) {
            // 未登录
            // this.$router.push('/login')
          }
          if (obj.code === 0) {
            self.users = []
            self.grantedUsers = []

            mdui.snackbar({
              message: '更新成功，3秒后自动跳转到该板块',
              buttonText: '取消',
              onClick: function () {
                self.$router.replace('/blockbig/detail/' + self.bBlockUid)
              },
              onButtonClick: function () {
                view = false
              },
              onClose: function () {
              }
            })
            if (view) {
              setTimeout(function () {
                self.$router.replace('/blockbig/detail/' + self.bBlockUid)
              }, 3000)
            }
          }
        }).catch(err => {
          // error callback
          console.log(err)
        })
      },
      toggleGrantUser (user, e) {
        console.log(user, e.target.checked)
        if (e.target.checked) {
          for (let i = 0; i < this.grantedUsers.length; i++) {
            if (this.grantedUsers[i].userUid === user.userUid) {
              return
            }
          }
          this.grantedUsers.push(user)
        } else {
          this.grantedUsers.forEach(function (item, index, arr) {
            if (item.userUid === user.userUid) {
              arr.splice(index, 1)
            }
          })
        }
      },
      getUsers () {
        getUsersByName(this.userAccount).then(re => {
          console.log(re)
          if (re.code === 1) {
            // 未登录
            this.$router.push('/login')
          }
          if (re.code === 0) {
            this.users = re.data
          }
        }).catch(e => {
          console.error(e)
        })
      },
      loadBlockBigDetails (uid) {
        const self = this
        reqBlockDetail(uid).then(re => {
          console.log(re)
          self.blockbigDetail = re
          // self.blockMins = re.bBlockMblocks
          self.grantedUsers = re.blockBigManagersList
          self.bBlockName = re.bBlockName
          self.bBlockDesc = re.bBlockDesc
          self.bBlockUid = re.bBlockUid
        }).catch(e => {
          console.error(e)
        })
      }
    },
    mounted () {
      const id = this.$route.params.id
      this.loadBlockBigDetails(id)
    }

  }
</script>

<style scoped>

</style>
