<template>
  <div>
    <QcTable
      v-if="isReady"
      ref="table"
      :option="option"
      :search-form="searchForm"
      :menu="menu"
      :column="column"
      :el="elConfig"
    >
    </QcTable>
    <!-- row下面hasChildren是否有子分类 有就会调用load函数异步获取 -->

    <CategoryFormDialog
      :id="id"
      :visible="visible"
      :type="type"
      :parent-id="parentId"
      @close="onClose"
    ></CategoryFormDialog>
  </div>
</template>

<script>
export default {
  props: {
    type: [String, Number],
    parent: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: 'api/admin/v1/category/page'
    }
  },
  data() {
    return {
      isReady: false,
      option: {
        url: this.url
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        { formName: 'type', value: this.type },
        { formName: 'parentId', value: this.parent }
      ],
      menu: [{ type: 'primary', label: '新建', on: () => (this.visible = true) }],
      column: [
        // { label: '序号', type: 'index', align: 'center' },
        { label: '名称', prop: 'name', align: 'left' },
        {
          label: '图标',
          prop: 'iconUrl',
          align: 'center',
          formatter: (row) => {
            return <el-image src={this.imgHost + row.iconUrl} fit="cover" style="width:60px;height:60px;"></el-image>
          }
        },
        { label: '简介', prop: 'info', align: 'center' },
        { label: '排序号', prop: 'seqNum', align: 'center' },
        { label: '创建时间', prop: 'createTime', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.visible = true
                    this.id = row.id
                    this.parentId = row.parentId
                    this.currentRow = row
                  }}
                >
                  修改
                </el-button>
                <el-button type="text" onClick={this.deleteCategory.bind(this, row)}>
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      visible: false,
      id: '',
      parentId: '',
      currentRow: {},
      elConfig: {
        lazy: true,
        load: this.loadChild,
        'row-key': 'id',
        'tree-props': { children: 'children', hasChildren: 'isHasChild' }
      },
      // 记录展开过的分类数据 刷新时需要用
      childs: new Map()
    }
  },
  // created() {
  //   if (this.type === 1) {
  //     this.isReady = true
  //     this.parentId = '0'
  //   } else {
  //     this.treeCategory()
  //   }
  // },
  created() {
    if (this.type === 1) {
      this.isReady = true
      this.parentId = '0'
    } else {
      if (this.parent) {
        this.isReady = true
        this.parentId = this.parent
      } else {
        this.treeCategory()
      }
    }
  },

  methods: {
    treeCategory() {
      this.$http.treeCategory({ type: this.type }).then((res) => {
        if (res.data.data[0]) {
          this.parentId = res.data.data[0].id
        } else {
          this.parentId = '0'
        }
        this.searchForm.push({ formName: 'parentId', value: this.parentId })
        this.isReady = true
      })
    },
    deleteCategory(row) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCategory({ id: row.id }).then(() => {
            this.$refs.table.onSearchKeep()
          })
        })
        .catch(() => {})
    },
    onClose(isRefresh) {
      if (isRefresh) {
        this.$refs.table.onSearch()
      }
      this.visible = false
      this.id = ''
      this.currentRow = {}
    },
    // 这个方法暂时没用到，树形结构的分类用 categoryTree.vue 组件吧
    // 解决表格树形结构数据 懒加载 添加修改删除操作后子节点不刷新问题
    // 现在有一个问题，当前层级下返回空数组没有子级的时候 页面不会刷新，后面再想办法修复
    refreshChild(row) {
      // 判断当前层级有没有子分类，如果有就刷新自己 否则就刷新父级
      let currentId = row.isHasChild ? row.id : row.parentId
      // let currentId = row.parentId
      //懒加载刷新当前级
      console.log('懒加载刷新子节点' + currentId)
      console.log(this.childs.get(currentId))
      if (currentId && this.childs.get(currentId)) {
        const { tree, treeNode, resolve } = this.childs.get(currentId)
        this.loadChild(tree, treeNode, resolve)
      }
    },
    loadChild(tree, treeNode, resolve) {
      this.childs.set(tree.id, { tree, treeNode, resolve })
      this.$http.listCategory({ type: this.type, parentId: tree.id }).then((res) => {
        resolve(res.data.data)
      })
    }
  }
}
</script>
