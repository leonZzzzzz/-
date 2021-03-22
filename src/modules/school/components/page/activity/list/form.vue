<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="880px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="overflow: auto;">
      <el-form
        :inline="true"
        class="demo-form-inline"
        style="padding: 10px 16px 0; border-bottom: 1px solid #eee; background: #fafbfc;"
      >
        <el-form-item label="名称" style="margin-bottom: 10px !important;">
          <el-input size="small" v-model="page.title" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px !important;">
          <el-button type="primary" size="small" @click="getTableList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataLoading"
        element-loading-text="数据加载中"
        height="500px"
        style="overflow-y: auto;"
        :data="tableData"
        highlight-current-row
        @row-click="vuexTableList"
      >
        <el-table-column prop="campaignName" label="名称"></el-table-column>
      </el-table>
      <div class="block" style="text-align: center; padding: 10px 0;">
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :disabled="campaign.id == null">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from 'apiSchool/common'
import SearchWrap from 'commonSchool/SearchWrap'

export default {
  components: {
    SearchWrap
  },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: '',
        code: '',
        iconUrl: '',
        info: '',
        seqNum: 0
      },
      loading: false,
      dataLoading: false,
      tableData: [],
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1,
        page: ''
      },
      campaign: {}
    }
  },
  created() {
    // this.getCampaignList();
  },
  watch: {
    visible(val) {
      if (val) {
        this.getTableList()
      } else {
        this.page = {
          total: 0,
          pageSize: 20,
          pageNum: 1
        }
        this.campaign = {}
      }
    }
  },
  methods: {
    //获取
    getTableList() {
      this.dataLoading = true
      api.getCampaignList(this.page).then(res => {
        console.log('getCampaignList ==', res.data)
        this.tableData = res.data.data.list
        console.log('数据', this.tableData)
        this.page.total = res.data.data.total
        this.dataLoading = false
      })
    },
    handleSizeChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getTableList()
    },
    handleCurrentChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageNum = val
      this.getTableList()
    },
    vuexTableList(row) {
      this.campaign = row
      console.log(this.campaign)
    },
    success() {
      this.$emit('get-campaign', this.campaign)
      this.close(false)
    },
    close(flag) {
      console.log(typeof flag == 'function')
      if (typeof flag == 'function') {
        this.$emit('close', false)
      } else {
        this.$emit('close', flag)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table__body tr.current-row > td {
  background: $--color-primary !important;
  color: #fff !important;
}
</style>
