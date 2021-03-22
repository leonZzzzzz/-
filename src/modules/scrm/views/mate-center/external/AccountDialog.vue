<template>
  <el-dialog
    :title="'设置可看分类'"
    :visible.sync="visible"
    width="400px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-position="right" label-width="100px">
      <div v-if="!showtype2">
        <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!id"
          label="用户账号"
          prop="username"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input size="small" v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!id"
          label="用户密码"
          prop="password"
          :rules="[{ required: true, message: '该字段不能为空' }]"
        >
          <el-input size="small" v-model="model.password"></el-input>
        </el-form-item>
      </div>
      <el-form-item v-else label="绑定分组">
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
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!showtype2">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="success2()" :loading="loading">确 定</el-button>
      <!-- <el-button size="small" type="primary" @click="sendbrother" :loading="loading">兄弟组件传参</el-button> -->
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    testcount: {
      type: Number,
      default: 1
    },
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    showtype2: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tree: [],
      model: {
        name: '',
        username: '',
        password: ''
      },
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.dataLoading = true
        this.detail()
        this.getDepartmentTreeData(this.id)
      }
    }
  },
  methods: {
    async detail() {
      try {
        let res = await this.$http.getAccount({ id: this.id })
        this.model.id = res.data.data.id
        this.model.name = res.data.data.name
        this.dataLoading = false
      } catch (err) {
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    // 获取分类数据
    getDepartmentTreeData(id) {
      this.$http.getMateTree({ type: 'poster' }).then((res) => {
        // this.tree = res.data.data
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
      })
    },

    // check选中数据
    // change(val, level, firstIndex, secondIndex,thirdIndex) {
    //   console.log(level,thirdIndex)
    //   switch (level) {
    //     case 0:
    //       this.updateTreeChild(this.tree[firstIndex].childs, val)
    //       break
    //     case 1:
    //       if (val) {
    //         this.tree[firstIndex].checked = val
    //       }
    //       this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs, val)
    //       break
    //     case 2:
    //       if (val) {
    //         console.log(this.tree[firstIndex].childs[secondIndex].checked)
    //         this.tree[firstIndex].checked = val
    //         this.tree[firstIndex].childs[secondIndex].checked = val
    //       }
    //       // this.updateTreeChild(this.tree[firstIndex].childs[secondIndex].childs[thirdIndex].childs, val)
    //       break
    //   }
    // },
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
      // data.forEach(item => {
      //   item.checked = flag
      //   item.childs instanceof Array && this.updateTreeChild(item.childs, flag)
      // })
    },
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
    success2() {
      let permissionIdList = this.loop(this.tree)
      if (permissionIdList.length == 0) {
        this.$message.warning('请选择要关联的分组')
        return
      }
      let model = {
        accountId: this.id,
        groupIds: permissionIdList
      }
      this.updateRelated(model)
    },

    async updateRelated(model) {
      try {
        await this.$http.BoundCouunt(model)
        this.$message.success('关联成功')
        this.close(true)
      } catch (err) {
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    success() {
      this.$refs.model.validate((valid) => {
        if (valid) {
          this.loading = true
          this.saveModel(this.id ? 'updateAccount' : 'addAccount')
        } else {
          return false
        }
      })
    },
    async saveModel(type) {
      try {
        var res = await this.$http[type](this.model)
        console.log(res)
        this.loading = false
        this.$message({
          message: type === 'updateAccount' ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.showtype2 = true
        if (type == 'addAccount') {
          this.id = res.data.data.id
          this.getDepartmentTreeData(res.data.data.id)
        }
        if (type == 'updateAccount') {
          this.close(true)
        }
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    close(flag) {
      this.model = this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      let model = {
        name: '',
        username: '',
        password: ''
      }
      return model
    }
  }
}
</script>
