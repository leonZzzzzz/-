<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div class="form">
        <el-form :model="form" ref="form" class="new-form" style="width: 300px;" label-position="top">
          <el-form-item :label="`${form.time}小时内`" prop="time" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="form.time" clearable></el-input-number>
          </el-form-item>
          <el-form-item :label="`${form.city}个城市`" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="form.city" clearable></el-input-number>
          </el-form-item>
          <el-form-item :label="`${form.news}条资讯`" prop="news" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="form.news" clearable></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="分享" prop="share" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="form.share"></el-input-number>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit" size="small" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from "apiSchool/common";

export default {
  components: {},
  data() {
    return {
      wrapHeight: 0,
      areaHeight: 0,
      canISubmit: true,
      loading: false,
      dataLoading: true,
      model: {
        id: "ce6820145ac24048948f359d954e89a0",
        value: "24_30_30",
        name: "用户发布资讯限制配置",
        type: 5
      },
      form: {
        time: 0,
        city: 0,
        news: 0
      }
    };
  },
  created() {
    this.getInformationRestrict();
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
    // 获取配置
    getInformationRestrict() {
      api
        .getSettingRestrict()
        .then(res => {
          console.log("获取配置信息：", res);
          this.dataLoading = false;
          let value = res.data.data.value.split("_");
          this.form.time = value[0];
          this.form.city = value[1];
          this.form.news = value[2];
          this.$refs.form.clearValidate();
        })
        .catch(err => {
          this.dataLoading = false;
        });
    },
    //更新
    updateInformationRestrict(form) {
      api
        .updateConfig(form)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getSettingRestrict();
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          let value = `${this.form.time}_${this.form.city}_${this.form.news}`;
          this.model.value = value;
          this.updateInformationRestrict(this.model);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.context-box {
  padding: 20px;
  overflow: auto;
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
      img {
        cursor: pointer;
      }
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
