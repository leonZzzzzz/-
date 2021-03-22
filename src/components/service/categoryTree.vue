<template>
  <el-card>
    <el-button type="primary" size="mini" @click="visible = true">添加</el-button>
    <el-button type="primary" size="mini" @click="getList()">刷新</el-button>
    <el-table :data="list" style="width: 100%;margin: 20px 0;" row-key="id" :tree-props="{ children: 'childs' }">
      <el-table-column prop="name" label="名称" align="left"></el-table-column>
      <el-table-column prop="url" label="图标" align="center">
        <template slot-scope="scope">
          <el-image :src="imgHost + scope.row.iconUrl" fit="cover" style="width:60px;height:60px;">
            <div slot="error" class="el-image__error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="简介" align="center"></el-table-column>
      <el-table-column prop="seqNum" label="排序" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100px" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="getTree(scope.row)">编辑</el-button>
          <el-button
            type="text"
            @click="addChild(scope.row.id)"
            v-if="(showAddChild && !scope.row.parentId) || scope.row.parentId == '0'"
            >添加子分类</el-button
          >
          <el-button type="text" @click="deleteCategory(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分类信息"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      :visible="visible"
      :before-close="onClose"
    >
      <el-form ref="model" :model="model" label-position="right" label-width="50px">
        <el-form-item label="显示" prop="isDisplay">
          <el-switch v-model="model.isDisplay" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.name" :maxlength="10" placeholder="建议8个字内"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="info">
          <el-input v-model="model.info" :maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seqNum">
          <el-input v-model="model.seqNum"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="iconUrl">
          <ImageUpload :image-url="model.iconUrl" :on-success="(e) => (model.iconUrl = e)"></ImageUpload>
          <div style="margin-top:75px;margin-left:10px;">(尺寸：60px*60px)</div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="onClose()">关闭</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  props: {
    type: [String, Number],
    showAddChild: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      model: {
        type: this.type,
        parentId: '0',
        code: '',
        name: '',
        info: '',
        seqNum: '',
        iconUrl: '',
        isDisplay: true
      },
      visible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getTree(row) {
      this.model = JSON.parse(JSON.stringify(row))
      this.visible = true
    },
    getList() {
      this.$http.treeCategory({ type: this.type }).then((res) => {
        this.list = this.deepLoop(res.data.data)
      })
    },
    addChild(id) {
      this.visible = true
      this.model.parentId = id
    },
    deepLoop(data, index = 1) {
      return data.map((item) => {
        item.deepIndex = index
        if (item.isHasChild && item.childs) {
          this.deepLoop(item.childs, index + 1)
        }
        return item
      })
    },
    addCategory() {
      this.$http.addCategory(this.model).then(() => {
        this.$message.success('添加成功')
        this.getList()
        this.onClose()
      })
    },
    deleteCategory(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteCategory({ id }).then(() => {
            this.getList()
          })
        })
        .catch(() => {
          return
        })
    },
    updateCategory() {
      this.$http.updateCategory(this.model).then(() => {
        this.$message.success('修改成功')
        this.getList()
        this.onClose()
      })
    },
    onSubmit() {
      this.$refs.model.validate((value) => {
        if (value) {
          this.model.id ? this.updateCategory() : this.addCategory()
        }
      })
    },
    onClose() {
      this.visible = false
      this.model = this.$options.data().model
      this.model.type = this.type
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
    }
  }
}
</script>
<style scoped>
.el-form-item__content {
  display: flex;
}
</style>
