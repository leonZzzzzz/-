<template>
  <el-form label-position="left" label-width="70px">
    <el-form-item label="小程序：">
      <el-row>
        <el-col :span="6" style="margin-right:10px">
          <el-select style="width:100%;" v-model="wxAppId" placeholder="请关联小程序">
            <el-option v-for="list in weappList" :key="list.id" :label="list.name" :value="list.wxAppId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-input v-model="path" placeholder="请输入跳转路径"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" @click="onSuccess()">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    beformValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 当选中是小程序的时候使用，相当于row里面的pathPage
      weappList: [],
      wxAppId: '',
      path: ''
    }
  },
  created() {
    const beformValue = JSON.parse(JSON.stringify(this.beformValue))
    if (beformValue.pickerType == 'weapp') {
      const [appid, path] = beformValue.url.split(',')
      this.wxAppId = appid
      this.path = path
    }
    this.miniAppPage()
  },
  methods: {
    miniAppPage() {
      this.$http.miniAppPage({ pageSize: 10 }).then((res) => {
        this.weappList = res.data.data.list
      })
    },
    onSuccess() {
      this.weappList.map((item) => {
        if (item.wxAppId == this.wxAppId) {
          this.$emit('on-success', { pickerType: 'weapp', name: item.name, pagePath: item.wxAppId + ',' + this.path })
        }
      })
    }
  }
}
</script>

<style></style>
