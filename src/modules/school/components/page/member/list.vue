<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="会员名称">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input size="small" v-model="searchData.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <button-wrap>
        <!-- <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.distributer !== undefined" @click="transfer()">会员转业务员</el-button> -->
        <el-button type="primary" size="mini" :disabled="tableList.id == null || !tableList.isFrozen" @click="deleteConfirm(false)">加入白名单</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null  || tableList.isFrozen" @click="deleteConfirm(true)">加入黑名单</el-button>
      </button-wrap>
    </div>
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/member/page"></qc-table-old>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
import DigForm from "./form";
import api from "apiSchool/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      a: undefined,
      searchData: {
        username: "",
        number: "",
        mobile: ""
      },
      showData: [
        { template: "index" },
        { prop: "headImage", label: "头像", template: "img", headImage: true },
        { prop: "name", label: "会员名称" },
        { prop: "appellation", label: "会员称呼" },
        { prop: "phoneNumber", label: "手机号码" },
        { prop: "sex", label: "性别", template: "sex" },
        { prop: "company", label: "公司" },
        { prop: "position", label: "职位" },
        { prop: "isFrozen", label: "拉黑", template: "Boolean"},
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  created() {
    if (this.base.transferMember) {
      this.showData.push(
        { prop: "distributer", label: "业务员", template: "Boolean" }
      )
    }
    
  },
  methods: {
    transfer() {
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
    // 拉黑提示框
    deleteConfirm(state) {
      let title = state?'确认拉黑该用户？':'确认加入白名单？'
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isFrozenMember(state);
        })
        .catch(() => {
          return;
        });
    },
    isFrozenMember(state) {
      api.isFrozenMember({id: this.tableList.id, isFrozen: state}).then(res => {
        this.searchKeep();
        this.$message.success('操作成功')
      })
    },
    detail() {
      this.$router.push(`member/detail?id=${this.tableList.id}`);
    },
    fileSuccess(res) {
      console.log(res);
      if (res.code == 0) {
        this.searchKeep();
        this.$message({
          message: "导入成功",
          type: "success",
          duration: 0,
          showClose: true
        });
      } else {
        this.$message({
          message: res.message,
          type: "error",
          duration: 0,
          showClose: true
        });
      }
    },
    beforeAvatarUpload(file) {
      const type =
        file.name.split(".")[1] == "xlsx" || file.name.split(".")[1] == "xls";
      if (!type) {
        this.$message.error("请上传xlsx或xls");
      }
      return type;
    }
  }
};
</script>

