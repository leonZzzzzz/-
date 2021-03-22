<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <!-- <el-form-item label="栏目">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="开始时间">
            <el-date-picker type="date" size="small" placeholder="选择日期" v-model="searchData.startDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker type="date" size="small" placeholder="选择日期" v-model="searchData.endDate" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap class="button-wrap">
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="jumpDetail">查看详情</el-button>
        <!-- <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="confirm('是否删除该数据？', del)">删除</el-button> -->
        <!-- <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button> -->
      </button-wrap>
    </div>
    <qc-table-old ref="table" :height="domHeight" :table-list="showData" :search="searchData" :url="'api/admin/v1/informationReport/page'">
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
      updateId: "",
      searchData: {
        sourceId: '',
        startDate: '',
        endDate: '',
      },
      showData: [
        { template: 'index' },
        { prop: "headImage", label: "头像", template: 'img', headImage: true, },
        { prop: "name", label: "昵称" },
        { prop: "reportReason", label: "原因" },
        { prop: "otherReason", label: "其他原因" },
        { prop: "createTime", label: "创建时间" },
      ],
    };
  },
  created() {
    // this.searchData.sourceId = this.$route.query.id;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    jumpDetail() {
      this.$router.push('report/detail?id='+this.tableList.sourceId)
    },
    confirm () {
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
    delete () {
      api.deleteLeaveMsg({id: this.tableList.sourceId}).then(res => {
        this.searchKeep()
        this.$message.success("删除成功")
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.button-wrap{
  position: relative;
  .back {
    position: absolute;
    right: 13px;
    top: 10px;
  }
}

</style>
