<template>
  <!-- 此组件已舍弃，相应组件已迁移至目录scrm/components/components -->
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
          highlight-current
          :props="defaultProps"
          @check="getCheckedNodes"
          @check-change="getCurrentNode"
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
</template>

<script>
export default {
  props: {
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
      selectedMenu: [], // 选中后返回的列表，已去重
      treeList: [], // tree转array返回的列表
      currentSelected: [] // 树形结构里面所有选中的值
    }
  },
  created() {
    this.getDepartmentTree()
  },
  methods: {
    setCheckedNodes() {
      this.selectedMenu = this.selectedList
      this.selectedMenu.forEach((item) => {
        this.treeList.forEach((obj) => {
          if (item.id === obj.id) {
            this.currentSelected.push(obj)
          }
        })
      })
      this.$refs.tree.setCheckedNodes(this.currentSelected)
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
          // 第二层
          if (item.childs) {
            item.childs.forEach((value, num) => {
              value.myId = `${index}-${num}`
              this.treeList.push(value) // 将对象加入到列表中
              // 第三层
              if (value.childs) {
                value.childs.forEach((obj3, idx3) => {
                  obj3.myId = `${index}-${num}-${idx3}`
                  this.treeList.push(obj3) // 将对象加入到列表中
                  // 第四层
                  if (obj3.childs) {
                    obj3.childs.forEach((obj4, idx4) => {
                      obj4.myId = `${index}-${num}-${idx3}-${idx4}`
                      this.treeList.push(obj4) // 将对象加入到列表中
                    })
                  }
                })
              }
            })
          }
        })
        // console.log('tree列表', this.treeList)
      })
    },
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
      })
    },
    getCurrentNode(node, isChecked) {
      // console.log('当前选的节点', node, isChecked)
      let list = [].concat(this.currentSelected)
      // 节点是否被选中
      if (isChecked) {
        this.treeList.forEach((obj) => {
          if (node.id === obj.id) {
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
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.currentSelected)
      })
    },
    cancelSelect(obj) {
      // 当前已选中的则取消选择
      if (this.selectedMenu.some((item) => item.id === obj.id)) {
        this.selectedMenu.splice(
          this.selectedMenu.findIndex((item) => item.id === obj.id),
          1
        )
      }
      this.$refs.tree.setCheckedNodes(this.selectedMenu)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-menu {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
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
</style>
