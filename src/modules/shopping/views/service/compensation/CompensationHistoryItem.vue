<template>
  <div>
    <el-timeline style="display: inline-block;width:100%;" :reverse="false">
      <el-timeline-item
        size="large"
        v-for="(item, index) in flowList.flowList"
        :key="index"
        :color="index === 0 ? '#ff6c4a' : ''"
      >
        <el-row :style="index === 0 ? 'color: #000' : 'color: #a7a7a7'">
          <el-col :span="16" style="font-size:18px;">{{ item.title }}</el-col>
          <el-col :span="8">{{ item.createTime }}</el-col>
        </el-row>
        <ul
          :class="{ after: index === 0 }"
          class="compensation-flow-item"
          v-if="index === flowList.flowList.length - 1"
        >
          <li class="compensation-flow-list">订单单号：{{ flowList.orderNumber }}</li>
          <li class="compensation-flow-list">赔付单号：{{ flowList.number }}</li>
          <li class="compensation-flow-list">订单金额：￥{{ flowList.orderAmount | formatPrice }}</li>
          <li class="compensation-flow-list">
            赔付类型：
            <span style="color:red">{{ flowList.reasonType }}</span>
          </li>
          <li class="compensation-flow-list">
            赔付金额：
            <span style="color:red">￥{{ flowList.applyAmount | formatPrice }}</span>
          </li>
          <li class="compensation-flow-list">赔付原因：{{ flowList.reason || '--' }}</li>
          <li class="compensation-flow-list" v-if="item.image">
            <el-image
              style="width: 100px; height: 100px"
              v-for="img in item.image.split(',')"
              :key="img"
              :src="imgHost + img"
              :preview-src-list="item.image.split(',').map((img) => imgHost + img)"
              fit="contain"
            ></el-image>
          </li>
        </ul>
        <ul
          :class="{ after: index === 0 }"
          class="compensation-flow-item"
          v-else-if="'platform_agree' === item.statusValue"
        >
          <li class="compensation-flow-list">
            赔付金额：
            <span style="color:red">￥{{ flowList.applyAmount | formatPrice }}</span>
          </li>
          <template v-if="hasShowProfit">
            <li class="compensation-flow-list">
              扣除供应商收益金额：
              <span style="color:red">￥{{ flowList.supplierProfit | formatPrice }}</span>
            </li>
            <li class="compensation-flow-list">
              扣除门店收益金额：
              <span style="color:red">￥{{ flowList.storeProfit | formatPrice }}</span>
            </li>
          </template>
        </ul>
        <ul :class="{ after: index === 0 }" class="compensation-flow-item" v-else>
          <li class="compensation-flow-list">取消原因：{{ item.content }}</li>
        </ul>
      </el-timeline-item>
    </el-timeline>
    <el-dialog
      :visible="previewDialog"
      width="480px"
      :append-to-body="true"
      :before-close="() => (previewDialog = false)"
    >
      <img :src="imgHost + previewImg" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    hasShowProfit: {
      type: Boolean,
      default: true
    },
    flowList: {}
  },
  data() {
    return {
      previewDialog: false,
      previewImg: ''
    }
  },
  methods: {
    onShowImage(src) {
      this.previewDialog = true
      this.previewImg = src
    }
  }
}
</script>

<style lang="scss" scope>
.compensation-flow-item {
  .compensation-flow-list {
    color: #a7a7a7;
    margin-top: 10px;
    list-style: none;
  }
  &.after {
    .compensation-flow-list {
      color: #000;
    }
  }
}
</style>
