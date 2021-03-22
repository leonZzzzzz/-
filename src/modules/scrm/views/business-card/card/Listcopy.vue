<template>
  <div class="page">
    <table-list id="table" :tableData="tableData" :tableColumn="tableColumn" :tableHeight="tableHeight"></table-list>
    <table-page :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></table-page>
  </div>
</template>

<script>
import TableList from '../../../components/components/TableList.vue'
import TablePage from '../../../components/components/TablePage.vue'
import TableSearch from '../../../components/components/TableSearch.vue'
export default {
  components: {
    TableList,
    TablePage,
    TableSearch
  },
  data() {
    return {
      tableHeight: 400,
      tableData: [],
      tableColumn: [
        {
          prop: 'avatar',
          title: '头像',
          align: 'center',
          formatter: (row) => {
            return <el-image style="width:44px; height:44px" src={row.avatar} fit="cover"></el-image>
          }
        },
        {
          prop: 'name',
          title: '姓名',
          align: 'center'
        },
        {
          prop: 'position',
          title: '职位',
          align: 'center'
        },
        {
          prop: 'phone',
          title: '手机',
          align: 'center'
        },
        {
          prop: 'email',
          title: '邮箱',
          align: 'center'
        },
        {
          prop: 'address',
          title: '地址',
          align: 'center'
        },
        {
          prop: 'viewPersonQuantity',
          title: '浏览人数',
          align: 'center'
        },
        {
          prop: 'topQuantity',
          title: '置顶数量',
          align: 'center'
        },
        {
          prop: 'phraseQuantity',
          title: '点赞数量',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <el-button type="text" onClick={this.changeDetail.bind(this, row)}>
                修改
              </el-button>
            )
          }
        }
      ],
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  methods: {
    // ---页面渲染函数---
    // 分页函数
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getCropBusinessCard({})
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCropBusinessCard({})
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - 136
    },
    changeDetail(row) {
      this.$router.push(`/main/scrm/bussiness-card/card/detail?id=${row.id}`)
    },
    // ---获取数据---
    // 获取名片
    getCropBusinessCard(options) {
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.functions('getCropBusinessCard', options, (res) => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        console.log(res)
      })
    }
  },
  created() {
    this.getCropBusinessCard({})
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
  padding: 20px;
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
}
</style>
