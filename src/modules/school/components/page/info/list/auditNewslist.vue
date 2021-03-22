<template>
  <div class="Information-list-container">
    <div>
      <search-wrap>
        <el-form :inline="true" size="small">
          <el-form-item label="栏目">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="城市" prop="areaId">
            <el-cascader :options="areaList" :show-all-levels="false" @change="cityChange"></el-cascader>
          </el-form-item>-->
          <el-form-item label="分类">
            <el-select v-model="searchData.type">
              <!-- <el-option label="全部" value=""></el-option> -->
              <el-option label="最新" :value="1"></el-option>
              <el-option label="最热" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="状态">
            <el-select v-model="searchData.listType">
              <el-option label="全部" value=""></el-option>
              <el-option label="通过" :value="1"></el-option>
              <el-option label="未通过" :value="2"></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="手机号">
            <el-input v-model="searchData.phone" clearable></el-input>
          </el-form-item>-->
          <el-form-item label="内容">
            <el-input v-model="searchData.keyword" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchList()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap style="background:#fff;">
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="item.id == null" @click="update()">修改</el-button>
        <el-button
          type="danger"
          size="mini"
          :disabled="item.id == null"
          @click="confirm('是否删除该数据？', deleteConfirm)"
        >删除</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="item.id == null || item.isAudit" @click="confirm('是否审核通过？', authorize)">审核</el-button> -->
        <el-button
          type="primary"
          size="mini"
          :disabled="item.id == null || !item.auditStatus===2"
          @click="confirm('是否下架该数据？', revokeInformation)"
        >下架</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="item.id == null"
          @click="checkLeaveMsg()"
        >查看留言</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="item.id == null"
          @click="checkReport()"
        >查看举报</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="item.id == null" @click="bindAD()">关联广告</el-button> -->
        <!-- <el-button type="primary" size="mini" @click="importFile()">导入</el-button> -->
        <!-- <el-button type="info" size="mini" @click="getImportModel()">下载导入模板</el-button> -->

        <up-load-file
          v-show="false"
          @file-success="importSuccess"
          ref="upLoadFile"
          :data="searchData"
          url="api/admin/v1/information/import"
          btnType="primary"
          size="mini"
        ></up-load-file>
      </button-wrap>
    </div>
    <div ref="listWrapper" class="list-wrapper" :style="{'height': `${listWrapperHeight}px`}">
      <!-- <transition-group name="el-fade-in-linear" mode="out-in"> -->
        <el-row class="list-wrapper--inner" v-for="(item,index) in InformationList" :key="index">
          <el-col>
            <el-card
              ref="listItem"
              class="list-item-card"
              shadow="hover"
              @click.native="clickItem(index,item)"
            >
              <div v-if="item.type === 2" class="right">接龙</div>
              <div class="item-info">
                <div class="headImage">
                  <img v-if="item.memberId==='admin'"  src="../../../../img/admin_img.png" alt />
                  <img v-else  :src="item.headImage" />
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
                    </el-col>-->
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
                    </el-col>-->
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
                    </el-col>-->

                    <!-- <el-col class="info-col" :sm="12" :md="8" :lg="6">
                      <span class="info-item">
                        <i class="icon i--zhiding"></i>
                        <span>是否置顶：</span>
                        <span style="color:#409eff;" v-if="item.isTop">是</span>
                        <span v-else>否</span>
                      </span> 
                    </el-col>-->
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
                    </el-col>-->
                  </el-row>
                </div>
              </div>
              <div class="item-content">
                <div class="content-text">
                  <div>
                    <i class="icon i-zixun"></i>
                    <span>资讯内容（{{item.content.length}}字）</span>
                  </div>
                  <pre>{{item.content}}</pre>
                </div>
                <div class="content-img">
                  <div>
                    <i class="icon i-tupian"></i>
                    <span>资讯图片（{{formatImgUrl(item.imgUrl).length}}张）</span>
                  </div>
                  <div v-if="item.imgUrl.length" class="img-wrapper">
                    <div
                      class="img-wrapper-item"
                      v-for="url in formatImgUrl(item.imgUrl)"
                      :key="url"
                    >
                      <img class="img" :src="imgHost+url" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 留言 -->
              <div class="item-comment" v-if="item.commentList.length > 0">
                <p
                  class="all-link"
                  v-if="item.commentList.length > 10"
                  @click="checkLeaveMsg(item.id)"
                >查看全部{{item.commentList.length}}条评论>></p>
                <template v-for="(comment, comment_index) in item.commentList">
                  <div class="comment-item" v-if="comment_index <= 10" :key="comment.id">
                    <div class="comment-left">
                      <img :src="comment.memberHeadImage" />
                    </div>
                    <div class="comment-main">
                      <p>{{comment.memberName}}</p>
                      <pre class="comment-content">{{comment.content}}</pre>
                    </div>
                  </div>
                </template>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <!-- </transition-group> -->
      <div class="no-data" v-if="!InformationList.length">
        <span>没有找到符合条件的数据~</span>
      </div>
    </div>
    <el-pagination
      class="paginate-wrapper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.total"
    ></el-pagination>
    <el-dialog title="关联广告" :visible.sync="dialogTableVisible" :append-to-body="true" fullscreen>
      <bind-a-d :item="item" :id="item.id"></bind-a-d>
    </el-dialog>
  </div>
</template>

<script>
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import UpLoadFile from "commonSchool/UpLoadFile";
import api from "apiSchool/common";
import bindAD from "./bindAD";

export default {
  components: { SearchWrap, ButtonWrap, bindAD, UpLoadFile },
  data() {
    return {
      searchData: {
        categoryId: "",
        // areaId: "",
        // listType: "",
        type: 1,
        // phone: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20
      },
      category: [],
      InformationList: [],
      areaList: [],
      areaName: "",
      imgList: [],
      topList: [],
      // 单个资讯
      item: {},
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      listWrapperHeight: 0,
      // 之前选择的div下标
      previousIndex: "",
      // 当前选择的div下标
      currentIndex: "",
      dialogTableVisible: false
    };
  },
  created() {
    // this.getAreaList();
    this.getCategoryList();
    // this.getTopInformationList(this.searchData);
    this.getAuditInformationList(this.searchData);
  },
  mounted() {
    this.getListWrapperHeight();
    window.onresize = () => {
      this.getListWrapperHeight();
    };
  },
  methods: {
    getListWrapperHeight() {
      let search = document.querySelector(".search-wrap");
      let button = document.querySelector(".button-wrap");
      let paginate = document.querySelector(".paginate-wrapper");
      let height = window.innerHeight;
      let otherHeight =
        search.offsetHeight + button.offsetHeight + paginate.offsetHeight;
      this.listWrapperHeight = height - otherHeight - 110;
      console.log("w height:", height, "otherHeight:", otherHeight);
    },
    getTopInformationList(params) {
      // 获取新的列表时取消选择的样式
      let listItem = this.$refs.listItem;
      if (this.currentIndex !== "" && listItem[this.currentIndex]) {
        listItem[this.currentIndex].$el.classList.remove("item-active");
        this.currentIndex = "";
      }
      api.getTopInformationList(params).then(res => {
        console.log("置顶数据：", res);
        let data = res.data.data;
        this.topList = data || [];
        this.getAuditInformationList(params);
      });
    },
    // 获取资讯列表
    getAuditInformationList(params) {
      api.getAuditInformationList(params).then(res => {
        let data = res.data.data;
        let length = this.topList.length;
        if (length) {
          for (let i = 0; i < length; i++) {
            for (let j = 0; j < data.list.length; j++) {
              if (this.topList[i].id === data.list[j].id) {
                data.list.splice(j, 1);
                break;
              }
            }
          }
        }
        this.InformationList = this.topList.concat(data.list);
        console.log("处理过的列表：", this.InformationList);
        // this.InformationList = data.list;
        this.page.total = data.total;
        this.page.pageNum = data.pageNum;
        this.page.pageSize = data.pageSize;
        // this.currentIndex = "";
        console.log("资讯列表：", res);
      });
    },
    // 转换img的url为数组
    formatImgUrl(imgUrl) {
      return imgUrl ? imgUrl.split(",") : [];
    },
    // 转换标签信息为数组
    formatTagsInfo(tags) {
      return tags ? tags.split("_") : [];
    },
    // 获取国家城市级联数据
    getAreaList() {
      api.getAreaList().then(res => {
        let list = [
          {
            value: "",
            label: "全部"
          }
        ];
        res.data.data.list.map((item, i) => {
          list.push({ label: item.name, value: item.id, children: [] });
          item.childList.map((two, j) => {
            list[i + 1].children.push({ label: two.name, value: two.id });
          });
        });
        this.areaList = list;
        console.log("获取国家包含城市:", list);
      });
    },
    // 获取栏目列表
    getCategoryList() {
      api.listByType({ type: 13 }).then(res => {
        this.category = res.data.data;
      });
    },
    // 选择城市查询
    cityChange(val) {
      // this.searchData.cittName = val[0]
      let name = "";
      for (let i in this.areaList) {
        if (this.areaList[i].value === val[0]) {
          let children = this.areaList[i].children;
          if (children) {
            for (let j in children) {
              if (children[j].value === val[1]) {
                name = children[j].label;
                break;
              }
            }
          }
        }
        if (name) {
          break;
        }
      }
      this.areaName = name;
      console.log(name);
      this.searchData.areaId = val[1];
    },
    // 条件查询
    searchList() {
      this.getAuditInformationList(this.searchData);
    },
    // 选择资讯
    clickItem(index, item) {
      let listItem = this.$refs.listItem;
      // console.log("index dom:", listItem[index]);
      // console.log("previous dom:", listItem[this.currentIndex]);
      console.log("item:", item);
      console.log("click index:", index);
      console.log("previous index:", this.currentIndex);
      console.log("previous dom:", listItem[this.currentIndex]);
      // 如果点击的下标不等于当前下标，说明点击的不是同一个元素，需要去掉当前的div的active样式
      if (index !== this.currentIndex) {
        if (this.currentIndex !== "" && listItem[this.currentIndex])
          listItem[this.currentIndex].$el.classList.remove("item-active");
        listItem[index].$el.classList.add("item-active");
        this.item = item;
        this.currentIndex = index;
      } else {
        let result = listItem[index].$el.classList.toggle("item-active");
        if (result) {
          this.item = item;
        } else {
          this.item = {};
          this.currentIndex = "";
        }
      }
      // console.log("current index:", this.currentIndex);
      // console.log("current dom:", listItem[this.currentIndex]);
    },
    // 添加
    insert() {
      this.$router.push("list/detail");
    },
    // 修改
    update() {
      if (this.item.type === 2) {
        this.$message({
          message: "接龙类型不可修改",
          type: "warning"
        });
        return;
      }
      this.$router.push(`list/detail?id=${this.item.id}`);
    },
    // 确认弹框
    confirm(text, fn) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fn && fn();
        })
        .catch(() => {
          return;
        });
    },
    deleteConfirm() {
      api.deleteInformation({ id: this.item.id }).then(res => {
        this.getAuditInformationList(this.searchData);
        this.$message.success("删除成功");
      });
    },
    // 审核
    authorize() {
      api.authorizeInformation({ id: this.item.id }).then(res => {
        this.getAuditInformationList(this.searchData);
        this.$message.success("审核成功");
      });
    },
    // 下架
    revokeInformation() {
      api.revokeInformation({ id: this.item.id }).then(res => {
        this.getAuditInformationList(this.searchData);
        this.$message.success("下架成功");
      });
    },
    // 查看留言
    checkLeaveMsg(id) {
      if (id) this.$router.push(`leaveMsg?id=${id}`);
      else this.$router.push(`leaveMsg?id=${this.item.id}`);
    },
    // 查看举报
    checkReport() {
      this.$router.push(`report?id=${this.item.id}`);
    },
    // 分页条数
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.getAuditInformationList(this.searchData);
    },
    // 当前页
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getAuditInformationList(this.searchData);
      this.$refs.listWrapper.scrollTop = 0;
    },
    bindAD() {
      this.dialogTableVisible = true;
    },
    importFile() {
      if (!this.searchData.areaId) {
        this.$message({
          message: "请选择一个城市",
          type: "warning"
        });
      } else {
        let msg = `确定将数据导入到【${this.areaName}】`;
        this.$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            console.log(this.$refs.upLoadFile.$el);
            this.$refs.upLoadFile.$el.querySelector("[type=file]").click();
          })
          .catch(() => {});
      }
    },
    importSuccess() {
      this.searchList();
    },
    getImportModel() {
      location.href = `${this.localhost}/api/admin/v1/information/export`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Information.scss";
.el-dialog {
  ::v-deep &.is-fullscreen {
    width: 85%;
    height: 90%;
    margin-top: 25px;
  }
}
.right {
  position: absolute;
  top: 20px;
  right: 0;
  padding: 2px 5px;
  border: 1px solid #de0045;
  border-radius: 5px;
  font-size: 12px;
}
</style>
