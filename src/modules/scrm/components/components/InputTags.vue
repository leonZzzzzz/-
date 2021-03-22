<template>
  <!-- 选择显示成员搜索 参考声明周期设置用户 搜索用户 xfo-->
  <!-- 
    import InputTags from '../../components/components/InputTags.vue'
    <input-tags style="margin-top: 2px" placeholder="请选择成员" @success="inputTagsSuccess"></input-tags>
    inputTagsSuccess(val) {
          console.log(val)
    },
    val 为选中返回的成员id
   -->
  <div class="input-tags">
    <el-select
      v-model="tagsList"
      multiple
      collapse-tags
      size="small"
      placeholder="请选择"
      popper-class="myPopper"
      @visible-change="hidePopper"
      @focus="showDialog"
      @change="selectChange"
      clearable
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <Dialog :configure="configure" height="500px" @closeDialog="closeDialog" @success="success">
      <table-list
        :tableData="tableData"
        :tableColumn="tableColumn"
        :tableHeight="448"
        tableRef="table"
        ref="tableList"
        tableType="selection"
        @selectionChange="selectionChange"
      ></table-list>
      <div style="width: 100%; overflow: hidden">
        <table-page :page="pageData" @sizeChange="onSizeChange" @pageChange="onPageChange"></table-page>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './Dialog'
import TableList from './TableList'
import TablePage from './TablePage'
export default {
  props: {
    placeholder: {
      type: String,
      default: '请选择成员'
    }
  },
  components: {
    Dialog,
    TableList,
    TablePage
  },
  watch: {
    'configure.visible': function(a, b) {
      if (a) {
        if (this.tagsList) {
          let selectionList = []
          this.tagsList.forEach((tag) => {
            this.tableData.forEach((row) => {
              if (tag == row.id) {
                selectionList.push(row)
              }
            })
          })
          this.$nextTick(() => {
            this.setSelection(selectionList)
          })
        }
      }
    }
  },
  data() {
    return {
      tagsList: [],
      options: [],
      selectionList: [],
      // 弹窗
      configure: {
        title: '选择成员',
        visible: false,
        width: '1000px'
      },
      // 表格
      tableData: [],
      tableColumn: [
        {
          prop: 'avatar',
          title: '头像',
          align: 'center',
          formatter: (row) => {
            return <el-image style="width: 44px; height: 44px" src={row.avatar} fit="cover"></el-image>
          }
        },
        {
          prop: 'name',
          title: '姓名',
          align: 'center'
        },
        {
          prop: 'gender',
          title: '性别',
          align: 'center',
          formatter: (row) => {
            return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知'
          }
        },
        {
          prop: 'mobile',
          title: '手机',
          align: 'center'
        }
      ],
      pageData: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  methods: {
    hidePopper() {
      let dom = document.getElementsByClassName('myPopper')[0]
      dom.style.visibility = 'hidden'
    },
    // 弹窗
    closeDialog() {
      this.configure.visible = false
    },
    success() {
      this.tagsList = this.selectionList
      this.configure.visible = false
      this.selectChange()
    },
    selectChange() {
      this.$emit('success', this.tagsList)
    },
    showDialog() {
      this.configure.visible = true
    },
    // 表格
    selectionChange(selection) {
      this.selectionList = []
      selection.forEach((item) => {
        this.selectionList.push(item.id)
      })
    },
    setSelection(rows) {
      let tableDom = this.$refs.tableList.tableRefSuccess()
      if (rows) {
        rows.forEach((row) => {
          tableDom.toggleRowSelection(row)
        })
      }
    },
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.pageData.pageNum = 1
      this.getCustomerData()
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getCustomerData()
    },
    // 获取成员数据
    getCustomerData() {
      this.functions('getDepartmentTreeMember', this.pageData, (res) => {
        let data = res.data.data.list
        this.pageData.total = res.data.data.total
        this.tableData = data
        if (data.length == 0) {
          return
        }
        this.options = []
        data.forEach((item) => {
          this.options.push({
            value: item.id,
            label: item.name
          })
        })
      })
    }
  },
  created() {
    this.getCustomerData()
  }
}
</script>

<style lang="scss" scoped></style>
