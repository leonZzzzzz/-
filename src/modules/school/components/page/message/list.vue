<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input size="small" v-model="searchData.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-cascader size="small" :options="areaList" :show-all-levels="false" @change="cityChange"></el-cascader>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchData.type" size="small">
              <el-option label="首页" :value="1"></el-option>
              <el-option label="资讯" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchData.type == 2" label="栏目">
            <el-select v-model="searchData.categoryId" size="small">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in categoryList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <!-- /area/listWithChild -->
      <button-wrap>
        <el-button type="primary" size="mini" @click="add">添加</el-button>
  
      </button-wrap>
    </div>   
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/message/page">
 </qc-table-old>
  <dig-form :visible='digFormWrap' :id="updateId" :cityList="areaList" :categoryList="categoryList"  :categoryParent="categoryParent" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin";
import ButtonWrap from "../../common/ButtonWrap";
import SearchWrap from "../../common/SearchWrap";
import DigForm from "./form";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      searchData: {

      },
      showData: [
        { template: 'index' },
        { prop: "imageUrl", label: "图片", template: "img", isPrefix: true },
        { prop: "content", label: "内容" },
        { prop: "publisher", label: "发布人" },
        { prop: "createTime", label: "创建时间" }
      ],
      categoryType: true,
      categoryParent: {},
      areaList: [],
      categoryList: [],
    };
  },
  created() {

  },

  methods: {
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
      api.deleteAttachment({ id: this.tableList.id }).then(res => {
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
    }
  }
};
</script>
