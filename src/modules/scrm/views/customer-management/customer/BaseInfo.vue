<template>
  <div>
    <div class="title-bar">基础信息<el-button type="text" size="mini" @click="closeDialog">编辑信息</el-button></div>
    <div class="customerList">
      <ul>
        <li>
          <span class="name">备注名：</span>
          <span class="value">{{ customerList.remarks || '- -' }}</span>
        </li>
        <!-- <li>
          <span class="name">性别：</span>
          <span class="value">{{ customerList.genderName || '- -' }}</span>
        </li> -->
        <li>
          <span class="name">企业</span>
          <span class="value">{{ customerList.corpFullName || '- -' }}</span>
        </li>
        <!-- <li>
          <span class="name">职位</span>
          <span class="value">{{ customerList.position || '- -' }}</span>
        </li> -->
        <li>
          <span class="name">电话</span>
          <span class="value">{{ customerList.mobile || '- -' }}</span>
        </li>
        <li>
          <span class="name">邮箱</span>
          <span class="value">{{ customerList.email || '- -' }}</span>
        </li>
        <li v-for="(item, index) in customerList.externalProfileList" :key="index">
          <span class="name">{{ item.name }}</span>
          <span class="value">{{ item.value || '- -' }}</span>
        </li>
        <li>
          <span class="name">类型</span>
          <span class="value">{{ customerList.typeName || '- -' }}</span>
        </li>
        <li>
          <span class="name">状态</span>
          <span class="value">{{ customerList.statusName || '- -' }}</span>
        </li>
        <li>
          <span class="name">简介</span>
          <span class="value">{{ customerList.description || '- -' }}</span>
        </li>
        <li>
          <span class="name">所属成员</span>
          <span class="tagName" v-for="(item, index) in customerList.cropUserList" :key="index"
            ><i class="el-icon-user-solid icon-user"></i>{{ item.name }}</span
          >
        </li>
        <li>
          <span class="name">更新时间</span>
          <span class="value">{{ customerList.updateTime | allTableTimefilters }}</span>
        </li>
        <li>
          <span class="name">添加时间</span>
          <span class="value">{{ customerList.createAtToTime | allTableTimefilters }}</span>
        </li>
      </ul>
    </div>
    <Dialog :configure="configure" @closeDialog="closeDialogClose" @success="success">
      <el-form label-position="right" label-width="70px" ref="updateList" :model="updateList">
        <el-form-item label="备注名" prop="remarks">
          <el-input maxlength="20" show-word-limit placeholder="请输入备注" v-model="updateList.remarks"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别" prop="genderName">
          <el-radio-group v-model="updateList.genderName" disabled>
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
            <el-radio label="未知">未知</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="企业" prop="corpFullName">
          <el-input
            maxlength="20"
            show-word-limit
            width="200px"
            placeholder="请输入企业"
            v-model="updateList.corpFullName"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="职位" prop="position">
          <el-input maxlength="128" show-word-limit placeholder="请输入职务" v-model="updateList.position"></el-input>
        </el-form-item> -->
        <el-form-item label="电话" prop="mobile">
          <el-input
            type="text"
            v-on:input="updateList.mobile = updateList.mobile.replace(/[^\d]/g, '')"
            maxlength="40"
            show-word-limit
            placeholder="请输入电话"
            v-model="updateList.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input maxlength="40" show-word-limit placeholder="请输入邮箱" v-model="updateList.email"></el-input>
        </el-form-item>
        <el-form-item :label="item.name" v-for="(item, index) in updateList.extendList" :key="index">
          <div class="text" v-if="item.type == 'text'">
            <el-input
              maxlength="40"
              show-word-limit
              :placeholder="`请输入${item.name}`"
              v-model="item.value"
            ></el-input>
          </div>
          <div class="radio" v-if="item.type == 'radio'">
            <el-radio-group v-model="item.value">
              <el-radio :label="value" v-for="(value, key) in item.optionName" :key="key"
                ><span class="labelItem">{{ value }}</span></el-radio
              >
            </el-radio-group>
          </div>
          <div class="checkbox" v-if="item.type == 'checkbox'">
            <el-checkbox-group v-model="item.value" style="display: flex; flex-wrap: wrap">
              <el-checkbox :label="value" v-for="(value, key) in item.optionName" :key="key">
                <span class="labelItem">{{ value }}</span>
                <!-- <el-popover placement="bottom-start" width="300" trigger="hover" :content="value">
                  <p class="labelItem" slot="reference">{{ value }}</p>
                </el-popover> -->
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            class="textarea-input"
            type="textarea"
            :rows="3"
            resize="none"
            maxlength="150"
            show-word-limit
            placeholder="请输入简介"
            v-model="updateList.description"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import Dialog from '../../../components/components/Dialog'
export default {
  components: {
    Dialog
  },
  data() {
    return {
      // 客户id
      customerId: '',
      // 基础信息
      customerList: {},
      // 拓展信息
      extendList: [],
      // 对话框配置
      configure: {
        title: '修改基础信息', // 标题
        visible: false, // 开关
        width: '900px'
      },
      // 默认的复选框
      checkList: [],
      // 修改数据
      updateList: {}
    }
  },
  methods: {
    /*
        客户详情 getCustomerDetail showNewField
        详情修改 updataCustomerMessage
    */
    // ---页面渲染函数---
    closeDialogClose() {
      this.configure.visible = false
    },
    // 打开弹窗
    closeDialog() {
      this.configure.visible = true
      this.updateList = {}
      this.updateList = {
        id: this.customerId,
        remarks: this.customerList.remarks,
        genderName: this.customerList.genderName,
        corpFullName: this.customerList.corpFullName,
        position: this.customerList.position,
        mobile: this.customerList.mobile,
        email: this.customerList.email,
        extendList: this.extendList,
        typeName: this.customerList.typeName,
        statusName: this.customerList.statusName,
        description: this.customerList.description
      }
    },
    success() {
      new Promise((resolve, reject) => {
        this.updataCustomerMessage(this.updateList)

        this.updateList.extendList.forEach((item) => {
          if (item.type == 'checkbox') {
            item.value = item.value.join('_')
          }
          if (item.optionName) {
            item.optionName = item.optionName.join('_')
          }
        })
        let options = {
          id: this.updateList.id,
          externalProfileList: this.updateList.extendList
        }
        this.updateNewField(options)

        resolve(true)
      })
        .then((res) => {
          //   this.updateList.extendList.forEach((item) => {
          //   if (item.type == 'checkbox') {
          //     item.value = item.value.split('_')
          //   }
          // })
          if (res) {
            this.configure.visible = false
            this.getCustomerDetail()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // ---获取数据函数---
    // 获取基础信息
    getCustomerDetail() {
      this.$http.getCustomerDetail({ id: this.customerId }).then((res) => {
        this.customerList = res.data.data
        if (this.customerList.followUserList) {
          let remarksArr = []
          this.customerList.followUserList.forEach((item) => {
            remarksArr.push(item.remark)
          })
          remarksArr = remarksArr.reduce((total, now) => {
            total.includes(now) ? '' : total.push(now)
            return total
          }, [])
          this.customerList.remarks = remarksArr.join('/')
        }
        this.customerList.externalProfileList.forEach((item) => {
          if (item.value) {
            let result = /_/g.test(item.value)
            if (result) {
              item.value = item.value.replace(/_/g, '/')
            }
          }
        })
      })
    },
    // 获取拓展信息
    getCustomerExtend() {
      this.$http.showNewField({ id: this.customerId }).then((res) => {
        this.extendList = res.data.data
        this.extendList.forEach((item) => {
          if (item.type == 'radio' || item.type == 'checkbox') {
            item.optionName = item.optionName.split('_')
          }
          if (item.type == 'checkbox') {
            if (!item.value) {
              this.$set(item, 'value', [])
            } else {
              item.value = item.value.split('_')
            }
          }
        })
      })
    },
    // 修改基础信息
    updataCustomerMessage(options, callback) {
      this.$http.updataCustomerMessage(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改扩展信息
    updateNewField(options, callback) {
      this.$http.updateNewField(options).then((res) => {
        if (callback) {
          callback(res)
        }
      })
    }
  },
  created() {
    this.customerId = this.$route.query.id
    this.getCustomerDetail()
    this.getCustomerExtend()
  }
}
</script>

<style lang="scss" scoped>
.title-bar {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #303133;
  position: relative;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 20px;
    background-color: #294a7b;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    left: 0px;
  }
  .el-button {
    margin-left: 20px;
  }
}
.customerList {
  padding: 20px 20px 0;
  width: 100%;
  box-sizing: border-box;
  ul {
    max-width: 1000px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 30%;
      min-width: 300px;
      font-size: 14px;
      color: #909399;
      margin: 0 20px 30px 0;
      .name {
      }
      .value {
      }
      .tagName {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        color: #546e95;
        margin-right: 10px;
        i {
          color: #546e95;
        }
      }
    }
  }
}
.el-checkbox-group,
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.el-checkbox,
.el-radio {
  display: flex;
  height: 36px;
  align-items: center;
}
</style>
