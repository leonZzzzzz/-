<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <el-form :model="model" ref="model" label-position="top" size="small">
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model.trim="model.title" :maxlength="32" placeholder="最多可输入32位" style="width:400px;"  clearable></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.categoryId" placeholder="请选择">
              <el-option v-for="(item, i) in category" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model.trim="model.phone" type="number" :maxlength="32" placeholder="最多可输入32位" style="width:400px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model.trim="model.address" :maxlength="32" placeholder="最多可输入32位" style="width:400px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
            <!-- <div class="upload-img-box" @click="showImgBox(true, 'iconUrl')">
              <img v-if="model.iconUrl" :src="`${imgHost}${model.iconUrl}`" style="width: 120px;">
              <i v-else class="el-icon-plus upload-icon"></i>
            </div> -->
            <ImageUpload :image-url="model.iconUrl" :on-success="(e) => model.iconUrl = e" :isCrop="false"></ImageUpload>
          </el-form-item>
          <el-form-item label="介绍" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
            <editor :content="model.content" @get-content="getContent" ref="editor"></editor>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit" size="small" :loading="loading">保存</el-button>
    </div>

    <image-dialog :visible="digImgWrap" imageType='singleContent' :img-name="imgName" @close-imgbox="showImgBox" @get-imgsrc="onGetImgsrc" :cropper-option="cropperOption"></image-dialog>
  </div>
</template>

<script>
import editor from "commonSchool/editor";
import api from "apiSchool/common";
import upLoadMixin from 'jsSchool/upLoadMixin'

export default {
  mixins: [upLoadMixin],
  components: {
    editor,
  },
  data() {
    return {
      cropperOption: {
        autoCropWidth: 400,
        autoCropHeight: 250,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false,
      },
      tabbar: [{ index: 1, name: "基本信息" }],
      activeIndex: 1,
      model: {
        title: "",
        iconUrl: "",
        address: "",
        phone: "",
        content: "",
        categoryId: "",
      },
      category: [],
      areaHeight: 0,
      dataLoading: false,
      loading: false
    };
  },
  created() {
    this.listCategory()
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.getDetail();
    }
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    async listCategory() {
      let res = await api.treeByTypeCategory({type: 4})
      this.category = res.data.data
    },
    async getDetail() {
      let res = await api.getWelfare({ id: this.$route.query.id })
      this.model = res.data.data;
      this.dataLoading = false;
    },
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    // 获取content
    getContent(content) {
      this.model.content = content;
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false;
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    // 提交
    submit() {
      this.$refs.editor.getContent();
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.saveModel(this.model, this.$route.query.id ? 1 : 0)
        } else {
          this.$message.error("请将信息填写完整！");
          return false;
        }
      });
    },
    // model请求参数，val 0保存，1更新
    async saveModel(model, val) {
      try {
        let type = val ? 'updateWelfare' : 'addWelfare'
        let res = await api[type](model)
        this.loading = false;
        this.$message.success(val ? '更新成功' : '添加成功');
        this.$router.go(-1);
      } catch(e) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/assets/styles/element-variables.scss";

.tabbar {
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px 30px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    // background-color: #3091f2;
    background-color: $--color-primary;
    color: #fff;
  }
}
.context-box {
  padding: 20px;
  overflow: auto;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        // border-left: 3px solid #3091f2;
        border-left: 3px solid $--color-primary;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}

.area-box {
  display: flex;
  .sidebar {
    flex-shrink: 0;
    width: 150px;
  }
  .content {
    padding: 10px;
    overflow: auto;
  }
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    // border-color: #409eff;
    border-color: $--color-primary;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.img-box {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin: 0 6px 6px 0;
    flex-shrink: 0;
    // &:nth-child(7n) {
    //   margin: 0 0 6px 0;
    // }
    img {
      width: 100%;
    }
    .el-icon-error {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #c5c5c5;
    }
  }
  .item-upload {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    overflow: hidden;
    cursor: pointer;
    line-height: 100px;
    text-align: center;
    &:hover {
      // border-color: #409eff;
      border-color: $--color-primary;
    }
    i {
      font-size: 26px;
      color: #8c939d;
    }
  }
}
.property-box {
  border: 1px solid #e7eaec;
  padding: 15px;
  // width: 869px;
  .property-item {
    border-left: 3px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .name {
      background: rgba(0, 0, 0, 0.035);
      padding: 10px 10px 10px 15px;
      display: flex;
      justify-content: space-between;
      height: 38px;
      .delete-btn {
        display: none;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        .delete-btn {
          display: block;
        }
      }
    }
    .value {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .input {
        width: 150px;
        margin: 15px 0 0 15px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        i {
          font-size: 14px;
          position: absolute;
          right: -15px;
          top: 0;
          transition: all 0.3s ease;
        }
        &:hover {
          i {
            right: 3px;
            cursor: pointer;
          }
        }
      }
      .btn {
        margin: 15px 0 0 15px;
      }
    }
    &:hover {
      border-color: #337ab7;
    }
  }
}
.property-table {
  border: 1px solid #e7eaec;
  margin-top: 20px;
  // width: 900px;
  border-spacing: 0;
  border-collapse: collapse;
  tr {
    th {
      padding: 15px 12px;
      line-height: 1.5;
      .input-group {
        display: flex;
      }
    }
    td {
      border-top: 1px solid #e7eaec;
      line-height: 1.5;
      padding: 15px 12px;
      text-align: center;
    }
  }
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
