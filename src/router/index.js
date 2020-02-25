import Vue from 'vue'
import Router from 'vue-router'
import Posts from '../views/Posts/Posts.vue'
import PostView from '../views/PostView/PostView.vue'
import PostAdd from '../views/PostAdd/PostAdd.vue'
import PostEdit from '../views/PostsEdit/PostEdit.vue'
import Messages from '../views/Messages/Messages.vue'
import Profile from '../views/Profile/Profile.vue'
import Login from '../views/Login/Login.vue'
import Categories from '../views/Categories/Categories.vue'
import UserInfoMe from '../views/UserInfo/UserInfoMe/UserInfoMe.vue'
import UserInfoOther from '../views/UserInfo/UserInfoOther/UserInfoOther.vue'




Vue.use(Router)

export default new Router({
  routes: [
    /* 首页 */
    {
      path: '/posts',
      component: Posts,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    {
      path: '/viewpost/:id',
      component: PostView
    },
    {
      path: '/addpost',
      component: PostAdd
    },
    {
      path: '/editpost',
      component: PostEdit
    },
    /* 分类 */
    {
      path: '/categories',
      component: Categories,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },

    /* 消息 */
    {
      path: '/messages',
      component: Messages,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    /* 个人中心 */
    {
      path: '/profile',
      component: Profile,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    /* 查看我的用户信息 */
    {
      path: '/userinfome/:id',
      component: UserInfoMe,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    /* 查看其它用户信息 */
    {
      path: '/userinfoother/:id',
      component: UserInfoOther,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      redirect: '/posts'
    }
  ]
})
