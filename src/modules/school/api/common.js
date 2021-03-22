import fetch from "@/api/config";

import news from "./news";
import info from "./info";
import product from "./product";
import attachment from "./attachment";
import area from "./area";
import category from "./category";
import logistCompany from "./logistCompany";
import member from "./member";
import message from "./message";
import alumni from "./alumni";
import classes from "./classes";
import survey from "./survey";
import profession from "./profession";
import donate from "./donate";
import activity from "./activity";
import agreement from "./agreement";
import registerConfig from './registerConfig'
import setting from "./setting";

export default {
  // 加速  accelerator
  //用户登录
  login(data) {
    return fetch.post("login", data);
  },
  // 用户退出
  logout() {
    return fetch.post("logout");
  },
  // 修改密码
  password(model) {
    return fetch.put(`admin/users/password`, model);
  },
  // 所有表格数据 通过此接口 统一发放
  table(url, data) {
    return fetch.get(url, data);
  },

  // 图片上传
  upLoadImg(params) {
    return fetch.postImg("api/v1/attachments/images/tencent_cloud", params);
  },

  // 更新设置
  updateConfig(params) {
    return fetch.json("api/admin/v1/config/update", params);
  },
  // 更新设置
  insertConfig(params) {
    return fetch.json("api/admin/v1/config/insert", params);
  },
  // 获取设置
  getConfig(params) {
    return fetch.get("api/admin/v1/config/get", params);
  },
  // 获取设置
  getConfigType(params) {
    return fetch.get(`api/admin/v1/config/${params}`);
  },

  // 获取行业
  getConfigTrade(params) {
    return fetch.get("api/admin/v1/config/trade", params);
  },

  // 获取资讯举报值
  getReportNumber(params) {
    return fetch.get(
      "api/admin/v1/informationReport/getReportNumberConfig",
      params
    );
  },
  // 更新资讯举报值设置
  updateReportNumber(params) {
    return fetch.post(
      "api/admin/v1/informationReport/updateReportNumberConfig",
      params
    );
  },
  // 获取资讯原因
  getReportOptions() {
    return fetch.get("api/admin/v1/informationReport/getReportOptions");
  },
  // 更新资讯举报原因选项
  updateReportOptions(params) {
    return fetch.post(
      "api/admin/v1/informationReport/updateReportOptions",
      params
    );
  },

  // 资讯举报
  getReport(params) {
    return fetch.get("api/admin/v1/informationReport/page", params);
  },
  // 删除举报
  // deleteReport(params) {
  //   return fetch.post("api/admin/v1/informationReport/delete", params);
  // },

  // 获取热门城市
  getHotCity(params) {
    return fetch.get("api/admin/v1/city/get", params);
  },
  // 修改热门城市
  updateHotCity(params) {
    return fetch.post("api/admin/v1/city/update", params);
  },
  // 获取热门城市
  getTrade(params) {
    return fetch.get("api/admin/v1/tradeConfig/get", params);
  },
  // 修改热门城市
  updateTrade(params) {
    return fetch.post("api/admin/v1/tradeConfig/update", params);
  },

  // 获取敏感词
  getSensitiveWords(params) {
    return fetch.get("api/admin/v1/sensitiveWord/page", params);
  },

  // key
  getKey(params) {
    return fetch.get("api/admin/v1/key/get", params);
  },

  // 新闻
  ...news,

  // 资讯
  ...info,

  // 地区
  ...area,

  // 分类
  ...category,

  // 商城
  ...product,

  // 问卷调查
  ...survey,

  // 图片
  ...attachment,

  // 校友库
  ...alumni,

  // 班级
  ...classes,

  // 会员
  ...member,

  // 系统消息
  ...message,

  // 物流公司
  ...logistCompany,

  // 专业配置
  ...profession,

  // 捐赠
  ...donate,

  // 活动
  ...activity,

  // 协议
  ...agreement,

  // 配置注册与认证
  ...registerConfig,
  ...setting
};
