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
          <el-form-item>
            <el-form-item label="排序" class="inline">
              <el-input-number size="small" v-model="model.seqNum"></el-input-number>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-form-item
              label="捐赠金额"
              prop="amount"
              :rules="[{ required: true, message: '该字段不能为空'}]"
              class="inline right"
            >
              <el-input
                size="small"
                v-model.trim="model.amount"
                type="number"
                :maxlength="32"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="isConstant"
              :rules="[{ required: true, message: '该字段不能为空'}]"
              class="inline"
            >
              <el-switch v-model="model.isConstant" active-text="是否设置为最低捐赠金额"></el-switch>
            </el-form-item>
          </el-form-item>
          <el-form-item label="主办方" prop="sponsor" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input
              size="small"
              v-model.trim="model.sponsor"
              :maxlength="32"
              placeholder="最多可输入32位"
              style="width:400px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="证书内容(￥符号为占位符，会自动替换为金额数)"
            prop="credentialContent"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-input
              size="small"
              type="textarea"
              :rows="4"
              v-model="model.credentialContent"
              style="width:400px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="结束时间"
            prop="endTime"
            :rules="[{ required: true, message: '该字段不能为空'}]"
          >
            <el-date-picker
              type="datetime"
              size="small"
              placeholder="选择日期"
              v-model="model.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="封面" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
            <ImageUpload
              :image-url="model.iconUrl"
              :on-success="(e) => model.iconUrl = e"
              :isCrop="false"
            ></ImageUpload>
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
          <el-form-item label="详情" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
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
      imageType="singleContent"
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
import upLoadMixin from "jsSchool/upLoadMixin";

export default {
  mixins: [upLoadMixin],
  components: {
    // ImageDialog,
    editor
  },
  data() {
    return {
      cropperOption: {
        autoCropWidth: 400,
        autoCropHeight: 250,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      },
      tabbar: [{ index: 1, name: "基本信息" }],
      activeIndex: 1,
      model: {
        title: "",
        iconUrl: "",
        amount: "",
        info: "",
        content: "",
        isConstant: false,
        sponsor: "",
        credentialContent: "",
        endTime: "",
        seqNum: 0
      },
      category: [],
      areaHeight: 0,
      dataLoading: false,
      loading: false
    };
  },
  created() {
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
    async getDetail() {
      let res = await api.getDonate({ id: this.$route.query.id });
      this.model = res.data.data;
      if (this.model.amount) this.model.amount = this.model.amount / 100;
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
      let model = JSON.parse(JSON.stringify(this.model));
      model.amount = Math.floor(model.amount * 100);
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.saveModel(model, this.$route.query.id ? 1 : 0);
        } else {
          this.$message.error("请将信息填写完整！");
          return false;
        }
      });
    },
    // model请求参数，val 0保存，1更新
    async saveModel(model, val) {
      try {
        let type = val ? "updateDonate" : "insertDonate";
        let res = await api[type](model);
        this.loading = false;
        this.$message.success(val ? "更新成功" : "添加成功");
        this.$router.go(-1);
      } catch (e) {
        this.loading = false;
      }
    }
  }
};
</script>