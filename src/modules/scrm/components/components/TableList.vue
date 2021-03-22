<template>
  <!-- 表格内容 xfo-->
  <!-- 
    使用方式
    1. 引入组件 
    示例：
    import TableList from '../../../components/components/TableList.vue'
    2. 使用组件
    示例：
    <TableList :tableData="tableData" :tableColumn="tableColumn"></TableList>
    使用方法
    // 表格数据
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
      tableColumn: [
        {
          prop: 'date',
          title: '日期',
          align: 'center'
        },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row) => {
            return <el-button type="text">详情</el-button>
          }
          formatter: (row) => {
            return row.createAtToTime ?  row.createAtToTime.slice(0, row.createAtToTime.length - 3) : "" 
          }
          formatter: row => {
            return (
              <div>
                <el-button type="text" onClick={this.showSpeechEditDialog.bind(this, row)}>
                  修改
                  </el-button>
                <el-button type="text" onClick={this.deleteSpeech.bind(this, row.id)}>
                  删除
                  </el-button>
              </div>
            )
          }
        }
      ],
      tableType  多选 selection
 -->
  <div>
    <div class="tableContent">
      <el-table
        :ref="tableRef"
        :data="tableData"
        style="width: 100%"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
        v-loading="isLoading"
        @selection-change="selectionChange"
      >
        <el-table-column v-if="tableType == 'selection'" type="selection" width="55" align="center"> </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.title"
          :align="item.align"
          v-bind="item"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableColumn: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableHeight: {
      type: Number,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tableType: {
      type: String,
      default: ''
    },
    tableRef: {
      type: String,
      default: 'table-list'
    }
  },
  methods: {
    selectionChange(selection) {
      this.$emit('selectionChange', selection)
    },
    tableRefSuccess() {
      return this.$refs[this.tableRef]
    },
  }
}
</script>

<style lang="scss" scoped></style>
