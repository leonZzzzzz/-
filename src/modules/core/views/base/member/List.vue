<template>
  <QcTable ref="table" :option="option" :column="column"></QcTable>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/member/page'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          label: '头像',
          formatter: (row) => {
            return <el-image src={row.headImage} style="width:50px;height:50px"></el-image>
          },
          align: 'center'
        },
        { prop: 'appellation', label: '微信名称', align: 'center' },
        { prop: 'name', label: '会员名称', align: 'center' },
        { prop: 'mobile', label: '手机号码', align: 'center' },
        {
          label: '性别',
          formatter: (row) => {
            return { 1: '男', 2: '女' }[row.sex]
          },
          align: 'center'
        },
        { prop: 'createTime', label: '创建时间', align: 'center' }
      ]
    }
  }
}
</script>

<style></style>
