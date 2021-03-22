<!--zhw成员树正在完善的版本，请勿用-->
<template>
  <div class="tree-div">
    <div class="tree_title">
      <div class="title_left">
        <div class="title_search">
          <el-input placeholder="请输入成员/部门名称" v-model="filterText" size="small">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="add_member">
          <el-button type="text" @click="configureWhatToAdd.visible = true">如何添加新成员?</el-button>
        </div>
      </div>
      <div class="title_right">已选择成员({{ selectedMenu.length }})</div>
    </div>
    <div class="tree-div-box">
      <div class="tree">
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
      <div class="right-select">
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
    <WhatToAdd :configure="configureWhatToAdd" @closeDialog="closeWhatToAdd" @success="successWhatToAdd"></WhatToAdd>
  </div>
</template>

<script>
import WhatToAdd from './WhatToAdd'
export default {
  components: { WhatToAdd },
  props: {
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
      selectedMenu: [], // 选中后返回的列表，已去重
      treeList: [], // tree转array返回的列表
      currentSelected: [], // 树形结构里面所有选中的值，包括重复的对象
      filterText: '', // 筛选的关键词
      configureWhatToAdd: {
        // 如何添加新成员
        title: '如何添加新成员',
        visible: false
      }
      // treeMenu: [],
      // // 设置节点名称,常规操作一下
      // defaultProps: {
      //   children: 'childs',
      //   label: 'name'
      // },
      // selectedMenu: [],
      // // 默认选中的值 onlyId
      // defaultCheckedKeys: [],
      // setCheckedNodesArr: [],
      // setCheckedNodesArrInfo: [],
      // configureWhatToAdd: {
      //   // 如何添加新成员
      //   title: '如何添加新成员',
      //   visible: false
      // }
    }
  },
  watch: {
    // 'config.visible': function(a, b) {
    //   if (a) {
    //     this.$nextTick(() => {
    //       this.setCheckedNodes()
    //     })
    //   }
    // },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
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
    // 获取企业组织结构树
    getDepartmentTree() {
      this.$http.getDepartmentTree().then((res) => {
        let tree = res.data.data
        tree.forEach((item) => {
          // if (item.userList) {
          //   item.childs.unshift({ id: 1, name: '成员', userList: item.userList })
          // }
          if (item.userList.length > 0) {
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
    // 设置唯一id
    setMyId(options, myId) {
      options.forEach((item, index) => {
        item.myId = `${myId}-${index}`
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
      this.selectedMenu.forEach((item) => {
        this.treeList.forEach((obj) => {
          if (item.id === obj.id || item.userId === obj.id) {
            this.currentSelected.push(obj)
          }
        })
      })
      this.$refs.tree.setCheckedNodes(this.currentSelected)
    },
    // 获取选择的节点
    getCheckedNodes() {
      this.$nextTick(() => {
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
        this.selectedMenu = newArr
        this.$emit('getSelectedMenu', this.selectedMenu)
      })
    },
    // 获取当前选中的节点
    getCurrentNode(node, isChecked) {
      // console.log('当前选的节点', node, isChecked)
      let list = [].concat(this.currentSelected)
      // 节点是否被选中
      if (isChecked) {
        this.treeList.forEach((obj) => {
          if (node.id === obj.id && !node.parentId) {
            this.currentSelected.push(obj)
          }
        })
      } else {
        list.forEach((item, index) => {
          if (item.id === node.id) {
            this.currentSelected.splice(
              this.currentSelected.findIndex((item) => item.id === node.id),
              1
            )
          }
        })
      }
      // console.log('已选的成员数', this.currentSelected.length, this.currentSelected)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.currentSelected)
      })
    },
    // 删除已选中成员
    delSetCheckedNodesArrFun(item) {
      // 从左边的结构树中删去已中的成员
      let list = [].concat(this.currentSelected)
      list.forEach((obj, idx) => {
        if (obj.id === item.id) {
          this.currentSelected.splice(
            this.currentSelected.findIndex((obj) => obj.id === item.id),
            1
          )
          // console.log('删除', this.currentSelected.length, this.currentSelected)
        }
      })
      // 从右边已选中的成员列表中删去
      let arrList = [].concat(this.selectedMenu)
      arrList.forEach((obj, idx) => {
        if (obj.id === item.id) {
          this.selectedMenu.splice(
            this.selectedMenu.findIndex((obj) => obj.id === item.id),
            1
          )
        }
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.currentSelected)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      // 只过滤成员，不过滤部门
      // if (!data.parentId) {
      //   return data.name.includes(value);
      // }
      return data.name.includes(value)
    },
    // 如何添加新成员
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    }
    //函数方法开始
    // 设置唯一id
    // setMyId(options, onlyId) {
    //   options.forEach((item, index) => {
    //     item.onlyId = `${onlyId}-${index}`
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.setMyId(item.childs, item.onlyId)
    //     }
    //   })
    // },
    //删除已选的人员
    // delSetCheckedNodesArrFun(item, index) {},
    // // 节点过滤
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.name.indexOf(value) !== -1
    // },
    // //点击节点复选框(原先树结构的数据，调整的后选中的数据)
    // handleCheck(data, allData) {
    //   // 当前选中的列表
    //   let list = this.$refs.tree.getCheckedNodes()
    //   // 判断当前点击的是否被选中
    //   let isSelect = allData.checkedKeys.includes(data.onlyId)
    //   // 判断是否为成员节点
    //   // 存在parentId则不为成员节点
    //   if (data.parentId) {
    //     if (isSelect) {
    //       this.setCheckedNodesArr.push(data.onlyId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: data.id,
    //         onlyId: data.onlyId,
    //         name: data.name,
    //         type: 1
    //       })
    //     } else {
    //       this.setCheckedNodesArrInfo.forEach((item, index) => {
    //         if (item.id == data.id) {
    //           let arrIndex = this.setCheckedNodesArr.indexOf(item.onlyId)
    //           if (arrIndex == -1) {
    //             return
    //           }
    //           this.setCheckedNodesArr.splice(arrIndex, 1)
    //           this.setCheckedNodesArrInfo.splice(index, 1)
    //         }
    //       })
    //     }
    //   } else {
    //     // 对树节点进行遍历
    //     this.ergodicTreeMenu(this.treeMenu, data, isSelect)
    //   }
    //   // 手动选中相同的所有节点
    //   this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
    //   // 去重，获取显示列表
    //   let hash = {}
    //   let memberListResults = this.setCheckedNodesArrInfo.reduce((item, next) => {
    //     hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
    //     return item
    //   }, [])
    //   // 赋值返回值
    //   memberListResults.defaultCheckedKeys = data.checkedKeys
    //   this.selectedMenu = memberListResults
    // },
    // // 遍历树节点
    // ergodicTreeMenu(options, option, isSelect) {
    //   options.forEach((value, index) => {
    //     if (value.id == option.id) {
    //       if (isSelect) {
    //         if (!this.setCheckedNodesArr.includes(value.onlyId)) {
    //           this.setCheckedNodesArr.push(value.onlyId)
    //           this.setCheckedNodesArrInfo.push({
    //             id: value.id,
    //             onlyId: value.onlyId,
    //             name: value.name,
    //             userId: value.userId,
    //             type: 0
    //           })
    //         }
    //       } else {
    //         this.setCheckedNodesArrInfo.forEach((item, index) => {
    //           if (item.id == option.id) {
    //             let arrIndex = this.setCheckedNodesArr.indexOf(item.onlyId)
    //             if (arrIndex == -1) {
    //               return
    //             }
    //             this.setCheckedNodesArr.splice(arrIndex, 1)
    //             this.setCheckedNodesArrInfo.splice(index, 1)
    //           }
    //         })
    //       }
    //     }
    //     if (!value.childs) {
    //       return
    //     } else {
    //       this.ergodicTreeMenu(value.childs, option, isSelect)
    //     }
    //   })
    // },
    // // 如何添加新成员
    // closeWhatToAdd() {
    //   this.configureWhatToAdd.visible = false
    // },
    // successWhatToAdd() {
    //   this.configureWhatToAdd.visible = false
    // },
    // //函数方法结束
    // //接口方法开始
    // getDepartmentTree(callback) {
    //   this.$http.getDepartmentTree().then(res => {
    //     let tree = res.data.data
    //     //循环遍历一遍树形结构图
    //     tree.forEach(item => {
    //       //如果userList列表不为空
    //       if (item.userList) {
    //         //循环遍历userList数组
    //         item.userList.forEach(items => {
    //           //将里边得数据追加到数组得开头，并且返回一个新数组
    //           item.childs.unshift(items)
    //         })
    //       }
    //     })
    //     //将字符串转换为对象JSON.parse()
    //     //this.treeMenu数组 = JSON.parse(JSON.stringify(tree)将值转化为JSON值.replace('如果遇到是userList得参数值，就将这个参数值变换为childs'))
    //     this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
    //     console.log(this.treeMenu)
    //     this.setMyId(this.treeMenu, 0)
    //     if (callback) {
    //       callback(res)
    //     }
    //   })
    // },
    // // 设置唯一id
    // setMyId(options, onlyId) {
    //   options.forEach((item, index) => {
    //     item.onlyId = `${onlyId}-${index}`
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.setMyId(item.childs, item.onlyId)
    //     }
    //   })
    // },
    // // 格式化接口数据
    // getApiDataToNewData() {
    //   // 接口数据需要重新进行遍历赋值
    //   this.selectedList.forEach((item, index) => {
    //     this.formatData(this.treeMenu, item)
    //   })
    // },
    // // 格式化接口
    // formatData(options, option) {
    //   options.forEach((item, index) => {
    //     if (item.id == option.id && item.parentId) {
    //       // 判断是否为企业
    //       this.setCheckedNodesArr.push(item.onlyId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: item.id,
    //         onlyId: item.onlyId,
    //         name: item.name,
    //         type: 1
    //       })
    //     } else if (item.id == option.id && !item.parentId) {
    //       this.setCheckedNodesArr.push(item.onlyId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: item.id,
    //         onlyId: item.onlyId,
    //         name: item.name,
    //         type: 0
    //       })
    //     }
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.formatData(item.childs, option)
    //     }
    //   })
    // }
    //接口方法结束
  },
  created() {
    this.getDepartmentTree()
  }
}
</script>

<style lang="scss" scoped>
.tree-div {
  border-left: 1px solid rgb(230, 230, 230);
  border-top: 1px solid rgb(230, 230, 230);
  border-bottom: 1px solid rgb(230, 230, 230);
  // border-right: 1px solid #ccc;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  &::-webkit-scrollbar {
    width: 2px;
  }
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
  .tree-div-box {
    display: flex;
    .tree {
      width: 50%;
      border-right: 1px solid #ccc;
    }
    .right-select {
      width: 50%;
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
  }
}
</style>
