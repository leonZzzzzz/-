<template>
  <el-dialog
    title="关联角色"
    :visible.sync="visible"
    width="700px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="height:350px;overflow: auto;" v-loading="dataLoading">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
        <el-row>
          <el-col v-for="(item, i) in roleList" :key="i" :span="8" style="margin-top:15px;">
            <el-checkbox :checked="item.checked" :label="item">
              {{ item.name }}
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
    <span slot="footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading" :disabled="checkedRole.length === 0"
        >确 定</el-button
      >
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
      loading: false,
      dataLoading: false,
      roleList: [],
      checkedRole: [],
      isIndeterminate: true,
      checkAll: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.dataLoading = true
        this.detail()
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedRole = val ? this.roleList : []
      this.isIndeterminate = false
    },
    handleCheckedRoleChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
    },
    async detail() {
      try {
        let res = await this.$http.roleList({ accountId: this.id })
        this.roleList = res.data.data
        this.dataLoading = false
      } catch (err) {
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true, true)
        }
      }
    },
    //修改
    async update(model) {
      try {
        await this.$http.updateAccountRoles(model)
        this.loading = false
        this.$message.success('关联成功')
        this.close(true)
      } catch (err) {
        this.loading = false
        if (/超时/.test(err.data.message)) {
          this.closeLogin(true)
        }
      }
    },
    success() {
      let model = {
        accountId: this.id,
        roleIdList: ''
      }
      this.checkedRole.map((item) => {
        model.roleIdList += item.id + ','
      })
      model.roleIdList = model.roleIdList.substring(0, model.roleIdList.length - 1)
      this.update(model)
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
