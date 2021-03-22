<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/product/page'
      },
      searchForm: [
        { label: '商品名称', type: 'input', formName: 'name' },
        // { label: '商品品牌', type: 'input', formName: 'brandName' },
        // { label: '商品分类', type: 'input', formName: 'categoryName' },
        { label: '商品分类', type: 'select', formName: 'categoryName', option: [] },
        {
          label: '商品状态',
          type: 'select',
          formName: 'salesStatus',
          option: [
            { value: '', label: '全部' },
            { value: '0', label: '已上架' },
            { value: '2', label: '已下架' },
            { value: '1', label: '已售罄' }
          ],
          value: ''
        }
      ],
      column: [
        {
          type: 'selection'
        },
        {
          label: '商品',
          width: '400px',
          formatter: (row) => {
            return (
              <QcProductItem img={this.imgHost + row.iconUrl} title={row.name}>
                价格：￥{row.price / 100}
              </QcProductItem>
            )
          }
        },
        // {
        //   label: '品牌',
        //   prop: 'brandName',
        //   align: 'center'
        // },
        {
          label: '分类',
          prop: 'categoryName',
          align: 'center',
          width: '150px'
        },
        {
          label: '库存',
          prop: 'qty',
          align: 'center',
          width: '150px'
        },
        {
          label: '销量',
          align: 'center',
          width: '150px',
          prop: 'saleQty'
        },
        {
          label: '状态',
          prop: 'isSell',
          align: 'center',
          formatter: (row) => {
            return row.isSell ? '上架' : '下架'
          },
          width: '150px'
        },
        {
          label: '排序',
          prop: '',
          align: 'center',
          width: '150px',
          formatter: (row) => {
            return (
              <div style="color:red;cursor: pointer;" onClick={this.productSeqNumUpdate.bind(this, row.id, row.seqNum)}>
                {row.seqNum}
              </div>
            )
          }
        },
        {
          label: '操作',
          fixed: 'right',
          width: '140px',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.jumpProductDetail.bind(this, 1, row.id)}>
                  修改
                </el-button>
                {this.isStoreRole && (
                  <el-button type="text" onClick={this.jumpProductDetail.bind(this, 2, row.id)}>
                    复制
                  </el-button>
                )}
                {this.$store.state.appTypeList.some((item) => item === 3) && (
                  <WxQRCode
                    text
                    label="分享"
                    options={{ name: 'product', scene: row.id, storeId: row.storeId }}
                  ></WxQRCode>
                )}
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
    // 表格操作按钮项
    menu() {
      let menu = [
        {
          label: '上架',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.productSell(ids.join('_'), true)
          }
        },
        {
          label: '下架',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: (currentRow, search, selectionRow) => {
            console.log(selectionRow)
            let ids = selectionRow.map((item) => {
              return item.id
            })
            this.productSell(ids.join('_'), false)
          }
        },
        {
          label: '删除',
          disabled: ({ selectionRow }) => selectionRow.length == 0,
          on: this.deleteConfirm
        }
      ]
      // if (this.isStoreRole) {
      menu.unshift({
        type: 'primary',
        label: '新增',
        on: () => {
          this.jumpProductDetail(0)
        }
      })
      // }
      return menu
    }
  },
  methods: {
    productSell(ids, isSell) {
      this.$http.productSell({ ids, isSell }).then(() => {
        this.selectProduct = []
        this.$refs.table.onSearchKeep()
      })
    },
    pageCategory() {
      this.$http.treeCategory({ type: 1 }).then((res) => {
        let searchItem = this.searchForm.find((item) => item.label === '商品分类')
        searchItem &&
          res.data.data.map((item) => {
            searchItem.option.push({ lable: item.name, value: item.name })
          })
      })
    },
    productSeqNumUpdate(id, num) {
      this.$prompt('', '修改商品排序位置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: num
      })
        .then(({ value }) => {
          this.$http.productSeqNumUpdate({ id, seqNum: value }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    deleteConfirm(row, search, selectionRow) {
      let ids = selectionRow.map((item) => {
        return item.id
      })
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteProduct({ ids: ids.join('_') }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    /**
     * 商品的 添加 修改 拷贝
     * @param {number} type 类型 0 添加，1修改，2拷贝
     */
    jumpProductDetail(type, id) {
      switch (type) {
        case 0:
          this.$router.push('list/form')
          break
        case 1:
          this.$router.push(`list/form?id=${id}`)
          break
        case 2:
          this.$router.push(`list/form?id=${id}&copy=true`)
          break
      }
    }
  }
}
</script>

<style lang="scss" scope>
.product-item {
  display: flex;
  align-items: flex-start;
  .cover {
    margin-right: 10px;
  }
  .name {
    height: 32px;
    line-height: 15px;
    margin-bottom: 10px;
  }
  .price {
    font-size: 14px;
    line-height: 1;
  }
}
</style>
