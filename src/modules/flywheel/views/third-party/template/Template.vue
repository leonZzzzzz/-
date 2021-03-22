<template>
  <div>
    <QcTable
      ref="table"
      :option="{
        url: 'api/admin/v1/WechatMiniProgramThirdParty/getTemplateList',
        showPagination: false,
        response: { list: 'data.data' }
      }"
      :column="column"
      :el="{ 'default-sort': { prop: 'template_id', order: 'descending' } }"
    ></QcTable>
    <el-dialog
      width="650px"
      append-to-body
      :visible="visible"
      title="小程序模版详情"
      :before-close="
        () => {
          visible = false
        }
      "
    >
      <el-form label-position="left" label-width="120px">
        <el-form-item label="版本号">
          {{ model.user_version }}
        </el-form-item>
        <el-form-item label="简介第三方版本">
          {{ model.user_desc }}
        </el-form-item>
        <el-form-item label="TemplateId">
          {{ model.template_id }}
        </el-form-item>
        <el-form-item label="来源小程序">
          {{ model.source_miniprogram }}
        </el-form-item>
        <el-form-item label="小程序APPID">
          {{ model.source_miniprogram_appid }}
        </el-form-item>
        <el-form-item label="添加时间">
          {{ model.create_time }}
        </el-form-item>
        <el-form-item label="开发者">
          {{ model.developer }}
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="danger" plain @click="deleteTemplate(model.template_id)">从模板库中删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      model: {},
      column: [
        { label: '版本号', prop: 'user_version', width: '100px' },
        { label: '简介', prop: 'user_desc', width: '450px' },
        { label: 'templateID', prop: 'template_id', align: 'center' },
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
                    this.visible = true
                  }}
                >
                  详情
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    deleteTemplate(templateId) {
      this.$confirm('是否删除该模板？', '温馨提示', { type: 'warning', center: true }).then(() => {
        this.$http.deleteTemplate({ templateId }).then((res) => {
          this.$refs.table.onSearch()
          this.visible = false
        })
      })
    }
  }
}
</script>
