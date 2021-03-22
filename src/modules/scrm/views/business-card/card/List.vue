<template>
  <div class="enterprise-div">
    <el-row :gutter="24">
      <el-col :span="8" v-for="(item, index) in tableData" :key="index">
        <div class="test-div">
          <div class="test-img-left">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="test-img-right">
            <div class="test-container">
              <div class="test-top">
                <el-button type="text" @click="changeDetail(item)">修改</el-button>
              </div>
              <div class="test-introduct">
                <div class="introduct-div">
                  <div class="div-first">{{ item.name }}</div>
                  <div class="div-second">{{ item.position || '--' }}</div>
                </div>

                <!-- <div>{{ item.position }}</div> -->
              </div>

              <div class="test-address">
                <div class="test-address-content">{{ item.address || '-' }}</div>
                <div class="test-address-Title"><i class="el-icon-location-outline"></i></div>
              </div>
              <div class="test-tel">
                <div class="test-address-content">{{ item.phone || '-' }}</div>
                <div class="test-address-Title"><i class="el-icon-phone-outline"></i></div>
              </div>
              <div class="test-email">
                <div class="test-address-content">{{ item.email || '-' }}</div>
                <div class="test-address-Title"><i class="el-icon-message"></i></div>
              </div>
              <div class="test-zan">
                <span>置顶名片 {{ item.topQuantity }}</span>
              </div>
              <div class="test-zan-two">
                <span>浏览记录 {{ item.viewPersonQuantity }}</span>
                <span>点赞数量 {{ item.phraseQuantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="none" v-if="tableData.length < page.pageSize"><el-button type="text">暂无更多</el-button></div>
    <div class="none" v-else><el-button type="text" @click="openMore">点击加载更多</el-button></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        pageSize: 20,
        pageNum: 1
      },
      tableData: [],
      height: 400
    }
  },
  methods: {
    changeDetail(item) {
      this.$router.push(`/main/scrm/bussiness-card/card/detail?id=${item.id}`)
    },
    openMore() {
      this.page.pageSize += 20
      this.getCropBusinessCard()
    },
    getCropBusinessCard() {
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      this.$http.getCropBusinessCard(params).then((res) => {
        this.tableData = res.data.data.list
      })
    }
  },

  created() {
    this.getCropBusinessCard()
  }
}
</script>

//
<style lang="scss" scoped>
.enterprise-div {
  width: 100%;
  height: 100%;
  // background-color: #fff;
  .none {
    text-align: center;
    color: #606266;
    font-size: 14px;
  }
  .test-div {
    cursor: pointer;
    margin: 20px 0;
    float: left;
    width: 30%;
    // margin: 0 auto;
    display: flex;
    .test-img-left {
      clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);

      img {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        width: 220px;
        height: 220px;
      }
    }
    .test-img-right {
      margin-left: -55px;
      clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
      .test-container {
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        width: 220px;
        height: 220px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        .test-top {
          text-align: right;
          padding: 0px 20px;
          font-size: 16px;
          color: #616161;
        }
        .test-introduct {
          width: 220px;
          height: 45px;
          background-image: url(../../../images/card-bg.png);
          display: flex;
          .introduct-div {
            margin-left: auto;
            width: 140px;
            .div-first {
              margin-top: 5px;
              color: #353535;
              font-weight: bold;
              line-height: 20px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .div-second {
              color: #737373;
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .test-address {
          margin-top: 10px;
          display: flex;
          color: #8d8e97;
          font-size: 12px;
          text-align: left;
          padding: 0 20px 0 60px;

          .test-address-content {
            flex: 1;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .test-address-Title {
            margin-left: auto;
            font-size: 14px;
            margin-left: 5px;
          }
        }
        .test-tel {
          margin-top: 10px;
          display: flex;
          color: #8d8e97;
          font-size: 12px;
          text-align: right;
          padding: 0 20px 0 50px;
          .test-address-content {
            margin-left: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .test-address-Title {
            font-size: 14px;
            margin-left: 5px;
          }
        }
        .test-email {
          margin: 10px 0;
          display: flex;
          color: #8d8e97;
          font-size: 12px;
          text-align: right;
          padding: 0 20px 0 30px;
          .test-address-content {
            margin-left: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .test-address-Title {
            font-size: 14px;
            margin-left: 5px;
          }
        }
        .test-zan {
          color: #8d8e97;
          margin-left: 20px;
          font-size: 12px;
          padding: 5px 20px 5px 0;
          text-align: right;
          span {
            border: 1px solid #8d8e97;
            padding: 2px;
          }
        }
        .test-zan-two {
          color: #8d8e97;
          padding: 5px 0;
          font-size: 12px;
          margin-left: 20px;
          margin-right: 20px;
          text-align: right;
          span {
            padding: 2px;
            border: 1px solid #8d8e97;
            margin-left: 5px;
            i {
              margin-right: 2px;
              color: #294a7b;
            }
          }
        }
      }
    }
  }
}
.look-div {
  margin-right: 5px;
}
</style>
