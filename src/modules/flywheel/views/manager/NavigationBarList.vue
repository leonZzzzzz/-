<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
    <el-dialog :visible="visible" title="导航栏信息" width="450px" :before-close="onClose" append-to-body>
      <el-form ref="model" :model="model" label-position="left" label-width="100px" hide-required-asterisk>
        <el-form-item label="是否导航栏" prop="isTabBar">
          <el-switch v-model="model.isTabBar"></el-switch>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-select v-model="model.categoryId" style="width:100%;">
            <el-option v-for="item in categorys" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="导航栏文字"
          prop="navigationBarTitleText"
          :rules="[{ required: true, message: '请填写该字段' }]"
        >
          <el-input v-model="model.navigationBarTitleText"></el-input>
        </el-form-item>
        <el-form-item label="标题文字" prop="text" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.text"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="text">
          <el-input v-model="model.info"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="pagePath" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.pagePath"></el-input>
        </el-form-item>
        <div v-if="model.isTabBar">
          <el-form-item label="未选中图标" prop="iconPath">
            <QcImageUpload :data="{ imageType: 'component' }" v-model="model.iconPath"></QcImageUpload>
          </el-form-item>
          <el-form-item label="选中图标" prop="selectedIconPath">
            <QcImageUpload :data="{ imageType: 'component' }" v-model="model.selectedIconPath"></QcImageUpload>
          </el-form-item>
        </div>
        <el-form-item label="页面效果图" prop="pageImg">
          <QcImageUpload :data="{ imageType: 'component' }" v-model="model.pageImg"></QcImageUpload>
        </el-form-item>
        <el-form-item label="排序号" prop="sortNum">
          <el-input-number v-model="model.sortNum"></el-input-number>
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
        url: 'api/v1.0/NavigationBar/page'
      },
      searchForm: [
        { label: '名称', formName: 'title', type: 'input', value: '' },
        {
          label: '分类',
          formName: 'categoryId',
          type: 'select',
          value: '',
          option: [{ label: '全部', value: '' }]
        },
        {
          label: '类型',
          formName: 'isTabBar',
          type: 'select',
          value: '',
          option: [
            { label: '全部', value: '' },
            { label: '导航栏', value: true },
            { label: '页面', value: false }
          ]
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
          label: '页面效果图',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.pageImg} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        {
          label: '未选中图标',
          prop: 'iconPath',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconPath} style="width:60px;height:60px" fit="cover"></el-image>
          }
        },
        {
          label: '选中图标',
          align: 'center',
          formatter: (row) => {
            return (
              <el-image src={this.imgHost + row.selectedIconPath} style="width:60px;height:60px" fit="cover"></el-image>
            )
          }
        },
        { label: '导航栏文字', prop: 'text', align: 'center' },
        { label: '分类', prop: 'categoryName', align: 'center', width: '100px' },
        { label: '说明', prop: 'info', align: 'left', width: '200px' },
        { label: '跳转链接', prop: 'pagePath', align: 'left', width: '300px' },
        {
          label: '类型',
          width: '80px',
          align: 'center',
          formatter: (row) => {
            return row.isTabBar ? '导航栏' : '内页'
          }
        },
        {
          label: '状态',
          width: '50px',
          formatter: (row) => {
            return row.isShow ? '显示' : '隐藏'
          }
        },
        { label: '排序号', prop: 'sortNum', width: '80px', align: 'center' },
        {
          label: '操作',
          align: 'right',
          width: '100px',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.getFlyWheelNavigationBar.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteFlyWheelNavigationBar.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      visible: false,
      model: {
        navigationBarTitleText: '',
        text: '',
        pagePath: '',
        iconPath: '',
        selectedIconPath: '',
        pageImg: '',
        categoryId: '',
        sortNum: 0,
        info: '',
        isShow: false,
        isTabBar: false,
        isSystem: true
      },
      categorys: []
    }
  },
  created() {
    this.pageCategory()
  },
  methods: {
    pageCategory() {
      this.$http.pageFlywheelCategory({ type: 12 }).then((res) => {
        this.categorys = res.data.data.list
        this.categorys.forEach((item) => {
          this.searchForm[1].option.push({ label: item.name, value: item.id })
        })
        this.$refs.table.transformSearchForm().then(() => {
          this.$refs.table.onSearch()
        })
      })
    },
    deleteFlyWheelNavigationBar(id) {
      this.$http.deleteFlyWheelNavigationBar({ id }).then(() => {
        this.$message.success('删除成功')
        this.$refs.table.onSearch()
      })
    },
    getFlyWheelNavigationBar(model) {
      this.model = JSON.parse(JSON.stringify(model))
      this.visible = true
    },
    addFlyWheelNavigationBar(model) {
      this.$http.addFlyWheelNavigationBar(model).then(() => {
        this.onClose(true)
        this.$message.success('保存成功')
      })
    },
    updateFlyWheelNavigationBar(model) {
      this.$http.updateFlyWheelNavigationBar(model).then(() => {
        this.onClose(true)
        this.$message.success('保存成功')
      })
    },
    onSubmit() {
      this.$refs.model.validate((val) => {
        if (val) {
          this.model.id ? this.updateFlyWheelNavigationBar(this.model) : this.addFlyWheelNavigationBar(this.model)
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
