<template>
  <div class="wrap" ref="wrap">
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
    ></QcTable>
    <FormDialog
      :visible="digFormWrap"
      :type="type"
      :id="updateId"
      @close="onClose"
    ></FormDialog>
    <DelDialog  
      :visible="delVisible"
      :propsid="updateId"
      @close="delClose"
      type="等级"
    />
  </div>
</template>

<script>
import FormDialog from './form';
import DelDialog from './DelDialog';
export default {
  props: {
    type: [Number]
  },
  components: { FormDialog, DelDialog },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      delVisible: false,
      option: {
        url: 'api/admin/v1/memberLevel/page',
        size: 'small',
        showSearchAndReset: false
      },
      searchForm: [
        {
          // label: '类型',
          // type: 'select',
          formName: 'type',
          // option: [
          //   { value: '', label: '全部' },
          //   { label: '等级', value: 'level' },
          //   { label: '头衔', value: 'actor' },
          // ],
          value: 'level'
        },
      ],
      column: [
        {
          label: '图标',
          width: 100,
          formatter: row => {
            return (
              <el-image
                src={this.imgHost + row.iconUrl}
                mode="widthFix"
                style="width:60px;height:60px;"></el-image>
            )
          }
        },
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'type', label: '类型', width: 50, align: 'center',
          formatter: row => {
            return row.type === 'level' ? '等级' : row.type === 'actor' ? '头衔' : row.type
          }
        },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: row => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.digFormWrap = true
                    this.updateId = row.id
                  }}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.digFormWrap = true
          }
        },
        // {
        //   label: '下载模板',
        //   type: 'primary',
        //   on: this.onDownload
        // },
        // {
        //   type: '导入',
        //   title: 'Excle导入',
        //   id: '123',
        //   api: 'api/admin/v1/memberLevelJoin/importExcelData'
        // },
        
      ]
    }
  },
  methods: {
    // 导出
    onDownload() {
      // location.href = `${this.baseUrl}/api/admin/v1/memberLevelJoin/exportExcelTemplate`
      // location.href = `${this.localhost}/api/admin/v1/memberLevelJoin/exportExcelTemplate`
      let url = `${this.baseUrl}/api/admin/v1/memberLevelJoin/exportExcelTemplate`
      window.open(url)
    },
    deleteConfirm(id) {
      this.delVisible = true
      this.updateId = id
      return
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(id)
        })
        .catch(() => {
          return
        })
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.digFormWrap = false
      this.updateId = ''
    },
    delClose(state) {
      this.delVisible = false
      this.updateId = ''
      if (state) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
