<template>
  <div class="wrap">
    <el-tabs type="border-card" class="border" @tab-click="handleClick">
      <el-tab-pane :label="item.title" v-for="(item, i) in pane" :key="i">
        <el-form label-position="top" v-if="i != 2">
          <el-form-item label="标题">
            <el-input v-model="item.data.title" style="width: 750px;"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <Editor v-model="item.data.content"></Editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit()">保存</el-button>
          </el-form-item>
        </el-form>
        <Qa v-else />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from 'apiSchool/common'
import Qa from '../common/Qa'
export default {
  components: { Qa },
  data() {
    return {
      loading: false,
      pane: [
        {
          title: '销售推广计划',
          type: 'planData',
          data: {
            title: '',
            content: ''
          }
        },
        {
          title: '销售推广规则',
          type: 'ruleData',
          data: {
            title: '',
            content: ''
          }
        },
        {
          title: '常见问题',
          type: 'QAData',
          data: {
            title: '',
            content: ''
          }
        }
      ],
      activeIndex: 0
    }
  },
  created() {
    this.distributerMaterialPlanGet()
    this.distributerMaterialRuleGet()
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
      if (this.activeIndex === Number(tab.index)) return
      this.activeIndex = Number(tab.index)
    },
    handleSide() {
      this.sideDialogVisible = true
    },
    handleSideClose(row) {
      this.pane[this.activeIndex].data = {
        singleContentTitle: row.title,
        singleContentId: row.id
      }
      this.sideDialogVisible = false
    },

    handleSubmit() {
      if (this.activeIndex === 0) this.distributerMaterialPlanUpdate(this.pane[this.activeIndex].data)
      if (this.activeIndex === 1) this.distributerMaterialRuleUpdate(this.pane[this.activeIndex].data)
    },

    // 计划
    distributerMaterialPlanGet() {
      this.$http.distributerMaterialPlanGet().then((res) => {
        this.pane[0].data = Object.assign(this.pane[0].data, res.data.data)
      })
    },
    distributerMaterialPlanUpdate(params) {
      this.$http.distributerMaterialPlanUpdate(params).then(() => {
        this.$message.success('保存成功')
      })
    },

    // 规则
    distributerMaterialRuleGet() {
      this.$http.distributerMaterialRuleGet().then((res) => {
        this.pane[1].data = Object.assign(this.pane[1].data, res.data.data)
      })
    },
    distributerMaterialRuleUpdate(params) {
      this.$http.distributerMaterialRuleUpdate(params).then(() => {
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding: 20px;
}
.border {
  box-shadow: 0 0 0 0;
}
.key {
  padding: 30px;
  p {
    padding: 20px 0;
    font-size: 18px;
  }
}
.card-wrapper {
  margin-top: 15px;
}
.select-text {
  margin-right: 10px;
  font-size: 16px;
  color: #606266;
}

.tags-wrapper {
  white-space: normal;
  ::v-deep .el-tag {
    background-color: transparent;
    border: 1px solid #409eff;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}

.button-new-tag {
  margin-left: 10px;
  margin-top: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
