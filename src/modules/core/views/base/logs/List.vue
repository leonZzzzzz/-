<template>
  <div>
    <QcTable ref="table" :option="option" :column="column"></QcTable>
    <el-dialog title="日志详情" append-to-body :visible="visible" :before-close="() => (visible = false)" width="650px">
      <QcTextPlate>
        <QcTextPlateItem label="用户">{{ row.visitor }}</QcTextPlateItem>
        <QcTextPlateItem label="接口名称">{{ row.name }}</QcTextPlateItem>
        <QcTextPlateItem label="接口连接">{{ row.url }}</QcTextPlateItem>
        <QcTextPlateItem label="请求数据" v-if="row.requestBody">
          <pre style="background: #f5f5f5;padding: 10px;width:500px;max-height:500px;overflow:auto;">{{
            JSON.stringify(JSON.parse(row.requestBody), null, 4)
          }}</pre>
        </QcTextPlateItem>
      </QcTextPlate>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/apiLog/page'
      },
      column: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '用户', prop: 'visitor', align: 'center' },
        { label: '标题', prop: 'name', align: 'center' },
        { label: '接口', prop: 'url' },
        { label: '请求状态', prop: 'status', align: 'center' },
        { label: '耗时', prop: 'times', align: 'center' },
        // { label: '请求数据', prop: 'requestBody', width: '600px'},
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.row = row
                    this.visible = true
                  }}
                >
                  详情
                </el-button>
              </div>
            )
          }
        }
      ],
      visible: false,
      row: {}
    }
  },
  methods: {
    logs() {
      console.log('log')
    }
  }
}
</script>

<style></style>
