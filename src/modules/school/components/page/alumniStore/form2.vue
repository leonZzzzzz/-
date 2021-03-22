<template>
<el-dialog title="开通年会费" :visible.sync="visible" width="500px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" style="width: 200px;" label-position="top">
      <el-form-item>
        <el-form-item label="开通年份" prop="openYear" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model.trim="model.openYear" placeholder="请输入年份格式：YYYY"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="amount" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model.number="model.amount" placeholder="请输入数值"></el-input>
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
    }
  },
  components: {
    
  },
  data() {
    return {
      model: {
        openYear: '',
        contactsId: '',
        amount: 0,
      },
      options: [],
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        this.model.contactsId = this.id
      }
    }
  },
  methods: {
    //添加
    save() {
      let model  = JSON.parse(JSON.stringify(this.model));
      if (model.amount && model.amount != '') {
        model.amount = model.amount * 100
      }
      api.openMembership(model).then(res => {
        this.loading = false;
        this.$message({
          message: "开通成功",
          type: "success"
        });
        this.close(true);
      }).catch(err => {
        this.loading = false;
      })
    },
    success() {
      // console.log(this.model);
      // return
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.save();
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.model = this.reduc();
      this.$refs.model.resetFields();
      this.$emit("closeForm2", flag);
    },
    reduc() {
      let model = {
        openYear: '',
        updateId: '',
        amount: 0,
      };
      return model;
    },
  }
};
</script>
