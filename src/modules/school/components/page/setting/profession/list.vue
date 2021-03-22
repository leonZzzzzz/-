<template>
  <div class="wrap" style="background: #fff;" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="add(1)">添加学位</el-button>
        <el-button type="primary" size="mini" :disabled="page.parentId == null" @click="update(1)">修改</el-button>
        <el-button type="danger" size="mini" :disabled="page.parentId == null" @click="deleteConfirm(1)"
          >删除</el-button
        >
      </button-wrap>
    </div>
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item, i) in degreeList" :key="i" :label="item.name" :name="i + ''">
        <div ref="search">
          <button-wrap>
            <el-button type="primary" size="mini" @click="add(2)">添加系别</el-button>
            <el-button type="primary" size="mini" :disabled="row.id == null" @click="update(2)">修改</el-button>
            <el-button type="danger" size="mini" :disabled="row.id == null" @click="deleteConfirm(2)">删除</el-button>
          </button-wrap>
        </div>

        <el-table
          :data="tableData"
          class="table"
          :height="`${tableHeight}px`"
          highlight-current-row
          @row-click="rowCilck"
        >
          <!-- <el-table-column v-for="(item, i) in showData" :key="i" :prop="item.prop" :label="item.label" align="center"></el-table-column> -->
          <el-table-column
            v-for="(item, index) in showData"
            :key="index"
            :align="item.align || 'center'"
            v-if="!item.template"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column align="center" v-else-if="item.template == 'seqNum'" :label="item.label" width="65">
            <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
          </el-table-column>
          <el-table-column
            :align="item.align || 'center'"
            v-else-if="item.template == 'professionType'"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">{{ scope.row[item.prop] | professionType }}</template>
          </el-table-column>
        </el-table>

        <div class="blocks">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNum"
            :page-sizes="[10, 20, 30]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </div>

        <!-- <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/profession/page"></qc-table-old> -->
      </el-tab-pane>
    </el-tabs>

    <!-- <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/profession/page"></qc-table-old> -->
    <dig-form :visible="digFormWrap" :id="updateId" @close="digClose" :type="type" :parent-id="parentId"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from 'jsSchool/tableMixin'
import ButtonWrap from 'commonSchool/ButtonWrap'
import SearchWrap from 'commonSchool/SearchWrap'
import DigForm from './form'
import api from 'apiSchool/common'

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      searchData: {
        type: ''
      },
      showData: [
        { prop: 'seqNum', label: '排序', template: 'seqNum' },
        { prop: 'name', label: '名称' },
        { prop: 'type', label: '类型', template: 'professionType' },
        { prop: 'createTime', label: '创建时间' }
      ],
      degreeList: [],
      departmentList: [],
      index: '0',
      tableData: [],
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
        type: 2,
        parentId: ''
      },
      tableHeight: 0,
      row: {},
      type: null,
      parentId: ''
    }
  },
  created() {
    this.professionList({ type: 1 })
  },
  mounted() {
    this.getHeight()
  },
  filters: {
    professionType(val) {
      if (val === '') return ''
      switch (val) {
        case 1:
          return '学位'
        case 2:
          return '系别'
        case 3:
          return '专业'
      }
    }
  },
  methods: {
    getHeight() {
      this.tableHeight = window.innerHeight - 326
    },
    professionList(model) {
      api.professionList(model).then(res => {
        console.log(res.data)
        this.degreeList = res.data.data.list
        this.page.parentId = this.degreeList[this.index].id
        this.professionPage()
      })
    },
    professionPage() {
      api.professionPage(this.page).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    //添加
    add(type) {
      this.updateId = ''
      this.type = type
      if (type === 2) this.parentId = this.degreeList[this.index].id
      else this.parentId = ''
      this.digFormWrap = true
    },
    //修改
    update(type) {
      // this.updateId = this.tableList.id;
      if (type === 1) this.updateId = this.degreeList[this.index].id
      else this.updateId = this.row.id
      this.digFormWrap = true
    },
    //删除提示框
    deleteConfirm(type) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(type)
        })
        .catch(() => {
          return
        })
    },
    //提示
    delete(type) {
      let id = type === 1 ? this.degreeList[this.index].id : this.row.id
      api.professionDelete({ id }).then(res => {
        if (type === 1) this.professionList({ type: 1 })
        else this.professionPage()
        this.row = {}
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },

    digClose(flag, type) {
      this.updateId = ''
      this.digFormWrap = false
      if (type === 1) this.professionList({ type: 1 })
      else this.professionPage()
      this.row = {}
    },
    // 切换
    handleClick(tab, event) {
      if (this.index == tab.index) return
      this.index = tab.index
      this.row = {}
      this.page.parentId = this.degreeList[this.index].id
      this.page.pageNum = 1
      this.professionPage()
    },
    // 分页
    handleSizeChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageSize = val
      this.page.pageNum = 1
      this.professionPage()
    },
    handleCurrentChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageNum = val
      this.professionPage()
    },
    // 每行选中 提交到vuex 管理
    rowCilck(row) {
      console.log(row)
      this.row = row
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "@/assets/styles/element-variables.scss";
.blocks {
  margin-bottom: 0;
  padding: 10px 0;
  text-align: center;
}
.el-table__body tr.current-row > td {
  // background: #50bfff !important;
  background: $--color-primary !important;
  color: #fff !important;
}
</style>
