<template>
  <QcNavigationPage content="编辑通知" full>
    <el-form :model="model" ref="model" label-position="left" label-width="120px">
      <el-form-item label="通知标题" prop="title" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input
          v-model="model.title"
          style="width:400px;"
          maxlength="32"
          placeholder="建议14字内（不超过32字）"
        ></el-input>
      </el-form-item>
      <el-form-item label="通知类型" prop="noticeTypeStr" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input
          v-model="model.noticeTypeStr"
          style="width:400px;"
          maxlength="8"
          placeholder="（不超过8字）"
        ></el-input>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-date-picker
          v-model="model.sendTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择时间"
          style="width:400px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="发送对象"
        prop="receiverType"
        class="inline right"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-select v-model="model.receiverType" style="width:400px;">
          <el-option label="活动签到" :value="5"></el-option>
          <el-option label="活动报名" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="已选择活动" prop="receiverIds" :rules="[{ required: true, message: '该字段不能为空' }]">
        <div class="selecte-act ellipsis" v-for="item in model.receiverObjects" :key="item.id">{{ item.title }}</div>
        <el-button type="primary" @click="productPickerVisible = true">选择活动</el-button>
      </el-form-item>
      <el-form-item label="通知内容" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
        <Editor v-model="model.content"></Editor>
      </el-form-item>
      <el-form-item
        label="微信公众号模板消息通知"
        prop="isEnableWxTemplateRemind"
        label-width="200px"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-switch
          v-model="model.isEnableWxTemplateRemind"
          :disabled="true"
          active-text="开启"
          inactive-color="#ccc"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onSubmit(0)" type="primary" :disabled="model.status === 2">保存草稿</el-button>
      <el-button @click="onSubmit(1)" type="primary" :disabled="model.status === 2">发布</el-button>
    </div>
    <QcProductPicker
      :visible="productPickerVisible"
      :type="['product']"
      :module="['Activity']"
      @close="onQcProductPickerClose"
    ></QcProductPicker>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      productPickerVisible: false,
      model: {
        title: '',
        info: '',
        content: '',
        iconUrl: '',
        // 发送时间
        sendTime: '',
        // 是否开启微信公众号模板消息通知
        isEnableWxTemplateRemind: true,
        // 是否开启短信通知
        isEnableSmsRemind: false,
        // 发送对象
        receiverType: '',
        // 对象列表
        receiverIds: [],
        // 草稿 / 立即发送
        status: 1,
        receiverObjects: []
      }
    }
  },
  created() {
    this.$route.query.id && this.getNotice(this.$route.query.id)
  },
  methods: {
    onQcProductPickerClose(row) {
      this.productPickerVisible = false
      if (row && row.id) {
        this.model.receiverObjects = [row]
        this.model.receiverIds = [row.id]
      }
    },
    addNotice(model) {
      this.$http.addNotice(model).then((res) => {
        this.$message.success('保存成功')
        this.$router.back()
      })
    },
    updateNotice(model) {
      this.$http.updateNotice(model).then((res) => {
        this.$message.success('保存成功')
        this.$router.back()
      })
    },
    getNotice(id) {
      this.$http.getNotice({ id }).then((res) => {
        this.model = res.data.data
      })
    },
    onSubmit(status) {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.status = status
          this.model.id ? this.updateNotice(this.model) : this.addNotice(this.model)
        }
      })
    }
  }
}
</script>

<style></style>
