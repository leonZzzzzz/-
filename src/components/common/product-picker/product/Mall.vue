<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
import mixins from './mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      option: {
        url: 'api/admin/mall/v1/product/page?salesStatus=0',
        isFull: true,
        height: 500
      },
      searchForm: [
        { label: '商品名称', type: 'input', formName: 'name' }
        // { formName: 'isSell', value: true }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: 50 },
        {
          label: '商品',
          width: '350px',
          formatter: (row) => {
            return (
              <div class="product-item">
                <img class="cover" src={this.imgHost + row.iconUrl} width="55px" height="55px" />
                <div>
                  <p class="name">{row.name}</p>
                  <p class="price">价格：￥{row.price / 100}</p>
                </div>
              </div>
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
          prop: 'saleQty',
          align: 'center',
          width: '150px'
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
          label: '操作',
          align: 'center',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.onSelectRow.bind(this, row)}>
                  使用
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    onSelectRow(row) {
      row.pagePath = `/pagesMall/product/detail/index?id=${row.id}&storeId=${row.storeId}`
      row.module = 'product'
      this.$emit('on-select-row', row)
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
