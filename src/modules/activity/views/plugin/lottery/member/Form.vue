<template>
  <el-dialog
    title="选择中奖等级"
    :visible.sync="visible"
    width="880px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="overflow: auto;">
      <el-radio-group v-model="lotteryItemId">
        <el-radio v-for="(item, i) in itemList" :key="i" :label="item.id" border
          >{{ item.title }}（{{ item.awardNum }}人）</el-radio
        >
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :disabled="lotteryItemId === ''" :loading="loading"
        >确 定</el-button
      >
    </span>

    <login-dialog :visible="digLogin" @close="closeLogin"></login-dialog>
  </el-dialog>
</template>

<script>
import loginMixin from '@/mixins/loginMixin'

export default {
  mixins: [loginMixin],
  props: {
    visible: Boolean,
    itemList: Array,
    selectionList: Array,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        username: '',
        password: '',
        memberId: ''
      },
      lotteryItemId: '',
      loading: false
    }
  },
  methods: {
    success() {
      for (let i = 0; i < this.itemList.length; i++) {
        let item = this.itemList[i]
        if (item.id === this.lotteryItemId && this.selectionList.length > item.awardNum) {
          this.$message.warning('所选人数超过奖项指定人数')
          return
        }
      }
      let model = {
        lotteryId: this.$route.query.id,
        lotteryItemId: this.lotteryItemId,
        idList: this.selectionList.map((item) => item.id)
      }
      console.log(model)
      this.loading = true
      this.lotteryDesignate(model)
    },
    async lotteryDesignate(model) {
      try {
        let res = await this.$http.lotteryDesignate(model)
        console.log(res.data)
        this.$message.success(res.data.message)
        this.loading = false
        this.close(false, 'new')
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    close(flag, val) {
      this.lotteryItemId = ''
      this.$emit('close', flag, val)
    }
  }
}
</script>
