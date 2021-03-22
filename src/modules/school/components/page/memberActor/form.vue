<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="420px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="80px" label-position="left">
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item 
        label="图标" 
        prop="iconUrl" 
        :rules="[{ required: false, message: '该字段不能为空' }]">
        <QcImageUpload v-model="model.iconUrl"></QcImageUpload>
        <p style="font-size:12px;color: #888;">建议尺寸60 * 60，JPG、PNG格式，小于150k。</p>
      </el-form-item>
      <!-- <el-form-item
        label="类型"
        prop="type"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-radio v-model="model.type" label="level">等级</el-radio>
        <el-radio v-model="model.type" label="actor">头衔</el-radio>
      </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
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
    },
  },
  data() {
    return {
      model: {
        name: '',
        iconUrl: '',
        type: 'actor'
      },
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (val && this.id) {
        this.getMemberLevel()
      }
    }
  },
  methods: {
    //获取
    async getMemberLevel() {
      try {
        console.log(this.$http)
        let res = await this.$http.getMemberLevel({ id: this.id })
        this.model = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.saveModel()
        } else {
          return false
        }
      })
    },
    async saveModel(type) {
      try {
        await this.$http.addMemberLevel(this.model)
        this.loading = false
        this.$message({
          message: this.id ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
      }
    },
    close(flag = false) {
      this.$emit('close', flag)
      this.clearForm('model')
    }
  }
}
</script>
