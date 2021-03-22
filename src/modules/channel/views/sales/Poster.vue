<template>
  <div class="wrap" v-loading="dataLoading">
    <div v-for="(item, i) in list" :key="i">
      <FormTypeTitle :text="item.title">
        <el-button type="primary" size="small" :loading="loading" @click="posterUpdateSubmit(item.api, item.data)"
          >保存</el-button
        >
      </FormTypeTitle>
      <el-form class="form" :model="item.data" :ref="item.api" size="small">
        <el-form-item prop="url" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcImageUpload v-model="item.data.url" width="200px" height="356px"></QcImageUpload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dataLoading: false,
      model: {},
      conditionList: [],
      conditionId: '',
      list: [
        {
          title: '销售邀请好友海报',
          api: 'distributerPopsterBackgroundIndexUpdate',
          data: {
            url: ''
          }
        },
        {
          title: '推广邀请好友海报',
          api: 'distributerPopsterBackgroundInvitationUpdate',
          data: {
            url: ''
          }
        },
        {
          title: '活动推广海报',
          api: 'distributerPopsterBackgroundPopularizationUpdate',
          data: {
            url: ''
          }
        }
      ]
    }
  },
  created() {
    this.dataLoading = true
    this.distributerPopsterBackgroundIndexGet()
    this.distributerPopsterBackgroundInvitationGet()
    this.distributerPopsterBackgroundPopularizationGet()
  },
  methods: {
    async distributerPopsterBackgroundIndexGet() {
      const res = await this.$http.distributerPopsterBackgroundIndexGet()
      this.list[0].data = Object.assign(this.list[0].data, res.data.data)
      this.dataLoading = false
    },
    async distributerPopsterBackgroundInvitationGet() {
      const res = await this.$http.distributerPopsterBackgroundInvitationGet()
      this.list[1].data = Object.assign(this.list[1].data, res.data.data)
      this.dataLoading = false
    },
    async distributerPopsterBackgroundPopularizationGet() {
      const res = await this.$http.distributerPopsterBackgroundPopularizationGet()
      this.list[2].data = Object.assign(this.list[2].data, res.data.data)
      this.dataLoading = false
    },
    posterUpdateSubmit(api, params) {
      this.$refs[api][0].validate((valid) => {
        if (valid) {
          this.$http[api](params).then((res) => {
            this.$message.success('保存成功')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  padding: 20px;
}
</style>
