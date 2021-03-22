<template>
  <div class="interactive-detail">
    <div class="interactive-top">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="interactive-title">
            <el-form>
              <el-form-item label="链接标题:">
                测试链接
              </el-form-item>
              <el-form-item label="监测链接:">
                原链接
              </el-form-item>
              <el-form-item label="创建时间:">
                2020-08-18 12:00
              </el-form-item>
              <el-form-item label="通知设置:">
                <div class="interactive-checkbox">
                  <el-checkbox class="left-checkbox">行为通知</el-checkbox>
                  <el-checkbox class="left-checkbox">动态记录</el-checkbox>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="interactive-tagtitle">打开行为标签:</div>
          <div>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
            <span class="info-itemtag">一般</span>
          </div>
        </el-col>
        <el-col :span="8" class="back_col">
          <el-button type="info" class="info_back" @click="backList">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="interactive-content">
      <div class="interactive-num">
        <span class="interactive-leftnum">总点击次数</span><span class="interactive-rightnum">20</span>
        <span class="interactive-leftnum">总点击人数</span><span class="interactive-rightnum">20</span>
      </div>
      <div class="query-table-box">
        <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
          <el-form-item label="链接标题">
            <el-input placeholder="请输入链接标题" v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属成员">
            <el-input placeholder="请输入链接标题" v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="searchList">查询</el-button>
            <el-button size="small" type="info" @click="reSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column label="客户信息" prop="name" align="center">
            <!-- <template slot-scope="scope">
              <div class="tagname-form">
                <span class="tagNames"><i class="el-icon-user-solid icon-user"></i>{{ scope.row.name }}</span>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column label="所属成员" prop="people" align="center">
            <template slot-scope="scope">
              <div class="tagname-form">
                <span class="tagNames"><i class="el-icon-user-solid icon-user"></i>{{ scope.row.people }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最近点击时间" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="客户点击总次数" prop="clickNum" align="center"> </el-table-column>
          <el-table-column label="浏览总时长" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="操作" align="center" :formatter="formatterColumn"> </el-table-column>
        </el-table>
      </div>
    </div>
    <com-dialog
      :config="detailedDialog.config"
      @closeDialog="detailedDialog.config.visible = false"
      class="dialogSelect"
    >
      <div class="dialog-content">
        <el-table :data="tableData" width="100%">
          <el-table-column label="最近时间" prop="createTime" align="center"> </el-table-column>
          <el-table-column label="浏览时长" prop="clickNum" align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="simple-btn">
        <el-button type="primary" @click="handleConfirm"
          >&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;确定&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-button
        >
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: { ComDialog },
  data() {
    return {
      searchForm: {
        name: ''
      },
      tableData: [
        {
          name: '楼下小黑',
          people: '陈建伟',
          createTime: '2020 09 10 22:00',
          clickNum: 1
        }
      ],
      detailedDialog: {
        config: {
          width: '500px',
          title: '浏览明细',
          visible: false
        }
      },
      height: 450
    }
  },
  methods: {
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            明细
          </el-button>
        </div>
      )
    },
    searchList() {},
    reSearch() {},
    showEditDialog() {
      this.detailedDialog.config.visible = true
    },
    handleConfirm() {
      this.detailedDialog.config.visible = false
    },
    backList() {
      this.$openNewPageBack()
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.interactive-detail {
  width: 100%;
  height: 100%;
  .interactive-top {
    width: 100%;
    background-color: #fff;
    margin-bottom: 20px;
    .interactive-title {
      padding: 10px 0 0 40px;
    }
  }
  .interactive-content {
    width: 100%;
    background-color: #fff;
    .interactive-num {
      padding: 20px 0;
      .interactive-leftnum {
        color: #909399;
        font-size: 14px;
        margin-left: 40px;
      }
      .interactive-rightnum {
        margin-left: 10px;
        color: black;
        font-size: 15px;
      }
    }
  }
}
.left-checkbox {
  // margin-left: 72px;
  color: black;
}
.interactive-tagtitle {
  padding: 10px 0;
  color: #909399;
  font-size: 14px;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 5px 20px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 5px;
  font-size: 12px;
  cursor: pointer;
}
// .interactive-checkbox {
// }
.query-table-box {
  // padding: 20px;
  margin-left: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.operating-btn {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
  margin-bottom: 5px;
}
.tagname-form {
  min-height: 60px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  .tagNames {
    display: inline-block;
    border: 1px solid rgb(223, 220, 220);
    padding: 2px 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    margin-right: 8px;
    margin-bottom: 7px;
  }
}
.icon-user {
  color: #294a7b;
}
.dialog-content {
  width: 100%;
  height: 300px;
  overflow-y: auto;
}
.simple-btn {
  padding: 20px 0;
  width: 55%;
  margin: 0 auto;
}
.info_back {
  margin-right: 10px;
}
.back_col {
  display: inline-block;
  text-align: right;
  padding: 10px;
}
</style>
