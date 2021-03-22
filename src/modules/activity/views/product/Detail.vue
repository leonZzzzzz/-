<template>
  <div
    class="wrap"
    ref="wrap"
    v-loading="dataLoading"
    element-loading-text="加载中..."
  >
    <!-- 主体区域开始 -->
    <div
      class="area-box"
      ref="areaBox"
      :style="{ height: `${areaHeight}px`, 'overflow-y': 'auto' }"
    >
      <QcNavigationPage
        :content="model.title || '报名详情'"
        :full="false"
        background="transparent"
      >
        <el-menu
          mode="horizontal"
          :default-active="activeIndex"
          @select="handleSelect"
          :class="{ 'fixed-tab': fixedTab }"
        >
          <el-menu-item
            v-for="(item, i) in sidebarList"
            :key="i"
            :index="item.index"
          >{{ item.title }}</el-menu-item>
        </el-menu>
        <div
          v-if="fixedTab"
          style="height: 61px;"
        ></div>
        <div class="content">
          <!-- 报名区域开始 -->
          <div v-show="activeIndex === '1'">
            <div class="active-title">报名列表（{{ signData.page.total }}）</div>
            <div class="search-box padding">
              <el-form
                :inline="true"
                size="small"
              >
                <el-form-item label="手机号或姓名">
                  <el-input
                    placeholder="请输入手机号或姓名"
                    v-model="signData.page.param"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="
                      signData.page.pageNum = 1
                      activitySign()
                    "
                  >查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="padding">
              <el-radio-group
                v-model="signData.page.status"
                size="small"
                @change="activitySign"
              >
                <el-radio-button
                  :label="item.index"
                  v-for="(item, i) in radioType"
                  :key="i"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="select-btn padding">
              <div class="left">
                <p>
                  已选择
                  <span>{{ signData.selectionList.length || 0 }}</span>个报名用户
                </p>
                <el-button
                  size="small"
                  style="width: 80px;"
                  @click="checkAuditSign(2)"
                  :disabled="signData.selectionList.length === 0"
                >通过</el-button>
                <el-button
                  size="small"
                  style="width: 80px;"
                  @click="checkAuditSign(3)"
                  :disabled="signData.selectionList.length === 0"
                >拒绝</el-button>
                <el-button
                  size="small"
                  style="width: 110px;"
                  @click="cancelConfirm(1)"
                  :disabled="signData.selectionList.length === 0"
                >取消报名(单选)</el-button>
                <el-button
                  size="small"
                  style="width: 110px;"
                  @click="cancelConfirm(2)"
                  :disabled="signData.selectionList.length === 0"
                >退款(单选)</el-button>
                <el-button
                  size="small"
                  style="width: 110px;"
                  @click="offlinePay()"
                  :disabled="signData.selectionList.length === 0"
                >线下支付</el-button>
                <el-button
                  v-if="isHasSignFile"
                  size="small"
                  style="width: 110px;"
                  @click="downloadSignFile"
                  :loading="downloadTaskBtnLoading"
                  :disabled="signData.selectionList.length === 0"
                >下载附件</el-button>
                <el-button
                  v-if="isHasSignFile"
                  type="primary"
                  size="small"
                  style="width: 110px;"
                  @click="() => (downloadTaskDialog = !downloadTaskDialog)"
                >查看下载任务</el-button>
              </div>
              <div class="right">
                <up-load-file
                  :id="$route.query.id"
                  :data="{ sourceId: $route.query.id }"
                  :file-type="[]"
                  title="导入Excel"
                  url="api/admin/v1/activitySign/importData"
                  @file-success="activitySign"
                ></up-load-file>
                <el-button
                  size="mini"
                  style="width: 80px;margin-left:10px"
                  @click="activitySignExportData()"
                  :disabled="signData.tableData.length === 0"
                >导出Excel</el-button>
                <el-button
                  v-if="isHasSignFile"
                  size="mini"
                  style="width: 100px;"
                  @click="downloadDialog = true"
                  :disabled="signData.tableData.length === 0"
                >下载全部附件</el-button>
                <!-- <el-button size="small" style="width: 80px;">群发信息</el-button> -->
              </div>
            </div>
            <table-box
              style="height: auto"
              :tableData="signData.tableData"
              :propData="signData.propData"
              :page="signData.page"
              :activeIndex="activeIndex"
              @get-selection="getSelection"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :is-loading="isLoading"
            ></table-box>
          </div>
          <!-- 报名区域结束 -->

          <!-- 签到区域开始 -->
          <div v-show="activeIndex === '2'">
            <div
              class="active-title"
              v-if="model.activityCheckinSetting"
            >签到时间</div>
            <div
              class="check-time"
              v-if="model.activityCheckinSetting"
            >
              <el-table
                :data="model.activityCheckinSetting.checkinTimeList"
                @row-click="listCheckin"
              >
                <el-table-column
                  label="签到开始时间"
                  prop="checkinStartTime"
                ></el-table-column>
                <el-table-column
                  label="签到结束时间"
                  prop="checkinEndTime"
                ></el-table-column>
                <el-table-column
                  label="签到迟到时间"
                  prop="checkinLateTime"
                ></el-table-column>
                <el-table-column label="签到二维码">
                  <template slot-scope="scope">
                    <el-popover
                      v-if="
                        (!$store.state.appTypeList.length || $store.state.appTypeList.some((item) => item === 2)) &&
                          scope.row.checkinQrcodeUrl
                      "
                      placement="right"
                      width="300"
                      trigger="click"
                    >
                      <img
                        :src="imgHost + scope.row.checkinQrcodeUrl"
                        alt
                        style="width: 100%;"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="mini"
                      >二维码</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="手机二维码"
                  v-if="model.activityCheckinSetting.isEnableMobileCheckin"
                >
                  <template slot-scope="scope">
                    <el-popover
                      v-if="
                        (!$store.state.appTypeList.length || $store.state.appTypeList.some((item) => item === 2)) &&
                          scope.row.checkinSettingId
                      "
                      placement="right"
                      width="300"
                      trigger="click"
                    >
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=1`
                        "
                        v-if="scope.row.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=1`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=1`
                            )
                          "
                        >复制</el-button>
                      </div>
                      <el-button
                        slot="reference"
                        type="primary"
                        size="mini"
                      >二维码</el-button>
                    </el-popover>
                    <WxQRCode
                      v-if="$store.state.appTypeList.some((item) => item === 3) && scope.row.checkinSettingId"
                      size="mini"
                      :options="{ name: 'mobileCheckin', scene: scope.row.checkinSettingId, fileName: wxQrcodeFileName(scope.row.checkinStartTime)}"
                    ></WxQRCode>
                  </template>
                </el-table-column>
                <el-table-column
                  label="暗号二维码"
                  v-if="model.activityCheckinSetting.checkinCode"
                >
                  <template slot-scope="scope">
                    <el-popover
                      v-if="
                        (!$store.state.appTypeList.length || $store.state.appTypeList.some((item) => item === 2)) &&
                          scope.row.checkinSettingId
                      "
                      placement="right"
                      width="300"
                      trigger="click"
                    >
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=2`
                        "
                        v-if="scope.row.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=2`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${scope.row.checkinSettingId}&checkWay=2`
                            )
                          "
                        >复制</el-button>
                      </div>
                      <el-button
                        slot="reference"
                        type="primary"
                        size="mini"
                      >二维码</el-button>
                    </el-popover>
                    <WxQRCode
                      v-if="$store.state.appTypeList.some((item) => item === 3) && scope.row.checkinSettingId"
                      size="mini"
                      :options="{ name: 'codeCheckin', scene: scope.row.checkinSettingId, fileName: wxQrcodeFileName(scope.row.checkinStartTime) }"
                    ></WxQRCode>
                  </template>
                </el-table-column>
                <el-table-column
                  label="空降嘉宾"
                  v-if="model.activityCheckinSetting.isEnableAirborne"
                >
                  <template slot-scope="scope">
                    <el-popover
                      v-if="
                        (!$store.state.appTypeList.length || $store.state.appTypeList.some((item) => item === 2)) &&
                          scope.row.checkinSettingId
                      "
                      placement="right"
                      width="300"
                      trigger="click"
                    >
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/activity/join?wo=1&wot=2&woacm=1&mpl=1&id=${$route.query.id}&checkinSettingId=${scope.row.checkinSettingId}`
                        "
                        v-if="scope.row.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/activity/join?wo=1&wot=2&woacm=1&mpl=1&id=${$route.query.id}&checkinSettingId=${scope.row.checkinSettingId}`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/activity/join?wo=1&wot=2&woacm=1&mpl=1&id=${$route.query.id}&checkinSettingId=${scope.row.checkinSettingId}`
                            )
                          "
                        >复制</el-button>
                      </div>
                      <el-button
                        slot="reference"
                        type="primary"
                        size="mini"
                      >二维码</el-button>
                    </el-popover>
                    <WxQRCode
                      v-if="$store.state.appTypeList.some((item) => item === 3) && scope.row.checkinSettingId"
                      size="mini"
                      :options="{ name: 'airborneCheckin', scene: scope.row.checkinSettingId, fileName: wxQrcodeFileName(scope.row.checkinStartTime) }"
                    ></WxQRCode>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="active-title">签到列表（{{ checkData.page.total }}）</div>
            <div class="select-btn padding">
              <div class="left">
                <el-form :inline="true">
                  <el-form-item>
                    <el-input
                      placeholder="请输入手机号或姓名"
                      v-model="checkData.page.param"
                      size="small"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      size="small"
                      @click="
                        checkData.page.pageNum = 1
                        listCheckin()
                      "
                    >查询</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="checkExportData()"
                    >导出Excel</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <table-box
              :tableData="checkData.tableData"
              :propData="checkData.propData"
              :page="checkData.page"
              :activeIndex="activeIndex"
              @get-selection="getSelection"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :currentRow="true"
              :is-loading="isLoading"
            ></table-box>
          </div>
          <!-- 签到区域结束 -->

          <!-- 评论区域开始 -->
          <div v-show="activeIndex === '3'">
            <div class="active-title">评伦列表（{{ commentData.page.total }}）</div>
            <div class="padding">
              <el-radio-group
                v-model="commentData.page.auditStatus"
                size="small"
                @change="activityComment"
              >
                <el-radio-button
                  :label="item.index"
                  v-for="(item, i) in evaluateType"
                  :key="i"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="padding">
              <el-button
                size="small"
                style="width: 80px;"
                type="primary"
                @click="auditComment()"
                :disabled="commentData.row.id == null"
              >审核</el-button>
              <el-button
                size="small"
                style="width: 80px;"
                type="primary"
                @click="refuseComment()"
                :disabled="commentData.row.id == null"
              >拒绝</el-button>
              <el-button
                size="small"
                style="width: 80px;"
                type="danger"
                @click="deleteConfirm()"
                :disabled="commentData.row.id == null"
              >删除</el-button>
            </div>
            <table-box
              :tableData="commentData.tableData"
              :propData="commentData.propData"
              :page="commentData.page"
              :activeIndex="activeIndex"
              @get-selection="getSelection"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              @row-click="handleRowClick"
              :currentRow="true"
              :is-loading="isLoading"
            ></table-box>
          </div>
          <!-- 评论区域结束 -->

          <div v-show="activeIndex === '4'">
            <div class="time">数据统计时间为：活动发布时间(2018-02-12 17:00) —— 当前时间(2018-05-18 14:46)</div>
          </div>
        </div>
      </QcNavigationPage>
    </div>
    <!-- 主体区域结束 -->
    <!-- 弹窗区域 -->
    <el-dialog
      :visible="payDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="线下支付"
      width="400px"
    >
      <el-form
        size="small"
        :model="payModel"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="支付方式">
          <el-select
            v-model="payModel.payChannel"
            style="width:100%"
          >
            <el-option
              v-for="pay in payLists"
              :key="pay.value"
              :label="pay.name"
              :value="pay.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="payModel.transactionNo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          size="small"
          @click="onPayClose()"
        >关闭</el-button>
        <el-button
          size="small"
          type="primary"
          @click="payCharge()"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible="downloadDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="() => (downloadDialog = false)"
      title="下载历史"
      width="500px"
    >
      <QcTable
        :option="{
          isFull: false,
          height: '400',
          url: `api/admin/v1/activitySignFile/page?activityId=${$route.query.id}`
        }"
        :column="column"
      ></QcTable>
    </el-dialog>
    <!-- 下载任务 -->
    <el-dialog
      :visible="downloadTaskDialog"
      :append-to-body="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="() => (downloadTaskDialog = false)"
      title="下载任务"
      width="800px"
    >
      <QcTable
        ref="downloadTaskTable"
        :menu="downloadTaskData.menu"
        :option="{
          isFull: false,
          height: '400',
          url: `api/admin/v1/activity-sign-file-download-task/page?sourceId=${$route.query.id}`
        }"
        :column="downloadTaskData.propData"
      ></QcTable>
    </el-dialog>
  </div>
</template>

<script>
import tableBox from './Table'
import Qrcode from '@xkeshi/vue-qrcode'
import qs from 'qs'
export default {
  components: {
    tableBox,
    Qrcode
  },
  data() {
    return {
      baseHost: '',
      fixedTab: false,
      options: {
        size: 300
      },
      sidebarList: [
        { index: '1', title: '报名管理' },
        { index: '2', title: '签到管理' },
        { index: '3', title: '评论管理' }
        // { index: '4', title: '数据统计' },
      ],
      activeIndex: '1',
      model: {
        activitySignSetting: {},
        activityTagList: {},
        activityFee: {}
      },
      payDialog: false,
      payLists: [],
      payModel: {
        id: '',
        payChannel: '',
        transactionNo: ''
      },
      isHasSignFile: false, // 是否有报名附件，如果有则显示“下载指定附件”按钮
      // isHasDownloadTaskSignFile: false, // 是否在进行下载任务，如果有则显示“查看下载任务”按钮
      downloadTaskBtnLoading: false, // 下载附件按钮loading
      downloadTaskDialog: false, // 是否显示下载任务弹窗
      // 下载附件任务表格
      downloadTaskData: {
        menu: [
          {
            label: '刷新',
            on: row => {
              this.$refs.downloadTaskTable && this.$refs.downloadTaskTable.onSearch()
            }
          }
        ],
        propData: [
          // { prop: 'zipUrl', label: '打包文件URL', 'show-overflow-tooltip': true },
          {
            prop: 'size',
            label: '文件大小',
            formatter: row => {
              if (!row.size) return ''
              return (row.size / 1024 / 1024).toFixed(2) + 'MB'
            }
          },
          {
            prop: 'status',
            label: '状态',
            formatter: row => {
              if (row.status == 'ongoing') return '进行中'
              else if (row.status == 'finished') return '已完成'
              else return row.status
            }
          },
          { prop: 'createTime', label: '开始时间' },
          { prop: 'finishTime', label: '完成时间' },
          {
            label: '操作',
            align: 'right',
            formatter: row => {
              return (
                <el-button
                  size="mini"
                  type="primary"
                  disabled={row.status == 'finished' && row.zipUrl ? false : true}
                  onClick={() => {
                    window.open(row.host + row.zipUrl + '?t=' + Date.now())
                  }}
                >
                  下载
                </el-button>
              )
            }
          }
        ]
      },
      downloadDialog: false,
      areaHeight: 0,
      radio: 1,
      radioType: [
        { index: 0, name: '全部' },
        { index: 1, name: '待审核' },
        // { index: 2, name: "审核通过" },
        { index: 3, name: '审核不通过' },
        { index: 4, name: '待支付' },
        // { index: 5, name: "已支付" },
        { index: 6, name: '已报名' },
        // { index: 7, name: "已退款" },
        { index: 8, name: '已取消' }
      ],
      checkType: [
        { index: 1, name: '全部' },
        { index: 2, name: '已签到' },
        { index: 3, name: '未签到' }
      ],
      evaluateType: [
        { index: '', name: '全部' },
        { index: 1, name: '未审核' },
        { index: 2, name: '已审核' },
        { index: 3, name: '已拒绝' }
      ],
      payment: [
        { index: 0, name: '微信支付' },
        { index: 1, name: '积分支付' }
      ],
      signData: {
        radio: 0,
        tableData: [],
        propData: [
          { prop: 'status', label: '状态', template: 'signStatus' },
          { prop: 'createTime', label: '报名时间' },
          { prop: 'shareMemberName', label: '分享者' },
          { prop: 'sharerName', label: '推广者' },
          { prop: 'firstCheckinTime', label: '签到', template: 'Boolean' },
          // { prop: 'firstCheckinTime', label: '签到', template: 'isshow' },
          { prop: 'firstCheckinTime', label: '签到时间' },
          { prop: 'isPay', money: 'payPoint', label: '支付方式', template: 'payment' },
          { prop: 'payAmount', pay: 'payPoint', label: '支付金额', template: 'payprice' },
          { prop: 'payPoint', pay: 'payPoint', label: '积分支付', template: 'payprice' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          sourceId: this.$route.query.id,
          param: '',
          status: 0
        },
        selectionList: []
      },
      checkData: {
        tableData: [],
        propData: [
          {
            prop: 'headImage',
            label: '头像',
            template: 'img',
            headImage: true
          },
          { prop: 'nickName', label: '昵称' },
          { prop: 'checkWay', label: '签到方式', template: 'checkWay' },
          { prop: 'isLate', label: '是否迟到', template: 'Boolean' },
          { prop: 'checkinTime', label: '签到时间' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          param: '',
          sourceId: this.$route.query.id
        }
      },
      commentData: {
        tableData: [],
        propData: [
          {
            prop: 'memberHeadImage',
            label: '头像',
            template: 'img',
            headImage: true
          },
          { prop: 'memberName', label: '姓名' },
          { prop: 'content', label: '评论内容' },
          { prop: 'createTime', label: '评论时间' },
          { prop: 'auditStatus', label: '审核状态', template: 'auditStatus' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          auditStatus: '',
          sourceId: this.$route.query.id
        },
        row: {}
      },
      dataLoading: false,
      isLoading: false,
      column: [
        { label: '日期', prop: 'createTime' },
        {
          label: '操作',
          align: 'right',
          formatter: row => {
            return (
              <el-button
                size="mini"
                type="primary"
                onClick={() => {
                  this.allDownloadData(row.id)
                }}
              >
                下载
              </el-button>
            )
          }
        }
      ]
    }
  },
  computed: {
    wxQrcodeFileName() {
      return function (startTime) {
        let _name = this.model.title || ''
        if (_name) {
          _name = _name.slice(0, 15)
        }
        if (startTime) _name += '... ' + startTime.slice(0, 16)
        return _name
      }
    }
  },
  created() {
    this.dataLoading = true
    this.getMobileUrl()
    this.getActivity(this.$route.query.id)
    this.activityComment()
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
    this.$refs.areaBox.onscroll = () => {
      if (this.$refs.areaBox.scrollTop > 90) {
        this.fixedTab = true
      } else {
        this.fixedTab = false
      }
    }
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 150
    },
    getMobileUrl() {
      this.$http.getMobileUrl().then(res => {
        console.log(res.data)
        this.baseHost = res.data.data.url
      })
    },
    // 切换tabbar
    handleSelect(index) {
      if (index === this.activeIndex) return
      this.activeIndex = index
      if (this.$refs.areaBox.scrollTop > 90) {
        this.$refs.areaBox.scrollTop = 90
      }
    },
    getActivity(id) {
      this.$http.getActivity({ id: id }).then(res => {
        this.model = res.data.data
        if (this.model.isOneSignMany) {
          this.signData.propData.push({ prop: 'oneSignManyNum', label: '报名数量' })
        }
        if (this.model.isEnableFee) {
          // if(this.model.activityFee.price>0){
          //   this.signData.propData.push({ prop: 'payAmount', label: '支付金额', template: 'price' })
          // }
          // if(this.model.activityFee.point>0){
          //   this.signData.propData.push({ prop: 'payPoint', label: '积分支付'})
          // }
        }
        this.dataLoading = false
        this.getIsHasActivitySignFile()
        this.signDataSetting()
      })
    },
    // 获取活动报名的字段
    signDataSetting() {
      let propData = []
      this.model.signDataSettingList.map(item => {
        let _data = {
          prop: item.id,
          label: item.name,
          id: item.id
        }
        if (item.type === 7) _data.template = 'file'
        propData.push(_data)
      })
      this.signData.propData.unshift(...propData)
      this.checkData.propData.splice(2, 0, ...propData)
      this.activitySign()
      this.listCheckin()
    },
    // 报名列表
    activitySign() {
      this.isLoading = true
      this.$http.activitySign(this.signData.page).then(res => {
        this.signData.tableData = res.data.data.list
        this.signData.page.total = res.data.data.total
        if (res.data.data.config.showChannel && !this.isChannel) {
          this.isChannel = true
          this.signData.propData.push({ label: '渠道商', template: 'channel' })
        }
        res.data.data.list.map((item, i) => {
          if (item.signDataList) {
            let model = {}
            item.signDataList.map((label, k) => {
              this.signData.propData.map(data => {
                if (data.id === label.settingId) {
                  model[data.id] = label.value
                }
              })
            })
            this.signData.tableData[i] = Object.assign(this.signData.tableData[i], model)
          }
        })
        this.isLoading = !true
      })
      console.log('signData', this.signData)
    },
    // 签到列表
    listCheckin(row) {
      if (row) {
        this.checkData.page.checkinStartTime = row.checkinStartTime
        this.checkData.page.checkinEndTime = row.checkinEndTime
      }
      this.isLoading = true
      this.$http.listCheckin(this.checkData.page).then(res => {
        this.checkData.tableData = res.data.data.list
        this.checkData.page.total = res.data.data.total
        res.data.data.list.map((item, i) => {
          if (item.signDataList) {
            let model = {}
            item.signDataList.map(label => {
              this.checkData.propData.map(data => {
                if (data.id === label.settingId) {
                  model[data.id] = label.value
                }
              })
            })
            this.checkData.tableData[i] = Object.assign(this.checkData.tableData[i], model)
          }
        })
        this.isLoading = !true
      })
    },
    // 评论列表
    activityComment() {
      this.isLoading = true
      this.$http.listComment(this.commentData.page).then(res => {
        this.commentData.tableData = res.data.data.list
        this.commentData.page.total = res.data.data.total
        this.isLoading = !true
      })
    },
    // 选中
    getSelection(index, val) {
      if (index == 1) {
        this.signData.selectionList = val
      }
    },
    // 翻页
    handleCurrentChange(index, val) {
      // 报名
      if (index == 1) {
        this.signData.page.pageNum = val
        this.activitySign()
      }
      if (index == 2) {
        // 签到
        console.log(index)
        this.checkData.page.pageNum = val
        this.listCheckin()
      }
      if (index == 3) {
        this.commentData.page.pageNum = val
        this.activityComment()
      }
    },
    // 显示个数
    handleSizeChange(index, val) {
      // 报名
      if (index == 1) {
        this.signData.page.pageSize = val
        this.activitySign()
      }
      // 签到
      if (index == 2) {
        this.checkData.page.pageSize = val
        this.listCheckin()
      }
      if (index == 3) {
        this.commentData.page.pageSize = val
        this.activityComment()
      }
    },
    // 搜索
    search() {
      if (this.activeIndex == 1) {
        if (!this.signData.search) return
        var n = Number(this.signData.search)
        console.log(!isNaN(n))
        console.log(this.signData.search)
      }
    },
    checkAuditSign(status) {
      let count = 0
      this.signData.selectionList.map(item => {
        if (item.status !== 1) {
          count++
        }
      })
      if (count !== 0) {
        this.$message.error('状态为待审核才可通过或拒绝审核，请重新选择')
      } else {
        this.auditSign(status)
      }
    },
    // 报名审核
    auditSign(status) {
      let params = []
      this.signData.selectionList.map(item => {
        params.push({
          status: status,
          id: item.id,
          isAudit: item.isAudit,
          memberId: item.memberId || ''
        })
      })
      this.$http.auditSign(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.activitySign()
      })
    },
    cancelConfirm(count) {
      let text = { 1: '是否取消报名？如果用户已支付，将会同时执行退款操作。', 2: '确认退款?' }[count]
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (count === 1) this.activitySignCancel()
          else this.activitySignRefund()
        })
        .catch(() => {
          return
        })
    },
    activitySignCancel() {
      if (this.signData.selectionList.length !== 1) {
        this.$message.error('只能选择一个，请重新选择')
        return false
      }
      if (this.signData.selectionList[0].status === 8) {
        this.$message.error('状态为已取消不可选择')
        return false
      }
      let params = {
        id: this.signData.selectionList[0].id
      }
      this.$http.activitySignCancel(params).then(() => {
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.activitySign()
      })
    },
    activitySignRefund() {
      if (this.signData.selectionList.length !== 1) {
        this.$message.error('只能选择一个，请重新选择')
        return false
      }
      console.log(this.signData.selectionList[0])
      if (this.signData.selectionList[0].status !== 8) {
        this.$message.error('只能选择状态为已取消')
        return false
      }
      let params = {
        id: this.signData.selectionList[0].id
      }
      this.$http.activitySignRefund(params).then(() => {
        this.$message({
          message: '退款成功',
          type: 'success'
        })
        this.activitySign()
      })
    },
    // 判断活动是否有报名附件
    async getIsHasActivitySignFile() {
      let res = await this.$http.getIsHasActivitySignFile({ sourceId: this.$route.query.id })
      this.isHasSignFile = res.data.data
    },
    // 下载指定报名附件
    async downloadSignFile() {
      let params = {
        sourceId: this.model.id || this.$router.query.id, // 活动did
        signIdArrayString: this.signData.selectionList.map(item => item.id).join(',') // 报名/签到 id
      }
      try {
        // loading
        this.downloadTaskBtnLoading = true
        await this.$http.downloadActivitySignFile(params) // 创建下载任务
        // 稍后改成分页的
        // let res = await this.$http.getDownloadTaskActivitySignFilePage({pageSize: 20}) // 查看下载任务列表
        this.downloadTaskBtnLoading = false
        this.isHasDownloadTaskSignFile = true
        this.downloadTaskDialog = true
        // hideLoading
      } catch (err) {
        // hideLoading
        console.log(err)
        this.downloadTaskBtnLoading = false
      }
    },
    activitySignExportData() {
      let params = {
        sourceId: this.$route.query.id,
        transferMember: true
        //   transferMember: this.base.transferMember ? true : false,
      }
      let url = `${this.baseUrl}/api/admin/v1/activitySign/exportData?sourceId=${params.sourceId}&transferMember=${params.transferMember}`
      window.open(url)
    },
    checkExportData() {
      let url = `${this.baseUrl}/api/admin/v1/checkin/exportCheckData?${qs.stringify(this.checkData.page)}`
      console.log(url)
      window.open(url)
    },
    allDownloadData(id = '') {
      this.$http
        .get(
          `${this.baseUrl}/api/admin/v1/activitySignFile/batchDownloadSignFile?activityId=${this.$route.query.id}&id=${id}`
        )
        .then(res => {
          window.open(this.imgHost + res.data.data.cosPath + '?t=' + Date.now())
        })
    },
    handleRowClick(row) {
      this.commentData.row = row
      console.log('row == ', this.commentData.row)
    },
    auditComment() {
      this.$http.auditComment({ id: this.commentData.row.id }).then(() => {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        this.activityComment()
      })
    },
    refuseComment() {
      this.$http.refuseComment({ id: this.commentData.row.id }).then(() => {
        this.$message({
          message: '拒绝成功',
          type: 'success'
        })
        this.activityComment()
      })
    },
    deleteComment() {
      this.$http.deleteComment({ id: this.commentData.row.id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.activityComment()
      })
    },
    deleteConfirm() {
      this.$confirm('是否删除该数据?删除后子评论将不会显示', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteComment()
        })
        .catch(() => {
          return
        })
    },
    payList() {
      this.$http.payList().then(res => {
        this.payLists = res.data.data
      })
    },
    offlinePay() {
      if (this.signData.selectionList.length !== 1) {
        this.$message.error('只能选择一个，请重新选择')
      } else {
        this.payModel.id = this.signData.selectionList[0].id
        this.payDialog = true
        this.payList()
      }
    },
    payCharge() {
      this.$http.payCharge(this.payModel).then(() => {
        this.onPayClose()
        this.activitySign()
      })
    },
    onPayClose() {
      this.payModel = {}
      this.payDialog = false
    },
    copy(shareLink) {
      let oInput = document.createElement('input')
      oInput.value = shareLink
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('copy')
      oInput.style.display = 'none'
      document.body.removeChild(oInput)
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.area-box {
  position: relative;
  min-width: 850px;
  .top {
    height: 90px;
    display: flex;
    align-items: center;
    width: 100%;
    .title {
      font-size: 22px;
      padding: 0 30px;
    }
    .desc {
      color: #686868;
      margin-top: 10px;
      padding-left: 30px;
      span {
        margin-right: 30px;
      }
    }
    .back_btn {
      margin-left: auto;
      margin-right: 20px;
    }
  }
  .fixed-tab {
    position: absolute;
    top: 172px;
    z-index: 1;
    right: 0;
    left: 0;
    z-index: 1;
    min-width: calc(850px - 17px);
  }
  .content {
    padding: 20px;
    .active-title {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      border: 1px solid #f3f3f3;
    }
    .time {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      font-size: 15px;
    }
    .padding {
      padding: 10px 0;
    }
    .search-box {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
    .select-btn {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .left {
        display: inline-flex;
        align-items: center;
        margin-bottom: 5px;
        margin-right: 15px;
        p {
          margin-right: 20px;
          span {
            color: rgb(66, 149, 251);
            padding: 0 5px;
          }
        }
      }
    }
    .detail {
      .item {
        margin-bottom: 20px;
        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          line-height: 1;
          position: relative;
          &:before {
            position: absolute;
            content: '';
            border-left: 3px solid #3091f2;
            left: 0;
            top: 0;
            bottom: 0;
          }
        }
        .context {
          p {
            line-height: 2;
            display: flex;
            span {
              margin-left: 10px;
              &:first-child {
                margin-left: 0;
                color: rgb(129, 129, 129);
                width: 90px;
                flex-shrink: 0;
                text-align: right;
              }
              img {
                width: 200px;
              }
            }
            .info {
              max-width: 630px;
            }
          }
        }
      }
      .content-box {
        .title {
          margin-left: 0;
          color: #818181;
          width: 90px;
          text-align: right;
          line-height: 2;
        }
        .detail-content {
          width: 700px;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #ececec;
          padding: 10px;
        }
      }
    }
  }
}
.check-time {
  padding: 10px 0 20px 0;
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
}
</style>
