<template>
  <div class="interactive-detail">
    <QcNavigationPage content="互动监测" full>
      <div class="interactive-content">
        <div class="interactive-form">
          <el-form label-position="right" label-width="auto">
            <el-form-item label="链接标题" :required="true">
              <el-input placeholder="最多可输入32个字" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <div class="interactive-form-title">只做备注或搜素使用，前端不做显示</div>
            <el-form-item label="页面链接" :required="true">
              <el-input placeholder="请输入链接"></el-input>
            </el-form-item>
            <el-form-item label="通知设置">
              <div class="interactive-form-check">
                <el-checkbox>行为通知</el-checkbox><span>（当客户点击收到的文件后，发送文件的成员将收到消息提醒）</span>
              </div>

              <div class="interactive-form-check">
                <el-checkbox>动态记录</el-checkbox>
                <span
                  >（当客户点击发送文件后，会将客户的点击行为记录在动态里，即前端侧边 栏客户详情里的动态记录轨迹）</span
                >
              </div>
            </el-form-item>
            <el-form-item label="打开行为标签">
              <!-- <el-button type="text" @click="openBehavior">添加</el-button> -->
              <div class="info-itemtag-div">
                <span class="edit-tag" @click="editEnterTag" v-if="listSpanName.length != 0">编辑</span>
                <span class="info-itemtag" v-for="(item, EnertTag) in listSpanName" :key="EnertTag">
                  {{ item.name || '--' }}
                </span>
              </div>
              <div>
                <el-button type="text" @click="openBehavior" v-if="listSpanName.length == 0">添加</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
              <el-button type="info">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <behavior-dialog
        :config="behaviorDialog.config"
        @closeDialog="behaviorDialog.config.visible = false"
        @handleConfirm="handleBehavior"
      >
      </behavior-dialog>
    </QcNavigationPage>
  </div>
</template>

<script>
import BehaviorDialog from '../../../components/common/BehaviorDialog'
export default {
  components: { BehaviorDialog },
  data() {
    return {
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择行为标签',
          visible: false
        }
      },
      listSpanName: []
    }
  },
  methods: {
    openBehavior() {
      this.behaviorDialog.config.visible = true
    },
    handleBehavior(list) {
      this.listSpanName = list
      this.behaviorDialog.config.visible = false
    },
    editEnterTag() {
      this.behaviorDialog.config.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.interactive-detail {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .interactive-content {
    .interactive-form {
      width: 500px;
      .interactive-form-title {
        font-size: 14px;
        color: #909399;
        margin-left: 100px;
        margin-top: -10px;
        margin-bottom: 20px;
      }
      .interactive-form-check {
        display: flex;
        .el-checkbox {
          flex: 1;
          color: black;
        }
        span {
          flex: 5;
          color: #909399;
        }
      }
    }
  }
}
.info-itemtag-div {
  width: 500px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.edit-tag {
  display: inline;
  color: #294a7b;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 0 20px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;
}
</style>
