<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input size="small" v-model="searchData.name" placeholder="请输入名称"></el-input>
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
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button>
        <up-load-file url="api/admin/v1/class/importData" size="mini" :success-tip="false" @file-success="fileSuccess" v-if="false"></up-load-file>
      </button-wrap>
    </div>   
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/class/page"></qc-table-old>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose" :class-data="tableList"></dig-form>
    <file-form :visible="digFileForm" :file-data="fileData" @close="fileErrClose"></file-form>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin";
import ButtonWrap from "../../common/ButtonWrap";
import SearchWrap from "../../common/SearchWrap";
import DigForm from "./form";
import api from "apiSchool/common";
import UpLoadFile from "../../common/UpLoadFile";
import FileForm from "./fileForm";


export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm, UpLoadFile, FileForm },
  data() {
    return {
      updateId: "",
      className: '',
      digFormWrap: false,
      searchData: {
        name: "",
      },
      showData: [
        { prop: 'seqNum', label: "排序", template: 'seqNum' },
        { prop: "className", label: "班级" },
        { prop: "joinMemberAmount", label: "已加入" },
        { prop: "classMemberAmount", label: "总人数" },
        { prop: "createTime", label: "创建时间" }
      ],
      fileData: {},
      digFileForm: false,
    };
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
    delete() {
      api.deleteClass({ id: this.tableList.id }).then(res => {
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
      this.className = this.tableList.className
      this.digFormWrap = true;
    },
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    fileSuccess(data) {
      this.fileData = data
      this.digFileForm = true
    },
    fileErrClose() {
      this.digFileForm = false;
      this.fileData = {}
      this.searchKeep();
    }
  }
};
</script>