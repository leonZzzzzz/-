<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" style="color: #409eff;">资讯详情</div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <el-row class="list-wrapper--inner">
        <el-col>
          <el-card ref="listItem" class="list-item-card" shadow="hover">
            <div class="item-info">
              <div class="headImage">
                <img v-if="item.memberId==='admin'"  src="../../../img/admin_img.png" alt="">
                <img v-else  :src="item.headImage">
              </div>
              <div class="user-info">
                <el-row :gutter="5">
                  <el-col class="info-col" :sm="12" :md="16" :lg="6">
                    <span class="info-item">
                      <i class="icon i-weixin"></i>
                      <span>微信名称：</span>
                      <span v-if="item.memberId==='admin'">岭南校友会</span>
                      <span v-else>{{item.username}}</span>
                    </span>
                  </el-col>
                  <!-- <el-col class="info-col" :sm="12" :md="8" :lg="6">
                    <span class="info-item">
                      <i class="icon i-yonghuming"></i>
                      <span>称呼：</span>
                      <span>{{item.appellation}}</span>
                    </span>
                  </el-col>
                  <el-col class="info-col" :sm="12" :md="16" :lg="6">
                    <span class="info-item">
                      <i class="icon i-dianhua"></i>
                      <span>电话号码：</span>
                      <span>{{item.phone}}</span>
                    </span>
                  </el-col> -->
                  <el-col class="info-col" :sm="24" :md="16" :lg="6">
                    <span class="info-item">
                      <i class="icon i-shijian"></i>
                      <span>时间：</span>
                      <span>{{item.createTime}}</span>
                    </span>
                  </el-col>
                  <!-- <el-col class="info-col" :sm="12" :md="8" :lg="6">
                    <span class="info-item">
                      <i class="icon i-didian"></i>
                      <span>城市：</span>
                      <span>{{item.city}}</span>
                    </span>
                  </el-col> -->
                  <el-col class="info-col" :sm="12" :md="16" :lg="6">
                    <span class="info-item">
                      <i class="icon i-lanmu"></i>
                      <span>栏目：</span>
                      <span>{{item.category}}</span>
                    </span>
                  </el-col>
                  <!-- <el-col class="info-col" :sm="12" :md="8" :lg="6">
                  <span class="info-item">
                    <i class="icon i-shenhezhong"></i>
                    <span>审核：</span>
                    <span>{{item.isAudit?'是':'否'}}</span>
                  </span>
                </el-col>
                <el-col class="info-col" :sm="12" :md="8" :lg="6">
                  <span class="info-item">
                    <i class="icon i-jubao"></i>
                    <span>被举报：</span>
                    <span>{{item.isReportAudit?'是':'否'}}</span>
                  </span>
                </el-col> -->

                  <!-- <el-col class="info-col" :sm="12" :md="8" :lg="6">
                    <span class="info-item">
                      <i class="icon i--zhiding"></i>
                      <span>是否置顶：</span>
                      <span style="color:#409eff;" v-if="item.isTop">是</span>
                      <span v-else>否</span>
                    </span> 
                  </el-col> -->
                  <el-col class="info-col" :sm="24" :md="24" :lg="12">
                    <span class="info-item">
                      <i class="icon i-didian"></i>
                      <span>定位：</span>
                      <span>{{item.address}}</span>
                    </span>
                  </el-col>
                  <!-- <el-col class="info-col" :sm="24" :md="24" :lg="12">
                    <span class="info-item">
                      <i class="el-icon-star-off"></i>
                      <span>栏目标签：</span>
                      <el-tag size="small" v-for="(tag,index) in formatTagsInfo(item.tagInfo)" :key="index">{{tag}}</el-tag>
                    </span>
                  </el-col> -->
                </el-row>
              </div>
            </div>
            <div class="item-content">
              <div class="content-text">
                <div>
                  <i class="icon i-zixun"></i>
                  <span v-if="item.content">资讯内容</span>
                </div>
                <pre>{{item.content}}</pre>
              </div>
              <div class="content-img">
                <div>
                  <i class="icon i-tupian"></i>
                  <span v-if="formatImgUrl(item.imgUrl)">资讯图片（{{formatImgUrl(item.imgUrl).length}}张）</span>
                </div>
                <div v-if="item.imgUrl" class="img-wrapper">
                  <div class="img-wrapper-item" v-for="url in formatImgUrl(item.imgUrl)" :key="url">
                    <img class="img"  :src="imgHost+url">
                  </div>
                </div>
              </div>
            </div>
            <!-- 举报 -->
            <div class="item-comment" v-if="reportList && reportList.length > 0">
              <p class="all-link" @click="checkReport()" >查看全部举报({{reportList.length}})</p>
              <div class="comment-item" v-for="(report, index) in reportList" :key="index">
                <div class="comment-left">
                  <img :src="report.headImage" />
                </div>
                <div class="comment-main">
                  <p>{{report.name}}</p>
                  <pre class="comment-content">{{report.reportReason}}</pre>
                  <pre class="comment-content">{{report.otherReason}}</pre>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import QcHeader from "commonSchool/QcHeader";
import api from "apiSchool/common";
import { tableMixin } from "jsSchool/tableMixin";

export default {
  mixins: [tableMixin],
  components: {
    QcHeader,
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500
      },
      item: {},
      imgList: [],
      reportList: [],
      wrapHeight: 0,
      areaHeight: 0,
      dataLoading: false,
    };
  },
  created() {
    // this.$route.query.id = '8263e508bec84fc8a79140a650a6b8c3';
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.getDetail();
      this.getReport();
    }
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    back() {
      this.$router.go(-1);
    },
    // 查看举报
    checkReport(id) {
      this.$router.push(`/main/info/report?id=${this.item.id}`);
    },
    getDetail() {
      api.getInformationDetail({ id: this.$route.query.id }).then(res => {
        this.item = res.data.data;
        if (this.item.imgUrl) {
          let imgList = this.item.imgUrl.split(",");
          imgList.map(item => {
            this.imgList.push({ url: item });
          });
        }
        this.dataLoading = false;
      });
    },
    getLeaveMsg() {
      api.getLeaveMsg({sourceId: this.$route.query.id}).then(res => {
        this.commentList = res.data.data.list
      })
    },
    getReport() {
      api.getReport({sourceId: this.$route.query.id}).then(res => {
        this.reportList = res.data.data.list
      })
    },
    // 转换img的url为数组
    formatImgUrl(imgUrl) {
      return imgUrl ? imgUrl.split(",") : [];
    },
    // 转换标签信息为数组
    formatTagsInfo(tags) {
      return tags ? tags.split("_") : [];
    },
    
  },
};
</script>

<style lang="scss" scoped>
@import "../info/list/Information.scss";

.el-dialog {
  ::v-deep &.is-fullscreen {
    width: 85%;
    height: 90%;
    margin-top: 25px;
  }
}
// .tabbar {
//   display: flex;
//   border-bottom: 1px solid #e7eaec;
//   position: relative;
//   .back {
//     position: absolute;
//     right: 10px;
//     top: 13px;
//   }
//   .item {
//     padding: 15px 30px;
//     color: #bfbfbf;
//     cursor: pointer;
//     span {
//       font-size: 22px;
//     }
//   }
// }
.context-box {
  padding: 20px;
  overflow: auto;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        border-left: 3px solid #3091f2;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}

.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
