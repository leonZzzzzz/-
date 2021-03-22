<template>
  <div>
    <div style="background: #e5f0ff;padding: 20px 20px 10px;border: 1px solid #b4d6ff;color: #6b6b6b;">
      <p style="margin-bottom: 10px;font-size:14px">
        <span style="display: inline-block;width: 100px;">消息接收URL：</span>
        <span style="display: inline-block;vertical-align: text-top;white-space: normal;">{{ detail.eventUrl }}</span>
      </p>
      <p style="margin-bottom: 10px;font-size:14px">
        <span style="display: inline-block;width: 100px;">服务器IP：</span>{{ detail.ip }}
      </p>
      <p style="margin-bottom: 10px;font-size:14px;cursor: pointer;color: #105cfb;" @click.stop="open(detail.guide)">
        小鹅通应用接入指南
      </p>
    </div>
    <div class="app-list">
      <div class="app-item" v-if="!model.id" @click="visible = true">
        <div
          class="el-icon-plus"
          style="font-size: 55px;display: block;margin: 12px auto;width: 53px;color: #cacaca;"
        ></div>
      </div>
      <div class="app-item" @click="jumpPage()" v-else>
        <div class="app-item-info">
          <span class="app-name">{{ model.name }}</span
          ><span class="app-creator">创建者</span>
        </div>
        <div class="create-time-info">
          <i class="time-icon iconfont font_family icon-icon_learningRecord"></i
          ><span class="app-create-time">创建时间：</span><span class="app-create-time">2020-02-13 16:19:05</span>
        </div>
        <el-button type="text" @click.stop="visible = true" style="position: absolute;bottom: 16px;right: 30px;"
          >修改</el-button
        >
      </div>
    </div>
    <Form :id="model.id" :visible="visible" :guide="detail.guide" @close="onClose" />
  </div>
</template>

<script>
import api from '../../api/app'
import Form from './Form'
export default {
  components: {
    Form
  },
  data() {
    return {
      visible: false,
      model: {},
      detail: {}
    }
  },
  created() {
    this.appList()
    this.$http.get('api/admin/v1/xiaoe-tech/app/get-setting').then((res) => {
      this.detail = res.data.data
    })
  },
  methods: {
    appList() {
      api.appList().then((res) => {
        this.model = res.data.data[0] || {}
      })
    },
    open(url) {
      window.open(url)
    },
    jumpPage() {
      this.$router.push('/main/xiaoe-tech/app/detail?id=' + this.model.id)
    },
    onClose(flag) {
      this.visible = false
      if (flag) {
        this.appList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;
  width: 800px;
  .app-item {
    position: relative;
    width: 450px;
    flex: none;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 24px;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    &-info {
      margin-bottom: 55px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      justify-content: space-between;
      .app-creator {
        width: 46px;
        height: 20px;
        line-height: 20px;
        background: #105cfb;
        border-radius: 2px;
        font-size: 12px;
        color: #fff;
        font-weight: 400;
        text-align: center;
        margin-left: 15px;
      }
    }
    .create-time-info {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      .app-create-time {
        font-size: 12px;
        font-weight: 400;
        color: #888;
        line-height: 12px;
      }
    }
  }
}
</style>
