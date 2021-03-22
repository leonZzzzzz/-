<template>
  <!-- 动态内容 参考新增企业动态圈 xfo-->
  <!-- 
    import DynamicContent from '../../../components/components/DynamicContent.vue'
    <DynamicContent :value="ruleForm.content"></DynamicContent>
   -->
  <div>
    <div class="text">
      <el-input
        type="textarea"
        :rows="row"
        :placeholder="placeholder"
        v-model="content"
        resize="none"
        :max="maxLength"
        :maxlength="maxLength"
        show-word-limit
        id="uploadEnclosureTextarea"
        @input="success"
      ></el-input>
      <div class="emotion">
        <Emotion position="right-start" @selectedEmotion="_selectedEmotion"></Emotion>
      </div>
    </div>
    <div class="nickname" v-if="nickname">
      <el-button size="mini" type="text">插入昵称</el-button>
      <div class="xfo-button" @click="_selectedEmotion('<成员昵称>')">成员昵称</div>
      <div class="xfo-button" @click="_selectedEmotion('<客户昵称>')">客户昵称</div>
      <div class="xfo-button" @click="_selectedEmotion('<客户备注名>')">客户备注名</div>
    </div>
  </div>
</template>

<script>
import Emotion from './Emotion.vue'
export default {
  props: {
    maxLength: {
      type: String,
      default: '1000'
    },
    row: {
      type: Number,
      default: 7
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    value: {
      type: String,
      default: ''
    },
    nickname: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Emotion
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    // 表情包
    _selectedEmotion(val) {
      let inp = document.getElementById('uploadEnclosureTextarea')
      let insert = inp.selectionStart
      console.log(insert)
      this.content = inp.value.substr(0, insert) + val + inp.value.substr(insert)
      this.$emit('input', this.content)
    },
    success() {
      this.$emit('input', this.content)
    }
  },
  watch: {
    value: {
      handler: function() {
        this.content = this.value
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  position: relative;
  ::v-deep .el-textarea__inner {
    padding: 5px 15px 26px;
  }
  ::v-deep .el-input__count {
    width: calc(100% - 12px);
    height: 26px;
    line-height: 20px;
    background-color: #ffffff;
    right: 11px;
    bottom: 1px;
    border-bottom-left-radius: 4px;
    text-align: right;
    padding: 4px;
    box-sizing: border-box;
  }
  .emotion {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    left: 5px;
    bottom: 2px;
  }
}
.nickname {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.xfo-button {
  padding: 7px 15px;
  margin-left: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  line-height: 12px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  user-select: none;
}
</style>
