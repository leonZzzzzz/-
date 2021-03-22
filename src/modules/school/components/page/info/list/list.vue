<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="栏目">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="areaId">
            <el-cascader size="small" :options="areaList" :show-all-levels="false" @change="cityChange"></el-cascader>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchData.type">
              <el-option label="全部" value=""></el-option>
              <el-option label="最新" :value="1"></el-option>
              <el-option label="最热" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.listType">
              <el-option label="全部" value=""></el-option>
              <el-option label="通过" :value="1"></el-option>
              <el-option label="未通过" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="searchData.keyWord" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(1)">修改</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(2)">复制</el-button> -->
        <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="confirm('是否删除该数据？', deleteConfirm)">删除</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.isAudit" @click="confirm('是否审核通过？', authorize)">审核</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null || !tableList.isAudit" @click="confirm('是否下架该数据？', revokeNews)">下架</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.imgUrl == ''" @click="openImgListDig">查看图片</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="jumpPage('leaveMsg?id='+tableList.id)">查看留言</el-button>

      </button-wrap>
    </div>
    <qc-table-old ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/information/page">
    </qc-table-old>
    <el-dialog :visible.sync="digImgList" :append-to-body="true" @close="closeDigImgList">
      <div class="block">
        <el-carousel>
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <img style="max-width:500px;" :src="imgHost+item" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin.js";
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import api from "apiSchool/common";
import code from "../../../../js/code";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      digFromWrap: false,
      digImgList: false,
      updateId: "",
      searchData: {
        categoryId: "",
        areaId: "",
        listType: 1,
        type: "",
        keyWord: ""
      },
      showData: [
        { template: "index" },
        { prop: "headImage", label: "头像", template: "img", headImage: true },
        { prop: "username", label: "用户名" },
        { prop: "appellation", label: "称呼" },
        { prop: "phone", label: "电话" },
        { prop: "city", label: "城市" },
        { prop: "category", label: "栏目" },
        { prop: "isAudit", label: "审核", template: "Boolean" },
        { prop: "content", label: "内容" },
        { prop: "createTime", label: "创建时间" }
      ],
      category: [],
      areaList: [],
      imgList: []
    };
  },
  created() {
    this.apiGetList();
    this.getAreaList();
    console.log(code);
  },
  methods: {
    zhuanhuan() {
      let str = code.makePy(this.searchData.name);
      alert(str);
    },
    // 分类列表
    apiGetList() {
      api.listCategory().then(res => {
        this.category = res.data.data;
      });
    },
    // 获取国家包含城市
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
        console.log("获取国家包含城市:", list);
        this.areaList = list;
      });
    },
    // 审核
    authorize() {
      api.authorizeNews({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message.success("审核成功");
      });
    },
    // 下架
    revokeNews() {
      api.revokeNews({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message.success("下架成功");
      });
    },
    cityChange(val) {
      this.searchData.areaId = val[1];
    },
    insert() {
      this.$router.push("list/detail");
    },
    update(count) {
      this.updateId = this.tableList.id;
      if (count === 1) {
        this.$router.push(`list/detail?id=${this.tableList.id}`);
      } else {
        this.$router.push(`list/detail?id=${this.tableList.id}&copy=true`);
      }
    },
    jumpPage(path) {
      this.$router.push(path);
    },
    confirm(text, cb) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cb && cb();
        })
        .catch(() => {
          return;
        });
    },
    deleteConfirm() {
      this.delete();
    },
    delete() {
      api.deleteNews({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message.success("删除成功");
      });
    },
    updateOnsale(state) {
      api.updateOnsale({ id: this.tableList.id, isSell: state }).then(res => {
        this.searchKeep();
        this.$message({
          message: state ? "上架成功" : "下架成功",
          type: "success"
        });
      });
    },
    getImgList() {
      let imgUrl = "";
      this.imgList.map((item, i) => {
        imgUrl += item.url + "_";
      });
      this.model.imgUrl = imgUrl.substr(0, imgUrl.length - 1);
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    openImgListDig() {
      this.imgList = this.tableList.imgUrl.split("_");
      console.log(this.imgList);
      this.digImgList = true;
    },
    closeDigImgList() {
      this.digImgList = false;
    }
  }
};
</script>
