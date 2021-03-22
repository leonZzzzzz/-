import fetch from '@/api/config'
// 行为痕迹
export default {
    // 列表
    getActionTracePage(params) {
        return fetch.get('api/admin/v1/actionTrace/page', params)
    },
    // 新增
    createActionTrace(params) {
        return fetch.json('api/admin/v1/actionTrace/add', params)
    },
    // 修改
    updateActionTrace(params) {
        return fetch.json('api/admin/v1/actionTrace/update', params)
    },
    // 详情
    getActionTraceDetails(params) {
        return fetch.get('api/admin/v1/actionTrace/get', params)
    },
}