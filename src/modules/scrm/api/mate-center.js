import fetch from '@/api/config'

export default {
  // 海报分类树
  getMateTree(params) {
    return fetch.get('api/admin/v1/materialGroup/list', params)
  },
  // 新增海报分类
  dynamicMateAdd(params) {
    return fetch.json('api/admin/v1/materialGroup/add', params)
  },
  // 修改海报分类
  dynamicMateUpdate(params) {
    return fetch.json('api/admin/v1/materialGroup/update', params)
  },
  // 删除分类
  dynamicMateDelete(params) {
    return fetch.post('api/admin/v1/materialGroup/delete', params)
  },
  tabList(params) {
    return fetch.get('api/admin/v1/wxCropCustomerTagGroup/page', params)
  },
  // 海报列表
  matePosterList(params) {
    return fetch.get('api/admin/v1/material/page', params)
  },
  // 海报下架
  matePosteroffShelf(params) {
    return fetch.post('api/admin/v1/material/offShelf', params)
  },
  // 新增海报
  mateAddPoster(params) {
    return fetch.json('api/admin/v1/materialPoster/addPoster', params)
  },
  // 海报详情
  mateDetailPoster(params) {
    return fetch.get('api/admin/v1/materialPoster/getDetail', params)
  },
  // 修改海报
  mateUpdatePoster(params) {
    return fetch.json('api/admin/v1/materialPoster/updatePoster', params)
  },
  // 删除海报
  mateDeletePoster(params) {
    return fetch.post('api/admin/v1/materialPoster/deletePoster', params)
  },
  // 批量删除海报、文本、图片等
  mateBatchDeletePoster(params) {
    return fetch.json('api/admin/v1/material/delete', params)
  },
  // 确认分组
  matemovePoster(params) {
    return fetch.json('api/admin/v1/material/moveGroup', params)
  },
  // 图片上传
  upLoadImg(params) {
    return fetch.postImg("api/v1/attachments/images/tencent_cloud", params);
  },


  // 新增文本、图片、视频、小程序、文件、
  materialAdd(params) {
    return fetch.json("api/admin/v1/material/add", params);
  },
  // 修改文本、图片、视频、小程序、文件、
  materialUpdate(params) {
    return fetch.json("api/admin/v1/material/update", params);
  },
  // 详情
  materialDetail(params) {
    return fetch.get("api/admin/v1/material/get", params);
  },
  // 冻结/解冻
  freezeAccount(params) {
    return fetch.post("api/admin/v1/account/frozen", params);
  },
  // 绑定分组李彪
  BoundListGroup(params) {
    return fetch.get("api/admin/v1/materialGroup/getBindList", params);
  },
  // 绑定分组
  BoundCouunt(params) {
    return fetch.json("api/admin/v1/materialGroup/bindSysAccount", params);
  },
  // 图片转base64
  imgToBase64: (params) => {
    return fetch.get('api/admin/v1/dynamicQrcode/imgToBase64', params)
  },
  // 单图文分类---步骤一
  MateroneSingle: (params) => {
    return fetch.get('api/admin/v1/category/treeByType', params)
  },
  // 获取单图文二
  MateroneSingletwo: (params) => {
    return fetch.get('api/admin/v1/category/page', params)
  },
  // 获取多图文步骤二
  MaterClassifySingle: (params) => {
    return fetch.get('api/admin/v1/category/list', params)
  },
  // 单图文列表
  MaterSingleContent: (params) => {
    return fetch.get('api/admin/v1/singleContent/page', params)
  },
  // 单图文详情
  MaterSingleDetail: (params) => {
    return fetch.get('api/admin/v1/singleContent/get', params)
  },
  // 新增单图文
  InsertSingleGRO: (params) => {
    return fetch.json('api/admin/v1/singleContent/insert', params)
  },
  // 修改单图文
  UpdataSingleGRO: (params) => {
    return fetch.json('api/admin/v1/singleContent/update', params)
  },
  // 删除单图文
  // deleteSingleGRO: (params) => {
  //   return fetch.post('api/admin/v1/singleContent/delete', params)
  // },
  deleteSingleGRO: (params) => {
    return fetch.json('api/admin/v1/singleContent/deleteBatch', params)
  },
  // 显示/隐藏单图文
  showORhiddenSingleGRO: (params) => {
    return fetch.post('api/admin/v1/singleContent/changeDisplay', params)
  },
  // 单图文分享
  showORhiddenSingleGRO: (params) => {
    return fetch.get('api/admin/v1/wxQRCode/get', params)
  },
  // 关键字列表
  searchKeyWord: () => {
    return fetch.get('api/admin/v1/materialSearchWord/page', { pageNum: 1, pageSize: 999 })
  },
  // 新增关键字
  AddKeyWordsearch: (params) => {
    return fetch.json('api/admin/v1/materialSearchWord/add', params)
  },
  // 多图文列表
  numMoregraphic: (params) => {
    return fetch.get('api/admin/v1/material/multiTextPage', params)
  },

  // 单图文单链接合并后的新增单图文接口
  addSingleGrapic: (params) => {
    return fetch.json('api/admin/v1/material/addSingleContent', params)
  },
  // 单图文单链接合并后的修改单图文接口
  UpdateSingleGrapic: (params) => {
    return fetch.json('api/admin/v1/material/updateSingleContent', params)
  },
  // 分享获取link和code
  getLinkandCode: (params) => {
    return fetch.post('api/admin/v1/material/getLink', params)
  },
  // 删除关键字
  deleteKyword: (params) => {
    return fetch.post('api/admin/v1/materialSearchWord/delete', params)
  },

}
