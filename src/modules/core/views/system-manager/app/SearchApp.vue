<template>
  <div>
    <QcTable
      ref="table"
      :option="{
        url: `api/admin/v1/miniProgramSearchApp/get?appId=${$route.query.appId}`,
        response: { list: 'data.data' }
      }"
      :menu="menu"
      :column="column"
    ></QcTable>
    <el-dialog :visible="visible" width="400px" title="搜索设置" append-to-body :show-close="false">
      <el-form ref="model" :model="model" label-position="left" label-width="100px">
        <el-form-item label="名称" prop="showName" :rules="[{ required: 'true', message: '请填写该字段' }]">
          <el-input v-model="model.showName"></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="显示标志"
          prop="showSign"
          :rules="[{ required: 'true', message: '请填写该字段' }]"
        >
          <el-select v-model="model.showSign" @change="pageCategory">
            <el-option
              v-for="(item, index) in showSignList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="搜索模块"
          prop="miniProgramSearchId"
          :rules="[{ required: 'true', message: '请填写该字段' }]"
        >
          <el-select v-model="model.miniProgramSearchId" @change="pageCategory">
            <el-option v-for="(item, index) in signList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联分类" prop="param">
          <el-select v-model="model.param">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: 'true', message: '请填写该字段' }]">
          <el-input-number v-model="model.seqNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose">关闭</el-button>
        <el-button @click="updateAppMiniProgramSearch()" type="primary">保存</el-button>
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
        { prop: 'showName', label: '名称', align: 'center' },
        { prop: 'name', label: '关联模块', align: 'center' },
        { prop: 'seqNum', label: '排序', align: 'center' },
        {
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
        showSign: '',
        showName: '',
        param: '',
        miniProgramSearchId: '',
        seqNum: ''
      },
      signList: [],
      showSignList: [
        { value: 'activity', label: '活动搜索' },
        { value: 'contacts', label: '校友库搜索' },
        { value: 'information', label: '资讯搜索' },
        { value: 'singleContent', label: '图文搜索' },
        { value: 'course', label: '课程搜索' }
      ],
      categoryList: []
    }
  },
  created() {
    this.getPlatformMiniProgramSearch()
  },
  methods: {
    getRow(row) {
      this.model = row
      this.visible = true
      this.pageCategory(row.miniProgramSearchId, false)
    },
    getPlatformMiniProgramSearch() {
      this.$http.getPlatformMiniProgramSearch().then((res) => {
        this.signList = res.data.data
      })
    },
    pageCategory(miniProgramSearchId, reset = true) {
      let type = null
      if (reset) this.model.param = ''
      this.signList.forEach((item) => {
        if (item.id == miniProgramSearchId) {
          type = { activity: 2, information: 13, singleConten: 8 }[item.sign]
        }
      })
      this.$http.pageCategory({ type, appId: this.$route.query.appId }).then((res) => {
        this.categoryList = res.data.data.list
      })
    },
    deleteConfirm(id) {
      this.$http.deleteAppMiniProgramSearch({ id }).then(() => {
        this.$message.success('删除成功')
        this.$refs.table.onSearchKeep()
      })
    },
    updateAppMiniProgramSearch() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.appId = this.$route.query.appId
          this.$http.updateAppMiniProgramSearch(this.model).then(() => {
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
