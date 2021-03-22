<template>
  <!-- 此组件已舍弃，相应组件已迁移至目录scrm/components/components -->
  <el-dialog
    :title="config.title"
    :visible="config.visible"
    :width="config.width"
    :close-on-click-modal="false"
    append-to-body
    @close="closeDialog"
  >
    <div class="tree-menu">
      <div class="menu-left">
        <div class="title">组织架构</div>
        <div class="left-tree">
          <el-tree
            :data="treeMenu"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check-change="getCheckedNodes"
          >
          </el-tree>
        </div>
      </div>
      <div class="menu-right">
        <div class="title">已选择的成员</div>
        <div class="right-menu">
          <div class="menu-item" v-for="(item, index) in selectedMenu" :key="index">
            <span>
              <i class="item-icon el-icon-s-custom"></i>
              {{ item.name }}
            </span>
            <!-- <i class="el-icon-close close-icon" @click="cancelSelect(item)"></i> -->
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
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
const dialogConfig = {
  width: '600px', // 宽度
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
    },
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      treeMenu: [],
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      selectedMenu: []
    }
  },
  created() {
    this.getDepartmentTree()
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      this.$emit('handleConfirm', this.selectedMenu)
    },
    setCheckedNodes() {
      // console.log('设置选项')
      this.selectedMenu = this.selectedList
      this.$refs.tree.setCheckedNodes(this.selectedMenu)
    },
    getDepartmentTree() {
      this.$http.getDepartmentTree().then((res) => {
        let tree = res.data.data
        tree.forEach((item) => {
          if (item.userList) {
            item.childs.unshift({ id: 1, name: '成员', userList: item.userList })
          }
        })
        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
      })
    },
    // getCheckedNodes() {
    //   let list = this.$refs.tree.getCheckedNodes()
    //   let arr = []
    //   list.forEach(item => {
    //     if (item.userId) {
    //       arr.push(item)
    //     }
    //   })
    //   this.selectedMenu = arr
    //   // console.log(this.$refs.tree.getCheckedNodes());
    // },
    getCheckedNodes() {
      let list = this.$refs.tree.getCheckedNodes()
      let arr = []
      list.forEach((item) => {
        if (item.userId) {
          arr.push(item)
        }
      })
      // 去重
      let hash = {}
      let newArr = arr.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
        return item
      }, [])
      // console.log(newArr)
      this.selectedMenu = newArr
      // console.log(this.$refs.tree.getCheckedNodes());
    },
    // cancelSelect(index) {
    //   this.selectedMenu.splice(index, 1)
    //   this.$refs.tree.setCheckedNodes(this.selectedMenu)
    // }
    cancelSelect(obj) {
      // 当前已选中的则取消选择
      if (this.selectedMenu.some((item) => item.id === obj.id)) {
        this.selectedMenu.splice(
          this.selectedMenu.findIndex((item) => item.id === obj.id),
          1
        )
      }
      this.$refs.tree.setCheckedNodes([])
      // this.$refs.tree.setCheckedNodes(this.selectedMenu)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-menu {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  height: 500px;
  overflow-y: auto;
  .menu-left {
    flex: 1;
    border-right: 1px solid #dcdfe6;
    margin-right: 20px;
  }
  .menu-right {
    flex: 1;
    .right-menu {
      .menu-item {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        color: #222222;
        max-width: 200px;
        align-items: center;
        .close-icon {
          cursor: pointer;
        }
        .item-icon {
          color: #294a7b;
        }
      }
    }
  }
  .title {
    margin-bottom: 20px;
    color: #909399;
  }
}
.dialog-footer {
  display: flex;
  // flex-flow: column-reverse;
  justify-content: flex-end;
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
