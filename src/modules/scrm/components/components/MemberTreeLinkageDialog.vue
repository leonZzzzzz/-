<template>
  <!-- 选择目标成员树，支持无限层级，勾选部门可选择部门下的所有成员,应用页面"渠道活码"选择多人 -->
  <!-- 
  使用说明
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

    3.0  选中列表
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
      @close="closeDialog"
    >
      <div class="tree_title">
        <div class="title_left">
          <div class="title_search">
            <el-input size="small" placeholder="请输入成员/部门名称" v-model="filterText">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="add_member">
            <el-button size="small" plain :disabled="isLoading" @click="dataSync">同步</el-button>
          </div>
        </div>
        <div class="title_right" v-if="peopleNum.appId">
          可设置{{ peopleNum.volume }}人，已选择成员{{ selectedMenu.length }}人
        </div>
        <div class="title_right" v-else>已选择成员{{ selectedMenu.length }}人</div>
      </div>
      <div class="tree_menu" v-loading="isLoading">
        <!-- 组织架构 -->
        <div class="menu_left">
          <div class="left_tree" v-if="sysUserList.length > 0 || peopleNum.appId">
            <el-tree
              :data="treeMenu"
              show-checkbox
              default-expand-all
              node-key="myId"
              ref="linkageTree"
              :props="defaultProps"
              :highlight-current="true"
              @check="getCheckedNodes"
              @check-change="getCurrentNode"
              :filter-node-method="filterNode"
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
              <span v-if="item.isDeleted || (!item.name && !item.userName)" style="color: #C0C4CC;">
                <i class="item_icon el-icon-s-custom" style="color: #C0C4CC;"></i>
                {{ item.name || item.userName }}
                <el-tooltip
                  effect="dark"
                  placement="top-start"
                  content="该成员可能已经离职，建议移除"
                >
                  <i class="el-icon-question" style="color: #000000;"></i>
                </el-tooltip>
              </span>
              <span v-else-if="item.isExsist == false" style="color: #ff0000;">
                <i class="item_icon el-icon-s-custom" style="color: #ff0000;"></i>
                {{ item.name || item.userName }}
              </span>
              <span v-else>
                <i class="item_icon el-icon-s-custom"></i>
                {{ item.name || item.userName }}
              </span>
              <el-button type="text" icon="el-icon-close" @click="delSetCheckedNodesArrFun(item)"></el-button>
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
    <!-- 联系客服弹窗 -->
    <ContactUsDialog :visible="serviceDialog.visible" @closeDialog="serviceDialog.visible = false"></ContactUsDialog>
  </div>
</template>

<script>
const dialogConfig = {
  width: '600px', // 宽度
  title: '选择目标成员', // 标题
  visible: false // 对话框开关
}
import WhatToAdd from './WhatToAdd'
import ContactUsDialog from './ContactUsDialog'
export default {
  components: { WhatToAdd, ContactUsDialog },
  props: {
    // 基本配置信息
    config: {
      type: Object,
      default: () => {
        return dialogConfig
      }
    },
    // 选择列表接口
    api: {
      type: String,
      default: 'getWxCropDeptAppUserTrees'
    },
    // 传入的值
    selectedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: Object,
      default: () => {
        return {}
      }
    },
    peopleNum: {
      type: Object,
      default: () => {
        return {}
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
      selectedMenu: [], // 选中后返回的列表，已去重
      treeList: [], // tree转array返回的列表
      currentSelected: [], // 树形结构里面所有选中的值，包括重复的对象
      filterText: '', // 筛选的关键词
      configureWhatToAdd: {
        // 成员使用权限设置说明
        title: '成员使用权限设置说明',
        visible: false
      },
      isLoading: false,
      sysUserList: [], // 拥有系统使用权限的成员列表
      serviceDialog: {
        visible: false
      },
      outsideList: [], // 不在系统权限中的成员
    }
  },
  created() {
    this.getDepartmentTree()
    this.getSysUserList()
  },
  watch: {
    'config.visible': function (a, b) {
      if (a) {
        this.$nextTick(() => {
          if (this.type.type && this.type.type == 'member') {
            // 获取已勾选成员
            this.selectedList = []
            this.$http.setReadyUserMember({ roleId: this.type.id }).then(res => {
              if (res.data.data.length > 0) {
                res.data.data.forEach(item => {
                  var list = { name: '', userId: item, id: '' }
                  this.selectedList.push(list)
                })
              }
              this.setCheckedNodes()
            })
          } else {
            this.setCheckedNodes()
          }
        })
        // 清除筛选关键词
        this.filterText = ''
      }
    },
    filterText(val) {
      this.$refs.linkageTree.filter(val)
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 确认提交
    handleConfirm() {
      // 当成员角色打开此弹窗点击确定时，运行这个接口，其他页面打开直接handleConfirm传参
      var userIds = []
      this.selectedMenu.forEach(item => {
        userIds.push(item.userId)
      })
      if (this.type.type == 'member') {
        if (this.selectedMenu.length > this.peopleNum.volume) {
          return this.$message.warning(`目前系统限制人数为${this.peopleNum.volume},请重新选择`)
        }
        this.$http.setUpUserMember({ userIds, roleId: this.type.id }).then(res => {
          this.$message.success('设置成员成功')
        })
      }
      if (this.type.type == 'userp') {
        if (this.selectedMenu.length > this.peopleNum.volume) {
          // return this.$message.warning(`目前系统限制人数为${this.peopleNum.volume},请重新选择`)
          const message = this.$message({
            dangerouslyUseHTMLString: true,
            message: '<p>当前账号可使用系统上限为' + this.peopleNum.volume + '人，如需扩展请<span style="color:#0066ff;cursor:pointer">联系客服</span></p>',
            type: 'warning',
          });
          message.$el.querySelector('span').onclick = () => {
            this.openServiceDialog()
            message.close();
          };
          return
        }
        userIds = userIds.join(',')
        this.$http.AddPermissionUser({ userIds }).then(res => {
          this.$message.success('设置成员成功')
        })
      }
      if (this.type.type && (this.type.type == 'userp' || this.type.type == 'member')) {
        // 暂无处理
      } else {
        console.log('拥有系统使用权限的成员', this.sysUserList)
        console.log('已勾选的成员', this.selectedMenu)
        this.outsideList = []
        for (let i = 0; i < this.selectedMenu.length; i++) {
          let item = this.selectedMenu[i]
          let flag = false
          for (let j = 0; j < this.sysUserList.length; j++) {
            let obj = this.sysUserList[j]
            if (item.id === obj.id || item.userId === obj.id || item.userId === obj.userId) {
              flag = true
              break
            } else {
              flag = false
            }
          }
          if (!flag) {
            this.$set(this.selectedMenu[i], 'isExsist', false)
            // this.selectedMenu[i].isExsist = false
            this.outsideList.push(item)
          }
        }
        console.log('不在权限列表的成员', this.outsideList)
      }
      if (this.outsideList.length > 0) {
        this.$message.warning('已选成员未设置使用系统权限，请重新关联成员或设置使用系统成员权限')
        return
      }
      this.$emit('handleConfirm', this.selectedMenu, this.type.type)
    },
    // 获取企业组织结构树
    getDepartmentTree(callback) {
      this.$http[this.api]().then(res => {
        this.treeMenu = res.data.data
        // tree.forEach((item) => {
        //   // if (item.userList) {
        //   //   item.childs.unshift({ id: 1, name: '成员', userList: item.userList })
        //   // }
        //   if (!item.childs) {
        //     this.$set(item, 'childs', [])
        //   }
        //   if (item.userList.length > 0) {
        //     for (let i = item.userList.length - 1; i >= 0; i--) {
        //       let obj = item.userList[i]
        //       item.childs.unshift(obj)
        //     }
        //     // item.userList.forEach((name) => {
        //     //   item.childs.unshift(name)
        //     // })
        //   }
        // })
        // this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
        // 设置企业的唯一id
        this.setTreeData(this.treeMenu)
        this.setMyId(this.treeMenu, 0)
        if (callback) {
          callback(res)
        }
      })
    },
    // 设置唯一id
    // setMyId(options, myId) {
    //   options.forEach((item, index) => {
    //     item.myId = `${myId}-${index}`
    //     this.treeList.push(item)
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.setMyId(item.childs, item.myId)
    //     }
    //   })
    // },
    // 设置唯一id
    setMyId(options, myId) {
      options.forEach((item, index) => {
        item.myId = `${myId}-${index}`
        // 父节点下无成员数据不可选中
        if (item.parentId && item.childs.length <= 0) {
          item.disabled = true
        }
        this.treeList.push(item)
        if (!item.childs) {
          return
        } else {
          this.setMyId(item.childs, item.myId)
        }
      })
    },
    // 设置默认选中的节点
    setCheckedNodes() {
      this.currentSelected = []
      this.selectedMenu = [].concat(this.selectedList)
      this.selectedMenu.forEach(item => {
        this.treeList.forEach(obj => {
          if (this.type.type && (this.type.type == 'userp' || this.type.type == 'member' || this.type.type == 'roleManager')) {
            if (item.userId === obj.userId) {
              item.name = obj.name
              this.currentSelected.push(obj)
            }
          } else {
            if (item.id === obj.id || item.userId === obj.id) {
              this.currentSelected.push(obj)
            }
          }
        })
      })
      this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
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
    // 获取选择的节点
    getCheckedNodes() {
      this.$nextTick(() => {
        let list = this.$refs.linkageTree.getCheckedNodes()
        let arr = []
        list.forEach(item => {
          if (item.userId) {
            var list = { avatar: item.avatar, name: item.name, userId: item.userId, id: item.id }
            arr.push(list)
          }
        })
        // 去重
        let hash = {}
        let newArr = arr.reduce((item, next) => {
          hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
          return item
        }, [])
        this.selectedMenu = newArr
      })
    },
    // 获取当前选中的节点
    getCurrentNode(node, isChecked) {
      let list = [].concat(this.currentSelected)
      // 节点是否被选中
      if (isChecked) {
        this.treeList.forEach(obj => {
          if (node.id === obj.id && !node.parentId) {
            this.currentSelected.push(obj)
          }
        })
      } else {
        list.forEach((item, index) => {
          if (item.id === node.id) {
            this.currentSelected.splice(
              this.currentSelected.findIndex(item => item.id === node.id),
              1
            )
          }
        })
      }
      // console.log('已选的成员数', this.currentSelected.length, this.currentSelected)
      this.$nextTick(() => {
        this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
      })
    },
    // 删除已选中成员
    delSetCheckedNodesArrFun(item) {
      // 从左边的结构树中删去已中的成员
      let list = [].concat(this.currentSelected)
      list.forEach((obj, idx) => {
        if (this.type.type && (this.type.type == 'userp' || this.type.type == 'member' || this.type.type == 'roleManager')) {
          if (obj.userId == item.userId) {
            this.currentSelected.splice(
              this.currentSelected.findIndex(obj => obj.userId === item.userId),
              1
            )
          }
        } else {
          if (obj.id === item.id) {
            this.currentSelected.splice(
              this.currentSelected.findIndex(obj => obj.id === item.id),
              1
            )
            // console.log('删除', this.currentSelected.length, this.currentSelected)
          }
        }
      })
      // 从右边已选中的成员列表中删去
      let arrList = [].concat(this.selectedMenu)
      arrList.forEach((obj, idx) => {
        if (this.type.type && (this.type.type == 'userp' || this.type.type == 'member' || this.type.type == 'roleManager')) {
          if (obj.userId === item.userId) {
            this.selectedMenu.splice(
              this.selectedMenu.findIndex(obj => obj.userId === item.userId),
              1
            )
          }
        } else {
          if (obj.id === item.id) {
            this.selectedMenu.splice(
              this.selectedMenu.findIndex(obj => obj.id === item.id),
              1
            )
          }
        }
      })
      this.$nextTick(() => {
        this.$refs.linkageTree.setCheckedNodes(this.currentSelected)
      })
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
    // 成员使用权限设置说明
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    // 同步数据
    dataSync() {
      this.isLoading = true
      this.$http.syncCustomerList().then(() => {
        this.treeList = []
        this.selectedMenu = []
        this.currentSelected = []
        this.filterText = ''
        this.getDepartmentTree(res => {
          this.$nextTick(() => {
            this.setCheckedNodes()
          })
          this.isLoading = false
        })
      })
      .catch(() => {
        this.isLoading = false
      })
    },
    getSysUserList() {
      this.$http.RoleAssociatedMember().then(res => {
        this.sysUserList = res.data.data
      })
    },
    openServiceDialog() {
      this.serviceDialog.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_title {
  display: flex;
  align-items: center;
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
