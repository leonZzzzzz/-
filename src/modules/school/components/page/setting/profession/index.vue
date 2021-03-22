<template>
  <div class="wrap">
    <div class="context-box" :style="{'height': `${areaHeight}px`}">
      <el-card class="card-wrapper" shadow="hover">
        <div slot="header" class="clearfix">
          <span>专业：</span>
        </div>
        <div class="tags-wrapper">
          <el-tag :key="index" v-for="(tag,index) in reportOptions" closable :disable-transitions="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" clearable>
          </el-input>
          <el-button icon="el-icon-edit" type="primary" v-else class="button-new-tag" size="small" @click="showInput">新增专业</el-button>
        </div>
      </el-card>
    </div>
    <div class="bottom-btn">
      <el-button @click="cancelTags()" size="small" :loading="saveLoading">取消</el-button>
      <el-button type="primary" @click="saveTag()" size="small" :loading="saveLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from "apiSchool/common";
export default {
  data() {
    return {
      areaHeight: 0,
      reportOptions: [],
      cacheOptions: [],
      inputVisible: false,
      inputValue: "",
      saveLoading: false,
      cacheNumber: 5
    };
  },
  created() {
    this.reportOptions = [];
    this.cacheOptions = [];
    this.getProfession();
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
    // 获取专业配置
    getProfession() {
      api.getProfession().then(res => {
        let tags = res.data.message;
        if (tags) {
          this.reportOptions = tags.split("_");
          this.cacheOptions = tags.split("_");
        } else {
          this.reportOptions = [];
          this.cacheOptions = [];
          this.$message({
            message: "暂无专业选项，请新增专业",
            type: "warning"
          });
        }
      });
    },
    // 删除专业
    handleClose(tag) {
      this.reportOptions.splice(this.reportOptions.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 新增专业
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.reportOptions.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 保存专业
    saveTag() {
      this.$confirm("是否保存操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.saveLoading = true;
        let paramsOption = {
          value: this.reportOptions.join("_")
        };
        this.updateProfession(paramsOption)
      }).catch(() => {});
    },
    // 更新专业
    updateProfession(model) {
      api.updateProfession(model).then(res => {
        console.log("options:", res.data);
        this.getProfession()
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
        this.saveLoading = false;
      })
    },
    // 取消操作
    cancelTags() {
      this.$confirm("是否取消操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.reportOptions = JSON.parse(JSON.stringify(this.cacheOptions));
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