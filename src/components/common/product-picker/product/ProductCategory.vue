<template>
  <div>
    <QcTable
      v-if="isReady"
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isReady: true,
      option: {
        url: 'api/admin/v1/category/page',
        isFull: true,
        height: 500
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        { formName: 'type', value: 1 },
        { formName: 'parentId', value: '0' }
      ],
      menu: [],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '图标',
          prop: 'iconUrl',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} fit="cover" style="width:60px;height:60px;"></el-image>
          }
        },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '简介', prop: 'info', align: 'center' },
        { label: '排序号', prop: 'seqNum', align: 'center' },
        {
          label: '操作',
          align: 'center',
          width: 100,
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
      ],
      mallTypeConfig: {}
    }
  },
  created() {
    // this.getConfigItem()
  },
  methods: {
    // 获取当前应用的商城是多商家还是单商家
    getConfigItem(key) {
      this.$http.getConfigByKey('MULTI_STORE').then((res) => {
        this.mallTypeConfig = res.data.data || {}
      })
    },
    onSelectRow(row) {
      // 0是单商家 1是多商家
      // 跳到分类列表
      // let pagePath =  '/pages/category/index?categoryId=' + row.id
      // if (this.mallTypeConfig.value === '1') {
      //   row.pagePath = '/pages/categoryDouble/index?categoryId=' + row.id
      // }
      // 跳到热门商品列表
      row.pagePath = `/pagesMall/hot-product/index?categoryId=${row.id}&pageTitle=${row.name}`
      row.module = 'ProductCategory'
      let data = {
        id: row.id,
        name: row.name,
        iconUrl: row.iconUrl,
        pagePath: row.pagePath,
        module: row.module,
        pickerType: row.module
      }
      this.$emit('on-select-row', data)
    }
  }
}
</script>
