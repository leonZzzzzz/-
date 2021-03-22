<template>
  <el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="overflow: auto;" v-loading="dataLoading">
      <el-form :model="model" ref="model" class="new-form" label-position="top">
        <el-form-item class="item-text">
          <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.name" clearable maxlength="32" placeholder="最多可输入32位"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number size="small" v-model="model.seqNum"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input size="small" v-model="model.info" clearable></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "apiSchool/common";

export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      model: {
        name: "",
        type: 2,
        seqNum: 0,
        info: ""
      },
      loading: false,
      dataLoading: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.id != "") {
          this.dataLoading = true;
          this.detail();
        }
      }
    }
  },
  methods: {
    //获取
    async detail() {
      try {
        let res = await api.getCategory({ id: this.id })
        this.model = res.data.data;
        this.dataLoading = false;
      } catch(e) {
        this.dataLoading = false;
      }
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.saveModel(this.model, this.id ? 1 : 0)
        } else {
          return false;
        }
      });
    },
    // model请求参数，val 0保存，1更新
    async saveModel(model, val) {
      try {
        let type = val ? 'updateCategoryJson' : 'addCategory'
        let res = await api[type](model)
        this.loading = false;
        this.$message.success(val ? '更新成功' : '添加成功');
        this.close(true);
      } catch(e) {
        this.loading = false;
      }
    },
    close(flag) {
      this.reduc();
      this.$emit("close", flag);
    },
    reduc() {
      this.model = {
        name: "",
        type: 2,
        seqNum: 0,
        info: ""
      }
    },
  }
};
</script>

