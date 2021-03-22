<template>
  <QcNavigationPage content="推广员信息" class="prodocu-page" full v-loading="dataLoading">
    <QcTextPlate title="">
      <el-avatar shape="square" :src="detail.headImage" :size="100" style="margin-bottom: 15px;"></el-avatar>
      <QcTextPlateItem label="昵称：">{{ detail.appellation }}</QcTextPlateItem>
      <QcTextPlateItem label="手机：">{{ detail.mobile }}</QcTextPlateItem>
      <QcTextPlateItem label="等级：">{{ detail.level }}</QcTextPlateItem>
    </QcTextPlate>

    <div class="summary-group">
      <div class="card">
        <div>客户数</div>
        <div class="num">{{ detail.customerQuantity }}</div>
      </div>
      <div class="card">
        <div>团队数</div>
        <div class="num">{{ detail.friendQuantity }}</div>
      </div>
      <div class="card">
        <div>推广订单数</div>
        <div class="num">{{ detail.customerOrderQuantity }}</div>
      </div>
      <div class="card">
        <div>余额</div>
        <div class="num">{{ detail.wallet | formatPrice }}</div>
      </div>
    </div>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dataLoading: true,
      detail: {}
    }
  },
  created() {
    this.sharerGet(this.$route.query.id)
  },
  methods: {
    async sharerGet(id) {
      const res = await this.$http.sharerGet({ id })
      this.detail = res.data.data
      this.dataLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.summary-group {
  display: flex;
  .card {
    flex: 1;
    padding: 30px;
    text-align: center;
    color: #606266;
    &:not(:last-child) {
      border-right: 1px solid #eee;
    }
    .num {
      font-size: 30px;
      margin-top: 20px;
      color: #000;
    }
  }
}
</style>
