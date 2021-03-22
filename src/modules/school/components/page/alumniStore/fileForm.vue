<template>
   <el-dialog title="导入错误提示" :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="overflow: auto; max-height: 500px;">
        <div v-for="(value, key) in errMsgMap" :key="key" class="str-item">
          <p class="title">{{key}}: </p>
          <div>
            <span v-for="(str, i) in value" :key="i">{{i !== 0 ? '，' : ''}}{{str}}</span>
          </div>
        </div>
      </div>
   </el-dialog>
</template>

<script>
import api from "apiSchool/common";

export default {
  props: {
    visible: Boolean,
    cityList: Array,
    tradeList: Array,
    classList: Array,
    id: {
      type: String,
      default: ""
    },
    errMsgMap: Object
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: "",
        studentId: "",
        phone: "",
        classId: "",
        company: "",
        position: "",
        // trade: "",
        city: "",
        mailbox: ""
      },
      options: [],
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        // this.$refs.model.clearValidate();
        this.dataLoading = true;
        this.detail();
      }
    }
  },
  methods: {
    //更新信息
    detail() {
      api.getAlumni({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;

        // this.options = [this.model.areaId, this.model.id]
        // console.log(this.options)
      });
    },
    cityChange(val) {
      this.model.areaId = val[1];
    },
    getClassList() {
      api.getClassList().then(res => {
        this.classList = res.data.data.list;
      });
    },
    getTrade() {
      api.getConfigTrade().then(res => {
        try {
          let list = res.data.data.value.split("_");
          this.tradeList = list;
        } catch (error) {}
      });
    },
    //添加
    save() {
      api
        .addAlumni(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //修改
    update() {
      api
        .updateAlumni(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.update();
          } else {
            this.save();
          }
        } else {
          return false;
        }
      });
    },
    close(flag) {
      // this.model = this.reduc();
      // this.$refs.model.resetFields();
      this.$emit("close", flag);
    },
    reduc() {
      let model = {
        name: "",
        studentId: "",
        phone: "",
        classId: "",
        company: "",
        position: "",
        // trade: "",
        city: "",
        mailbox: ""
      };
      return model;
    },
  }
};
</script>

<style lang="scss" scoped>
.str-item {
  padding: 10px 0;
  display: flex;
  .title {
    font-size: 18px;
    margin-right: 10px;
    flex-shrink: 0;
  }
}
</style>
