<template>
  <div>
    <el-form inline label-width="100" size="small" style="padding:15px">
      <el-form-item label="姓名">
        <el-input v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="search.mobileNumber"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="search.identityCard"></el-input>
      </el-form-item>
      <el-form-item label="证书编号">
        <el-input v-model="search.certificateNumber"></el-input>
      </el-form-item>
      <el-form-item label="是否领取">
        <el-select v-model="search.isDownload">
          <el-option label="全部" value></el-option>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="info">查询</el-button>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" @click="certificateData.visible = true">添加证书</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          :action="action"
          :data="{ certificateId: search.certificateId }"
          :before-upload="onBeforeUpload"
          :on-success="onSuccess"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">导入证书</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDownload()">下载模板示例</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableList">
      <el-table-column label="序号" width="50px" type="index" align="center"></el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="手机号码" prop="mobileNumber" align="center"></el-table-column>
      <el-table-column label="身份证号" prop="identityCard" align="center"></el-table-column>
      <el-table-column label="证书名称" prop="certificateName" align="center"></el-table-column>
      <el-table-column label="证书编号" prop="certificateNumber" align="center"></el-table-column>
      <el-table-column label="开始日期" width="100px" align="center">
        <template slot-scope="scope">{{ scope.row.startTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="结束日期" width="100px" align="center">
        <template slot-scope="scope">{{ scope.row.endTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="颁发日期" width="100px" align="center">
        <template slot-scope="scope">{{ scope.row.awardTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="领取日期" width="100px" align="center">
        <template slot-scope="scope">{{ scope.row.downloadTime }}</template>
      </el-table-column>
      <el-table-column label="是否领取" align="center" width="80px">
        <template slot-scope="scope">{{ scope.row.isDownload ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="操作" align="right">
        <template slot-scope="scope">
          <el-button type="text" style="margin-right:10px" @click="certificateDataGet(scope.row.id)">修改</el-button>
          <el-button type="text" style="margin-right:10px" @click="certificateDataDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="search.pageNum"
        :page-size="search.pageSize"
        layout="prev, pager, next, total"
        :total="search.total"
      ></el-pagination>
    </div>
    <el-dialog title="证书信息" :visible="certificateData.visible" width="500px" :show-close="false" append-to-body>
      <el-form label-position="right" label-width="120px" :model="certificateData.model" ref="model">
        <el-form-item label="名称：" prop="name" :rules="[{ required: true, message: '名称不能为空' }]">
          <el-input v-model="certificateData.model.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobileNumber" :rules="[{ required: true, message: '手机号码不能为空' }]">
          <el-input v-model="certificateData.model.mobileNumber"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：" prop="identityCard" :rules="[{ required: true, message: '身份证号不能为空' }]">
          <el-input v-model="certificateData.model.identityCard"></el-input>
        </el-form-item>
        <el-form-item
          label="证书名称："
          prop="certificateName"
          :rules="[
            { required: true, message: '证书名称不能为空' },
            { max: 15, message: '证书名称不能超过15个字' }
          ]"
        >
          <el-input v-model="certificateData.model.certificateName"></el-input>
        </el-form-item>
        <el-form-item
          label="证书编号："
          prop="certificateNumber"
          :rules="[{ required: true, message: '证书编号不能为空' }]"
        >
          <el-input v-model="certificateData.model.certificateNumber"></el-input>
        </el-form-item>
        <el-form-item label="开始日期：" prop="startTime" :rules="[{ required: true, message: '开始日期不能为空' }]">
          <el-date-picker
            type="date"
            format="yyyy-MM-dd"
            v-model="certificateData.model.startTime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：" prop="endTime" :rules="[{ required: true, message: '结束日期不能为空' }]">
          <el-date-picker
            type="date"
            format="yyyy-MM-dd"
            v-model="certificateData.model.endTime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="颁奖日期：" prop="awardTime" :rules="[{ required: true, message: '颁奖日期不能为空' }]">
          <el-date-picker
            type="date"
            format="yyyy-MM-dd"
            v-model="certificateData.model.awardTime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="onClose">关闭</el-button>
          <el-button size="small" type="primary" @click="onSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      action: '',
      tableList: [],
      search: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        status: '',
        isDownload: '',
        certificateId: ''
      },
      certificateData: {
        visible: false,
        model: {
          name: '',
          mobileNumber: '',
          identityCard: '',
          certificateNumber: '',
          certificateName: '',
          awardTime: '',
          startTime: '',
          endTime: ''
        }
      }
    }
  },
  created() {
    this.action = `${this.baseUrl}/api/admin/v1/courseCertificateData/importData`
    this.search.certificateId = this.$route.query.id
    this.certificateDataPage()
  },
  filters: {
    formatDate(v) {
      if (v) {
        return v.split(' ')[0]
      }
    }
  },
  methods: {
    onSearch() {
      this.search.pageNum = 1
      this.certificateDataPage()
    },
    onDownload() {
      console.log(this.$projectUrl)
      location.href = this.$projectUrl + '/api/admin/v1/courseCertificateData/exportDataTemplate'
    },
    certificateDataPage() {
      this.$http.certificateDataPage(this.search).then((res) => {
        this.tableList = res.data.data.list
        this.search.total = res.data.data.total
      })
    },
    certificateDataGet(id) {
      this.$http.certificateDataGet({ id }).then((res) => {
        this.certificateData.model = res.data.data
        this.certificateData.visible = true
      })
    },
    certificateDataInsert() {
      this.$http.certificateDataInsert(this.certificateData.model).then((res) => {
        this.certificateDataPage()
        this.$message.success('保存成功')
        this.onClose()
      })
    },
    certificateDataUpdate() {
      this.$http.certificateDataUpdate(this.certificateData.model).then((res) => {
        this.certificateDataPage()
        this.$message.success('修改成功')
        this.onClose()
      })
    },
    certificateDataDelete(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.certificateDataDelete(id).then((res) => {
            this.$message.success('删除成功!')
            this.certificateDataPage()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除!')
        })
    },
    onSave() {
      this.$refs.model.validate((val) => {
        if (val) {
          this.certificateData.model.certificateId = this.search.certificateId
          if (this.certificateData.model.id) {
            this.certificateDataUpdate()
          } else {
            this.certificateDataInsert()
          }
        }
      })
    },
    onClose() {
      this.certificateData.visible = false
      this.$refs.model.resetFields()
      this.certificateData.model = {}
    },
    onBeforeUpload(file) {
      const xls = file.name.split('.')[1]
      console.log(xls)
      if (xls !== 'xls' && xls !== 'xlsx') {
        this.$message.error('请上传Excel文件')
        return false
      }
    },
    onSuccess(res) {
      if (res.code === 20000) {
        this.$message.success('导入成功！')
        this.certificateDataPage()
      } else {
        this.$message.error(res.message)
      }
    },
    handleCurrentChange(page) {
      this.search.pageNum = page
      this.certificateDataPage()
    }
  }
}
</script>
