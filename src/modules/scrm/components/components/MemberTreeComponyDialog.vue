<template>
  <!-- 选择目标成员树，支持无限层级 -->
  <!-- 参考示例“欢迎语”，地址:http://localhost:8082/#/main/scrm/operation-management/welcomemessage/details -->
  <!-- 
  使用说明--xfo 著
  <MemberTreeDialog
  :config="dialogVisible" 
  @closeDialog="dialogVisible.visible = false"
  :selectedList="memberList"
  @handleConfirm="setMembers"
  >
  </MemberTreeDialog>
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
  <div>
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
        <!-- <div class="title_left">组织架构</div> -->
        <div class="title_left">
          <div class="title_search">
            <el-input placeholder="请输入成员/部门名称" v-model="filterText" prefix-icon="el-icon-search" size="small">
            </el-input>
          </div>
          <div class="add_member">
            <el-button @click="synchro" size="small" plain :disabled="isLoading">同步</el-button>
          </div>
        </div>
        <div class="title_right">已选择的成员({{ selectedMenu.length }})</div>
      </div>
      <div class="tree_menu" v-loading="isLoading">
        <!-- 组织架构 -->
        <div class="menu_left">
          <div class="left_tree" v-if="sysUserList.length > 0">
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
              :filter-node-method="filterNode"
              @check="getCheckedNodes"
            >
            </el-tree>
          </div>
          <div class="empty-status" v-else>
            <img class="empty-cover" :src="`${imgHost}/attachments/scrm/8406784852164c0d8e30767c2b5b003d.png`" />
            <p class="empty-tips">您未设置使用系统成员<br>请前往【通讯录】-【设定系统使用成员】设置</p>
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
        <el-button type="text" @click="configureWhatToAdd.visible = true" style="margin-right: auto"
          >成员使用权限设置说明</el-button
        >
        <el-button @click="closeDialog" plain>取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <WhatToAdd :configure="configureWhatToAdd" @closeDialog="closeWhatToAdd" @success="successWhatToAdd"></WhatToAdd>
  </div>
</template>
<script>
const dialogConfig = {
  width: '600px', // 宽度
  title: '选择目标成员', // 标题
  visible: false // 对话框开关
}
import WhatToAdd from './WhatToAdd'
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
    },
    // 选择列表接口
    api: {
      type: String,
      default: 'getWxCropDeptAppUserTrees'
    }
  },
  components: {
    WhatToAdd
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
      apiIsHas: false,
      // 节点过滤
      filterText: '',
      // 成员使用权限设置说明
      configureWhatToAdd: {
        title: '成员使用权限设置说明',
        visible: false
      },
      // 同步加载
      isLoading: false,
      sysUserList: [], // 拥有系统使用权限的成员列表
    }
  },
  created() {
    this.getDepartmentTree()
    this.getSysUserList()
  },
  watch: {
    'config.visible': function (a, b) {
      if (a) {
        this.setDefaultCheckedKeys()
        // 清除搜索关键词
        this.filterText = ''
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 成员使用权限设置说明
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    // 数据同步
    synchro() {
      // 清除搜索关键词
      this.isLoading = true
      this.$http.syncCustomerList().then(() => {
        this.getDepartmentTree(res => {
          this.selectedMenu = []
          this.setCheckedNodesArr = []
          this.setCheckedNodesArrInfo = []
          this.defaultCheckedKeys = []
          // 判断是修改还是删除
          if (this.selectedList.length != 0) {
            this.setDefaultCheckedKeys()
          }
          this.isLoading = false
        })
      })
      .catch(() => {
        this.isLoading = false
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.setOldSelect()
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      console.log('拥有系统使用权限的成员', this.sysUserList)
      console.log('已勾选的成员', this.selectedMenu)
      this.outsideList = []
      for (let i = 0; i < this.selectedMenu.length; i++) {
        let item = this.selectedMenu[i]
        let flag = false
        for (let j = 0; j < this.sysUserList.length; j++) {
          let obj = this.sysUserList[j]
          // deptName存在或者deptId存在或者type == 1说明此选项为部门，无需判断
          if (item.id === obj.id || item.userId === obj.id || item.deptName !== '' || item.deptId !== '' || item.type == 1) {
            flag = true
            break
          } else {
            flag = false
          }
        }
        if (!flag) {
          this.$set(this.selectedMenu[i], 'isExsist', false)
          this.outsideList.push(item)
        }
      }
      console.log('不在结构树中的成员列表', this.outsideList)
      if (this.outsideList.length > 0) {
        this.$message.warning('已选成员未设置使用系统权限，请重新关联成员或设置使用系统成员权限')
        return
      }
      this.$emit('handleConfirm', this.selectedMenu)
    },
    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的name相同说明是匹配到了
      if (data.name.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.name.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没有匹配到返回false
      return false
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
      arr.forEach(t => {
        this.setCheckedNodesArrInfo.splice(t, 1)
      })
    },
    // 设置节点默认选中
    setDefaultCheckedKeys() {
      console.log(this.selectedList)
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
    getDepartmentTree(callback) {
      // 全部成员
      // this.$http.getDepartmentTree().then((res) => {
      // 获取设定使用系统成员
      // this.$http.getWxCropDeptAppUserTrees().then(res => {
      this.$http[this.api]().then(res => {
        this.treeMenu = res.data.data
        // tree.forEach((item) => {
        //   if (!item.childs) {
        //     this.$set(item, 'childs', [])
        //   }
        //   if (item.userList.length > 0) {
        //     for (var i = item.userList.length - 1; i >= 0; i--) {
        //       item.childs.unshift(item.userList[i])
        //     }
        //   }
        // })
        // this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        this.setTreeData(this.treeMenu)
        // 设置企业的唯一id
        this.setMyId(this.treeMenu, 0)
        if (callback) {
          callback(res)
        }
      })
    },
    // 处理树联动选中
    getCheckedNodes(thisData, allData) {
      console.log(thisData, allData)
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
        hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
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
    // 设置数据
    setTreeData(options) {
      options.forEach(item => {
        if (!item.childs) {
          this.$set(item, 'childs', [])
        }
        if (item.userList && item.userList.length > 0) {
          for (var i = item.userList.length - 1; i >= 0; i--) {
            item.childs.unshift(item.userList[i])
          }
        }
        if (item.childs.length == 0) {
          return
        } else {
          this.setTreeData(item.childs)
        }
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
        if (item.id == option.userId && item.parentId) {
          // 判断是否为企业
          this.setCheckedNodesArr.push(item.myId)
          this.setCheckedNodesArrInfo.push({
            id: item.id,
            myId: item.myId,
            name: item.name,
            type: 1
          })
        } else if (item.id == option.userId && !item.parentId) {
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
    },
    getSysUserList() {
      this.$http.RoleAssociatedMember().then(res => {
        this.sysUserList = res.data.data
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
    ::v-deep .el-tree-node__content {
      height: 32px;
    }
    .empty-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 20px;
      margin-top: 100px;
      .empty-cover {
        width: 120px;
      }
      .empty-tips {
        margin-top: 20px;
        line-height: 20px;
        text-align: center;
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
