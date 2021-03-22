<template>
  <div class="wrap" ref="wrap">
    <!-- 顶部导航 -->
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">留言列表</el-button>
    </div>
    <div class="main_content">
      <div ref="search">
        <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="栏目">
            <el-select v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
        <button-wrap class="button-wrap" style="padding: 0px;margin-bottom:20px;border-width:0px">
          <!-- <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(2)">复制</el-button> -->
          <el-button type="primary" size="small" :disabled="tableList.id == null" @click="auditComment()"
            >审核通过</el-button
          >
          <el-button type="primary" size="small" :disabled="tableList.id == null" @click="refuseComment()"
            >审核不通过</el-button
          >
          <!-- <el-button
            type="primary"
            size="small"
            :disabled="tableList.id == null"
            @click="confirm('是否删除该数据？', del)"
            >删除</el-button
          > -->
          <!-- <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button> -->
        </button-wrap>
      </div>
      <qc-table-old
        ref="table"
        :height="domHeight"
        :table-list="showData"
        :overflow="true"
        :search="searchData"
        url="api/admin/v1/comment/page"
      >
      </qc-table-old>
      <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close"></dig-form>
    </div>
  </div>
</template>

<script>
import { tableMixin } from 'jsSchool/tableMixin.js'
import SearchWrap from 'commonSchool/SearchWrap'
import ButtonWrap from 'commonSchool/ButtonWrap'
import api from 'apiSchool/common'

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      digFromWrap: false,
      updateId: '',
      searchData: {
        sourceId: ''
      },
      showData: [
        { template: 'index' },
        { prop: 'memberHeadImage', label: '头像', template: 'img', headImage: true },
        { prop: 'memberName', label: '昵称' },
        { prop: 'content', label: '内容', align: 'left' },
        { prop: 'auditStatus', label: '审核状态', align: 'center', template: 'auditStatus' },
        { prop: 'createTime', label: '创建时间' }
      ]
    }
  },
  created() {
    this.searchData.sourceId = this.$route.query.id
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    auditComment() {
      api.auditComment({ id: this.tableList.id }).then((res) => {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        this.searchKeep()
      })
    },
    refuseComment() {
      api.refuseComment({ id: this.tableList.id }).then((res) => {
        this.$message({
          message: '拒绝成功',
          type: 'success'
        })
        this.searchKeep()
      })
    },
    confirm() {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete()
        })
        .catch(() => {
          return
        })
    },
    delete() {
      api.deleteLeaveMsg({ id: this.tableList.id }).then((res) => {
        this.searchKeep()
        this.$message.success('删除成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main_content {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
}
</style>
