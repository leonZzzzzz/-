<template>
  <!-- 行为标签 参考新建渠道活码 xfo -->
  <!-- 
     <BehaviorLabel
      :dialogVisible="BehaviorLabelDialogVisible"
      :fileList="updateBehavList"
      :type="behaviorLabelType"
      @closeDialog="BehaviorLabelDialogVisible = false"
      @reloadData="getEnterList"
    ></BehaviorLabel>

    :dialogVisible ==> 关闭弹窗字段
    :fileList ==> 修改数据的对象
    :type ==> 是否为新建 ture 新建 false 修改
    @closeDialog ==> 关闭弹窗方法
    @reloadData ==> 添加成功后回调
   -->
  <div>
    <el-dialog
      title="行为标签"
      :visible="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="behaviorModel"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="behaviorModel.name"
          ></el-input>
          <!-- :disabled="!this.type" -->
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div
              class="addtag-input-content"
              v-for="(item, index) in behaviorModel.tagList"
              :key="index"
            >
              <div class="inp">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  v-model="item.name"
                ></el-input>
              </div>
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleBehaviorRow(index)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button
              @click="addBehaviorKeyWord"
              plain
              icon="el-icon-plus"
              size="small"
            >添加标签</el-button>
          </div>
        </div>
      </el-form>
      <div></div>
      <div
        class="Btn-two"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="closeDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="sumbitBehaviorAddDialog()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: Boolean,
      default: true // true 创建 false 修改
    }
  },
  data() {
    return {
      behaviorModel: {
        name: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      }
    }
  },
  watch: {
    dialogVisible() {
      if (this.type) {
        this.behaviorModel = {
          name: '',
          tagList: [
            {
              id: '',
              name: ''
            }
          ]
        }
      } else {
        this.behaviorModel = this.fileList
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.behaviorModel = {
        name: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      }
      this.$emit('closeDialog')
    },
    //添加标签名
    addBehaviorKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.behaviorModel.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.behaviorModel.tagList.push({ name: '', score: '' })
      return
    },
    //删除
    deteleBehaviorRow(index) {
      if (this.behaviorModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.behaviorModel.tagList.splice(index, 1)
    },
    //关闭添加标签组弹窗
    closeBehaviorAddDialog() {
      this.dialogVisible = false
    },
    //提交标签组弹窗
    sumbitBehaviorAddDialog() {
      // let arr = this.model.tagList
      let flag = false
      let flags = false
      if (this.behaviorModel.name == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.behaviorModel.tagList[0].name == undefined) {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.behaviorModel.tagList.forEach(item => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          if (this.type) {
            // 执行新建操作
            this.$http.addBehavior(this.behaviorModel).then(() => {
              this.$message.success('添加成功')
              this.closeDialog()
              // 重载页面数据
              this.$emit('reloadData')
              this.behaviorModel.name = ''
              this.behaviorModel.tagList = [{}]
            })
          } else {
            // 执行修改操作
            this.$http.updateBehavior(this.behaviorModel).then(() => {
              this.$message.success('修改成功')
              this.closeDialog()
              // 重载页面数据
              this.$emit('reloadData')
              this.behaviorModel.name = ''
              this.behaviorModel.tagList = [{}]
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addtag-item {
  .addtag-title {
    padding: 5px 0;
  }
  .addtag-input {
    padding-top: 10px;
    .addtag-input-content {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .inp {
        flex: 1;
      }
      .score {
        padding-left: 10px;
        width: 110px;
      }
      .btn {
        width: 28px;
        padding-left: 10px;
      }
    }
  }
  .addtag-addBtn {
    margin-bottom: 20px;
    .el-button {
      color: #1e90ff;
    }
  }
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
