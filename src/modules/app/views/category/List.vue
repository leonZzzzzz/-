<template>
  <div>
    <QcTable ref="table" :option="option" :column="column" :searchForm="searchForm" :menu="menu"></QcTable>
    <el-dialog :visible="visible" title="应用信息" append-to-body width="450px" :show-close="false">
      <el-form :model="model" ref="model" label-position="left" label-width="80px" hide-required-asterisk>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="iconUrl" :rules="[{ required: false, message: '请填写该字段' }]">
          <ImageUpload
            style="display: inline-block;"
            :imageUrl="model.iconUrl"
            :on-success="(e) => (model.iconUrl = e)"
          ></ImageUpload>
          <span>&nbsp;&nbsp;建议比例1：1，像素小于600k</span>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="model.describe"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seqNum" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input-number v-model="model.seqNum" style="width:100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '请填写该字段' }]">
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div>是否公开</div>
            <el-switch v-model="model.status" :active-value="1" :inactive-value="0"></el-switch>
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
        url: 'api/admin/v1/appPricingCategory/page'
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        {
          label: '状态',
          type: 'select',
          formName: 'status',
          option: [
            { label: '全部', value: '' },
            { label: '公开', value: 1 },
            { label: '私密', value: 0 }
          ],
          value: ''
        }
      ],
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
        {
          label: '图标',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:60px;height:60px;"></el-image>
          }
        },
        { label: '名称', prop: 'name', align: 'center' },
        { label: '介绍', prop: 'describe', align: 'center' },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.status === 0 ? '私密' : '公开'
          }
        },
        { label: '排序', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          align: 'right',
          formatter: (row) => {
            return (
              <div>
                <el-button style="margin-right:10px" type="text" onClick={this.getAppCategory.bind(this, row.id)}>
                  修改
                </el-button>
                <el-dropdown>
                  <el-button type="text">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div onClick={this.updateAppCategoryStatus.bind(this, row.id, row.status)}>
                        设为{row.status === 1 ? '私密' : '公开'}
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div onClick={this.deleteAppCategory.bind(this, row.id)}> 删除</div>
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
        name: '',
        iconUrl: '',
        describe: '',
        seqNum: 0,
        status: 1
      }
    }
  },
  methods: {
    getAppCategory(id) {
      this.$http.getAppCategory({ id }).then((res) => {
        this.model = res.data.data
        this.visible = true
      })
    },
    addAppCategory() {
      this.$http.addAppCategory(this.model).then(() => {
        this.onClose()
        this.$refs.table.onSearchKeep()
      })
    },
    updateAppCategory() {
      this.$http.updateAppCategory(this.model).then(() => {
        this.onClose()
        this.$refs.table.onSearchKeep()
      })
    },
    updateAppCategoryStatus(id, status) {
      status = status === 0 ? 1 : 0
      this.$http.updateAppCategoryStatus({ id, status }).then(() => {
        this.$refs.table.onSearchKeep()
      })
    },
    deleteAppCategory(id) {
      this.$http.deleteAppCategory({ id }).then(() => {
        this.$refs.table.onSearchKeep()
      })
    },
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          this.model.id ? this.updateAppCategory() : this.addAppCategory()
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
