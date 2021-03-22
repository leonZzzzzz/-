<template>
  <QcTableNew ref="table" :option="option" :menu="opentype=='single'?menu1:menu" :column="column"></QcTableNew>
</template>

<script>
export default {
  props:{
    opentype:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option: {
        url: 'api/admin/v1/singleContent/page'
      },
      menu: [
        {
          label: '新建',
          type: 'primary',
          on: () => {
            this.$router.push('/main/base/news/detail')
          }
        },
        {
          label: '留言列表',
          type: 'primary',
          disabled: ({ currentRow }) => currentRow.id == undefined,
          on: this.jumpComment
        }
      ],
      menu1:[],
      column: [
        { type: 'index', label: '序号', align: 'center' },
        {
          label: '封面',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:50px;height:50px"></el-image>
          }
        },
        { prop: 'title', label: '标题', align: 'center' },
        { prop: 'categoryName', label: '分类', align: 'center' },
        { label: '简介', align: 'center',
        formatter:(row)=>{
          return <div style="display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{row.info}</div>
        }},
        
        {
          label: '是否显示',
          align: 'center',
          formatter: (row) => {
            return row.isDisplay ? '是' : '否'
          }
        },
        {
          prop: 'createTime',
          label: '创建时间',
          align: 'center',
          formatter: (row) => {
            return row.createTime ? row.createTime.slice(0, row.createTime.length - 3) : ''
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              this.opentype=='single'?
              <el-button type="text">选择</el-button>:
              <div>
                <WxQRCode options={{ name: 'singleShare', scene: row.id }} text size="medium" label="分享"></WxQRCode>
                <div style="width:10px;display:inline-block;"></div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$http.updateNewsStatus({ id: row.id, isDisplay: !row.isDisplay }).then(() => {
                      this.$message.success('更新成功')
                      this.$refs.table.onSearchKeep()
                    })
                  }}
                >
                  <el-button type="text">{row.isDisplay ? '隐藏' : '显示'}</el-button>
                </el-button>

                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/base/news/detail?id=${row.id}`)
                  }}
                >
                  修改
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
    jumpComment(row) {
      this.$router.push(`/main/info/leaveMsg?id=${row.id}`)
    },
    //删除提示框
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteNews({ id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          return
        })
    }
  }
}
</script>
