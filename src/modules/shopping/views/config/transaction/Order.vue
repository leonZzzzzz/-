<template>
  <el-form label-position="right" label-width="320px" style="margin:40px 100px">
    <el-form-item v-for="(item, index) in configItem" :key="item.id" :label="item.name">
      <el-input v-model="item.value" style="width:100px;margin-right:10px;" @focus="selectIndex = index"></el-input>
      <el-button @click="updateConfigItem(index)" type="primary" v-if="selectIndex === index">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
      this.$http.getConfigItem({ parentId: 'SHOPPING_ORDER' }).then((res) => {
        this.configItem = res.data.data
      })
    },
    updateConfigItem(index) {
      let model = JSON.parse(JSON.stringify(this.configItem[index]))
      this.$http.updateConfigItem(model).then(() => {
        this.$message.success('修改成功')
        this.selectIndex = null
      })
    }
  }
}
</script>
