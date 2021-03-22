<template>
  <div>
    <QcTable ref="table" :option="option" :column="column" :searchForm="searchForm" :menu="menu"></QcTable>
    <el-dialog :visible="visible" title="功能信息" width="450px" append-to-body :show-close="false">
      <el-form :model="model" ref="model" label-position="left" label-width="80px" hide-required-asterisk>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name" maxlength="6" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="model.describe" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seqNum" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input-number v-model="model.seqNum" style="width:100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '请填写该字段' }]">
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div>是否冻结</div>
            <el-switch v-model="model.status" :active-value="-1" :inactive-value="1"></el-switch>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/appPricingElement/page'
      },
      searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
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
        { label: '序号', type: 'index', align: 'center' },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '说明', prop: 'describe', align: 'center' },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === 1 ? '正常' : '冻结'
          }
        },
        { label: '排序', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center', width: '100px' },
        {
          label: '操作',
          align: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  style="margin-right:10px"
                  type="text"
                  onClick={() => {
                    this.getAppPricingElement(row.id)
                  }}
                >
                  修改
                </el-button>
                <el-button
                  style="margin-right:10px"
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/app/pricing-element/detail?id=${row.id}`)
                  }}
                >
                  编辑权限
                </el-button>
                <el-dropdown>
                  <el-button type="text">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div
                        onClick={() => {
                          this.updateStatusAppPricingElement(row.id, row.status == 1 ? -1 : 1)
                        }}
                      >
                        设为{row.status === 1 ? '冻结' : '正常'}
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div onClick={this.deleteAppPricingElement.bind(this, row.id)}> 删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            )
          }
        }
      ],
      visible: false,
      model: {
        price: 0,
        name: '',
        describe: '',
        seqNum: '',
        status: 1
      }
    }
  },
  methods: {
    getAppPricingElement(id) {
      this.$http.getAppPricingElement({ id }).then((res) => {
        this.model = res.data.data
        this.visible = true
      })
    },
    upadteAppPricingElement() {
      this.$http.upadteAppPricingElement(this.model).then(() => {
        this.$refs.table.onSearchKeep()
        this.onClose()
      })
    },
    addAppPricingElement() {
      this.$http.addAppPricingElement(this.model).then(() => {
        this.$refs.table.onSearchKeep()
        this.onClose()
      })
    },
    updateStatusAppPricingElement(id, status) {
      this.$http.updateStatusAppPricingElement({ id, status }).then(() => {
        this.$refs.table.onSearchKeep()
      })
    },
    deleteAppPricingElement(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteAppPricingElement({ id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.id ? this.upadteAppPricingElement() : this.addAppPricingElement()
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

<style></style>
