<template>
  <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menuFilter" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/distribute-product/page'
      },
      searchForm: [{ label: '名称', formName: 'title', type: 'input' }],
      menu: [],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '商品',
          width: '400px',
          formatter: (row) => {
            return <QcProductItem img={this.imgHost + row.iconUrl} title={row.title}></QcProductItem>
          }
        },
        {
          label: '推广佣金',
          align: 'center',
          formatter: (row) => {
            return <div>￥{(row.sharerCommission / 100).toFixed(2)}</div>
          }
        },
        // {
        //   label: '推广积分',
        //   align: 'center',
        //   prop: 'sharerPoint'
        // },
        // {
        //   label: '销售佣金',
        //   align: 'center',
        //   formatter: row => {
        //     return <div>￥{(row.distributerCommission / 100).toFixed(2)}</div>
        //   }
        // },
        // {
        //   label: '销售积分',
        //   align: 'center',
        //   prop: 'distributerPoint'
        // },
        {
          label: '操作',
          width: '120px',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            if (!this.isStoreRole) return <span></span>
            return (
              <div>
                <el-button type="text" onClick={() => this.$router.push(`/main/sharer/mall/form?id=${row.id}`)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteDistributeShopping.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    // 当前登录是否是店铺角色
    isStoreRole() {
      return this.$store.state.isStoreRole
    },
    menuFilter() {
      let list = []
      if (this.isStoreRole) {
        list.unshift({
          type: 'primary',
          label: '添加',
          on: () => {
            this.$router.push('/main/sharer/mall/form')
          }
        })
      }
      return list
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
          this.$http.deleteSharerShopping({ id }).then(() => {
            this.$message.success('删除成功')
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
