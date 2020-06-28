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
  // mode: 'history',
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
      /* 浏览帖子 */
      path: routerUrl.POST_VIEW + '/:id',
      component: PostView,
      meta: {
        appBar: {
          title: '浏览帖子',
          showSearch: true,
          showReload: true,
          showMore: true
        }
      }
    },
    /* 添加帖子 */
    {
      path: routerUrl.POST_ADD,
      component: PostAdd,
      meta: {
        keepAlive: true,
        appBar: {
          title: '添加帖子',
          showSearch: true,
          showReload: true,
          showMore: false
        }
      }
    },
    /* 我的帖子 */
    {
      path: routerUrl.MY_POSTS,
      component: MyPosts,
      meta: {
        title: '我的帖子',
        appBar: {
          showSearch: true,
          showReload: true,
          showMore: false
        }
      }
    },
    /* 帖子预览 */
    {
      name: routerUrl.POST_PREVIEW,
      path: routerUrl.POST_PREVIEW,
      component: PostAddPreview
    },
    /* 帖子编辑 */
    {
      name: routerUrl.POST_EDIT,
      path: routerUrl.POST_EDIT + '/:id',
      component: PostEdit,
      meta: {
        keepAlive: true
      }
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
