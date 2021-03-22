<template>
  <el-dialog title="赔付历史" :visible.sync="visible" width="675px" :append-to-body="true" :before-close="onClose">
    <CompensationHistoryItem v-for="list in compensationHistoryList" :key="list.id" :flow-list="list" />
  </el-dialog>
</template>

<script>
import CompensationHistoryItem from '../../service/compensation/CompensationHistoryItem'

export default {
  components: { CompensationHistoryItem },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.historyOrderCompensation(this.orderId)
      }
    }
  },
  data() {
    return {
      compensationHistoryList: []
    }
  },
  methods: {
    historyOrderCompensation(orderId) {
      this.$http.historyOrderCompensation({ orderId }).then((res) => {
        this.compensationHistoryList = res.data.data
      })
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style></style>
