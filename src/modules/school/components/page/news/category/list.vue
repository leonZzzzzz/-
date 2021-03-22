<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="add">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button>
      </button-wrap>
    </div>   
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/category/page">
  </qc-table-old>
  <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin";
import ButtonWrap from "commonSchool/ButtonWrap";
import SearchWrap from "commonSchool/SearchWrap";
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
        type: 2,
      },
      showData: [
        { prop: "seqNum", label: "排序", template: 'seqNum' },
        { prop: "name", label: "名称" },
        { prop: "info", label: "备注" },
        { prop: "createTime", label: "创建时间" }
      ],
    };
  },

  methods: {
    //添加
    add() {
      this.digFormWrap = true;
    },
    // 提示框
    deleteConfirm() {
      this.$confirm("是否删除该数据?", "提示", {
        type: "warning"
      }).then(() => {
        this.delete();
      }).catch(() => {
        return;
      });
    },
    // 删除
    async delete() {
      await api.deleteCategory({ id: this.tableList.id })
      this.searchKeep();
      this.$message({
        message: "删除成功",
        type: "success"
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
