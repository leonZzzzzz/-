<template>
  <div class="qc-table" :style="{ height: `${autoHeight || tHeight}px` }">
    <!-- @row-click="handleSelect" @selection-change="handleCheck"  -->
    <el-table
      v-loading="loading"
      element-loading-text="数据加载中"
      :height="`${autoHeight || tHeight - 52}px`"
      style="overflow-y: auto;"
      :data="tableData"
      highlight-current-row
      @row-click="vuexTableList"
      @cell-dblclick="DbTableList"
      @selection-change="vuexTableId"
      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
    >
      <!-- @cell-dblclick='DbTableList'  -->
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <!--基本的显示  -->
      <el-table-column
        v-for="(item, index) in tableList"
        :key="index"
        :align="item.align || 'center'"
        v-if="!item.template"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
      ></el-table-column>
      <!--序号  -->
      <el-table-column
        align="center"
        v-else-if="item.template == 'index'"
        type="index"
        label="序号"
        width="65"
      ></el-table-column>
      <el-table-column
        type="selection"
        v-else-if="item.template == 'selection'"
        align="center"
        width="55"
      ></el-table-column>
      <!--排序  -->
      <el-table-column align="center" v-else-if="item.template == 'seqNum'" :label="item.label" width="65">
        <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
      </el-table-column>
      <!--checkbox  -->
      <el-table-column
        :align="item.align || 'center'"
        type="selection"
        v-else-if="item.template == 'checkbox'"
        width="55"
      ></el-table-column>
      <!--金钱  -->
      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'price'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{ scope.row[item.prop] || 0 | price }}</template>
      </el-table-column>
      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'auditRegisterStatus'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{ scope.row[item.prop] | auditRegisterStatus }}</template>
      </el-table-column>
      <!--布尔值  -->
      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'Boolean'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{ scope.row[item.prop] ? '是' : '否' }}</template>
      </el-table-column>

      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'filter'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{ item.filter[scope.row[item.prop]] }}</template>
      </el-table-column>
      <!--图片  -->
      <el-table-column align="center" v-else-if="item.template == 'img'" :label="item.label" :width="140">
        <template slot-scope="scope">
          <img
            style="display:block;margin:10px auto"
            src="http://athena-1255600302.cosgz.myqcloud.com/attachments/qc-logo.png"
            width="60"
            height="60"
            v-if="scope.row[item.prop] == undefined || scope.row[item.prop] === ''"
          />
          <img
            style="display:block;margin:10px auto"
            :src="`${imgHost}${scope.row[item.prop]}`"
            width="60"
            height="60"
            v-else-if="item.isPrefix"
          />
          <img
            style="display:block;margin:10px auto"
            :src="`${imgHost}${scope.row[item.prop]}`"
            width="100"
            height="100"
            v-else-if="item.isQR"
          />
          <img
            style="display:block;margin:10px auto"
            :src="`${scope.row[item.prop]}`"
            width="60"
            height="60"
            v-else-if="item.headImage"
          />
          <img style="display:block;margin:10px auto" :src="scope.row[item.prop]" width="60" height="60" v-else />
        </template>
      </el-table-column>
      <!-- auditStatus -->
      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'auditStatus'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{ scope.row[item.prop] | auditStatus }}</template>
      </el-table-column>
      <!-- Boolean -->
      <el-table-column
        :align="item.align || 'center'"
        v-else-if="item.template == 'isSign'"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">{{
          scope.row[item.prop] === true ? '是' : scope.row[item.prop] === false ? '否' : ''
        }}</template>
      </el-table-column>
      <!-- 标签 -->
      <el-table-column
        v-else-if="item.template == 'tagArray'"
        :align="item.align || 'center'"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row[item.prop]">
            <span v-for="(tag, index) in scope.row[item.prop]" :key="index"
              >{{ tag.name }}<span v-if="index + 1 != scope.row[item.prop].length">/</span>
            </span>
          </div>
          <span v-else-if="scope.row.tagName">{{ scope.row.tagName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { IMGURL } from '@/utils/config'

export default {
  props: {
    tableList: Array,
    search: Object,
    url: String,
    delay: Boolean,
    height: Number,
    isDetail: Boolean,
    tongji: {
      type: Number,
      default: 0
    },
    autoHeight: Number,
    categoryType: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    // 评论状态
    auditStatus(val) {
      if (val === '') return ''
      switch (val) {
        case 1:
          return '未审核'
        case 2:
          return '已审核'
        case 3:
          return '已拒绝'
      }
    },
    auditRegisterStatus(val) {
      switch (val) {
        case -1:
          return '审核不通过'
        case 0:
          return '新建'
        case 1:
          return '待审核'
        case 2:
          return '审核通过'
        default:
          return ''
      }
    }
  },
  data() {
    return {
      imgURL: '',
      loading: false,
      tableData: [],
      page: {
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      digQrcode: false,
      tableRow: {},
      tHeight: 0,
      digLogin: false
    }
  },
  created() {
    this.imgURL = IMGURL
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeightTable()
      window.onresize = () => {
        this.getHeightTable()
      }
      this.getTableList()
    })
  },
  methods: {
    getHeightTable() {
      let search = document.querySelector('.search-wrap')
      let button = document.querySelector('.button-wrap')
      let tongji = document.querySelector('.tongji')
      this.tHeight = window.innerHeight - 100
      if (search) this.tHeight = this.tHeight - search.offsetHeight
      if (button) this.tHeight = this.tHeight - button.offsetHeight
      if (tongji) this.tHeight = this.tHeight - tongji.offsetHeight
      // if (this.isDetail) this.tHeight = this.tHeight - 50
    },
    // 表单请求接口地址
    apiTable(url, search) {
      this.loading = true
      var data = {}
      data = Object.assign(data, search)

      this.$http
        .get(url, data)
        .then((res) => {
          this.tableData = res.data.data.list
          if (this.isDeleted) this.tableData = this.tableData.filter((item) => !item.isDeleted)
          console.log('数据', this.tableData)
          this.page.total = res.data.data.total
          this.loading = !true
        })
        .catch((err) => {
          this.loading = !true
          console.log('表格接口调用失败', err)
        })
    },
    // 查询表格数据
    getTableList() {
      this.page = Object.assign(this.search, this.page)
      if (!this.categoryType) this.apiTable(this.url, this.page)
    },
    // 搜索表格数据
    searchTableList() {
      this.setTableList({})
      this.page = Object.assign(this.search, this.page)
      this.page.pageNum = 1
      this.apiTable(this.url, this.page)
    },
    searchTableListKeep() {
      this.setTableList({})
      this.page = Object.assign(this.search, this.page)
      this.apiTable(this.url, this.page)
    },
    // 分页
    handleSizeChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getTableList()
    },
    handleCurrentChange(val) {
      document.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
      this.page.pageNum = val
      this.getTableList()
    },
    // 每行选中 提交到vuex 管理
    vuexTableList(row) {
      this.setTableList(row)
      this.$emit('courseClassscsson', row)
    },
    //双击行
    DbTableList(row) {
      this.$emit('DbTableList', row)
    },
    // 每行选中id 提交到vuex 管理
    vuexTableId(row) {
      let arr = ''
      row.forEach((item) => {
        arr += '_' + item.id
      })
      this.setTableId(arr.substr(1))
    },
    // vuex
    ...mapMutations({
      setTableList: 'tableOld/TABLELIST',
      setTableId: 'tableOld/TABLEID'
    })
  },
  destroyed() {
    this.setTableList({})
  }
}
</script>

<style lang="scss" scoped>
.img {
  width: 200px;
  img {
    width: 100%;
  }
}

.el-table__body tr.current-row > td {
  background: $--color-primary !important;
  color: #fff !important;
}

.block {
  margin-bottom: 0;
  padding: 10px 0;
  text-align: center;
}
</style>
