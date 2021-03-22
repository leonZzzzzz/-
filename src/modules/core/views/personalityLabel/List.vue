<template>
  <div class="wrap" ref="wrap">
    <QcTable
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
      @file-success="fileSuccess"
    ></QcTable>
    <FormDialog :visible="digFormWrap" :type="type" :id="updateId" @close="onClose"></FormDialog>
    <el-dialog
      title="删除提示"
      :visible.sync="delVisible"
      width="400px"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="delClose"
    >
      <p style="height: 40px;">是否需要把当前标签的会员转移到其他标签？</p>
      <el-form :model="delModel" ref="model" label-width="80px" label-position="left">
        <el-form-item label="目标标签" prop="newName" :rules="[{ required: false, message: '请选择目标标签' }]">
          <el-select v-model="delModel.newName" placeholder="请选择目标标签" style="width: 220px;margin-bottom: 15px;">
            <el-option
              size="small"
              v-for="option in personalityList"
              :key="option.id"
              :label="option.name"
              :value="option.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button :loading="delLoading2" @click="delSuccess(false)">仅删除</el-button>
        <el-button type="primary" @click="delSuccess(true)" :loading="delLoading">转移并删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormDialog from './Form'
export default {
  props: {
    type: [Number]
  },
  components: { FormDialog },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      delVisible: false,
      delLoading: false,
      delLoading2: false,
      personalityList: [],
      delModel: {
        oldName: '',
        newName: '',
        id: ''
      },
      option: {
        url: 'api/admin/v1/personality-label-template/page',
        size: 'small',
        showSearchAndReset: false
      },
      searchForm: [],
      column: [
        { prop: 'sortNumber', label: '序号', width: 50, align: 'center' },
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.digFormWrap = true
                    this.updateId = row.id
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteConfirm.bind(this, row)}>
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
        }
        // {
        //   type: '导入',
        //   title: 'Excle导入会员标签',
        //   id: '123',
        //   api: 'api/admin/v1/contacts/importPersonalityLabel'
        // }
      ]
    }
  },
  created() {
    this.getPersonalityLabel()
  },
  methods: {
    deleteConfirm(row) {
      this.delVisible = true
      this.delModel.oldName = row.name
      this.delModel.id = row.id
      // return
      // this.$confirm('是否删除该数据?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.delVisible = true
      //     this.delModel.oldName = row.name
      //     this.delModel.id = row.id
      //   })
      //   .catch(() => {
      //     return
      //   })
    },
    async delete(id) {
      await this.$http.delPersonalityLabel({ id })
      this.$refs.table.onSearchKeep()
      this.$message.success('删除成功')
      this.delClose()
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.digFormWrap = false
      this.updateId = ''
    },
    fileSuccess() {
      this.$message.success('导入成功')
    },
    // 获取个性标签
    getPersonalityLabel() {
      this.$http.pagePersonalityLabel({ pageNum: 1, pageSize: 999 }).then((res) => {
        this.personalityList = res.data.data.list
      })
    },
    delClose() {
      this.delVisible = false
      this.delLoading = false
      this.delLoading2 = false
    },
    async delSuccess(state) {
      try {
        if (state) {
          if (!this.delModel.newName) {
            this.$message.warning('请选择目标标签')
            return
          }
          this.delLoading = true
          await this.$http.transferPersonalityLabel({
            isNeed: true,
            oldName: this.delModel.oldName,
            newName: this.delModel.newName
          })
          this.delete(this.delModel.id)
        } else {
          this.delLoading2 = true
          await this.$http.transferPersonalityLabel({
            isNeed: false,
            oldName: this.delModel.oldName,
            newName: ''
          })
          this.delete(this.delModel.id)
        }
      } catch (error) {
        this.delLoading = false
        this.delLoading2 = false
      }
    }
  }
}
</script>
