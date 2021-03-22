<template>
  <div
    class="wrap"
    ref="wrap"
    v-loading="dataLoading"
    element-loading-text="加载中..."
  >
    <Tabbar
      :tab-list="tabbar"
      :active-index="activeIndex"
      :on-change="handleSelect"
    ></Tabbar>
    <div
      class="context-box"
      :style="{ height: `${areaHeight}px` }"
      ref="context"
    >
      <el-button
        v-if="false"
        @click="getTestData()"
      >填充测试数据</el-button>
      <div v-show="activeIndex === 1">
        <!-- 基础设置 -->
        <div class="setting">
          <FormTypeTitle text="基础设置"></FormTypeTitle>
          <el-form
            :model="model"
            ref="base"
            label-position="top"
            size="small"
          >
            <el-form-item
              label="活动名称"
              prop="title"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                v-model="model.title"
                style="width:400px;"
                :maxlength="32"
                placeholder="建议字数不超过32字"
              ></el-input>&nbsp;&nbsp;
              <!-- <el-switch v-model="model.isShowBase" inactive-text="显示标题"></el-switch> -->
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
              <el-form-item
                label="活动分类"
                prop="categoryId"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                class="inline right"
              >
                <el-select
                  v-model="model.categoryId"
                  placeholder="请选择分类"
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, i) in category"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="标签"
                class="inline right"
                placeholder="请选择标签"
              >
                <el-select
                  v-model="model.activityTagLists"
                  multiple
                >
                  <el-option
                    :label="item.name"
                    :value="item.id"
                    v-for="(item, i) in tag"
                    :key="i"
                  ></el-option>
                </el-select>
                <el-button
                  type="text"
                  @click="digTagFormWrap = true"
                >新增</el-button>
              </el-form-item>
              <el-form-item
                label="序号"
                prop="seqNum"
                class="inline"
                v-if="orderType == 1"
                placeholder="请输入序号"
              >
                <el-input-number
                  v-model="model.seqNum"
                  :min="0"
                  :max="10000"
                ></el-input-number>
              </el-form-item>
            </el-form-item>

            <el-form-item
              label="主办方"
              v-if="false"
            >
              <el-input
                v-model="model.sponsor"
                style="width:400px;"
                :maxlength="32"
                placeholder="建议字数不超过32字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="承办方"
              v-if="false"
            >
              <el-input
                v-model="model.organizer"
                style="width:400px;"
                :maxlength="32"
                placeholder="建议字数不超过32字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="城市"
              v-if="false"
            >
              <el-input
                v-model="model.city"
                style="width:400px;"
                :maxlength="16"
                placeholder="建议字数不超过16字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="活动地点"
              v-if="false"
            >
              <el-input
                v-model="model.place"
                style="width:400px;"
                :maxlength="16"
                placeholder="建议字数不超过16字"
              ></el-input>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input
                v-model="model.address"
                style="width:400px;"
                :maxlength="16"
                placeholder="建议字数不超过16字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="封面大图"
              prop="iconUrl"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <div
                class="upload-img-box"
                @click="showImgBox(true, 'iconUrl', true)"
              >
                <img
                  v-if="model.iconUrl"
                  :src="`${imgHost}${model.iconUrl}`"
                  style="width: 120px;"
                />
                <i
                  v-else
                  class="el-icon-plus upload-icon"
                ></i>
              </div>
              <!-- <p>建议尺寸200 * 155</p> -->
            </el-form-item>
            <el-form-item
              label="活动简介"
              prop="info"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                v-model="model.info"
                type="textarea"
                :rows="3"
                style="width:400px;"
                :maxlength="45"
                placeholder="建议字数不超过45字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="活动内容"
              prop="content"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <Editor v-model="model.content"></Editor>
            </el-form-item>
          </el-form>
        </div>
        <!-- 时间设置 -->
        <div class="setting">
          <FormTypeTitle text="时间设置"></FormTypeTitle>
          <el-form
            :model="model"
            ref="time"
            label-position="top"
          >
            <el-form-item
              label="活动时间"
              prop="startTime"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-date-picker
                size="small"
                :editable="false"
                v-model="datetime.modelDatetime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="报名时间"
              prop="activitySignSetting.signStartTime"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-date-picker
                size="small"
                :editable="false"
                v-model="datetime.signDatetime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名人数设置 -->
        <div class="setting">
          <FormTypeTitle text="报名人数设置"></FormTypeTitle>
          <el-form
            :model="model.activitySignSetting"
            ref="signNum"
            label-position="top"
          >
            <el-form-item>
              <el-form-item
                label="最大人数"
                prop="maxNum"
                :rules="{ required: true, message: '该字段不能为空' }"
                class="inline right"
              >
                <el-input-number
                  size="small"
                  :min="0"
                  :max="10000"
                  v-model="model.activitySignSetting.maxNum"
                  type="number"
                  placeholder="不限制人数"
                  style="width:200px;"
                ></el-input-number>
                <span
                  v-if="model.activitySignSetting.maxNum === 0"
                  style="margin-left:10px;color: #303133;"
                >不限制报名</span>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <!-- 活动收费设置 -->
        <div class="setting">
          <FormTypeTitle text="活动收费设置"></FormTypeTitle>
          <el-form
            :model="model"
            label-position="top"
          >
            <el-form-item>
              <el-switch
                v-model="model.isEnableFee"
                active-text="开启付费"
              ></el-switch>
            </el-form-item>
            <div
              style="margin-bottom: 18px;"
              v-if="model.isEnableFee"
            >
              <el-form-item
                label="支付方式"
                prop="payWay"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-radio-group v-model="model.payWay">
                  <el-radio label="online">线上支付</el-radio>
                  <el-radio label="offline">线下支付</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="价格"
                prop="activityFee.price"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input-number
                  :controls="false"
                  type="number"
                  size="small"
                  v-model="model.activityFee.price"
                ></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="VIP价格" prop="activityFee.vipPrice" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input v-model="model.activityFee.vipPrice" type="number" style="width: 200px;"></el-input>
              </el-form-item>-->
              <el-form-item>
                <!-- <el-checkbox v-model="model.activityFee.isPromotion">开启促销</el-checkbox> -->
                <el-switch
                  v-model="model.activityFee.isPromotion"
                  active-text="开启促销"
                ></el-switch>
              </el-form-item>
              <el-form-item
                v-if="model.activityFee.isPromotion"
                label="促销价格"
                prop="activityFee.promotionPrice"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input
                  v-model="model.activityFee.promotionPrice"
                  type="number"
                  style="width: 200px;"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="model.activityFee.isPromotion"
                label="促销时间"
                prop="activityFee.promotionStartTime"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-date-picker
                  :editable="false"
                  v-model="datetime.feeDatetime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 留言设置 -->
        <div class="setting">
          <FormTypeTitle text="留言设置"></FormTypeTitle>
          <el-form
            :model="model"
            ref="model"
            label-position="top"
          >
            <el-form-item>
              <el-form-item class="inline right">
                <el-switch
                  v-model="model.isEnableComment"
                  active-text="开启评论"
                ></el-switch>
              </el-form-item>
              <el-form-item
                class="inline"
                v-if="model.isEnableComment"
              >
                <el-switch
                  v-model="model.isEnableCommentAudit"
                  active-text="开启评论审核"
                ></el-switch>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeIndex === 2">
        <!-- 报名人数限制 -->
        <!-- <div class="setting" v-if="false">
          <p class="title">报名人数限制</p>
          <el-form :model="model.activitySignSetting" ref="signLimit" label-position="top" size="small">
            <el-form-item>
              <el-form-item label="单人可报名人数" prop="singleNum" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-input-number size="small" :min="1" v-model="model.activitySignSetting.singleNum" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
              <el-form-item v-if="base.comment" label="报名会员等级(0表示不限制等级)" prop="vipLevel" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
                <el-input-number size="small" v-model="model.activitySignSetting.vipLevel" type="number" style="width:200px;"></el-input-number>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>-->
        <!-- 报名限制 -->
        <div class="setting">
          <FormTypeTitle text="报名限制"></FormTypeTitle>
          <el-form
            :model="model.activitySignSetting"
            ref="unsignEndTime"
            label-position="top"
            size="small"
          >
            <el-form-item>
              <el-switch
                v-model="model.activitySignSetting.isNeedSubscribe"
                active-text="是否需要关注公众号"
                class="right"
              ></el-switch>
              <el-switch
                v-model="model.activitySignSetting.isEnableUnsign"
                active-text="是否开启取消报名"
              ></el-switch>
            </el-form-item>
            <el-form-item
              v-if="model.activitySignSetting.isEnableUnsign"
              label="取消报名结束时间"
              prop="unsignEndTime"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="选择日期"
                v-model="model.activitySignSetting.unsignEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-switch
                v-model="model.activitySignSetting.isEnableAudit"
                active-text="报名是否需要审核"
              ></el-switch>
            </el-form-item>
            <el-form-item v-if="model.activitySignSetting.isEnableAudit">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="报名后待管理员审核通过后再付支付活动费用"
              >
                <el-switch
                  slot="reference"
                  v-model="model.activitySignSetting.auditAfterPay"
                  active-text="审核后支付"
                  @change="onSiginPayWay($event, 'auditAfterPay')"
                ></el-switch>
              </el-popover>
              <div style="display: inline-block;margin-left: 20px;">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="报名并支付活动费用后再审核，审核不通过款项会原路退还"
                >
                  <el-switch
                    slot="reference"
                    v-model="model.activitySignSetting.payAfterAudit"
                    active-text="支付后审核"
                    @change="onSiginPayWay($event, 'payAfterAudit')"
                  ></el-switch>
                </el-popover>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            :model="model.activitySignSetting"
            ref="audit"
            label-position="top"
            size="small"
            v-if="model.activitySignSetting.isEnableAudit && model.activitySignSetting.isEnableWxTemplateRemind"
          >
            <el-form-item
              label="审核通过待支付信息"
              prop="auditPassMsg"
              :rules="[{ required: true, message: '该字段不能为空' }]"
              v-if="model.isEnableFee"
            >
              <el-input
                size="small"
                v-model="model.activitySignSetting.auditPassMsg"
                type="textarea"
                style="width:500px;"
                :maxlength="32"
                placeholder="建议字数不超过32字"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="审核不通过信息"
              prop="auditNotPassMsg"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                size="small"
                v-model="model.activitySignSetting.auditNotPassMsg"
                type="textarea"
                style="width:500px;"
                :maxlength="32"
                placeholder="建议字数不超过32字"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 提醒信息设置 -->
        <div class="setting">
          <FormTypeTitle text="提醒信息设置"></FormTypeTitle>
          <el-form
            :model="model.activitySignSetting"
            ref="activitySignSetting"
            label-position="top"
            size="small"
          >
            <el-form-item
              label
              prop="isEnableRemindMsg"
              class="inline right"
            >
              <el-switch
                v-model="model.activitySignSetting.isEnableRemindMsg"
                active-text="提醒信息"
                class="right"
              ></el-switch>
              <el-switch
                v-model="model.activitySignSetting.isEnableWxRemind"
                v-if="model.activitySignSetting.isEnableRemindMsg"
                active-text="微信客服接口通知"
                class="right"
              ></el-switch>
              <el-switch
                v-model="model.activitySignSetting.isEnableWxTemplateRemind"
                v-if="model.activitySignSetting.isEnableRemindMsg"
                active-text="微信模板消息通知"
              ></el-switch>
            </el-form-item>
            <el-form-item v-if="model.activitySignSetting.isEnableRemindMsg">
              <el-form-item
                label="报名成功信息"
                prop="signMsg"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                v-if="model.activitySignSetting.isEnableWxRemind"
              >
                <el-input
                  size="small"
                  v-model="model.activitySignSetting.signMsg"
                  type="textarea"
                  style="width:500px;"
                  :maxlength="32"
                  placeholder="建议字数不超过32字"
                ></el-input>
              </el-form-item>
              <div v-if="model.activitySignSetting.isEnableWxTemplateRemind">
                <el-form-item label="活动开始前提前多少分钟提醒">
                  <el-input-number
                    size="small"
                    v-model="model.activitySignSetting.aheadTime"
                    :min="0"
                    @change="numberChange"
                  ></el-input-number>
                  <span
                    style="margin-left: 30px;"
                    v-if="
                      model.activitySignSetting.aheadTime && model.startTime && model.activitySignSetting.remaindTime
                    "
                  >提醒时间为：{{ model.activitySignSetting.remaindTime }}</span>
                </el-form-item>
                <el-form-item label="消息模版提醒标题">
                  <el-input
                    size="small"
                    v-model.trim="model.activitySignSetting.remaindTitle"
                    style="width:400px;"
                    :maxlength="16"
                    placeholder="建议字数不超过16字"
                  ></el-input>
                </el-form-item>
                <el-form-item label="消息模版提醒内容">
                  <el-input
                    size="small"
                    v-model="model.activitySignSetting.remaindInfo"
                    style="width:400px;"
                    :maxlength="32"
                    placeholder="建议字数不超过32字"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报名自定义字段设置 -->
        <div class="setting">
          <el-form>
            <!-- <FormTypeTitle text="微信端显示报名数包含"></FormTypeTitle>
            <el-form-item>
              <el-checkbox v-model="model.activitySignSetting.isEnableSignShow">已报名数</el-checkbox>
              <el-checkbox v-model="model.activitySignSetting.isEnableToAuditShow">待审核数</el-checkbox>
              <el-checkbox v-model="model.activitySignSetting.isEnableUnpaidShow">待支付数</el-checkbox>
            </el-form-item>-->
            <FormTypeTitle text="报名自定义字段设置"></FormTypeTitle>
            <el-form-item>
              <el-switch
                v-model="model.activitySignSetting.isShowSignMembers"
                active-text="是否显示报名详情"
                class="right"
              ></el-switch>
            </el-form-item>
            <!-- <el-form-item label="需要短信手机号验证">
              <el-switch v-model="model.activitySignSetting.isEnableSignPhonePin"></el-switch>
            </el-form-item>-->
          </el-form>
          <FormTypeTitle text="报名自定义字段设置"></FormTypeTitle>
          <p class="desc">
            <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
          </p>
          <table
            cellpadding="0"
            cellspacing="0"
            class="act-table"
          >
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
              <tr
                v-for="(item, i) in model.signDataSettingList"
                :key="i"
              >
                <td>
                  <el-input-number
                    size="mini"
                    v-model="item.sort"
                    style="width: 100px;"
                  ></el-input-number>
                </td>
                <td>
                  <el-select
                    v-model="item.type"
                    placeholder="请选择"
                    size="mini"
                    style="width: 120px;"
                    :disabled="item.id && item.id !== ''"
                  >
                    <el-option
                      v-for="(item, i) in inputType"
                      :key="i"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input
                    v-model="item.name"
                    size="mini"
                    style="width: 150px;"
                  ></el-input>
                </td>
                <!-- <td>
                <el-input v-model="item.fieldName" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="item.id && item.id !== ''  || model.isRelease"></el-input>
                </td>-->
                <td>
                  <el-input
                    :disabled="item.type !== 2 && item.type !== 3"
                    v-model="item.options"
                    size="mini"
                    style="width: 200px;"
                  ></el-input>
                </td>
                <td>
                  <el-switch
                    v-model="item.isRequired"
                    active-text
                  ></el-switch>
                </td>
                <td>
                  <el-switch
                    v-model="item.isShow"
                    active-text
                  ></el-switch>
                </td>
                <td>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="delDataSetting(i)"
                  >删除</el-button>
                </td>
              </tr>
              <el-button
                type="primary"
                size="mini"
                class="add"
                @click="addDataSetting()"
              >新增</el-button>
            </tbody>
          </table>
        </div>
      </div>
      <div v-show="activeIndex === 3">
        <el-form
          label-position="top"
          size="small"
          style="margin-bottom: 22px;"
        >
          <el-form-item label>
            <el-switch
              v-model="model.isEnableCheckin"
              active-text="设置活动签到"
            ></el-switch>
          </el-form-item>
        </el-form>
        <div v-if="model.isEnableCheckin">
          <!-- 签到时间设置 -->
          <div class="setting">
            <FormTypeTitle text="签到时间设置">
              <!-- <el-button type="primary" size="mini" class="add" @click="addCheckTime()">新增</el-button> -->
            </FormTypeTitle>
            <table
              cellpadding="0"
              cellspacing="0"
              class="act-table"
            >
              <tbody>
                <tr>
                  <th>签到开始时间</th>
                  <th>签到结束时间</th>
                  <th>签到迟到时间</th>
                  <th>操作</th>
                </tr>
                <tr
                  v-for="(item, i) in model.activityCheckinSetting.checkinTimeList"
                  :key="i"
                >
                  <td>
                    <el-date-picker
                      type="datetime"
                      size="mini"
                      placeholder="选择日期"
                      v-model="item.checkinStartTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm"
                      :editable="false"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker
                      type="datetime"
                      size="mini"
                      placeholder="选择日期"
                      v-model="item.checkinEndTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm"
                      :editable="false"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-date-picker
                      type="datetime"
                      size="mini"
                      placeholder="选择日期"
                      v-model="item.checkinLateTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm"
                      :editable="false"
                    ></el-date-picker>
                  </td>
                  <td>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="delCheckTime(i)"
                    >删除</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 签到提醒设置 -->
          <div class="setting">
            <FormTypeTitle text="签到提醒设置"></FormTypeTitle>
            <el-form
              :model="model.activityCheckinSetting"
              label-position="top"
              size="small"
            >
              <el-form-item
                label
                prop="isEnableRemindMsg"
                class="inline right"
              >
                <el-switch
                  v-model="model.activityCheckinSetting.isEnableRemindMsg"
                  active-text="提醒信息"
                  class="right"
                ></el-switch>
                <el-switch
                  v-model="model.activityCheckinSetting.isEnableWxRemind"
                  v-show="model.activityCheckinSetting.isEnableRemindMsg"
                  active-text="微信客服接口通知"
                  class="right"
                ></el-switch>
                <el-switch
                  v-model="model.activityCheckinSetting.isEnableWxTemplateRemind"
                  v-show="model.activityCheckinSetting.isEnableRemindMsg"
                  active-text="微信模板消息通知"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到提醒信息 -->
          <div class="setting">
            <FormTypeTitle text="签到提醒信息"></FormTypeTitle>
            <el-form
              :model="model.activityCheckinSetting"
              ref="checkRemind"
              label-position="top"
              size="small"
            >
              <el-form-item
                label="签到回复"
                prop="checkinMsg"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input
                  size="small"
                  v-model="model.activityCheckinSetting.checkinMsg"
                  type="textarea"
                  style="width:500px;"
                  :maxlength="32"
                  placeholder="建议字数不超过32字"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="未报名直接签到信息"
                prop="checkinBySuddenMsg"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input
                  size="small"
                  v-model="model.activityCheckinSetting.checkinBySuddenMsg"
                  type="textarea"
                  style="width:500px;"
                  :maxlength="32"
                  placeholder="建议字数不超过32字"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="重复签到信息" prop="checkinRepeatMsg" :rules="[{ required: true, message: '该字段不能为空'}]">
                <el-input size="small" v-model="model.activityCheckinSetting.checkinRepeatMsg" type="textarea" style="width:500px;"></el-input>
              </el-form-item>-->
              <el-form-item
                label="签到不通过信息"
                prop="checkinNotPassMsg"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <el-input
                  size="small"
                  v-model="model.activityCheckinSetting.checkinNotPassMsg"
                  type="textarea"
                  style="width:500px;"
                  :maxlength="32"
                  placeholder="建议字数不超过32字"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到方式设置 -->
          <div class="setting">
            <FormTypeTitle text="签到方式设置"></FormTypeTitle>
            <el-form
              :model="model.activityCheckinSetting"
              ref="activityCheckinSetting"
              label-position="top"
              size="mini"
            >
              <el-form-item v-if="false">
                <el-form-item>
                  <el-switch
                    v-model="model.activityCheckinSetting.isCheckinCode"
                    active-text="开启暗号签到"
                    class="right"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  label="签到暗号"
                  size="small"
                  prop="checkinCode"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                  v-if="model.activityCheckinSetting.isCheckinCode"
                >
                  <el-input
                    size="small"
                    v-model="model.activityCheckinSetting.checkinCode"
                    style="width:200px;"
                    :maxlength="16"
                    placeholder="建议字数不超过16字"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item label="签到活跃度" prop="checkinVitalityScore" class="inline">
                  <el-input-number size="small" :min="0" v-model="model.activityCheckinSetting.checkinVitalityScore" style="width:200px;"></el-input-number>
                </el-form-item>-->
              </el-form-item>
              <el-form-item>
                <el-form-item
                  label
                  class="inline right"
                >
                  <el-switch
                    v-model="model.activityCheckinSetting.isEnableSudden"
                    active-text="允许未报名直接签到"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  label
                  class="inline right"
                >
                  <el-switch
                    v-model="model.activityCheckinSetting.isEnableMobileCheckin"
                    active-text="允许手机号码签到"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  label
                  class="inline"
                  v-if="model.activityCheckinSetting.isEnableMobileCheckin"
                >
                  <el-switch
                    v-model="model.activityCheckinSetting.isRequireSelfCheckin"
                    active-text="是否需要报名本人签到"
                  ></el-switch>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-form-item
                  label
                  class="inline right"
                >
                  <el-switch
                    v-model="model.activityCheckinSetting.isEnableAirborne"
                    active-text="开启空降嘉宾签到"
                  ></el-switch>
                </el-form-item>
                <!-- <el-form-item label class="inline" v-if="model.activityCheckinSetting.isEnableAirborne">
                  <el-switch v-model="model.activityCheckinSetting.isShowAirborne" active-text="将空降嘉宾功能显示到签到页面"></el-switch>
                </el-form-item>-->
              </el-form-item>
            </el-form>
          </div>
          <!-- 签到图片设置 -->
          <div
            class="setting"
            v-if="
              model.activityCheckinSetting.checkinCode ||
                model.activityCheckinSetting.isEnableMobileCheckin ||
                model.activityCheckinSetting.isEnableAirborne
            "
          >
            <FormTypeTitle text="签到图片设置"></FormTypeTitle>
            <el-form
              :model="model.activityCheckinSetting"
              ref="checkImg"
              label-position="top"
              size="mini"
              :inline="true"
            >
              <el-form-item
                label="签到背景图片"
                prop="checkUrl"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                style="margin-right: 30px;"
              >
                <div
                  class="upload-img-box"
                  @click="showImgBox(true, 'activityCheckinSetting.checkUrl', true)"
                >
                  <img
                    v-if="model.activityCheckinSetting.checkUrl"
                    :src="`${imgHost}${model.activityCheckinSetting.checkUrl}`"
                    style="width: 120px;"
                  />
                  <i
                    v-else
                    class="el-icon-plus upload-icon"
                  ></i>
                </div>
              </el-form-item>
              <el-form-item
                label="签到成功图片"
                prop="successUrl"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                style="margin-right: 30px;"
              >
                <div
                  class="upload-img-box"
                  @click="showImgBox(true, 'activityCheckinSetting.successUrl', true)"
                >
                  <img
                    v-if="model.activityCheckinSetting.successUrl"
                    :src="`${imgHost}${model.activityCheckinSetting.successUrl}`"
                    style="width: 120px;"
                  />
                  <i
                    v-else
                    class="el-icon-plus upload-icon"
                  ></i>
                </div>
              </el-form-item>
              <el-form-item
                label="签到失败图片"
                prop="failUrl"
                :rules="[{ required: true, message: '该字段不能为空' }]"
              >
                <div
                  class="upload-img-box"
                  @click="showImgBox(true, 'activityCheckinSetting.failUrl', true)"
                >
                  <img
                    v-if="model.activityCheckinSetting.failUrl"
                    :src="`${imgHost}${model.activityCheckinSetting.failUrl}`"
                    style="width: 120px;"
                  />
                  <i
                    v-else
                    class="el-icon-plus upload-icon"
                  ></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="activeIndex === 4">
        <el-form label-position="top">
          <el-form-item
            v-if="!model.isEnableFee"
            label="是否开启子活动独立付费（开启后报名、费用等跟着子活动）"
          >
            <el-checkbox v-model="model.isEnableAloneItem">开启开启子活动独立付费</el-checkbox>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="mini"
          @click="addItem()"
        >添加子活动</el-button>
        <div
          class="zi"
          v-for="(item, i) in model.activityItemList"
          :key="i"
        >
          <el-button
            type="danger"
            size="mini"
            class="del"
            @click="delItem(i)"
          >删除该子活动</el-button>
          <el-form
            label-position="top"
            size="mini"
            :model="item"
          >
            <el-form-item
              label="子活动名称"
              prop="title"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                size="small"
                v-model="item.title"
                style="width:400px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="活动地点"
              prop="place"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                size="small"
                v-model="item.place"
                style="width:400px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="详细地址"
              prop="address"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                size="small"
                v-model="item.address"
                style="width:400px;"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="简介"
              prop="info"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-input
                size="small"
                v-model="item.info"
                type="textarea"
                style="width:400px;"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item
                label="开始时间"
                prop="startTime"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                class="inline right"
              >
                <el-date-picker
                  type="datetime"
                  size="small"
                  placeholder="选择日期"
                  v-model="item.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="结束时间"
                prop="endTime"
                :rules="[{ required: true, message: '该字段不能为空' }]"
                class="inline"
              >
                <el-date-picker
                  type="datetime"
                  size="small"
                  placeholder="选择日期"
                  v-model="item.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-form>
          <div
            class="setting"
            v-if="model.isEnableAloneItem"
          >
            <p class="title">活动费用设置</p>
            <el-form
              :model="item.activityFee"
              label-position="top"
              size="mini"
            >
              <el-form-item>
                <el-form-item
                  label="价格"
                  prop="price"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-input
                    size="small"
                    v-model="item.activityFee.price"
                    type="number"
                    style="width: 200px;"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="VIP价格"
                  prop="vipPrice"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline"
                >
                  <el-input
                    size="small"
                    v-model="item.activityFee.vipPrice"
                    type="number"
                    style="width: 200px;"
                  ></el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-form-item
                  label="是否促销"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-radio-group v-model="item.activityFee.isPromotion">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="item.activityFee.isPromotion"
                  label="促销价格"
                  prop="promotionPrice"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-input
                    size="small"
                    v-model="item.activityFee.promotionPrice"
                    type="number"
                    style="width: 200px;"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="item.activityFee.isPromotion"
                  label="促销开始时间"
                  prop="promotionStartTime"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-date-picker
                    type="datetime"
                    size="small"
                    placeholder="选择日期"
                    v-model="item.activityFee.promotionStartTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  v-if="item.activityFee.isPromotion"
                  label="促销结束时间"
                  prop="promotionEndTime"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline"
                >
                  <el-date-picker
                    type="datetime"
                    size="small"
                    placeholder="选择日期"
                    v-model="item.activityFee.promotionEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="setting"
            v-if="model.isEnableAloneItem"
          >
            <p class="title">活动报名设置</p>
            <el-form
              :model="item.activitySignSetting"
              label-position="top"
              size="mini"
            >
              <el-form-item>
                <el-form-item
                  label="最大人数"
                  prop="maxNum"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-input
                    size="small"
                    v-model="item.activitySignSetting.maxNum"
                    type="number"
                    style="width:200px;"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="单人可报名人数"
                  prop="singleNum"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                  class="inline right"
                >
                  <el-input
                    size="small"
                    v-model="item.activitySignSetting.singleNum"
                    type="number"
                    style="width:200px;"
                  ></el-input>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting">
            <p class="title">活动签到设置</p>
            <div>
              <div style="display: flex;">
                <p style="color: #717171; margin-bottom: 10px;">签到时间设置</p>
              </div>
              <table
                cellpadding="0"
                cellspacing="0"
                class="act-table"
              >
                <tbody>
                  <tr>
                    <th style="width: 220px;">签到开始时间</th>
                    <th style="width: 220px;">签到结束时间</th>
                    <th style="width: 220px;">签到迟到时间</th>
                    <th style="width: 80px;">操作</th>
                  </tr>
                  <tr
                    v-for="(label, k) in item.activityCheckinSetting.checkinTimeList"
                    :key="k"
                  >
                    <td>
                      <el-date-picker
                        type="datetime"
                        size="small"
                        placeholder="选择日期"
                        v-model="label.checkinStartTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </td>
                    <td>
                      <el-date-picker
                        type="datetime"
                        size="small"
                        placeholder="选择日期"
                        v-model="label.checkinEndTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </td>
                    <td>
                      <el-date-picker
                        type="datetime"
                        size="small"
                        placeholder="选择日期"
                        v-model="label.checkinLateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </td>
                    <td>
                      <el-button
                        type="danger"
                        size="mini"
                        @click="delItemCheckTime(i, k)"
                      >删除</el-button>
                    </td>
                  </tr>
                  <el-button
                    type="primary"
                    size="mini"
                    class="add"
                    @click="addItemCheckTime(i)"
                  >新增</el-button>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button
        type="primary"
        @click="submit()"
        style="margin-right: 30px;"
        size="small"
        :loading="loading"
      >保存</el-button>
      <!-- <el-popover placement="top" width="200" trigger="click" v-if="!model.isRelease">
        <qrcode :value="`${shareHost}id=${model.id}`" v-if="model.id" tag="img" :options="{ size: 200 }"></qrcode>
        <p v-if="model.id" style="text-align: center;">扫描二维码预览</p>
        <el-button slot="reference" type="primary" size="small" :loading="loading" @click="submit(true)">保存并预览</el-button>
      </el-popover>-->
    </div>

    <login-dialog
      :visible="digLogin"
      @close="closeLogin"
      :is-again="isAgain"
    ></login-dialog>
    <edit-image
      :visible="digImgWrap"
      image-type="activity"
      :cropper-option="cropperOption"
      :img-name="imgName"
      :on-close="showImgBox"
      :on-singleimg="getSingleimg"
      :is-cut="isCut"
    ></edit-image>
    <!-- <tag-dig :visible="digTagFormWrap" @close="digTagClose"></tag-dig> -->
  </div>
</template>

<script>
// import Qrcode from '@xkeshi/vue-qrcode'
import loginMixin from '@/mixins/loginMixin'
import upLoadMixin from '@/mixins/upLoadMixin'
// import TagDig from '../tag/form'
export default {
  mixins: [loginMixin, upLoadMixin],
  components: {
    // Qrcode
    // TagDig
  },
  data() {
    return {
      digTagFormWrap: false,
      dataLoading: false,
      areaHeight: 0,
      tabbar: [
        { index: 1, name: '活动设置' },
        { index: 2, name: '高级设置' },
        { index: 3, name: '签到设置' }
        // { index: 4, name: '子活动设置' },
      ],
      activeIndex: 1,
      datetime: {
        modelDatetime: '',
        signDatetime: '',
        feeDatetime: ''
      },
      activityTagList: [],
      model: {
        title: '',
        isShowBase: 1,
        status: '',
        categoryId: '',
        seqNum: null,
        couponRuleId: '',
        activityTagList: [],
        activityTagLists: [],
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
          promotionStartTime: ''
        },
        activitySignSetting: {
          isEnableSMSVerify: false,
          maxNum: 100,
          singleNum: 1,
          vipLevel: 0,
          auditAfterPay: true,
          payAfterAudit: false,
          isEnableSignPhonePin: false,
          isShowSignMembers: true,
          isNeedSubscribe: false,
          isEnableAudit: false,
          isEnableSignShow: true,
          isEnableToAuditShow: false,
          isEnableUnpaidShow: false,
          signStartTime: '',
          signEndTime: '',
          isEnableUnsign: false,
          unsignEndTime: '',
          signMsg: '您已报名成功',
          auditPassMsg: '您有一条待支付订单',
          auditNotPassMsg: '您的报名审核不通过',
          isEnableRemindMsg: false,
          isEnableWxRemind: false,
          isEnableWxTemplateRemind: false,
          remaindTime: '',
          aheadTime: '',
          remaindTitle: '',
          remaindInfo: '请准时参加~'
        },
        isEnableCheckin: false,
        activityCheckinSetting: {
          isEnableSMSVerify: false,
          isEnableRemindMsg: false,
          isEnableWxRemind: false,
          isEnableWxTemplateRemind: false,
          isCheckinCode: false,
          checkinCode: '',
          isEnableSudden: false,
          isEnableMobileCheckin: false,
          isRequireSelfCheckin: false,
          isEnableAirborne: true, //是否开启空降嘉宾签到
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
              checkinLateTime: ''
            }
          ],
          checkUrl: '',
          successUrl: '',
          failUrl: ''
        },
        signDataSettingList: [],
        activityItemList: []
      },
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 }
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
      cropperOption: {
        autoCropWidth: 500,
        autoCropHeight: 388,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      },
      cropperConfig: {
        iconUrl: {
          autoCropWidth: 500,
          autoCropHeight: 388
        },
        'activityCheckinSetting.checkUrl': {
          autoCropWidth: 394,
          autoCropHeight: 700
        },
        'activityCheckinSetting.successUrl': {
          autoCropWidth: 394,
          autoCropHeight: 700
        },
        'activityCheckinSetting.failUrl': {
          autoCropWidth: 400,
          autoCropHeight: 400
        }
      },
      isCut: true,
      categoryParent: {}
    }
  },
  created() {
    this.getMobileUrl()
    this.activityOrderTypeGet()
    this.pageCategory()
    this.pageTag()
    if (this.$route.query.id) {
      this.dataLoading = true
      this.getActivity(this.$route.query.id)
    } else {
      this.getSignDataSetting()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1)
    },
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 100 - 142
    },
    // 切换tab
    handleSelect(index) {
      // if (this.activeIndex === index) return false
      this.activeIndex = index
      this.$refs.context.scrollTop = 0
    },
    // 获取域名
    getMobileUrl() {
      this.$http.getMobileUrl().then(res => {
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
        aheadTime: this.model.activitySignSetting.aheadTime
      }
      this.$http.remaindTime(params).then(res => {
        this.model.activitySignSetting.remaindTime = res.data.data
      })
    },
    // 获取活动分类
    pageCategory() {
      this.$http.pageCategory({ type: 2 }).then(res => {
        this.category = res.data.data.list
      })
    },
    // 获取标签
    pageTag() {
      this.$http.pageTag({ type: 3 }).then(res => {
        this.tag = res.data.data.list
      })
    },
    // 获取优惠券
    listCouponRule() {
      this.$http.listCouponRule({ pageSize: 100, pageNum: 1, ruleType: 2 }).then(res => {
        this.couponRule = res.data.data.list
      })
    },
    // 获取排序规则
    activityOrderTypeGet() {
      this.$http.activityOrderTypeGet().then(res => {
        if (!res.data.data) return
        this.orderType = res.data.data.value
        if (this.orderType == 1 && !this.$route.query.id) this.getActivitySort()
      })
    },
    // 获取活动数量
    getActivitySort() {
      this.$http.getActivitySort().then(res => {
        this.model.seqNum = res.data.data
      })
    },
    // 获取活动详情
    getActivity(id, state) {
      this.$http
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
                  checkinLateTime: ''
                }
              ],
              checkUrl: '',
              successUrl: '',
              failUrl: ''
            }
            data.activityCheckinSetting = activityCheckinSetting
          }
          if (!data.activityFee) {
            let activityFee = {
              price: '',
              vipPrice: '',
              isPromotion: false,
              promotionPrice: '',
              promotionStartTime: ''
            }
            data.activityFee = activityFee
          } else {
            if (!data.activityFee.price) {
              data.activityFee.price = ''
            }
          }
          if (data.activitySignSetting) {
            if (!data.activitySignSetting.auditAfterPay && !data.activitySignSetting.payAfterAudit) {
              data.activitySignSetting.auditAfterPay = true
              data.activitySignSetting.payAfterAudit = false
            }
          }
          data.activityTagLists = []
          if (data.activityTagList.length > 0) {
            data.activityTagList.map(item => {
              data.activityTagLists.push(item.tagId)
            })
          }
          data.activityCheckinSetting.isCheckinCode = data.activityCheckinSetting.checkinCode ? true : false

          this.model = data
          this.datetime.modelDatetime = [this.model.startTime, this.model.endTime]
          this.datetime.signDatetime = [
            this.model.activitySignSetting.signStartTime,
            this.model.activitySignSetting.signEndTime
          ]

          if (this.model.activityFee.isPromotion)
            this.datetime.feeDatetime = [
              this.model.activityFee.promotionStartTime,
              this.model.activityFee.promotionEndTime
            ]
          if (this.model.activityFee.price) this.model.activityFee.price = this.model.activityFee.price / 100
          if (this.model.activityFee.vipPrice) this.model.activityFee.vipPrice = this.model.activityFee.vipPrice / 100
          if (this.model.activityFee.promotionPrice)
            this.model.activityFee.promotionPrice = this.model.activityFee.promotionPrice / 100

          if (this.$route.query.copy === 'true' && !state) this.model = this.copy(this.model)
          this.dataLoading = false
          this.model.activitySignSetting.isEnableSMSVerify = false
          this.model.activityCheckinSetting.isEnableSMSVerify = false
          console.log(this.model)
        })
        .catch(() => {
          this.dataLoading = false
        })
    },
    digTagClose(flag) {
      this.digTagFormWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.pageTag()
      }
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
      console.log(JSON.stringify(model, 1, 1))
      return model
    },
    // 获取报名字段
    getSignDataSetting() {
      this.$http.getSignDataSetting().then(res => {
        res.data.data.map(item => {
          item.isSystem = false
        })
        this.model.signDataSettingList = res.data.data
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
        isSystem: false
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
        checkinLateTime: ''
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
          promotionEndTime: this.model.activityFee.promotionEndTime
        },
        activitySignSetting: {
          maxNum: this.model.activitySignSetting.maxNum,
          singleNum: this.model.activitySignSetting.singleNum
        },
        activityCheckinSetting: {
          checkinTimeList: []
        }
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
        checkinLateTime: ''
      })
    },
    // 删除子活动签到时间
    delItemCheckTime(i) {
      this.model.activityItemList[i].activityCheckinSetting.checkinTimeList.splice(i, 1)
    },
    // 获取编辑器内容
    getContent(content) {
      this.model.content = content
    },
    // 切换报名支付方式
    onSiginPayWay(e, type) {
      console.log('onSiginPayWay===>', e, type)
      if (type == 'auditAfterPay' && e) {
        this.model.activitySignSetting.auditAfterPay = true
        this.model.activitySignSetting.payAfterAudit = false
      } else {
        this.model.activitySignSetting.auditAfterPay = false
        this.model.activitySignSetting.payAfterAudit = true
      }
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

      let thisResult = this.utils.compareTime(this.model.activitySignSetting.signEndTime, this.model.endTime)
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

      // if (this.model.activitySignSetting.isEnableUnsign) {
      //   this.$refs.unsignEndTime.validate(valid => {
      //     state = valid
      //   })
      //   if (!state) {
      //     this.$message.error('请填写取消报名结束时间！')
      //     return false
      //   }
      // }

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

      // this.$refs.activitySignSetting.validate(valid => {
      //   state = valid
      // })
      // if (!state) {
      //   this.$message.error('请将提醒信息设置信息填写完整！')
      //   return false
      // }

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

        // this.$refs.checkRemind.validate(valid => {
        //   state = valid
        // })
        // if (!state) {
        //   this.$message.error('请将签到提醒设置信息填写完整！')
        //   return false
        // }
        // if (this.model.activityCheckinSetting.isCheckinCode) {
        //   this.$refs.activityCheckinSetting.validate(valid => {
        //     state = valid
        //   })
        //   if (!state) {
        //     this.$message.error('请填写签到暗号！')
        //     return false
        //   }
        // }
        if (
          this.model.activityCheckinSetting.checkinCode ||
          this.model.activityCheckinSetting.isEnableMobileCheckin ||
          this.model.activityCheckinSetting.isEnableAirborne
        ) {
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
    getTestData() {
      this.model = JSON.parse(localStorage.getItem('activityData'))
    },
    submit(state) {
      // this.$refs.editor.getContent()
      localStorage.setItem('activityData', JSON.stringify(this.model))
      if (!this.check()) return false
      let model = JSON.parse(JSON.stringify(this.model))
      if (!model.activityCheckinSetting.isCheckinCode) model.activityCheckinSetting.checkinCode = ''
      if (model.activityFee.price) model.activityFee.price = Math.floor(model.activityFee.price * 100)
      if (model.activityFee.vipPrice) model.activityFee.vipPrice = Math.floor(model.activityFee.vipPrice * 100)
      if (model.activityFee.promotionPrice)
        model.activityFee.promotionPrice = Math.floor(model.activityFee.promotionPrice * 100)
      model.activityTagList = []
      model.activityTagLists.map(item => {
        model.activityTagList.push({ tagId: item })
      })
      if (state) model.status = 0
      else model.status = 1

      // console.log(this.model);
      // return
      this.loading = true
      if (this.$route.query.copy) this.addActivity(model, state)
      else if (this.$route.query.id || this.model.id) this.updateActivity(model, state)
      else this.addActivity(model, state)
    },
    addActivity(model, state) {
      this.$http
        .addActivity(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.model.id = res.data.message
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
      this.$http
        .updateActivity(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '修改成功',
            type: 'success'
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
    // 打开图片对话框
    showImgBox(state, imgName, isCut) {
      if (imgName) {
        this.imgName = imgName
        if (this.cropperConfig && this.cropperConfig[imgName]) {
          this.cropperOption = Object.assign(this.cropperOption, this.cropperConfig[imgName])
        }
      }
      this.isCut = isCut ? false : true
      this.digImgWrap = state
    }
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
    }
    // 'model.activityFee.price'(val) {
    //   this.$nextTick(() => {
    //     this.model.activityFee.price = this.utils.clearNoNum(this.model.activityFee.price)
    //   })
    // }
  }
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
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #e7eaec;
  box-shadow: 0px -2px 6px #eee;
}
</style>
