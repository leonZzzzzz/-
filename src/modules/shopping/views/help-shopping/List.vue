<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/helpShopping/page'
      },
      searchForm: [{ label: '名称', formName: 'title', type: 'input' }],
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.$router.push('/main/mall/product/help-shopping/form')
          }
        }
      ],
      // TODO: 助力列表：缺少 封面 原价 销量
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '商品',
          width: '500px',
          formatter: (row) => {
            return (
              <QcProductItem img={this.imgHost + row.iconUrl} title={row.title}>
                有效期：{row.startTime} 至 {row.endTime}
              </QcProductItem>
            )
          }
        },
        { label: '状态', prop: 'statusName', align: 'center' },
        {
          label: '助力价',
          align: 'center',
          formatter: (row) => {
            return <div>￥{row.price / 100}</div>
          }
        },
        {
          label: '销售价',
          align: 'center',
          formatter: (row) => {
            return <div>￥{row.productPrice / 100}</div>
          }
        },
        { label: '销量', prop: 'salesQty', align: 'center', width: '100px' },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' },
        {
          label: '操作',
          prop: '',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.$router.push(`/main/mall/product/help-shopping/form?id=${row.id}`)}
                >
                  修改
                </el-button>
                <el-popover width="180" placement="left" trigger="hover">
                  <img
                    src={`${this.baseUrl}/api/admin/mall/v1/helpShopping/wxMiniCode?id=${row.id}`}
                    style="width:180px;height:180px;"
                  />
                  <el-button slot="reference" type="text" style="margin:0 10px;">
                    二维码
                  </el-button>
                </el-popover>
                <el-button type="text" onClick={this.deleteHelpShopping.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    deleteHelpShopping(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteHelpShopping({ id }).then(() => {
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
