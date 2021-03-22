<template>
  <el-dialog
    :title="config.title"
    :visible="config.visible"
    :width="config.width"
    :close-on-click-modal="false"
    append-to-body
    @close="closeDialog"
  >
    <div class="remark-content">
      <el-form class="none-form" v-if="tagNameList.length == 0">
        <el-form-item class="none-tag">
          暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
        </el-form-item>
      </el-form>

      <div class="selectGroup" v-if="tagNameList.length != 0">
        <div class="leftTitle">
          <span>已选</span>
        </div>
        <div class="rightTags">
          <el-tag
            v-for="(tag, index) in spanName"
            :key="index"
            closable
            type="info"
            :disable-transitions="true"
            @close="closeTagList(tag, index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div v-for="(item, index) in tagNameList" :key="index">
        <div class="tagGroupTitle">{{ item.name }}</div>
        <div class="tagChange">
          <div
            @click="changeTags(items.tagId, items.id, items.name)"
            v-for="(items, indexs) in item.tagList"
            :key="indexs"
            :class="{ active: spanIndex.includes(items.id) }"
          >
            {{ items.name }}
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" :class="config.position === 'center' ? 'flex-center' : 'dialog-footer'">
      <div class="group-btn" v-if="showClose">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
      <div class="simple-btn" v-else>
        <el-button type="primary" @click="handleConfirm"
          >&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;确定&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
const dialogConfig = {
  width: '400px', // 宽度
  title: '', // 标题
  position: 'right', // 按钮位置，支持center、right
  visible: false // 是否显示弹窗
}
export default {
  props: {
    config: {
      // 基本配置信息
      type: Object,
      default: () => {
        return dialogConfig
      }
    },
    showClose: {
      // 是否显示取消按钮
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      tagNameList: '',
      spanName: [],
      spanIndex: [],
      handerTagList: []
    }
  },
  created() {
    this.getEnterList()
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      // this.spanName = []
      // this.spanIndex = []
      // this.handerTagList = []
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      this.$emit('handleConfirm', this.handerTagList)
    },
    nextRouter() {
      this.$router.push('/main/scrm/tag-library/behavior/list')
    },
    closeTagList(tag, index) {
      this.spanName.splice(index, 1)
      this.spanIndex.splice(index, 1)
      this.handerTagList.splice(index, 1)
    },
    changeTags(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      let handerTagList = this.handerTagList.indexOf(id)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
        this.handerTagList.splice(handerTagList, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
        this.handerTagList.push({ id: id, name: name })
      }
      // console.log(this.spanIndex)
    },
    getEnterList() {
      this.$http.getBehaviorPages().then((res) => {
        this.tagNameList = res.data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  flex-flow: column-reverse;
}
.flex-center {
  display: flex;
  justify-content: center;
}
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
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
.remark-content {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
    // border: 1px solid red;
    .leftTitle {
      display: inline;
      span {
        display: inline-block;
        margin-top: 5px;
        // border: 1px solid red;
      }
    }
    .rightTags {
      display: inline;

      .el-tag {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
  }
}

.tagGroupTitle {
  padding: 20px 0;
}
.tagChange {
  // border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px 10px 10px 0;
    padding: 8px 20px;
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 5px;
    display: inline-block;
    border-color: #e9e9eb;
    cursor: pointer;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.none-tag {
  text-align: center;
}
</style>
