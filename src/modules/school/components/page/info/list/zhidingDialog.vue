<template>
  <el-dialog title="置顶时刻表" :visible="visible" :append-to-body="true" @close="dialogClose()">
    <el-tabs v-model="activeName">
      <el-tab-pane label="今天" name="first">
        <el-table :data="zhidingData">
          <el-table-column type="selection"></el-table-column>
          <el-table-column align="center" label="时间段"></el-table-column>
          <el-table-column align="center" label="剩余名额"></el-table-column>
          <el-table-column align="center" label="价钱"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="明天" name="second">
        <el-table :data="zhidingData">
          <el-table-column type="selection"></el-table-column>
          <el-table-column align="center" label="时间段"></el-table-column>
          <el-table-column align="center" label="剩余名额"></el-table-column>
          <el-table-column align="center" label="价钱"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="后天" name="third">
        <el-table :data="zhidingData">
          <el-table-column type="selection"></el-table-column>
          <el-table-column align="center" label="时间段"></el-table-column>
          <el-table-column align="center" label="剩余名额"></el-table-column>
          <el-table-column align="center" label="价钱"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      zhidingData: [],
      activeName: "first"
    };
  },
  methods: {
    dialogClose() {
      this.$emit("dialog-close", false);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

