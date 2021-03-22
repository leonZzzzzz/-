<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="标题">
            
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm()">删除</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="detail()">捐赠详情</el-button>
      </button-wrap>
    </div>
    <qc-table-old ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/donate/page">
    </qc-table-old>
    <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form>
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
      digFromWrap: false,
      digImgList: false,
      updateId: "",
      searchData: {
        categoryId: ""
      },
      showData: [
        { prop: 'seqNum', label: '序号', template: 'seqNum' },
        { prop: "iconUrl", label: "封面", template: 'img', isPrefix: true },
        { prop: "title", label: "标题" },
        { prop: "amount", label: "捐赠金额", template: 'price' },
        { prop: "sponsor", label: "主办方" },
        { prop: "info", label: "简介" },
        { prop: "createTime", label: "创建时间" },
      ],
    };
  },
 
  methods: {
    insert () {
      this.$router.push('list/release')
    },
    update (count) {
      this.updateId = this.tableList.id;
      this.$router.push(`list/release?id=${this.tableList.id}`);
    },
    detail() {
      this.$router.push(`list/detail?id=${this.tableList.id}`)
    },
    deleteConfirm () {
      this.$confirm("是否删除该数据?", "提示", {
        type: "warning"
      }).then(() => {
        this.delete()
      })
      .catch(() => {
        return
      })
    },
    async delete () {
      await api.deleteDonate({id: this.tableList.id})
      this.searchKeep()
      this.$message.success("删除成功")
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if(typeof flag == 'boolean' && flag){
        this.searchKeep();
      }
    },
  }
};
</script>
