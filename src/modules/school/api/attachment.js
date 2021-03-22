import fetch from '@/api/config';

const attachment = {
  // 图片列表
  listAttachment(params) {
    return fetch.get('api/admin/v1/appAttachment/page', params)
  },
  //添加图片
  addAttachment(params) {
    return fetch.post('api/admin/v1/appAttachment/insert', params)
  },
  //更新图片
  updateAttachment(params) {
    return fetch.post('api/admin/v1/appAttachment/update', params)
  },
  //查询图片
  getAttachment(params) {
    return fetch.get('api/admin/v1/appAttachment/get', params)
  },
  //删除图片
  deleteAttachment(params) {
    return fetch.post('api/admin/v1/appAttachment/delete', params)
  },
  // 设置广告位关联页面
  connectAttachmemt(params) {
    return fetch.post('api/admin/v1/appAttachment/connectAttachmemt', params)
  },
};

export default attachment;