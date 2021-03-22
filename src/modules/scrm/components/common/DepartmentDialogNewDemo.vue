<template>
  <!-- 选择目标成员树，支持无限层级 -->
  <!-- 
  使用说明--阿佛
  <department-dialog 
  :config="dialogVisible" 
  @closeDialog="dialogVisible.visible = false"
  :selectedList="memberList"
  ref="department"
  @handleConfirm="setMembers"
  >
  </department-dialog>
    1.0  对话框配置 可选
    dialogVisible: {
      width: '800px',  对话框宽度，默认600px
      title: '选择目标成员',  对话框标题，默认选择目标成员
      visible: false ， 对话框是否开启，默认不开启
    },

    2.0  关闭对话框的布尔值 必选
    dialogVisible.visible = false

    3.0  选中列表 可选，但是再次打开的时候不会选中已选中的数据
    memberList:
    [{
      id:'123',
      name:'张三'
    }]

    4.0 提交函数 必选
    setMembers(list) {} 返回值为选中的数据数组 
    返回值
    [{
      id: "f8a8112b926446f398f58edbd421c003"  数据id值
      myId: "0-0-0-0"                         树id值
      name: "伍"                              成员/部门名称
      type: 0                                 0 成员 1 部门                              
      userId: "Wu"                            
    }]
    
 -->
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
  title: '选择目标成员', // 标题
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
        console.log(res)
        tree.forEach((item) => {
          // if (item.userList) {
          //   item.childs.unshift({ id: 1, name: '成员', userList: item.userList, disabled: true })
          // }
          if (item.userList) {
            item.userList.forEach((name) => {
              item.childs.unshift(name)
            })
          }
        })
        this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        // 设置企业的唯一id
        this.setMyId(this.treeMenu, 0)
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
        this.ergodicTreeMenu(this.treeMenu, thisData, isSelect)
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
        this.formatData(this.treeMenu, item)
      })
    },
    // 设置唯一id
    setMyId(options, myId) {
      options.forEach((item, index) => {
        item.myId = `${myId}-${index}`
        if (!item.childs) {
          return
        } else {
          this.setMyId(item.childs, item.myId)
        }
      })
    },
    // 遍历树节点
    ergodicTreeMenu(options, option, isSelect) {
      options.forEach((value, index) => {
        if (value.id == option.id) {
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
              if (item.id == option.id) {
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
        if (!value.childs) {
          return
        } else {
          this.ergodicTreeMenu(value.childs, option, isSelect)
        }
      })
    },
    // 格式化接口
    formatData(options, option) {
      options.forEach((item, index) => {
        if (item.id == option.id && item.parentId) {
          // 判断是否为企业
          this.setCheckedNodesArr.push(item.myId)
          this.setCheckedNodesArrInfo.push({
            id: item.id,
            myId: item.myId,
            name: item.name,
            type: 1
          })
        } else if (item.id == option.id && !item.parentId) {
          this.setCheckedNodesArr.push(item.myId)
          this.setCheckedNodesArrInfo.push({
            id: item.id,
            myId: item.myId,
            name: item.name,
            type: 0
          })
        }
        if (!item.childs) {
          return
        } else {
          this.formatData(item.childs, option)
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
