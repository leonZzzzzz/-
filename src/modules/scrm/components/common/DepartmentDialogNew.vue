<template>
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
            node-key="myId"
            ref="tree"
            :props="defaultProps"
            :check-strictly="true"
            :highlight-current="true"
            @check="getCheckedNodes"
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
          </div>
        </div>
      </div>
    </div>
    <div class="footer_btns">
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
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
    // 基本配置信息
    config: {
      type: Object,
      default: () => {
        return dialogConfig
      }
    },
    // 传入的值
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
      selectedMenu: [],
      setCheckedNodesArr: [],
      setCheckedNodesArrInfo: [],
      selectAll: false,
      selectDepartment: []
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
        this.treeMenu[0].childs.forEach((item, index) => {
          item.childs.forEach((value, num) => {
            value.myId = `${index}-${num}`
          })
        })
      })
    },
    getCheckedNodes() {
      let list = this.$refs.tree.getCheckedNodes()
      let arr = []
      list.forEach((item) => {
        if (item.userId) {
          arr.push(item)
        }
      })
      this.selectedMenu = arr
    },
    getCheckedNodes(thisData, allData) {
      let list = this.$refs.tree.getCheckedNodes()
      let isSelect = allData.checkedKeys.includes(thisData.myId)
      this.treeMenu[0].childs.forEach((item, index) => {
        item.childs.forEach((value, num) => {
          if (thisData.id == value.id) {
            if (isSelect) {
              if (!this.setCheckedNodesArr.includes(value.myId)) {
                this.setCheckedNodesArr.push(value.myId)
                this.setCheckedNodesArrInfo.push({
                  id: value.id,
                  myId: value.myId,
                  name: value.name,
                  userId: value.userId
                })
              }
            } else {
              this.setCheckedNodesArrInfo.forEach((item, index) => {
                if (item.id == thisData.id) {
                  let arrIndex = this.setCheckedNodesArr.indexOf(item.myId)
                  if (arrIndex == -1) {
                    return
                  }
                  this.setCheckedNodesArr.splice(arrIndex, 1)
                  this.setCheckedNodesArrInfo.splice(index, 1)
                }
              })
            }
          }
        })
      })
      this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
      let arr = []
      list.forEach((item) => {
        if (item.userId) {
          arr.push(item)
        }
      })
      // 去重
      let hash = {}
      let newArr = this.setCheckedNodesArrInfo.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
        return item
      }, [])
      this.selectedMenu = newArr
      console.log(newArr)
    },
    cancelSelect(obj) {
      // 当前已选中的则取消选择
      if (this.selectedMenu.some((item) => item.id === obj.id)) {
        this.selectedMenu.splice(
          this.selectedMenu.findIndex((item) => item.id === obj.id),
          1
        )
      }
      this.$refs.tree.setCheckedNodes([])
    }
  }
}

// 注释的为选中父节点选中所有子节点，不需要则可以注释
// if (thisData.parentId == 0 || thisData.id == 1) {
//   // 选择取消所有
//   this.selectAll = !this.selectAll
//   if (this.selectAll) {
//     this.treeMenu[0].childs.forEach((item, index) => {
//       this.selectDepartment.push(item.name)
//       item.childs.forEach((value, num) => {
//         if (!this.setCheckedNodesArr.includes(value.myId)) {
//           this.setCheckedNodesArr.push(value.myId)
//           this.setCheckedNodesArrInfo.push({
//             id: value.id,
//             myId: value.myId,
//             name: value.name,
//             userId: value.userId
//           })
//         }
//       })
//     })
//   } else {
//     this.setCheckedNodesArr = []
//     this.setCheckedNodesArrInfo = []
//     this.selectDepartment = []
//   }
// } else if (thisData.parentId && thisData.parentId != 0) {
//   // 选择取消当前三级
//   let isSelect = this.selectDepartment.includes(thisData.name)
//   if (!isSelect) {
//     this.selectDepartment.push(thisData.name)
//     this.treeMenu[0].childs.forEach((item, index) => {
//       if (item.name == thisData.name) {
//         item.childs.forEach((value, num) => {
//           if (!this.setCheckedNodesArr.includes(value.myId)) {
//             this.setCheckedNodesArr.push(value.myId)
//             this.setCheckedNodesArrInfo.push({
//               id: value.id,
//               myId: value.myId,
//               name: value.name,
//               userId: value.userId
//             })
//           }
//         })
//       }
//     })
//     console.log('选中', this.setCheckedNodesArr)
//   } else {
//     let deleteIndex = this.selectDepartment.indexOf(thisData.name)
//     this.selectDepartment.splice(deleteIndex, 1)
//     this.treeMenu[0].childs.forEach((item, index) => {
//       if (item.name == thisData.name) {
//         item.childs.forEach((value, num) => {
//           console.log(value)
//           this.setCheckedNodesArr.forEach((delItem, delIndex) => {
//             if (value.myId == delItem) {
//               this.setCheckedNodesArr.splice(delIndex, 1)
//               this.setCheckedNodesArrInfo.splice(delIndex, 1)
//             }
//           })
//         })
//       }
//     })
//     console.log('取消', this.setCheckedNodesArr)
//   }
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
.footer_btns {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
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
</style>
