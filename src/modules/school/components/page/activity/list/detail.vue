<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div ref="header" style="min-width: 850px;">
      <qc-header title="报名详情"></qc-header>
    </div>
    <div class="area-box" ref="areaBox" :style="{ height: `${areaHeight}px`, 'overflow-y': 'auto' }">
      <div class="top">
        <p class="title">{{ model.title }}</p>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="activeIndex"
        @select="handleSelect"
        :class="{ 'fixed-tab': fixedTab }"
      >
        <el-menu-item v-for="(item, i) in sidebarList" :key="i" :index="item.index">{{ item.title }}</el-menu-item>
      </el-menu>
      <div v-if="fixedTab" style="height: 61px;"></div>
      <div class="content">
        <div v-show="activeIndex === '1'">
          <div class="active-title">报名列表</div>
          <div class="search-box padding">
            <el-form :inline="true" size="small">
              <el-form-item label="手机号或姓名">
                <el-input placeholder="请输入手机号或姓名" v-model="signData.page.param"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="activitySign()">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="padding">
            <el-radio-group v-model="signData.page.status" size="small" @change="activitySign">
              <el-radio-button :label="item.index" v-for="(item, i) in radioType" :key="i">{{
                item.name
              }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="select-btn padding">
            <div class="left">
              <p>
                已选择 <span>{{ signData.selectionList.length || 0 }}</span
                >个报名用户
              </p>
              <el-button
                size="small"
                style="width: 80px;"
                @click="checkAuditSign(2)"
                :disabled="signData.selectionList.length === 0"
                >通过</el-button
              >
              <el-button
                size="small"
                style="width: 80px;"
                @click="checkAuditSign(3)"
                :disabled="signData.selectionList.length === 0"
                >拒绝</el-button
              >
              <el-button
                size="small"
                style="width: 110px;"
                @click="cancelConfirm(1)"
                :disabled="signData.selectionList.length === 0"
                >取消报名(单选)</el-button
              >
              <el-button
                size="small"
                style="width: 110px;"
                @click="cancelConfirm(2)"
                :disabled="signData.selectionList.length === 0"
                >退款(单选)</el-button
              >
            </div>
            <div class="right">
              <upload-file
                :id="$route.query.id"
                :data="{ sourceId: $route.query.id }"
                title="导入Excel"
                :file-type="[]"
                url="api/admin/v1/activitySign/importData"
                @file-success="activitySign"
              ></upload-file>
              <el-button
                size="mini"
                style="width: 80px;"
                @click="activitySignExportData()"
                :disabled="this.signData.tableData.length === 0"
                >导出Excel</el-button
              >
              <!-- <el-button size="small" style="width: 80px;">群发信息</el-button> -->
            </div>
          </div>
          <table-box
            :tableData="signData.tableData"
            :propData="signData.propData"
            :page="signData.page"
            :activeIndex="activeIndex"
            @get-selection="getSelection"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></table-box>
        </div>
        <div v-show="activeIndex === '2'">
          <div class="active-title" v-if="model.activityCheckinSetting">签到时间</div>
          <div class="check-time" v-if="model.activityCheckinSetting">
            <table cellpadding="0" cellspacing="0" class="act-table">
              <tbody>
                <tr>
                  <th style="width: 220px;">签到开始时间</th>
                  <th style="width: 220px;">签到结束时间</th>
                  <th style="width: 220px;">签到迟到时间</th>
                  <th style="width: 80px;">签到二维码</th>
                  <th style="width: 80px;" v-if="model.activityCheckinSetting.isEnableMobileCheckin">手机二维码</th>
                  <th style="width: 80px;" v-if="model.activityCheckinSetting.checkinCode">暗号二维码</th>
                  <th style="width: 80px;" v-if="model.activityCheckinSetting.isEnableAirborne">空降嘉宾</th>
                </tr>
                <tr v-for="(item, i) in model.activityCheckinSetting.checkinTimeList" :key="i">
                  <td>
                    <span>{{ item.checkinStartTime }}</span>
                  </td>
                  <td>
                    <span>{{ item.checkinEndTime }}</span>
                  </td>
                  <td>
                    <span>{{ item.checkinLateTime }}</span>
                  </td>
                  <td>
                    <el-popover placement="right" width="300" trigger="click">
                      <img :src="imgHost + item.checkinQrcodeUrl" alt="" style="width: 100%;" />
                      <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                    </el-popover>
                  </td>
                  <td v-if="model.activityCheckinSetting.isEnableMobileCheckin">
                    <el-popover placement="right" width="300" trigger="click">
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                            item.checkinSettingId
                          }&checkWay=1`
                        "
                        v-if="item.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                              item.checkinSettingId
                            }&checkWay=1`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                                item.checkinSettingId
                              }&checkWay=1`
                            )
                          "
                          >复制</el-button
                        >
                      </div>
                      <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                    </el-popover>
                  </td>
                  <td v-if="model.activityCheckinSetting.checkinCode">
                    <el-popover placement="right" width="300" trigger="click">
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                            item.checkinSettingId
                          }&checkWay=2`
                        "
                        v-if="item.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                              item.checkinSettingId
                            }&checkWay=2`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${
                                item.checkinSettingId
                              }&checkWay=2`
                            )
                          "
                          >复制</el-button
                        >
                      </div>
                      <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                    </el-popover>
                  </td>
                  <td v-if="model.activityCheckinSetting.isEnableAirborne">
                    <el-popover placement="right" width="300" trigger="click">
                      <qrcode
                        :value="
                          `${baseHost}/mobile/POUND/activity/submit?wo=1&wot=2&woacm=1&mpl=1&id=${
                            $route.query.id
                          }&checkinSettingId=${item.checkinSettingId}`
                        "
                        v-if="item.checkinSettingId"
                        tag="img"
                        :options="options"
                      ></qrcode>
                      <div style="display: flex;">
                        <el-input
                          size="small"
                          :value="
                            `${baseHost}/mobile/POUND/activity/submit?wo=1&wot=2&woacm=1&mpl=1&id=${
                              $route.query.id
                            }&checkinSettingId=${item.checkinSettingId}`
                          "
                        ></el-input>
                        <el-button
                          size="mini"
                          type="primary"
                          style="margin: 0 15px;"
                          @click="
                            copy(
                              `${baseHost}/mobile/POUND/activity/submit?wo=1&wot=2&woacm=1&mpl=1&id=${
                                $route.query.id
                              }&checkinSettingId=${item.checkinSettingId}`
                            )
                          "
                          >复制</el-button
                        >
                      </div>
                      <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                    </el-popover>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="active-title">签到列表</div>
          <div class="select-btn padding">
            <div class="left">
              <el-form :inline="true">
                <el-form-item>
                  <el-input placeholder="请输入手机号或姓名" v-model="checkData.page.param" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="listCheckin()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- <div class="right">
              <el-button size="small" style="width: 80px;">导入Excel</el-button>
              <el-button size="small" style="width: 80px;">导出Excel</el-button>
            </div>-->
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
          ></table-box>
        </div>
        <div v-show="activeIndex === '3'">
          <div class="active-title">评伦列表</div>
          <div class="padding">
            <el-radio-group v-model="commentData.page.auditStatus" size="small" @change="activityComment">
              <el-radio-button :label="item.index" v-for="(item, i) in evaluateType" :key="i">{{
                item.name
              }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="padding">
            <el-button
              size="small"
              style="width: 80px;"
              type="primary"
              @click="auditComment()"
              :disabled="commentData.row.id == null"
              >审核</el-button
            >
            <el-button
              size="small"
              style="width: 80px;"
              type="primary"
              @click="refuseComment()"
              :disabled="commentData.row.id == null"
              >拒绝</el-button
            >
            <el-button
              size="small"
              style="width: 80px;"
              type="danger"
              @click="deleteConfirm()"
              :disabled="commentData.row.id == null"
              >删除</el-button
            >
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
          ></table-box>
        </div>
        <div v-show="activeIndex === '4'">
          <div class="time">数据统计时间为：活动发布时间(2018-02-12 17:00) —— 当前时间(2018-05-18 14:46)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QcHeader from 'commonSchool/QcHeader'
import api from 'apiSchool/common'
import tableBox from './table'
import Qrcode from '@xkeshi/vue-qrcode'
import uploadFile from 'commonSchool/UpLoadFile'

export default {
  components: {
    QcHeader,
    tableBox,
    Qrcode,
    uploadFile
  },
  data() {
    return {
      baseHost: '',
      fixedTab: false,
      options: {
        size: 300
      },
      sidebarList: [
        { index: '1', title: '报名管理' }
        // { index: '2', title: '签到管理' },
        // { index: '3', title: '评论管理' },
      ],
      activeIndex: '1',
      model: {
        activitySignSetting: {},
        activityTagList: {},
        activityFee: {}
      },
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
      checkType: [{ index: 1, name: '全部' }, { index: 2, name: '已签到' }, { index: 3, name: '未签到' }],
      evaluateType: [
        { index: '', name: '全部' },
        { index: 1, name: '未审核' },
        { index: 2, name: '已审核' },
        { index: 3, name: '已拒绝' }
      ],
      signData: {
        radio: 0,
        tableData: [],
        propData: [
          { prop: 'status', label: '状态', template: 'signStatus' },
          // { prop: 'firstCheckinTime', label: '签到', template: 'Boolean' },
          { prop: 'createTime', label: '报名时间' }
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
          { prop: 'headImage', label: '头像', template: 'img', headImage: true },
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
      dataLoading: false
    }
  },
  created() {
    this.dataLoading = true
    // this.getMobileUrl();
    this.getActivity(this.$route.query.id)
    // this.activityComment();
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
    this.$refs.areaBox.onscroll = () => {
      if (this.$refs.areaBox.scrollTop >= 90) {
        this.fixedTab = true
      } else {
        this.fixedTab = false
      }
    }
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 170
    },
    getMobileUrl() {
      api.getMobileUrl().then(res => {
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
      api.getActivity({ id: id }).then(res => {
        this.model = res.data.data
        console.log('detail', this.model)
        this.dataLoading = false
        this.signDataSetting()
      })
    },
    // 获取活动报名的字段
    signDataSetting() {
      let propData = []
      this.model.signDataSettingList.map((item, i) => {
        propData.push({
          prop: item.id,
          label: item.name,
          id: item.id
        })
      })
      this.signData.propData.unshift(...propData)
      this.checkData.propData.splice(2, 0, ...propData)
      this.activitySign()
      this.listCheckin()
    },
    // 报名列表
    activitySign() {
      return
      api.activitySign(this.signData.page).then(res => {
        this.signData.tableData = res.data.data.list
        this.signData.page.total = res.data.data.total
        res.data.data.list.map((item, i) => {
          if (item.signDataList) {
            let model = {}
            item.signDataList.map((label, k) => {
              this.signData.propData.map((data, v) => {
                if (data.id === label.settingId) {
                  model[data.id] = label.value
                }
              })
            })
            this.signData.tableData[i] = Object.assign(this.signData.tableData[i], model)
          }
        })
      })
    },
    // 签到列表
    listCheckin() {
      api.listCheckin(this.checkData.page).then(res => {
        this.checkData.tableData = res.data.data.list
        this.checkData.page.total = res.data.data.total
        res.data.data.list.map((item, i) => {
          if (item.signDataList) {
            let model = {}
            item.signDataList.map((label, k) => {
              this.checkData.propData.map((data, v) => {
                if (data.id === label.settingId) {
                  model[data.id] = label.value
                }
              })
            })
            this.checkData.tableData[i] = Object.assign(this.checkData.tableData[i], model)
          }
        })
      })
    },
    // 评论列表
    activityComment() {
      api.listComment(this.commentData.page).then(res => {
        this.commentData.tableData = res.data.data.list
        this.commentData.page.total = res.data.data.total
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
      } else if (index == 2) {
        // 签到
        console.log(index)
        this.checkData.page.pageNum = val
        this.pageCategory()
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
        this.pageCategory()
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
          memberId: item.memberId || '',
          entryType: item.entryType || ''
        })
      })
      console.log(params)
      // return
      api.auditSign(params).then(res => {
        this.$message({
          message: status === 2 ? '审核通过' : '审核不通过',
          type: 'success'
        })
        this.activitySign()
      })
    },
    cancelConfirm(count) {
      let text = count === 1 ? '是否取消报名？如果用户已支付，将会同时执行退款操作。' : 2 ? '确认退款?' : ''
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
      api.activitySignCancel(params).then(res => {
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
      api.activitySignRefund(params).then(res => {
        this.$message({
          message: '退款成功',
          type: 'success'
        })
        this.activitySign()
      })
    },
    activitySignExportData() {
      let params = {
        sourceId: this.$route.query.id,
        status: this.signData.page.status,
        param: this.signData.page.param,
        transferMember: this.base.transferMember ? true : false
      }
      let url = `${this.localhost}/api/admin/v1/activitySign/exportData?sourceId=${params.sourceId}&status=${
        params.status
      }&param=${params.param}&transferMember=${params.transferMember}`
      window.open(url)
    },
    handleRowClick(row) {
      this.commentData.row = row
      console.log('row == ', this.commentData.row)
    },
    auditComment() {
      api.auditComment({ id: this.commentData.row.id }).then(res => {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        this.activityComment()
      })
    },
    refuseComment() {
      api.refuseComment({ id: this.commentData.row.id }).then(res => {
        this.$message({
          message: '拒绝成功',
          type: 'success'
        })
        this.activityComment()
      })
    },
    deleteComment() {
      api.deleteComment({ id: this.commentData.row.id }).then(res => {
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
  }
  .fixed-tab {
    position: absolute;
    top: 70px;
    z-index: 1;
    right: 37px;
    left: 238px;
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
      .left {
        display: inline-flex;
        align-items: center;
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
