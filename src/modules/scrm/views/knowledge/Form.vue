<template>
  <div v-if="fresh" v-cloak class="keyword-div">
    <div class="cancel-div">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">新增关键词</el-button>
    </div>
    <div class="cancel-div-content">
      <el-form :model="model" ref="model" label-position="left" label-width="100px" class="elform-div">
        <el-form-item label="关键词名称" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input
            style="width: 400px"
            maxlength="80"
            placeholder="最多可输入80字"
            v-model="model.keywordName"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置关键字" label-width="100px">
          <div class="keyword-item">
            <div>
              <el-input v-model="inputKeyWord" size="small" placeholder="请输入内容"> </el-input>
            </div>
            <div>
              <el-button style="margin-left: 10px" @click="addKeyWord" size="small" icon="el-icon-plus" plain
                >添加</el-button
              >
            </div>
          </div>
          <div class="keyword-item" v-for="(item, index) in model.keywordList" :key="index">
            <div>
              <el-input v-model="item.keyword" size="small" placeholder="请输入内容"> </el-input>
            </div>
            <div>
              <el-button
                style="margin-left: 10px"
                icon="el-icon-minus"
                size="mini"
                @click="deleteKeyWord(index)"
                circle
              ></el-button>
              <!-- <el-button style="margin-left: 10px" type="info" size="small" @click="deleteKeyWord(index)"
                >删除</el-button
              > -->
            </div>
          </div>
        </el-form-item>
        <el-form-item label="回复内容">
          <div class="common-table">
            <el-button @click="showSpeechAddDialog" class="add-button" size="small" icon="el-icon-plus" plain
              >添加群发内容</el-button
            >
            <div class="table_content">
              <el-table
                :header-cell-style="{
                  'text-align': 'center',
                  'background-color': '#ebeef5',
                  color: '#333333',
                  height: '40px'
                }"
                :data="model.answerList"
                height="400"
              >
                <el-table-column v-for="(item, index) in column" :key="index" v-bind="item"> </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="button-sumbit">
            <el-button @click="$router.go(-1)">取消</el-button>
            <el-button @click="onSubmit()" type="primary">确定</el-button>
          </div></el-form-item
        >
      </el-form>

      <el-dialog
        title="添加关键字素材"
        :visible.sync="addMaterialDialog.visible"
        :close-on-click-modal="false"
        :append-to-body="true"
      >
        <div class="material">
          <MaterialCom
            ref="materialEditor"
            :materialType="materialEditor.type"
            @typeChange="materialTypeChange"
          ></MaterialCom>
          <div class="dialog-input" v-if="materialEditor.type === 'image'">
            <span>素材名称&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div class="input-content">
              <el-input v-model="addMaterialDialog.input.imageName" placeholder="请输入素材名称"> </el-input>
            </div>
          </div>
          <div class="dialog-input" v-if="materialEditor.type === 'video'">
            <span>素材名称&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div class="input-content">
              <el-input v-model="addMaterialDialog.input.videoName" placeholder="请输入素材名称"> </el-input>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="checkAndEditSpeechData()">取 消</el-button>
          <el-button type="primary" @click="checkAndSumbitSpeechData()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- </QcNavigationPage> -->
    </div>
  </div>
</template>

<script>
import MaterialCom from '../../components/common/MaterialEditor'
import api from '../../api/knowledge'
export default {
  provide() {
    return {
      reload: this.relod
    }
  },
  components: { MaterialCom },
  data() {
    return {
      inputKeyWord: '', // 添加的关键字

      tagFormVisible: false,
      textarea: '',
      task_arr: [
        {
          task_num: ''
        }
      ],
      page: [],
      master_user: {
        sel: null, //选中行
        columns: [
          {
            prop: 'type',
            label: '关键字列表',
            width: 200
          }
        ],
        data: []
      },
      fresh: true,

      model: {
        keywordName: '',
        keywordList: [],
        answerList: []
      },
      column: [
        {
          type: 'index',
          label: '序号',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '话术内容',
          minWidth: '150px',
          align: 'center',
          prop: 'content',
          formatter: (row) => {
            return {
              text: <div>{row.content}</div>,
              image: <img src={this.imgHost + row.imageUrl} style="width:80px;height:80px;" alt="" />,
              image_text: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;">
                    图文
                  </el-tag>
                  {row.name}
                </div>
              ),
              video: <video style="width: 150px; height: 100px;" src="#" controls="controls" />,
              program: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="success">
                    小程序
                  </el-tag>
                  {row.name}
                </div>
              ),
              file: (
                <div>
                  <el-tag size="mini" style="margin-right: 10px;" type="warning">
                    文件
                  </el-tag>
                  {row.name}
                </div>
              )
            }[row.type]
          }
        },
        {
          label: '类型',
          minWidth: '150px',
          align: 'center',
          prop: 'type',
          formatter: (row) => {
            return {
              text: '文字',
              image: '图片',
              image_text: '图文',
              video: '视频',
              program: '小程序',
              file: '文件'
            }[row.type]
          }
        },
        {
          label: '操作',
          width: '200px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row, index)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      addMaterialDialog: {
        visible: false,
        input: {
          imageName: '',
          videoName: ''
        }
      },
      materialEditor: {
        type: 'text'
      }
    }
  },
  methods: {
    // //增加按钮
    addPlus() {
      let obj = {
        task_num: ''
      }
      this.task_arr.push(obj)
    },
    //删除按钮
    minuPlus(index) {
      this.task_arr.splice(index, 1)
    },
    add() {
      for (let i of this.master_user.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      let j = {
        type: '',
        isSet: true
      }
      this.master_user.data.push(j)
      this.master_user.sel = JSON.parse(JSON.stringify(j))
      // console.log(this.master_user.data)
    },
    saveRow(row) {
      //保存
      let that = this
      let data = JSON.parse(JSON.stringify(this.master_user.sel))
      for (let k in data) {
        row[k] = data[k]
      }
      row.isSet = false
      that.model.keywordList.push({
        keyword: data.type
      })
      console.log(that.model.keywordList)
    },

    //添加方法
    addSave() {
      let that = this
      api.appAdd(that.model).then(() => {
        that.$message.success('添加成功')
        that.Refresh = false
        console.log(that.model)
        that.$nextTick(() => {
          that.Refresh = true
        })
      })
    },
    //添加按钮，点击按钮提叫数据
    onSubmit() {
      let that = this
      if (that.model.keywordName == '') {
        this.$message.warning('请输入关键词名称')
        return
      }
      if (that.inputKeyWord == '') {
        this.$message.warning('请输入关键字')
        return
      }
      if (that.model.answerList.length <= 0) {
        this.$message.warning('请填写群发内容')
        return
      }
      if (that.inputKeyWord != '') {
        that.model.keywordList.push({ keyword: that.inputKeyWord })
      }

      // if (that.model.keywordName === '' || that.model.keywordList.length <= 0 || that.model.answerList.length <= 0) {
      //   that.$message.warning('请完善内容')
      // } else {
      api.appAdd(that.model).then(() => {
        that.$message.success('添加成功')
        that.$router.go(-1)
      })
      // }
    },
    checkAndEditSpeechData() {
      this.addMaterialDialog.visible = false
      // 类型
      this.materialEditor.type = 'text'
      // 素材编辑器
      this.$refs.materialEditor.clearFormData()
    },
    showSpeechAddDialog() {
      this.addMaterialDialog.visible = true
    },
    addMaterial() {
      this.addMaterialDialog.visible = true
    },
    materialTypeChange(val) {
      // console.log('返回类型' + val)
      this.materialEditor.type = val
      // console.log(this.materialEditor.type)
    },
    // 添加素材确认按钮
    checkAndSumbitSpeechData() {
      let that = this
      let type = that.materialEditor.type
      if (type === 'text') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请输入话术内容')
        }
      } else if (type === 'image') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (this.addMaterialDialog.input.imageName === '') {
            this.$message.warning('请输入素材名称')
          } else {
            params.name = this.addMaterialDialog.input.imageName
            this.sumbitSpeechData(type, params)
          }
        } else {
          this.$message.warning('请添加图片')
        }
      } else if (type === 'image_text') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加图文')
        }
      } else if (type === 'video') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (this.addMaterialDialog.input.videoName === '') {
            this.$message.warning('请输入素材名称')
          } else {
            params.name = this.addMaterialDialog.input.imageName
            this.sumbitSpeechData(type, params)
          }
        } else {
          this.$message.warning('请添加视频')
        }
      } else if (type === 'program') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加小程序')
        }
      } else if (type === 'file') {
        let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          this.sumbitSpeechData(type, params)
        } else {
          this.$message.warning('请添加文件')
        }
      }
    },
    sumbitSpeechData(type, params) {
      params.type = type
      this.model.answerList.push(params)
      this.addMaterialDialog.visible = false
    },
    reload() {
      this.fresh = false
      this.$nextTick(function() {
        this.fresh = true
      })
    },

    // 新增关键字
    addKeyWord() {
      let keyword = this.inputKeyWord
      if (keyword == '') {
        this.$message.warning('请输入关键字')
      } else {
        let obj = {
          keyword: keyword
        }
        this.model.keywordList.push(obj)
        this.inputKeyWord = ''
      }
    },
    deleteKeyWord(index) {
      this.model.keywordList.splice(index, 1)
    },
    ShowEditMaterialDialog() {},
    // 删除素材
    deleteMaterial(row, index) {
      this.model.answerList.splice(index, 1)
    },
    trunBack() {
      this.$openNewPageBack()
    }
  },
  created() {
    // this.appPage()
  }
}
</script>
<style lang="scss" scoped>
.keyword-div {
  width: 100%;
  height: 100%;
  .elform-div {
    margin: 20px;
  }
}
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
.MessageDiv {
  margin-bottom: 5px;
  text-align: center;
}
.QcImageUpload {
  text-align: left;
}
[v-cloak] {
  display: none !important;
}

.keyword-item {
  display: flex;
  max-width: 300px;
}
.dialog-input {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .input-content {
    width: 217px;
  }
}
.add-button {
  margin-bottom: 10px;
}
.el-table {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }
}
.button-sumbit {
}
.cancel-div {
}
.cancel-div-content {
  background: #fff;
  min-height: calc(100% - 56px);
  padding-top: 20px;
  margin-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.table_content {
  width: 80%;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
