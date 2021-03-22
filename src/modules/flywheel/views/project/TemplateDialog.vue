<template>
  <el-dialog
    title="选择要上传的模板"
    :visible="visible"
    :before-close="onClose"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <div style="text-align: center;margin: 0 auto 20px;">
      <p style="padding: 20px 0;">请注意区分【用户端】【店铺端】【名片端】</p>
      <QcTable
        v-if="visible"
        ref="tempTable"
        :option="options"
        :column="column"
        :el="{
          border: true,
          'default-sort': { prop: 'template_id', order: 'descending' }
        }"
      ></QcTable>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    path: String
  },
  data() {
    return {
      options: {
        url: 'api/admin/v1/WechatMiniProgramThirdParty/getTemplateList',
        isFull: false,
        height: 400,
        showPagination: false,
        response: { list: 'data.data' }
      },
      column: [
        { label: 'templateID', prop: 'template_id', align: 'center' },
        { label: '版本号', prop: 'user_version', width: '100px' },
        { label: '简介', prop: 'user_desc', width: '300px' },
        {
          label: '添加到模板库时间',
          align: 'center',
          width: '140px',
          formatter: (row) => {
            return new Date(row.create_time * 1000).toLocaleDateString()
          }
        },
        {
          label: '操作',
          align: 'center',
          width: '100px',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.model = row
                    this.onClose({ templateId: row.template_id })
                  }}
                >
                  使用
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    onDownLoad(url) {
      window.open(url)
    },
    onClose(data) {
      this.$emit('close', data)
    }
  }
}
</script>
