import { mapGetters } from 'vuex'
export const tableMixin = {
  data() {
    return {
      domHeight: 0,
      wrapHeight: 0
    }
  },
  computed: {
    ...mapGetters({
      tableList: 'tableOld/tableList',
      tableId: 'tableOld/tableId',
    })
  },
  methods: {
    searchKeep() {
      this.$refs.table.searchTableListKeep(this.searchData)
    },
    search() {
      this.$refs.table.searchTableList(this.searchData)
    },
    //  取消单选
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row)
    },
    // 取消多选
    clearSelection() {
      this.$refs.table.clearSelection()
    }
  }
}
