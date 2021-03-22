<template>
  <el-dialog
    title="插件管理"
    :visible="visible"
    width="600px"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    @close="onClose(false)"
  >
    <div v-if="isShowTable">
      <el-button
        v-if="isShowTable"
        size="small"
        type="primary"
        @click="onUpdatePlugins('apply')"
      >添加插件</el-button>
      <el-table
        v-if="isShowTable"
        :data="table"
        height="400px"
      >
        <el-table-column label="插件">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center;justify-content: flex-start;">
              <img
                :src="scope.row.headimgurl"
                alt="插件头像"
                style="width: 60px;height: 60px; margin-right: 15px;"
              />
              <span>{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="version"
          label="版本号"
          width="100"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onUpdatePlugins('update', scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              style="margin-left: 10px;color: #E6A23C;"
              @click="onUpdatePlugins('unbind', scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-form
        ref="model"
        :model="model"
        label-width="100px"
        label-position="left"
        style="padding: 20px;"
      >
        <el-form-item
          v-if="action != 'update'"
          label="插件ID"
          prop="plugin_appid"
          :rules="[{ message: '请填写插件ID', required: true }]"
        >
          <el-input
            v-model="model.plugin_appid"
            show-word-limit
            placeholder="请填写插件ID"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="版本号"
          prop="user_version"
          :rules="[{ required: false }]"
        >
          <el-input
            v-model="model.user_version"
            show-word-limit
            placeholder="可选填"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="text-align: right;"
      >
        <el-button @click="onUpdatePlugins('')">取消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="onConfirm"
        >确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import { BASEURL, PluginApi } from '@/utils/config'
const _http = axios.create({
  baseURL: BASEURL,
  timeout: 60000
})
_http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //配置请求头
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    weappId: String
  },
  data() {
    return {
      btnLoading: false,
      model: {
        action: '', //【必填】申请 apply、更新版本 update、删除 unbind、查询 list
        plugin_appid: '',
        user_version: ''
      },
      action: '',
      table: []
    }
  },
  filters: {
    statusFilter(val) {
      let status = new Map([
        [1, '申请中'],
        [2, '申请通过'],
        [3, '被拒绝'],
        [4, '申请已超时']
      ])
      return status.get(val) || val
    }
  },
  computed: {
    isShowTable() {
      return this.action == 'apply' || this.action == 'update' ? false : true
    }
  },
  created() {
    this.getPlugins()
  },
  methods: {
    onUpdatePlugins(action, data) {
      this.action = action
      this.model.action = action
      if (data) this.model.plugin_appid = data.appid
      if (action == 'unbind') {
        this.$confirm('确认删除该插件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.onConfirm()
        })
      }
    },
    async getPlugins(res) {
      this.btnLoading = true
      try {
        let param = new FormData()
        param.append('appId', this.weappId)
        param.append(
          'paramJson',
          JSON.stringify({
            action: 'list'
          })
        )
        let res = await _http.post(PluginApi, param, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        if (!res || res.data.errcode !== 0) {
          return this.$message.error(!res || !res.data.errmsg ? '查询失败' : res.data.errmsg)
        }
        this.table = res.data.plugin_list
      } finally {
        this.btnLoading = false
      }
    },
    async onConfirm() {
      this.btnLoading = true
      try {
        let _model = this.model
        // if (!_model.user_version) delete _model.user_version
        let param = new FormData()
        if (this.model.user_version) param.append('version', this.model.user_version) // 微信的接口不需要该字段，但我们需要
        param.append('appId', this.weappId)
        param.append('paramJson', JSON.stringify(_model))
        let res = await _http.post(PluginApi, param, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        if (!res || res.data.errcode !== 0) {
          let errcodes = new Map([
            [-1, '系统错误'],
            [89236, '该插件不能申请'],
            [89237, '已经添加该插件'],
            [89238, '申请或使用的插件已经达到上限'],
            [89239, '该插件不存在'],
            [89243, '该申请为“待确认”状态，不可删除'],
            [89244, '不存在该插件 appid'],
            [89256, 'token 信息有误'],
            [89257, '该插件版本不支持快速更新'],
            [89258, '当前小程序帐号存在灰度发布中的版本，不可操作快速更新']
          ])
          let errmsg =
            !res || (!errcodes.get(res.data.errcode) && !res.data.errmsg)
              ? '操作失败'
              : errcodes.get(res.data.errcode) || res.data.errmsg
          this.$message.error(errmsg)
          return
        }
        this.$message.success(
          `${
            {
              apply: '添加',
              update: '修改',
              unbind: '删除'
            }[_model.action]
          }成功`
        )
        this.action = ''
        this.getPlugins()
      } finally {
        this.btnLoading = false
      }
    },
    onClose(flag = false) {
      this.$emit('update:visible', flag)
    }
  }
}
</script>
