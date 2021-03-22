import news from "./news";
import info from "./info";
import member from "./member";
import base from "./base";
import category from "./category";
import message from "./message";
import report from "./report";
import survey from "./survey";
import singleContent from "./singleContent";
import donate from "./donate";
import activity from "./activity";

export default [
  // 会员
  ...member,

  // 新闻
  ...news,

  // 资讯
  ...info,

  // 举报
  ...report,

  // 问卷调查
  ...survey,

  // 分类
  ...category,

  // 系统消息
  ...message,

  // 基础
  ...base,

  // 校友卡
  ...singleContent,

  // 捐赠
  ...donate,

  // 活动
  ...activity
];
