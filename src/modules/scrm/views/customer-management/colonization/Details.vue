<template>
  <div>
    <GoBack :title="pageId ? '修改规则' : '新建规则'"></GoBack>
    <div class="mian-content" :style="`height:${pageHeight}px`">
      <el-form class="detailsData" :model="detailsData" ref="detailsData" label-width="auto">
        <el-form-item
          label="规则名称"
          prop="name"
          :rules="[{ required: true, message: '请输入规则名称', trigger: 'blur' }]"
        >
          <el-input v-model="detailsData.name" placeholder="请输入规则名称" maxlength="32" show-word-limit></el-input>
        </el-form-item>
        <el-form-item
          label="群名模板"
          prop="groupNameTemplate"
          :rules="[{ required: true, message: '请输入群名模板', trigger: 'blur' }]"
        >
          <el-input
            v-model="detailsData.groupNameTemplate"
            placeholder="请输入群名模板"
            maxlength="32"
            show-word-limit
            id="groupNameTemplate"
          ></el-input>
          <div style="display: flex; justify-content: flex-end; margin-top: 10px">
            <div class="xfo-button" @click="_selectedEmotion('<企业名称>')">插入企业名称</div>
          </div>
        </el-form-item>
        <el-form-item label="选择成员">
          <el-alert :title="`规则最多设置39位成员,当前规则成员为${memberList.length}位`" style="height:32px;margin-bottom:10px" :closable="false" type="info" show-icon> </el-alert>
          <div>
            <Tag v-for="(item, index) in memberList" :key="index">{{ item.name }}</Tag>
          </div>
          <el-button icon="el-icon-plus" plain size="small" @click="dialogVisible.visible = true">添加成员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="submitChatRule">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <MemberTreeLinkageDialog
      :config="dialogVisible"
      @closeDialog="dialogVisible.visible = false"
      :selectedList="memberList"
      ref="department"
      @handleConfirm="setMembers"
    ></MemberTreeLinkageDialog>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import MemberTreeLinkageDialog from '../../../components/components/MemberTreeLinkageDialog.vue'
import Tag from '../../../components/components/Tag'
export default {
  components: {
    GoBack,
    MemberTreeLinkageDialog,
    Tag
  },
  created() {
    if (this.$route.query.id) {
      this.pageId = this.$route.query.id
      this.getOpenEnterpriseChatRuleDetails(this.pageId)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPageHeight()
    })
  },
  data() {
    return {
      // 页面id
      pageId: '',
      // 页面高度
      pageHeight: 400,
      // 表单数据
      detailsData: {
        name: '',
        groupNameTemplate: '',
        wxUserId: ''
      },
      // 选择成员
      dialogVisible: {
        width: '800px',
        title: '选择目标成员',
        visible: false
      },
      memberList: []
    }
  },
  methods: {
    /* 页面渲染 */
    // 选择成员
    setMembers(list) {
      if (list.length == 0) {
        return this.$message.warning('请选择成员')
      } else if (list.length >= 39) {
        return this.$message.warning('最多设置39位成员')
      }
      this.memberList = list
      this.dialogVisible.visible = false
    },
    // 获取页面高度
    getPageHeight() {
      this.pageHeight = window.innerHeight - 200
    },
    // 提交规则
    submitChatRule() {
      this.$refs.detailsData.validate(valid => {
        if (valid) {
          if (this.memberList.length == 0) {
            return this.$message.warning('请选择成员')
          }
          let wxUserId = ''
          this.memberList.forEach(item => {
            wxUserId = wxUserId + ';' + item.userId
          })

          let options = {
            name: this.detailsData.name,
            groupNameTemplate: this.detailsData.groupNameTemplate,
            wxUserId: wxUserId.slice(1)
          }
          if (this.pageId) {
            options.id = this.pageId
            this.updateOpenEnterpriseChatRule(options, () => {
              this.$message.success('修改规则成功')
              this.$openNewPageBack()
            })
          } else {
            this.insertOpenEnterpriseChatRule(options, () => {
              this.$message.success('新建规则成功')
              this.$openNewPageBack()
            })
          }
        } else {
          return false
        }
      })
    },
    _selectedEmotion(val) {
      let inp = document.getElementById('groupNameTemplate')
      let insert = inp.selectionStart
      this.detailsData.groupNameTemplate = inp.value.substr(0, insert) + val + inp.value.substr(insert)
    },
    /* 获取数据 */
    // 新建规则
    insertOpenEnterpriseChatRule(options, callback) {
      this.$http.insertOpenEnterpriseChatRule(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改规则
    updateOpenEnterpriseChatRule(options, callback) {
      this.$http.updateOpenEnterpriseChatRule(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 规则详情
    getOpenEnterpriseChatRuleDetails(id) {
      this.$http.getOpenEnterpriseChatRuleDetails({ id }).then(res => {
        console.log(res.data.data)
        this.detailsData = res.data.data
        this.memberList = res.data.data.userList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mian-content {
  padding: 20px;
  background-color: #fff;
  .detailsData {
    max-width: 800px;
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
}
</style>