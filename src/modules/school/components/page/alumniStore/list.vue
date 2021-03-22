<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input size="small" v-model="searchData.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input size="small" v-model="searchData.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input size="small" v-model="searchData.studentId" clearable></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-select size="small" v-model="searchData.classId" filterable>
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.className"
                :value="item.id"
                v-for="(item, index) in classList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="行业" >
            <el-select size="small" v-model="searchData.trade" filterable>
               <el-option label="全部" value=""></el-option>
               <el-option :label="item" :value="item" v-for="(item, index) in tradeList" :key="index"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="城市">
            <el-input size="small" v-model="searchData.city" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否加入">
            <el-select size="small" v-model="searchData.isBind">
              <el-option label="全部" value></el-option>
              <el-option label="已加入" :value="true"></el-option>
              <el-option label="未加入" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否冻结">
            <el-select size="small" v-model="searchData.isFrozen">
              <el-option label="全部" value></el-option>
              <el-option label="已冻结" :value="true"></el-option>
              <el-option label="未冻结" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select size="small" v-model="searchData.status">
              <el-option label="全部" value></el-option>
              <el-option label="通过" :value="2"></el-option>
              <el-option label="不通过" :value="-1"></el-option>
              <el-option label="待审核" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <!-- /area/listWithChild -->
      <button-wrap class="button-wrap">
        <el-button type="primary" size="mini" class="btn-wrap--btn" @click="add">添加</el-button>
        <el-button type="primary" size="mini" class="btn-wrap--btn" :disabled="tableList.id == null" @click="update"
          >修改</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-wrap--btn"
          :disabled="tableList.id == null"
          @click="openForm2"
          v-if="isFee"
          >开通年会费</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-wrap--btn"
          :disabled="tableList.id == null"
          @click="auditAlumni(tableList.id, 2)"
          >审核通过</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-wrap--btn"
          :disabled="tableList.id == null"
          @click="auditAlumni(tableList.id, -1)"
          >审核不通过</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-wrap--btn"
          :disabled="tableList.id == null"
          @click="isFrozenConfirm(true)"
          >冻结</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-wrap--btn"
          :disabled="tableList.id == null"
          @click="isFrozenConfirm(false)"
          >解冻</el-button
        >
        <!-- <el-button
          type="danger"
          size="mini"
          :disabled="tableList.id == null"
          @click="deleteConfirm()"
          >删除</el-button
        > -->
        <el-button type="info" size="mini" class="btn-wrap--btn" @click="apiExport">导出</el-button>
        <el-button type="info" size="mini" class="btn-wrap--btn" @click="download">下载模板</el-button>
        <up-load-file
          url="api/admin/v1/contacts/importData"
          size="mini"
          :err-tip="true"
          @file-error="fileErr"
          @file-success="search"
        ></up-load-file>
        <el-button class="refresh btn-wrap--btn" type="primary" size="mini" @click="search()">刷新</el-button>
        <el-button
          type="primary"
          class="btn-wrap--btn"
          size="mini"
          :disabled="tableList.id == null || tableList.memberId == null"
          @click="checkRealNameTip()"
          v-if="!isFee"
          >人工验证</el-button
        >
        <!-- 添加标签 -->
        <el-popover placement="bottom" width="300" v-if="false" v-model="personalityVisible">
          <p style="padding: 10px ;color: #888;font-size: 14px;">个性标签</p>
          <el-select
            v-model="personalityModel.templateId"
            placeholder="请选择"
            style="width: 220px;margin-bottom: 15px;"
          >
            <el-option
              size="small"
              v-for="option in personalityList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            ></el-option>
          </el-select>
          <div v-if="tableList.labels && tableList.labels.length > 0">
            <p style="padding: 10px ;color: #888;font-size: 14px;">用户已有标签</p>
            <el-tag
              v-for="item in tableList.labels"
              :key="item.id"
              closable
              @close="closeTag(item)"
              size="mini"
              style="margin-right: 5px;margin-bottom: 5px;"
              >{{ item.name }}</el-tag
            >
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click.stop="personalityVisible = false">取消</el-button>
            <el-button type="primary" size="mini" :loading="personalityLoading" @click.stop="setTag()">确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 10px;"
            :disabled="tableList.id == null"
            >添加标签</el-button
          >
        </el-popover>
        <!-- 会员类型 -->
        <el-popover placement="bottom" width="300" v-model="memberLevelVisible" v-if="false">
          <el-form v-if="memberLevelVisible" :model="memberLevelModel" ref="memberLevelModel" label-width="90px">
            <el-form-item
              label="等级/头衔"
              prop="memberLevelId"
              :rules="[{ required: true, message: '该字段不能为空' }]"
            >
              <el-select
                v-model="memberLevelModel.memberLevelId"
                placeholder="请选择"
                size="small"
                style="width: 180px;"
              >
                <el-option
                  size="small"
                  v-for="option in memberLevelList"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime" :rules="[{ required: true, message: '该字段不能为空' }]">
              <el-date-picker
                type="datetime"
                size="small"
                placeholder="请选择"
                v-model="memberLevelModel.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                :editable="false"
                style="width: 180px;"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click.stop="memberLevelVisible = false">取消</el-button>
            <el-button type="primary" size="mini" :loading="memberLevelLoading" @click.stop="setMemberLevel()"
              >确定</el-button
            >
          </div>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 10px;"
            :disabled="tableList.id == null || tableList.memberId == null"
            >设置会员类型</el-button
          >
        </el-popover>
        <!-- 线下收款 -->
        <el-popover placement="bottom" width="300" v-model="offlinePayVisible">
          <p style="font-size: 12px;color: #E6A23C;padding: 10px 0;">线下收款前，请确认已经设置过该会员的类型</p>
          <el-form v-if="offlinePayVisible" :model="offlinePayModel" ref="offlinePayModel" label-width="90px">
            <el-form-item label="支付方式" prop="payChannel" :rules="[{ required: true, message: '该字段不能为空' }]">
              <el-select v-model="offlinePayModel.payChannel" placeholder="请选择" size="small" style="width: 180px;">
                <el-option
                  size="small"
                  v-for="option in offlinePayWayList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click.stop="offlinePayVisible = false">取消</el-button>
            <el-button type="primary" size="mini" :loading="offlinePayLoading" @click.stop="chargeOffline()"
              >确定</el-button
            >
          </div>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 10px;"
            :disabled="tableList.id == null || tableList.memberId == null"
            >线下收款</el-button
          >
        </el-popover>
      </button-wrap>
    </div>
    <!-- <qc-table-old ref="table" :table-list="showData" :search="searchData" :isStripe="true" url="api/admin/v1/contacts/page"></qc-table-old> -->
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/contacts/page"></qc-table-old>
    <dig-form
      :visible="digFormWrap"
      :id="updateId"
      :tradeList="tradeList"
      :classList="classList"
      :member-level-list="memberLevelList"
      @close="digClose"
    ></dig-form>
    <dig-form2 :visible="digFormWrap2" :id="updateId" @closeForm2="digClose2"></dig-form2>
    <file-form :visible="digFileForm" :err-msg-map="errMsgMap" @close="fileErrClose"></file-form>
  </div>
</template>

<script>
import { tableMixin } from 'jsSchool/tableMixin'
import ButtonWrap from '../../common/ButtonWrap'
import SearchWrap from '../../common/SearchWrap'
import UpLoadFile from '../../common/UpLoadFile'
import DigForm from './form'
import DigForm2 from './form2'
import FileForm from './fileForm'
import api from 'apiSchool/common'
import qs from 'qs'
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm, DigForm2, UpLoadFile, FileForm },
  data() {
    return {
      updateId: '',
      studentId: '',
      digFormWrap: false,
      digFormWrap2: false,
      digFileForm: false,
      // 打标签相关
      personalityVisible: false,
      personalityLoading: false,
      personalityList: [],
      personalityModel: {
        templateId: '',
        memberId: ''
      },
      // 设置会员类型相关
      memberLevelVisible: false,
      memberLevelLoading: false,
      memberLevelList: [],
      memberLevelModel: {
        memberLevelId: '',
        endTime: '',
        memberId: ''
      },
      // 线下收款相关
      offlinePayVisible: false,
      offlinePayLoading: false,
      offlinePayWayList: [
        { value: 'wechat', label: '微信' },
        { value: 'public', label: '对公打款' },
        { value: 'bill', label: '记账' },
        { value: 'cash', label: '现金' },
        { value: 'bank_card', label: '银行卡' }
      ],
      offlinePayModel: {
        payChannel: '',
        memberId: ''
      },
      searchData: {
        name: '',
        phone: '',
        studentId: '',
        classId: '',
        city: '',
        isFrozen: '',
        isBind: '',
        status: ''
      },
      showData: [
        { prop: 'updateTime', label: '更新时间' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'labels', label: '个性标签', template: 'tagArray' },
        { prop: 'status', label: '审核状态', template: 'auditRegisterStatus' },
        { prop: 'isBind', label: '是否加入', template: 'Boolean' },
        { prop: 'isFrozen', label: '是否冻结', template: 'Boolean' }
      ],
      tradeList: [],
      classList: [],
      memberLabels: [],
      tagList: [],
      isFee: false,
      errMsgMap: {}
    }
  },
  watch: {
    // personalityVisible(val) {
    // if (val && this.tableList && this.tableList.memberId) {
    //   this.getMmberLabel()
    // }
    // }
  },
  created() {
    this.contactsSettingGet()
    this.getClassList()
    this.getTrade()
    this.pageMemberLevel()
    // this.getPersonalityLabel()
    // this.getCowebCheck()
    this.isFee = false
  },
  methods: {
    contactsSettingGet() {
      api.contactsSettingGet().then(res => {
        let list = []
        let notAdd = true
        res.data.data.map(item => {
          if (
            item.isNeed &&
            item.fieldId !== 'year' &&
            item.fieldId !== 'degreeName' &&
            item.fieldId !== 'departmentName'
          ) {
            list.push({ prop: item.fieldId, label: item.showName })
          } else if (notAdd && item.isNeed && (item.fieldId === 'year' || item.fieldId === 'departmentName')) {
            list.push({ prop: 'className', label: '班级' })
            notAdd = false
          }
        })
        this.showData.unshift(...list)
      })
    },
    getCowebCheck() {
      this.$http.get(`api/admin/v1/config/${this.type}`).then(res => {
        if (res.data.data.value == 1) {
          this.showData.push({ prop: 'status', label: '审核状态', template: 'auditRegisterStatus' })
        }
      })
    },
    search() {
      this.searchKeep()
      this.getClassList()
      // this.getPersonalityLabel()
      this.pageMemberLevel()
    },
    cityChange(val) {
      this.searchData.areaId = val[1]
    },
    //添加
    add() {
      this.updateId = ''
      this.digFormWrap = true
    },
    //删除提示框
    deleteConfirm() {
      let text = '是否删除该校友？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete()
        })
        .catch(() => {
          return
        })
    },
    getClassList() {
      api.getClassList().then(res => {
        this.classList = res.data.data.list
      })
    },
    getTrade() {
      api.getConfigTrade().then(res => {
        try {
          let list = res.data.data.value.split('_')
          this.tradeList = list
        } catch (error) {}
      })
    },
    // 获取用户已有标签
    getMmberLabel() {
      this.$http
        .pageMemberPersonalityLabel({
          memberId: this.tableList.memberId
        })
        .then(res => {
          this.memberLabels = res.data.data.list
        })
    },
    // 获取个性标签
    getPersonalityLabel() {
      this.$http.pagePersonalityLabel({ pageNum: 1, pageSize: 999 }).then(res => {
        this.personalityList = res.data.data.list
      })
    },
    //获取全部等级、头衔
    async pageMemberLevel(id) {
      try {
        let res = await this.$http.pageMemberLevel({ pageNum: 1, pageSize: 999 })
        this.memberLevelList = res.data.data.list || []
      } catch (err) {
        console.log(err)
      }
    },
    // 是否冻结提示框
    isFrozenConfirm(state) {
      let text = '是否变更该校友冻结状态？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isFrozen(state)
        })
        .catch(() => {
          return
        })
    },
    // 是否冻结
    isFrozen(state) {
      api.isFrozen({ id: this.tableList.id, isFrozen: state }).then(res => {
        this.searchKeep()
        this.$message({
          message: '变更成功',
          type: 'success'
        })
      })
    },
    // 删除
    delete() {
      api.deleteAlumni({ id: this.tableList.id }).then(res => {
        this.searchKeep()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    auditAlumni(id, status) {
      api.auditAlumni({ id, status }).then(res => {
        this.searchKeep()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    //修改
    update() {
      this.updateId = this.tableList.id
      this.digFormWrap = true
    },
    digClose(flag) {
      this.updateId = ''
      this.digFormWrap = false
      if (typeof flag == 'boolean' && flag) {
        this.searchKeep()
      }
    },
    openForm2() {
      this.digFormWrap2 = true
      this.updateId = this.tableList.id
    },
    digClose2(flag) {
      this.updateId = ''
      this.digFormWrap2 = false
      if (typeof flag == 'boolean' && flag) {
        this.searchKeep()
      }
    },
    // 导出
    apiExport() {
      location.href = `${this.baseUrl}/api/admin/v1/contacts/exportData?${qs.stringify(this.searchData)}`
    },
    fileErr(data) {
      console.log(data)
      this.errMsgMap = data.errMsgMap
      this.digFileForm = true
    },
    fileErrClose() {
      this.digFileForm = false
      this.errMsgMap = {}
    },
    checkRealNameTip() {
      this.$confirm(`${this.tableList.name}是否通过实名验证?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.checkRealName()
        })
        .catch(() => {})
    },
    // 人工认证实名
    checkRealName() {
      api.checkRealName({ memberId: this.tableList.memberId }).then(res => {
        this.$message.success('操作成功')
        this.searchKeep()
      })
    },
    // 设置会员类型
    setMemberLevel() {
      this.$refs.memberLevelModel.validate(valid => {
        if (valid) {
          this.memberLevelModel.memberId = this.tableList.memberId
          this.memberLevelLoading = true
          this.$http
            .setMemberLevel(this.memberLevelModel)
            .then(res => {
              this.memberLevelLoading = false
              this.$message.success('设置成功')
              this.memberLevelVisible = false
            })
            .catch(() => {
              this.memberLevelLoading = false
            })
        }
      })
    },
    // 会员会费线下收款
    chargeOffline() {
      this.$refs.offlinePayModel.validate(valid => {
        if (valid) {
          this.offlinePayModel.memberId = this.tableList.memberId
          this.offlinePayLoading = true
          this.$http
            .memberFeesOrderChargeOffline(this.offlinePayModel)
            .then(res => {
              this.offlinePayLoading = false
              this.$message.success('设置成功')
              this.offlinePayVisible = false
            })
            .catch(() => {
              this.offlinePayLoading = false
            })
        }
      })
    },
    // 删除标签
    async closeTag(tag) {
      let index = this.tableList.labels.findIndex(item => item.id === tag.id)
      if (this.tableList.memberId) {
        await this.$http.delMemberPersonalityLabel({ id: tag.id })
        this.tableList.labels.splice(index, 1)
      } else {
        await this.$http.deleteTagName({ tagName: tag.name, id: this.tableList.id })
        this.tableList.labels.splice(index, 1)
      }
    },
    // 打标签
    setTag() {
      if (!this.personalityModel.templateId) {
        this.$message.warning('请选择标签')
        return
      }
      if (!this.tableList.memberId) {
        this.personalityLoading = true
        let list = this.personalityList
        let tagItem = list[list.findIndex(item => item.id === this.personalityModel.templateId)]
        this.$http
          .updateTagName({
            id: this.tableList.id,
            tagName: tagItem.name || ''
          })
          .then(res => {
            this.personalityLoading = false
            this.personalityVisible = false
            this.$message.success('添加标签成功')
            this.searchKeep()
          })
          .catch(() => {
            this.personalityLoading = false
          })
        return
      }
      this.personalityModel.memberId = this.tableList.memberId
      this.personalityLoading = true
      this.$http
        .addMemberPersonalityLabel(this.personalityModel)
        .then(res => {
          this.personalityLoading = false
          this.personalityVisible = false
          this.$message.success('添加标签成功')
          this.searchKeep()
        })
        .catch(() => {
          this.personalityLoading = false
        })
    },
    // onPersonalityVisible(state) {
    //   this.personalityVisible = state
    //   if (!state) this.personalityModel = {
    //     templateId: '',
    //     memberId: '',
    //   }
    // },
    download() {
      location.href = `${this.baseUrl}/api/admin/v2/contacts/template`
    }
  }
}
</script>
<style lang="scss" scoped>
.button-wrap {
  position: relative;
  .refresh {
    position: absolute;
    top: 10px;
    right: 15px;
  }
  .btn-wrap--btn {
    margin-bottom: 10px;
  }
}
</style>
