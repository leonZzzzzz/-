<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/dynamicQrcode/page'
      },
      searchForm: [
        {
          label: '活码类型',
          type: 'select',
          formName: 'name',
          value: '',
          option: [
            { label: '全部', value: '' },
            { label: '单人', value: 0 },
            { label: '多人', value: 1 }
          ]
        },
        {
          label: '渠道企业',
          type: 'select',
          formName: 'saleStatus',
          value: '',
          option: [{ label: '深圳市原诺科技有限公司', value: '' }]
        },
        {
          label: '渠道成员',
          type: 'select',
          formName: 'salePeople',
          value: '',
          option: [{ label: '全部', value: '' }]
        }
      ],
      menu: [
        {
          label: '新建活码',
          type: 'primary',
          on: () => {
            this.$router.push('/main/scrm/poster/livecode/form')
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', width: '50px', align: 'center' },
        {
          label: '渠道名称',
          prop: 'name',
          align: 'center'
        },

        {
          label: '渠道企业',
          prop: 'corporate',
          align: 'center'
        },
        {
          label: '操作'
          // formatter: row => {
          //   return (
          //     <div>
          //       <el-button
          //         type="text"
          //         onClick={() => {
          //           this.$router.push()
          //         }}
          //       >
          //         修改
          //       </el-button>
          //       <el-button type="text" onClick={() => {}}>
          //         删除
          //       </el-button>
          //     </div>
          //   )
          // }
        }
      ]
    }
  }
}
</script>
