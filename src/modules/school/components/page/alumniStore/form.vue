<template>
  <el-dialog
    :title="id ? '修改' : '添加'"
    :visible.sync="visible"
    width="550px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="overflow: auto;height:350px;padding-right:10px" v-loading="dataLoading">
      <el-form :model="model" ref="model" label-position="left" label-width="90px" size="small">
        <el-form-item :label="item.label" :prop="item.prop" v-for="(item, index) in formList" :key="index">
          <el-input
            v-if="
              item.prop == 'name' ||
                item.prop == 'phone' ||
                item.prop == 'studentId' ||
                item.prop == 'wechat' ||
                item.prop == 'company' ||
                item.prop == 'position' ||
                item.prop == 'city' ||
                item.prop == 'companyPhone' ||
                item.prop == 'hobby' ||
                item.prop == 'phoneBackup' ||
                item.prop == 'provide' ||
                item.prop == 'demand' ||
                item.prop == 'nativePlace' ||
                item.prop == 'qqNumber' ||
                item.prop == 'mailBox'
            "
            v-model="model[item.prop]"
            clearable
          ></el-input>
          <el-date-picker
            style="width:100%"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-if="item.prop == 'birthday'"
            v-model="model[item.prop]"
            clearable
          ></el-date-picker>
          <el-select v-if="item.prop == 'trade'" v-model="model[item.prop]" filterable style="width: 100%">
            <el-option :label="item" :value="item" v-for="(item, index) in tradeList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-select v-model="model.classId" filterable style="width: 100%">
            <el-option :label="item.className" :value="item.id" v-for="item in classList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="labels" v-if="true">
          <!-- multiple -->
          <el-select v-model="modelLabels" filterable multiple @remove-tag="removeTag" placeholder="请选择，可输入关键字搜索" style="width:100%">
            <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.name"> </el-option>
          </el-select>
          <div v-if="model.labels && model.labels.length > 0">
            <p style="color: #888;font-size: 14px;">用户已有标签</p>
            <el-tag
              v-for="(item, i) in model.labels"
              :key="i"
              size="mini"
              style="margin-right: 5px;margin-bottom: 5px;"
              >{{ item.name }}</el-tag
            >
            <!-- closable -->
            <!-- @close="closeTag(item.name)" -->
          </div>
        </el-form-item>
        <el-form-item
          v-if="model.memberId"
          label="等级/头衔"
          prop="memberLevelId"
          :rules="[{ required: false, message: '该字段不能为空' }]">
          <el-select
            v-model="model.memberLevelId"
            placeholder="请选择"
            size="small"
            style="width: 180px;"
          >
            <!-- <el-option size="small" label="不选择" value=""></el-option> -->
            <el-option
              size="small"
              v-for="option in memberLevelList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          v-if="model.memberId && model.memberLevelId" 
          label="结束时间" 
          prop="endMemberLevelJoinTime" 
          :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-date-picker
            type="datetime"
            size="small"
            placeholder="请选择"
            v-model="model.endMemberLevelJoinTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            :editable="false"
            style="width: 180px;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from 'apiSchool/common'

export default {
  props: {
    visible: Boolean,
    cityList: Array,
    tradeList: Array,
    classList: Array,
    memberLevelList: {
      type: Array,
      default: []
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {
        memberLevelId: '',
        endMemberLevelJoinTime: '',
      },
      digImgWrap: false,
      formList: [],
      labels: [],
      modelLabels: [],
      loading: false,
      dataLoading: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.contactsSettingGet()
        this.getPersonalityLabel()
      } else {
        this.formList = []
        this.modelLabels = []
      }
    },
    modelLabels(val) {
      // 单选
      console.log(val)
      // 多选
      this.model.labels = []
      if (val && val.length > 0) {
        if (!this.model.labels || this.model.labels.length === 0) {
          val.forEach(item => {
            let index = this.labels.findIndex(label => label.name === item)
            this.model.labels.push({ name: this.labels[index].name, sortNumber: this.labels[index].sortNumber })
          })
        } else {
          val.forEach((item, i) => {
            if (this.model.labels.findIndex(label => label.name === item) === -1) {
              let index = this.labels.findIndex(label => label.name === item)
              this.model.labels.push({ name: this.labels[index].name, sortNumber: this.labels[index].sortNumber })
            }
          })
        }
      } else {
        // this.model.labels = []
      }
    }
  },
  methods: {
    contactsSettingGet() {
      api.contactsSettingGet().then(res => {
        let list = []
        res.data.data.map((item, index) => {
          if (
            item.isNeed &&
            item.fieldId !== 'year' &&
            item.fieldId !== 'degreeName' &&
            item.fieldId !== 'departmentName'
          ) {
            this.$set(this.model, item.fieldId, '')
            this.formList.push({ prop: item.fieldId, label: item.showName, value: '' })
          }
        })
        if (this.id != '') {
          this.dataLoading = true
          this.getAlumni()
        }
      })
    },
    //更新信息
    getAlumni() {
      api.getAlumni({ id: this.id }).then(res => {
        this.dataLoading = false
        this.model = res.data.data
        if (this.model.labels) {
          this.modelLabels = this.model.labels.map(item => item.name)
        }
        if (this.model.memberLevelJoin) {
          this.model.memberLevelId = this.model.memberLevelJoin.memberLevelId
          this.model.endMemberLevelJoinTime = this.model.memberLevelJoin.endTime
        }
      })
    },
    // 获取个性标签
    getPersonalityLabel() {
      this.$http.pagePersonalityLabel({ pageNum: 1, pageSize: 999 }).then(res => {
        this.labels = res.data.data.list
      })
    },
    removeTag(name) {
      // 点击选择器的删除就不要再删除自身的数组--modelLabels
      let index = this.model.labels.findIndex(label => label.name === name)
      this.model.labels.splice(index, 1)
    },
    closeTag(name) {
      let index = this.model.labels.findIndex(label => label.name === name)
      let index2 = this.modelLabels.findIndex(label => label === name)
      this.model.labels.splice(index, 1)
      this.modelLabels.splice(index2, 1)
    },
    //添加
    save(model) {
      api
        .addAlumni(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(err => {
          this.loading = false
        })
    },
    //修改
    update(model) {
      api
        .updateAlumni(model)
        .then(res => {
          this.loading = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.close(true)
        })
        .catch(err => {
          this.loading = false
        })
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true
          let model = JSON.parse(JSON.stringify(this.model))

          if (this.id != '') {
            this.update(model)
          } else {
            this.save(model)
          }
        } else {
          return false
        }
      })
    },
    close(flag) {
      this.model = this.reduc()
      this.$refs.model.resetFields()
      this.$emit('close', flag)
    },
    reduc() {
      let model = {
        name: '',
        studentId: '',
        phone: '',
        classId: '',
        company: '',
        position: '',
        // trade: "",
        city: '',
        mailbox: ''
      }
      return model
    }
  }
}
</script>
