<template>
  <div class="Information-list-container">
    <div>
      <search-wrap>
        <el-form :inline="true" size="small">
          <el-form-item label="栏目">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="城市" prop="areaId">
            <el-cascader :options="areaList" :show-all-levels="false" @change="cityChange"></el-cascader>
          </el-form-item> -->
          <el-form-item label="类型">
            <el-select v-model="searchData.type">
              <el-option label="敏感词审核" :value="1"></el-option>
              <el-option label="举报审核" :value="2"></el-option>
              <el-option label="上架审核" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" v-if="searchData.type !==3">
            <el-select v-model="searchData.isAccepted">
              <el-option label="已处理" :value="1"></el-option>
              <el-option label="待处理" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" v-if="searchData.type ===3">
            <el-select v-model="searchData.isWait">
              <el-option label="待审核" :value="1"></el-option>
              <el-option label="已下架" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="手机号">
            <el-input v-model="searchData.phone" clearable></el-input>
          </el-form-item> -->
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
        <el-button type="danger" size="mini" :disabled="item.id == null" @click="confirm('是否删除该数据？', deleteConfirm)">删除</el-button>
        <el-button type="primary" size="mini" :disabled="item.id == null || item.isAudit" @click="confirm('是否审核通过？', authorize)">审核通过</el-button>
        <el-button type="danger" size="mini" :disabled="item.id == null" @click="confirm('是否审核不通过？', unAuthorize)">审核不通过</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="item.id == null || !item.isAudit" @click="confirm('是否上架该数据？', revokeInformation)">下架</el-button> -->
        <el-button type="primary" size="mini" :disabled="item.id == null" @click="checkLeaveMsg()">查看留言</el-button>
      </button-wrap>
    </div>
    <div ref="listWrapper" class="list-wrapper" :style="{'height': `${listWrapperHeight}px`}">
      <transition-group name="el-fade-in-linear" mode="out-in">
        <el-row class="list-wrapper--inner" v-for="(item,index) in InformationList" :key="item.id+index">
          <el-col>
            <el-card ref="listItem" class="list-item-card" shadow="hover" @click.native="clickItem(index,item)">
              <div v-if="item.type === 2" class="right">接龙</div>
              <div class="item-info">
                <div class="headImage">
                  <img v-if="item.memberId==='admin'" src="../../../../img/admin_img.png" alt="">
                  <img v-else :src="item.headImage">
                </div>
                <div class="user-info">
                  <el-row :gutter="5">
                    <el-col class="info-col" :sm="12" :md="16" :lg="6">
                      <span class="info-item">
                        <i class="icon i-weixin"></i>
                        <span>微信名称：</span>
                        <span>{{item.username}}</span>
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
                        <span>{{item.isHasTop?'是':'否'}}</span>
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
                    <div class="img-wrapper-item" v-for="url in formatImgUrl(item.imgUrl)" :key="url">
                      <img class="img"  :src="imgHost+url">
                    </div>
                  </div>
                </div>
              </div>
              <!-- 留言 -->
              <div class="item-comment" v-if="item.commentList.length > 0">
                <p class="all-link" v-if="item.commentList.length > 10" @click="checkLeaveMsg(item.id)" >查看全部{{item.commentList.length}}条评论>></p>
                <div class="comment-item" v-if="comment_index <= 10" v-for="(comment, comment_index) in item.commentList" :key="comment.id">
                  <div class="comment-left">
                    <img :src="comment.memberHeadImage" />
                  </div>
                  <div class="comment-main">
                    <p>{{comment.memberName}}</p>
                    <pre class="comment-content">{{comment.content}}</pre>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </transition-group>
      <div class="no-data" v-if="!InformationList.length">
        <span>没有找到符合条件的数据~</span>
      </div>
    </div>
    <el-pagination class="paginate-wrapper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import api from "apiSchool/common";

export default {
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      searchData: {
        categoryId: "",
        areaId: "",
        type: 3,
        phone: "",
        keyword: "",
        isAccepted: 0,
        isWait: 1,
        pageNum: 1,
        pageSize: 20
      },
      category: [],
      InformationList: [],
      areaList: [],
      imgList: [],
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
      currentIndex: ""
    };
  },
  created() {
    // this.getAreaList();
    this.getCategoryList();
    this.getUnauditedInformationList(this.searchData);
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
      let otherHeight = search.offsetHeight + button.offsetHeight + paginate.offsetHeight;
      this.listWrapperHeight = height - otherHeight - 110;
      console.log("w height:", height, "otherHeight:", otherHeight);
    },
    // 获取资讯列表
    getUnauditedInformationList(params) {
      let type = params.type;
      if (type === 1) {
        api.getUnAutoAuditInformationList(params).then(res => {
          let data = res.data.data;
          this.InformationList = data.list;
          this.page.total = data.total;
          this.page.pageNum = data.pageNum;
          this.page.pageSize = data.pageSize;
          console.log("敏感词的资讯列表：", res);
        });
      } else if (type === 2) {
        api.getUnReportAuditInformationList(params).then(res => {
          let data = res.data.data;
          this.InformationList = data.list;
          this.page.total = data.total;
          this.page.pageNum = data.pageNum;
          this.page.pageSize = data.pageSize;
          console.log("举报的资讯列表：", res);
        });
      } else if (type === 3) {
        api.getUnAuditList(params).then(res => {
          let data = res.data.data;
          this.InformationList = data.list;
          this.page.total = data.total;
          this.page.pageNum = data.pageNum;
          this.page.pageSize = data.pageSize;
          console.log("上架的资讯列表：", res);
        });
      }
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
      api.listByType({type: 13}).then(res => {
        this.category = res.data.data;
      });
    },
    // 选择城市查询
    cityChange(val) {
      this.searchData.areaId = val[1];
    },
    // 条件查询
    searchList() {
      this.getUnauditedInformationList(this.searchData);
    },
    // 选择资讯
    clickItem(index, item) {
      let listItem = this.$refs.listItem;
      console.log(listItem);
      // 如果点击的下标不等于当前下标，说明点击的不是同一个元素，需要去掉当前的div的active样式
      if (index !== this.currentIndex) {
        if (this.currentIndex !== "" && listItem[this.currentIndex])
          listItem[this.currentIndex].$el.classList.remove("item-active");
        listItem[index].$el.classList.add("item-active");
        this.item = item;
        // this.previousIndex = this.currentIndex;
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
        return
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
        this.getUnauditedInformationList(this.searchData);
        this.$message.success("删除成功");
      });
    },
    // 审核通过
    authorize() {
      let type = this.searchData.type;
      // 举报审核
      if (type === 2) {
        api.reportAuditInformation({ id: this.item.id }).then(res => {
          this.getUnauditedInformationList(this.searchData);
          this.$message.success("通过审核");
        });
      } else if (type === 1 || type === 3) {
        // 敏感词和上架审核
        api.authorizeInformation({ id: this.item.id }).then(res => {
          this.getUnauditedInformationList(this.searchData);
          this.$message.success("通过审核");
        });
      }
    },
    // 审核不通过
    unAuthorize() {
      let type = this.searchData.type;
      // 举报审核
      if (type === 2) {
        api.reportUnAuditInformation({ id: this.item.id }).then(res => {
          this.getUnauditedInformationList(this.searchData);
          this.$message.success("已不通过该审核");
        });
      } else if (type === 1 || type === 3) {
        // 敏感词和上架审核
        api.revokeInformation({ id: this.item.id }).then(res => {
          this.getUnauditedInformationList(this.searchData);
          this.$message.success("已不通过该审核");
        });
      }
    },
    // // 上架
    // revokeInformation() {
    //   api.revokeInformation({ id: this.item.id }).then(res => {
    //     this.getUnauditedInformationList(this.searchData);
    //     this.$message.success("上架成功");
    //   });
    // },
    // 查看留言
    checkLeaveMsg() {
      this.$router.push(`leaveMsg?id=${this.item.id}`);
    },
    // 分页条数
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.getUnauditedInformationList(this.searchData);
    },
    // 当前页
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getUnauditedInformationList(this.searchData);
      this.$refs.listWrapper.scrollTop = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Information.scss";

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
