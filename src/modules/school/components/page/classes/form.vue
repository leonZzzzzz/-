<template>
  <el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="overflow: auto;" v-loading="dataLoading">
      <el-form :model="model"  class="new-form" ref="model" label-position="top" size="small">
        <el-form-item class="item-text">
          <el-form-item label="名称" prop="className" :rules="[{ required: true, message: '该字段不能为空'}]" v-if="!isLingnan">
            <el-input size="small" v-model="model.className" clearable></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number size="small" v-model="model.seqNum"></el-input-number>
          </el-form-item>
          <template v-if="isLingnan">
            <el-form-item label="年份" prop="year" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker v-model="model.year" type="year" placeholder="年份" value-format="yyyy" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="学位" prop="degreeId" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-select v-model="model.degreeId" @change="changeSelect">
                <el-option v-for="(item, i) in degreeList" :key="i" :label="item.name" :value="item.id" ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form-item>
        <el-form-item class="item-text" v-if="model.degreeId">
          <el-form-item label="系别" prop="departmentId" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.departmentId">
              <el-option v-for="(item, i) in departmentList" :key="i" :label="item.name" :value="item.id" ></el-option>
            </el-select>
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
    classData: Object,
  },
  data() {
    return {
      model: {
        className: "",
        seqNum: 0,
        year: '',
        degreeId: '',
        departmentId: '',
        professionId: '',
      },
      loading: false,
      dataLoading: false,
      degreeList: [],
      departmentList: [],
      isLingnan: true,
    };
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        this.model = this.classData
        if (this.isLingnan) this.professionList(2, this.classData.degreeId)
      }
    },
    'model.degreeId'(nVal, oVal) {
      if (nVal && oVal && nVal !== oVal) this.model.departmentId = ''
    }
  },
  created() {
    // this.isLingnan = /lingnan/.test(this.base.projectName())
    // this.isLingnan = /lingnan/.test(this.base.projectName()) || this.base.projectName() === 'alumni'
    if (this.isLingnan) this.professionList(1)
  },
  methods: {
    async professionList(val, parentId) {
      let res = await api.professionList({type: val, parentId})
      if (val === 1) this.degreeList = res.data.data.list
      else this.departmentList = res.data.data.list
    },
    changeSelect(parentId) {
      this.professionList(2, parentId)
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isLingnan) this.model.className = ''
          this.saveModel(this.model, this.id ? 1 : 0)
        } else {
          return false;
        }
      });
    },
    async saveModel(model, val) {
      try {
        let type = val ? 'updateClass' : 'addClass'
        let res = await api[type](model)
        this.loading = false;
        this.$message.success(val ? '更新成功' : '添加成功')
        this.close(true);
      } catch(e) {
        console.log(e);
        this.loading = false;
      }
    },
    close(flag) {
      this.reduc();
      this.$emit("close", flag);
    },
    reduc() {
      this.model = {
        className: "",
        seqNum: 0,
        year: '',
        degreeId: '',
        departmentId: '',
        professionId: '',
      };
    },
  }
};
</script>