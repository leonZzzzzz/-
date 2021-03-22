import fetch from '@/api/config';

const category = {
  // 根据类型获取商品分类列表
  treeByTypeCategory(params) {
    return fetch.get('api/admin/v1/category/treeByType', params)
  },
  // 分类列表
  listCategory(params) {
    return fetch.get('api/admin/v1/category/list', params)
  },
  // 分类列表
  PageCategory(params) {
    return fetch.get('api/admin/v1/category/page', params)
  },
  // listByType
  listByType(params) {
    return fetch.get('api/admin/v1/category/listByType', params)
  },
  //添加分类
  addCategory(params) {
    return fetch.json('api/admin/v1/category/insert', params)
  },
  //更新分类
  updateCategory(params) {
    return fetch.post('api/admin/v1/category/update', params)
  },
  //更新分类 --json
  updateCategoryJson(params) {
    return fetch.json('api/admin/v1/category/update', params)
    // return fetch.json('api/admin/v1/category/edit', params)
  },
  updateCategoryEdit(params) {
    // return fetch.json('api/admin/v1/category/update', params)
    return fetch.json('api/admin/v1/category/edit', params)
  },
  //查询分类
  getCategory(params) {
    return fetch.get('api/admin/v1/category/get', params)
  },
  //删除分类
  deleteCategory(params) {
    return fetch.post('api/admin/v1/category/delete', params)
  },
  // 添加分类标签
  saveCategoryTag(params) {
    return fetch.post("api/admin/v1/myTag/save", params);
  },
  // 获取分类标签
  getCategoryTag(params) {
    return fetch.get("api/admin/v1/tag/code", params);
  }
}

export default category
