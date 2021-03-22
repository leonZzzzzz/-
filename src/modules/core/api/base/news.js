import fetch from '@/api/config'

export default {
  // 获取新闻列表
  getNewsPage(params) {
    return fetch.get('api/admin/v1/singleContent/page', params)
  },
  // 查看新闻
  getNews(params) {
    return fetch.get('api/admin/v1/singleContent/get', params)
  },
  // 新增新闻
  addNews(params) {
    return fetch.json('api/admin/v1/singleContent/insert', params)
  },
  // 更新新闻
  updateNews(params) {
    return fetch.json('api/admin/v1/singleContent/update', params)
  },
  updateNewsStatus(params) {
    return fetch.post('api/admin/v1/singleContent/changeDisplay', params)
  },
  // 删除新闻
  deleteNews(params) {
    return fetch.post('api/admin/v1/singleContent/delete', params)
  },
  // 显示阅读积分
  showReadPoint() {
    return fetch.get('api/v1/ability-is-open/score-content')
  }
}
