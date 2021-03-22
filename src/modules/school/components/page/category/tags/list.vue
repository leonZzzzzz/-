<template>
  <div class="wrap">
    <div class="context-box" :style="{'height': `${areaHeight}px`}">
      <label class="select-text">请选择栏目</label>
      <el-select size="small" v-model="categoryID" clearable placeholder="请选择栏目">
        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button icon="el-icon-search" :loading="searchLoading" type="primary" size="small" @click="getCategoryTag()">查询</el-button>
      <el-card class="card-wrapper" v-if="cardVisible" shadow="hover">
        <div slot="header" class="clearfix">
          <span>栏目标签信息</span>
          <!-- <el-button :loading="saveLoading" style="float: right; padding: 3px 0" type="text" @click="saveTag()">保存</el-button>
          <el-button style="float: right; padding: 3px 0; margin-right: 5px;" type="text" @click="cancelTags()">取消</el-button> -->
        </div>
        <div class="tags-wrapper">
          <el-tag :key="index" v-for="(tag,index) in categoryTags" closable :disable-transitions="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button icon="el-icon-edit" type="primary" v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
        </div>
      </el-card>
    </div>
    <div class="bottom-btn">
      <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
      <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
      <!-- <el-button :loading="saveLoading" style="float: right; padding: 3px 0" type="text" @click="saveTag()">保存</el-button>
      <el-button style="float: right; padding: 3px 0; margin-right: 5px;" type="text" @click="cancelTags()">取消</el-button> -->
    </div>
  </div>
</template>

<script>
import api from "apiSchool/common";
export default {
  data() {
    return {
      areaHeight: 0,
      categoryID: "",
      categoryList: [],
      categoryTags: [],
      cacheTags: [],
      inputVisible: false,
      cardVisible: false,
      inputValue: "",
      searchLoading: false,
      saveLoading: false
    };
  },
  created() {
    this.categoryID = "";
    this.categoryList = [];
    this.categoryTags = [];
    this.cacheTags = [];
    this.getListCategory();
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 105;
    },
    // 获取栏目列表
    getListCategory() {
      api.listCategory().then(res => {
        console.log("获取栏目信息：", res);
        let data = res.data.data;
        this.categoryList = data;
        this.categoryID = this.categoryList[0].id;
        this.getCategoryTag();
      });
    },
    // 获取栏目标签
    getCategoryTag() {
      if (this.categoryID === "") {
        this.cardVisible = false;
        return;
      }
      this.searchLoading = true;
      console.log(this.categoryID);
      let params = {
        code: this.categoryID
      };
      api.getCategoryTag(params).then(res => {
        console.log("获取栏目标签信息：", res);
        if (res.data.data) {
          let tags = res.data.data.info;
          if (tags) {
            this.categoryTags = tags.split("_");
            this.cacheTags = tags.split("_");
          } else {
            this.categoryTags = [];
            this.cacheTags = [];
            this.$message({
              message: "该栏目暂无标签，请新增标签",
              type: "warning"
            });
          }
        }
        this.cardVisible = true;
        this.searchLoading = false;
      });
    },
    // 删除标签
    handleClose(tag) {
      this.categoryTags.splice(this.categoryTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 新增标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.categoryTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 保存标签信息
    saveTag() {
      this.$confirm("是否保存操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saveLoading = true;
          let params = {
            code: this.categoryID,
            info: this.categoryTags.join("_")
          };
          api.saveCategoryTag(params).then(res => {
            console.log(res);
            if (res.data.code === 20000) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "success"
              });
              this.getCategoryTag(this.categoryID);
            }
            this.saveLoading = false;
          });
        })
        .catch(() => {});
    },
    // 取消操作
    cancelTags() {
      console.log(this.cacheTags);
      this.$confirm("是否取消操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.categoryTags = JSON.parse(JSON.stringify(this.cacheTags));
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.context-box {
  padding: 20px;
  overflow: auto;
}
.wrap-select {
  margin-bottom: 15px;
}
.card-wrapper {
  margin-top: 15px;
}
.select-text {
  margin-right: 10px;
  font-size: 16px;
  color: #606266;
}

.tags-wrapper {
  white-space: normal;
  ::v-deep .el-tag {
    background-color: transparent;
    border: 1px solid #409eff;
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
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>

