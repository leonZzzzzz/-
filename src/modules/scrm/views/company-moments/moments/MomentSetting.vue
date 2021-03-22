<template>
  <div class="moment-setting">
    <Title>基础信息</Title>
    <div class="base-info">
      <el-form label-width="auto" label-position="right">
        <el-form-item label="属性名称">
          <p class="xfo-p" v-show="!nameFlag">
            {{ settingList.name}}
            <el-button type="text" icon="el-icon-edit-outline" @click="clickIsShow('nameFlag', true)"></el-button>
          </p>
          <el-input
            v-show="nameFlag"
            ref="nameFlag"
            v-model="settingList.name"
            maxlength="5"
            show-word-limit
            placeholder="请输入属性名称"
            style="width: 200px"
            @blur="clickIsShow('nameFlag', false)"
            @change="isChangeFlag = true"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接标题">
          <p class="xfo-p" v-if="!titleFlag">
            {{ settingList.webTitle }}
            <el-button type="text" icon="el-icon-edit-outline" @click="clickIsShow('titleFlag', true)"></el-button>
          </p>
          <el-input
            v-show="titleFlag"
            ref="titleFlag"
            v-model="settingList.webTitle"
            maxlength="5"
            show-word-limit
            placeholder="请输入链接标题"
            style="width: 200px"
            @blur="clickIsShow('titleFlag', false)"
            @change="isChangeFlag = true"
          ></el-input>
        </el-form-item>
        <el-form-item label="样例">
          <el-button type="text" @click="onPreview">查看</el-button>
          <el-image-viewer 
            v-if="showViewer" 
            :on-close="closeViewer" 
            :url-list="[exampleUrl]" />
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="releaseMembersLoading">
      <div style="display: flex">
        <Title>设置对外展示的成员</Title>
        <el-tooltip
          style="margin-left: 10px"
          class="item"
          effect="light"
          content="设置对外展示的成员，客户可在成员个人信息页进入动态圈查看企业动态记录"
          placement="right"
        >
          <el-button type="text" icon="el-icon-question"></el-button>
        </el-tooltip>
      </div>
      <div class="release">
        <Tag v-for="(item, index) in releaseMembers" :key="index" :fontSize="14" imgType="circle" :url="item.avatar">{{
          item.name
        }}</Tag>
      </div>
      <el-button plain icon="el-icon-plus" size="small" style="margin-top: 10px" @click="dialogVisible.visible = true"
        >添加</el-button
      >
      <!-- <member-tree-compony-dialog
        :config="dialogVisible"
        @closeDialog="dialogVisible.visible = false"
        :selectedList="memberList"
        ref="department"
        @handleConfirm="setMembers"
      ></member-tree-compony-dialog> -->
      <department-dialog
        :config="dialogVisible"
        @closeDialog="dialogVisible.visible = false"
        :selectedList="memberList"
        ref="department"
        @handleConfirm="setMembers"
      ></department-dialog>
    </div>
    <!-- <Title>管理员权限</Title>
    <div class="admin"></div> -->
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Title from '@/modules/scrm/components/components/Title.vue'
import Tag from '@/modules/scrm/components/components/Tag.vue'
import MemberTreeComponyDialog from '@/modules/scrm/components/components/MemberTreeComponyDialog.vue'
import DepartmentDialog from '@/modules/scrm/components/components/MemberTreeLinkageDialog.vue'
export default {
  components: {ElImageViewer,Title, Tag, MemberTreeComponyDialog, DepartmentDialog },
  created() {
    this.getoutsideSetting()
    // this.getConfigByKey('title', 'moments_link_title')
    // this.getConfigByKey('name', 'moments_name')
    this.getMomentsMembers()
  },
  data() {
    return {
      showViewer:false,
      exampleUrl:'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com/public/pc-guide/moments_external_attr_01.png',
      title: {},
      name: {},
      nameFlag: false,
      titleFlag: false,
      releaseMembers: [],
      releaseMembersLoading: false,
      dialogVisible: {
        width: '800px',
        title: '允许发布朋友圈成员',
        visible: false
      },
      memberList: [],
      isChangeFlag: false,
      settingList:{}
    }
  },
  methods: {
    onPreview() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    // 获取对外属性设置
    getoutsideSetting(){
      this.$http.getbusinessCardPropertySettingnew().then(res=>{
        this.settingList=res.data.data
      })
    },
    /*页面渲染*/
    setMembers(list) {
      let userId = []
      list.forEach(item => {
        if(item.id){
          userId.push(item.id)
        }else{
          userId.push(item.userId)
        }
        
      })
      userId=userId.toString()
      this.$http.setMemberDynamicCircle({userId:userId}).then(res => {
        this.$message.success(res.data.message)
        this.dialogVisible.visible = false
        this.getMomentsMembers()
      })
      // this.setMomentsMembers(userId, res => {
      //   this.dialogVisible.visible = false
      //   this.getMomentsMembers()
      // })
    },
    clickIsShow(flag, bool) {
      this[flag] = bool
      if (bool) {
        this.$nextTick(() => {
          let dom = this.$refs[flag].$el.children[0].focus()
        })
      } else if (this.isChangeFlag) {
        this.isChangeFlag = false
        let options = {}
        if (flag == 'nameFlag') {
          options = this.name
        }
        if (flag == 'titleFlag') {
          options = this.title
        }
        this.$http.UpdatebusinessCardSettingnewinter(this.settingList).then(res => {
          this.$message.success(res.data.message)
        })
      }
    },
    /*获取数据*/
    // 1.0 获取动态圈信息
    getConfigByKey(dataName, type) {
      this.$http.getConfigByKey(type).then(res => {
        this[dataName] = res.data.data || { value: '' }
      })
    },
    // 2.0 获取权限成员
    getMomentsMembers() {
      this.memberList = []
      this.releaseMembersLoading = true
      this.$http.theAdminListIsSet().then(res => {
        this.releaseMembers = res.data.data
        this.releaseMembers.forEach(item => {
          this.memberList.push({
            id: item.userId,
            name: item.name,
            isDeleted: item.isDeleted
          })
        })
        this.releaseMembersLoading = false
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.moment-setting {
  padding: 20px;
  background-color: #fff;
  .el-form-item {
    margin: 20px 0;
  }
  .release {
    width: 800px;
    margin-top: 15px;
  }
  .xfo-p {
    width: 120px;
    .el-button {
      display: none;
    }
    &:hover {
      .el-button {
        display: inline-block;
      }
    }
  }
}
</style>