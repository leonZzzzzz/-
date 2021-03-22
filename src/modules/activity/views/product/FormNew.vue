<template>
  <QcNavigationPage :content="$route.query.id ? '修改活动' : '新建活动'" :full="true" class="activity-form">
    <ul class="activity-form__tabs">
      <li @click="type = 'base'" class="activity-form__tab" :class="{ 'activity-form__tab--active': type == 'base' }">
        基础信息
      </li>
      <li
        @click="type = 'notify'"
        class="activity-form__tab"
        :class="{ 'activity-form__tab--active': type == 'notify' }"
      >
        通知设置
      </li>
      <li @click="type = 'check'" class="activity-form__tab" :class="{ 'activity-form__tab--active': type == 'check' }">
        签到设置
      </li>
    </ul>
    <el-form :model="model" ref="model" label-position="left" label-width="100px">
      <div v-show="type == 'base'">
        <el-form-item label="活动名称" prop="title" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.title" class="w-750"></el-input>
        </el-form-item>
        <el-form-item label="活动封面" prop="iconUrl" :rules="[{ required: true, message: '请填写该字段' }]">
          <QcImageUpload
            width="375px"
            height="180px"
            :data="{ imageType: 'activity' }"
            v-model="model.iconUrl"
          ></QcImageUpload>
          <!-- <p>建议尺寸750 * 440</p> -->
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="model.address" class="w-750" :maxlength="16" placeholder="建议字数不超过16字"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-row class="w-750">
            <el-col :span="11">
              <el-form-item label-width="0px" prop="startTime" :rules="[{ required: true, message: '请填写该字段' }]">
                <el-date-picker
                  style="width: 100%"
                  type="datetime"
                  placeholder="开始时间"
                  v-model="model.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item label-width="0px" prop="endTime" :rules="[{ required: true, message: '请填写该字段' }]">
                <el-date-picker
                  style="width: 100%"
                  type="datetime"
                  placeholder="结束时间"
                  v-model="model.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报名时间">
          <el-row class="w-750">
            <el-col :span="11">
              <el-form-item
                label-width="0px"
                prop="activitySignSetting.signStartTime"
                :rules="[{ required: true, message: '请填写该字段' }]"
              >
                <el-date-picker
                  style="width: 100%"
                  type="datetime"
                  placeholder="开始时间"
                  v-model="model.activitySignSetting.signStartTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item
                label-width="0px"
                prop="activitySignSetting.signEndTime"
                :rules="[{ required: true, message: '请填写该字段' }]"
              >
                <el-date-picker
                  style="width: 100%"
                  type="datetime"
                  placeholder="结束时间"
                  v-model="model.activitySignSetting.signEndTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="活动类型" prop="categoryId" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-select v-model="model.categoryId" class="w-750">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div style="width: 10px; display: inline-block"></div>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            style="font-size: 18px; position: relative; top: 1px; left: 0"
            @click="categoryFormVisible = true"
          ></el-button>
          <span style="padding: 0px 10px; color: #dcdfe6; font-size: 14px; position: relative; top: -2px; left: 0"
            >|</span
          >
          <el-button type="text" @click="categoryListDialogVisible = true">活动分类管理 ></el-button>
        </el-form-item>
        <el-form-item label="活动标签" prop="activityTagList">
          <el-select :multiple="true" v-model="model.activityTagList" class="w-750">
            <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div style="width: 10px; display: inline-block"></div>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            style="font-size: 18px; position: relative; top: 1px; left: 0"
            @click="tagFormVisible = true"
          ></el-button>
          <span style="padding: 0px 10px; color: #dcdfe6; font-size: 14px; position: relative; top: -2px; left: 0"
            >|</span
          >
          <el-button type="text" @click="tagListDialogVisible = true">活动标签管理 ></el-button>
        </el-form-item>
        <el-form-item label="报名人数">
          <el-input-number v-model="model.activitySignSetting.maxNum" class="w-750"></el-input-number>
          <p style="font-size: 14px; color: rgb(96, 98, 102)">*为0不限制</p>
        </el-form-item>

        <el-form-item label="收费类型">
          <el-form-item label="免费" label-width="230px">
            <!-- model.isEnableFee为 false是免费 -->
            <el-switch v-model="model.isEnableFee" @change="enableFeeChange"></el-switch>
          </el-form-item>
        </el-form-item>
        <!-- 如果开启了免费，下面的推广积分，佣金什么的都不显示，并且把值设为 0 -->
        <el-form-item v-if="model.isEnableFee">
          <el-radio-group v-model="model.payWay">
            <el-radio label="online">
              <div style="display: inline-block; margin-bottom: 20px">
                <div style="width: 710px">
                  <span style="font-size: 14px; color: #606266">线上支付</span>
                  <span style="color: #999; font-size: 14px; margin-left: 50px; margin-right: 200px"
                    >在线支付，支持微信支付和积分支付</span
                  >
                </div>
              </div>
              <!-- <div style="margin-left:30px;" v-if="model.payWay=='online'">
                <div style="margin-bottom:10px;">
                  <span style="margin-right:10px">微信支付</span>
                  <span class="danwei">￥</span>
                  <el-input style="width: 640px;" v-model="model.activityFee.price"></el-input>
                </div>
                <div v-show="showintegral==false">
                  <span style="margin-right:10px">积分支付</span>
                  <el-input style="width: 640px;" v-model="model.activityFee.point"></el-input>
                  <span class="danwei">积分</span>
                </div>
              </div>-->
              <el-checkbox-group
                v-model="model.checkList"
                style="margin-left: 30px"
                v-if="model.payWay == 'online'"
                @change="checkPayStyle"
              >
                <el-checkbox label="wechat" style="display: block; margin-bottom: 10px">
                  微信支付
                  <el-input style="width: 640px; margin-left: 15px" v-model="model.activityFee.price">
                    <template slot="append">元</template>
                  </el-input>
                </el-checkbox>
                <el-checkbox label="point" v-show="showintegral" style="display: block; margin-bottom: 20px">
                  积分支付
                  <el-input style="width: 640px; margin-left: 15px" v-model="model.activityFee.point">
                    <template slot="append">积分</template>
                  </el-input>
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="model.payWay == 'online'" style="margin-left: 30px">
                <div v-if="isShowSharerCommission">
                  <!-- 用不了暂时先隐藏 -->
                  <!-- <el-form-item
                    v-if="model.isEnableFee"
                    style="margin-bottom:22px"
                    label="销售佣金"
                    prop="activityFee.distributerCommission"
                    :rules="[
                      { required: true, message: '该字段不能为空' },
                      { pattern: /(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '金额格式不对' }
                    ]"
                  >
                    <el-input style="width: 640px;" v-model="model.activityFee.distributerCommission" ></el-input>
                  </el-form-item>-->
                  <el-form-item
                    v-if="model.isEnableFee"
                    style="margin-bottom: 22px"
                    label="推广佣金"
                    prop="activityFee.sharerCommission"
                    :rules="[
                      { required: true, message: '该字段不能为空' },
                      { pattern: /(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '金额格式不对' }
                    ]"
                  >
                    <el-input style="width: 640px" v-model="model.activityFee.sharerCommission"></el-input>
                  </el-form-item>
                </div>
                <el-form-item
                  v-if="isShowSharerPoint && model.isEnableFee"
                  label="推广积分"
                  prop="activityFee.sharerPoint"
                  :rules="[
                    { required: true, message: '该字段不能为空' },
                    { pattern: /^[0-9]\d*$/, message: '请输入正整数' }
                  ]"
                >
                  <el-input style="width: 640px" v-model="model.activityFee.sharerPoint"></el-input>
                </el-form-item>
              </div>
            </el-radio>

            <el-radio label="offline">
              <div style="display: inline-block; margin-bottom: 20px; margin-top: 20px">
                <div style="width: 710px">
                  <span style="font-size: 14px; color: #606266">活动现场付费</span>
                  <span style="color: #999; font-size: 14px; margin-left: 22px; margin-right: 200px"
                    >显示活动费用但无需线上付费，活动现场再支付</span
                  >
                </div>
              </div>
              <div style="margin-left: 30px" v-if="model.payWay == 'offline'">
                <el-form-item
                  style="margin-bottom: 22px"
                  label="支付金额"
                  prop="activityFee.price"
                  :rules="[
                    { required: true, message: '该字段不能为空' },
                    { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '价格必须大于0' }
                  ]"
                  v-if="model.isEnableFee"
                >
                  <el-input style="width: 640px" v-model="model.activityFee.price" @change="onPriceChange"></el-input>
                </el-form-item>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动简介">
          <el-input type="textarea" v-model="model.info" class="w-750"></el-input>
        </el-form-item>
        <el-form-item label="活动详情" prop="content" :rules="[{ required: true, message: '该字段不能为空' }]">
          <Editor v-model="model.content"></Editor>
        </el-form-item>
        <el-form-item label="排序号" prop="seqNum">
          <el-input-number v-model="model.seqNum"></el-input-number>
        </el-form-item>
        <div style="height: 20px; background: #f5f5f5; margin: 0 -20px"></div>
        <h1 class="content_title">报名表设置<el-button type="text" @click="showAndHidden($event)">展开</el-button></h1>
        <div class="content_item_box">
          <div style="width: 1100px">
            <el-table v-if="model.signDataSettingList.length > 0" :data="model.signDataSettingList">
              <el-table-column label="序号" align="left">
                <template slot-scope="scope">
                  <el-input-number size="small" v-model="scope.row.sort" style="width: 120px"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="输入类型" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="scope.row.type" placeholder="请选择">
                    <el-option
                      v-for="(item, i) in inputType"
                      :key="i"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="显示名称" align="center">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.name"
                    style="width: 150px"
                    :maxlength="32"
                    placeholder="建议字数不超过32字"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="选项" align="center">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    :disabled="scope.row.type !== 2 && scope.row.type !== 3"
                    v-model="scope.row.options"
                    :maxlength="120"
                    placeholder="建议字数不超过120字"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="必填" align="center" width="100px">
                <template slot-scope="scope">
                  <el-switch size="small" v-model="scope.row.isRequired"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="已报名资料显示" align="center" width="100px">
                <template slot-scope="scope">
                  <el-switch size="small" v-model="model.signDataSettingList[scope.$index].isShow"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="显示报名项" align="center" width="120px">
                <template slot-scope="scope">
                  <el-switch size="small" v-model="model.signDataSettingList[scope.$index].isSignShow"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">
                  <el-button
                    :disabled="scope.row.fieldName != ''"
                    size="small"
                    type="danger"
                    @click="changeDataSettingList('delete', scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-button @click="changeDataSettingList()" icon="el-icon-plus" style="margin: 15px auto; display: block"
              >添加报名项</el-button
            >
          </div>
          <div
            style="
              display: inline-block;
              padding: 5px 10px 10px;
              margin: 10px 0;
              font-size: 14px;
              line-height: 1.5;
              color: #777;
              background: #f5f5f5;
            "
          >
            备注：
            <br />1.报名默认字段请不要随便修改，如需增加其他字段，请点击“新增”；
            <br />2.输入类型为单选或多选时，选项请以英文下划线“_”分隔；
            <br />3.已报名资料显示：关闭后，用户查看已报名名单则隐藏此字段；
            <br />4.报名字段：关闭后，用户报名是则会隐藏此字段，无需填写
          </div>
        </div>
        <div style="height: 20px; background: #f5f5f5; margin: 0 -20px"></div>
        <h1 class="content_title">高级设置<el-button type="text" @click="showAndHidden($event)">展开</el-button></h1>
        <div class="content_item_box">
          <el-form-item label="多人报名">
            <el-form-item label="开启多人报名" label-width="230px">
              <el-switch v-model="model.isOneSignMany"></el-switch>
            </el-form-item>
            <el-form-item label="报名人数限制" label-width="150px" v-if="model.isOneSignMany">
              <el-input-number :min="1" v-model="model.oneSignManyMaxNum"></el-input-number>
            </el-form-item>
          </el-form-item>

          <el-form-item label="人数显示">
            <div>
              <el-form-item label="活动详情显示已报名人数" label-width="230px">
                <el-switch v-model="model.activitySignSetting.isShowSignMembers"></el-switch>
              </el-form-item>
              <el-form-item label="已报名人数包含" label-width="230px">
                <el-checkbox v-model="model.activitySignSetting.isEnableSignShow">已报名</el-checkbox>
                <el-checkbox v-model="model.activitySignSetting.isEnableUnpaidShow">待支付</el-checkbox>
                <el-checkbox v-model="model.activitySignSetting.isEnableToAuditShow">待审核</el-checkbox>
                <!-- <el-checkbox>显示报名人列表</el-checkbox> -->
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="报名限制">
            <div>
              <el-form-item label="报名范围" label-width="570px" v-if="is_need_audit == '1'">
                <el-radio-group v-model="model.activitySignSetting.signScope">
                  <el-radio label="all">所有人</el-radio>
                  <el-radio label="auth">认证用户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="必须关注公众号才可报名" label-width="230px">
                <el-switch v-model="model.activitySignSetting.isNeedSubscribe"></el-switch>
              </el-form-item>
              <el-form-item label="允许取消报名" label-width="230px">
                <el-switch v-model="model.activitySignSetting.isEnableUnsign"></el-switch>
              </el-form-item>
              <el-form-item
                v-if="model.activitySignSetting.isEnableUnsign"
                label="取消报名结束时间"
                label-width="150px"
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
              <el-form-item label="报名审核" label-width="230px">
                <el-switch v-model="model.activitySignSetting.isEnableAudit"></el-switch>
              </el-form-item>
              <!-- <el-form-item v-if="model.activitySignSetting.isEnableAudit">
              <el-tooltip content="报名后待管理员审核通过后，再付支付活动费用" placement="top" effect="light">
                <el-switch
                  v-model="model.activitySignSetting.auditAfterPay" 
                  active-text="审核后支付" 
                  @change="onSiginPayWay($event, 'auditAfterPay')"></el-switch>
              </el-tooltip>
              <div style="display: inline-block;margin-left: 20px;">
                <el-tooltip content="报名并支付活动费用后再审核，审核不通过款项会原路退还" placement="top" effect="light">
                  <el-switch
                    v-model="model.activitySignSetting.payAfterAudit" 
                    active-text="支付后审核" 
                    @change="onSiginPayWay($event, 'payAfterAudit')"></el-switch>
                </el-tooltip>
              </div>
            </el-form-item>-->
            </div>
          </el-form-item>

          <el-form-item label="评论留言">
            <el-form-item label="是否支持留言评论" label-width="230px">
              <el-switch v-model="model.isEnableComment"></el-switch>
            </el-form-item>
            <el-form-item label-width="50px" v-if="model.isEnableComment">
              <el-checkbox v-model="model.isEnableCommentAudit">审核后才显示在页面</el-checkbox>
            </el-form-item>
          </el-form-item>
          <el-form-item label="活动样式">
            <el-form-item label="设置活动报名详情样式" label-width="230px"></el-form-item>
            <el-form-item label-width="0px" style="padding: 8px 0">
              <el-radio v-model="model.showStyle" :label="1">样式1</el-radio>
              <el-radio v-model="model.showStyle" :label="2">样式2</el-radio>
            </el-form-item>
          </el-form-item>
          <el-form-item label="报名文本" v-if="model.showStyle == 1">
            <el-input v-model="model.activitySignSetting.signTips" :maxlength="4" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="分享海报">
            <el-form-item label="开启后可自定义上传分享背景海报" label-width="230px">
              <el-switch v-model="model.enableSharePosterBackground"></el-switch>
            </el-form-item>
            <el-form-item v-if="model.enableSharePosterBackground" style="margin-left: 50px; margin-bottom: 22px">
              <QcImageUpload
                width="200px"
                height="280px"
                style="display: inline-block"
                :data="{ imageType: 'activity' }"
                v-model="model.sharePosterBackground"
              ></QcImageUpload>
              <a
                style="text-decoration: underline; margin: 0px 10px; color: #294a7b"
                @click="downloadFile(file.name, file.url)"
                >下载背景模板示例</a
              >
              <div style="display: inline-block; font-size: 12px">(像素不可大于2M)</div>
            </el-form-item>
          </el-form-item>
        </div>
        <div v-show="showintegral == true">
          <div style="height: 20px; background: #f5f5f5; margin: 0 -20px"></div>
          <h1 class="content_title">积分设置<el-button type="text" @click="showAndHidden($event)">展开</el-button></h1>
          <div class="content_item_box">
            <el-form-item label="报名活动">
              <template>
                <span class="point">成功参与活动获得</span>
                <el-input-number
                  type="number"
                  :min="0"
                  v-model="model.activityPointSetting.signPoint"
                  size="small"
                  style="width: 120px; margin: 0 10px; color: #606266"
                ></el-input-number>
                <span class="point">积分</span>
              </template>
            </el-form-item>
            <el-form-item label="转发活动">
              <template>
                <span class="point">将活动分享给好友获得</span>
                <el-input-number
                  :min="0"
                  v-model="model.activityPointSetting.sharePoint"
                  size="small"
                  style="width: 120px; margin: 0 10px"
                ></el-input-number>
                <span class="point">积分，每日上限获得</span>
                <el-input-number
                  :min="0"
                  v-model="model.activityPointSetting.maxSharePointPerDay"
                  size="small"
                  style="width: 120px; margin: 0 10px"
                ></el-input-number>
                <span class="point">积分</span>
              </template>
            </el-form-item>
            <el-form-item label="成功邀请">
              <template>
                <span class="point">每成功邀请一位好友参与活动，获得</span>
                <el-input-number
                  :min="0"
                  v-model="model.activityPointSetting.inviteSignPoint"
                  size="small"
                  style="width: 120px; margin: 0 10px"
                ></el-input-number>
                <span class="point">积分</span>
              </template>
            </el-form-item>
            <el-form-item label="活动签到">
              <template>
                <span class="point">签到成功，获得</span>
                <el-input-number
                  :min="0"
                  v-model="model.activityPointSetting.checkinPoint"
                  size="small"
                  style="width: 120px; margin: 0 10px"
                ></el-input-number>
                <span class="point">积分</span>
              </template>
            </el-form-item>
          </div>
          <div style="height: 20px; background: #f5f5f5; margin: 0 -20px"></div>
        </div>
      </div>
      <div v-show="type == 'notify'">
        <el-form-item label="通知提醒" label-width="230px">
          <el-switch v-model="model.activitySignSetting.isEnableRemindMsg"></el-switch>
        </el-form-item>
        <div v-if="model.activitySignSetting.isEnableRemindMsg">
          <el-form-item label="微信客服接口通知" label-width="230px">
            <el-switch v-model="model.activitySignSetting.isEnableWxRemind"></el-switch>
          </el-form-item>
          <el-form-item
            label="报名成功信息"
            v-if="model.activitySignSetting.isEnableWxRemind"
            prop="activitySignSetting.signMsg"
            label-width="200px"
            class="w-750"
            :rules="[{ message: '请填写该字段', required: true }]"
          >
            <el-input type="textarea" v-model="model.activitySignSetting.signMsg"></el-input>
          </el-form-item>
          <el-form-item label="微信模板消息通知" label-width="230px">
            <el-switch v-model="model.activitySignSetting.isEnableWxTemplateRemind"></el-switch>
          </el-form-item>
        </div>
      </div>
      <div v-show="type == 'check'">
        <el-form-item label="设置活动签到">
          <el-switch v-model="model.isEnableCheckin"></el-switch>
        </el-form-item>
        <!-- <el-form-item label="签到并且退款">
          <el-switch v-model="model.isEnableCheckinRefund"></el-switch>
        </el-form-item>-->
        <div v-if="model.isEnableCheckin">
          <el-form-item label="签到时间设置">
            <div style="width: 800px">
              <el-table :data="model.activityCheckinSetting.checkinTimeList">
                <el-table-column label="签到开始时间" align="left" width="230px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`activityCheckinSetting.checkinTimeList.${scope.$index}.checkinStartTime`"
                      :rules="[{ required: true, message: '请填写该字段' }]"
                    >
                      <el-date-picker
                        type="datetime"
                        placeholder="选择日期"
                        v-model="scope.row.checkinStartTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="签到结束时间" align="center" width="230px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`activityCheckinSetting.checkinTimeList.${scope.$index}.checkinEndTime`"
                      :rules="[{ required: true, message: '请填写该字段' }]"
                    >
                      <el-date-picker
                        type="datetime"
                        placeholder="选择日期"
                        v-model="scope.row.checkinEndTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="签到迟到时间" align="center" width="230px">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`activityCheckinSetting.checkinTimeList.${scope.$index}.checkinLateTime`"
                      :rules="[{ required: true, message: '请填写该字段' }]"
                    >
                      <el-date-picker
                        type="datetime"
                        placeholder="选择日期"
                        v-model="scope.row.checkinLateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        :editable="false"
                      ></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="changeCheckTimeList('delete', scope.$index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <el-button @click="changeCheckTimeList()" icon="el-icon-plus" style="margin: 20px auto; display: block"
                >新增</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="签到提醒信息">
            <el-form-item label-width="230px" label="提醒信息">
              <el-switch v-model="model.activityCheckinSetting.isEnableRemindMsg"></el-switch>
            </el-form-item>
            <div v-if="model.activityCheckinSetting.isEnableRemindMsg">
              <el-form-item label-width="230px" label="微信客服接口通知">
                <el-switch v-model="model.activityCheckinSetting.isEnableWxRemind"></el-switch>
              </el-form-item>
              <div v-if="model.activityCheckinSetting.isEnableWxRemind">
                <el-form-item
                  label-width="200px"
                  label="签到回复"
                  prop="activityCheckinSetting.checkinMsg"
                  :rules="[{ message: '请填写该字段', required: true }]"
                  class="el-form-item__child"
                >
                  <el-input
                    type="textarea"
                    style="width: 550px"
                    v-model="model.activityCheckinSetting.checkinMsg"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="200px"
                  label="未报名直接签到信息"
                  prop="activityCheckinSetting.checkinBySuddenMsg"
                  :rules="[{ message: '请填写该字段', required: true }]"
                  class="el-form-item__child"
                >
                  <el-input
                    type="textarea"
                    style="width: 550px"
                    v-model="model.activityCheckinSetting.checkinBySuddenMsg"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="200px"
                  label="签到不通过信息"
                  class="el-form-item__child"
                  prop="activityCheckinSetting.checkinNotPassMsg"
                  :rules="[{ message: '请填写该字段', required: true }]"
                >
                  <el-input
                    type="textarea"
                    style="width: 550px"
                    v-model="model.activityCheckinSetting.checkinNotPassMsg"
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label-width="230px" label="微信模板消息通知">
                <el-switch v-model="model.activityCheckinSetting.isEnableWxTemplateRemind"></el-switch>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="暗号签到">
            <el-form-item label-width="230px" label="开启暗号签到">
              <el-switch v-model="model.activityCheckinSetting.isCheckinCode"></el-switch>
            </el-form-item>
            <el-form-item
              label-width="200px"
              label="签到暗号"
              v-if="model.activityCheckinSetting.isCheckinCode"
              prop="activityCheckinSetting.checkinCode"
              :rules="[{ message: '请填写该字段', required: true }]"
            >
              <el-input style="width: 550px" v-model="model.activityCheckinSetting.checkinCode"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="手机号码签到">
            <el-form-item label-width="230px" label="输入手机报名签到">
              <el-switch v-model="model.activityCheckinSetting.isEnableMobileCheckin"></el-switch>
            </el-form-item>
            <el-form-item label-width="0" v-if="model.activityCheckinSetting.isEnableMobileCheckin">
              <el-checkbox v-model="model.activityCheckinSetting.isRequireSelfCheckin"
                >需要报名本人才可签到</el-checkbox
              >
            </el-form-item>
          </el-form-item>
          <el-form-item label="空降嘉宾签到">
            <el-form-item label-width="230px" label="针对现场直接签到得嘉宾">
              <el-switch v-model="model.activityCheckinSetting.isEnableAirborne"></el-switch>
            </el-form-item>
            <el-form-item label-width="230px" label="允许未报名直接签到">
              <el-switch v-model="model.activityCheckinSetting.isEnableSudden"></el-switch>
            </el-form-item>
            <el-form-item label-width="230px" label="将空降嘉宾功能显示到签到页面">
              <el-switch v-model="model.activityCheckinSetting.isShowAirborne"></el-switch>
            </el-form-item>
          </el-form-item>
          <el-form-item label="签到成功展示字段" label-width="150px">
            <el-checkbox-group v-model="signSuccessShowField" :max="5">
              <el-checkbox v-for="item in model.signDataSettingList" :key="item.fieldName" :label="item.fieldName">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
            <p style="color: #888; font-size: 12px; line-height: 20px">提示：最多可勾选5个</p>
          </el-form-item>
          <el-form-item label="签到背景图">
            <div class="checkin-img-lists">
              <el-form-item
                class="checkin-img-list"
                prop="activityCheckinSetting.checkUrl"
                :rules="[{ message: '请填写该字段', required: true }]"
              >
                <p>签到首页</p>
                <QcImageUpload
                  width="250px"
                  height="445px"
                  :data="{ imageType: 'activity' }"
                  v-model="model.activityCheckinSetting.checkUrl"
                ></QcImageUpload>
              </el-form-item>
              <!-- <el-form-item
                class="checkin-img-list"
                prop="activityCheckinSetting.successUrl"
                :rules="[{ message: '请填写该字段', required: true }]"
              >
                <p>签到成功页</p>
                <QcImageUpload
                  width="250px"
                  height="445px"
                  :data="{ imageType: 'activity' }"
                  v-model="model.activityCheckinSetting.successUrl"
                ></QcImageUpload>
              </el-form-item>-->
              <el-form-item
                class="checkin-img-list"
                prop="activityCheckinSetting.failUrl"
                :rules="[{ message: '请填写该字段', required: true }]"
              >
                <p>签到失败</p>
                <QcImageUpload
                  width="250px"
                  height="250px"
                  :data="{ imageType: 'activity' }"
                  v-model="model.activityCheckinSetting.failUrl"
                ></QcImageUpload>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div style="height: 50px"></div>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="btnLoading" @click="onSubmit()">保存</el-button>
    </div>
    <CategoryFormDialog
      :parent-id="parentId"
      :type="2"
      :visible="categoryFormVisible"
      @close="categoryFormClose"
    ></CategoryFormDialog>
    <TagFormDialog :type="3" :visible="tagFormVisible" @close="tagFormClose"></TagFormDialog>
    <!-- 活动分类管理 -->
    <el-dialog
      custom-class="activity-dialog"
      title="活动分类管理"
      :visible.sync="categoryListDialogVisible"
      width="70%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="30px"
    >
      <Category :type="2"></Category>
    </el-dialog>
    <!-- 活动标签管理 -->
    <el-dialog
      custom-class="activity-dialog"
      title="活动分类管理"
      :visible.sync="tagListDialogVisible"
      width="70%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      top="30px"
    >
      <Tag :type="3"></Tag>
    </el-dialog>
  </QcNavigationPage>
</template>

<script>
import _ from 'lodash'
import { getActivity, addActivity, updateActivity } from '../../api/activity'
// 签到失败默认图
const FailUrl = '/attachments/activity/a3b7d4a563304b508212e8e4034aa27d.png'

export default {
  inject: ['reload'],
  data() {
    return {
      file: {
        url:
          'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com/public/activity/activity-share-poster-template.psd',
        name: 'pic'
      },
      btnLoading: false, // 保存按钮加载状态
      userAccount: '',
      is_need_audit: '0',
      isOpenShareActivity: false,
      type: 'base',
      parentId: '',
      isShowSharerCommission: false,
      isShowSharerPoint: false,
      // 报名成功展示字段
      signSuccessShowField: [],
      model: {
        checkList: [],
        visitQuantity: 0,
        isOneSignMany: false,
        oneSignManyMaxNum: 1,
        showStyle: 1,
        title: '',
        isShowBase: 1,
        status: '',
        categoryId: '',
        seqNum: null,
        couponRuleId: '',
        activityTagList: [],
        isRelease: false,
        iconUrl: '',
        sharePosterBackground: '',
        info: '',
        sponsor: '',
        organizer: '',
        city: '',
        place: '',
        address: '',
        startTime: '',
        endTime: '',
        isEnableCheckinRefund: false,
        isEnableComment: false,
        isEnableCommentAudit: false,
        isEnableFee: false,
        isEnableAloneItem: false,
        enableSharePosterBackground: false,
        content: '',
        payWay: '',
        ispaystyle: false,
        activityFee: {
          price: '',
          vipPrice: '',
          isPromotion: false,
          promotionPrice: '',
          promotionStartTime: '',
          distributerCommission: 0,
          distributerCommissionNeedAudit: false,
          sharerCommission: '',
          sharerPoint: '',
          sharerCommissionNeedAudit: false,
          point: ''
        },
        isEnableCheckin: false,
        activitySignSetting: {
          signTips: '我要报名',
          signScope: 'all',
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
          failUrl: '/attachments/activity/a3b7d4a563304b508212e8e4034aa27d.png',
          // 报名成功展示字段，多个用|竖线分割
          signSuccessShowField: ''
        },
        signDataSettingList: [],
        activityItemList: [],
        activityPointSetting: {
          signPoint: 0,
          checkinPoint: 0,
          sharePoint: 0,
          maxSharePoint: 0,
          maxSharePointPerDay: 0,
          inviteSignPoint: 0
        }
      },
      tagFormVisible: false,
      tagList: [],
      categoryFormVisible: false,
      categoryList: [],
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 },
        { name: '附件', value: 7 }
      ],
      showintegral: true,
      // 活动分类管理
      categoryListDialogVisible: false,
      // 活动标签管理
      tagListDialogVisible: false,
      isShow: false
    }
  },
  created() {
    this.userAccount = JSON.parse(localStorage.getItem('user')).username
    this.getConfig()
    this.abilityIsOpenShareActivity()
    this.pageTag()
    this.listCategory()
    this.isShowintegral()
    // this.getDistributerCommissionConfig()
    this.$http.get('api/v1/ability-is-open/share-activity').then((res) => {
      this.isShowSharerCommission = res.data.data
    })
    this.$http.get('api/v1/ability-is-open/score-activity-share').then((res) => {
      this.isShowSharerPoint = res.data.data
    })
    if (this.$route.query.id) {
      this.apiGetActivity(this.$route.query.id)
    } else {
      this.getSignDataSetting()
    }
  },
  methods: {
    // 切换收费类型
    enableFeeChange(val) {
      // 如果开启了免费，微信支付，推广积分，佣金什么的都不显示，并且把值设为 0
      // val为false是免费
      // console.log('enableFeeChange==>', val)
      if (!val) {
        this.model.payWay = ''
        this.model.activityFee.price = 0
        this.model.activityFee.point = 0
        this.model.activityFee.sharerCommission = 0
        this.model.activityFee.sharerPoint = 0
      }
    },
    // 是否显示积分设置
    isShowintegral() {
      this.$http.isShowintegral().then((res) => {
        console.log(res.data)
        this.showintegral = res.data.data
      })
    },
    downloadFile(fileName, data) {
      if (!data) {
        return
      }
      // let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a')
      // link.style.display = 'none';
      link.download = fileName
      link.href = data
      // link.setAttribute('download', fileName);
      // document.body.appendChild(link);
      link.click()
    },
    onPriceChange(val) {
      if (
        this.model.isEnableFee &&
        this.model.ispaystyle &&
        this.model.activityFee.price &&
        this.activityCommissionRate1 &&
        this.isOpenShareActivity
      ) {
        this.model.activityFee.distributerCommission = (
          (parseFloat(val) * 100 * this.activityCommissionRate1) /
          10000 /
          100
        ).toFixed(2)
        this.model.activityFee.sharerCommission = (
          (parseFloat(val) * 100 * this.activityCommissionRate1) /
          10000 /
          100
        ).toFixed(2)
      }
    },
    checkPayStyle(e) {
      console.log(e)
      if (e.length == 1 && e[0] !== 'wechat') {
        this.model.activityFee.price = 0
      }
      if (e.length == 1 && e[0] !== 'point') {
        this.model.activityFee.point = 0
      }
    },
    getDistributerCommissionConfig() {
      this.$http.getDistributerCommissionConfig().then((res) => {
        this.activityCommissionRate1 = res.data.data.activityCommissionRate1
      })
    },
    getConfig() {
      this.$http.get(`api/admin/v1/config/is_need_audit`).then((res) => {
        this.is_need_audit = res.data.data.value
      })
    },
    abilityIsOpenShareActivity() {
      this.$http.get(`api/v1/ability-is-open/share-activity`).then((res) => {
        this.isOpenShareActivity = res.data.data
        if (this.isOpenShareActivity) {
          this.getDistributerCommissionConfig()
          this.model.activityFee.distributerCommission = this.model.activityFee.distributerCommission / 100
          this.model.activityFee.sharerCommission = this.model.activityFee.sharerCommission / 100
        } else {
          this.model.activityFee.distributerCommission = ''
          this.model.activityFee.sharerCommission = ''
        }
      })
    },
    pageTag() {
      this.$http.pageTag({ type: 3 }).then((res) => {
        this.tagList = res.data.data.list
      })
    },
    tagFormClose(isRefresh) {
      isRefresh && this.pageTag()
      this.tagFormVisible = false
    },
    listCategory() {
      this.$http.listForTreeCategory(2).then((res) => {
        this.parentId = res[0].parentId
        this.categoryList = res
      })
    },
    categoryFormClose(isRefresh) {
      isRefresh && this.listCategory()
      this.categoryFormVisible = false
    },
    // 获取活动详情
    apiGetActivity(id) {
      getActivity({ id }).then((res) => {
        if (this.$route.query.copy) {
          this.model = _.merge(this.model, this.copy(res.data.data))
        } else {
          this.model = _.merge(this.model, res.data.data)
        }
        this.model.signDataSettingList = res.data.data.signDataSettingList
        this.model.activityFee.price = this.model.activityFee.price / 100

        this.model.activityTagList = this.model.activityTagList.map((item) => item.tagId)

        // if(res.data.data.activityPointSetting && res.data.data.activityPointSetting.signPoint){
        //   this.model.activityPointSetting = res.data.data.activityPointSetting
        // }
        // 自动选中支付方式
        if (this.model.activityFee.price && this.model.activityFee.point) {
          this.model.checkList = ['wechat', 'point']
        } else if (res.data.data.activityFee.price) {
          this.model.checkList = ['wechat']
        } else if (res.data.data.activityFee.point) {
          this.model.checkList = ['point']
        }

        // 如果没有默认图，那么设置默认的签到失败图
        if (this.model.activityCheckinSetting && !this.model.activityCheckinSetting.failUrl) {
          this.model.activityCheckinSetting.failUrl = FailUrl
        }

        // 方便操作 将报名成功展示字段拆分成数组
        if (this.model.activityCheckinSetting && this.model.activityCheckinSetting.signSuccessShowField) {
          this.signSuccessShowField = this.model.activityCheckinSetting.signSuccessShowField.split('|')
        }

        // if (this.model.activitySignSetting) {
        //   if (!this.model.activitySignSetting.auditAfterPay && !this.model.activitySignSetting.payAfterAudit) {
        //     this.model.activitySignSetting.auditAfterPay = true
        //     this.model.activitySignSetting.payAfterAudit = false
        //   }
        // }
        this.abilityIsOpenShareActivity()
        // this.model.activityFee.distributerCommission = this.model.activityFee.distributerCommission / 100
        // this.model.activityFee.sharerCommission = this.model.activityFee.sharerCommission / 100
      })
    },
    apiUpdateActivity(model) {
      updateActivity(model)
        .then(() => {
          this.$message.success('保存成功')
          this.$router.back()
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    apiAddActivity(model) {
      addActivity(model)
        .then(() => {
          this.$message.success('保存成功')
          this.$router.back()
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map((item) => {
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
              model[key][v].map((item) => {
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
      // console.log(JSON.stringify(model, null, 1))
      return model
    },
    // 获取报名字段
    getSignDataSetting() {
      this.$http.getSignDataSetting().then((res) => {
        this.model.signDataSettingList = res.data.data.map((item) => {
          item.isSystem = false
          return item
        })
      })
    },
    // 添加报名字段
    changeDataSettingList(type = 'add', index) {
      if (type === 'add') {
        let data = {
          sort: (this.model.signDataSettingList.length + 1) * 10,
          name: '',
          fieldName: '',
          type: 1,
          options: '',
          isRequired: true,
          isShow: true,
          isSignShow: true,
          isSystem: false
        }
        this.model.signDataSettingList.push(data)
      } else {
        this.model.signDataSettingList.splice(index, 1)
      }
    },
    // 添加签到时间
    changeCheckTimeList(type = 'add', index) {
      if (type === 'add') {
        this.model.activityCheckinSetting.checkinTimeList.push({
          checkinStartTime: '',
          checkinEndTime: '',
          checkinLateTime: ''
        })
      } else {
        this.model.activityCheckinSetting.checkinTimeList.splice(index, 1)
      }
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
    // 保存提交
    onSubmit() {
      this.$refs.model.validate((flag) => {
        if (flag) {
          let model = JSON.parse(JSON.stringify(this.model))
          // 活动标签格式转换
          model.activityTagList = model.activityTagList.map((item) => {
            return { tagId: item }
          })
          // 金额转换
          model.activityFee.price = parseFloat(model.activityFee.price || 0) * 100
          model.activityFee.distributerCommission = parseFloat(model.activityFee.distributerCommission || 0) * 100
          model.activityFee.sharerCommission = parseFloat(model.activityFee.sharerCommission || 0) * 100
          // 将报名成功展示字段转转成接口要的格式：字段串
          model.activityCheckinSetting.signSuccessShowField = this.signSuccessShowField.join('|')
          // 判断是新增还是修改
          this.btnLoading = true
          model.id ? this.apiUpdateActivity(model) : this.apiAddActivity(model)
          console.log(model)
        }
      })
    },
    // 收起展开
    showAndHidden(evt) {
      let dom = evt.target.parentNode.parentNode.nextSibling
      if (dom.offsetHeight == 0) {
        dom.style.height = 'auto'
        dom.style.overflow = 'auto'
        evt.target.innerText = '收起'
        return
      }
      dom.style.height = 0
      dom.style.overflow = 'hidden'
      evt.target.innerText = '展开'
    }
  }
}
</script>
<style lang="scss" scoped>
.content_title {
  padding: 22px 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
  .el-button {
    margin-left: auto;
  }
}
.content_item_box {
  height: 0;
  overflow: hidden;
}

.activity-form {
  ::v-deep.el-switch {
    padding: 8px 0; //为了保证和表单项水平对齐
  }
  .w-750 {
    width: 750px;
  }
  .activity-form__tabs {
    width: 300px;
    margin-bottom: 40px;
    display: flex;
    .activity-form__tab {
      width: 100px;
      text-align: center;
      list-style: none;
      padding: 10px;
      background: #f5f5f5;
      cursor: default;
    }
    .activity-form__tab--active {
      color: #fff;
      background: $--color-primary;
    }
  }
  .el-form-item__child {
    margin-bottom: 22px;
  }
  .checkin-img-lists {
    display: flex;
    .checkin-img-list {
      margin-right: 20px;
    }
  }
}
.danwei {
  background: #eee;
  height: 36px;
  padding: 10px;
  border-radius: 5px;
}
.point {
  color: #606266;
}

.activity-dialog {
  ::v-deep.el-dialog__body {
    padding: 0 20px;
  }
}
</style>
