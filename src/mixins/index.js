import api from 'api/config'

export const TABLE = {
  data() {
    return {
      tableData: [],
      search: {
        pageNum: 1,
        pageSize: 20,
      },
      loading: false,
    }
  },
  methods: {
    /**
     * 获取列表数据
     */
    onSearch() {
      this.loading = true
      api.get(this.tableApi, this.search).then(res => {
        this.tableData = res.data.data.list
        this.search.total = res.data.data.total
        this.loading = false
      })
    },
    /**
     * 刷新搜索
     */
    onSearchRefresh() {
      this.search.pageNum = 1
      this.onSearch()
    },
    /**
     * 修改每页条数
     */
    onChangeSize(size) {
      this.search.pageSize = size
      this.search.pageNum = 1
      this.onSearch()
    },
    /**
     * 修改页码
     */
    onChangePage(num) {
      this.search.pageNum = num
      this.onSearch()
    },
  },
}
