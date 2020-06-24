import Vue from 'vue'
import Router from 'vue-router'
import Posts from '../views/Posts/Posts.vue'
import PostView from '../views/Posts/PostView.vue'
import PostAdd from '../views/Posts/PostAdd/PostAdd.vue'
import PostEdit from '../views/Posts/PostEdit.vue'
import Messages from '../views/Messages/Messages.vue'
import Profile from '../views/Profile/Profile.vue'
import Login from '../views/Login/Login.vue'
import Categories from '../views/Categories/Categories.vue'
import UserInfoMe from '../views/UserInfo/UserInfoMe/UserInfoMe.vue'
import UserInfoOther from '../views/UserInfo/UserInfoOther/UserInfoOther.vue'
import PostAddPreview from '../views/Posts/PostAdd/PostAddPreview.vue'
import MyPosts from '../views/Posts/MyPosts.vue'
import routerURL from './routeurl.js'


Vue.use(Router)
Vue.use(routerURL)
const routerUrl = Vue.prototype.globaRouterURL

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
      path: routerUrl.POST_VIEW + '/:id',
      component: PostView
    },
    {
      path: routerUrl.POST_ADD,
      component: PostAdd,
      meta: {keepAlive: true}
    },
    /* 我的帖子 */
    {
      path: routerUrl.MY_POSTS,
      component: MyPosts
    },
    {
      name: routerUrl.POST_PREVIEW,
      path: routerUrl.POST_PREVIEW,
      component: PostAddPreview
    },
    {
      path: routerUrl.POST_EDIT + '/:id',
      component: PostEdit
    },
    /* 分类 */
    {
      path: routerUrl.CATEGORIES,
      component: Categories,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    /* 消息 */
    {
      path: routerUrl.MESSAGE,
      component: Messages,
      meta: {
        showBottom: true,
        showSideBar: true
      }
    },
    /* 个人中心 */
    {
      path: routerUrl.PROFILE,
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
      path: routerUrl.LOGIN,
      component: Login
    },

    /* 主页 */
    {
      path: '/',
      redirect: '/posts'
    }

  ]
})
