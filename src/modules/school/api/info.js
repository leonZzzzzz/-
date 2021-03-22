import fetch from '@/api/config';

const information = {
 
  // 获取资讯列表
  getInformationList(params) {
    return fetch.get("api/admin/v1/information/page", params);
  },
  // 获取置顶资讯数据
  getTopInformationList(params) {
    return fetch.get("api/admin/v1/information/top", params);
  },
  // 获取已通过审核的列表
  getAuditInformationList(params) {
    return fetch.get("api/admin/v1/information/auditPage", params);
  },
  // 获取敏感词审核列表
  getUnAutoAuditInformationList(params) {
    return fetch.get("api/admin/v1/information/unAutoAuditPage", params);
  },
  // 获取举报审核的列表
  getUnReportAuditInformationList(params) {
    return fetch.get("api/admin/v1/information/unReportAuditPage", params);
  },
  // 获取下架的列表
  getUnAuditList(params) {
    return fetch.get("api/admin/v1/information/unAuditPage", params);
    // auditPage
  },
  // 查看资讯
  getInformationDetail(params) {
    return fetch.get("api/admin/v1/information/get", params);
  },
  // 发布资讯
  addInformation(params) {
    return fetch.post("api/admin/v1/information/save", params);
  },
  // 更新资讯
  updateInformation(params) {
    return fetch.post("api/admin/v1/information/update", params);
  },
  // 删除资讯
  deleteInformation(params) {
    return fetch.post("api/admin/v1/information/delete", params);
  },
  // 审核不通过或下架资讯
  revokeInformation(params) {
    return fetch.post("api/admin/v1/information/unaudit", params);
  },
  // 审核通过或上架资讯
  authorizeInformation(params) {
    return fetch.post("api/admin/v1/information/audit", params);
  },
  // 举报资讯审核通过
  reportAuditInformation(params) {
    return fetch.post("api/admin/v1/information/reportAudit", params);
  },
  // 举报资讯审核不通过
  reportUnAuditInformation(params) {
    return fetch.post("api/admin/v1/information/reportUnAudit", params);
  },
  // 留言列表
  getLeaveMsg(params) {
    return fetch.get("api/admin/v1/comment/page", params);
  },
  // 删除留言
  deleteLeaveMsg(params) {
    return fetch.post("api/admin/v1/comment/delete", params);
  },

  // 设置资讯关联广告位 
  connectAttachmemt(params) {
    return fetch.post("api/admin/v1/appAttachment/connectAttachmemt", params);
  },
  // 获取置顶时刻表
  // getTopDateList(params){
  //   return fetch.post("api/admin/v1/appAttachment/connectAttachmemt", params);
  // }

}

export default information
