<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <el-dialog :visible="visible" title="组件信息" width="400px" :before-close="onClose" append-to-body>
      <el-form ref="model" :model="model" label-position="left" label-width="100px" hide-required-asterisk>
        <el-form-item label="展示图" prop="iconUrl" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcImageUpload :data="{ imageType: 'component' }" v-model="model.iconUrl"></QcImageUpload>
        </el-form-item>
        <el-form-item label="组件名" prop="title" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.title"></el-input>
        </el-form-item>
        <el-form-item label="组件识别码" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-select v-model="model.categoryId" style="width:100%">
            <el-option v-for="item in categorys" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="info">
          <el-input v-model="model.info"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="model.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
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
        url: 'api/v1.0/assemblyLibrary/page'
      },
      searchForm: [
        { label: '组件名', formName: 'title', type: 'input', value: '' },
        {
          label: '组件分类',
          formName: 'categoryId',
          type: 'select',
          value: '',
          option: [{ label: '全部', value: '' }]
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
          label: '展示图',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        { label: '分类', prop: 'categoryName', align: 'center' },
        { label: '组件名', prop: 'title', align: 'center' },
        { label: '简介', prop: 'info', align: 'center' },
        { label: '组件识别码', prop: 'name', align: 'center' },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return { 1: '上架', 2: '下架' }[row.status]
          }
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getFlyWheelComponent.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteFlyWheelComponent.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      visible: false,
      model: {
        iconUrl: '',
        title: '',
        categoryId: '',
        name: '',
        info: '',
        status: 1
      },
      categorys: []
    }
  },
  created() {
    this.pageCategory()
  },
  methods: {
    pageCategory() {
      this.$http.pageFlywheelCategory({ type: 14 }).then((res) => {
        this.categorys = res.data.data.list
        this.categorys.forEach((item) => {
          this.searchForm[1].option.push({ label: item.name, value: item.id })
        })
        this.$refs.table.transformSearchForm().then(() => {
          this.$refs.table.onSearch()
        })
      })
    },
    deleteFlyWheelComponent(id) {
      this.$http.deleteFlyWheelComponent({ id }).then(() => {
        this.$message.success('删除成功')
        this.$refs.table.onSearch()
      })
    },
    getFlyWheelComponent(model) {
      this.model = JSON.parse(JSON.stringify(model))
      this.visible = true
    },
    addFlyWheelComponent(model) {
      this.$http.addFlyWheelComponent(model).then(() => {
        this.onClose(true)
        this.$message.success('保存成功')
      })
    },
    updateFlyWheelComponent(model) {
      this.$http.updateFlyWheelComponent(model).then(() => {
        this.onClose(true)
        this.$message.success('保存成功')
      })
    },
    onSubmit() {
      this.$refs.model.validate((val) => {
        if (val) {
          this.model.id ? this.updateFlyWheelComponent(this.model) : this.addFlyWheelComponent(this.model)
        }
      })
    },
    onClose(update = false) {
      this.model = this.$options.data().model
      this.visible = false
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      if (typeof update == 'boolean' && update) {
        this.$refs.table.onSearchKeep()
      }
    }
  }
}
</script>
