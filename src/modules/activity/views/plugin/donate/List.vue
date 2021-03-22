<template>
  <div>
    <QcTable ref="table" :menu="menu" :search-form="searchForm" :option="option" :column="column"></QcTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateId: '',
      menu: [],
      searchForm: [
        {
          formName: 'title',
          value: ''
        }
      ],
      option: {
        url: 'api/admin/v1.1/donate-activity/page'
      },
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          prop: 'cover',
          label: '封面',
          align: 'center',
          width: 90,
          formatter: (row) => {
            return <img src={this.imgHost + row.cover} alt="" width="80" height="80" />
          }
        },
        { prop: 'title', label: '标题', align: 'center' },
        { prop: 'donateTimes', label: '参与人数', align: 'center' },
        {
          label: '操作',
          align: 'center',
          width: 120,
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push('/main/activity/plugin/donate/itemList?id=' + row.id)
                  }}
                >
                  查看捐款项目
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {}
}
</script>
