<template>
  <div>
    <QcTable ref="table" :option="{ url: 'api/admin/v1/sharer-level/page' }" :menu="menu" :column="column"></QcTable>
    <el-dialog
      title="编辑等级设置"
      :visible.sync="visible"
      width="500px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="model" ref="model" label-width="120px" label-position="left">
        <el-form-item label="等级名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.level" type="number"></el-input>
        </el-form-item>
        <el-form-item label="升级目标类型" prop="goalType" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-select v-model="model.goalType">
            <el-option label="团队数量" value="friends-quantity"></el-option>
            <el-option label="推广订单金额" value="order-amount"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="model.goalType === 'friends-quantity' ? '升级目标人数' : '升级目标金额'"
          prop="goalQuantity"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input-number :controls="false" v-model="model.goalQuantity" type="number"></el-input-number>
        </el-form-item>
        <el-form-item label="佣金比率" prop="commissionRate" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input-number :controls="false" v-model="model.commissionRate" type="number"></el-input-number>
          %
        </el-form-item>
        <el-form-item label="封面" prop="icon">
          <QcImageUpload
            width="100px"
            height="100px"
            :data="{ imageType: 'sharer' }"
            v-model="model.icon"
          ></QcImageUpload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      // searchForm: [
      //   { label: '姓名', type: 'input', formName: 'name', value: '' },
      //   { label: '手机', type: 'input', formName: 'mobile', value: '' }
      // ],
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
        { type: 'index', label: '序号', width: '60px', align: 'center' },
        {
          label: '图标',
          prop: 'icon',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.icon} fit="cover" style="width:60px;height:60px;"></el-image>
          }
        },
        { prop: 'name', label: '等级名称', align: 'center' },
        { prop: 'level', label: '等级', align: 'center' },
        { prop: 'commissionRate', label: '佣金比率', align: 'center' },
        { prop: 'description', label: '简介', align: 'center', width: '300px' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    // this.model = JSON.parse(JSON.stringify(row))
                    // this.visible = true
                    this.sharerLevelGet(row.id)
                  }}
                >
                  修改
                </el-button>
              </div>
            )
          }
        }
      ],
      model: {
        name: '',
        level: '',
        goalQuantity: '',
        goalType: '',
        commissionRate: '',
        commissionRate2: 0
      }
    }
  },
  methods: {
    onSave(type) {
      this.$http[type](this.model).then((res) => {
        this.$message.success('保存成功')
        this.$refs.table.onSearchKeep()
        this.onClose()
      })
    },
    onClose() {
      this.visible = false
      this.clearForm('model')
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.id ? this.onSave('sharerLevelUpdate') : this.onSave('sharerLevelInsert')
        }
      })
    },
    async sharerLevelGet(id) {
      const res = await this.$http.sharerLevelGet({ id })
      this.model = res.data.data
      this.visible = true
    },
    deleteConfirm(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.sharerLevelDelete({ id }).then(() => {
            this.$refs.table.onSearchKeep()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {})
    }
  }
}
</script>
