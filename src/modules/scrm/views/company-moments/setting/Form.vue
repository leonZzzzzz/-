<template>
  <div class="container">
    <div class="top-nav">
      <ul>
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="{
            active: item.isActive,
            borderRight: index == 0 && navList[1].isActive,
            borderLeft: index == navList.length - 1 && navList[navList.length - 2].isActive
          }"
          @click="changeNavBarFun(item.label, index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="setting-member" v-show="activeNav === 'member'">
      <div class="setting_member_box">
        <div class="setting_member_content">
          <div class="title">
            设置对外展示的成员
            <el-tooltip
              effect="light"
              placement="right"
              content="设置对外展示的成员，客户可在成员个人信息页进入动态圈查看企业动态记录"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="department-tree">
            <department-tree ref="department" :selectedList="memberList"> </department-tree>
          </div>

          <!-- <div class="sample">
        <div class="sample-tips">勾选需要展示企业动态入口的成员后，对应的成员个人信息页面将显示企业动态入口，如下示例图所示：</div>
        <img src="../../../images/sample.png" alt=""/>
      </div> -->
        </div>
      </div>
      <div class="footer_btn">
        <el-button type="primary" style="margin-left: 40px" @click="setMembers" :loading="syncLoading">保存</el-button>
      </div>
    </div>
    <div class="setting-guide" v-show="activeNav === 'guide'">
      <div class="module">
        <div class="title">配置<span class="t-guide" @click="goToGuidePage">查看指引</span></div>
        <div class="tips">
          <el-alert
            title="只有企业微信后台配置的属性与当前的属性名称一致时，动态圈才会生效"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </div>
        <div class="config">
          <el-form label-position="right" label-width="180px">
            <el-form-item label="属性名称" :rules="[{ required: true, message: '该项为必填项' }]">
              <el-input v-model="settingList.name" style="width: 200px" maxlength="5" show-word-limit></el-input>
              <el-button style="margin-left: 10px" type="text" @click="updateNameConfig()">保存</el-button>
              <!-- <el-tooltip style="margin-left: 10px" effect="dark" placement="right" content="">
                <i class="el-icon-question"></i>
              </el-tooltip> -->
            </el-form-item>
            <el-form-item label="链接标题" :rules="[{ required: true, message: '该项为必填项' }]">
              <el-input v-model="settingList.webTitle" style="width: 200px" maxlength="5" show-word-limit></el-input>
              <el-button style="margin-left: 10px" type="text" @click="updateTitleConfig()">保存</el-button>
              <!-- <el-tooltip style="margin-left: 10px" effect="dark" placement="right" content="">
                <i class="el-icon-question"></i>
              </el-tooltip> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import DepartmentTree from '../../../components/common/DepartmentTree'
import DepartmentTree from '../../../components/components/MemberTree'
export default {
  components: { DepartmentTree },
  data() {
    return {
      memberList: [],
      syncLoading: false,
      navList: [
        { name: '设置人员', label: 'member', isActive: true },
        { name: '动态圈设置', label: 'guide', isActive: false }
      ],
      activeNav: 'member',
      titleConfig: {}, // 动态圈标题，默认查看详情
      nameConfig: {}, // 动态圈链接名称配置，默认动态圈
      settingList:{}
    }
  },
  created() {
    // this.getMembers()
    // this.getTitleConfig()
    // this.getNameConfig()
  },
  mounted() {
    this.getMembers()
  },
  methods: {
    getMembers() {
      const loading = this.$loading({
        lock: true,
        // text: '请稍后',
        // spinner: 'el-icon-loading',
        // background: 'rgba(135, 135, 135, 0)',
        target: document.querySelector('.department-tree')
      })
      this.$http.theAdminListIsSet().then((res) => {
        loading.close()
        this.memberList = res.data.data
        console.log(this.memberList)
        this.$nextTick(() => {
          this.$refs.department.setCheckedNodes()
        })
      })
    },
    setMembers() {
      this.memberList = this.$refs.department.selectedMenu
      console.log(this.memberList)
      let list = []
      this.memberList.forEach((item) => {
        if(item.myId){
          list.push(item.id)
        }else{
          list.push(item.userId)
        }
      })
      list=list.toString()
      this.syncLoading = true
      this.$http.setMemberDynamicCircle({ userId: list }).then(() => {
        this.$message.success('保存成功')
        this.syncLoading = false
        this.getMembers()
      })
    },
    // 切换导航
    changeNavBarFun(val, index) {
      if (this.navList[index].isActive) {
        return
      }
      for (var i = 0; i < this.navList.length; i++) {
        this.navList[i].isActive = false
      }
      this.navList[index].isActive = true
      this.activeNav = val

      if (val === 'guide') {
        // this.getTitleConfig()
        // this.getNameConfig()
        this.getoutsideSetting()
      } else if (val === 'member') {
        this.getMembers()
      }
    },
    // 获取对外属性设置
    getoutsideSetting(){
      this.$http.getbusinessCardPropertySettingnew().then(res=>{
        this.settingList=res.data.data
      })
    },
    // 动态圈链接标题配置
    getTitleConfig() {
      this.$http.getConfigByKey('moments_link_title').then((res) => {
        this.titleConfig = res.data.data || {}
      })
    },
    // 动态圈名称
    getNameConfig() {
      this.$http.getConfigByKey('moments_name').then((res) => {
        this.nameConfig = res.data.data || {}
      })
    },
    updateTitleConfig() {
      let model = JSON.parse(JSON.stringify(this.titleConfig))
      this.$http.UpdatebusinessCardSettingnewinter(this.settingList).then((res) => {
        this.$message({
          message:res.data.message,
          type: 'success'
        })
        // this.getTitleConfig()
      })
    },
    updateNameConfig() {
      let model = JSON.parse(JSON.stringify(this.nameConfig))
      this.$http.UpdatebusinessCardSettingnewinter(this.settingList).then((res) => {
        this.$message({
          message: res.data.message,
          type: 'success'
        })
        // this.getNameConfig()
      })
    },
    // 跳转到配置指引页
    goToGuidePage() {
      this.$router.push('/main/scrm/moments/guide')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .top-nav {
    width: 100%;
    height: 44px;
    // background-color: #F5F5F5;
    display: flex;
    ul {
      display: flex;
      background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
      li {
        width: 120px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        background-color: #ebeef5;
        font-size: 14px;
        user-select: none;
        // border-radius: 20px;
        cursor: pointer;
        &.active {
          border-radius: 0px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: #ffffff;
        }
        &.borderLeft {
          border-bottom-left-radius: 10px;
        }
        &.borderRight {
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
  .setting-member {
    padding: 20px;
    background-color: #ffffff;
    height: calc(100% - 44px);
    box-sizing: border-box;
    .setting_member_box {
      height: calc(100% - 56px);
      overflow-y: auto;
      .setting_member_content {
        padding-bottom: 56px;
      }
    }

    .footer_btn {
      width: 100%;
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
    }
  }
  .setting-guide {
    padding: 20px;
    background-color: #ffffff;
    .module {
      .title {
        position: relative;
        padding: 10px 0;
        color: #606266;
        margin-bottom: 20px;
        &::before {
          content: '';
          width: 6px;
          height: 20px;
          background-color: #294a7b;
          position: absolute;
          top: 0;
          bottom: 0;
          left: -20px;
          top: 8px;
        }
        span {
          color: #294a7b;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .tips {
        margin-bottom: 20px;
        display: inline-block;
      }
    }
  }
}
.department-tree {
  max-width: 900px;
  margin-top: 20px;
}
.sample-tips {
  margin: 20px 0;
  color: #909399;
}
::v-deep .el-alert__icon {
  font-size: 20px;
  width: 20px;
}
::v-deep .el-alert__title {
  font-size: 14px;
  line-height: 20px;
}
</style>
