<template>
  <div>
    <QcTable ref="table" :search-form="searchForm" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/xiaoe-tech/resource/page'
      },
      searchForm: [{ label: '课程名称', formName: 'title', type: 'input' }],
      column: [
        { label: '序号', type: 'index', width: '50px', align: 'center' },
        {
          label: '会员头像',
          prop: 'headImage',
          width: '120px',
          align: 'center',
          formatter: (row) => {
            return <img src={row.headImage} width="50" />
          }
        },
        { label: '会员手机', prop: 'mobile' },
        { label: '会员昵称', prop: 'appellation' },
        {
          label: '名称',
          prop: 'title',
          formatter: (row) => {
            return <QcProductItem img={row.icon} title={row.title}></QcProductItem>
          }
        },
        { label: '购买时间', prop: 'buyTime', align: 'center' },
        { label: '过期时间', prop: 'expireTime', align: 'center' },
        {
          label: '资源类型',
          align: 'center',
          formatter: (row) => {
            return { 'course-vip': '课程会员' }[row.type]
          }
        }
      ]
    }
  }
}
</script>
