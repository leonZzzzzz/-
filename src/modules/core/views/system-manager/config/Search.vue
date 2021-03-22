<template>
  <div>
    <QcTable
      ref="table"
      :option="{ url: 'api/admin/v1/miniProgramSearch/get', response: { list: 'data.data' } }"
      :menu="menu"
      :column="column"
    ></QcTable>
    <el-dialog :visible="visible" width="400px" title="搜索设置" append-to-body :show-close="false">
      <el-form ref="model" :model="model" label-position="left" label-width="60px">
        <el-form-item label="名称" prop="name" :rules="[{ required: 'true', message: '请填写该字段' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="参数"
          prop="param"
          :rules="[{ required: 'true', message: '请填写该字段' }]"
        >
          <el-input v-model="model.param"></el-input>
        </el-form-item> -->
        <el-form-item label="标志" prop="sign" :rules="[{ required: 'true', message: '请填写该字段' }]">
          <el-select v-model="model.sign">
            <el-option
              v-for="(item, index) in signList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: 'true', message: '请填写该字段' }]">
          <el-input-number v-model="model.seqNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose">关闭</el-button>
        <el-button @click="updatePlatformMiniProgramSearch()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'sign', label: '关联模块', align: 'center' },
        { prop: 'seqNum', label: '排序', align: 'center' },
        {
          prop: 'seqNum',
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getRow.bind(this, row)}>
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
      visible: false,
      model: {
        name: '',
        param: '',
        sign: '',
        seqNum: '',
        activityCourse: ''
      },
      signList: [
        { value: 'activity', label: '活动搜索' },
        { value: 'contacts', label: '校友库搜索' },
        { value: 'information', label: '资讯搜索' },
        { value: 'singleConten', label: '图文搜索' },
        { value: 'course', label: '课程搜索' }
      ]
    }
  },
  methods: {
    getRow(row) {
      this.model = row
      this.visible = true
    },
    deleteConfirm(id) {
      this.$http.deletePlatformMiniProgramSearch({ id }).then(() => {
        this.$message.success('删除成功')
        this.$refs.table.onSearchKeep()
      })
    },
    updatePlatformMiniProgramSearch() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.activityCourse = this.model.sign
          this.$http.updatePlatformMiniProgramSearch(this.model).then((res) => {
            this.$message.success('保存成功')
            this.$refs.table.onSearchKeep()
            this.onClose()
          })
        }
      })
    },
    onClose() {
      this.visible = false
      this.clearForm('model')
    }
  }
}
</script>
