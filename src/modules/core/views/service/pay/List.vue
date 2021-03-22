<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column"></QcTable>
    <el-dialog title="支付信息" append-to-body :visible.sync="formVisible" width="400px">
      <el-form ref="model" :model="model" label-width="auto">
        <el-form-item label="支付方式" prop="code" :rules="[{ required: true, message: '商户类型不能为空' }]">
          <el-radio-group v-model="model.code">
            <el-radio label="join">汇聚</el-radio>
            <el-radio label="wechat">微信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商户类型" prop="mchType" :rules="[{ required: true, message: '商户类型不能为空' }]">
          <el-radio-group v-model="model.mchType">
            <el-radio :label="2">公众号</el-radio>
            <el-radio :label="3">小程序</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商户名称" prop="company" :rules="[{ required: true, message: '商户名称不能为空' }]">
          <el-input v-model="model.company"></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="mchId" :rules="[{ required: true, message: '商户号不能为空' }]">
          <el-input v-model="model.mchId"></el-input>
        </el-form-item>
        <el-form-item
          v-if="model.code === 'join'"
          label="商户号报备"
          prop="mchNumber"
          :rules="[{ required: true, message: '商户号不能为空' }]"
        >
          <el-input v-model="model.mchNumber"></el-input>
        </el-form-item>
        <el-form-item label="商户密钥" prop="mchKey" :rules="[{ required: true, message: '商户密钥不能为空' }]">
          <el-input v-model="model.mchKey"></el-input>
        </el-form-item>
        <el-form-item label="商户ID" prop="mchAppId" :rules="[{ required: true, message: '商户Id不能为空' }]">
          <el-input v-model="model.mchAppId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="onClose()">关 闭</el-button>
        <el-button size="small" type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传证书" append-to-body :visible.sync="uploadVisible" width="400px">
      <el-upload
        class="upload-demo"
        :action="`${BASEURL}/api/admin/v1/certificate`"
        :data="{ wxpayConfigId: this.id }"
        accept="image/jpeg, image/jpg, image/png"
        multiple
        :limit="1"
        :on-success="onSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <span slot="tip" style="vertical-align: bottom;margin-left: 15px;">只能上传.p12文件</span>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { BASEURL } from '@/utils/config'
export default {
  data() {
    return {
      BASEURL,
      id: '',
      formVisible: false,
      uploadVisible: false,
      option: {
        url: 'api/admin/v1/wxpayConfig/page'
      },
      menu: [
        {
          label: '添加支付目录',
          type: 'primary',
          on: () => {
            this.formVisible = true
          }
        },
        {
          label: '支付协议',
          on: () => {
            this.$router.push('/main/service/setting/pay/agreement')
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '账号名称', prop: 'company', align: 'center' },
        {
          label: '商户类型',
          align: 'center',
          prop: 'mchTypeName'
        },
        {
          label: '商户信息',
          width: '350px',
          formatter: (row) => {
            return (
              <div>
                <p>商户号：{row.mchId}</p>
                <p>商户密钥：{row.mchKey}</p>
                <p>商户ID：{row.mchAppId}</p>
              </div>
            )
          }
        },
        {
          label: '证书名字',
          align: 'center',
          formatter: (row) => {
            return row.certPath || '未上传'
          }
        },
        {
          label: '操作',
          width: '200px',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getPayment.bind(this, row.id)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deletePayment.bind(this, row.id)}>
                  删除
                </el-button>
                <el-button type="text" onClick={this.showUpload.bind(this, row.id)}>
                  上传证书
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        code: 'wechat',
        company: '',
        mchId: '',
        mchKey: '',
        mchType: 2,
        mchAppId: '',
        mchNumber: ''
      }
    }
  },
  methods: {
    getPayment(id) {
      this.$http.getPayment({ id }).then((res) => {
        this.model = res.data.data
        this.formVisible = true
      })
    },
    updatePayment(model) {
      this.$http.updatePayment(model).then((res) => {
        this.$message.success('保存成功')
        this.onClose()
        this.$refs.table.onSearchKeep()
      })
    },
    addPayment(model) {
      this.$http.addPayment(model).then((res) => {
        this.$message.success('保存成功')
        this.onClose()
        this.$refs.table.onSearchKeep()
      })
    },
    deletePayment(id) {
      this.$confirm('请确认该支付没有使用后再删除，否则会出现丢单，请谨慎操作。', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deletePayment({ id }).then(() => {
            this.$message.success('删除成功')
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    showUpload(id) {
      this.id = id
      this.uploadVisible = true
    },
    onClose() {
      this.clearForm('model')
      this.formVisible = false
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          if (this.model.code != 'join') {
            delete this.model.mchNumber
          }
          this.model.id ? this.updatePayment(this.model) : this.addPayment(this.model)
        }
      })
    },
    onSuccess(res) {
      console.log('onSuccess', res)
      if (res.code === 20000) {
        this.$message.success('上传成功')
        this.id = ''
        this.uploadVisible = false
        this.getPayments()
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
