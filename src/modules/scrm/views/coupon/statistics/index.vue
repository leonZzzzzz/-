<template>
  <div>
    <div class="coupon-statistics">
      <sta-data-block
        :title="item.title"
        :data="item.data"
        :isLast="false"
        :dataSymbol="item.dataSymbol ? item.dataSymbol : ''"
        v-for="(item, index) in realtimeSummaryData"
        :key="index"
      ></sta-data-block>
    </div>
    <div class="main-content">
      <ranking-list></ranking-list>
    </div>
  </div>
</template>

<script>
import StaDataBlock from '../../statistics/components/StaDataBlock'
import RankingList from './RankingList'
export default {
  components: {
    StaDataBlock,
    RankingList
  },
  created() {
    this.getRealtimeSummary()
  },
  data() {
    return {
      realtimeSummaryData: []
    }
  },
  methods: {
    /* 获取数据 */
    getRealtimeSummary() {
      this.$http.getRealtimeSummary().then(res => {
        let data = res.data.data
        this.realtimeSummaryData = [
          {
            title: '已领取数（张）',
            data: data.receiveTimes
          },
          {
            title: '领取人数（人）',
            data: data.receivePersons
          },
          {
            title: '已使用数（张）',
            data: data.useTimes
          },
          {
            title: '使用人数（人）',
            data: data.usePersons
          },
          {
            title: '使用率',
            data: data.usePercent,
            dataSymbol: '%'
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-statistics {
  padding: 20px 30px 0;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
}
.main-content {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
}
</style>