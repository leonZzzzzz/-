<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="500px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="model" ref="model" label-width="120px" label-position="left">
      <el-form-item
        label="关联"
        prop="memberLevelId"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-tag v-if="memberLevelData.name">{{ memberLevelData.name }}</el-tag> 
        <el-button @click="openDialogTable(1)" size="mini" style="margin-left: 10px;">{{memberLevelData.name ? '+ 重新选择' : '+ 选择等级/头衔'}}</el-button>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="费用"
        prop="amount"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.amount">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <!-- <el-radio v-model="model.type" label="level">等级</el-radio>
        <el-radio v-model="model.type" label="actor">头衔</el-radio> -->
        <el-radio-group v-model="model.type">
          <el-radio label="calendarYear">自然年</el-radio>
          <!-- (同一年度的1月1日到这一年度的12月31日的这段时间) -->
          <el-radio label="postponeYear">顺延年</el-radio>
          <!-- (下一年度的当天00:00的这段时间) -->
          <el-radio label="day">指定天数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="model.type == 'postponeYear' || model.type == 'day'"
        label="时长"
        prop="length"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input v-model="model.length">
          <template v-if="model.type == 'postponeYear'" slot="append">年</template>
          <template v-if="model.type == 'day'" slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否允许续费">
        <el-switch
          v-model="model.isAllowUnexpiredRenewal"
          active-color="#13ce66"
          inactive-color="#ccc"
          :active-value="true"
          :inactive-value="false">
        </el-switch>
      </el-form-item>
      <!-- <el-form-item
        v-if="false"
        label="购买范围"
        prop="shopScope"
        :rules="[{ required: true, message: '该字段不能为空' }]">
        <el-radio-group v-model="model.shopScope">
          <el-radio label="all">所有人</el-radio>
          <el-radio label="renew">续费</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item
        v-if="model.shopScope == 'renew'"
        label="续费"
        prop="sourceIds"
        :rules="[{ required: true, message: '该字段不能为空' }]">
        <div style="width: 340px;max-height: 320px;overflow-y: auto;">
          <el-tag v-for="tag in sourceList" :key="tag.id" closable @close="onCloseSupplier(tag)" style="margin-right: 5px;">
            {{tag.name}}
          </el-tag>
          <el-button @click="openDialogTable(2)" size="small">{{ sourceList.length > 0 ? '重新选择' : '+ 选择等级/头衔' }}</el-button>
        </div>
      </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <el-dialog title="选择等级/头衔" width="800px" 
      :visible.sync="dialogTable" 
      @close="closeDialogTable" 
      :append-to-body="true" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <div style="border: 1px solid #ebeef5;">
        <QcTable v-if="dialogTable" 
          :option="option" 
          :search-form="searchForm" 
          :showSearchButtons="false" 
          :column="column" 
          @select="onSelect" 
          @row-click="rowClick"></QcTable>
      </div>
      <span slot="footer">
        <el-button type="primary" size="mini" @click="saveCurrent">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      model: {
        name: '',
        type: '',
        memberLevelId: '',
        length: '',
        amount: '',
        // shopScope: '',
        // sourceIds: [],
        isAllowUnexpiredRenewal: false
      },
      loading: false,
      dialogTable: false,
      dialogType: 1,
      memberLevelData: {},
      memberLevelList: [],
      sourceList: [],
      option: {
        url: 'api/admin/v1/memberLevel/page',
        size: 'small',
        showSearchAndReset: true,
        isFull: false,
        height: 300
      },
      searchForm: [
        {
          label: '类型',
          type: 'select',
          formName: 'type',
          option: [
            { value: '', label: '全部' },
            { label: '等级', value: 'level' },
            { label: '头衔', value: 'actor' },
          ],
          value: ''
        },
      ],
      column: [
        {
          type: 'selection'
        },
        { prop: 'type', label: '类型', width: 50, align: 'center',
          formatter: row => {
            return row.type === 'level' ? '等级' : row.type === 'actor' ? '头衔' : row.type
          }
        },
        { prop: 'name', label: '名称', align: 'center' },
        { prop: 'createTime', label: '创建时间', align: 'center' },
      ],
    }
  },
  watch: {
    // visible(val) {
    //   if (val && this.id) {
    //     this.getMemberFees()
    //   }
    // }
  },
  created() {
    if (this.id) {
      this.getMemberFees()
    }
  },
  methods: {
    //获取
    async getMemberFees() {
      try {
        let res = await this.$http.getMemberFees({ id: this.id })
        this.model = res.data.data
        if (this.model.amount) this.model.amount = (this.model.amount / 100).toFixed(2)
        if (this.model.memberLevelId) this.getMemberLevel(this.model.memberLevelId)
        if (this.model.sourceIds && this.model.sourceIds.length > 0) this.pageMemberLevel()
      } catch (err) {
        console.log(err)
      }
    },
    //获取指定等级、头衔
    async getMemberLevel(id) {
      try {
        let res = await this.$http.getMemberLevel({ id: id })
        this.memberLevelData = res.data.data || {}
      } catch (err) {
        console.log(err)
      }
    },
    //获取全部等级、头衔
    async pageMemberLevel(id) {
      try {
        let res = await this.$http.pageMemberLevel({ pageNum: 1, pageSize: 999 })
        this.memberLevelList = res.data.data.list || []
        let selectList = this.memberLevelList.filter(item => this.model.sourceIds.includes(item.id))
        this.sourceList = selectList
      } catch (err) {
        console.log(err)
      }
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          if (this.model.type === 'calendarYear') this.model.length = 0
          if (this.model.shopScope != 'renew') {
            this.model.sourceIds = []
          }
          let model = JSON.parse(JSON.stringify(this.model))
          if (model.amount) model.amount = model.amount * 100
          this.saveModel(model)
        } else {
          return false
        }
      })
    },
    async saveModel(model) {
      try {
        await this.$http.addMemberFees(model)
        this.loading = false
        this.$message({
          message: this.id ? '修改成功' : '添加成功',
          type: 'success'
        })
        this.close(true)
      } catch (err) {
        this.loading = false
      }
    },
    close(flag = false) {
      this.$emit('close', flag)
      this.clearForm('model')
    },
    openDialogTable(state = 2) {
      this.dialogTable = true
      this.dialogType = state
    },
    closeDialogTable() {
      this.dialogTable = false
    },
    onCloseSupplier(row) {
      if (this.model.sourceIds) this.model.sourceIds.splice(this.model.sourceIds.findIndex(item => item === row.id), 1)
      if (this.sourceList) this.sourceList.splice(this.sourceList.findIndex(item => item.id === row.id), 1)
    },
    saveCurrent() {
      if (this.dialogType === 1) {
        if (this.tableRow.length > 1) {
          this.$message.warning('只能选择单个')
          return
        }
        this.memberLevelData = this.tableRow[0]
        this.model.memberLevelId = this.tableRow[0].id
      } else {
        let selectList = this.tableRow.filter(item => !this.model.sourceIds.includes(item.id))
        let sourceIds = selectList.map(item => item.id)
        if (selectList.length > 0) {
          this.sourceList = this.sourceList.concat(selectList)
          this.model.sourceIds = this.model.sourceIds.concat(sourceIds)
          // this.sourceList = selectList
          // this.model.sourceIds = sourceIds
        }
      }
      this.closeDialogTable()
    },
    onSelect(row) {
      this.tableRow = row
      console.log(row)
    },
    rowClick(row) {
      // console.log(row)
      // this.memberLevelData = row
      // this.model.memberLevelId = row.id
    }
  }
}
</script>
