<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/groupShopping/page'
      },
      searchForm: [{ label: '名称', formName: 'title', type: 'input' }],
      menu: [
        {
          type: 'primary',
          label: '添加',
          on: () => {
            this.$router.push('/main/mall/product/group-shopping/form')
          }
        }
      ],
      // TODO: 拼团列表：缺少 销量 封面
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
        {
          label: '团长价',
          align: 'center',
          formatter: (row) => {
            return <div>￥{row.organizerPrice / 100}</div>
          }
        },
        {
          label: '参团价',
          align: 'center',
          formatter: (row) => {
            return <div>￥{row.price / 100}</div>
          }
        },
        { label: '销量', prop: 'salesQty', align: 'center' },
        { label: '状态', prop: 'statusName', align: 'center' },
        {
          label: '是否上架',
          align: 'center',
          formatter: (row) => {
            return row.isSell ? '是' : '否'
          }
        },
        { label: '拼团有效期', prop: 'duration', align: 'center', width: '100px' },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100x' },
        {
          label: '操作',
          width: '140px',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.$router.push(`/main/mall/product/group-shopping/form?id=${row.id}`)}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteGroupShopping.bind(this, row.id)}>
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
    deleteGroupShopping(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteGroupShopping({ id }).then(() => {
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
