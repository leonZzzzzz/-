import fetch from '@/api/config';

export default {
  // 发布捐赠活动
  insertDonate: (params) => fetch.post('api/admin/v1/donate/insert', params),
  // 查询捐赠详情
  getDonate: (params) => fetch.get('api/admin/v1/donate/get', params),
  // 更新捐赠活动
  updateDonate: (params) => fetch.post('api/admin/v1/donate/update', params),
  // 删除捐赠活动
  deleteDonate: (params) => fetch.post('api/admin/v1/donate/delete', params),
  // 查询捐赠记录列表
  donateRecordPage: (params) => fetch.get('api/admin/v1/donateRecord/page', params),
}