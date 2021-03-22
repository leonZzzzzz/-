<template>
  <!-- 
     <xfo-input xfoRef="cardName" v-model="companyInfo.name"></xfo-input> xfo
 -->
  <div class="xfo-input">
    <p v-show="!isShow">{{ value || '- -' }}</p>
    <div v-if="isShow" class="xfo-input-content">
      <el-input :ref="xfoRef" v-model="inputValue" placeholder="请输入内容" @blur="onSuccess"></el-input>
    </div>
    <div class="xfo-update-btn">
      <el-button type="text" icon="el-icon-edit" @click="showInput"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    xfoRef: String,
    value: String
  },
  data() {
    return {
      isShow: false,
      inputValue: ''
    }
  },
  methods: {
    showInput() {
      this.isShow = true
      this.inputValue = this.value
      this.$nextTick(() => {
        this.$refs[this.xfoRef].$el.children[0].focus()
      })
    },
    onSuccess() {
      this.$emit('input', this.inputValue)
      this.isShow = false
      this.$emit('success', this.inputValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-input {
  min-height: 36px;
  border: solid #dcdfe6;
  border-width: 0 0 1px 0;
  padding: 0 30px 0 15px;
  position: relative;
  .xfo-input-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1998;
  }
  .xfo-update-btn {
    height: 36px;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto 0;
    z-index: 1997;
  }
}
</style>
