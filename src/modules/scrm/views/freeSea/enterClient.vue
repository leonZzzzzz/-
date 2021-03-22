<template>
  <el-dialog
    :title="id ? '编辑客户' : '录入客户'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="80px" label-position="left">
      <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>

      <el-form-item label="关联成员">
        <!-- <div class="import-form-person tag-item" v-if="form.monentsUsers.length != 0">
          <Tag v-for="(item, index) in form.monentsUsers" :key="index">{{ item.name }}</Tag>
        </div> -->
        <div>
          <el-button icon="el-icon-plus" plain size="small" @click="openPeople">添加</el-button>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
    }
  },
  data() {
    return {
      innerVisible: false,
      model: {
        name: '',
        mobile: ''
      },
      productPickerVisible: false,
      loading: false,
      data: []
    }
  },

  watch: {
    visible(val) {
      if (val) {
        if (this.id) {
        }
      }
    }
  },

  methods: {
    success() {
      this.$http.enterUnclient(this.model).then((res) => {
        this.$message.success('录入成功')
        this.close(true)
      })
    },

    close(flag) {
      this.model = this.$options.data().model
      console.log(this.model)

      this.$emit('onClose', flag)
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach((el) => {
          el.onclick = function() {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    }
  }
}
</script>
<style></style>
