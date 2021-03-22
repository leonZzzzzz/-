import fetch from '@/api/config';

const message = {
  // 获取会员列表
  getMsgPage(params) {
    return fetch.get('api/admin/v1/message/page', params)
  },

  // 发布资讯
  addMsg(params) {
    return fetch.post('api/admin/v1/message/publish', params)
  },
  // // 更新资讯
  // updateNews(params) {
  //   return fetch.post('api/admin/v1/information/update', params)
  // },
  // 删除资讯
  // deleteMsg(params) {
  //   return fetch.post('api/admin/v1/information/delete', params)
  // },
}

export default message
