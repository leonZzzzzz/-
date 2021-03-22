<template>
  <el-dialog
      title="删除提示"
      :visible.sync="visible"
      width="400px"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="delClose">
      <p style="height: 40px;">{{`是否需要把当前${type}的会员转移到其他${type}？`}}</p>
      <el-form v-if="visible" :model="delModel" ref="model" label-width="80px" label-position="left">
        <el-form-item
          :label="'目标'+type"
          prop="newId"
          :rules="[{ required: false, message: '请选择目标'+type }]"
        >
          <el-select v-model="delModel.newId" :placeholder="'请选择目标'+type" style="width: 220px;margin-bottom: 15px;">
            <el-option
              size="small"
              v-for="option in levelList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button :loading="delLoading2" @click="delSuccess(false)">仅删除</el-button>
        <el-button type="primary" :loading="delLoading" @click="delSuccess(true)">转移并删除</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    propsid: String,
    type: {
      type: String,
      default: '等级'
    },
  },
  data() {
    return {
      delLoading: false,
      delLoading2: false,
      delModel: {
        id: '',
        newId: '',
        transferMember: true
      },
      levelList: [],
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.delModel.id = this.propsid || ''
        this.getPageMemberLevel()
      }
    }
  },
  methods: {
    async delete(model) {
      await this.$http.delMemberLevel(model)
      this.$message.success('删除成功')
      this.delClose(true)
    },
    // 获取等级/头衔列表
    getPageMemberLevel() {
      this.$http.pageMemberLevel({pageNum: 1, pageSize: 999, type: this.type == '头衔' ? 'actor' : 'level'}).then(res => {
        this.levelList = res.data.data.list
      })
    },
    delClose(state = false) {
      this.delLoading = false
      this.delLoading2 = false
      this.delModel = {
        id: '',
        newId: '',
        transferMember: true
      }
      this.$emit('close', state)
    },
    async delSuccess(state) {
      try{
        if (state) {
          if (!this.delModel.newId) {
            this.$message.warning('请选择目标'+this.type)
            return
          }
          this.delLoading = true
          this.delete({ 
            transferMember: true,
            id: this.delModel.id,
            newId: this.delModel.newId
          })
        } else {
          this.delLoading2 = true
          this.delete({ 
            transferMember: false,
            id: this.delModel.id,
            newId: ''
          })
        }
      }catch(error) {
        this.delLoading = false
        this.delLoading2 = false
      }
    }
  }
}
</script>

