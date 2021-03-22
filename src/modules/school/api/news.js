import fetch from "@/api/config";

const news = {
  // 获取新闻列表
  getNewsPage(params) {
    return fetch.get("api/admin/v1/singleContent/page", params);
  },
  // 查看新闻
  getNewsDetail(params) {
    return fetch.get("api/admin/v1/singleContent/get", params);
  },
  // 新增新闻
  addNews(params) {
    return fetch.json("api/admin/v1/singleContent/insert", params);
  },
  // 更新新闻
  updateNews(params) {
    return fetch.json("api/admin/v1/singleContent/update", params);
  },
  // 删除新闻
  deleteNews(params) {
    return fetch.post("api/admin/v1/singleContent/delete", params);
  },

  // 获取校友卡列表
  pageWelfare(params) {
    return fetch.get("api/admin/v1/welfare/page", params);
  },
  // 查看校友卡
  getWelfare(params) {
    return fetch.get("api/admin/v1/welfare/get", params);
  },
  // 新增校友卡
  addWelfare(params) {
    return fetch.json("api/admin/v1/welfare/insert", params);
  },
  // 更新校友卡
  updateWelfare(params) {
    return fetch.json("api/admin/v1/welfare/update", params);
  },
  // 删除校友卡
  deleteWelfare(params) {
    return fetch.post("api/admin/v1/welfare/delete", params);
  }
};

export default news;
