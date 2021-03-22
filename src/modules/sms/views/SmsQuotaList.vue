<template>
  <div>
    <QcTable ref="table" :option="option" :column="column" :searchForm="searchForm" :menu="menu"></QcTable>
    <el-dialog :visible="visible" append-to-body title="短信配置" width="850px" :show-close="false">
      <el-form :model="model" ref="model" label-position="left" label-width="80px" hide-required-asterisk>
        <el-form-item label="类型" prop="smsTypeId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-select v-model="model.smsTypeId" style="width:350px;">
            <el-option v-for="item in smsCategoryList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name" style="width:350px;" maxlength="6" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="model.content" style="width:350px;" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input-number v-model="model.seqNum" style="width:350px;"></el-input-number>
        </el-form-item>
        <el-form-item label="售价">
          <div style="display: flex;justify-content: space-between;text-align: center;">
            <el-form-item>
              <div>价格</div>
              <el-input style="width:160px;" v-model="model.amount" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item>
              <div>短信条数</div>
              <el-input-number style="width:160px;" :min="0" v-model="model.count"></el-input-number>
            </el-form-item>
            <el-form-item>
              <div>有效期</div>
              <el-input style="width:160px;" v-model="model.validityPeriod">
                <el-button slot="append">个月</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div>库存</div>
              <el-input-number style="width:160px;" :min="0" v-model="model.stock"></el-input-number>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '请填写该字段' }]">
          <div style="width:350px;display: flex;align-items: center;justify-content: space-between;">
            <div>是否上架</div>
            <el-switch v-model="model.status" :active-value="true" :inactive-value="false"></el-switch>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <SmsTypeDialog :visible="smsTypeVisible" @onClose="smsTypeVisible = false"></SmsTypeDialog>
  </div>
</template>

<script>
import SmsTypeDialog from './SmsTypeDialog'
export default {
  components: {
    SmsTypeDialog
  },
  data() {
    return {
      option: {
        url: 'api/admin/v1/smsQuota/all'
      },
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.visible = true
          }
        },
        {
          label: '套餐类型管理',
          type: 'primary',
          on: () => {
            this.smsTypeVisible = true
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', align: 'center' },
        {
          label: '名称',
          align: 'center',
          prop: 'name'
        },
        {
          label: '价格',
          align: 'center',
          formatter: (row) => {
            return row.amount / 100
          }
        },
        { label: '有效期', prop: 'validityPeriod', align: 'center' },
        { label: '库存', prop: 'stock', align: 'center' },
        { label: '销量', prop: 'sales', align: 'center' },
        { label: '排序', prop: 'seqNum', align: 'center' },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status ? '上架' : '下架'
          }
        },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getSms.bind(this, row.id)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteSms.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      smsTypeVisible: false,
      visible: false,
      model: {
        smsTypeId: '',
        name: '',
        seqNum: '',
        amount: '',
        count: 1,
        validityPeriod: 1,
        stock: 0,
        status: true
      },
      smsCategoryList: []
    }
  },
  created() {
    this.$http.listSmsCategory().then((res) => {
      this.smsCategoryList = res.data.data
    })
  },
  methods: {
    getSms(id) {
      this.$http.getSms({ id }).then((res) => {
        this.model = res.data.data
        this.model.amount /= 100
        this.visible = true
      })
    },
    addSms(model) {
      this.$http.addSms(model).then(() => {
        console.log('添加成功')
        this.$refs.table.onSearch()
        this.onClose()
      })
    },
    updateSms(model) {
      this.$http.updateSms(model).then(() => {
        console.log('修改成功')
        this.$refs.table.onSearchKeep()
        this.onClose()
      })
    },
    deleteSms(id) {
      this.$http.deleteSms({ id }).then(() => {
        this.$refs.table.onSearchKeep()
      })
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          let model = JSON.parse(JSON.stringify(this.model))
          model.amount *= 100
          this.model.id ? this.updateSms(model) : this.addSms(model)
        }
      })
    },
    onClose() {
      this.clearForm('model')
      this.visible = false
    }
  }
}
</script>

<style></style>
