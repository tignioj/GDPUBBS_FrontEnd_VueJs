// export const LOGIN = '/login'
// export const PROFILE = '/profile'
// export const MESSAGE = '/messages'
// export const CATEGORIES = '/categories'
// export const POST_EDIT = '/post/edit'
// export const POST_PREVIEW = '/post/preview'
// export const MY_POSTS = '/post/myposts'
// export const POST_ADD = '/post/add'
// export const POST_VIEW = '/post/view/:id'

// export default {
//    LOGIN: '/login',
//    PROFILE: '/profile',
//    MESSAGE: '/messages',
//    CATEGORIES: '/categories',
//    POST_EDIT: '/post/edit',
//    POST_PREVIEW: '/post/preview',
//    MY_POSTS: '/post/myposts',
//    POST_ADD: '/post/add',
//    POST_VIEW: '/post/view/:id'
// }

/* 必须提供install方法 */
// const install = function (Vue, option) {
//   Vue.prototype.globaRouterURL = {
//     LOGIN: '/login',
//     PROFILE: '/profile',
//     MESSAGE: '/messages',
//     CATEGORIES: '/categories',
//     POST_EDIT: '/post/edit',
//     POST_PREVIEW: '/post/preview',
//     MY_POSTS: '/post/myposts',
//     POST_ADD: '/post/add',
//     POST_VIEW: '/post/view'
//   }
// }
const install = function (Vue, option) {
  Vue.prototype.globaRouterURL = {
    LOGIN: '/login',
    PROFILE: '/profile',
    MESSAGE: '/messages',
    CATEGORIES: '/categories',
    CATEGORIES_RESULT: '/categories/result',
    POST_EDIT: '/post/edit',
    POST_PREVIEW: '/post/preview',
    MY_POSTS: '/post/myposts',
    POST_ADD: '/post/add',
    POST_VIEW: '/post/view',
    BLOCKBIG_ADD: '/blockbig/add',
    BLOCKBIG_LIST: '/blockbig/list',
    BLOCKBIG_UPDATE: '/blockbig/update',
    BLOCKBIG_DETAIL: '/blockbig/detail',
    BLOCKMIN_ADD: '/blockmin/add',
    BLOCKMIN_LIST: '/blockmin/list',
    BLOCKMIN_UPDATE: '/blockmin/update',
    BLOCKMIN_DETAIL: '/blockmin/detail',
    PRIVILEGE_LIST: '/privilege/list'
  }
}

export default {
  install
}
