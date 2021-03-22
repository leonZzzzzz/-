<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/channel-qrcode/page' }"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <el-dialog
      title="编辑渠道信息"
      :visible.sync="visible"
      width="400px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="model" ref="model" label-width="100px" label-position="left">
        <el-form-item
          label="生成数量"
          prop="quantity"
          :rules="[
            { required: true, message: '该字段不能为空' },
            { pattern: /^([1-9]\d?|100)$/, message: '数量最少为1，最大为100' }
          ]"
        >
          <el-input v-model="model.quantity"></el-input>
        </el-form-item>
        <!-- <el-form-item label="小程序码跳转页面路径" prop="miniProgramPath">
          <el-input v-model="model.miniProgramPath"></el-input>
        </el-form-item>
        <el-form-item label="子渠道" prop="channelCodeId">
          <el-input v-model="model.channelCodeId"></el-input>
        </el-form-item>
        <el-form-item label="小程序码跳转目标" prop="targetId">
          <el-input v-model="model.targetId"></el-input>
        </el-form-item>
        <el-form-item label="小程序码跳转目标类型" prop="targetType">
          <el-input v-model="model.targetType"></el-input>
        </el-form-item>
        <el-form-item label="小程序码跳转目标名称" prop="targetName">
          <el-input v-model="model.targetName"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <DownChannelActivityQrcode
      :visible="downChannelActivityQrcodeVisible"
      :options="rowData"
      @close="onDownChannelActivityQrcodeClose"
    />
  </div>
</template>

<script>
import DownChannelActivityQrcode from './DownChannelActivityQrcode'
export default {
  components: {
    DownChannelActivityQrcode
  },
  data() {
    return {
      loading: false,
      downChannelActivityQrcodeVisible: false,
      visible: false,
      rowData: {},
      searchForm: [{ label: '目标名称', type: 'input', formName: 'targetName', value: '' }],
      menu: [
        {
          label: '批量生成空码',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '二维码',
          width: '100px',
          align: 'center',
          formatter: (row) => {
            return <el-image src={row.host + row.url} style="width:80px;height:80px"></el-image>
          }
        },
        {
          label: '渠道名',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                {row.channel} {row.subChannel ? '-' + row.subChannel : ''}
              </div>
            )
          }
        },
        {
          align: 'center',
          label: '类型',
          formatter: (row) => {
            return { mini_program: '小程序码', link: '链接' }[row.type]
          }
        },
        {
          align: 'center',
          label: '目标类型',
          formatter: (row) => {
            console.log('789789789', row)
            return {
              undefine: '未定义',
              activity: '活动',
              product: '商品',
              news: '图文',
              'mini-program-page': '小程序',
              'group-shopping': '团购'
            }[row.targetType]
          }
        },
        {
          prop: 'targetName',
          label: '目标名称'
        },
        { prop: 'scene', label: '场景值' },
        { align: 'center', prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                {row.targetName ? (
                  <el-button
                    type="text"
                    onClick={() => {
                      this.downChannelActivityQrcodeVisible = true
                      this.codeId = row.id
                      this.rowData = JSON.parse(JSON.stringify(row))
                    }}
                  >
                    修改绑定
                  </el-button>
                ) : (
                  <el-button
                    type="text"
                    onClick={() => {
                      this.downChannelActivityQrcodeVisible = true
                      this.codeId = row.id
                      this.rowData = JSON.parse(JSON.stringify(row))
                    }}
                  >
                    绑定
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      model: {
        quantity: '',
        miniProgramPath: 'pagesCommon/channelTransfer/index',
        channelCodeId: '',
        targetId: '',
        targetType: '',
        targetName: ''
      }
    }
  },
  methods: {
    onSave(type) {
      this.loading = true
      this.$http[type](this.model)
        .then((res) => {
          this.loading = false
          this.$message.success('保存成功')
          this.$refs.table.onSearchKeep()
          this.onClose()
        })
        .catch(() => {
          this.loading = false
        })
    },
    onClose() {
      this.visible = false
      this.clearForm('model')
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.onSave('addChannelCode')
        }
      })
    },
    onDownChannelActivityQrcodeClose(data) {
      if (data) {
        data.id = this.codeId
        this.$http.bindChannelCode(data).then(() => {
          this.$refs.table.onSearchKeep()
        })
      }
      this.downChannelActivityQrcodeVisible = false
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteChannel({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
