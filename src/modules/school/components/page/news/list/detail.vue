<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div
        class="item"
        :class="{'active': i + 1 === activeIndex}"
        v-for="(item, i) in tabbar"
        :key="i"
        @click="handleSelect(item.index)"
      >{{item.name}}</div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <el-form :model="model" ref="model" label-position="top" size="small">
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input
              size="small"
              v-model.trim="model.title"
              :maxlength="32"
              placeholder="最多可输入32位"
              style="width:400px;"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.categoryId" placeholder="请选择">
              <el-option v-for="(item, i) in category" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-form-item
              label="分类"
              prop="categoryId"
              :rules="[{ required: true, message: '该字段不能为空'}]"
              class="inline right"
            >
              <el-select v-model="model.categoryId" size="small">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, i) in category"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="序号" prop="seqNum" class="inline">
              <el-input-number size="small" v-model="model.seqNum" :min="0"></el-input-number>
            </el-form-item>
          </el-form-item>
          <el-form-item label="封面" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
            <div class="upload-img-box" @click="showImgBox(true, 'iconUrl')">
              <img v-if="model.iconUrl" :src="`${imgHost}${model.iconUrl}`" style="width: 120px;" />
              <i v-else class="el-icon-plus upload-icon"></i>
            </div>
          </el-form-item>
          <el-form-item label="简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input
              size="small"
              type="textarea"
              :rows="4"
              v-model="model.info"
              style="width:400px;"
              clearable
            ></el-input>
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

    <image-dialog
      :visible="digImgWrap"
      imageType="news"
      :img-name="imgName"
      @close-imgbox="showImgBox"
      @get-imgsrc="onGetImgsrc"
      :cropper-option="cropperOption"
    ></image-dialog>
  </div>
</template>

<script>
import editor from "commonSchool/editor";
import api from "apiSchool/common";
import upLoadMixin from 'jsSchool/upLoadMixin'

export default {
  mixins: [upLoadMixin],
  components: {
    editor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500
      },
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
        categoryId: "",
        iconUrl: "",
        info: "",
        content: "",
        seqNum: 0,
      },
      category: [],
      areaHeight: 0,
      dataLoading: false,
      loading: false,
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
      let res = await api.treeByTypeCategory({type: 2})
      this.category = res.data.data
    },
    async getDetail() {
      let res = await api.getNewsDetail({ id: this.$route.query.id })
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
      console.log(6666666)
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
        let type = val ? 'updateNews' : 'addNews'
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
