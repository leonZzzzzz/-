import fetch from '@/api/config'

export default {
  // 根据树形结构获取分类
  treeCategory(params) {
    return fetch.get('api/admin/v1/category/treeByType', params)
  },
  // 分页获取分类
  pageCategory(params) {
    return fetch.get('api/admin/v1/category/page', params)
  },
  // 不分页获取分类
  listCategory(params) {
    return fetch.get('api/admin/v1/category/list', params)
  },
  // listByType
  typeCategory(params) {
    return fetch.get('api/admin/v1/category/listByType', params)
  },
  // 组合查询
  async listForTreeCategory(type) {
    let res = await this.treeCategory({ type })
    let category = await this.listCategory({ type, parentId: res.data.data[0].id })
    return category.data.data
  },
  //添加分类
  addCategory(params) {
    return fetch.json('api/admin/v1/category/insert', params)
  },
  //更新分类
  updateCategory(params) {
    return fetch.json('api/admin/v1/category/update', params)
  },
  //查询分类
  getCategory(params) {
    return fetch.get('api/admin/v1/category/get', params)
  },
  //删除分类
  deleteCategory(params) {
    return fetch.post('api/admin/v1/category/delete', params)
  }
}
