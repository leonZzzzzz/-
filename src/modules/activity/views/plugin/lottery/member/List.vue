<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button
          v-if="$route.query.showType == 1"
          type="primary"
          size="mini"
          @click="openForm()"
          :disabled="selectionList.length === 0"
          >指定中奖</el-button
        >
        <el-button
          v-if="$route.query.showType == 1"
          type="primary"
          size="mini"
          @click="deleteConfirm()"
          :disabled="selectionList.length === 0"
          >取消指定中奖</el-button
        >
        <up-load-file
          v-if="$route.query.sourceType == 3"
          :id="$route.query.id"
          :data="{ id: $route.query.id }"
          title="导入"
          url="api/admin/v1/lottery/import"
          @file-success="fileSuccess"
        ></up-load-file>
        <el-button type="primary" size="mini" @click="back">返回</el-button>
      </button-wrap>
    </div>
    <table-box
      :tableData="signData.tableData"
      :propData="signData.propData"
      :page="signData.page"
      @get-selection="getSelection"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :loading="loading"
      v-if="sourceType === 1"
    ></table-box>
    <table-box
      :tableData="checkData.tableData"
      :propData="checkData.propData"
      :page="checkData.page"
      @get-selection="getSelection"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :loading="loading"
      v-if="sourceType === 2"
    ></table-box>
    <table-box
      :tableData="numberData.tableData"
      :propData="numberData.propData"
      :page="numberData.page"
      @get-selection="getSelection"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :loading="loading"
      v-if="sourceType === 3"
    ></table-box>
    <dig-form
      :visible="digFormWrap"
      :itemList="detail.itemList"
      :selectionList="selectionList"
      @close="digClose"
    ></dig-form>

    <login-dialog :visible="digLogin" @close="closeLogin"></login-dialog>
  </div>
</template>

<script>
import loginMixin from '@/mixins/loginMixin'
import tableBox from './Table'
import DigForm from './Form'

export default {
  mixins: [loginMixin],
  components: { tableBox, DigForm },
  data() {
    return {
      updateId: '',
      digFormWrap: false,
      searchData: {
        nickName: '',
        memberNo: '',
        id: this.$route.query.id
      },
      signData: {
        tableData: [],
        propData: [
          { prop: 'status', label: '状态', template: 'signStatus' },
          { prop: 'lotteryItemTitle', label: '指定奖项' },
          { prop: 'createTime', label: '报名时间' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          sourceId: this.$route.query.sourceId,
          param: '',
          status: 0
        }
      },
      checkData: {
        tableData: [],
        propData: [
          { prop: 'headImage', label: '头像', template: 'img', headImage: true },
          { prop: 'nickName', label: '昵称' },
          { prop: 'checkWay', label: '签到方式', template: 'checkWay' },
          { prop: 'lotteryItemTitle', label: '指定奖项' },
          { prop: 'checkinTime', label: '签到时间' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          param: '',
          sourceId: this.$route.query.sourceId
        }
      },
      numberData: {
        tableData: [],
        propData: [
          { prop: 'memberNo', label: '编号' },
          { prop: 'nickName', label: '名称' },
          { prop: 'lotteryItemTitle', label: '指定奖项' },
          { prop: 'createTime', label: '导入时间' }
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          param: '',
          id: this.$route.query.id
        }
      },
      model: {},
      detail: {},
      selectionList: [],
      sourceType: Number(this.$route.query.sourceType),
      designateList: [],
      loading: true
    }
  },
  created() {
    this.updateId = this.$route.query.id
    this.lotteryDetail(this.$route.query.id)
    this.getDesignateList()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    add() {
      this.digTransfer = true
    },
    // 获取抽奖详情
    async lotteryDetail(id) {
      let res = await this.$http.getLottery({ id })
      this.detail = res.data.data
    },
    // 获取指定中奖列表
    async getDesignateList(val) {
      let res = await this.$http.designateList({ lotteryId: this.$route.query.id })
      console.log('getDesignateList', res.data)
      this.designateList = res.data.data
      if (val) {
        if (this.sourceType == 1) {
          this.activitySign()
        } else if (this.sourceType == 2) {
          this.listCheckin()
        } else {
          this.pageLotteryMember()
        }
      } else {
        if (this.sourceType < 3) {
          this.getActivity(this.$route.query.sourceId)
        } else {
          this.pageLotteryMember()
        }
      }
    },
    // 获取活动详情
    async getActivity(id) {
      let res = await this.$http.getActivity({ id })
      this.model = res.data.data
      this.signDataSetting()
    },
    // 获取活动报名的字段
    signDataSetting() {
      let propData = []
      this.model.signDataSettingList.map((item) => {
        propData.push({
          prop: item.id,
          label: item.name,
          id: item.id
        })
      })
      this.signData.propData.unshift(...propData)
      this.checkData.propData.splice(2, 0, ...propData)
      if (this.sourceType === 1) this.activitySign()
      else this.listCheckin()
    },
    // 报名列表
    async activitySign() {
      let res = await this.$http.activitySign(this.signData.page)
      this.signData.tableData = res.data.data.list
      this.signData.page.total = res.data.data.total
      res.data.data.list.map((item, i) => {
        if (this.designateList.length > 0) {
          this.designateList.map((label) => {
            if (item.id === label.id) item.lotteryItemTitle = label.title
          })
        }
        if (item.signDataList) {
          let model = {}
          item.signDataList.map((label) => {
            this.signData.propData.map((data) => {
              if (data.id === label.settingId) {
                model[data.id] = label.value
              }
            })
          })
          this.signData.tableData[i] = Object.assign(this.signData.tableData[i], model)
        }
      })
      this.loading = false
    },
    // 签到列表
    async listCheckin() {
      let res = await this.$http.listCheckin(this.checkData.page)
      this.checkData.tableData = res.data.data.list
      this.checkData.page.total = res.data.data.total
      res.data.data.list.map((item, i) => {
        if (this.designateList.length > 0) {
          this.designateList.map((label) => {
            if (item.id === label.id) item.lotteryItemTitle = label.title
          })
        }
        if (item.signDataList) {
          let model = {}
          item.signDataList.map((label) => {
            this.checkData.propData.map((data) => {
              if (data.id === label.settingId) {
                model[data.id] = label.value
              }
            })
          })
          this.checkData.tableData[i] = Object.assign(this.checkData.tableData[i], model)
        }
      })
      this.loading = false
    },
    // 导入编号
    async pageLotteryMember() {
      let res = await this.$http.pageLotteryMember(this.numberData.page)
      this.numberData.page.total = res.data.data.total
      res.data.data.list.map((item) => {
        if (this.designateList.length > 0) {
          this.designateList.map((label) => {
            if (item.id === label.id) item.lotteryItemTitle = label.title
          })
        }
      })
      this.numberData.tableData = res.data.data.list
      this.loading = false
    },
    // 选中
    getSelection(val) {
      this.selectionList = val
    },
    // 翻页
    handleCurrentChange(val) {
      if (this.sourceType == 1) {
        this.signData.page.pageNum = val
        this.activitySign()
      } else if (this.sourceType == 2) {
        this.checkData.page.pageNum = val
        this.listCheckin()
      } else {
        this.numberData.page.pageNum = val
        this.pageLotteryMember()
      }
    },
    // 显示个数
    handleSizeChange(val) {
      if (this.sourceType == 1) {
        this.signData.page.pageSize = val
        this.activitySign()
      } else if (this.sourceType == 2) {
        this.checkData.page.pageSize = val
        this.listCheckin()
      } else {
        this.numberData.page.pageSize = val
        this.pageLotteryMember()
      }
    },
    //删除提示框
    deleteConfirm() {
      this.$confirm('是否删除该指定奖项?', '提示', {
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
    async delete() {
      let model = {
        lotteryId: this.$route.query.id,
        lotteryItemId: '',
        idList: this.selectionList.map((item) => item.id)
      }
      await this.$http.lotteryDesignate(model)
      this.$message.success('取消成功')
      this.getDesignateList('new')
    },
    fileSuccess() {
      this.pageLotteryMember()
    },
    // 导出
    apiExport() {
      location.href = `${this.localhost}/api/admin/v1/memberClasses/export?classesId=${this.$route.query.id}`
    },
    openForm() {
      if (this.selectionList.length === 0) {
        this.$message({
          message: '请先勾选中奖人',
          type: 'warning'
        })
        return
      }
      this.digFormWrap = true
    },
    digClose(flag, val) {
      this.digFormWrap = false
      if (val) this.getDesignateList(val)
    }
  }
}
</script>
<style lan="sass" scoped>
.back {
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>
