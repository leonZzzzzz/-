<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="分类">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm()">删除</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="openLink()">关联广告</el-button>
      </button-wrap>
    </div>
    <qc-table-old ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/singleContent/page"></qc-table-old>
    <!-- <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form> -->
    <dig-table :visible="dialogTable" :id="updateId" @close="close" ></dig-table>
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin.js";
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import DigTable from "./table";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigTable },
  data() {
    return {
      dialogTable: false,
      digImgList: false,
      updateId: "",
      searchData: {
        categoryId: '',
      },
      showData: [
        // { template: 'index' },
        { prop: 'seqNum', label: '序号', template: 'seqNum' },
        { prop: "iconUrl", label: "封面", template: 'img', isPrefix: true },
        { prop: "title", label: "标题" },
        { prop: "categoryName", label: "分类" },
        { prop: "info", label: "简介" },
        { prop: "createTime", label: "创建时间" },
      ],
      beforeTableList: {},
      category: [],
    };
  },
  created() {
    this.listCategory()
  },
  methods: {
    PageCategory() {
      api.PageCategory({type: 2}).then(res => {
        console.log(res.data);
        this.categoryList = res.data.data.list
      })
    },
    async listCategory() {
      let res = await api.treeByTypeCategory({type: 2})
      this.category = res.data.data
    },
    insert () {
      this.$router.push('list/detail')
    },
    update () {
      this.$router.push(`list/detail?id=${this.tableList.id}`);
    },
    jumpPage(path) {
      this.$router.push(path)
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
      let res = await api.deleteNews({id: this.tableList.id})
      this.searchKeep()
      this.$message.success("删除成功")
    },
    openLink() {
      this.updateId = this.tableList.id;
      this.beforeTableList = this.tableList
      this.setTableList({});
      this.dialogTable = true;
    },
    close(flag) {
      this.updateId = "";
      // this.setTableList({});
      this.dialogTable = false;
      if(typeof flag == 'boolean' && flag){
        this.searchKeep();
      } else {
        console.log(1)
        this.$nextTick(() => {
          this.setTableList(this.beforeTableList);
          this.beforeTableList = {}
        })
      }
    },
  }
};
</script>
