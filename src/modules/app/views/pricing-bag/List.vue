<template>
  <div>
    <QcTable ref="table" :option="option" :column="column" :searchForm="searchForm" :menu="menu"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/appPricingBag/page'
      },
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.$router.push(`/main/app/pricing-bag/form`)
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '图标',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:60px;height:60px;"></el-image>
          }
        },
        {
          label: '类型',
          align: 'center',
          formatter: (row) => {
            return row.type == 1 ? '标准' : '插件'
          }
        },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '应用', prop: 'categoryName', align: 'center' },
        {
          label: '售价',
          align: 'center',
          formatter: (row) => {
            return row.price / 100
          }
        },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === -1 ? '私密' : '公开'
          }
        },
        // { label: '销量', prop: 'seqNum', align: 'center' },
        // { label: '排序', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' },
        {
          label: '操作',
          align: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  style="margin-right:10px"
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/app/pricing-bag/form?id=${row.id}`)
                  }}
                >
                  修改
                </el-button>
                <el-dropdown>
                  <el-button type="text">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div
                        onClick={() => {
                          this.updateStatusAppPricingBag(row.id, row.status == 1 ? -1 : 1)
                        }}
                      >
                        设为{row.status === 1 ? '私密' : '公开'}
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div onClick={this.deleteAppPricingBag.bind(this, row.id)}> 删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    updateStatusAppPricingBag(id, status) {
      this.$http.updateStatusAppPricingBag({ id, status }).then(() => {
        this.$refs.table.onSearchKeep()
      })
    },
    deleteAppPricingBag(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteAppPricingBag({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style></style>
