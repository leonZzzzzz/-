<template>
  <el-form label-position="right" label-width="250px" style="margin:40px 100px">
    <el-form-item v-for="(item, index) in configItem" :key="item.id" :label="item.name">
      <el-input v-model="item.value" style="width:100px;margin-right:10px;" @focus="selectIndex = index"></el-input>
      <el-button @click="updateConfigItem(index)" type="primary" v-if="selectIndex === index">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { PRICE_ZERO } from '../../../../../utils/regex'
export default {
  data() {
    return {
      configItem: [],
      selectIndex: null
    }
  },
  created() {
    this.getConfigItem()
  },
  methods: {
    getConfigItem() {
      this.$http.getConfigItem({ parentId: 'SHOPPING_TRANSPORT' }).then((res) => {
        this.configItem = res.data.data
        this.configItem.map((item, index) => {
          if (item.value && index < 2) {
            item.value /= 100
          }
        })
      })
    },
    updateConfigItem(index) {
      let model = JSON.parse(JSON.stringify(this.configItem[index]))
      if (model.value === '' || !PRICE_ZERO.test(model.value)) {
        this.$message.error('配置不能为空')
        return
      }
      if (model.value && index < 2) {
        model.value = parseFloat(model.value) * 100
      }
      this.$http.updateConfigItem(model).then(() => {
        this.$message.success('修改成功')
        this.selectIndex = null
      })
    }
  }
}
</script>
