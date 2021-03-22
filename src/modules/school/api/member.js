import fetch from '@/api/config';

const news = {
  // 获取会员列表
  getNewsPage(params) {
    return fetch.get('api/admin/v1/member/page', params)
  },
  // 查看会员
  getMemberDetail(params) {
    return fetch.get('api/admin/v1/member/get', params)
  },
  // // 发布资讯
  // addNews(params) {
  //   return fetch.post('api/admin/v1/information/save', params)
  // },
  // // 更新资讯
  // updateNews(params) {
  //   return fetch.post('api/admin/v1/information/update', params)
  // },
  // // 删除资讯
  // deleteNews(params) {
  //   return fetch.post('api/admin/v1/information/delete', params)
  // },
  // 是否拉黑
  isFrozenMember(params) {
    return fetch.post('api/admin/v1/member/isFrozen', params)
  },

  //#region 会员等级、头衔
  // 根据类型查找
  pageMemberLevel(params) {
    return fetch.get('api/admin/v1/memberLevel/page', params)
  },
  // 根据id查找
  getMemberLevel(params) {
    return fetch.get('api/admin/v1/memberLevel/get', params)
  },
  // 新增/修改
  addMemberLevel(params) {
    return fetch.json('api/admin/v1/memberLevel/saveOrUpdate', params)
  },
  delMemberLevel(params) {
    return fetch.post('api/admin/v1/memberLevel/delete', params)
  },
  //#endregion
}

export default news
