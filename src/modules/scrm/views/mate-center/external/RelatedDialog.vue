<template>
  <el-dialog
    title="设置可看分类"
    :visible.sync="visible"
    width="700px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="display:flex;">
      <div class="leftcheck">
        <div v-for="(first, firstIndex) in tree" :key="firstIndex">
          <!-- 第一级 -->
          <div class="first-item">
            <el-checkbox v-model="first.checked" @change="change($event, 0, firstIndex)">{{ first.name }}</el-checkbox>
          </div>
          <!-- 第二级 -->
          <div class="item-list" v-for="(second, secondIndex) in first.childs" :key="secondIndex">
            <el-checkbox v-model="second.checked" @change="change($event, 1, firstIndex, secondIndex)">{{
              second.name
            }}</el-checkbox>
            <div class="item-list" v-for="(third, thirdIndex) in second.childs" :key="thirdIndex">
              <!-- 第三级 -->
              <el-checkbox v-model="third.checked" @change="change($event, 2, firstIndex, secondIndex, thirdIndex)">{{
                third.name
              }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div class="rightlist">
        <div>已选择的分组（{{ namelist.length }}）</div>
        <div class="rightbox">
          <div class="right_b" v-for="(name, i) in namelist" :key="i">
            <span>{{ name.name }}</span
            ><i class="el-icon-close" @click="deleteName(name.id)"></i>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      namelist: [],
      tree: [],
      loading: false,
      dataLoading: false,
      roleList: [],
      checkedRole: [],
      isIndeterminate: true,
      checkAll: false,
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      expandedkeys: [],
      checkedkeys: []
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.dataLoading = true
        // this.detail()
        this.getDepartmentTreeData(this.id)
      }
    }
  },
  methods: {
    // 获取分类数据
    getDepartmentTreeData(id) {
      this.$http.getMateTree({ type: 'poster' }).then((res) => {
        var tree = res.data.data
        tree.forEach((item) => {
          item.checked = false
          if (item.childs) {
            item.childs.forEach((val) => {
              val.checked = false
              if (val.childs) {
                val.childs.forEach((lis) => {
                  lis.checked = false
                })
              }
            })
          }
        })
        this.tree = tree
        setTimeout(() => {
          this.getCheck(id)
        }, 500)
      })
    },
    // 获取已勾选分类
    getCheck(id) {
      this.$http.BoundListGroup({ type: 'poster', accountId: id }).then((res) => {
        this.checktree = res.data.data
        this.checktree.forEach((lis) => {
          this.tree.forEach((item) => {
            if (lis.groupId == item.id) {
              item.checked = true
            }
            if (item.childs) {
              item.childs.forEach((val) => {
                if (lis.groupId == val.id) {
                  val.checked = true
                }
                if (val.childs) {
                  val.childs.forEach((ls) => {
                    if (lis.groupId == ls.id) {
                      ls.checked = true
                    }
                  })
                }
              })
            }
          })
        })
        this.namelist = this.letname(this.tree)
      })
    },
    // check选中数据
    change(val, level, firstIndex, secondIndex, thirdIndex) {
      switch (level) {
        case 0:
          this.updateTreeChild(this.tree[firstIndex].childs, val)
          break
        case 1:
          if (val) {
            // this.tree[firstIndex].checked = val
            this.tree[firstIndex].childs[secondIndex].checked = val
          }
          this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs, val)
          break
        case 2:
          if (val) {
            // this.tree[firstIndex].checked = val
            // this.tree[firstIndex].childs[secondIndex].checked = val
            this.tree[firstIndex].childs[secondIndex].childs[thirdIndex].checked = val
          }
          this.updateTreeChild([], val)
          break
      }
    },
    updateTreeChild(data, flag) {
      // if(data&&data.length>0){
      //   data.forEach(item => {
      //     item.checked = flag
      //     item.childs instanceof Array && this.updateTreeChild(item.childs, flag)
      //   })
      // }
      this.namelist = this.letname(this.tree)
    },
    // 删除已勾选
    deleteName(id) {
      this.tree = this.eachId(this.tree, id)
      this.namelist = this.letname(this.tree)
    },
    // 获取id数组
    loop(data, ids = []) {
      let array = ids
      data.forEach((item) => {
        if (item.checked) {
          array.push(item.id)
        }
        item.childs instanceof Array && this.loop(item.childs, array)
      })
      return array
    },
    // 获取name列表
    letname(data, names = []) {
      let array = names
      data.forEach((item) => {
        if (item.checked) {
          var list = { name: item.name, id: item.id }
          array.push(list)
        }
        item.childs instanceof Array && this.letname(item.childs, array)
      })
      return array
    },
    eachId(data, id) {
      data.forEach((item) => {
        if (item.id == id) {
          item.checked = false
          this.updateTreeChild(item.childs, false)
        }
        item.childs instanceof Array && this.eachId(item.childs, id)
      })
      return data
    },

    handleCheckAllChange(val) {
      this.checkedRole = val ? this.roleList : []
      this.isIndeterminate = false
    },
    handleCheckedRoleChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
    },

    success() {
      let permissionIdList = this.loop(this.tree)
      let model = {
        accountId: this.id,
        groupIds: permissionIdList
      }
      // this.checkedRole.map(item => {
      //   model.roleIdList += item.id + ','
      // })
      // model.roleIdList = model.roleIdList.substring(0, model.roleIdList.length - 1)
      this.update(model)
    },
    //修改
    async update(model) {
      try {
        await this.$http.BoundCouunt(model)
        this.dataLoading = false
        this.$message.success('关联成功')
        this.close(true)
      } catch (err) {
        this.dataLoading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    close(flag) {
      this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      this.roleList = []
      this.checkedRole = []
      this.isIndeterminate = true
      this.checkAll = false
    }
  }
}
</script>
<style>
.leftcheck {
  width: 50%;
  height: 350px;
  overflow: auto;
  border-right: 1px solid #ddd;
}
.rightlist {
  width: 50%;
  height: 350px;
  overflow: auto;
  text-align: center;
}
.rightbox {
  margin-top: 30px;
}
.right_b {
  width: 60%;
  text-align: center;
  margin: 15px auto;
  display: flex;
  justify-content: space-between;
}
.first-item {
  /* border-bottom: 1px solid #e0e0e0; */
  padding-bottom: 10px;
}
.item-list {
  padding: 5px 0;
  margin-left: 25px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
