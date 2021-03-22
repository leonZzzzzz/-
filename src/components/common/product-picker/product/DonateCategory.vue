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
      isReady: false,
      type: 111,
      option: {
        url: 'api/admin/v1/category/page',
        isFull: true,
        height: 500
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        { formName: 'type', value: 111 }
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
      visible: false,
      id: '',
      parentId: ''
    }
  },
  created() {
    if (this.type === 1) {
      this.isReady = true
      this.parentId = 0
    } else {
      this.treeCategory()
    }
  },
  methods: {
    treeCategory() {
      this.$http.treeCategory({ type: this.type }).then((res) => {
        this.parentId = res.data.data[0].id
        this.searchForm.push({ formName: 'parentId', value: this.parentId })
        this.isReady = true
      })
    },
    onSelectRow(row) {
      row.pagePath = '/pagesCoWebs/donate/category/index?categoryId=' + row.id
      row.module = 'Donate'
      let data = {
        id: row.id,
        name: row.name,
        iconUrl: row.iconUrl,
        pagePath: row.pagePath,
        module: row.module
      }
      this.$emit('on-select-row', data)
    }
  }
}
</script>
