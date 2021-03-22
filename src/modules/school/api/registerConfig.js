import fetch from '@/api/config';

export default {
  // 获取字段表单
  contactsSettingGet(params) {
    return fetch.get('api/admin/v1/contactsSetting/get', params)
  },
  // 更新字段表单
  contactsSettingSave(params) {
    return fetch.json('api/admin/v1/contactsSetting/save', params)
  },
  // 获取认证或注册配置
  initCowebCheck(params) {
    return fetch.post('api/admin/v1/contactsSetting/init', params)
  },
  // 获取认证或注册配置
  getCowebCheck(params) {
    return fetch.get('api/admin/v1/contactsSetting/getCowebCheck', params)
  },
  // 更新认证或注册配置
  updateCowebCheck(params) {
    return fetch.json('api/admin/v1/contactsSetting/updateCowebCheck', params)
  },
}

// export default registerConfig;