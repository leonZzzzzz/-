import fetch from '@/api/config'

export default {
  // 企业动态-获取列表
  getCompMomentsPage(params) {
    return fetch.get('api/admin/v1/moments/content/page', params)
  },
  // 企业动态-详情-ee979aa0d18b44db9eafcd2934490a86
  getCompMomentsDetail(params) {
    return fetch.get('api/admin/v1/moments/content', params)
  },
  // 企业动态-新增
  addCompMoments(params) {
    return fetch.json('api/admin/v1/moments/content/add', params)
  },
  // 企业动态-修改
  updateCompMoments(params) {
    return fetch.json('api/admin/v1/moments/content', params)
  },
  // 企业动态-删除
  deleteCompMoments(params) {
    return fetch.post('api/admin/v1/moments/content/deleted', params)
  },
  // 企业动态-发布
  publishCompMoments(params) {
    return fetch.post('api/admin/v1/moments/push', params)
  },
  // 企业动态-获取对外展示的成员列表
  getMomentsMembers() {
    return fetch.get('api/admin/v1/moments/members')
  },
  // 企业动态-配置成员对外展示动态
  setMomentsMembers(params) {
    return fetch.json('api/admin/v1/moments/members/links', params)
  }
}