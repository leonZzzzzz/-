
<template>
  <!-- 选择群主 xfo-->
  <div>
    <el-dialog
      :title="config.title"
      :visible="config.visible"
      :width="config.width"
      :close-on-click-modal="false"
      append-to-body
      :show-close="true"
      @close="closeDialog"
    >
      <div class="tree_title">
        <!-- <div class="title_left">组织架构</div> -->
        <div class="title_left">
          <div class="title_search">
            <el-input
              placeholder="请输入群主名称"
              v-model="filterText"
              prefix-icon="el-icon-search"
              size="small"
              @input="searchOwnerList"
            >
            </el-input>
          </div>
          <!-- <div class="add_member">
            <el-button size="small" plain>同步</el-button>
          </div> -->
        </div>
        <div class="title_right">已选择的群主({{ checkList.length }})</div>
      </div>
      <div class="tree_menu">
        <!-- 组织架构 -->
        <div class="menu_left">
          <el-checkbox-group v-model="checkList" @change="checkboxChange">
            <div class="xfo-item" v-for="(item, index) in ownerList" :key="index">
              <el-checkbox :label="item.owner">
                <el-image
                  style="width: 22px; height: 22px; margin-right: 10px"
                  :src="item.ownerAvatar"
                  fit="cover"
                ></el-image>
                {{ item.ownerName }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 已选择的成员 -->
        <div class="menu_right">
          <div class="right_menu">
            <div class="menu_item" v-for="(item, index) in ownerSelect" :key="index">
              <el-image
                style="width: 22px; height: 22px; margin-right: 10px"
                :src="item.ownerAvatar"
                fit="cover"
              ></el-image>
              <span style="margin-right: auto">
                {{ item.ownerName }}
              </span>
              <el-button type="text" icon="el-icon-close" @click="deleteCheck(item.owner)"></el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="xfo-btn">
        <el-button plain @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="success">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const dialogConfig = {
  width: '800px',
  title: '选择目标成员',
  visible: false
}
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return dialogConfig
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.selectForGroupSendNew()
  },
  watch: {
    'config.visible': function (a, b) {
      if (a) {
        this.filterText = ''
        this.selectForGroupSendNew()
        this.checkList = []
        this.ownerSelect = this.selectList
        this.selectList.forEach(item => {
          this.checkList.push(item.owner)
        })
      }
    }
  },
  data() {
    return {
      filterText: '',
      ownerList: [],
      checkList: [],
      ownerSelect: [],
      allOwnerList: []
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    deleteCheck(owner) {
      let index = this.checkList.indexOf(owner)
      this.checkList.splice(index, 1)
      this.checkboxChange()
    },
    success() {
      this.$emit('success', this.ownerSelect)
    },
    checkboxChange() {
      console.log(this.checkList)
      this.ownerSelect = this.getOwnerDetails(this.checkList, this.allOwnerList)
    },
    getOwnerDetails(list, allList) {
      let result = []
      allList.forEach(aItem => {
        list.forEach(item => {
          if (aItem.owner == item) {
            result.push(aItem)
          }
        })
      })
      return result
    },
    selectForGroupSendNew() {
      console.log('群主信息')
      this.$http.selectForGroupSendNew().then(res => {
        console.log('群主信息', res)
        this.ownerList = res.data.data
        this.allOwnerList = res.data.data
      })
    },
    searchOwnerList() {
      let params = {
        name: this.filterText
      }
      this.$http.selectForGroupSendNew(params).then(res => {
        console.log('群主信息', res)
        this.ownerList = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_title {
  display: flex;
  .title_left,
  .title_right {
    width: 50%;
    text-align: center;
    padding-bottom: 20px;
    user-select: none;
  }
  .title_left {
    display: flex;
    .title_search {
      width: 250px;
    }
    .add_member {
      margin-left: 10px;
    }
  }
}
.tree_menu {
  display: flex;
  box-sizing: border-box;
  height: 500px;
  .menu_left {
    width: 50%;
    border-right: 1px solid #dcdfe6;
    overflow-y: auto;
    .xfo-item {
      display: flex;
      justify-content: space-between;
      line-height: 32px;
      height: 32px;
      color: #222222;
      align-items: center;
      padding: 0 20px;
      &:hover {
        background-color: #f5f7fa;
      }
      .el-checkbox {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      ::v-deep .el-checkbox__label {
        display: flex;
        align-items: flex-end;
      }
    }
  }
  .menu_right {
    width: 50%;
    box-sizing: border-box;
    overflow-y: auto;
    .right_menu {
      .menu_item {
        display: flex;
        line-height: 32px;
        height: 32px;
        color: #222222;
        align-items: center;
        padding: 0 20px;
        .close_icon {
          cursor: pointer;
        }
        .item_icon {
          color: #294a7b;
        }
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  .title {
    margin-bottom: 20px;
    color: #909399;
  }
}
.xfo-btn {
  display: flex;
  justify-content: flex-end;
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
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
