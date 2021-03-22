<template>
  <div class="qc-table">
    <div class="page_top" v-if="menu.length > 0">
      <!-- 功能按钮 -->
      <el-form inline :size="tableConfig.size" class="qc-menu-form" v-if="menu.length > 0">
        <el-form-item v-for="(menuButton, index) in menu" :key="index">
          <up-load-file
            v-if="menuButton.type == '导入'"
            :id="menuButton.id"
            :data="menuButton.data || {}"
            :title="menuButton.title || '导入'"
            :size="menuButton.size || 'small'"
            :url="menuButton.api"
            icon="el-icon-upload"
            @file-success="fileSuccess"
            style="margin: 0 10px 10px 0"
          ></up-load-file>
          <el-form-item v-else-if="menuButton.type == 'export'" style="margin-bottom: 0px !important">
            <el-button type="primary" @click="onExport(menuButton.url)">{{ menuButton.label || '导出' }}</el-button>
          </el-form-item>
          <el-button
            v-else
            :disabled="'disabled' in menuButton ? menuButton.disabled({ currentRow, selectionRow, tableData }) : false"
            :type="menuButton.type"
            @click="menuButton.on(currentRow, search, selectionRow)"
            >{{ menuButton.label }}</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 查询表单 -->
      <el-form
        class="qc-search-form"
        v-if="searchForm.length > 0 && tableConfig.showSearchAndReset"
        inline
        :model="search"
        :size="tableConfig.size"
        ref="search"
        label-width="70px"
        label-position="right"
      >
        <template v-for="(item, index) in searchForm">
          <el-form-item
            :key="index"
            :label-width="item.labelWidth"
            :label="item.label"
            :prop="item.formName"
            v-if="item.type === 'input'"
          >
            <el-input
              v-model="search[item.formName]"
              @input="inputSearchFun"
              :placeholder="item.placeholder"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :key="index"
            :label-width="item.labelWidth"
            :label="item.label"
            :prop="item.formName"
            v-else-if="item.type === 'select'"
          >
            <el-select v-model="search[item.formName]">
              <el-option
                v-for="option in item.option"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :key="index"
            :label-width="item.labelWidth"
            :label="item.label"
            :prop="item.formName"
            v-if="item.type === 'time-picker'"
          >
            <el-time-select v-model="search[item.formName]" v-bind="item.el"></el-time-select>
          </el-form-item>
          <el-form-item
            :key="index"
            :label-width="item.labelWidth"
            :label="item.label"
            :prop="item.formName"
            v-if="item.type === 'date-picker'"
          >
            <el-date-picker v-model="search[item.formName]" v-bind="item.el"></el-date-picker>
          </el-form-item>
        </template>
        <!-- <el-form-item v-if="tableConfig.showSearchAndReset">
        <el-button type="primary" @click="onSearch()">查询</el-button>
        <el-button @click="onSearchFormReset('search')">重置</el-button>
      </el-form-item> -->
      </el-form>
    </div>
    <div class="page_table">
      <!-- 表格数据 -->
      <el-table
        v-if="column.length > 0"
        id="table"
        size="medium"
        :data="tableData"
        :height="tableConfig.isFull ? height : tableConfig.height"
        @select="onSelect"
        @select-all="onSelect"
        @row-click="onRowClick"
        style="width: 100%"
        v-loading="isLoading"
        v-bind="el"
        :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
      >
        <el-table-column v-for="(item, index) in column" :key="index" v-bind="item" align="center"></el-table-column>
        <slot></slot>
      </el-table>
      <div v-else id="table" :style="{ height: height + 'px', overflow: 'auto' }">
        <slot></slot>
      </div>
      <div class="pagination" v-if="tableConfig.showPagination">
        <div class="pagination-count">
          <span class="count">共：{{ search.total }}&nbsp;条数据</span>
          <span class="selection" v-if="selectionRow.length > 0">已选中：{{ selectionRow.length }}&nbsp;条</span>
        </div>
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-sizes="[15, 30, 50]"
          :page-size="search.pageSize"
          :current-page="search.pageNum"
          :total="search.total"
          layout="prev, pager, next, sizes"
          background
          style="margin-right: -26px"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const tableConfig = {
  // 接口地址
  url: '',
  // 组件的尺寸
  size: 'small',
  // 查询/重置按钮
  showSearchAndReset: true,
  // 是否需要显示分页
  showPagination: true,
  // table 是否充满屏幕
  isFull: true,
  // table 的高度，isFull 为false 才生效
  height: 400,
  response: {
    list: 'data.data.list',
    total: 'data.data.total'
  }
}
import qs from 'qs'

export default {
  props: {
    // 配置项
    option: {
      type: Object,
      default: function() {
        return tableConfig
      }
    },
    // 原生参数
    el: Object,
    // 表格数据
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 功能菜单配置
    menu: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 查询表单
    searchForm: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isLoading: false,
      // 组件配置项
      tableConfig: {},
      // 查询
      search: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      height: 400,
      // 表单列表
      tableData: [],
      // 勾选中的行
      selectionRow: [],
      // 当前选中行
      currentRow: {}
    }
  },
  watch: {
    option: {
      handler(n, o) {
        this.tableConfig = Object.assign({}, tableConfig, this.option)
      },
      deep: true
    }
  },
  created() {
    this.tableConfig = Object.assign({}, tableConfig, this.option)
    this.transformSearchForm().then(() => {
      this.onSearch()
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.tableConfig.isFull) {
        this.fullTableHeight()
        window.onresize = () => {
          this.fullTableHeight()
        }
      }
    })
  },
  destroyed() {
    window.onresize = ''
  },
  methods: {
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT
    },
    /**
     * 将传入的searchForm 转化成 键值对象
     */
    transformSearchForm() {
      this.searchForm.forEach((item) => {
        this.$set(this.search, item.formName, item.value)
      })
      return Promise.resolve()
    },
    onSplitFormName() {
      let search = Object.assign({}, this.search)
      Object.keys(search).forEach((key) => {
        if (key.includes('_') && typeof search[key] === 'object' && search[key] !== null) {
          let array = key.split('_')
          array.forEach((item, index) => {
            search[item] = search[key][index]
          })
          delete search[key]
        }
      })
      return Promise.resolve(search)
    },
    getList(search) {
      this.isLoading = true
      this.$http
        .get(this.option.url, search)
        .then((res) => {
          this.isLoading = false
          this.currentRow = {}
          this.tableData = eval('res.' + this.tableConfig.response.list)
          if (this.tableConfig.showPagination) {
            this.search.total = eval('res.' + this.tableConfig.response.total)
          } else {
            this.search.total = this.tableData.length
          }
          this.selectionRow = []
          this.currentRow = {}
          this.$emit('get-list', this.tableData)
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    onSearch() {
      this.search.pageNum = 1
      this.onSplitFormName().then((search) => {
        this.getList(search)
      })
    },
    inputSearchFun() {
      console.log('aaa')
      this.search.pageNum = 1
      this.onSplitFormName().then((search) => {
        this.getList(search)
      })
    },
    onSearchKeep() {
      this.onSplitFormName().then((search) => {
        this.getList(search)
      })
    },
    onSizeChange(val) {
      this.search.pageSize = val
      this.onSearch()
    },
    onPageChange(val) {
      this.search.pageNum = val
      this.onSearchKeep()
    },
    onSearchFormReset(formName) {
      this.$refs[formName].resetFields()
      this.onSearch()
    },
    onSelect(row) {
      this.selectionRow = row
      this.$emit('select', row)
    },
    onRowClick(row) {
      this.currentRow = row
      this.$emit('row-click', row)
    },
    fileSuccess(e) {
      this.$emit('file-success', e)
    },
    onExport(url) {
      this.onSplitFormName().then((search) => {
        window.open(url + '?' + qs.stringify(search))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-table {
  background-color: #fff;
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
    &-count {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #7b7b7b;
      .count {
        margin-right: 20px;
      }
    }
  }
  .page_top {
    padding: 20px;
    display: flex;
    height: 33px;
    .qc-menu-form {
      margin-right: auto;
    }
  }
  .page_table {
    padding: 0 20px;
  }
}
</style>
