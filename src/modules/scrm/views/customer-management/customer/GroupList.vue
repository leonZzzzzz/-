<template>
  <div>
    <GoBack :title="'所在群聊'"></GoBack>
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
import GoBack from '../../../components/components/GoBack.vue'
import TableList from '../../../components/components/TableList.vue'
import TablePage from '../../../components/components/TablePage.vue'
export default {
  components: {
    GoBack,
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
          prop: 'name',
          title: '群名',
          align: 'center'
        },
        {
          prop: 'quantity',
          title: '群人数',
          align: 'center'
        },
        {
          prop: 'joinTime',
          title: '入群时间',
          align: 'center',
          formatter: (row) => {
            return row.joinTime ? row.joinTime.slice(0, row.joinTime.length - 3) : ''
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
      this.getCustomerDetailGroupPage({ id: this.pageId })
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCustomerDetailGroupPage({ id: this.pageId })
    },
    getTableHeight() {
      const TABLEOOSETTOP = document.querySelector('#table').offsetTop,
        TABLEPAGEHEIGHT = 52,
        GOBACKHEIGHT = 56,
        PAGEPADDINGBOTTOM = 20,
        TABLEPADDINGTOP = 20
      this.tableHeight =
        window.innerHeight - (TABLEOOSETTOP + TABLEPAGEHEIGHT + GOBACKHEIGHT + PAGEPADDINGBOTTOM + TABLEPADDINGTOP)
    },
    // ---获取数据---
    getCustomerDetailGroupPage(options) {
      this.isLoading = true
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.getCustomerDetailGroupPage(options).then((res) => {
        console.log(res.data.data.list)
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        this.isLoading = false
      })
    }
  },
  created() {
    this.pageId = this.$route.query.wxid
    this.getCustomerDetailGroupPage({ id: this.pageId })
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
</style>
