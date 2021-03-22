<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm()">删除</el-button>
      </button-wrap>
    </div>
    <qc-table-old ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/agreement/page"></qc-table-old>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin.js";
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      updateId: "",
      searchData: {
        code: "register",
      },
      showData: [
        { prop: "sortNumber", label: "序号", template: 'seqNum' },
        { prop: "title", label: "标题" },
        { prop: "createTime", label: "创建时间" },
      ],
    };
  },
  methods: {
    insert () {
      this.$router.push('agreement/detail')
    },
    update () {
      this.$router.push(`agreement/detail?id=${this.tableList.id}`);
    },
    deleteConfirm () {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delete()
      })
      .catch(() => {
        return
      })
    },
    async delete () {
      let res = await api.agreementDelete({id: this.tableList.id})
      this.searchKeep()
      this.$message.success("删除成功")
    },
    close(flag) {
      this.updateId = "";
      this.dialogTable = false;
      if(typeof flag == 'boolean' && flag){
        this.searchKeep();
      }
    },
  }
};
</script>
