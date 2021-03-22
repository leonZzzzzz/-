<template>
  <div>
    <!-- 基础信息 -->
    <div class="base-info">
      <!-- 个人信息 -->
      <div class="personal">
        <!-- <el-image style="width: 60px; height: 60px" :src="info.avatar" fit="cover"></el-image> -->
        <img style="width: 60px; height: 60px" :src="info.avatar" alt=""  v-if="isworkwechat!='not'"/>
        <div class="customer">
          <p>
            <span class="name">{{ info.name }}</span>
            <span class="type-name" v-if="isworkwechat!='not'">@{{ info.typeName }}</span>
          </p>
          <p class="life-cycle">
            <span class="life-cycle-type" v-if="isworkwechat!='not'">[{{ lifeCycleType }}]&nbsp;&nbsp;</span>
            <el-select v-model="lifeCycleValue" placeholder="生命周期" filterable popper-class="mySelect" @change="setLifeCycle" v-if="isworkwechat!='not'">
              <el-option-group v-for="group in lifeCycleList" :key="group.id" :label="group.name">
                <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-option-group>
            </el-select>
          </p>
        </div>
      </div>
      <!-- 标签 -->
      <div class="tags">
        <el-form label-width="80px" label-position="left">
          <el-form-item class="xfo-form-item" label="企业标签">
            <Tag type="light" :size="20" icon="el-icon-school" v-for="(item, index) in companyTags" :key="index">{{
              item
            }}</Tag>
            <el-button plain size="mini" style="height: 22px; padding: 0 5px" @click="updateTags('company')"
              >编辑</el-button
            >
          </el-form-item>
          <el-form-item class="xfo-form-item" label="行为标签" v-if="isworkwechat!='not'">
            <Tag type="light" :size="20" icon="el-icon-thumb" v-for="(item, index) in behaviorTags" :key="index">{{
              item.name
            }}</Tag>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 详细信息 -->
    <div class="detailed-info">
      <div class="update-button"></div>
      <div class="xfo-list">
        <div v-for="(item, index) in detailedInfo" :key="index">
          <div class="xfo-list-item" v-if="item.type != 'image'">
            <div class="xfo-item-title">{{ item.name }}</div>
            <div class="xfo-item-content" v-show="!item.isShow && item.type != 'image'">
              <span :title="item.type == 'checkbox' ? item.value.join('/') || '--' : item.value || '--'">{{
                item.type == 'checkbox' ? item.value.join('/') || '--' : item.value || '--'
              }}</span>
              <i class="el-icon-edit-outline xfo-update" @click="showInput(index, item.id, item.type)"></i>
            </div>
            <div class="xfo-item-content" v-if="item.isShow && item.type == 'text'">
              <el-input
                v-if="item.fieldType == 'default' && (item.name == '备注名' || item.name == '企业')"
                :ref="item.id"
                size="mini"
                type="text"
                :placeholder="`请输入${item.name}`"
                v-model="item.value"
                maxlength="20"
                show-word-limit
                class="aaaa"
                :autofocus="true"
                @blur="inputBlur(item, index)"
                @change="isChange"
              >
              </el-input>
              <el-input
                v-else-if="item.fieldType == 'default' && item.name == '描述'"
                :ref="item.id"
                size="mini"
                type="text"
                :placeholder="`请输入${item.name}`"
                v-model="item.value"
                maxlength="150"
                show-word-limit
                class="aaaa"
                :autofocus="true"
                @blur="inputBlur(item, index)"
                @change="isChange"
              >
              </el-input>
              <el-input
                v-else
                :ref="item.id"
                size="mini"
                type="text"
                :placeholder="`请输入${item.name}`"
                v-model="item.value"
                maxlength="40"
                show-word-limit
                class="aaaa"
                :autofocus="true"
                @blur="inputBlur(item, index)"
                @change="isChange"
              >
              </el-input>
            </div>
            <div class="xfo-item-content" v-if="item.isShow && item.type == 'radio'">
              <el-radio-group v-model="item.value" @change="isChange">
                <el-radio :label="gItem" v-for="(gItem, gIndex) in item.optionName" :key="gIndex" :title="gItem">{{
                  gItem
                }}</el-radio>
              </el-radio-group>
              <i class="submit el-icon-success" @click="inputBlur(item, index)"></i>
            </div>
            <div class="xfo-item-content" v-if="item.isShow && item.type == 'checkbox'">
              <el-checkbox-group v-model="item.value" @change="isChange">
                <el-checkbox :label="gItem" v-for="(gItem, gIndex) in item.optionName" :key="gIndex" :title="gItem">{{
                  gItem
                }}</el-checkbox>
              </el-checkbox-group>
              <i class="submit el-icon-success" @click="inputBlur(item, index)"></i>
            </div>
          </div>
          <div v-else :class="item.value.length > 0 || item.isShow ? 'xfo-list-item-max' : ''">
            <div class="xfo-list-item xfo-list-item__image">
              <div class="xfo-item-title">{{ item.name }}</div>
              <div class="xfo-item-content">
                <span style="color: #909399">可上传9张，单张图片像素不可大于5MB</span>
                <i class="el-icon-edit-outline xfo-update" v-show="!item.isShow" @click="showImageBox(index)"></i>
                <i class="submit el-icon-success" v-show="item.isShow" @click="updateImageList(item, index)"></i>
              </div>
            </div>
            <div class="image-list-box" v-if="!item.isShow && item.value.length > 0">
              <el-image
                v-for="(obj, index) in item.value"
                :key="'val' + index"
                :src="imgHost + obj"
                fit="cover"
                class="image"
                :preview-src-list="[`${imgHost}${obj}`]"
              >
              </el-image>
            </div>
            <div class="image-list-box" v-if="item.isShow">
              <UploadImage
                :width="90"
                :height="90"
                :fileList="item.imageList"
                :maxLength="9"
                :size="5"
                @success="e => imageSuccess(e, index)"
              >
              </UploadImage>
            </div>
          </div>
        </div>
        <div class="xfo-list-item">
          <div class="xfo-item-title">所属成员</div>
          <div class="xfo-item-content" v-if="isworkwechat=='not'">
            <div v-if="info.claimUser" style="display: flex; flex-wrap: wrap">
              <Tag
                type="light"
                :size="19"
                icon="el-icon-user-solid"
                >{{ info.claimUser }}</Tag
              >
            </div>
            <div v-else>--</div>
          </div>
          <div class="xfo-item-content" v-else>
            <div v-if="info.cropUserList && info.cropUserList.length > 0" style="display: flex; flex-wrap: wrap">
              <Tag
                type="light"
                :size="19"
                icon="el-icon-user-solid"
                v-for="(item, index) in info.cropUserList"
                :key="index"
                >{{ item.name }}</Tag
              >
            </div>
            <div v-else>--</div>
          </div>
        </div>
        <div class="xfo-list-item">
          <div class="xfo-item-title">更新时间</div>
          <div class="xfo-item-content">{{ info.updateTime | allTableTimefilters }}</div>
        </div>
        <div class="xfo-list-item">
          <div class="xfo-item-title">添加时间</div>
          <div class="xfo-item-content">{{ info.createAtToTime | allTableTimefilters }}</div>
        </div>
      </div>
    </div>
    <!-- 标签 -->
    <tags-dialog
      :configure="configure"
      :type="type"
      :selectedList="selectedList"
      @closeDialog="closeDialog"
      @success="success"
    ></tags-dialog>
  </div>
</template>

<script>
import Tag from '../../../components/components/Tag'
import TagsDialog from '@/modules/scrm/components/components/TagsDialog.vue'
import UploadImage from '../../../components/components/UploadImage'
export default {
  components: { Tag, TagsDialog, UploadImage },
  created() {
    if(this.$route.query.isworkwechat&&this.$route.query.isworkwechat=='not'){
      this.isworkwechat='not'
    }
    this.pageId = this.$route.query.id
    this.getLifeCycleUsers()
    this.mergeData()
  },
  data() {
    return {
      isworkwechat:'',
      pageId: '',
      info: {
        customerLifeCycle: {
          cycleName: ''
        }
      },
      // 生命周期
      lifeCycleType: '--',
      lifeCycleValue: '',
      lifeCycleList: [],
      // 标签
      configure: {
        title: '企业标签',
        visible: false,
        width: '600px',
        top: '15vh'
      },
      type: 'company',
      // 企业标签
      companyTags: [],
      // 行为标签
      behaviorTags: [],
      // 个人标签
      personalTags: [],
      // 详细信息
      startArr: [],
      middleArr: [],
      detailedInfo: [],
      selectedList: [],
      // 输入框值变化
      inputChange: false
    }
  },
  methods: {
    // ---页面渲染---
    // 设置客户生命周期
    setLifeCycle() {
      let options = {
        customerId: this.pageId,
        customerLifeCycleId: this.lifeCycleValue
      }
      this.addLifeCycle(options, res => {
        this.$message.success('设置成功')
        this.mergeData()
      })
    },
    // 选中标签
    closeDialog() {
      this.configure.visible = false
    },
    success(tags) {
      this.configure.visible = false
      let tagId = ''
      tags.forEach(item => {
        tagId = tagId + '_' + item.id
      })
      if (this.type == 'company') {
        // console.log(tags)
        let options={},url=''
        if(this.isworkwechat=='not'){
          options={tagId: tagId.slice(1),id:this.pageId}
          url='EnterpriseLabelClient'
        }else{
          options = {
            tagId: tagId.slice(1),
            customerId: this.pageId
          }
          url='enterpriseTagList'
        } 
        this.enterpriseTagList(options,url, res => {
            this.$message.success('修改客户企业标签成功')
            this.mergeData()
          })
      }
      if (this.type == 'personal') {
        let options = {
          personalTagId: tagId.slice(1),
          customerId: this.pageId
        }
        this.personalSave(options, res => {
          this.$message.success('修改客户个人标签成功')
          this.getPerosonalTags({ customerId: this.pageId })
        })
      }
    },
    // 编辑标签
    updateTags(type) {
      console.log(type)
      this.type = type
      this.configure.visible = true
      if (type == 'company') {
        // 暂时无法回显 接口数据没有返回标签id
      }
      if (type == 'personal') {
        // 这个接口很奇葩，修改时请注意
        let arr = []
        this.personalTags.forEach(item => {
          if (item.isCheck) {
            arr.push(item)
          }
        })
        this.selectedList = arr
      }
    },
    // 合并数据
    mergeData() {
      new Promise(async (resolve, reject) => {
        var url=''
        if(this.isworkwechat=='not'){
          url="EnterpriseMicoClient"
        }else{
          url="getCustomerDetail"
        }
        console.log(url)
        await this.getCustomerDetail({ id: this.pageId },url)
        await this.showNewField()
        resolve(true)
      }).then(res => {
        if (res) {
          this.detailedInfo = this.startArr.concat(this.middleArr)
          // console.log('列表数据==》', this.detailedInfo)
        }
      })
    },
    // 显示修改输入框
    showInput(index, ref, type) {
      this.detailedInfo.forEach(dItem => {
        dItem.isShow = false
      })
      this.detailedInfo[index].isShow = true
      if (type == 'text') {
        this.$nextTick(() => {
          this.$refs[ref][0].$el.children[0].focus()
        })
      }
    },
    // 输入框是否发生变化
    isChange() {
      this.inputChange = true
    },
    // 失去焦点事件
    inputBlur(item, index) {
      this.detailedInfo[index].isShow = false
      if (!this.inputChange) {
        return
      }
      if (item.fieldType == 'custom') {
        let value = ''
        if (item.type == 'checkbox') {
          value = item.value.join('_')
        } else {
          value = item.value
        }
        let options = {
          id: item.id,
          name: item.name,
          value,
          customerId: this.pageId
        }
        this.updateSaveOneDefault(options, res => {
          this.$message.success('修改成功')
          this.inputChange = false
        })
      } else {
        let options = {
          id: this.pageId
        }
        if (item.name == '备注名') {
          options.remarks = item.value
        }
        if (item.name == '企业') {
          options.corpFullName = item.value
        }
        if (item.name == '电话') {
          options.mobile = item.value
        }
        if (item.name == '邮箱') {
          options.email = item.value
        }
        if (item.name == '描述') {
          options.description = item.value
        }
        this.updataCustomerMessage(
          options,
          res => {
            this.$message.success('修改成功')
            this.inputChange = false
          },
          err => {
            this.$message.error('修改失败')
            this.inputChange = false
          }
        )
      }
    },
    // ---获取数据---
    // 客户信息
    getCustomerDetail(options,url) {
      return new Promise((resolve, reject) => {
        this.$http[url](options)
          // .getCustomerDetail(options)
          .then(res => {
            this.info = res.data.data
            this.lifeCycleValue = this.info.customerLifeCycle ? this.info.customerLifeCycle.id : ''
            this.lifeCycleType = this.info.customerLifeCycle ? this.info.customerLifeCycle.category : '--'
            this.behaviorTags = this.info.behaviorTagList
            this.companyTags = this.info.cropTagName
            this.startArr = [
              {
                name: '备注名',
                value: this.info.remarks,
                isShow: false,
                id: 'beizhuming',
                fieldType: 'default',
                type: 'text'
              },
              {
                name: '企业',
                value: this.info.corpFullName,
                isShow: false,
                id: 'qiye',
                fieldType: 'default',
                type: 'text'
              },
              {
                name: '电话',
                value: this.info.mobile,
                isShow: false,
                id: 'dianhua',
                fieldType: 'default',
                type: 'text'
              },
              {
                name: '邮箱',
                value: this.info.email,
                isShow: false,
                id: 'youxiang',
                fieldType: 'default',
                type: 'text'
              },
              {
                name: '描述',
                value: this.info.description,
                isShow: false,
                id: 'jianjie',
                fieldType: 'default',
                type: 'text'
              }
            ]
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 生命周期列表
    getLifeCycleUsers() {
      this.functions('customerLifeCycleTree', '', res => {
        this.lifeCycleList = res.data.data
      })
    },
    // 设置客户生命周期
    addLifeCycle(options, callback) {
      this.functions('addLifeCycle', options, res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 获取个人标签
    getPerosonalTags(options) {
      this.functions('perosonalList', options, res => {
        this.personalTags = res.data.data
      })
    },
    // 获取拓展信息
    showNewField() {
      this.middleArr = []
      return new Promise((resolve, reject) => {
        let options = {
          id: this.pageId
        }
        this.$http
          .showNewField(options)
          .then(res => {
            let data = res.data.data
            data.forEach(item => {
              if (!item.value) {
                this.$set(item, 'value', '')
              }
              this.$set(item, 'isShow', false)
              this.$set(item, 'fieldType', 'custom')
              if (item.type == 'checkbox' || item.type == 'radio') {
                item.optionName = item.optionName.split('_')
              }
              if (item.type == 'checkbox') {
                if (item.value) {
                  item.value = item.value.split('_')
                } else {
                  item.value = []
                }
              }
              // 新增图片类型的自定义字段
              if (item.type == 'image') {
                item.imageList = []
                if (item.value) {
                  let list = item.value.split('_')
                  list.forEach(obj => {
                    item.imageList.push({
                      name: 'image',
                      url: this.imgHost + obj
                    })
                  })
                  item.value = item.value.split('_')
                } else {
                  item.value = []
                }
              }
              this.middleArr.push(item)
            })
            // console.log('返回', this.middleArr)
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 修改自定义字段
    updateSaveOneDefault(options, callback) {
      this.$http.updateSaveOneDefault(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改默认字段
    updataCustomerMessage(options, callback, errback) {
      let url=''
      if(this.isworkwechat=='not'){
        url='updatanotCustomerMessage'
      }else{
        url='updataCustomerMessage'
      }
      this.$http[url](options).then(res => {
      // this.$http.updataCustomerMessage(options).then(res => {
          if (callback) {
            callback(res)
          }
        })
        .catch(err => {
          if (errback) {
            errback(err)
          }
        })
    },
    // 修改客户企业标签
    enterpriseTagList(options,url, callback) {
      this.$http[url](options).then(res => {
      // this.$http.enterpriseTagList(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改客户个人标签
    personalSave(options, callback) {
      this.$http.personalSave(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 显示图片类型的编辑窗口
    showImageBox(idx) {
      this.detailedInfo[idx].isShow = true
    },
    // 上传图片
    imageSuccess(val, idx) {
      this.detailedInfo[idx].value = []
      val.forEach(item => {
        this.detailedInfo[idx].value.push(item.url)
      })
      // console.log('上传图片返回值', this.detailedInfo[idx])
    },
    // 更新图片类型的数据
    updateImageList(item, idx) {
      let value = ''
      if (item.value.length > 0) {
        value = item.value.join('_')
      }
      let options = {
        id: item.id,
        name: item.name,
        value,
        customerId: this.pageId
      }
      this.updateSaveOneDefault(options, res => {
        this.$message.success('修改成功')
        this.detailedInfo[idx].isShow = false
        let currentItem = this.detailedInfo[idx]
        currentItem.imageList = []
        currentItem.value.forEach(obj => {
          currentItem.imageList.push({
            name: 'image',
            url: this.imgHost + obj
          })
        })
        // console.log('返回数据', currentItem, this.detailedInfo[idx])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 基础信息
.base-info {
  padding: 20px;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  .personal {
    display: flex;
    .customer {
      font-size: 14px;
      color: #262626;
      padding-left: 10px;
      // display: flex;
      // flex-direction: column;
      align-content: space-between;
      .name {
        // line-height: 30px;
        font-size: 18px;
        font-weight: 600;
      }
      .type-name {
        color: #00b050;
      }
      .life-cycle {
        margin-top: 10px;
        .life-cycle-type {
          color: #294a7b;
        }
        .el-select {
          ::v-deep input {
            border: none;
            width: 100px;
            padding-left: 0;
            color: #294a7b;
            font-size: 14px;
          }
        }
      }
    }
  }
  .tags {
    max-width: 1030px;
    margin-top: 20px;
    ::v-deep .xfo-form-item {
      margin-bottom: 0px;
    }
  }
}
// 详细信息
.detailed-info {
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: 10px;
  padding: 20px;
  .xfo-list {
    width: 1030px;
    display: flex;
    flex-wrap: wrap;
    .xfo-list-item {
      width: 500px;
      margin-bottom: 10px;
      margin-right: 10px;
      display: flex;
      border: 1px solid #ebeef5;
      font-size: 14px;
      .xfo-item-title {
        width: 116px;
        height: 36px;
        background-color: #f9f9f9;
        padding: 0 10px;
        line-height: 36px;
        color: #606266;
      }
      .xfo-item-content {
        flex: 1;
        padding: 0 30px 0 10px;
        line-height: 36px;
        position: relative;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .xfo-update {
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 10px;
          display: none;
        }
        &:hover {
          .xfo-update {
            display: block;
          }
        }
        .submit {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 18px;
          color: #eaedf2;
          cursor: pointer;
          &:hover {
            color: #294a7b;
          }
        }
        ::v-deep .el-checkbox-group,
        ::v-deep .el-radio-group {
          display: flex;
          flex-wrap: wrap;
        }
        ::v-deep .el-checkbox,
        ::v-deep .el-radio {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 20px;
        }
        ::v-deep .el-checkbox__label,
        ::v-deep .el-radio__label {
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.xfo-list-item-max {
  width: 1013px;
  border: 1px solid #ebeef5;
  margin-bottom: 10px;
  .xfo-list-item__image {
    width: 100% !important;
    border: unset !important;
    border-bottom: 1px solid #ebeef5 !important;
    margin-bottom: 0 !important;
  }
}
.image-list-box {
  display: flex;
  padding: 20px;
  // border: 1px solid #f3f3f3;
  .image {
    width: 90px;
    height: 90px;
    margin: 0 12px 12px 0;
    border-radius: 6px;
  }
}
</style>
