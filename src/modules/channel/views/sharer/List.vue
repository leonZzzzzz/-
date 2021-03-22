<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1.1/sharer/page'
      },
      searchForm: [
        { label: '已上架', formName: 'auditStatus', value: 'audited' },
        { label: '名称', formName: 'name', type: 'input' },
        { label: '手机', formName: 'mobile', type: 'input' },
        { label: '等级', formName: 'level', type: 'input' }
      ],
      menu: [
        {
          type: 'export',
          label: '导出',
          url: this.$projectUrl + '/api/admin/v1.1/sharer/export'
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center', width: 80 },
        {
          label: '姓名',
          align: 'left',
          prop: 'name'
        },
        {
          label: '手机',
          align: 'center',
          prop: 'mobile'
        },
        {
          label: '等级',
          align: 'center',
          prop: 'level'
        },
        {
          label: '客户数',
          align: 'center',
          prop: 'customerQuantity'
        },
        {
          label: '推广佣金',
          align: 'center',
          formatter: (row) => {
            return <div>￥{(row.commission / 100).toFixed(2)}</div>
          }
        },
        {
          label: '商户',
          align: 'left',
          prop: 'store'
        },
        {
          label: '注册时间',
          align: 'left',
          prop: 'createTime'
        }
        // {
        //   label: '操作',
        //   width: '120px',
        //   align: 'center',
        //   fixed: 'right',
        //   formatter: row => {
        //     return (
        //       <div>
        //         <el-button
        //           type="text"
        //           onClick={() =>
        //             this.$router.push(`/main/mall/product/distribute-product/form?id=${row.id}`)
        //           }
        //         >
        //           修改
        //         </el-button>
        //         <el-button type="text" onClick={this.deleteDistributeShopping.bind(this, row.id)}>
        //           删除
        //         </el-button>
        //       </div>
        //     )
        //   }
        // }
      ]
    }
  },
  methods: {
    deleteDistributeShopping(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteDistributeShopping({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {
          return
        })
    }
  }
}
</script>

<style></style>
