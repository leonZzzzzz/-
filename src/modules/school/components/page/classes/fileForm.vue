<template>
   <el-dialog title="导入提示" :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="overflow: auto; max-height: 500px;">
        <div v-if="fileData && fileData.legalNameList && fileData.legalNameList.length" style="margin-bottom: 20px;">
          <p style="color: green; font-size: 18px;">成功信息：</p>
          <p>
            <span v-for="(item, i) in fileData.legalNameList" :key="i">{{i !== 0 ? '，' : ''}}{{item}}</span>
          </p>
        </div>
        <p style="color: red; font-size: 18px;">错误信息：</p>
        <div v-for="(value, key) in fileData.errMap" :key="key" class="str-item">
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
    fileData: Object
  },
  data() {
    return {
      digImgWrap: false,
    };
  },
  methods: {
    close(flag) {
      this.$emit("close", flag);
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
