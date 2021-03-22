<template>
  <div class="wrap" ref="wrap">
    <el-table :data="categoryList" style="width: 100%" @expand-change="expandChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ props.row.name }}的标签信息：</span>
              <el-button :loading="btnLoading" style="float: right; padding: 3px 0" type="text" @click="saveTag(props.row)">保存</el-button>
              <el-button :loading="btnLoading" style="float: right; padding: 3px 0; margin-right: 5px;" type="text" @click="getCategoryTag(props.row.id)">取消</el-button>
            </div>
            <div class="tags-wrapper">
              <el-tag type="warning" :key="tag+index" v-for="(tag,index) in props.row.tags" closable :disable-transitions="false" @close="handleClose(tag,props.row,props.$index)">
                {{tag}}
              </el-tag>
              <!-- <el-input class="input-new-tag" v-model="props.row.inputValue" size="small" @keyup.enter.native="handleInputConfirm(props.row,props.$index)" @blur="handleInputConfirm(props.row,props.$index)">
              </el-input> -->
              <el-input class="input-new-tag" clearable v-model="props.row.inputValue" size="small" @keyup.enter.native="handleInputConfirm(props.row,props.$index)">
              </el-input>
              <el-button class="button-new-tag" size="small" @click="handleInputConfirm(props.row,props.$index)">添加新标签</el-button>
            </div>
          </el-card>
        </template>
      </el-table-column>
      <!--图片  -->
      <el-table-column align="center" prop="iconUrl" label="图标" width="180">
        <template slot-scope="scope">
          <img style="display:block;margin:10px auto" :src="`${imgHost}${scope.row.iconUrl}`" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="info" label="备注">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "apiSchool/common";
export default {
  data() {
    return {
      categoryList: [],
      btnLoading: false
    };
  },
  created() {
    this.getListCategory();
  },
  methods: {
    getListCategory() {
      api.listCategory().then(res => {
        console.log("获取栏目信息：", res);
        let data = res.data.data;
        for (let i in data) {
          data[i].tags = [];
        }
        this.categoryList = data;
      });
    },
    getCategoryTag(id) {
      this.btnLoading = true;
      let params = {
        code: id
      };
      api.getCategoryTag(params).then(res => {
        console.log("获取栏目标签信息：", res);
        if (res.data.data) {
          let tags = res.data.data.info;
          if (tags) {
            for (let i in this.categoryList) {
              if (this.categoryList[i].id === id) {
                this.categoryList[i].tags = tags.split("_");
                this.categoryList[i].inputValue = "";
                this.$nextTick();
                break;
              }
            }
          }
        }
        this.btnLoading = false;
      });
    },
    expandChange(row, expandedRows) {
      console.log("展开的行", row);
      this.getCategoryTag(row.id);
    },
    handleClose(tag, row, rowIndex) {
      let tags = row.tags;
      let index = tags.indexOf(tag);
      this.categoryList[rowIndex].tags.splice(index, 1);
      // this.saveTag(row);
    },
    // showInput(row) {
    //   row.inputVisible = true;
    //   this.$nextTick(_ => {
    //     //  this.$refs.saveTagInput.input.focus();
    //   });
    // },
    handleInputConfirm(row, rowIndex) {
      let inputValue = row.inputValue;
      if (inputValue) {
        this.categoryList[rowIndex].tags.push(inputValue);
        this.categoryList[rowIndex].inputValue = "";
        // this.saveTag(row);
      }
    },
    saveTag(row) {
      let data = row.tags;
      this.btnLoading = true;
      let params = {
        code: row.id,
        info: data.join("_")
      };
      api.saveCategoryTag(params).then(res => {
        console.log(res);
        if (res.data.code === 20000) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "success"
          });
        }
        this.btnLoading = false;
        this.getCategoryTag(row.id);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-wrapper {
  white-space: normal;
  ::v-deep .el-tag--warning {
    background-color: transparent;
    border-color: #e6a23c;
    color: #e6a23c;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}

.button-new-tag {
  margin-left: 10px;
  margin-top: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
</style>
