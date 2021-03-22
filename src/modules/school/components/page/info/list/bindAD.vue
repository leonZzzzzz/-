<template>
    <div class="wrap" ref="wrap">
        <div ref="search">
            <search-wrap>
                <el-form :inline="true">
                    <el-form-item label="名称">
                        <el-input size="small" v-model="searchData.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input :disabled="true" size="small" :value="item.city"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="searchData.type" size="small">
                            <el-option label="首页轮播图" :value="1"></el-option>
                            <el-option label="资讯页广告图" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="searchData.type == 2" label="栏目">
                        <el-select :disabled="true" v-model="searchData.categoryId" size="small">
                            <el-option :label="item.name" :value="item.id" v-for="(item, index) in categoryList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="search()">查询</el-button>
                    </el-form-item>
                </el-form>
            </search-wrap>
            <!-- /area/listWithChild -->
            <button-wrap>
                <!-- <el-button type="primary" size="mini" @click="add">添加</el-button> -->
                <el-button type="primary" size="small" :disabled="tableList.id == null" @click="handleBindAD()">关联该广告</el-button>
                <!-- <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button> -->
            </button-wrap>
        </div>
        <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/appAttachment/page"></qc-table-old>
        <!-- <dig-form :visible='digFormWrap' :id="updateId" :cityList="areaList" :categoryList="categoryList" :categoryParent="categoryParent" @close="digClose"></dig-form> -->
    </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin";
import ButtonWrap from "@/components/common/ButtonWrap";
import SearchWrap from "@/components/common/SearchWrap";
// import DigForm from "./form";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  props: {
    id: String,
    item: Object
  },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      searchData: {
        abc: [],
        areaId: "",
        name: "",
        type: 1,
        categoryId: ""
      },
      showData: [
        { prop: "seqNum", label: "排序", template: "seqNum" },
        { prop: "url", label: "图片", template: "img", isPrefix: true },
        { prop: "name", label: "名称" },
        { prop: "type", label: "类别" },
        { prop: "countryName", label: "国家" },
        { prop: "cityName", label: "位置" },
        { prop: "href", label: "链接" },
        { prop: "note", label: "备注" },
        { prop: "createTime", label: "创建时间" }
      ],
      categoryType: true,
      categoryParent: {},
      areaList: [],
      categoryList: []
    };
  },
  mounted() {
    this.getAreaList();
    this.apiGetList();
    this.searchData.areaId = this.item.areaId;
    console.log("item:", this.item);
  },
  watch: {
    "searchData.type"() {
      if (this.searchData.type === 2) {
        this.searchData.categoryId = this.item.categoryId;
      } else {
        this.searchData.categoryId = "";
      }
    }
  },
  methods: {
    // 分类列表
    apiGetList() {
      api.listCategory().then(res => {
        this.categoryList = res.data.data;
      });
    },
    // 获取国家包含城市
    getAreaList() {
      api.getAreaList().then(res => {
        let list = [];
        res.data.data.list.map((item, i) => {
          list.push({ label: item.name, value: item.id, children: [] });
          item.childList.map((two, j) => {
            list[i].children.push({ label: two.name, value: two.id });
          });
        });
        this.areaList = list;
      });
    },
    cityChange(val) {
      this.searchData.areaId = val[1];
    },
    //添加
    add() {
      this.updateId = "";
      this.digFormWrap = true;
    },
    //删除提示框
    deleteConfirm() {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          return;
        });
    },
    //提示
    delete() {
      api.deleteAttachment({ id: this.tableList.id }).then(() => {
        this.searchKeep();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    //修改
    update() {
      this.updateId = this.tableList.id;
      this.digFormWrap = true;
    },
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    // 关联广告
    handleBindAD() {
      this.$confirm("是否关联该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            href: "/pages/details/details?id=" + this.id,
            informationId: this.id,
            attachmentId: this.tableList.id
          };
          console.log("bind ad 参数：", params);
          api.connectAttachmemt(params).then(res => {
            console.log("bindAD返回：", res);
            // this.$message(res.data.message);
            this.$message({
              message: res.data.message,
              type: "success"
            });
          });
        })
        .catch(() => {
          return;
        });
    }
  }
};
</script>
