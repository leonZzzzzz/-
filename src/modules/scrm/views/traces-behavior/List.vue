<template>
  <div class="page">
    <div class="xfo-btns">
      <el-button
        type="primary"
        size="small"
        @click="createTraces"
      >新建痕迹</el-button>
    </div>
    <table-list
      id="table"
      :tableData="tableData"
      :tableColumn="tableColumn"
      :tableHeight="tableHeight"
      v-loading="isLoading"
    ></table-list>
    <table-page
      :page="pageData"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    ></table-page>
  </div>
</template>

<script>
import TableList from '../../components/components/TableList.vue'
import TablePage from '../../components/components/TablePage.vue'
export default {
  components: { TableList, TablePage },
  created() {
    this.getActionTracePage()
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  },
  data() {
    return {
      // 表格数据
      isLoading: false,
      tableData: [],
      tableHeight: 400,
      tableColumn: [
        {
          prop: 'name',
          title: '名称',
          align: 'center'
        },
        {
          prop: 'content',
          title: '浏览内容',
          align: 'center',
          width: '250',
          formatter: row => {
            return (
              <div>
                {row.content}
                <div class={row.link ? 'show' : 'hide'}>
                  ，
                  <a class="look-details" href={this.baseUrl + row.link}>
                    查看详情
                  </a>
                </div>
              </div>
            )
          }
        },
        {
          prop: 'code',
          title: '标识代码',
          align: 'center'
        },
        {
          prop: 'params',
          title: '标识参数',
          align: 'center'
        },
        {
          prop: 'authType',
          title: '授权类型',
          align: 'center',
          formatter: row => {
            switch (row.authType) {
              case 63020:
                return '静默授权'
              case 63021:
                return '头像授权'
            }
          }
        },
        {
          prop: 'apiUrl',
          title: '拦截链接',
          align: 'center'
        },

        {
          prop: 'time',
          title: '记录频率(秒/次)',
          align: 'center'
        },

        {
          prop: 'updateTime',
          title: '修改时间',
          align: 'center'
        },
        {
          prop: 'createTime',
          title: '创建时间',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: row => {
            return (
              <el-button type="text" onClick={this.updateTraces.bind(this, row.id)}>
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
      this.getActionTracePage()
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getActionTracePage()
    },
    // 新建
    createTraces() {
      this.$router.push({
        path: '/main/scrm/traces-behavior/details'
      })
    },
    // 修改
    updateTraces(id) {
      this.$router.push({
        path: '/main/scrm/traces-behavior/details',
        query: {
          id
        }
      })
    },
    // 获取表格高度
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - (52 + 52 + 40)
    },
    // ---获取数据函数---
    // 获取行为痕迹数据
    getActionTracePage() {
      this.isLoading = true
      var options = {}
      options.pageSize = this.pageData.pageSize
      options.pageNum = this.pageData.pageNum
      this.$http.getActionTracePage(options).then(res => {
        this.tableData = res.data.data.list
        this.pageData.total = res.data.data.total
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .xfo-btns {
    padding-bottom: 20px;
  }
  .look-details {
    color: #294a7b;
    text-decoration: underline;
  }
  .show {
    display: inline-block;
  }
  .hide {
    display: none;
  }
}
</style>
