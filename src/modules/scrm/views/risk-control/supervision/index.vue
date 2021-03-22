<template>
  <div class="container">
    <div class="supervision-top">违规提醒</div>
    <div class="query-table-box">
      <div class="query-left">
        <div class="left-select">
          <span class="select-label">账号</span>
          <el-select v-model="selected" size="mini" clearable placeholder="请选择">
            <div class="select-total">全部账号（50）</div>
            <div class="search-input">
              <el-input size="mini" placeholder="请输入账号">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="select-options">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                <div class="option">
                  <img class="option-avatar" src="#" alt="" />
                  <div class="option-name">{{ item.label }}</div>
                </div>
              </el-option>
            </div>
          </el-select>
        </div>
        <div class="left-checkbox">
          <el-checkbox>提醒通知：未开启</el-checkbox>
        </div>
      </div>
      <div class="query-right">
        <el-date-picker
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="query-keyword-box">
      <div class="keyword-list">
        <div class="list-left">全部关键词</div>
        <div class="list-right">
          <div class="list-item"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加关键词</div>
          <div class="list-item active">全部</div>
        </div>
      </div>
    </div>
    <div class="common-table-box" id="table" :style="{ height: fullHeight }">
      <div class="dialogue-item">
        <div class="item-top">
          <div>客户姓名&nbsp;与&nbsp;企微客服&nbsp;的聊天</div>
          <div>2020-09-11 14:38:20</div>
        </div>
        <div class="item-content">
          <div class="cont-left">
            <img class="customer-avatar" src="#" alt="" />
            <div class="customer-info">
              <div class="info-name">企微客服</div>
              <div class="info-msg">产品介绍，产品信息</div>
            </div>
          </div>
          <div class="cont-right" @click="goToDialoguePage">查看</div>
        </div>
      </div>
      <!-- <div class="no-data">暂无数据</div> -->
    </div>
    <div class="common-pagination">
      <com-pagination :page="page"></com-pagination>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
export default {
  components: { ComPagination },
  data() {
    return {
      options: [
        { value: 'total', label: '全部' },
        { value: 'scrm', label: '企微客服' },
        { value: 'value1', label: 'MR wu' },
        { value: 'value2', label: '张三' },
        { value: 'value3', label: '小明' },
        { value: 'value4', label: '王小川' },
        { value: 'value5', label: '等等' }
      ],
      selected: '',
      dateTimeRage: '',
      fullHeight: '400px',
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
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
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.fullHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_TOP_HEIGHT +
        'px'
    },
    goToDialoguePage() {
      this.$router.push(`/main/scrm/control/supervision/dialogue`)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #ebeef5;
  position: relative;
  font-size: 14px;
}
.supervision-top {
  font-weight: bold;
  padding: 15px 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.query-table-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  .query-left {
    display: flex;
    align-items: center;
    .left-select {
      margin-right: 20px;
      .select-label {
        margin-right: 10px;
      }
    }
  }
}
.select-total {
  padding: 10px 20px;
  font-size: 12px;
}
.search-input {
  padding: 0 20px;
}
.select-options {
  height: 160px;
  padding: 10px 20px;
  overflow-y: auto;
  .option {
    display: flex;
    align-items: center;
    .option-avatar {
      width: 24px;
      height: 24px;
      border-radius: 3px;
      margin-right: 5px;
    }
  }
}
.query-keyword-box {
  padding: 0 20px;
  box-sizing: border-box;
  .keyword-list {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
    .list-left {
      margin-right: 20px;
    }
    .list-right {
      display: flex;
      flex-wrap: wrap;
      .list-item {
        font-size: 13px;
        padding: 6px 10px;
        border-radius: 3px;
        background-color: #f5f5f5;
        margin: 0 10px 10px 0;
        box-sizing: border-box;
      }
      .active {
        border: 1px solid #409eff;
        color: #409eff;
      }
    }
  }
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #ebeef5;
  overflow-y: auto;
  .dialogue-item {
    background-color: #ffffff;
    padding: 0 20px;
    box-sizing: border-box;
    margin-top: 20px;
    .item-top {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
    }
    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      box-sizing: border-box;
      .cont-left {
        display: flex;
        .customer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 3px;
          overflow: hidden;
          margin-right: 10px;
        }
        .customer-info {
          .info-name {
            margin-bottom: 10px;
          }
        }
      }
      .cont-right {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
  .no-data {
    padding: 60px;
    text-align: center;
    color: #717171;
    font-size: 14px;
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
