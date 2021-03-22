<template>
  <el-dialog
    :title="id ? '编辑文本' : '新建文本'"
    :visible.sync="visible"
    width="540px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="model"
      ref="model"
      label-width="90px"
      label-position="left"
    >
      <el-form-item
        label="文本分类"
        prop="groupId"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-cascader
          :options="data"
          :props="{ value: 'id', label: 'name', children: 'childs' }"
          :show-all-levels="true"
          v-model="model.groupId"
          style="width: 410px"
          @change="changeCascader"
          ref="elcascader"
          @visible-change="elCascaderOnlick"
          @expand-change="elCascaderOnlick"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="文本内容"
        prop="content"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input
          maxlength="1200"
          placeholder="文本内容最长为1200个字符"
          type="textarea"
          :id="inputId"
          v-model="model.content"
        ></el-input>
      </el-form-item>
      <div
        class="option-content"
        style="margin-left:85px"
      >
        <emotion @selectedEmotion="insertTextMsg"></emotion>
        <div class="option-content--box">
          <div class="option-left">
            插入替换文案
            <el-tooltip
              effect="dark"
              placement="top-end"
              content="非自定义替换即前端自动根据字段信息替换，自定义替换文案即前端人员可自行修改字段文案"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="option-right">
            <div class="right-group">
              <div
                class="group-item"
                @click="insertTextMsg('<客户昵称>')"
              >客户昵称</div>
              <div
                class="group-item"
                @click="insertTextMsg('<成员昵称>')"
              >成员昵称</div>
              <!-- <div class="group-item" @click="insertTextMsg('<编辑关键词>')">编辑关键词</div> -->
            </div>
          </div>
        </div>
      </div>
      <el-form-item label="关键字">
        <el-button
          v-if="selectedKeyWords.length == 0"
          @click=";(keywordModel = true), getKeySear()"
        ><i class="el-icon-plus"></i>添加</el-button>
        <div
          v-else
          style="display:flex;flex-wrap:wrap"
        >
          <div
            class="havekey"
            v-for="(item, i) in selectedKeyWords"
            :key="i"
          >{{ item }}
            <i class="el-icon-circle-close keydelete" @click="selectedKeyWords.splice(i,1),selectedKeyWordIds.splice(i,1)"></i>
          </div>
          <el-button
            class="haveedit"
            size="mini"
            @click=";(keywordModel = true), (isedit = true), getKeySear()"
          ><i class="el-icon-edit"></i>编辑</el-button>
        </div>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close(false)">取 消</el-button>
      <el-button
        type="primary"
        @click="success()"
        :loading="loading"
      >确 定</el-button>
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
      <div style="display:flex;flex-flow:wrap">
        <div
          class="add-btn"
          @click="addWordModel = true"
        >添加</div>
        <div
          v-for="(item, index) in keyslist"
          :key="index"
          :class="checkKeyWordActive(item) ? 'keys activekey' : 'keys'"
          @click="onKeyWordSelect(item)">
          {{ item.name }}
          <i class="el-icon-circle-close keydelete" @click.stop="keywordDelete(item.id,$event)"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closekeyDialog">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="keywordModel = false"
        >确 定</el-button>
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
      <div style="display:flex;justify-content:center;">
        <div
          class="left-input"
          style="line-height:30px;"
        >关键词</div>
        <el-input
          v-model="words"
          style="width:400px;margin-left:10px;"
          type="text"
          placeholder="最多6个字"
          maxlength="6"
          show-word-limit
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closewordDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAdd"
          :loading="loading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import Emotion from '../../../components/common/Emotion'
export default {
  components: {
    Emotion
  },
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
        content: '',
        groupId: '',
        searchWordId: '',
        type: 'text'
      },
      productPickerVisible: false,
      loading: false,
      data: [],

      keywordModel: false,
      keyslist: [],
      addWordModel: false,
      words: '',
      selectedKeyWordIds: [],
      selectedKeyWords: [],
      isedit: false,
      inputId: Math.random().toString(36).substr(2) // 文本输入id设为随机字符串，以免在编辑或者添加文本时插入文本的id相同
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
      this.$http.getMateTree({ type: 'text' }).then(res => {
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
    // 获取详情
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

    // 插入替换文案或表情
    insertTextMsg(val) {
      let textInput = document.getElementById(this.inputId)
      // 插入表情
      let insert = textInput.selectionStart
      this.model.content = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
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
      if (this.selectedKeyWordIds.indexOf(obj.id) > -1) {
        return true
      } else {
        return false
      }
    },
    // 选中关键字
    onKeyWordSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedKeyWordIds.indexOf(obj.id) > -1) {
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
      console.log(this.selectedKeyWords, this.selectedKeyWordIds)
    },
    keywordDelete(id,event){
      // var classarry=event.path[0].parentElement.getAttributeNode('class')
      var classarry=event.path[0].parentElement.className
      if(classarry=='keys activekey'){
        this.$message.warning('请取消选中后再删除')
        return
      }
       this.$confirm(`确定删除关键字吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteKyword({ id }).then((res) => {
          this.$message.success('删除成功')
          this.$nextTick(()=>{
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
      console.log(this.selectedKeyWords, this.selectedKeyWordIds)
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
      this.selectedKeyWords = []
      this.selectedKeyWordId = []
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      this.$emit('onClose', flag)
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
::v-deep .el-textarea__inner {
  height: 230px;
}
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
.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  .option-content--box {
    display: flex;
    align-items: center;
    // margin-bottom: 15px;
  }
  .option-left {
    width: 120px;
    padding-right: 12px;
    box-sizing: border-box;
    text-align: left;
  }
  .option-right {
    .right-group {
      display: flex;
      .group-item {
        padding: 5px 10px;
        border: 1px solid #294a7b;
        border-radius: 3px;
        color: #294a7b;
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
.option-tips {
  margin-left: 120px;
  color: #b5b5b5;
}
</style>
