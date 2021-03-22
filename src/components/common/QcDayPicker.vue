<template>
  <div class="qc-day-picker">
    <div class="qc-day-picker__item">
      <el-select class="qc-day-picker__value" placeholder v-model="value[0]" @change="onChange">
        <el-option
          v-for="(time, index) in 31"
          :key="time"
          :label="index <= 9 ? '0' + index : index"
          :value="index <= 9 ? '0' + index : index"
        ></el-option>
      </el-select>
      <span class="qc-day-picker__unit">天</span>
    </div>
    <div class="qc-day-picker__item">
      <el-select class="qc-day-picker__value" placeholder v-model="value[1]" @change="onChange">
        <el-option
          v-for="(time, index) in 24"
          :key="time"
          :label="index <= 9 ? '0' + index : index"
          :value="index <= 9 ? '0' + index : index"
        ></el-option>
      </el-select>
      <span class="qc-day-picker__unit">时</span>
    </div>
    <div class="qc-day-picker__item">
      <el-select class="qc-day-picker__value" placeholder v-model="value[2]" @change="onChange">
        <el-option
          v-for="(time, index) in 60"
          :key="time"
          :label="index <= 9 ? '0' + index : index"
          :value="index <= 9 ? '0' + index : index"
        ></el-option>
      </el-select>
      <span class="qc-day-picker__unit">分</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array
  },
  methods: {
    onChange() {
      this.$emit('input', [
        this.value[0] ? this.value[0] : (this.value[0] = '00'),
        this.value[1] ? this.value[1] : (this.value[1] = '00'),
        this.value[2] ? this.value[2] : (this.value[2] = '00')
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.qc-day-picker {
  display: flex;
  &__item {
    margin-right: 10px;
  }
  &__value {
    width: 70px;
  }
  &__unit {
    margin-left: 10px;
  }
}
</style>
