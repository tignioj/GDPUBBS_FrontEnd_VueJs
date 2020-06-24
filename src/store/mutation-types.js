/*
包含n个mutation的type名称常量
 */
export const CHANGE_CURRENT_BLOCKMIN = 'change_current_blockmin' // 点击更新小版块
export const CHANGE_CURRENT_BLOCKBIG = 'change_current_blockbig' // 点击更新大板块

export const RECEIVE_INDEX_POSTS = 'receive_index_posts' // 获取主页上的所有帖子
export const RECEIVE_INDEX_BIGBLOCKS = 'receive_index_bigblocks' // 获取大板块，也就是侧栏，其中包括了顶栏数据

export const RECEIVE_APOST_BYID = 'receive_apost_byid' // 获取根据id获取一篇帖子

export const RECEIVE_COMMENTS_BY_POSTID = 'receive_comments_by_postid' // 根据帖子id查找所有评论

export const RECEIVE_USER_PROFILE = 'receive_user_profile' // 接收用户概览消息

export const RESET_USER_INFO = 'reset_user_info' // 重置用户信息

export const POST_ADD_ONE = 'post_add_one' // 帖子数量+1
