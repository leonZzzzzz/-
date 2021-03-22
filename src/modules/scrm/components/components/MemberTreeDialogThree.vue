<template>
  <!-- 成员树 部门与成员分开选择 需要接口对type进行上传 只支持三级 -->
  <el-dialog
    :title="config.title"
    :visible="config.visible"
    :width="config.width"
    :close-on-click-modal="false"
    append-to-body
    :show-close="true"
    :before-close="setOldSelect"
    @close="closeDialog"
  >
    <div class="tree_title">
      <div class="title_left">组织架构</div>
      <div class="title_right">已选择的成员</div>
    </div>
    <div class="tree_menu">
      <!-- 组织架构 -->
      <div class="menu_left">
        <div class="left_tree">
          <el-tree
            :data="treeMenu"
            show-checkbox
            default-expand-all
            node-key="myId"
            ref="tree"
            :props="defaultProps"
            :check-strictly="true"
            :highlight-current="true"
            :default-checked-keys="defaultCheckedKeys"
            @check="getCheckedNodes"
          >
          </el-tree>
        </div>
      </div>
      <!-- 已选择的成员 -->
      <div class="menu_right">
        <div class="right_menu">
          <div class="menu_item" v-for="(item, index) in selectedMenu" :key="index">
            <span>
              <i class="item_icon el-icon-s-custom"></i>
              {{ item.name }}
            </span>
            <el-button type="text" icon="el-icon-close" @click="delSetCheckedNodesArrFun(item, index)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer_btns">
      <el-button @click="closeDialog" plain>取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
const dialogConfig = {
  width: '600px', // 宽度
  title: '', // 标题
  visible: false // 对话框开关
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
      // 成员树数据
      treeMenu: [],
      // 设置节点名称
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      selectedMenu: [],
      setCheckedNodesArr: [],
      setCheckedNodesArrInfo: [],
      // 默认选中的值 myId
      defaultCheckedKeys: [],
      // 接口是否已经获取到值
      apiIsHas: false
    }
  },
  created() {
    this.getDepartmentTree()
  },
  watch: {
    'config.visible': function(a, b) {
      if (a) {
        this.setDefaultCheckedKeys()
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.setOldSelect()
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      this.$emit('handleConfirm', this.selectedMenu)
    },
    // 删除已选中成员
    delSetCheckedNodesArrFun(a, b) {
      // 要删除对象的下标数组
      let arr = []
      this.selectedMenu.splice(b, 1)
      this.setCheckedNodesArrInfo.forEach((item, index) => {
        if (item.id == a.id) {
          let arrIndex = this.setCheckedNodesArr.indexOf(item.myId)
          this.setCheckedNodesArr.splice(arrIndex, 1)
          arr.push(arrIndex)
          // 重新赋值
          this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
        }
      })
      arr.forEach((t) => {
        this.setCheckedNodesArrInfo.splice(t, 1)
      })
    },
    // 设置节点默认选中
    setDefaultCheckedKeys() {
      // 如果存在该值，表示是当前在当前页面操作，未通过接口
      if (this.selectedList.defaultCheckedKeys) {
        console.log(this.selectedList)
        this.defaultCheckedKeys = this.selectedList.defaultCheckedKeys
        return
      }
      this.getApiDataToNewData()
      this.defaultCheckedKeys = this.setCheckedNodesArr
      this.selectedMenu = this.selectedList.concat()
    },
    // 关闭弹窗重新选中旧元素
    setOldSelect(done) {
      this.setCheckedNodesArr = []
      this.setCheckedNodesArrInfo = []
      this.getApiDataToNewData()
      this.selectedMenu = this.selectedList.concat()
      // 手动选中相同的所有节点
      this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
      // 关闭弹窗
      if (done) {
        done()
      }
    },
    // 获取成员树数据
    getDepartmentTree() {
      this.$http.getDepartmentTree().then((res) => {
        let tree = res.data.data
        tree.forEach((item) => {
          if (item.userList) {
            item.childs.unshift({ id: 1, name: '成员', userList: item.userList, disabled: true })
          }
        })
        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        // 设置企业的唯一id
        this.treeMenu[0].myId = 'company'
        this.treeMenu[0].childs.forEach((item, index) => {
          // 设置部门的唯一id
          item.myId = `p-${index}`
          item.childs.forEach((value, num) => {
            // 设置成员的唯一id
            value.myId = `${index}-${num}`
          })
        })
      })
    },
    // 处理树联动选中
    getCheckedNodes(thisData, allData) {
      // 当前选中的列表
      let list = this.$refs.tree.getCheckedNodes()
      // 判断当前点击的是否被选中
      let isSelect = allData.checkedKeys.includes(thisData.myId)
      // 判断是否为成员节点
      // 存在parentId则不为成员节点
      if (thisData.parentId) {
        if (isSelect) {
          this.setCheckedNodesArr.push(thisData.myId)
          this.setCheckedNodesArrInfo.push({
            id: thisData.id,
            myId: thisData.myId,
            name: thisData.name,
            type: 1
          })
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
      } else {
        // 对树节点进行遍历
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
                    userId: value.userId,
                    type: 0
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
      }
      // 手动选中相同的所有节点
      this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
      // 去重，获取显示列表
      let hash = {}
      let memberListResults = this.setCheckedNodesArrInfo.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
        return item
      }, [])
      // 赋值返回值
      memberListResults.defaultCheckedKeys = allData.checkedKeys
      this.selectedMenu = memberListResults
    },
    // 格式化接口数据
    getApiDataToNewData() {
      // 接口数据需要重新进行遍历赋值
      this.selectedList.forEach((item, index) => {
        if (this.treeMenu[0].id == item.id) {
          // 判断是否为企业
          this.setCheckedNodesArr.push(this.treeMenu[0].myId)
          this.setCheckedNodesArrInfo.push({
            id: this.treeMenu[0].id,
            myId: this.treeMenu[0].myId,
            name: this.treeMenu[0].name,
            type: 1
          })
          return
        } else {
          // 判断是否为部门
          this.treeMenu[0].childs.forEach((m, n) => {
            if (m.id == item.id) {
              this.setCheckedNodesArr.push(this.treeMenu[0].childs[n].myId)
              this.setCheckedNodesArrInfo.push({
                id: this.treeMenu[0].childs[n].id,
                myId: this.treeMenu[0].childs[n].myId,
                name: this.treeMenu[0].childs[n].name,
                type: 1
              })
              return
            }
            // 判断为哪一个成员
            m.childs.forEach((x, y) => {
              if (x.id == item.id) {
                this.setCheckedNodesArr.push(this.treeMenu[0].childs[n].childs[y].myId)
                this.setCheckedNodesArrInfo.push({
                  id: this.treeMenu[0].childs[n].childs[y].id,
                  myId: this.treeMenu[0].childs[n].childs[y].myId,
                  name: this.treeMenu[0].childs[n].childs[y].name,
                  type: 0
                })
              }
            })
          })
        }
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
    ::v-deep .el-tree-node__content {
      height: 32px;
    }
  }
  .menu_right {
    width: 50%;
    box-sizing: border-box;
    overflow-y: auto;
    .right_menu {
      .menu_item {
        display: flex;
        justify-content: space-between;
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
.footer_btns {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
// 格式化对话框样式
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
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
