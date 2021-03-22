<template>
  <el-dialog
    :title="id ? '编辑小程序' : '新建小程序'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="100px" label-position="left">
      <el-form-item label="小程序分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-cascader
          :options="data"
          :props="{ value: 'id', label: 'name', children: 'childs' }"
          :show-all-levels="true"
          v-model="model.groupId"
          style="width: 400px"
          @change="changeCascader"
          ref="elcascader"
          @visible-change="elCascaderOnlick"
          @expand-change="elCascaderOnlick"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="小程序名称" prop="name" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input placeholder="请输入小程序名称" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="appId" prop="programId" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input placeholder="长度不超过25的字符" maxlength="25" v-model="model.programId"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="link" :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-input placeholder="请输入小程序page路径" v-model="model.link"></el-input>
      </el-form-item>
      <el-form-item label="小程序封面" prop="imageUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
        <QcImageUpload v-model="model.imageUrl" width="100px" height="100px"></QcImageUpload>
        <span style="font-size: 12px; color: #999">封面大小不能超过1m</span>
      </el-form-item>
      <el-form-item label="关键字">
        <el-button v-if="selectedKeyWords.length == 0" @click=";(keywordModel = true), getKeySear()"
          ><i class="el-icon-plus"></i>添加</el-button
        >
        <div v-else style="display: flex; flex-wrap: wrap">
          <div class="havekey" v-for="(item, i) in selectedKeyWords" :key="i">
            {{ item
            }}<i
              class="el-icon-circle-close keydelete"
              @click="selectedKeyWords.splice(i, 1), selectedKeyWordIds.splice(i, 1)"
            ></i>
          </div>
          <el-button class="haveedit" size="mini" @click=";(keywordModel = true), getKeySear()"
            ><i class="el-icon-edit"></i>编辑</el-button
          >
        </div>
      </el-form-item>
      <program-alert></program-alert>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <!-- 选择关键词 -->
    <el-dialog
      :title="`选择关键字搜索`"
      :visible="keywordModel"
      width="550px"
      top="10vh"
      :close-on-click-modal="false"
      append-to-body
      @close="closekeyDialog"
    >
      <div style="display: flex; flex-flow: wrap">
        <div class="add-btn" @click="addWordModel = true">添加</div>
        <div
          v-for="(item, index) in keyslist"
          :key="index"
          :class="checkKeyWordActive(item) ? 'keys activekey' : 'keys'"
          @click="onKeyWordSelect(item)"
        >
          {{ item.name }}
          <i class="el-icon-circle-close keydelete" @click.stop="keywordDelete(item.id, $event)"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closekeyDialog">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="keywordModel = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增关键词 -->
    <el-dialog
      :title="`新增关键词`"
      :visible="addWordModel"
      width="550px"
      top="20vh"
      :close-on-click-modal="false"
      append-to-body
      @close="closewordDialog"
    >
      <div style="display: flex; justify-content: center">
        <div class="left-input" style="line-height: 30px">关键词</div>
        <el-input
          v-model="words"
          style="width: 400px; margin-left: 10px"
          type="text"
          placeholder="最多6个字"
          maxlength="6"
          show-word-limit
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closewordDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAdd" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import ProgramAlert from '../../../components/components/ProgramAlert'
export default {
  components: { ProgramAlert },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    tagId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        name: '',
        groupId: '',
        link: '',
        imageUrl: '',
        programId: '',
        searchWordId: '',
        type: 'program'
      },
      data: [],
      loading: false,
      keywordModel: false,
      keyslist: [],
      addWordModel: false,
      words: '',
      selectedKeyWordIds: [],
      selectedKeyWords: []
    }
  },

  watch: {
    visible(val) {
      this.selectedKeyWordIds = []
      this.selectedKeyWords = []
      this.model.groupId = this.tagId
      this.getDepartmentTreeData()
      if (val) {
        if (this.id) {
          this.getCarousel()
        }
      }
    }
  },

  methods: {
    // 获取分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type: 'program' }).then(res => {
        this.data = res.data.data
        this.data.forEach(item => {
          if (!item.childs) {
            item.childs = null
          }
        })
      })
    },
    // 获取分类id
    changeCascader(e) {
      if (e.length == 1) {
        this.model.groupId = e[0]
      }
      if (e.length == 2) {
        this.model.groupId = e[1]
      }
    },

    getCarousel() {
      this.$http.materialDetail({ id: this.id }).then(res => {
        this.model = res.data.data
        if (this.model.searchWordList) {
          this.model.searchWordList.forEach(item => {
            this.selectedKeyWordIds.push(item.id)
            this.selectedKeyWords.push(item.name)
          })
        }
      })
    },
    // 获取关键字列表
    getKeySear() {
      this.$http.searchKeyWord().then(res => {
        this.keyslist = res.data.data.list
        this.keyslist.forEach(item => {
          item.checked = false
        })
        console.log(this.keyslist)
      })
    },
    // 确定新增关键字
    confirmAdd() {
      this.$http.AddKeyWordsearch({ name: this.words, sequence: '' }).then(res => {
        this.closewordDialog()
        this.getKeySear()
      })
    },
    // 关键词是否被选中
    checkKeyWordActive(obj) {
      if (this.selectedKeyWordIds.includes(obj.id)) {
        return true
      } else {
        return false
      }
    },
    // 选中关键字
    onKeyWordSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedKeyWordIds.includes(obj.id)) {
        this.selectedKeyWordIds.splice(this.selectedKeyWordIds.indexOf(obj.id), 1)
        this.selectedKeyWords.splice(this.selectedKeyWords.indexOf(obj.name), 1)
      } else {
        if (this.selectedKeyWordIds.length >= 3) {
          this.$message.warning('只能选择三个关键词')
        } else {
          this.selectedKeyWordIds.push(obj.id)
          this.selectedKeyWords.push(obj.name)
        }
      }
    },
    keywordDelete(id, event) {
      // var classarry=event.path[0].parentElement.getAttributeNode('class')
      var classarry = event.path[0].parentElement.className
      if (classarry == 'keys activekey') {
        this.$message.warning('请取消选中后再删除')
        return
      }
      this.$confirm(`确定删除关键字吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteKyword({ id }).then(res => {
          this.$message.success('删除成功')
          this.$nextTick(() => {
            this.getKeySear()
          })
        })
      })
    },
    closekeyDialog() {
      this.keywordModel = false
    },
    closewordDialog() {
      this.addWordModel = false
      this.words = ''
    },
    success() {
      if (this.model.type == '') {
        this.$message.error('请选择文本分类')
        return
      }
      if (this.model.content == '') {
        this.$message.error('请填写文本内容')
        return
      }
      if (this.selectedKeyWordIds.length > 0) {
        this.model.searchWordId = this.selectedKeyWordIds.join('_')
      } else {
        this.model.searchWordId = ''
      }
      this.$refs.model.validate(valid => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          this.loading = true
          this.saveModel(this.id ? 'materialUpdate' : 'materialAdd', model)
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'materialUpdate' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('closeMini', flag)
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function () {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function () {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach(el => {
          el.onclick = function () {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
.keys {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #e8e7e6;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
  .keydelete {
    position: absolute;
    top: 0px;
    right: 0px;
    display: none;
  }
}
.keys:hover .keydelete {
  display: block;
}
.activekey {
  background-color: #294a7b;
  color: #ffffff;
}
.add-btn {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #ffffff;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #e8e7e6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #294a7b;
}
.havekey {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 24px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  background-color: #e8e7e6;
  position: relative;
  .keydelete {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
  }
}
.havekey:hover .keydelete {
  display: block;
}
.haveedit {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 15px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}
</style>
