<template>
  <div>
    <div class="page">
      <div class="table" id="table">
        <TableList
          :tableData="tableData"
          :tableColumn="tableColumn"
          :tableHeight="tableHeight"
          :isLoading="isLoading"
        ></TableList>
      </div>
      <div class="tablePage">
        <TablePage :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></TablePage>
      </div>
    </div>
  </div>
</template>
<script>
import TableList from '../../../components/components/TableList.vue'
import TablePage from '../../../components/components/TablePage.vue'
export default {
  components: {
    TableList,
    TablePage
  },
  data() {
    return {
      // ---组件数据---
      // 表格数据
      tableData: [],
      tableColumn: [
        {
          prop: 'content',
          title: '动态内容',
          align: 'center',
          formatter: (row) => {
            return <div class="xfo-content" domPropsInnerHTML={row.content}></div>
          }
        },
        {
          prop: 'createTime',
          title: '添加时间',
          align: 'center',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        }
      ],
      tableHeight: 400,
      isLoading: false,
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      // ---渲染数据---
      pageId: ''
    }
  },
  methods: {
    // ---渲染函数---
    changeNav(val) {
      console.log(val)
    },
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getCustomerRecordList({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCustomerRecordList({})
    },
    getTableHeight() {
      const TABLEOOSETTOP = document.querySelector('#table').offsetTop,
        TABLEPAGEHEIGHT = 52,
        PAGEPADDINGBOTTOM = 20,
        TABLEPADDINGTOP = 20
      this.tableHeight =
        window.innerHeight - (TABLEOOSETTOP + TABLEPAGEHEIGHT + PAGEPADDINGBOTTOM + TABLEPADDINGTOP + 56)
    },
    // ---获取数据---
    getCustomerRecordList(options) {
      this.isLoading = true
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      options.customerId = this.pageId
      options.type = 0
      this.$http.getCustomerRecordList(options).then((res) => {
        console.log(res.data.data.list)
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        this.isLoading = false
      })
    }
  },
  created() {
    this.pageId = this.$route.query.id
    this.getCustomerRecordList({})
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.page {
  background-color: #ffffff;
  .table {
    padding: 20px 20px 0;
  }
  .tablePage {
    padding: 0 20px;
  }
}
.xfo-content {
  ::v-deep a {
    color: #294a7b;
  }
}
</style>
