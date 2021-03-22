<template>
  <div class="page">
    <div class="top-btns">
      <el-button type="primary" size="small" @click="createBase">新建字段</el-button>
      <!-- <el-button type="primary" size="small" @click="showBase">设置字段</el-button> -->
    </div>
    <TableList :tableData="tableData" :tableColumn="tableColumn" id="table" :tableHeight="tableHeight"></TableList>
    <Dialog :configure="configure" :height="height" @closeDialog="closeDialog" @success="success">
      <el-form :model="ruleForm" label-position="left" ref="ruleForm" label-width="80px">
        <el-form-item
          label="字段名称"
          prop="name"
          :rules="[{ required: true, message: '请输入字段名称', trigger: 'blur' }]"
        >
          <el-input v-model="ruleForm.name" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item label="输入类型" :required="true">
          <el-radio-group v-model="ruleForm.type" :disabled="isUpdate" @change="setItemNumber">
            <el-radio label="text">文本</el-radio>
            <el-radio label="radio">单选</el-radio>
            <el-radio label="checkbox">多选</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="ruleForm.type != 'text'">
          <el-form-item
            class="myFormItem"
            :label="item.name + (index + 1)"
            v-for="(item, index) in itemList"
            :key="index"
            :required="true"
          >
            <!-- <el-input placeholder="请输入字段选项，以下划线“_”隔开，例如“男_女”" v-model="ruleForm.optionName"></el-input> -->
            <div class="item">
              <el-input placeholder="请输入选项" v-model="item.value" maxlength="40" show-word-limit></el-input>
              <div class="btn">
                <el-button circle icon="el-icon-minus" @click="deleteItem(index)"></el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button plain icon="el-icon-plus" size="small" @click="createItem">添加</el-button>
          </el-form-item>
        </div>
        <el-form-item
          label="排序号"
          prop="sequence"
          :rules="[{ required: true, message: '请输入排序号', trigger: 'blur' }]"
        >
          <el-input-number v-model="ruleForm.sequence" :step="1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="启用" prop="isEnabled" :required="true">
          <el-switch v-model="ruleForm.isEnabled" active-color="#294A7B" inactive-color="#EBEEF5"> </el-switch>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog
      :configure="configureBaseSetting"
      :height="'300px'"
      @closeDialog="closeDialogBaseSetting"
      @success="successBaseSetting"
    >
      <div class="beforeWords">
        说明：<el-button type="text" icon="el-icon-success"></el-button>为显示
        <el-button type="text" icon="el-icon-circle-check"></el-button>为不显示
      </div>
      <div class="tagList">
        <el-tag class="tag" effect="plain" v-for="(item, index) in defaultList" :key="index">
          <el-button
            type="text"
            :icon="item.isChecked ? 'el-icon-success' : 'el-icon-circle-check'"
            class="get"
            @click="changeBaseInfoIsCheck(index)"
          ></el-button
          >{{ item.name }}</el-tag
        >
      </div>
    </Dialog>
  </div>
</template>

<script>
import TableList from '../../../../scrm/components/components/TableList'
import Dialog from '../../../../scrm/components/components/Dialog'
export default {
  components: {
    TableList,
    Dialog
  },
  data() {
    return {
      configure: {
        title: '新建字段',
        visible: false,
        width: '600px'
      },
      configureBaseSetting: {
        title: '基础字段设置',
        visible: false,
        width: '700px'
      },
      height: '400px',
      tableData: [],
      tableColumn: [
        {
          prop: 'name',
          title: '名称',
          align: 'center'
        },
        {
          prop: 'type',
          title: '类型',
          align: 'center',
          formatter: (row) => {
            return row.type == 'radio' ? '单选' : row.type == 'checkbox' ? '多选' : '文本'
          }
        },
        {
          prop: 'optionName',
          title: '选项',
          align: 'center'
        },
        {
          prop: 'sequence',
          title: '排序号',
          align: 'center'
        },
        {
          prop: 'isEnabled',
          title: '启用状态',
          align: 'center',
          formatter: (row) => {
            return row.isEnabled ? '启用' : '不启用'
          }
        },
        // {
        //   prop: 'isChecked',
        //   title: '显示状态',
        //   align: 'center',
        //   formatter: (row) => {
        //     return row.isChecked ? '显示' : '不显示'
        //   }
        // },
        {
          prop: '',
          title: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.updateBase.bind(this, row)}>
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteBase.bind(this, row.id)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      ruleForm: {
        name: '',
        type: 'text',
        optionName: '',
        sequence: '',
        // isChecked: true,
        isEnabled: true
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      tableHeight: 400,
      defaultList: [],
      isUpdate: false,
      itemList: [
        {
          name: '选项',
          value: ''
        }
      ]
    }
  },
  methods: {
    // ---页面渲染函数---
    closeDialog() {
      this.configure.visible = false
    },
    setItemNumber() {
      if (this.ruleForm.type == 'checkbox' && this.itemList.length <= 1) {
        this.itemList.push({
          name: '选项',
          value: ''
        })
      }
    },
    createItem() {
      if (this.itemList.length >= 10) {
        return this.$message.warning('最多10个选项')
      }
      this.itemList.push({
        name: '选项',
        value: ''
      })
    },
    deleteItem(index) {
      if (this.ruleForm.type == 'radio' && this.itemList.length == 1) {
        return this.$message.warning('单选最少1个选项')
      }
      if (this.ruleForm.type == 'checkbox' && this.itemList.length == 2) {
        return this.$message.warning('多选最少2个选项')
      }
      this.itemList.splice(index, 1)
    },
    // 对话框取消
    closeDialogBaseSetting() {
      this.configureBaseSetting.visible = false
    },
    success() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let arr = []
          this.itemList.forEach((item) => {
            if (item.value == '') {
              return
            }
            arr.push(item.value)
          })
          this.ruleForm.optionName = arr.join('_')
          if (this.ruleForm.type != 'text' && this.ruleForm.optionName == '') {
            this.$message.error('请输入字段选项')
            return
          }
          this.ruleForm.appId = 'default'
          if (this.ruleForm.id) {
            this.functions('basicFieldUpdate', this.ruleForm, (res) => {
              this.$message.success('修改字段成功')
              this.configure.visible = false
              this.isUpdate = false
              this.basicFieldListDefault()
            })
          } else {
            this.functions('basicFieldAdd', this.ruleForm, (res) => {
              this.$message.success('新建字段成功')
              this.configure.visible = false
              this.basicFieldListDefault()
            })
          }
        } else {
          return false
        }
      })
    },
    successBaseSetting() {
      let ids = ''
      this.defaultList.forEach((item) => {
        if (item.isChecked) {
          ids = ids + '_' + item.id
        }
      })
      ids = ids.slice(1)
      console.log(ids)
      this.functions('basicFieldSaveDefault', { ids }, (res) => {
        this.$message.success('设置成功')
        this.configureBaseSetting.visible = false
        this.basicFieldListDefault()
      })
    },
    // 切换基础按钮显示与不显示
    changeBaseInfoIsCheck(index) {
      if (this.defaultList[index].isChecked) {
        this.defaultList[index].isChecked = false
      } else {
        this.defaultList[index].isChecked = true
      }
    },
    createBase() {
      this.itemList = [
        {
          name: '选项',
          value: ''
        }
      ]
      this.isUpdate = false
      this.configure.visible = true
      this.ruleForm = {
        name: '',
        type: 'text',
        optionName: '',
        sequence: '',
        isEnabled: true
      }
    },
    updateBase(row) {
      console.log(row)
      this.itemList = []
      if (row.optionName) {
        let arr = row.optionName.split('_')
        arr.forEach((item) => {
          this.itemList.push({
            name: '选项',
            value: item
          })
        })
      }
      this.ruleForm = row
      this.isUpdate = true
      this.configure.visible = true
    },
    deleteBase(id) {
      let options = {
        id,
        appId: 'default'
      }
      this.$confirm('此操作将永久删除该字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.functions('basicFieldDelete', options, (res) => {
            this.basicFieldListDefault()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showBase() {
      console.log('哈哈哈')
      this.configureBaseSetting.visible = true
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - document.getElementById('table').offsetTop - 112
      console.log(this.tableHeight)
    },
    // ---数据获取函数---
    // 获取基础字段数据
    basicFieldListDefault() {
      this.$http.basicFieldListDefault().then((res) => {
        console.log(res)
        this.tableData = res.data.data.defaultList
        this.defaultList = res.data.data.defaultList
      })
    }
    // 操作方法
    // 新增 basicFieldAdd
    // 修改 basicFieldUpdate
    // 删除 basicFieldDelete
    // 修改默认 basicFieldSaveDefault
  },
  created() {
    // 获取基础字段数据
    this.basicFieldListDefault()
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
  background-color: #fff;
  .top-btns {
    padding-bottom: 20px;
  }
}
.tagList {
  padding: 10px 0;
  display: flex;
  .tag {
    margin-right: 10px;
    display: flex;
  }
  .get {
    padding: 0;
    margin: 0;
    border: none;
    ::v-deep i {
      font-size: 16px;
    }
    margin-right: 5px;
  }
}
.myFormItem {
  margin-bottom: 10px;
  .item {
    display: flex;
    .btn {
      padding-left: 10px;
    }
  }
}
</style>
