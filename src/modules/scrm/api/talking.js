import fetch from '@/api/config'

export default {
  // 话术库-话术分组-列表parentId = 0为父节点
  getSpeechcraftGroupList(params) {
    return fetch.get('api/admin/v1/speechcraftGroup/list', params)
  },
  // 话术库-获取分组下对应的话术列表
  getSpeechcraftPage(params) {
    return fetch.get('api/admin/v1/speechcraft/page', params)
  },
  // 话术库-编辑话术分组
  updateSpeechcraftGroup(params) {
    return fetch.json('api/admin/v1/speechcraftGroup/update', params)
  },
  // 话术库-新增话术分组
  addSpeechcraftGroup(params) {
    return fetch.json('api/admin/v1/speechcraftGroup/add', params)
  },
  // 话术库-删除话术分组
  deleteSpeechcraftGroup(params) {
    return fetch.post('api/admin/v1/speechcraftGroup/delete', params)
  },
  // 话术库-删除话术
  deleteSpeechcraft(params) {
    return fetch.post('api/admin/v1/speechcraft/delete', params)
  },
  // 话术库-新增话术
  addSpeechcraft(params) {
    return fetch.json('api/admin/v1/speechcraft/add', params)
  },
  // 话术库-编辑话术
  updateSpeechcraft(params) {
    return fetch.json('api/admin/v1/speechcraft/update', params)
  },
  // 话术库-话术详情
  getSpeechcraft(params) {
    return fetch.get('api/admin/v1/speechcraft/get', params)
  },
  // 获取图文消息列表，新增图文话术的时候选择图文消息
  getImageTextPage(params) {
    return fetch.get('api/admin/v1/singleContent/page', params)
  },
  // 获取视频素材详情及签名
  getVideoSignatureDetail(params) {
    return fetch.get('api/v1/vod/file/get', params)
  },
  // 素材库-根据类型获取分页列表
  getMaterialPage(params) {
    return fetch.get('api/admin/v1/material/page', params)
  },
  // 话术库-获取分组结构树
  getSpeechcraftGroupTree(params) {
    return fetch.get('api/admin/v1/speechcraftGroup/tree', params)
  },
  // 关键词列表（和素材库同个接口）
  getSpeechSearchWordPage(params) {
    return fetch.get('api/admin/v1/materialSearchWord/page', params)
  },
  // 关键词-新增（和素材库同个接口）
  addSpeechSearchWord(params) {
    return fetch.json('api/admin/v1/materialSearchWord/add', params)
  }
}
