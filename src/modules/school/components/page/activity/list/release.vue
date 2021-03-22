<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <!-- 基础设置 -->
        <div class="setting">
          <p class="title">基础设置</p>
          <el-form :model="model" ref="base" label-position="top" size="small">
            <el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.title" style="width:400px;" :maxlength="32" placeholder="最多可输入32位"></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item label="活动分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-select v-model="model.categoryId" size="small">
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="标签" class="inline right">
                <el-select v-model="model.activityTagLists" size="small" multiple>
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in tag" :key="i"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="序号" prop="seqNum" class="inline">
                <el-input-number size="small" v-model="model.seqNum" :min="0"></el-input-number>
              </el-form-item>
            </el-form-item>
            
            <el-form-item label="主办方">
              <el-input size="small" v-model="model.sponsor" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="承办方">
              <el-input size="small" v-model="model.organizer" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="城市" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.city" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="活动地点" prop="place" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.place" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.address" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="封面大图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
              <div class="upload-img-box" @click="showImgBox(true, 'iconUrl', 'radio', {width: 400, height: 250})">
                <img v-if="model.iconUrl" :src="`${imgHost}${model.iconUrl}`" style="width: 120px;">
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
              <!-- <p>建议尺寸200 * 155</p> -->
            </el-form-item>
            <el-form-item label="活动简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.info" type="textarea" :rows="4" style="width:780px;"></el-input>
            </el-form-item>
            <el-form-item label="活动内容" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
              <editor :content="model.content" @get-content="getContent" ref="editor" image-type='activity'></editor>
            </el-form-item>
          </el-form>
        </div>
        <!-- 时间设置 -->
        <div class="setting">
          <p class="title">时间设置</p>
          <el-form :model="model" ref="time" label-position="top" size="small">
            <el-form-item label="活动时间" prop="startTime" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker :editable="false" v-model="datetime.modelDatetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="报名时间" prop="activitySignSetting.signStartTime" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker :editable="false" v-model="datetime.signDatetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
              <el-form-item label="报名开始时间" class="inline right">
                <el-date-picker :editable="false" v-model="model.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="报名结束时间" class="inline">
                <el-date-picker :editable="false" v-model="model.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-form-item> -->
          </el-form>
        </div>
        <!-- 报名人数设置 -->
        <div class="setting">
          <p class="title">报名人数设置</p>
          <el-form :model="model.activitySignSetting" ref="signNum" label-position="top" size="small">
            <el-form-item>
              <el-form-item label="最大人数" prop="maxNum" :rules="{ required: true, message: '该字段不能为空'}" class="inline right">
                <el-input-number size="small" :min="1" v-model="model.activitySignSetting.maxNum" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <!-- 活动收费设置 -->
        <div class="setting">
          <p class="title">收费设置</p>
          <el-form :model="model" label-position="top" size="small">
            <el-form-item>
              <el-switch :disabled="$route.query.isRelease === 'true'" v-model="model.isEnableFee" active-text="开启付费"></el-switch>
            </el-form-item>
            <div style="margin-bottom: 18px;" v-if="model.isEnableFee">
              <el-form-item label="价格" prop="activityFee.price" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input type="number" size="small" v-model="model.activityFee.price" style="width: 200px;"></el-input>
              </el-form-item>
              <!-- <el-form-item label="VIP价格" prop="activityFee.vipPrice" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityFee.vipPrice" type="number" style="width: 200px;"></el-input>
              </el-form-item>-->
              <el-form-item v-if="false">
                <!-- <el-checkbox v-model="model.activityFee.isPromotion">开启促销</el-checkbox> -->
                <el-switch v-model="model.activityFee.isPromotion" active-text="开启促销"></el-switch>
              </el-form-item>
              <el-form-item v-if="model.activityFee.isPromotion" label="促销价格" prop="activityFee.promotionPrice" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityFee.promotionPrice" type="number" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item v-if="model.activityFee.isPromotion" label="促销时间" prop="activityFee.promotionStartTime" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-date-picker :editable="false" v-model="datetime.feeDatetime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 留言设置 -->
        <div class="setting" v-if="false">
          <p class="title">留言设置</p>
          <el-form :model="model" ref="model" label-position="top" size="small">
            <el-form-item>
              <el-form-item class="inline right">
                <el-switch v-model="model.isEnableComment" active-text="开启评论"></el-switch>
              </el-form-item>
              <el-form-item class="inline" v-if="model.isEnableComment">
                <el-switch v-model="model.isEnableCommentAudit" active-text="开启评论审核"></el-switch>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeIndex === 2">
        <!-- 报名限制 -->
        <div class="setting">
          <p class="title">报名限制</p>
          <el-form :model="model.activitySignSetting" ref="unsignEndTime" label-position="top" size="small">
            <el-form-item>
              <!-- <el-switch v-model="model.activitySignSetting.isNeedSubscribe" active-text="是否需要关注公众号" class="right"></el-switch> -->
              <el-switch v-model="model.activitySignSetting.isEnableUnsign" active-text="是否开启取消报名"></el-switch>
            </el-form-item>
            <el-form-item v-if="model.activitySignSetting.isEnableUnsign" label="取消报名结束时间" prop="unsignEndTime" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="model.activitySignSetting.unsignEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-switch v-model="model.activitySignSetting.isEnableAudit" active-text="报名是否需要审核"></el-switch>
            </el-form-item>
          </el-form>
          <el-form :model="model.activitySignSetting" ref="audit" label-position="top" size="small" v-if="model.activitySignSetting.isEnableAudit && model.activitySignSetting.isEnableWxTemplateRemind">
            <el-form-item label="审核通过信息" prop="auditPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]" >
              <el-input size="small" v-model="model.activitySignSetting.auditPassMsg" type="textarea" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item
              label="审核不通过信息" prop="auditNotPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.activitySignSetting.auditNotPassMsg" type="textarea" style="width:500px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 提醒信息设置 -->
        <div class="setting">
          <p class="title">提醒信息设置</p>
          <el-form :model="model.activitySignSetting" ref="activitySignSetting" label-position="top" size="small">
            <el-form-item label="" prop="isEnableRemindMsg" class="inline right">
              <el-switch v-model="model.activitySignSetting.isEnableRemindMsg" active-text="提醒信息" class="right"></el-switch>
              <!-- <el-switch v-model="model.activitySignSetting.isEnableWxRemind" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="微信客服接口通知" class="right"></el-switch> -->
              <el-switch v-model="model.activitySignSetting.isEnableWxTemplateRemind" v-if="model.activitySignSetting.isEnableRemindMsg" active-text="微信模板消息通知"></el-switch>
            </el-form-item>
            <el-form-item v-if="model.activitySignSetting.isEnableRemindMsg">
              <!-- <el-form-item label="报名成功信息" prop="signMsg" :rules="[{ required: true, message: '该字段不能为空'}]" v-if="model.activitySignSetting.isEnableWxRemind">
                <el-input size="small" v-model="model.activitySignSetting.signMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item> -->
              <div v-if="model.activitySignSetting.isEnableWxTemplateRemind">
                <el-form-item label="活动开始前提前多少分钟提醒" prop="aheadTime" :rules="[{ required: true, message: '该字段不能为空'}]">
                  <el-input-number size="small" v-model="model.activitySignSetting.aheadTime" :min="0" @change="numberChange"></el-input-number>
                  <span style="margin-left: 30px;" v-if="model.activitySignSetting.aheadTime && model.startTime && model.activitySignSetting.remaindTime">提醒时间为：{{model.activitySignSetting.remaindTime}}</span>
                </el-form-item>
                <el-form-item
                  label="消息模版提醒标题" prop="remaindTitle" :rules="[{ required: true, message: '该字段不能为空'}]">
                  <el-input size="small" v-model.trim="model.activitySignSetting.remaindTitle" style="width:400px;" :maxlength="32"></el-input>
                </el-form-item>
                <el-form-item label="消息模版提醒内容" prop="remaindInfo" :rules="[{ required: true, message: '该字段不能为空'}]">
                  <el-input size="small" v-model="model.activitySignSetting.remaindInfo" style="width:400px;"></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名自定义字段设置 -->
        <div class="setting">
          <p class="title">报名自定义字段设置</p>
          <el-form>
            <el-form-item>
              <el-switch v-model="model.activitySignSetting.isShowSignMembers" active-text="显示已报名信息" class="right"></el-switch>
            </el-form-item>
          </el-form>
          <!-- <p class="desc">
            <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
          </p> -->
          <table cellpadding="0" cellspacing="0" class="act-table">
            <tbody>
              <tr>
                <td>序号</td>
                <td>输入类型</td>
                <td>显示名称</td>
                <!-- <td>对应会员字段</td> -->
                <td>选项</td>
                <td>必填</td>
                <td>已报名资料显示</td>
                <td>操作</td>
              </tr>
              <tr v-for="(item, i) in model.signDataSettingList" :key="i">
                <td>
                  <el-input-number size="mini" v-model="item.sort" style="width: 100px;" :disabled="model.isRelease"></el-input-number>
                </td>
                <td>
                  <el-select v-model="item.type" placeholder="请选择" size="mini" style="width: 120px;" :disabled="item.id && item.id !== '' || model.isRelease">
                    <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="item.name" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="model.isRelease"></el-input>
                </td>
                <!-- <td>
                <el-input v-model="item.fieldName" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="item.id && item.id !== ''  || model.isRelease"></el-input>
                </td>-->
                <td>
                  <el-input :disabled="item.type !== 2 && item.type !== 3 || model.isRelease" v-model="item.options" placeholder="请输入内容" size="mini" style="width: 200px;"></el-input>
                </td>
                <td>
                  <el-switch v-model="item.isRequired" active-text></el-switch>
                </td>
                <td>
                  <el-switch v-model="item.isShow" active-text></el-switch>
                </td>
                <td>
                  <el-button type="danger" size="mini" @click="delDataSetting(i)" :disabled="model.isRelease">删除</el-button>
                </td>
              </tr>
              <el-button type="primary" size="mini" class="add" @click="addDataSetting()" :disabled="model.isRelease">新增</el-button>
            </tbody>
          </table>
          <div style="display: inline-block; padding: 5px 10px 10px;margin-top: 10px;font-size: 14px;line-height: 1.5;color: #777;background: #F5F5F5;">
            备注：<br/>
            1.报名默认字段请不要随便修改，如需增加其他字段，请点击“新增”；<br/>
            2.输入类型为单选或多选时，选项请以英文下划线“_”分隔；<br/>
            3.已报名资料显示：关闭后，用户查看已报名名单则隐藏此字段；<br/>
            4.报名字段：关闭后，用户报名是则会隐藏此字段，无需填写
          </div>
        </div>
      </div>
      <div v-show="activeIndex === 3">
        <el-form label-position="top" size="small" style="margin-bottom: 22px;">
          <el-form-item label="">
            <el-switch v-model="model.isEnableCheckin" active-text="设置活动签到"></el-switch>
          </el-form-item>
        </el-form>
        <div v-if="model.isEnableCheckin">
          <!-- 签到时间设置 -->
          <div class="setting">
            <p class="title">签到时间设置</p>
            <table cellpadding="0" cellspacing="0" class="act-table">
              <tbody>
                <tr>
                  <th style="width: 220px;">签到开始时间</th>
                  <th style="width: 220px;">签到结束时间</th>
                  <th style="width: 220px;">签到迟到时间</th>
                  <th style="width: 80px;">操作</th>
                </tr>
                <tr v-for="(item, i) in model.activityCheckinSetting.checkinTimeList" :key="i">
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :editable="false"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="item.checkinLateTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
                  </td>
                  <td>
                    <el-button type="danger" size="mini" @click="delCheckTime(i)">删除</el-button>
                  </td>
                </tr>
                <el-button type="primary" size="mini" class="add" @click="addCheckTime()">新增</el-button>
              </tbody>
            </table>
          </div>
          <!-- 签到提醒设置 -->
          <div class="setting">
            <p class="title">签到提醒设置</p>
            <el-form :model="model.activityCheckinSetting" label-position="top" size="small">
              <el-form-item label="" prop="isEnableRemindMsg" class="inline right">
                <el-switch v-model="model.activityCheckinSetting.isEnableRemindMsg" active-text="提醒信息" class="right"></el-switch>
                <el-switch v-model="model.activityCheckinSetting.isEnableWxRemind" v-show="model.activityCheckinSetting.isEnableRemindMsg" active-text="微信客服接口通知" class="right"></el-switch>
                <el-switch v-model="model.activityCheckinSetting.isEnableWxTemplateRemind" v-show="model.activityCheckinSetting.isEnableRemindMsg" active-text="微信模板消息通知"></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到提醒回复 -->
          <div class="setting">
            <p class="title">签到提醒设置</p>
            <el-form :model="model.activityCheckinSetting" ref="checkRemind" label-position="top" size="mini">
              <el-form-item label="签到回复" prop="checkinMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="未报名直接签到信息" prop="checkinBySuddenMsg" :rules="[{ required: true, message: '该字段不能为空'}]" >
                <el-input size="small" v-model="model.activityCheckinSetting.checkinBySuddenMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
              <!-- <el-form-item label="重复签到信息" prop="checkinRepeatMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinRepeatMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>-->
              <el-form-item label="签到不通过信息" prop="checkinNotPassMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinNotPassMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到方式设置 -->
          <div class="setting">
            <p class="title">签到方式设置</p>
            <el-form :model="model.activityCheckinSetting" ref="activityCheckinSetting" label-position="top" size="mini">
              <el-form-item>
                <el-form-item>
                  <el-switch v-model="model.activityCheckinSetting.isCheckinCode" active-text="开启暗号签到" class="right"></el-switch>
                </el-form-item>
                <el-form-item label="签到暗号" prop="checkinCode" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right" v-if="model.activityCheckinSetting.isCheckinCode">
                  <el-input size="small" v-model="model.activityCheckinSetting.checkinCode" placeholder="请输入签到暗号" style="width:200px;"></el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-form-item label="" class="inline right">
                  <el-switch v-model="model.activityCheckinSetting.isEnableSudden" active-text="允许未报名直接签到"></el-switch>
                </el-form-item>
                <el-form-item label="" class="inline right">
                  <el-switch v-model="model.activityCheckinSetting.isEnableMobileCheckin" active-text="允许手机号码签到"></el-switch>
                </el-form-item>
                <el-form-item label="" class="inline" v-if="model.activityCheckinSetting.isEnableMobileCheckin">
                  <el-switch v-model="model.activityCheckinSetting.isRequireSelfCheckin" active-text="是否需要报名本人签到"></el-switch>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-form-item label="" class="inline right">
                  <el-switch v-model="model.activityCheckinSetting.isEnableAirborne" active-text="开启空降嘉宾签到"></el-switch>
                </el-form-item>
                <el-form-item label="" class="inline" v-if="model.activityCheckinSetting.isEnableAirborne">
                  <el-switch v-model="model.activityCheckinSetting.isShowAirborne" active-text="将空降嘉宾功能显示到签到页面"></el-switch>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到图片设置 -->
          <div class="setting" v-if="model.activityCheckinSetting.checkinCode || model.activityCheckinSetting.isEnableMobileCheckin">
            <p class="title">签到图片设置</p>
            <el-form :model="model.activityCheckinSetting" ref="checkImg" label-position="top" size="mini">
              <el-form-item label="签到背景图片" prop="checkUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="showImgBox(true, 'activityCheckinSetting.checkUrl', 'radio', {width: 248.7, height: 400})">
                  <img v-if="model.activityCheckinSetting.checkUrl" :src="`${imgHost}${model.activityCheckinSetting.checkUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
              <el-form-item label="签到成功图片" prop="successUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="showImgBox(true, 'activityCheckinSetting.successUrl', 'radio', {width: 248.7, height: 400})">
                  <img v-if="model.activityCheckinSetting.successUrl" :src="`${imgHost}${model.activityCheckinSetting.successUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
              <el-form-item label="签到失败图片" prop="failUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
                <div class="upload-img-box" @click="showImgBox(true, 'activityCheckinSetting.failUrl', 'radio', {width: 248.7, height: 400})">
                  <img v-if="model.activityCheckinSetting.failUrl" :src="`${imgHost}${model.activityCheckinSetting.failUrl}`" style="width: 120px;">
                  <i v-else class="el-icon-plus upload-icon"></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit()" style="margin-right: 30px;" size="small" :loading="loading">保存</el-button>
    </div>
    <image-dialog :visible="digImgWrap" image-type='activity' :img-name="imgName" @close-imgbox="showImgBox" @get-imgsrc="onGetImgsrc" :cropper-option="cropperOption"></image-dialog>
  </div>
</template>

<script>
import editor from 'commonSchool/editor'
import api from "apiSchool/common"
import upLoadMixin from 'jsSchool/upLoadMixin'

export default {
  mixins: [upLoadMixin],
  components: {
    editor,
  },
  data() {
    return {
      cropperOption: {
        autoCropWidth: 400,
        autoCropHeight: 250,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false,
      },
      dataLoading: false,
      areaHeight: 0,
      tabbar: [
        { index: 1, name: '活动设置' },
        { index: 2, name: '高级设置' },
        // { index: 3, name: '签到设置' },
        // { index: 4, name: '子活动设置' },
      ],
      activeIndex: 1,
      datetime: {
        modelDatetime: '',
        signDatetime: '',
        feeDatetime: '',
      },
      activityTagList: [],
      model: {
        type: 1,
        payWay: 'online',
        title: '',
        status: '',
        categoryId: '',
        seqNum: 0,
        couponRuleId: '',
        // activityTagList: [],
        // activityTagLists: [],
        isRelease: false,
        iconUrl: '',
        info: '',
        sponsor: '',
        organizer: '',
        city: '',
        place: '',
        address: '',
        startTime: '',
        endTime: '',
        isEnableComment: false,
        isEnableCommentAudit: false,
        isEnableFee: false,
        isEnableAloneItem: false,
        content: '',
        activityFee: {
          price: '',
          vipPrice: '',
          isPromotion: false,
          promotionPrice: '',
          promotionStartTime: '',
          promotionStartTime: '',
        },
        activitySignSetting: {
          maxNum: 100,
          singleNum: 1,
          vipLevel: 0,
          isShowSignMembers: true,
          isNeedSubscribe: false,
          isEnableAudit: false,
          signStartTime: '',
          signEndTime: '',
          isEnableUnsign: false,
          unsignEndTime: '',
          signMsg: '您已报名成功',
          auditPassMsg: '您的报名审核通过',
          auditNotPassMsg: '您的报名审核不通过',
          isEnableRemindMsg: true,
          isEnableWxRemind: !true,
          isEnableWxTemplateRemind: false,
          remaindTime: '',
          aheadTime: '',
          remaindTitle: '',
          remaindInfo: '请准时参加~',
        },
        isEnableCheckin: false,
        activityCheckinSetting: {
          isEnableRemindMsg: true,
          isEnableWxRemind: true,
          isEnableWxTemplateRemind: false,
          isCheckinCode: false,
          checkinCode: '',
          isEnableSudden: false,
          isEnableMobileCheckin: true,
          isRequireSelfCheckin: true,
          isEnableAirborne: false, //是否开启空降嘉宾签到
          isShowAirborne: false, //是否将空降嘉宾功能显示到签到页面
          checkinVitalityScore: '',
          checkinMsg: '成功签到',
          checkinBySuddenMsg: '请先报名',
          // checkinRepeatMsg: "请勿重复签到",
          checkinNotPassMsg: '签到不通过',
          checkinTimeList: [
            {
              checkinStartTime: '',
              checkinEndTime: '',
              checkinLateTime: '',
            },
          ],
          checkUrl: '',
          successUrl: '',
          failUrl: '',
        },
        signDataSettingList: [],
        activityItemList: [],
      },
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 },
        // { name: '时间选择', value: 4 },
        // { name: '图片', value: 5 },
        // { name: '音乐', value: 6 },
        // { name: '文件', value: 7 },
      ],
      category: [],
      tag: [],
      couponRule: [],
      imgName: '',
      itemsName: '',
      loading: false,
      shareHost: '',
      orderType: '',
    }
  },
  created() {
    // this.getMobileUrl()
    // this.activityOrderTypeGet()
    this.listCategory()
    // this.listTag()
    if (this.$route.query.id) {
      this.dataLoading = true
      this.getActivity(this.$route.query.id)
    } else {
      this.getSignDataSetting()
    }
  },
  mounted() {
    this.getHeights()
    window.onresize = () => {
      this.getHeights()
    }
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 设置高度
    getHeights() {
      // let wrapHeight = document.getElementsByClassName('wrap')[0].offsetHeight
      // this.areaHeight = wrapHeight - 162
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    // 切换tab
    handleSelect(index) {
      if (this.activeIndex === index) return false
      this.activeIndex = index
      this.$refs.context.scrollTop = 0
    },
    // 获取域名
    getMobileUrl() {
      api.getMobileUrl().then(res => {
        this.shareHost = res.data.data.url + '/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&'
      })
    },
    // 输入提前多少分钟提醒
    numberChange() {
      if (this.model.activitySignSetting.aheadTime && this.model.startTime) {
        this.remaindTime()
      }
    },
    // 提前多少分钟提醒
    remaindTime() {
      let params = {
        startTime: this.model.startTime,
        aheadTime: this.model.activitySignSetting.aheadTime,
      }
      api.remaindTime(params).then(res => {
        this.model.activitySignSetting.remaindTime = res.data.data
      })
    },
    // // 获取分类树
    // treeByTypeCategory() {
    //   api.treeByTypeCategory({ type: 2 }).then(res => {
    //     let data = res.data.data[0]
    //     this.listCategory(data.id)
    //   })
    // },
    // // 获取活动分类
    // listCategory(parentId) {
    //   api.listCategory({ parentId: parentId }).then(res => {
    //     this.category = res.data.data.list
    //   })
    // },
    listCategory() {
      api.treeByTypeCategory({type: 3}).then(res => {
        console.log(res.data);
        this.category = res.data.data
      })
    },
    // 获取标签
    listTag() {
      api.listTag({ type: 3 }).then(res => {
        this.tag = res.data.data.list
      })
    },
    // 获取优惠券
    listCouponRule() {
      api.listCouponRule({ pageSize: 100, pageNum: 1, ruleType: 2 }).then(res => {
        this.couponRule = res.data.data.list
      })
    },
    // 获取排序规则
    activityOrderTypeGet() {
      api.activityOrderTypeGet().then(res => {
        this.orderType = res.data.data.value
        if (this.orderType == 1 && !this.$route.query.id) this.getActivitySort()
      })
    },
    // 获取活动数量
    getActivitySort() {
      api.getActivitySort().then(res => {
        this.model.seqNum = res.data.data
      })
    },
    // 获取活动详情
    getActivity(id, state) {
      api
        .getActivity({ id: id })
        .then(res => {
          let data = res.data.data
          if (!data.activityCheckinSetting) {
            let activityCheckinSetting = {
              isEnableRemindMsg: true,
              isEnableWxRemind: true,
              isEnableWxTemplateRemind: false,
              isCheckinCode: false,
              checkinCode: '',
              isEnableSudden: false,
              isEnableMobileCheckin: true,
              isRequireSelfCheckin: true,
              isEnableAirborne: false, //是否开启空降嘉宾签到
              isShowAirborne: false, //是否将空降嘉宾功能显示到签到页面
              checkinVitalityScore: '',
              checkinMsg: '成功签到',
              checkinBySuddenMsg: '请先报名',
              // checkinRepeatMsg: "请勿重复签到",
              checkinNotPassMsg: '签到不通过',
              checkinTimeList: [
                {
                  checkinStartTime: '',
                  checkinEndTime: '',
                  checkinLateTime: '',
                },
              ],
              checkUrl: '',
              successUrl: '',
              failUrl: '',
            }
            data.activityCheckinSetting = activityCheckinSetting
          }
          if (!data.activityFee) {
            let activityFee = {
              price: '',
              vipPrice: '',
              isPromotion: false,
              promotionPrice: '',
              promotionStartTime: '',
              promotionStartTime: '',
            }
            data.activityFee = activityFee
          } else {
            if (!data.activityFee.price) {
              data.activityFee.price = ''
            }
          }
          // data.activityTagLists = []
          // if (data.activityTagList.length > 0) {
          //   data.activityTagList.map(item => {
          //     data.activityTagLists.push(item.tagId)
          //   })
          // }
          data.activityCheckinSetting.isCheckinCode = data.activityCheckinSetting.checkinCode ? true : false

          this.model = data
          this.datetime.modelDatetime = [this.model.startTime, this.model.endTime]
          this.datetime.signDatetime = [
            this.model.activitySignSetting.signStartTime,
            this.model.activitySignSetting.signEndTime,
          ]

          if (this.model.activityFee.isPromotion)
            this.datetime.feeDatetime = [
              this.model.activityFee.promotionStartTime,
              this.model.activityFee.promotionEndTime,
            ]
          if (this.model.activityFee.price) this.model.activityFee.price = this.model.activityFee.price / 100
          if (this.model.activityFee.vipPrice) this.model.activityFee.vipPrice = this.model.activityFee.vipPrice / 100
          if (this.model.activityFee.promotionPrice)
            this.model.activityFee.promotionPrice = this.model.activityFee.promotionPrice / 100

          if (this.$route.query.copy === 'true' && !state) this.model = this.copy(this.model)
          this.dataLoading = false
          console.log(this.model)
        })
        .catch(err => {
          this.dataLoading = false
        })
    },
    // 复制活动
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map(item => {
            for (let key in item) {
              if (key === 'id' || key === 'createTime' || key === 'activityId') {
                delete item[key]
              }
            }
          })
        }
        if (model[key].constructor === Object) {
          for (let v in model[key]) {
            if (model[key][v].constructor === Array) {
              model[key][v].map(item => {
                for (let key in item) {
                  if (key === 'checkinSettingId') {
                    delete item[key]
                  }
                }
              })
            }
            if (v === 'id' || v === 'createTime' || v === 'activityId') {
              delete model[key][v]
            }
          }
        }
        if (key === 'id' || key === 'createTime' || key === 'activityId') {
          delete model[key]
        }
      }
      model.isRelease = false
      return model
    },
    // 获取报名字段
    getSignDataSetting() {
      api.getSignDataSetting().then(res => {
        // res.data.data.map(item => {
        //   item.isSystem = false
        // })
        this.model.signDataSettingList = res.data.data
        console.log(this.model.signDataSettingList);
      })
    },
    // 添加报名字段
    addDataSetting() {
      let data = {
        sort: (this.model.signDataSettingList.length + 1) * 10,
        name: '',
        fieldName: '',
        type: 1,
        options: '',
        isRequired: true,
        isShow: true,
        isSystem: false,
      }
      this.model.signDataSettingList.push(data)
    },
    // 删除报名字段
    delDataSetting(i) {
      this.model.signDataSettingList.splice(i, 1)
    },
    // 添加签到时间
    addCheckTime() {
      this.model.activityCheckinSetting.checkinTimeList.push({
        checkinStartTime: '',
        checkinEndTime: '',
        checkinLateTime: '',
      })
    },
    // 删除签到时间
    delCheckTime(i) {
      this.model.activityCheckinSetting.checkinTimeList.splice(i, 1)
    },
    // 添加子活动
    addItem() {
      let data = {
        title: this.model.title,
        place: this.model.place,
        address: this.model.address,
        info: this.model.info,
        startTime: this.model.startTime,
        endTime: this.model.endTime,
        activityFee: {
          price: this.model.activityFee.price,
          vipPrice: this.model.activityFee.vipPrice,
          promotionPrice: this.model.activityFee.promotionPrice,
          isPromotion: this.model.activityFee.isPromotion,
          promotionStartTime: this.model.activityFee.promotionStartTime,
          promotionEndTime: this.model.activityFee.promotionEndTime,
        },
        activitySignSetting: {
          maxNum: this.model.activitySignSetting.maxNum,
          singleNum: this.model.activitySignSetting.singleNum,
        },
        activityCheckinSetting: {
          checkinTimeList: [],
        },
      }
      this.model.activityItemList.push(data)
    },
    // 删除子活动
    delItem(i) {
      this.model.activityItemList.splice(i, 1)
    },
    // 添加子活动签到时间
    addItemCheckTime(i) {
      this.model.activityItemList[i].activityCheckinSetting.checkinTimeList.push({
        checkinStartTime: '',
        checkinEndTime: '',
        checkinLateTime: '',
      })
    },
    // 删除子活动签到时间
    delItemCheckTime(i, k) {
      this.model.activityItemList[i].activityCheckinSetting.checkinTimeList.splice(i, 1)
    },
    // 获取编辑器内容
    getContent(content) {
      this.model.content = content
    },
    // 检查
    check() {
      let state = false
      this.$refs.base.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将基础设置信息填写完整！')
        return false
      }

      this.$refs.time.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将时间设置信息填写完整！')
        return false
      }

      let thisResult = this.util.compareTime(this.model.activitySignSetting.signEndTime, this.model.endTime)
      if (!thisResult) {
        this.$message.error('报名结束时间不能大于活动结束时间！')
        return false
      }

      this.$refs.signNum.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将报名人数设置信息填写完整！')
        return false
      }

      if (this.model.title.length > 32) {
        this.$message.error('活动名称不能大于32个字符')
        return false
      }

      if (this.model.activitySignSetting.isEnableUnsign) {
        this.$refs.unsignEndTime.validate(valid => {
          state = valid
        })
        if (!state) {
          this.$message.error('请填写取消报名结束时间！')
          return false
        }
      }

      if (this.model.activitySignSetting.isEnableAudit && this.model.activitySignSetting.isEnableWxTemplateRemind) {
        this.$refs.audit.validate(valid => {
          state = valid
        })
        if (!state) {
          this.$message.error('请填写审核信息！')
          return false
        }
      }

      if (this.model.activitySignSetting.remaindTitle.length > 32) {
        this.$message.error('消息模板提醒标题不能大于32个字符')
        return false
      }

      if (this.model.isEnableFee && this.model.activityFee.price === '') {
        this.$message.error('请填写收费金额！')
        return false
      }

      if (this.model.isEnableFee && this.model.activityFee.price == 0) {
        this.$message.error('收费金额不可为0！')
        return false
      }

      this.$refs.activitySignSetting.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将提醒信息设置信息填写完整！')
        return false
      }

      if (this.model.isEnableCheckin) {
        let checkinTimeList = this.model.activityCheckinSetting.checkinTimeList
        for (let i = 0; i < checkinTimeList.length; i++) {
          if (!checkinTimeList[i].checkinStartTime) {
            this.$message.error('请填写签到开始时间')
            return false
          } else if (!checkinTimeList[i].checkinEndTime) {
            this.$message.error('请填写签到结束时间')
            return false
          } else if (!checkinTimeList[i].checkinLateTime) {
            this.$message.error('请填写签到迟到时间')
            return false
          }
        }

        this.$refs.checkRemind.validate(valid => {
          state = valid
        })
        if (!state) {
          this.$message.error('请将签到提醒设置信息填写完整！')
          return false
        }
        if (this.model.activityCheckinSetting.isCheckinCode) {
          this.$refs.activityCheckinSetting.validate(valid => {
            state = valid
          })
          if (!state) {
            this.$message.error('请填写签到暗号！')
            return false
          }
        }
        if (this.model.activityCheckinSetting.checkinCode || this.model.activityCheckinSetting.isEnableMobileCheckin) {
          this.$refs.checkImg.validate(valid => {
            state = valid
          })
          if (!state) {
            this.$message.error('请将签到图片设置信息填写完整！')
            return false
          }
        }

        if (!state) return false
      } else {
        this.model.activityCheckinSetting.checkinTimeList = []
      }

      return state
    },
    submit(state) {
      this.$refs.editor.getContent()
      if (!this.check()) return false
      let model = JSON.parse(JSON.stringify(this.model))
      if (!model.activityCheckinSetting.isCheckinCode) model.activityCheckinSetting.checkinCode = ''
      if (model.activityFee.price) model.activityFee.price = Math.floor(model.activityFee.price * 100)
      if (model.activityFee.vipPrice) model.activityFee.vipPrice = Math.floor(model.activityFee.vipPrice * 100)
      if (model.activityFee.promotionPrice)
        model.activityFee.promotionPrice = Math.floor(model.activityFee.promotionPrice * 100)
      
      if (state) model.status = 0
      else model.status = 1
      // return
      this.loading = true
      if (this.$route.query.copy) this.addActivity(model, state)
      else if (this.$route.query.id) this.updateActivity(model, state)
      else this.addActivity(model, state)
    },
    addActivity(model, state) {
      api
        .addActivity(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          if (state) {
            this.getActivity(res.data.message, true)
          } else {
            this.$router.go(-1)
          }
        })
        .catch(err => {
          this.loading = false
          if (/超时/.test(err.data.message)) {
            this.closeLogin(true)
          }
        })
    },
    updateActivity(model, state) {
      api
        .updateActivity(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          if (state) {
            this.getActivity(res.data.message, true)
          } else {
            this.$router.go(-1)
          }
        })
        .catch(err => {
          this.loading = false
          if (/超时/.test(err.data.message)) {
            this.closeLogin(true)
          }
        })
    },
  },
  watch: {
    'datetime.modelDatetime'(val) {
      if (val) {
        this.model.startTime = val[0]
        this.model.endTime = val[1]
        if (this.model.activitySignSetting.aheadTime) {
          this.remaindTime()
        }
      } else {
        this.model.startTime = ''
        this.model.endTime = ''
      }
    },
    'datetime.feeDatetime'(val) {
      if (val) {
        this.model.activityFee.promotionStartTime = val[0]
        this.model.activityFee.promotionEndTime = val[1]
      } else {
        this.model.activityFee.promotionStartTime = ''
        this.model.activityFee.promotionEndTime = ''
      }
    },
    'datetime.signDatetime'(val) {
      if (val) {
        this.model.activitySignSetting.signStartTime = val[0]
        this.model.activitySignSetting.signEndTime = val[1]
      } else {
        this.model.activitySignSetting.signStartTime = ''
        this.model.activitySignSetting.signEndTime = ''
      }
    },
    'model.activitySignSetting.isEnableRemindMsg'(val) {
      if (val) {
        this.model.activitySignSetting.isEnableWxRemind = true
      } else {
        this.model.activitySignSetting.isEnableWxRemind = false
        this.model.activitySignSetting.isEnableWxTemplateRemind = false
      }
    },
    'model.activitySignSetting.isEnableWxRemind'(val) {
      if (!val && !this.model.activitySignSetting.isEnableWxTemplateRemind) {
        this.$nextTick(() => {
          this.model.activitySignSetting.isEnableRemindMsg = false
        })
      }
    },
    'model.activitySignSetting.isEnableWxTemplateRemind'(val) {
      if (!val && !this.model.activitySignSetting.isEnableWxRemind) {
        this.$nextTick(() => {
          this.model.activitySignSetting.isEnableRemindMsg = false
        })
      }
    },
    'model.activityCheckinSetting.isEnableRemindMsg'(val) {
      if (val) {
        this.model.activityCheckinSetting.isEnableWxRemind = true
      } else {
        this.model.activityCheckinSetting.isEnableWxRemind = false
        this.model.activityCheckinSetting.isEnableWxTemplateRemind = false
      }
    },
    'model.activityCheckinSetting.isEnableWxRemind'(val) {
      if (!val && !this.model.activityCheckinSetting.isEnableWxTemplateRemind) {
        this.$nextTick(() => {
          this.model.activityCheckinSetting.isEnableRemindMsg = false
        })
      }
    },
    'model.activityCheckinSetting.isEnableWxTemplateRemind'(val) {
      if (!val && !this.model.activityCheckinSetting.isEnableWxRemind) {
        this.$nextTick(() => {
          this.model.activityCheckinSetting.isEnableRemindMsg = false
        })
      }
    },
    'model.activityCheckinSetting.isEnableMobileCheckin'(val) {
      if (!val) {
        this.model.activityCheckinSetting.isRequireSelfCheckin = false
      }
    },
    'model.isEnableComment'(val) {
      if (!val) this.model.isEnableCommentAudit = false
    },
    'model.title'(val) {
      // if (val) this.model.activitySignSetting.remaindTitle = `您参加的${val}即将开始`
      // else this.model.activitySignSetting.remaindTitle = `您参加的活动即将开始`
      if (!val) this.model.activitySignSetting.remaindTitle = `您参加的活动即将开始`
    },
    'model.activitySignSetting.remaindTitle'(val) {
      if (!val) this.model.activitySignSetting.remaindTitle = `您参加的活动即将开始`
    },
  },
}
</script>

<style lang="scss" scoped>
.inline {
  display: inline-block;
  margin-bottom: 0;
}
.right {
  margin-right: 30px;
}
.right-30 {
  margin-right: 30px;
}
.zi {
  padding: 10px;
  border: 1px solid #e7eaec;
  margin-top: 20px;
  position: relative;
  .del {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}

.act-table {
  border: 1px solid #dfe6ec;
  position: relative;
  .add {
    position: absolute;
    top: -35px;
    right: 0;
  }
  tr {
    &:first-child {
      background: #eef1f6;
    }
    th,
    td {
      padding: 7px 10px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.desc {
  color: #7b7b7b;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
