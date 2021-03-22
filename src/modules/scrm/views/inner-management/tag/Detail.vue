<template>
  <div class="tag-detail">
    <div class="container">
      <div class="g-module">
        <div class="operating-group">
          <div class="base-btn">
            <div class="label">基础信息</div>
          </div>
          <div class="back">
            <el-button size="small" type="info" @click="goBack"
              >&nbsp;&nbsp;&nbsp;&nbsp;返回&nbsp;&nbsp;&nbsp;&nbsp;</el-button
            >
          </div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">标签名称：</div>
          <div class="msg-desc">{{ tagData.name }}</div>
        </div>
        <div class="grouping-msg">
          <div class="msg-label">创建时间：</div>
          <div class="msg-desc">{{ tagData.createTime }}</div>
        </div>
      </div>
      <div class="g-module table-module">
        <div class="query-table">
          <div class="left-msg">部门/成员信息</div>
          <el-button size="small" type="primary">添加部门/成员</el-button>
        </div>
        <div class="common-table-box">
          <com-table :tableData="tableData" :column="column"></com-table>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page"></com-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComTable, ComPagination },
  data() {
    return {
      tagId: '',
      tagData: {},
      tableData: [],
      column: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
          width: '150px'
        },
        {
          label: '名称',
          align: 'center',
          minWidth: '150px',
          prop: ''
        },
        {
          label: '部门',
          align: 'center',
          minWidth: '150px',
          prop: ''
        },
        {
          label: '操作',
          align: 'center',
          minWidth: '150px',
          fixed: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text">移除该成员</el-button>
              </div>
            )
          }
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 1
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.tagId = this.$route.query.id
      this.getTagDetail()
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$openNewPageBack()
    },
    // 获取标签详情
    getTagDetail() {
      let that = this
      let id = that.tagId
      that.$http.getInnerTagDetail({ id }).then((res) => {
        that.tagData = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-detail {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
}
.g-module {
  width: 100%;
  font-size: 14px;
  padding: 20px 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-bottom: 20px;
}
.operating-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .base-btn {
    display: flex;
    align-items: flex-end;
    .label {
      font-size: 16px;
      color: #303133;
      margin-right: 40px;
    }
    .edit {
      color: #1e90ff;
      margin-right: 40px;
      cursor: pointer;
    }
    .delete {
      color: #909399;
      margin-right: 40px;
      cursor: pointer;
    }
  }
}
.grouping-msg {
  max-width: 800px;
  display: flex;
  align-items: center;
  line-height: 24px;
  padding: 20px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  margin-top: 20px;
  .msg-label {
    color: #909399;
    margin-right: 10px;
  }
  .msg-desc {
    color: #303133;
  }
}
.g-module {
  width: 100%;
  font-size: 14px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-bottom: 20px;
}
.table-module {
  position: relative;
  padding-bottom: 56px;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .left-msg {
    font-size: 16px;
    color: #303133;
    margin-right: 40px;
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
