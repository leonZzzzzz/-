<template>
  <div class="list-room-data">
    <div class="list-room-data_room-info">
      <div class="list-room-data_room-info_img">
        <el-image :src="imgHost + model.roomCoverUrl" fit="cover" style="width:100%;height:170px"></el-image>
      </div>
      <el-form label-position="left" label-width="100px">
        <div class="list-room-data_room-info_title">{{ model.title }}</div>
        <el-form-item style="margin-bottom:0" label="开始时间">{{ model.startTime }}</el-form-item>
        <el-form-item style="margin-bottom:0" label="结束时间">{{ model.endTime }}</el-form-item>
        <el-form-item style="margin-bottom:0" label="门店">{{ model.storeName }}</el-form-item>
      </el-form>
    </div>
    <div class="list-room-data_main">
      <div class="list-room-data_main-left">
        <div class="list-room-data_main-title">数据面板</div>
        <el-form>
          <h2 style="margin-bottom: 10px;">观看数据</h2>
          <el-form-item style="margin-bottom:0px;text-align:right" label="观看人数">{{
            watchingData.totalWatchingQuantity
          }}</el-form-item>
          <el-form-item style="margin-bottom:0px;text-align:right" label="观看次数">{{
            watchingData.totalWatchingTimes
          }}</el-form-item>
          <el-form-item style="margin-bottom:0px;text-align:right" label="平均观看时长"
            >{{ Math.ceil(watchingData.averageWatchingSecond / 60) }}分钟</el-form-item
          >
          <div v-if="toggleShow">
            <h2 style="margin: 25px 0 10px;">互动数据</h2>
            <el-form-item style="margin-bottom:0px;text-align:right" label="分享人数">{{
              interactData.shareQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="分享次数">{{
              interactData.shareTimes
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="点赞人数">{{
              interactData.praiseQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="点赞次数">{{
              interactData.praiseTimes
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="评论人数">{{
              interactData.remarkQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="评论次数">{{
              interactData.remarkTimes
            }}</el-form-item>
            <h2 style="margin: 25px 0 10px;">商品数据</h2>
            <!-- <el-form-item
              style="margin-bottom:0px;text-align:right"
              label="商品累积推送"
            ></el-form-item> -->
            <el-form-item style="margin-bottom:0px;text-align:right" label="商品点击人数">{{
              productData.detailClickQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="商品点击次数">{{
              productData.detailClickTimes
            }}</el-form-item>
            <h2 style="margin: 25px 0 10px;">本场订阅数据</h2>
            <el-form-item style="margin-bottom:0px;text-align:right" label="订阅人数">{{
              interactData.subscribeQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="订阅次数">{{
              interactData.subscribeQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="取消订阅人数">{{
              interactData.cancelSubscribeQuantity
            }}</el-form-item>
            <el-form-item style="margin-bottom:0px;text-align:right" label="取消订阅次数">{{
              interactData.cancelSubscribeTimes
            }}</el-form-item>
          </div>
          <div
            @click="toggleShow = !toggleShow"
            style="font-size:14px;display: block;margin-top: 40px;color: #576B95;cursor: pointer;"
          >
            展示详细数据
          </div>
        </el-form>
      </div>
      <div class="list-room-data_main-right">
        <div class="room-card">
          <div class="room-card_title">直播控制</div>
          <div class="room-card_main">
            <div class="room-card_count">
              <div>
                <h4 class="room-card_count-title">当前直播状态</h4>
                <p class="room-card_count-num">
                  {{
                    {
                      '101': '直播中',
                      '102': '未开始',
                      '103': '已结束',
                      '104': '禁播',
                      '105': '暂停中',
                      '106': '异常',
                      '107': '已过期'
                    }[model.liveStatus]
                  }}
                </p>
              </div>
              <div>
                <h4 class="room-card_count-title">直播时长</h4>
                <p class="room-card_count-num">{{ model.duration | formatSeconds }}</p>
              </div>
              <div>
                <h4 class="room-card_count-title">回放</h4>
                <p class="room-card_count-num">{{ model.isRecordVideo ? '有' : '无' }}</p>
              </div>
              <div>
                <h4 class="room-card_count-title">评论</h4>
                <p class="room-card_count-num">{{ model.isAllowComment ? '开' : '关' }}</p>
              </div>
            </div>
          </div>
          <div style="margin-top:30px"></div>
        </div>
        <div class="room-card">
          <div class="room-card_title">推送控制</div>
          <div class="room-card_main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="商品" name="product">
                <QcTable
                  :option="{
                    url: `api/admin/v1/liveRoomProduct/pageProduct?liveRoomId=${$route.query.id}`,
                    isFull: false,
                    height: '400'
                  }"
                  :column="productColumn"
                ></QcTable>
              </el-tab-pane>
              <!-- <el-tab-pane label="抽奖" name="lottery">抽奖</el-tab-pane> -->
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'product',
      toggleShow: false,
      model: {},
      watchingData: {},
      interactData: {},
      productData: {},
      productColumn: [
        { type: 'index', label: '序号', align: 'center' },
        {
          label: '商品信息',
          width: '250px',
          formatter: (row) => {
            return (
              <QcProductItem img={this.imgHost + row.productIconUrl} title={row.productName}>
                <div>价格：￥{row.productPrice / 100}</div>
              </QcProductItem>
            )
          }
        },
        { label: '被点击次数', align: 'center', prop: 'clickQuantity' }
      ]
    }
  },
  created() {
    const id = this.$route.query.id
    this.getLiveRoom(id)
    this.listRoomWatchingDate(id)
    this.listRoomInteractDate(id)
    this.$http.get('api/admin/v1/live-room-product-click/summary', { liveRoomId: id }).then((res) => {
      this.productData = res.data.data
    })
  },
  methods: {
    getLiveRoom(id) {
      this.$http.getLiveRoom({ id }).then((res) => {
        this.model = res.data.data
      })
    },
    listRoomWatchingDate(id) {
      this.$http.listRoomWatchingDate({ id }).then((res) => {
        this.watchingData = res.data.data
      })
    },
    listRoomInteractDate(id) {
      this.$http.listRoomInteractDate({ id }).then((res) => {
        this.interactData = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-room-data {
  margin: 0 auto;
  width: 1200px;
  &_room-info {
    background: #fff;
    padding: 40px;
    display: flex;
    margin-bottom: 20px;
    &_img {
      width: 280px;
      height: 171px;
      margin-right: 28px;
    }
    &_title {
      font-size: 20px;
      margin-bottom: 40px;
    }
  }
  &_main {
    &-title {
      font-size: 20px;
      margin-bottom: 30px;
      color: #353535;
    }
    &-left {
      float: left;
      width: 272px;
      box-sizing: border-box;
      padding: 40px;
      background: #fff;
    }
    &-right {
      margin-left: 292px;
      .room-card {
        padding: 40px;
        background: #fff;
        margin-bottom: 20px;
        &_title {
          font-size: 20px;
          margin-bottom: 30px;
          color: #353535;
        }
        &_count {
          display: flex;
          justify-content: space-between;
          &-title {
            margin-bottom: 5px;
            color: #00000080;
            font-size: 14px;
          }
          &-num {
            line-height: 40px;
            font-size: 18px;
            color: #353535;
          }
        }
      }
    }
  }
}
</style>
