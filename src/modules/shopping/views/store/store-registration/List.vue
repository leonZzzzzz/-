<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :search-menu="searchMenu" @get-list="onGetList">
      <el-tabs v-model="searchForm[0].value" @tab-click="onSearch" type="card" style="margin:0 15px">
        <el-tab-pane label="全部" name=" "></el-tab-pane>
        <el-tab-pane label="待支付" name="0"></el-tab-pane>
        <el-tab-pane label="待审核" name="3"></el-tab-pane>
        <el-tab-pane label="审核通过" name="1"></el-tab-pane>
        <el-tab-pane label="审核不通过" name="2"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="name" label="店铺名称" align="center"></el-table-column>
        <el-table-column prop="categoryName" label="商品类目" align="center"></el-table-column>
        <el-table-column label="法人身份证(正面)" align="center">
          <template slot-scope="scope">
            <el-image :src="imgHost + scope.row.idCardFrontUrl" style="width:50px;height:50px">
              <div slot="error" class="el-image__error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="法人身份证(反面)" align="center">
          <template slot-scope="scope">
            <el-image :src="imgHost + scope.row.idCardBackUrl" style="width:50px;height:50px">
              <div slot="error" class="el-image__error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="营业执照" align="center">
          <template slot-scope="scope">
            <el-image :src="imgHost + scope.row.businessLicenseUrl" style="width:50px;height:50px">
              <div slot="error" class="el-image__error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="personInCharge"></el-table-column>
        <el-table-column label="联系电话" align="center" prop="mobile"></el-table-column>
        <el-table-column label="申请时间" width="100px" align="center" prop="createTime"></el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <div>
              {{ { 0: '待支付', 1: '审批通过', 2: '审批不通过', 3: '待审核' }[scope.row.auditStatus] }}
              <p v-if="scope.row.auditStatus == 2">{{ scope.row.auditMsg }}</p>
            </div>
          </template></el-table-column
        >
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 3">
              <el-button type="text" @click="auditStoreSuccess(scope.row.id)">
                审核通过
              </el-button>
              <el-button type="text" @click="auditStoreStatus(scope.row.id)">
                审核不通过
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </QcTable>
    <el-dialog
      title="选择渠道"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      :visible="visible"
      :before-close="onClose"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="100px">
        <el-form-item label="选择渠道" prop="liveChannelId">
          <el-select v-model="model.liveChannelId">
            <el-option v-for="item in channelList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="保证金级别" prop="margin">
          <el-select v-model="model.margin">
            <el-option
              v-for="item in margins"
              :label="item.value"
              :value="item.key"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">审核通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/storeApply/page'
      },
      searchForm: [
        {
          formName: 'auditStatus',
          value: '3'
        },
        { value: '', formName: 'storeName', type: 'input', label: '店铺名称' },
        { value: '', formName: 'mobile', type: 'input', label: '手机号码' },
        {
          type: 'date-picker',
          formName: 'startTime_endTime',
          el: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd'
          },
          label: '申请时间',
          value: ''
        }
      ],
      searchMenu: [
        {
          type: 'export',
          label: '导出',
          url: this.$projectUrl + '/api/admin/v1/storeApply/export?'
        }
      ],
      tableData: [],
      model: {
        type: this.type,
        name: '',
        info: '',
        seqNum: '',
        iconUrl: '',
        margin: '',
        liveChannelId: '',
        isDisplay: true
      },
      margins: [],
      channelList: [],
      visible: false,
      flag: false
    }
  },
  created() {
    // this.listBaseConfigByParentId()
    // this.pageChannel()
  },
  methods: {
    exportCust(currt, search) {
      this.$confirm('是否导出当前列表', '操作提示', {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.open(this.$projectUrl + '/api/admin/v1/storeApply/export' + qs.stringify(search))
      })
    },
    onGetList(list) {
      this.tableData = list
    },
    onSearch(v) {
      this.searchForm[0].value = v.name
      this.$refs.table.transformSearchForm().then(() => {
        this.$refs.table.onSearch()
      })
    },
    pageChannel() {
      this.$http.get('api/admin/v1/liveChannel/page').then((res) => {
        this.channelList = res.data.data.list
      })
    },
    getTree(row) {
      this.model = JSON.parse(JSON.stringify(row))
      this.visible = true
    },
    listBaseConfigByParentId() {
      this.$http.listBaseConfigByParentId({ parentId: 'PLATFORM_SERVICE_FEE_SETTING' }).then((res) => {
        console.log(res.data)
        // this.margins = res.data.data
        this.margins = res.data.data.map((item) => {
          item.value = (parseFloat(item.value) / 100).toString()
          return item
        })
      })
    },
    auditStoreStatus(id) {
      this.$prompt('', '请输入审核不通过原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '审核不通过原因'
      })
        .then(({ value }) => {
          this.$http.auditStoreStatus({ auditStatus: 2, notPassReason: value, id }).then(() => {
            this.$message.success('操作成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    auditStoreSuccess(id) {
      this.$confirm('确认通过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .auditStoreStatus({
              auditStatus: 1,
              id
            })
            .then(() => {
              this.$message.success('操作成功')
              this.$refs.table.onSearchKeep()
            })
        })
        .catch(() => {})
    },

    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          var id = this.model.id
          this.$http
            .auditStoreStatus({
              liveChannelId: this.model.liveChannelId,
              margin: this.model.margin,
              auditStatus: 1,
              id
            })
            .then(() => {
              this.onClose()
              this.$message.success('操作成功')
              this.$refs.table.onSearchKeep()
            })
        }
      })
    },
    onClose() {
      this.visible = false
      this.model = this.$options.data().model
      this.model.type = this.type
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
    }
  }
}
</script>
