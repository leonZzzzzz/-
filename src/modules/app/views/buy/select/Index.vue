<template>
  <div class="app-buy">
    <el-tabs v-model="type">
      <el-tab-pane label="标准版本" name="standard">
        <Standard />
      </el-tab-pane>
      <el-tab-pane label="插件功能" name="plugin">
        <Plugin></Plugin>
      </el-tab-pane>
    </el-tabs>
    <div class="menu-wrap">
      <div class="right">
        <div>
          已选服务：
          <el-popover placement="top-end" width="510" trigger="click">
            <div style="margin: -12px -12px 10px;padding: 15px 20px;background: #eee;">已选服务</div>
            <el-table :data="selectPricing" :show-header="false">
              <el-table-column width="300px">
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center">
                    <img :src="imgHost + scope.row.iconUrl" style="width:50px;height:50px;margin-right:15px;" />
                    {{ scope.row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <div>{{ scope.row.type == 1 ? '标准' : '插件' }}</div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <div>{{ scope.row.price | formatPrice }}元/年</div>
                </template>
              </el-table-column>
              <el-table-column width="50px">
                <template slot-scope="scope">
                  <div class="el-icon-delete" @click="deleteSelectPricing(scope.$index)"></div>
                </template>
              </el-table-column>
            </el-table>
            <span slot="reference">
              <em style="color:#FB6161">{{ selectPricing.length }}</em>
              <i class="el-icon-caret-top"></i>
            </span>
          </el-popover>
        </div>
        <div style="color:#FB6161">合计：0元</div>
        <div>
          <el-button type="primary" @click="appPricingOrder()">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Standard from './Standard'
import Plugin from './Plugin'
export default {
  components: { Standard, Plugin },
  data() {
    return {
      type: 'standard'
    }
  },

  computed: {
    selectPricing() {
      return this.$store.state.pricing.selectPricing
    }
  },
  methods: {
    deleteSelectPricing(index) {
      this.$store.commit('pricing/deleteSelectPricing', index)
    },
    appPricingOrder() {
      let model = {
        amount: 0,
        pricingBagList: []
      }
      this.selectPricing.map((item) => {
        model.pricingBagList.push({ id: item.id })
      })
      this.$http.appPricingOrder(model).then((res) => {
        console.log(res.data.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-buy {
  background: #fff;
  .menu-wrap {
    position: fixed;
    bottom: 0;
    right: 25px;
    left: 325px;
    background: #fff;
    padding: 15px;
    border-top: 1px solid #eee;
    .right {
      float: right;
      display: flex;
      align-items: center;
      & > * {
        margin-left: 20px;
        font-size: 15px;
      }
    }
  }
}
</style>
