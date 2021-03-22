<template>
  <div class="moments-form">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">已分配离职员工资产</el-button>
    </div>
    <div class="main_content">
      <div class="form-content">
        <div class="searchtop">
          <div class="topbox">
            <span style="width:130px">已离职员工</span>
            <el-input placeholder="请输入" width="200px"></el-input>
          </div>
          <div class="topbox">
            <span style="width:75px">离职日期</span>
            <el-date-picker
              v-model="value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
          <el-button type="primary" size="small" style="margin-left:10px">搜索</el-button>
        </div>

        <div class="centerbox">
          <div class="staffnum">
            <div>共<span style="color:#4185f4"> 9 </span>位已分配离职员工</div>
          </div>
          <el-table
            :data="stafflist"
            stripe
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            style="width:100%;margin-top:30px;"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="content" label="已离职员工"> </el-table-column>
            <el-table-column prop="so" label="所属部门" width="180" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="已分配客户数" width="180" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="已分配群聊数" width="180" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="离职时间" width="180" align="center"> </el-table-column>
          </el-table>
          <div class="page">
            <div class="pagination-count">
              <span class="count">共：{{ pageData.total }}&nbsp;条数据</span>
            </div>
            <el-pagination
              @size-change="onSizeChange"
              @current-change="onPageChange"
              :page-sizes="[15, 30, 50]"
              :page-size="pageData.pageSize"
              :current-page="pageData.pageNum"
              :total="pageData.total"
              layout="prev, pager, next, sizes"
              background
              style="margin-right: -26px"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageData: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      value: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      // this.getMomentsDetail(this.$route.query.id)
    }
  },
  methods: {
    getMomentsDetail(id) {
      this.$http.getCompMomentsDetail({ id }).then((res) => {
        this.form = res.data.data
        let newList = []
        this.form.momentsUsers.forEach((item) => {
          let obj = {
            avatar: item.avatar,
            id: item.cropUserId,
            name: item.name,
            position: item.position,
            userId: item.userId
          }
          // console.log('名称' + item.name + item.id)
          newList.push(obj)
        })
        this.form.momentsUsers = newList
        this.selectedMenu = newList
        // 判断上传内容的类型
        let uploadList = res.data.data.momentsUploadContentList
        if (uploadList.length > 0) {
          this.radio = uploadList[0].type
          if (this.radio === '1') {
            this.imageList = res.data.data.momentsUploadContentList
          } else if (this.radio === '2') {
            this.videoList = res.data.data.momentsUploadContentList
          } else if (this.radio === '3') {
            this.linkForm = res.data.data.momentsUploadContentList[0]
          }
        } else {
          this.radio = '-1'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.searchtop {
  background: #fff;
  display: flex;
  padding: 20px 10px;
}
.topbox {
  display: flex;
  margin-left: 20px;
  span {
    // width: 130px;
    font-size: 14px;
    margin-top: 10px;
    color: #606266;
  }
}
.page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 15px;
  .pagination-count {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #7b7b7b;
    .count {
      margin-right: 20px;
    }
  }
}
.staffnum {
  // background: rgba(65, 133, 244, 0.1);
  // border: 1px solid rgba(65, 133, 244, 0.2);
  border-radius: 3px;
  padding: 10px;
  font-size: 15px;
  color: rgb(96, 98, 102);
}
.centerbox {
  background: #fff;
  margin-top: 10px;
  padding: 20px;
}
</style>
