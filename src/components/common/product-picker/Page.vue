<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
import mixins from './product/mixins'
export default {
  mixins: [mixins],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      option: {
        url: 'api/v1.0/NavigationBar/page',
        isFull: false,
        height: 500
      },
      searchForm: [
        { label: '名称', formName: 'title', type: 'input', value: '' }
        // {
        //   label: '分类',
        //   formName: 'categoryId',
        //   type: 'select',
        //   value: '',
        //   option: [{ label: '全部', value: '' }]
        // }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '页面效果图',
          align: 'center',
          width: '200px',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.pageImg} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        { label: '分类', prop: 'categoryName', align: 'center', width: '100px' },
        {
          label: '类型',
          align: 'left',
          formatter: (row) => {
            return row.isTabBar ? '导航栏' : '内页'
          }
        },
        { label: '导航栏文字', prop: 'text', align: 'center', width: '300px' },
        { label: '跳转链接', prop: 'pagePath', align: 'left' },
        {
          label: '操作',
          align: 'center',
          width: '100px',
          formatter: (row) => {
            return (
              <el-button type="text" onClick={this.onSelectRow.bind(this, row)}>
                使用
              </el-button>
            )
          }
        }
      ]
    }
  },
  methods: {
    onSelectRow(row) {
      if (row.isTabBar) {
        this.$alert('请确保tabBar启用该页面，以免导致无法找到页面', '这是一个tabBar页面', {
          type: 'warning',
          confirmButtonText: '确定',
          callback: () => {
            let newRow = JSON.parse(JSON.stringify(row))
            newRow.pagePath = '/' + newRow.pagePath
            this.$emit('on-select-row', newRow)
          }
        })
      } else {
        this.$emit('on-select-row', row)
      }
    }
  }
}
</script>
