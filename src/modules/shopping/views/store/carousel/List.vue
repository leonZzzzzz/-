<template>
  <div>
    <QcTable ref="table" :option="option" :menu="menu" :column="column" :search-form="searchForm"></QcTable>
    <Form :visible="visible" :id="updateId" :store-id="storeId" @onClose="onClose"></Form>
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
      storeId: '',
      option: {
        url: 'api/admin/v1/carousel/page?type=store'
      },
      searchForm: [],
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
          prop: 'imgLinks',
          label: '图片',
          align: 'center',
          formatter: (row) => {
            return (
              <el-image src={this.imgHost + row.imgLinks} style="width:50px;height:50px">
                <div slot="error" class="el-image__error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            )
          }
        },
        {
          label: '跳转类型',
          prop: 'skipType',
          formatter: (row) => {
            return { product: '商品', noskip: '不跳转' }[row.skipType]
          }
        },
        { label: '关联内容', prop: 'productName' },
        { label: '开始时间', prop: 'startTime', width: '100px' },
        { label: '结束时间', prop: 'endTime', width: '100px' },
        { label: '排序号', prop: 'sortNum', align: 'center' },
        {
          label: '状态',
          prop: 'status',
          formatter: (row) => {
            return { ended: '已结束', ongoing: '进行中', notstart: '未开始' }[row.status]
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
  created() {
    let user = JSON.parse(localStorage.getItem('user'))
    // 店铺轮播图需要传storeId
    if (user && user.storeId) {
      this.option.url += '&storeId=' + user.storeId
      this.storeId = user.storeId
    } else {
      // 防止看到其他店铺的数据，因为不传storeId默认会查出所有店铺的
      this.option.url += '&storeId=' + 123456
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
