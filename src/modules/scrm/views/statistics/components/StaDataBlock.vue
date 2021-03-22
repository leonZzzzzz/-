<template>
  <div class="xfo-data-block">
    <div class="xfo-title">
      {{ title }}
      <el-tooltip v-if="isTip" :content="tipContent" :placement="tipPlacement" :effect="tipEffect">
        <el-button style="padding: 0; margin-left: 5px" type="text" icon="el-icon-warning-outline"></el-button>
      </el-tooltip>
    </div>
    <div class="xfo-data">
      {{ data }} <span class="xfo-dataSymbol" v-if="dataSymbol">{{ dataSymbol }}</span>
    </div>
    <div class="xfo-change" v-if="isLast">
      比昨天<span
        :class="{
          'el-icon-top': type == 'up',
          'el-icon-bottom': type == 'down'
        }"
        >{{ Math.abs(percent) }}%</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    data: {
      type: [Number, String],
      default: 0
    },
    dataSymbol: {
      type: String,
      default: ''
    },
    // up 上涨 down 下降
    type: {
      type: String,
      default: 'down'
    },
    percent: {
      type: Number,
      default: 0
    },
    isLast: {
      type: Boolean,
      default: true
    },
    isTip: {
      type: Boolean,
      default: false
    },
    tipPlacement: {
      type: String,
      default: 'right' // element文档
    },
    tipContent: {
      type: String,
      default: ''
    },
    tipEffect: {
      type: String,
      default: 'light' // light dark
    }
  }
}
</script>

<style lang="scss" scoped>
.xfo-data-block {
  padding: 10px 0;
  text-align: center;
  .xfo-title {
    font-size: 14px;
    color: #a6a6a6;
    // display: flex;
  }
  .xfo-data {
    font-size: 24px;
    font-weight: bold;
    color: #101010;
    line-height: 60px;
    .xfo-dataSymbol {
      font-size: 14px;
    }
  }
  .xfo-change {
    font-size: 12px;
    color: #3a3a3a;
    .el-icon-top {
      color: #ed1c24;
      font-weight: bold;
    }
    .el-icon-bottom {
      color: #22b14c;
      font-weight: bold;
    }
  }
}
</style>