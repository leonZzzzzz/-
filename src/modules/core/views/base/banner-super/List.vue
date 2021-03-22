<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <Form :visible="visible" :id="updateId" @onClose="onClose"></Form>
  </div>
</template>

<script>
import Form from './Form'

export default {
  components: { Form },
  data() {
    return {
      visible: false,
      updateId: '',
      searchForm: [
        {
          label: '名称',
          formName: 'name',
          type: 'input',
          value: ''
        },
        {
          formName: 'parentId',
          value: ''
        },
        {
          formName: 'categoryCode',
          value: 'index_rolling_picture'
        }
      ],
      option: {
        url: 'api/admin/v1/carousel/page'
      },
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        }
      ],
      column: [
        { type: 'index', label: '序号', align: 'center', width: '50px' },
        {
          prop: 'url',
          label: '图片',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.imgUrl} style="width:50px;height:50px"></el-image>
          }
        },
        { prop: 'name', label: '名称', align: 'center' },
        {
          label: '类型',
          align: 'center',
          formatter: (row) => {
            return {
              noHref: '不跳转',
              product: '商品',
              activity: '活动',
              journey: '旅居',
              groupshop: '拼团'
              // linkurl: '外链'
            }[row.type]
          }
        },
        { prop: 'remark', label: '备注', align: 'center' },
        { prop: 'seq', label: '排序', align: 'center' },
        { prop: 'startTime', label: '开始时间', align: 'center', width: '100px' },
        { prop: 'endTime', label: '结束时间', align: 'center', width: '100px' },
        { prop: 'createTime', label: '创建时间', align: 'center', width: '100px' },
        {
          label: '类型',
          align: 'center',
          formatter: (row) => {
            return {
              0: '未开始',
              1: '进行中',
              2: '已结束'
            }[row.status]
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.visible = true
                    this.updateId = row.id
                  }}
                >
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCarousel({ id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
    },
    onClose(flag) {
      this.updateId = ''
      this.visible = false
      if (typeof flag == 'boolean' && flag) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
