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
import SearchResult from '../components/Category/SearchResult.vue'
import BlockBigAdd from '../views/BlockBig/BlockBigAdd'
import BlockBigUpdate from '../views/BlockBig/BlockBigUpdate'
import BlockMinAdd from '../views/BlockMin/BlockMinAdd'
import BlockMinList from '../views/BlockMin/BlockMinList'
import PrivilegeList from '../views/Privilege/PrivilegeList'
import BlockBigList from '../views/BlockBig/BlockBigList'
import BlockBigDetail from '../views/BlockBig/BlockBigDetail'
import BlockMinUpdate from '../views/BlockMin/BlockMinUpdate'
import BlockMinDetail from '../views/BlockMin/BlockMinDetail'

Vue.use(Router)
Vue.use(routerURL)
const routerUrl = Vue.prototype.globaRouterURL

export default new Router({
  // 消除路由上面的#
  mode: 'history',
  routes: [
    /* 首页 */
    {
      path: routerUrl.APP_HOME,
      component: Posts,
      meta: {
        keepAlive: false,
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
          showMore: true,
          showBack: true
        }
      }
    },
    /* 权限管理 */
    {
      name: 'PrivilegeList',
      path: routerUrl.PRIVILEGE_LIST,
      component: PrivilegeList,
      meta: {
        keepAlive: false,
        appBar: {
          title: '权限管理',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 大板块列表 */
    {
      name: 'BlockBigList',
      path: routerUrl.BLOCKBIG_LIST,
      component: BlockBigList,
      meta: {
        keepAlive: false,
        appBar: {
          title: '大板块列表',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 大板块详情 */
    {
      name: 'BlockBigDetail',
      path: routerUrl.BLOCKBIG_DETAIL + '/:id',
      component: BlockBigDetail,
      meta: {
        keepAlive: false,
        appBar: {
          title: '大板块详情',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 更新大板块 */
    {
      name: 'BlockBigUpdate',
      path: routerUrl.BLOCKBIG_UPDATE + '/:id',
      component: BlockBigUpdate,
      meta: {
        keepAlive: false,
        appBar: {
          title: '更新大板块',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 添加大板块 */
    {
      name: 'BlockBigAdd',
      path: routerUrl.BLOCKBIG_ADD,
      component: BlockBigAdd,
      meta: {
        keepAlive: false,
        appBar: {
          title: '添加大板块',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },

    /* 添加小板块 */
    {
      name: 'BlockBigMin',
      path: routerUrl.BLOCKMIN_ADD + '/:id',
      component: BlockMinAdd,
      meta: {
        keepAlive: false,
        appBar: {
          title: '添加小板块',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 小板块列表 */
    {
      name: 'BlockMinList',
      path: routerUrl.BLOCKMIN_LIST + '/:id',
      component: BlockMinList,
      meta: {
        keepAlive: false,
        appBar: {
          title: '小板块列表',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 更新小板块 */
    {
      name: 'BlockMinUpdate',
      path: routerUrl.BLOCKMIN_UPDATE + '/:id',
      component: BlockMinUpdate,
      meta: {
        keepAlive: false,
        appBar: {
          title: '更新小板块',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 小板块详情 */
    {
      name: 'BlockMinDetail',
      path: routerUrl.BLOCKMIN_DETAIL + '/:id',
      component: BlockMinDetail,
      meta: {
        keepAlive: false,
        appBar: {
          title: '小板块详情',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },

    /* 添加帖子 */
    {
      name: 'PostsAdd',
      path: routerUrl.POST_ADD,
      component: PostAdd,
      meta: {
        keepAlive: true,
        appBar: {
          title: '添加帖子',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 我的帖子 */
    {
      path: routerUrl.MY_POSTS,
      component: MyPosts,
      meta: {
        appBar: {
          title: '我的帖子',
          showSearch: true,
          showReload: true,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 帖子预览 */
    {
      name: routerUrl.POST_PREVIEW,
      path: routerUrl.POST_PREVIEW,
      component: PostAddPreview,
      meta: {
        appBar: {
          title: '预览帖子',
          showBack: true,
          showReload: false,
          showMore: false,
          showSearch: false
        }
      }
    },
    /* 帖子编辑 */
    {
      name: 'PostEdit',
      path: routerUrl.POST_EDIT + '/:id',
      component: PostEdit,
      meta: {
        keepAlive: true,
        appBar: {
          title: '编辑帖子',
          showBack: true,
          showReload: false,
          showMore: false,
          showSearch: false
        }
      }
    },
    /* 分类 */
    {
      path: routerUrl.CATEGORIES,
      component: Categories,
      meta: {
        showBottom: true,
        showSideBar: true,
        appBar: {
          title: '分类查询',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: false
        }
      }
    },
    /* 查询结果 */
    {
      name: 'SearchResult',
      path: routerUrl.CATEGORIES_RESULT,
      component: SearchResult,
      meta: {
        appBar: {
          title: '搜索结果',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: true
        }
      }
    },
    /* 消息 */
    {
      path: routerUrl.MESSAGE,
      component: Messages,
      meta: {
        showBottom: true,
        showSideBar: true,
        appBar: {
          title: '我的消息',
          showSearch: false,
          showReload: false,
          showMore: false,
          showBack: false
        }
      }
    },
    /* 个人中心 */
    {
      path: routerUrl.PROFILE,
      component: Profile,
      meta: {
        showBottom: true,
        showSideBar: false,
        appBar: {
          showBack: false,
          showMore: false,
          showSearch: false,
          showReload: false,
          title: '个人信息'
        }
      }
    },
    /* 查看其它用户信息 */
    {
      path: routerUrl.PROFILE_ME + '/:id',
      component: UserInfoMe,
      meta: {
        keepAlive: false,
        appBar: {
          title: '查看我的用户信息',
          showBack: true,
          showReload: false,
          showMore: false,
          showSearch: false
        }
      }
    },
    /* 查看其它用户信息 */
    {
      path: routerUrl.PROFILE_OTHER + '/:id',
      component: UserInfoOther,
      meta: {
        keepAlive: false,
        appBar: {
          title: '查看用户信息',
          showBack: true,
          showReload: false,
          showMore: false,
          showSearch: false
        }
      }
    },
    /* 登录 */
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
