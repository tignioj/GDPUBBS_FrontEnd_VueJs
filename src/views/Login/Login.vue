<template>

  <div>

    <LoginTopBar/>
    <!--    <div class="mdui-appbar">-->
    <!--      <div class="mdui-toolbar ">-->
    <!--        <a href="javascript:;" @click="$router.back()" class="mdui-btn mdui-btn-icon"><i-->
    <!--          class="mdui-icon material-icons">arrow_back</i></a>-->
    <!--        <a href="javascript:;" class="mdui-typo-title">登陆</a>-->
    <!--      </div>-->
    <!--    </div>-->
    <div id="outer" class="mdui-card mdui-container mdui-hoverable mdui-m-t-1">
      <img id="logo" class="mdui-center mdui-img-fluid mdui-m-x-2" src="./images/广药.png">
      <!-- <img id="logo" class="mdui-img-fluid" src="1.jpg"> -->

      <div class="mdui-textfield mdui-textfield-floating-label mdui-m-x-2 mdui-p-t-0">
        <i class="mdui-icon material-icons">account_circle</i>
        <label class="mdui-textfield-label" ref="username">用户名</label>
        <input id="username" v-model="username" class="mdui-textfield-input" type="text" required/>
        <div class="mdui-textfield-error" v-text="usernametips"></div>
      </div>

      <div class="mdui-textfield mdui-textfield-floating-label mdui-m-x-2 mdui-p-t-0">
        <i class="mdui-icon material-icons">lock</i>
        <label class="mdui-textfield-label">密码</label>
        <input id="password" v-model="pwd" class="mdui-textfield-input" type="text"
               pattern="^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z]).*$"
               required/>
        <div class="mdui-textfield-error" v-text="pwdtips"></div>
        <div class="mdui-textfield-helper">请输入6位以上的数字或字母</div>
      </div>

      <div class="mdui-row-xs-2">
        <div class="mdui-col mdui-m-t-2 mdui-p-a-0">
          <img id="codeimg" class="mdui-center"
               @click="getCaptcha"
               :src="captchaBase64Img"
               ref="captcha"
          >
        </div>
        <div class="mdui-col">
          <div class="mdui-textfield mdui-textfield-floating-label mdui-m-a-0 mdui-p-t-0 mdui-p-r-2">
            <label class="mdui-textfield-label">验证码</label>
            <input id="code" v-model="code" class="mdui-textfield-input" type="text" required/>
            <div class="mdui-textfield-error" v-text="codetips"></div>
          </div>
        </div>
      </div>

      <div class="mdui-row-xs-2 mdui-m-b-1">
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" @click="regist()">注册</button>
        </div>
        <div class="mdui-col">
          <button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple" @click="login()">登陆</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {mutation} from 'mdui/dist/js/mdui'
  import {reqbase64Img, reqPwdLogin, reqPwdRegist} from '../../api'
  import LoginTopBar from '../../components/TopBar/LoginTopBar/LoginTopBar'

  export default {
    name: 'Login',
    components: {LoginTopBar},
    data () {
      return {
        pwd: '123456', /* 密码 */
        username: '张三', /* 用户名 */
        code: '', /* 验证码 */
        usernametips: '',
        pwdtips: '',
        codetips: '',
        captchaBase64Img: '',
        userexistedtip: ''
      }
    },
    methods: {
      async regist () {
        // 1. 表单校验
        if (!this.checkInput()) {
          return
        }
        const {username, pwd, code} = this

        // 2. 异步注册
        let result = await reqPwdRegist({username, pwd, code})
        if (result.code === 0) {
          const user = result.data
          console.log(result.data)
          // 将user保存到vuex的state
          this.$store.dispatch('recordUser', user)
          // 去个人中心界面
          this.$router.replace('/profile')
        } else {
          // 显示新的图片验证码
          this.getCaptcha()
          // 错误信息
          this.showLoginError(result.msg)
        }
      },
      async login () {
        // 1. 表单校验
        if (!this.checkInput()) {
          return
        }

        const {username, pwd, code} = this
        // 2. 异步登陆
        console.log('开始登陆')
        // 发送ajax请求密码登陆
        let result = await reqPwdLogin({username, pwd, code})
        console.log(result)
        // 根据结果数据处理
        if (result.code === 0) {
          const user = result.data
          // 将user保存到vuex的state
          this.$store.dispatch('recordUser', user)
          // 去个人中心界面
          this.$router.replace('/profile')
        } else {
          // 显示新的图片验证码
          this.getCaptcha()
          // 错误信息
          this.showLoginError(result.msg)
        }
      },
      /**
       * ajax请求base64的图片
       */
      async getCaptcha () {
        // axios
        //   .get('http://localhost:9999/login/code', {
        //     responseType: 'arraybuffer'
        //   })
        //   .then(response => new Buffer(response.data, 'binary').toString('base64'))
        //   .then(data => {
        //     document.getElementById('codeimg').setAttribute('src', 'data:image/jpeg;base64,' + data)
        //   })
        const data = await reqbase64Img('/login/code?time=' + Date.now())
        console.log(data)
        document.getElementById('codeimg').setAttribute('src', data)
      },
      /**
       * 显示登陆错误时，服务器返回的信息
       * @param msg
       */
      showLoginError (msg) {
        let err = []
        this.pwdtips = msg.err_password
        if (!(typeof (this.pwdtips) === 'undefined')) {
          err.push('password')
        }

        this.codetips = msg.err_code
        if (!(typeof (this.codetips) === 'undefined')) {
          err.push('code')
        }

        console.log(msg.err_username)
        this.usernametips = (msg.err_username === undefined ? msg.err_existed : msg.err_username)
        if (this.usernametips === undefined) {
          this.usernametips = msg.err_notexits
        }
        console.log(this.usernametips)
        if (!(typeof (this.usernametips) === 'undefined')) {
          err.push('username')
        }

        // this.userexistedtip = msg.err_existed
        // if (!(typeof (this.userexistedtip) === 'undefined')) {
        //   err.push('username')
        // }

        if (err.length > 0) {
          this.focusError(err)
        }
      },
      /**
       * 定位错误
       * @param err
       */
      focusError (err) {
        // 把焦点定位在第一个错误上面
        document.getElementById(err[0]).focus()
        for (let i = 0; i < err.length; i++) {
          console.log(err[i])
          document.getElementById(err[i]).parentNode.classList.add('mdui-textfield-invalid')
        }
      },
      /**
       * 表单登陆前的校验
       * @returns {boolean}
       */
      checkInput () {
        const {username, pwd, code} = this
        this.usernametips = ''
        this.pwdtips = ''
        this.codetips = ''
        // 存放对应Element的id
        let errEleId = []
        console.log(username, pwd, code)
        if (username.trim() === '') {
          this.usernametips = '用户名不能为空'
          errEleId.push('username')
        }
        if (username.trim().length < 2) {
          this.usernametips = '用户名长度不能小于2'
          errEleId.push('username')
        }
        if (pwd.trim() === '') {
          this.pwdtips = '密码不能为空'
          errEleId.push('password')
        }
        if (pwd.length < 6) {
          this.pwdtips = '请输入6位以上的数字或字母'
          errEleId.push('password')
        }
        if (code.trim() === '') {
          this.codetips = '验证码不能为空'
          errEleId.push('code')
        }

        if (errEleId.length > 0) {
          this.focusError(errEleId)
          return false
        }
        return true
      }
    },
    mounted () {
      this.myglobalfun.cleanBodyComponentClass()

      this.$nextTick(() => {
        document.getElementById('username').focus()
        this.getCaptcha()
      })

      mutation()
    }
  }
</script>
<style scoped>

  @media screen and (min-width: 600px) {
    #outer {
      width: 60%;
    }
  }

  @media screen and (min-width: 768px) {
    #outer {
      width: 40%;
    }
  }

  #outer {
    border-radius: 15px;
  }

</style>

