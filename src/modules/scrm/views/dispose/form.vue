<template>
  <!-- 勿删 -->
  <div>
    <QcTable ref="table" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/cropApp/page'
      },
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '企业名称',
          prop: 'name'
        },

        {
          label: '企业ID',
          align: 'center'
        },
        { label: '应用密钥', prop: 'sortNumber', align: 'center' },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push()
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={() => {}}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  }
}
</script>
