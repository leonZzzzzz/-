<template>
  <div class="configure">
    <el-form v-if="currentPageId == 'df0c91a158234677b59048561a17cf6d'">
      <el-form-item label="使用商城版">
        <el-switch
          v-model="personalModel.value"
          active-value="1"
          inactive-value="0"
          @change="personalMallSave"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div v-else>
      <div v-if="!currentComponent.id">
        <p class="tip">当前未选择任何组件</p>
        <el-alert title="选择组件，进行个性化配置" type="info" show-icon :closable="false" />
      </div>
      <el-form v-else size="small" label-position="left" label-width="80px">
        <div class="title">
          <i class="el-icon-setting" />&nbsp;
          <span>{{ currentComponent.title }}——组件属性</span>
        </div>
        <RenderForm :form-options="currentComponent.config" @update-form="updateForm" />
      </el-form>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import index from '@/modules/flywheel/mixins'
import RenderForm from './RenderForm'

export default {
  mixins: [index],
  components: {
    RenderForm
  },
  data() {
    return {
      personalModel: {
        type: '0',
        name: '商城个人中心样式',
        key: 'PERSONAL_MALL',
        value: '',
        seqNum: '',
        showType: '1',
        parentId: '0'
      }
    }
  },
  created() {
    this.personalMallGet()
  },
  methods: {
    updateForm(form) {
      let currentComponent = _.cloneDeep(this.currentComponent)
      currentComponent.config = form
      currentComponent.options = this.formatComponentOptions(currentComponent.config)
      this.updateCurrentComponent(currentComponent)
    },
    personalMallSave() {
      if (this.personalModel.id) {
        this.personalMallUpdate(this.personalModel)
      } else {
        this.personalMallAdd(this.personalModel)
      }
    },
    personalMallAdd(model) {
      this.$http.personalMallAdd(model).then((res) => {
        this.personalMallGet()
      })
    },
    personalMallUpdate(model) {
      this.$http.personalMallUpdate(model).then((res) => {
        this.personalMallGet()
      })
    },
    personalMallGet() {
      this.$http.personalMallGet('PERSONAL_MALL').then((res) => {
        if (res.data.data) {
          this.personalModel = res.data.data
          this.$store.commit('editor/updatePersonalModel', this.personalModel.value)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.configure {
  width: 375px;
  height: 100%;
  padding: 20px;
  position: absolute;
  right: 0px;
  box-sizing: border-box;
  background: #fff;
  border-left: 1px solid #eee;
  overflow-y: auto;
  .tip {
    text-align: left;
    margin-bottom: 15px;
    font-size: 14px;
    color: #909399;
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    text-align: left;
    font-weight: 500;
    color: #a0a0a0;
    .icon {
      margin-right: 10px;
      font-size: 20px;
    }
  }
  .el-form-item__content {
    text-align: left;
  }
  .item-uploader {
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #fff;
    cursor: pointer;
    &:hover {
      border: 1px solid #dedede;
      .button-close {
        display: block;
      }
    }
    input {
      border: none;
    }
    .button-close {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 34px;
      display: none;
      font-size: 18px;
      text-align: center;
      line-height: 66px;
      color: #ef2700;
      background: #eee;
    }
  }
}
</style>
