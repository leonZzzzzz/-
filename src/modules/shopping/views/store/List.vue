<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
// import { Collapse } from 'element-ui'
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/storeApply/pageStore'
      },
      numberValidateForm: {
        days: ''
      },
      chargesVisible: false,
      searchForm: [
        {
          type: 'select',
          formName: 'categoryId',
          label: '经营类目',
          option: [{ value: '', label: '请选择' }],
          value: ''
        },
        {
          type: 'select',
          formName: 'storeStatus',
          label: '店铺状态',
          option: [
            { value: '1', label: '正常' },
            { value: '4', label: '已禁用' },
            { value: '', label: '所有' }
          ],
          value: '1'
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
          label: '入驻时间',
          value: ''
        }
      ],
      menu: [
        {
          type: 'export',
          label: '导出',
          url: this.$projectUrl + '/api/admin/v1/store/registration/exportStore'
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '50px' },
        { prop: 'name', label: '店铺名称', align: 'center', width: '200px' },
        { prop: 'categoryName', label: '经营类目', align: 'center', width: '100px' },
        {
          label: '保证金级别(元)',
          formatter: (row) => {
            return [row.earnestMoney] / 100
          },
          align: 'center',
          width: '150px'
        },
        {
          label: '法人身份证(正面)',
          formatter: (row) => {
            return (
              <div>
                <el-image
                  fit="cover"
                  style="width:50px;height:50px;"
                  src={this.imgHost + row.idCardFrontUrl}
                  preview-src-list={[this.imgHost + row.idCardFrontUrl]}
                >
                  <div slot="error" class="el-image__error">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </div>
            )
          },
          align: 'center',
          width: '100px'
        },
        {
          label: '法人身份证(背面)',
          formatter: (row) => {
            return (
              <el-image
                fit="cover"
                style="width:50px;height:50px;"
                src={this.imgHost + row.idCardBackUrl}
                preview-src-list={[this.imgHost + row.idCardBackUrl]}
              >
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            )
          },
          align: 'center',
          width: '100px'
        },
        {
          label: '营业执照',
          formatter: (row) => {
            return (
              <div>
                <el-image
                  fit="cover"
                  style="width:50px;height:50px;"
                  src={this.imgHost + row.businessLicenseUrl}
                  preview-src-list={[this.imgHost + row.businessLicenseUrl]}
                >
                  <div slot="error" class="el-image__error">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </div>
            )
          },
          align: 'center',
          width: '80px'
        },
        { prop: 'personInCharge', label: '联系人', align: 'center' },
        { prop: 'mobile', label: '联系人电话', align: 'center' },
        { prop: 'auditMsg', label: '店铺状态', align: 'center' },
        {
          width: '100px',
          prop: 'createTime',
          label: '入驻时间',
          align: 'center'
        },
        {
          formatter: (row) => {
            return (
              <div>
                {false && (
                  <el-button
                    type="text"
                    onClick={() => {
                      this.visible = true
                      this.model.id = row.id
                    }}
                  >
                    修改渠道
                  </el-button>
                )}
              </div>
            )
          },
          label: '操作',
          width: '100px',
          align: 'center'
        }
      ],
      visible: false,
      channelList: [],
      model: {
        type: ''
      }
    }
  },
  created() {
    this.listStoreCategory()
    // 获取系统配置
    // this.$http.get('api/admin/v1/liveChannel/page').then(res => {
    //   this.channelList = res.data.data.list
    // })
  },
  methods: {
    listStoreCategory() {
      this.$http.listStoreCategory({ type: 20 }).then((res) => {
        res.data.data.map((item) => {
          this.searchForm[0].option.push({ value: item.id, label: item.name })
        })
      })
    },
    updateSelective() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.$http.updateSelective(this.model).then((res) => {
            this.$message.success('修改成功')
            this.onClose()
            this.$refs.table.onSearchKeep()
          })
        }
      })
    },
    onClose() {
      this.clearForm('model')
      this.visible = false
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteStoresss({ id }).then(() => {
            this.$message.success('删除成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    },
    exportStore() {
      location.href = this.$projectUrl + '/api/admin/v1/store/registration/exportStore'
    }
  }
}
</script>
