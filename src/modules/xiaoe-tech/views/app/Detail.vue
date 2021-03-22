<template>
  <QcNavigationPage content="应用详情" style="width:1000px;margin:0 auto">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>应用信息 </span>
      </div>
      <el-form label-position="left" label-width="110px">
        <el-form-item label="应用名称">{{ model.name }}</el-form-item>
        <el-form-item label="client_id"
          >{{ model.clientId }}
          <el-button @click="bb('client-id')" class="client-id" type="text" :data-clipboard-text="model.clientId">
            复制
          </el-button>
        </el-form-item>
        <el-form-item label="client_secret">{{ model.clientSecret }}</el-form-item>
      </el-form>
    </el-card>
    <br />
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>授权信息 </span>
      </div>
      <el-form label-position="left" label-width="110px">
        <el-form-item label="已授权店铺">
          {{ model.storeId }}
          <el-button @click="bb('store-id')" class="store-id" type="text" :data-clipboard-text="model.storeId">
            复制ID
          </el-button>
        </el-form-item>
        <!-- <el-form-item label="IP白名单"></el-form-item> -->
      </el-form>
    </el-card>
    <br />
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>订阅消息推送 </span>
      </div>
      <el-form label-position="left" label-width="110px" style="width: 600px">
        <el-form-item label="消息校验Token">
          {{ model.token }}
        </el-form-item>
        <el-form-item label="消息加密key">
          {{ model.key }}
        </el-form-item>
        <!-- <el-form-item label="消息接收URL">
          <el-input></el-input>
        </el-form-item> -->
      </el-form>
    </el-card>
  </QcNavigationPage>
</template>

<script>
import Clipboard from 'clipboard'
import api from '../../api/app'
export default {
  data() {
    return {
      model: {}
    }
  },
  created() {
    this.appGet()
  },
  methods: {
    appGet() {
      api.appGet({ id: this.$route.query.id }).then((res) => {
        this.model = res.data.data
      })
    },
    bb(className) {
      new Clipboard('.' + className)
    }
  }
}
</script>
