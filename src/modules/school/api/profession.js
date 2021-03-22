import fetch from '@/api/config';

export default {
  // 获取专业配置
  getProfession: (params) => fetch.get('api/admin/v1/profession/get', params),
  // 更新专业配置
  updateProfession: (params) => fetch.post('api/admin/v1/profession/update', params),

  // 查询教学项目列表
  professionList: params => fetch.get('api/admin/v1/profession/list', params),
  professionPage: params => fetch.get('api/admin/v1/profession/page', params),
  // 新增教学项目
  professionInsert: params => fetch.post('api/admin/v1/profession/insert', params),
  // 更新教学项目
  professionUpdate: params => fetch.post('api/admin/v1/profession/update', params),
  // 查询教学项目
  professionGet: params => fetch.get('api/admin/v1/profession/get', params),
  // 删除教学项目
  professionDelete: params => fetch.post('api/admin/v1/profession/delete', params),
}