<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :search-form="searchForm" :column="column"></QcTable>
    <dig-form :visible="digFormWrap" :id="personId" @close="digClose"></dig-form>
    <Product :visible="productVisible" :person-id="personId" @close="productDialogClose"></Product>
    <ProductDetail
      :visible="productDetailVisible"
      :person-id="personId"
      @close="productDetailDialogClose"
    ></ProductDetail>
  </div>
</template>

<script>
import DigForm from './Form'
import Product from './Product'
import ProductDetail from './ProductDetail'
export default {
  components: { DigForm, Product, ProductDetail },
  data() {
    return {
      option: {
        url: 'api/admin/v1/person-ip/page'
      },
      menu: [
        {
          type: 'primary',
          label: '新增',
          on: () => {
            this.digFormWrap = true
          }
        }
      ],
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      column: [
        {
          label: '序号',
          type: 'index',
          align: 'center'
        },
        {
          label: '头像',
          prop: 'brandName',
          align: 'center',
          width: '150px',
          formatter: (row) => {
            return <img src={this.imgHost + row.headImage} width="50" height="50" />
          }
        },
        {
          label: '名称',
          prop: 'name',
          align: 'center',
          width: '150px'
        },
        {
          label: '简介',
          prop: 'introduction',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center'
        },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.personId = row.id
                    this.digFormWrap = true
                  }}
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.personId = row.id
                    this.productVisible = true
                  }}
                >
                  关联商品
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.personId = row.id
                    this.productDetailVisible = true
                  }}
                >
                  查看已关联商品
                </el-button>

                <el-button type="text" onClick={this.deleteConfirm.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      personId: '',
      digFormWrap: false,
      productVisible: false,
      productDetailVisible: false
    }
  },
  methods: {
    deleteConfirm(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteIp({ id: row.id }).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    digClose(update) {
      update && this.$refs.table.onSearchKeep()
      this.digFormWrap = false
      this.personId = ''
    },
    productDialogClose(row) {
      this.productVisible = false
      this.personId = ''
    },
    productDetailDialogClose(row) {
      this.productDetailVisible = false
      this.personId = ''
    }
  }
}
</script>
