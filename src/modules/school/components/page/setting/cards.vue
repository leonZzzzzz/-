<template>
  <div class="wrap">
    <el-tabs type="border-card" class="border" @tab-click="handleClick">
      <el-tab-pane label="活动积分">
        <!-- <el-card class="card-wrapper" shadow="hover"> -->
        <div style="margin:30px">
          <span>开启活动积分</span>
          <span
            style="color:#999;font-size:14px;margin-left:100px;margin-right:200px;"
          >活动报名成功、分享活动、成功邀请获得、活动签到成功用户可获得的积分奖励</span>
          <el-switch
            v-model="scoreActivity.num"
            active-value="1"
            inactive-value="0"
            @change="updateConfig($event,scoreActivity)"
          ></el-switch>
        </div>
        <!-- </el-card> -->
      </el-tab-pane>
      <el-tab-pane label="课程积分">
        <!-- <el-card class="card-wrapper" shadow="hover"> -->
        <div style="margin:30px">
          <span>开启课程积分</span>
          <span
            style="color:#999;font-size:14px;margin-left:100px;margin-right:200px;"
          >课程报名成功、分享课程、成功邀请课程用户可获得的积分奖励</span>
          <el-switch
            v-model="coursePoint.num"
            active-value="1"
            inactive-value="0"
            @change="updateConfig($event,coursePoint)"
          ></el-switch>
        </div>
        <!-- </el-card> -->
      </el-tab-pane>
      <el-tab-pane label="论坛积分">
        <!-- <el-card class="card-wrapper" shadow="hover"> -->
        <div style="margin:30px">
          <div>
            <span>开启论坛积分</span>
            <span
              style="color:#999;font-size:14px;margin-left:100px;margin-right:200px;"
            >发表帖子、帖子评论、帖子转发、获得评论、获得点赞用户可获得的积分奖励</span>
            <el-switch
              v-model="forumPoint.num"
              active-value="1"
              inactive-value="0"
              @change="updateConfig($event,forumPoint)"
            ></el-switch>
          </div>
          <div style="margin-top:50px;">
            <template>
              <span class="point pointtitle">发表帖子</span>
              <span class="point">发表一篇帖子获得</span>
              <el-input-number
                :min="0"
                v-model="model.publishTopicPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分，每日上限获得</span>
              <el-input-number
                :min="0"
                v-model="model.publishTopicPointPerDay"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分</span>
            </template>
          </div>
          <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">帖子评论</span>
              <span class="point">发表一个评论获得</span>
              <el-input-number
                :min="0"
                v-model="model.replyPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分，每日上限获得</span>
              <el-input-number
                :min="0"
                v-model="model.replyPointPerDay"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">
                积分
                <span style="font-size:14px;color:#999">（评论字数至少在5个字以上才可获得积分）</span>
              </span>
            </template>
          </div>
          <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">帖子转发</span>
              <span class="point">转发一篇帖子获得</span>
              <el-input-number
                :min="0"
                v-model="model.shareTopicPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分</span>
            </template>
          </div>
          <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">获得评论</span>
              <span class="point">自己的帖子每获得</span>
              <el-input-number
                :min="0"
                v-model="model.validReplyQuantity"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">个评论，可获得</span>
              <el-input-number
                :min="0"
                v-model="model.topicReplyPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分</span>
            </template>
          </div>
          <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">获得点赞</span>
              <span class="point">自己的帖子每获得</span>
              <el-input-number
                :min="0"
                v-model="model.validPraiseQuantity"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">个赞，可获得</span>
              <el-input-number
                :min="0"
                v-model="model.topicPraisedPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分</span>
            </template>
          </div>
        </div>
        <!-- </el-card> -->
        <div class="bottom-btn">
          <el-button type="primary" @click="saveTag(forumPoint)" size="small">保存</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="常规积分">
        <!-- <el-card> -->
        <div style="margin:30px">
          <!-- <div>
            <span>开启常规积分</span>
            <span
              style="color:#999;font-size:14px;margin-left:100px;margin-right:200px;"
            >每日打卡、阅读文章、完善资料用户可获得的积分奖励</span>
            <el-switch
              v-model="scoreActivity.num"
              active-value="true"
              inactive-value="false"
              @change="updateConfig($event,scoreActivity)"
            ></el-switch>
          </div>-->
          <div style="margin-top:50px;">
            <template>
              <span class="point pointtitle">每日打卡</span>
              <span class="point">每日登陆打卡获得</span>
              <el-input-number
                :min="0"
                v-model="rules.dailySignInPoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">积分</span>
            </template>
          </div>
          <!-- <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">阅读文章</span>
              <span class="point">每阅读1篇文章获得</span>
              <el-input-number
                :min="0"
                v-model="scoreActivity.num"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">
                积分
                <span>（重复阅读不加分）</span>
              </span>
            </template>
          </div>-->
          <div style="margin-top:30px;">
            <template>
              <span class="point pointtitle">完善资料</span>
              <span class="point">完善个人资料获得</span>
              <el-input-number
                :min="0"
                v-model="rules.finishProfilePoint"
                size="small"
                style="width: 120px;margin:0 10px;color:#606266;"
              ></el-input-number>
              <span class="point">
                积分
                <span>（每人只能获取一次）</span>
              </span>
            </template>
          </div>
        </div>
        <!-- </el-card> -->
        <div class="bottom-btn">
          <el-button type="primary" @click="saveTag(rules)" size="small">保存</el-button>
        </div>
      </el-tab-pane>

      <!-- <el-tab-pane label="阅读积分">
        <div style="margin:30px">
          <span>开启阅读积分</span>
          <span
            style="color:#999;font-size:14px;margin-left:100px;margin-right:200px;"
          >阅读完后用户可获得的积分奖励</span>
          <el-switch
            v-model="coursePoint.num"
            active-value="1"
            inactive-value="0"
            @change="updateConfig($event,coursePoint)"
          ></el-switch>
        </div>
      </el-tab-pane>-->

      <el-tab-pane label="积分规则">
        <!-- <el-card> -->
        <div style="margin:30px">
          <Editor v-model="content"></Editor>
        </div>

        <!-- <Editor v-model="content"></Editor> -->

        <!-- </el-card> -->
        <div class="bottom-btn">
          <el-button type="primary" @click="updatePointRules(content)" size="small">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from 'apiSchool/common'
import Explain from './explain'
import upLoadMixin from '@/mixins/upLoadMixin'
import ConfigItem from './ConfigItem'
export default {
  mixins: [upLoadMixin],
  components: {
    Explain,
    ConfigItem
  },
  data() {
    return {
      content:'',
      scoreActivity:{
        code: "score-activity",
        description: "开启后，可以使用活动积分功能",
        id: "",
        name: "活动积分功能",
        open: true,
        showType: "checkbox",
        value: "checked",
        valueRange: null,
        num:'1'
      },
      coursePoint:{
        code: "score-course",
        description: "课程积分功能",
        id: "",
        name: "课程积分功能",
        open: true,
        showType: "checkbox",
        value: "checked",
        valueRange: null,
        num:'1'
      },
      forumPoint:{
        code: "score-course",
        description: "论坛积分功能",
        id: "",
        name: "论坛积分功能",
        open: true,
        showType: "checkbox",
        value: "checked",
        valueRange: null,
        num:'1'
      },
      commonPoint:{
        code: "score-course",
        description: "常规积分功能",
        id: "",
        name: "常规积分功能",
        open: true,
        showType: "checkbox",
        value: "checked",
        valueRange: null,
        num:'1'
      },
      model:{
        // id: "",
        publishTopicPoint: 0,
        publishTopicPointPerDay: 0,
        replyPoint: 0,
        replyPointPerDay: 0,
        shareTopicPoint: 0,
        shareTopicPointPerDay: 0,
        topicPraisedPoint: 0,
        topicPraisedPointPerDay: 0,
        topicReplyPoint: 0,
        topicReplyPointPerDay: 0,
        validPraiseQuantity: 0,
        validReplyLength: 0,
        validReplyQuantity: 0,
      },
      rules:{
        dailySignInPoint: 0,
        finishProfilePoint: 0,
      }
    }
  },
  created() {
    this.getVerifyType()
    // this.activitySignPostGet()
    // this.appCustomer()
    // this.getResourceAudit()
    // this.getCowebsAbout()
    this.releaseByCowebs('score-activity')
    // this.getRegisterAudit()
    // this.getTitle()
    this.getPointRules()
  },
  methods: {
    // 获取数据
    getVerifyType() {
      api.getPointSetting().then(res => {
        console.log(res)
        this.model =  res.data.data
        // delete this.model.id;
        // console.log(this.model)
      })
    },
    // 切换表头
    handleClick(tab) {
      var type=''
      if(tab.index==3){
        this.getrulepoint()
      }else if(tab.index==4){
        this.getPointRules()
      }else{
        console.log(9999999)
        if(tab.index==0){type='score-activity'
        }else if(tab.index==1)type='score-course'
        else if(tab.index==2)type='score-bbs'
        this.releaseByCowebs(type)
      }
    },
    
    releaseByCowebs(type) {
      api.isOffcheck(type).then(res => {
        if(type=='score-activity'){
          this.scoreActivity = Object.assign( this.scoreActivity,res.data.data)
          this.scoreActivity.num = this.scoreActivity.open?'1':'0'
        }else if(type=='score-course'){
          this.coursePoint = Object.assign( this.coursePoint,res.data.data)
          this.coursePoint.num = this.coursePoint.open?'1':'0'
        }else if(type=='score-bbs'){
          this.forumPoint = Object.assign( this.forumPoint,res.data.data)
          this.forumPoint.num = this.forumPoint.open?'1':'0'
        }
        // else{
        //   this.commonPoint = Object.assign( this.commonPoint,res.data.data)
        //   this.commonPoint.num = this.commonPoint.open?'1':'0'

        // }
          
        })
    },
    // 常规积分
    getrulepoint(){
      api.getrulepoint().then(res=>{
        this.rules = Object.assign( this.rules,res.data.data)
      })
    },
    // 积分规则
    getPointRules(){
      api.getPointRules().then(res=>{
        this.content = res.data.data.content|| ''
      })
    },
    // 修改积分规则 
    updatePointRules(content){
      const params={title:'积分规则',content}
      api.updatePointRules(params).then(res=>{
        this.$message.success('保存成功')
      })
    },
    // 开启/关闭积分
    updateConfig(e,data) {
      console.log(e,data)
      if(data.id){
        var params = {id:data.id,value:e=='1'?'checked':'unchecked'}
        api.isUpdateValue(params).then(() => {
          this.$message.success('保存成功')
        })
      } else {
        // api.isOffcheck('score-activity').then(() => {
        //   this.$message.success('保存成功')
        // })
      }
    },
    // 保存 
    saveTag(data){
      if(data.dailySignInPoint){
        api.updaterulepoint(this.rules).then(res=>{
          this.$message.success('保存成功')
        })
      }else{
        api.isUpdatepoint(this.model).then(res=>{
          console.log(res)
          this.$message.success('保存成功')
        })
      }
      
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
.point {
  font-size: 14px;
}
.pointtitle {
  margin-right: 50px;
}
.card-wrapper {
  border: none;
  margin-top: 15px;
  float: left;
}
.select-text {
  margin-right: 10px;
  font-size: 16px;
  color: #606266;
}

.tags-wrapper {
  white-space: normal;
  margin-top: 10px;
  font-size: 14px;
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
