<template>
  <QcTable
    :option="{
      url: 'api/admin/v1/WechatMiniProgramThirdParty/getTemplateDraftList',
      showPagination: false,
      response: { list: 'data.data' }
    }"
    :column="column"
  ></QcTable>
</template>
<script>
export default {
  data() {
    return {
      column: [
        { label: '版本号', prop: 'user_version', width: '100px' },
        { label: '简介', prop: 'user_desc', width: '450px' },
        { label: '来源小程序', prop: 'source_miniprogram', align: 'center' },
        { label: '最近上传开发者', prop: 'developer', align: 'center' },
        {
          label: '最近提交时间',
          align: 'center',
          width: '100px',
          formatter: (row) => {
            return new Date(row.create_time * 1000).toLocaleDateString()
          }
        },
        {
          label: '操作',
          align: 'right',
          width: '200px',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.addToTemplate.bind(this, row.draft_id)}>
                  添加到模版库
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    addToTemplate(draftId) {
      this.$confirm('确定把草稿箱代码添加到代码库？', '温馨提示', { type: 'warning', center: true }).then(() => {
        this.$http.addToTemplate({ draftId }).then(() => {
          this.$message.success('草稿已添加到模板库！')
        })
      })
    }
  }
}
</script>
