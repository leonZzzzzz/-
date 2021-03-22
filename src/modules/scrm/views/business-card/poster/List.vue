<template>
  <div class="poster-div">
    <GoBack title="返回"></GoBack>
    <div class="poster-container">
      <div class="poster-addbtn"><el-button type="primary" size="small" @click="addPosrer">添加海报</el-button></div>
      <div
        class="main"
        id="table"
        ref="table"
        :style="{
          height: height + 'px',
          width: '100%',
          overflow: 'auto',
          background: '#fff'
        }"
      >
        <ul class="clear">
          <li v-for="(item, $index) in tableData" :key="$index">
            <img :src="item.host + item.background" alt="" />
            <div class="btn-div">
              <el-button type="text" @click="compile(item.id)">修改</el-button>
              <el-button type="text" @click="cancel(item.id)">删除</el-button>
            </div>
          </li>
        </ul>
      </div>

      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ComPagination from '../../../components/common/ComPagination'
import GoBack from '../../../components/components/GoBack.vue'
export default {
  components: { ComPagination, GoBack },
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      height: 650
    }
  },
  methods: {
    //方法函数部分
    //编辑海报
    compile(id) {
      this.$router.push(`/main/scrm/bussiness-card/poster/form?id=${id}`)
    },
    //删除海报
    cancel(id) {
      this.$confirm('是否删除该海报？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deletePoster({ id: id }).then(() => {
            this.$message.success('删除成功')
            this.getPostPage()
          })
        })
        .catch(() => {})
    },
    //点击添加海报按钮
    addPosrer() {
      this.$router.push('/main/scrm/bussiness-card/poster/form')
    },
    //翻页方法
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getPostPage()
    },
    //翻页方法
    onPageChange(val) {
      this.page.pageNum = val
      this.getPostPage()
    },
    getTableHeight() {
      const OTHER_HEIGHT = 76 + 52 + 30
      this.height = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    },
    //接口部分开始
    getPostPage() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      this.$http.getPostPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    }
    //接口部分结束
  },
  created() {
    this.getPostPage()
  }
}
</script>

<style lang="scss" scoped>
.poster-div {
  width: 100%;
  height: 100%;
  .poster-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .poster-addbtn {
      padding: 20px;
    }
    .main {
      ul {
        width: 100%;
        float: left;
        column-count: 5; //列数5列
        column-gap: 0;
        counter-reset: item-counter;
        li {
          cursor: pointer;
          margin: 0px 0 10px 20px;
          width: 200px;
          box-sizing: border-box;
          break-inside: avoid;
          counter-increment: item-counter;
          box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
          img {
            font-size: 0;
            // margin: 10px 10px 0 10px;
            width: 200px;
            height: auto;
          }
          .btn-div {
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            text-align: center;
          }
        }
      }
    }

    .common-pagination {
      border-top: 1px solid #ccc;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
