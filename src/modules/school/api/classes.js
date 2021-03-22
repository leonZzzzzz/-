import fetch from '@/api/config';

const classes = {
  // 获班级列表 list
  getClassList(params) {
    return fetch.get('api/admin/v1/class/list', params)
  },
  // 班级列表
  getClassPage(params) {
    return fetch.get('api/admin/v1/class/page', params)
  },

  //添加班级
  addClass(params) {
    return fetch.post('api/admin/v1/class/insert', params)
  },
  //更新班级
  updateClass(params) {
    return fetch.post('api/admin/v1/class/update', params)
  },
  //删除班级
  deleteClass(params) {
    return fetch.post('api/admin/v1/class/delete', params)
  },

};

export default classes;