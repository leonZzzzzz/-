<template>
  <div class="classification-div">
    <div class="class-container">
      <div class="class-top">
        <div class="class-btn">
          <el-button type="primary" size="small" @click="addCategoryBtn">新增分类</el-button>
        </div>
        <div class="class-input">
          <el-form label-position="right" label-width="70px">
            <el-form-item label="名称">
              <el-input
                size="mini"
                clearable
                placeholder="请输入名称"
                v-model="selectForm.name"
                @input="getCustomerCategoryPage"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="class-table">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.name }}</span>
                <el-tag
                  :type="scope.row.isDefault == true ? 'primary' : 'warning'"
                  style="margin-left: 10px"
                  size="small"
                  v-if="scope.row.isDefault"
                  >{{ scope.row.isDefault == true ? '默认' : '不默认' }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="是否默认">
            <template slot-scope="scope">
              <div>
                {{ scope.row.isDefault == true ? '是' : '否' }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="sortNumber" align="center" label="排序号"></el-table-column>
          <!-- <el-table-column label="创建时间" align="center">
          </el-table-column> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editCategory(scope.row)">修改</el-button>
                <el-button type="text" v-if="scope.row.isDefault == false" @click="deleteCategory(scope.row)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  style="color: #ccc"
                  v-if="scope.row.isDefault == true"
                  @click="$message.warning('默认分类不支持删除')"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="class-pagination">
        <com-pagination :page="categoryPage" @sizeChange="onSizeChange" @pageChange="onPageChange"> </com-pagination>
      </div>
    </div>
    <com-dialog :config="addCategory.config" @closeDialog="closeAdd" class="add-dialog">
      <div class="container-div">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="分类名称">
            <el-input placeholder="请输入分类名称" maxlength="8" show-word-limit v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="排序号">
            <el-input-number
              :disabled="isDefault"
              v-model="model.sortNumber"
              :step="1"
              step-strictly
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-btn">
        <div>
          <el-button @click="closeAdd">取消</el-button>
          <el-button @click="sumbitAddCate" type="primary">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>
<script>
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
export default {
  components: {
    ComPagination,
    ComDialog
  },
  data() {
    return {
      categoryPage: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      selectForm: {
        name: ''
      },
      tableData: [],
      height: 400,
      addCategory: {
        config: {
          width: '600px',
          visible: false,
          title: '新增分类'
        }
      },
      modelId: '',
      model: {
        name: '',
        sortNumber: 0
      },
      isDefault: false
    }
  },
  methods: {
    //接口部分
    //获取列表页
    getCustomerCategoryPage() {
      let params = {
        pageSize: this.categoryPage.pageSize,
        pageNum: this.categoryPage.pageNum,
        name: this.selectForm.name
      }
      this.$http.getCustomerCategoryPage(params).then(res => {
        this.tableData = res.data.data.list
        this.categoryPage.total = res.data.data.total
      })
    },
    //接口部分结束
    //方法开始
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
    },
    //分页的方法
    onSizeChange(val) {
      this.categoryPage.pageSize = val
      this.categoryPage.pageNum = 1
      this.getCustomerCategoryPage()
    },
    onPageChange(val) {
      this.categoryPage.pageNum = val
      this.getCustomerCategoryPage()
    },
    closeAdd() {
      this.addCategory.config.visible = false
    },
    //新增分类按钮
    addCategoryBtn() {
      this.addCategory.config.title = '新增分类'
      this.addCategory.config.visible = true
      this.model.name = ''
      this.model.sortNumber = 0
      this.isDefault = false
    },
    //点击每一行的修改按钮
    editCategory(row) {
      this.addCategory.config.visible = true
      this.addCategory.config.title = '修改分类'
      this.$http.getCustomerCatroryRow({ id: row.id }).then(res => {
        let data = res.data.data
        this.modelId = data.id
        this.model.name = data.name
        this.model.sortNumber = data.sortNumber
        this.isDefault = data.isDefault
      })
    },
    //删除行
    deleteCategory(row) {
      this.$confirm('删除后，该分类下的客户和生命周期将移动至默认，确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deteleCustomerCatrory({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getCustomerCategoryPage()
        })
      })
    },

    //确认新增按钮
    sumbitAddCate() {
      if (this.addCategory.config.title == '新增分类') {
        this.$http.addCustomerCatrgory(this.model).then(() => {
          this.addCategory.config.visible = false
          this.$message.success('添加成功')
          this.model.name = ''
          this.getCustomerCategoryPage()
        })
        return
      }
      if (this.addCategory.config.title == '修改分类') {
        let params = {
          id: this.modelId,
          name: this.model.name,
          sortNumber: this.model.sortNumber
        }
        this.$http.updateCustomerCatrory(params).then(() => {
          this.$message.success('修改成功')
          this.addCategory.config.visible = false
          this.model.name = ''
          this.getCustomerCategoryPage()
        })
      }
    }
    //方法结束
  },
  created() {
    this.getCustomerCategoryPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.classification-div {
  width: 100%;
  height: 100%;
  position: relative;
  .class-container {
    width: 100%;
    height: 100%;
    padding: 20px;

    box-sizing: border-box;
    background-color: #fff;
    .class-top {
      display: flex;
      justify-content: space-between;
    }
    .class-table {
      box-sizing: border-box;
    }
    .class-pagination {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
.add-dialog {
  .container-btn {
    display: flex;
    div {
      margin-left: auto;
    }
  }
}
</style>
