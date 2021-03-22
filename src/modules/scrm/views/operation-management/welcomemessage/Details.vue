<template>
  <div class="memberDetails">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">{{
        pageId ? '修改欢迎语' : '创建欢迎语'
      }}</el-button>
    </div>
    <div class="main_content">
      <div class="main_box">
        <el-form label-width="90px" label-position="right" :model="model" ref="model">
          <el-form-item label="使用成员" :required="true">
            <input type="hidden" />
            <div class="tagname-form">
              <span class="tagName" v-for="(item, index) in allList" :key="index"
                ><i class="el-icon-user-solid icon-user"></i>{{ item.userName }}</span
              >
            </div>
            <el-button plain icon="el-icon-plus" size="mini" @click="addMember()">添加</el-button>
          </el-form-item>
          <el-form-item
            label="欢迎语"
            prop="message"
            :rules="{ required: true, message: '请输入欢迎语', trigger: 'blur' }"
          >
            <el-input
              id="textInput"
              class="record_input"
              type="textarea"
              width="600px"
              maxlength="2000"
              show-word-limit
              size="small"
              placeholder="最多可输入2000字"
              height="400px"
              :rows="6"
              resize="none"
              v-model="model.message"
            ></el-input>

            <div class="welcome-buttom">
              <div class="welcome-emjoi">
                <emotion @selectedEmotion="_selectedEmotion"></emotion>
              </div>
              <div class="welcome-div">
                <el-button type="text" size="mini">插入昵称</el-button>
                <el-button plain size="mini" @click="insert('<客户昵称>')">客户昵称</el-button>
                <el-button plain size="mini" @click="insert('<成员昵称>')">成员昵称</el-button>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="附加内容" :required="true">
            <el-radio-group v-model="model.type">
              <el-radio label="text" @change="changeNone">无</el-radio>
              <el-radio label="image" @change="changeImage">图片</el-radio>
              <el-radio label="image_text" @change="changeWeb">网页</el-radio>
              <el-radio label="program" @change="changeApp">小程序</el-radio>
              <el-radio label="business_card" @change="changeCard">名片</el-radio>
              <el-radio label="rolling_lottery" @change="changeLottery">抽奖</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="附加内容" :required="true">
            <el-radio-group v-model="model.type">
              <el-radio
                v-for="(item, idx) in attachmentList"
                :key="idx"
                :label="item.type"
                :disabled="item.avaiable ? false : true"
                @change="attachmentChange"
              >
                {{ item.name }}
                <el-tooltip
                  v-if="item.avaiable == false"
                  class="item"
                  effect="light"
                  :content="item.message"
                  placement="top-start"
                >
                  <el-button type="text" icon="el-icon-warning-outline"></el-button>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="image-div" v-if="model.type === 'image'">
            <el-form-item>
              <UploadImage :size="2" :fileList="imageUrlFileList" @success="UploadImageSuccess"></UploadImage>
            </el-form-item>
          </div>
          <div class="web-div" v-if="model.type === 'image_text'">
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接标题" prop="name"
              ><el-input maxlength="64" placeholder="最多可输入64个字" v-model="model.name"></el-input
            ></el-form-item>
            <el-form-item label="链接简介"
              ><el-input placeholder="最多可输入32个字" v-model="model.content"></el-input
            ></el-form-item>
            <el-form-item :rules="[{ required: true, message: '请填写该字段' }]" label="链接地址" prop="link"
              ><el-input placeholder="请输入链接地址" v-model="model.link"></el-input
            ></el-form-item>
            <el-form-item>
              <UploadImage :size="2" :fileList="linkImageUrlFileList" @success="UploadLinkmageSuccess"></UploadImage>
            </el-form-item>
          </div>
          <div class="app-div" v-if="model.type === 'program'">
            <!-- <SelectProgramItem ref="SelectProgramItem" :programProps="programIdProps"></SelectProgramItem> -->
            <div style="margin-left: 90px; margin-bottom: 20px">
              <el-select
                placeholder="请选择"
                v-model="programIdProps.id"
                @change="changeSelect()"
                @clear="clearSelect()"
                clearable
              >
                <el-option
                  class="app-select"
                  v-for="(item, index) in proOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="program-mater-div" v-if="programIdProps.id">
              <img :src="materialProgram.url" style="width: 36px; height: 36px; border-radius: 50%; padding: 10px" />
              <span>{{ materialProgram.name }}</span>
            </div>
          </div>
          <el-form-item v-if="model.type === 'image_text'">
            <material-btn :isType="isType" @success="materialSuccess"></material-btn>
          </el-form-item>
          <el-form-item label="选择抽奖" :required="true" v-if="model.type === 'rolling_lottery'">
            <div class="lottery-config">
              <div class="select-box">
                <div class="select-content" @click="showLotteryDialog()">
                  <div class="name">
                    {{ !lotteryDialog.selectedLotteryData.title ? '请选择' : lotteryDialog.selectedLotteryData.title }}
                  </div>
                  <i class="el-icon-arrow-down"></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnabled" :required="true">
            <el-switch v-model="model.isEnabled"> </el-switch>
          </el-form-item>

          <el-form-item>
            <el-button size="medium" @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" size="medium" @click="createSumbitAddBtn()" v-show="!pageId">保存</el-button>
            <el-button type="primary" size="medium" @click="createSumbitAddBtn()" v-show="pageId">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <MemberTreeDialog
      :config="dialogVisible"
      @closeDialog="dialogVisible.visible = false"
      :selectedList="memberList"
      ref="department"
      @handleConfirm="setMembers"
    >
    </MemberTreeDialog>
    <!-- 抽奖列表 -->
    <com-dialog :config="lotteryDialog.config" @closeDialog="lotteryDialog.config.visible = false">
      <div class="selection-dialog" style="height: auto">
        <div class="query-table">
          <el-form label-width="80px" label-position="right" size="small" inline>
            <el-form-item label="抽奖标题">
              <el-input
                placeholder="请输入抽奖标题"
                v-model="lotteryDialog.search.title"
                @input="searchLottery"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="selection-table">
          <el-table
            ref="lotteryTable"
            :data="lotteryDialog.tableData"
            style="width: 100%"
            height="500px"
            @selection-change="handleLotterySelectionChange"
            @row-click="clickLotteryRow"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <el-table-column label="标题" align="center" prop="title"></el-table-column>
            <el-table-column label="开始时间" align="center" prop="startTime">
              <template slot-scope="scope">
                <div>{{ scope.row.startTime | formatterTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime">
              <template slot-scope="scope">
                <div>{{ scope.row.endTime | formatterTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template slot-scope="scope">
                <div>{{ scope.row.status | statusType }}</div>
              </template>
            </el-table-column>
            <el-table-column label="使用次数" align="center" prop="usedTimes"></el-table-column>
            <el-table-column label="抽奖次数限制类型" align="center" prop="limitType">
              <template slot-scope="scope">
                <div>{{ scope.row.limitType | limitType }}</div>
              </template>
            </el-table-column>
            <el-table-column label="限制次数" align="center" prop="limitTimes"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template slot-scope="scope">
                <div>{{ scope.row.createTime | formatterTime }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="lotteryDialog.page"
            @sizeChange="onLotterySizeChange"
            @pageChange="onLotteryPageChange"
          ></com-pagination>
        </div>
        <div class="dialog-btns">
          <el-button @click="lotteryDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="chooseLottery">确定</el-button>
        </div>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import Emotion from '../../../components/common/Emotion'
import MemberTreeDialog from '../../../components/components/MemberTreeDialog'
import UploadImage from '../../../components/components/UploadImage'
// import SelectProgramItem from '../../../components/components/SelectProgramItem'
import MaterialBtn from '../../../components/material/MaterialBtn'
export default {
  components: {
    Emotion,
    MemberTreeDialog,
    // UploadImage
    // SelectProgramItem,
    // MaterialBtn,
    UploadImage,
    // SelectProgramItem,
    MaterialBtn,
    ComDialog,
    ComPagination
  },
  data() {
    return {
      // 页面id
      pageId: '',
      appId: '',
      // 数据
      model: {
        id: '',
        createTime: '',
        updateTime: '',
        appId: '',
        type: 'text',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '',
        message: '',
        userId: '',
        isEnabled: true,
        source: '',
        mediaId: '',
        mediaIdExpireTime: '',
        userType: 0
      },
      // 附加内容类型
      changeTag: 'text',
      // 小程序选择列表
      options: [],
      programIdProps: {
        id: '',
        name: '',
        logo: ''
      },
      // 上传图片
      imageUrl: '',
      imageUrlFileList: [],
      linkImageUrl: '',
      linkImageUrlFileList: [],
      dialogVisible: {
        width: '800px',
        title: '选择目标成员',
        visible: false
      },
      // ---添加发送对象对话框数据 ---
      memberList: [],
      idList: [],
      allList: [],
      programInfoOption: {
        logo: '',
        name: ''
      },
      // ---添加发送对象对话框数据end ---

      //传入素材管理选择的素材类型
      isType: 'text',
      isProgram: false, //选择小程序素材之后
      materialProgram: {
        url: '',
        name: ''
      },

      webClone: false, // 从素材库中选择的是不是网页
      proClone: false, //从素材库中选择的是不是小程序
      isWebList: [], // 是否网页数据
      isProList: [], // 是否小程序数据
      proOptions: [], // 存储小程序选择的数据
      programModel: {
        name: '',
        link: '',
        imageUrl: ''
      },
      lotteryDialog: {
        config: {
          width: '1200px',
          title: '选择抽奖',
          visible: false
        },
        tableData: [],
        multipleSelection: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        search: {
          title: ''
        },
        selectedLotteryData: {}
      },
      attachmentList: [] // 可选附加内容列表
    }
  },
  methods: {
    //zhw
    //获取小程序
    getProgarm() {
      this.proOptions = []
      this.$http.getProgarm().then(res => {
        this.proOptions = res.data.data
      })
      this.getMaterialPage()
    },
    //获取小程序的数据
    getMaterialPage() {
      let params = {
        type: 'program',
        groupId: '',
        pageNum: 1,
        pageSize: 999,
        name: ''
      }
      this.$http.getMaterialPage(params).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          this.proOptions.push(item)
        })

        console.log(this.proOptions)
      })
    },
    changeSelect() {
      this.proOptions.forEach(item => {
        if (item.id == this.programIdProps.id) {
          this.programIdProps.name = item.name
          if (item.page) {
            this.programModel.link = item.page
          } else {
            this.programModel.link = item.link
          }
          // this.programModel.link = item.page
          this.programModel.name = item.name
          this.materialProgram.name = item.name
          if (item.logo) {
            this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + item.logo
            this.programModel.imageUrl = item.logo
          } else {
            this.programModel.imageUrl = item.imageUrl
            this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + item.imageUrl
          }
          console.log(this.materialProgram)
        }
      })
    },
    //清除选择项
    clearSelect() {
      this.materialProgram = {
        url: '',
        name: ''
      }
      this.programModel = {
        name: '',
        link: '',
        imageUrl: ''
      }
      this.programIdProps = {
        id: '',
        name: '',
        logo: ''
      }
    },
    materialSuccess(val) {
      this.changeTag = ''
      this.model.type = ''

      if (val.type == 'image') {
        setTimeout(() => {
          this.model.type = val.type
          this.isType = val.type
        }, 100)
        this.changeTag = val.type
        this.imageUrlFileList[0] = {
          url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl,
          name: val.name
        }
        this.imageUrl = this.imageUrlFileList[0].url
      } else if (val.type == 'image_text' || val.type == 'numerous_image_text') {
        this.webClone = true
        this.isWebList = val
        this.changeTag = 'image_text'
        this.isType = 'image_text'
        // this.model.type = 'image_text'
        setTimeout(() => {
          this.model.type = 'image_text'
        }, 100)
        this.linkImageUrlFileList = []
        this.model.name = val.name
        this.model.content = val.content
        this.model.link = val.link
        this.linkImageUrlFileList[0] = {
          url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl,
          name: val.name
        }
        this.linkImageUrl = val.imageUrl
      } else if (val.type == 'program') {
        this.isType = val.type
        this.isProgram = true
        this.model.type = val.type
        this.proClone = true
        this.isProList = val
        this.changeTag = val.type
        setTimeout(() => {
          this.model.type = val.type
        }, 100)
        this.programModel.link = val.link
        this.programModel.name = val.name
        this.programModel.imageUrl = val.imageUrl
        this.model.programId = val.programId
        this.programIdProps.id = val.programId
        this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl
        this.materialProgram.name = val.name
      }
    },

    //zhw end

    //  ---数据渲染函数---
    // 获取页面id
    getPageId() {
      let id = this.$route.query.id
      if (!id) {
        return
      }
      this.pageId = id
      this.getUserWelcome(id)
    },
    // 切换附加内容
    //改变文本
    changeNone(val) {
      this.webClone = false
      this.changeTag = val
      if (this.imageUrl == '') {
        this.imageUrlFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imageUrlFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      if (this.linkImageUrl == '') {
        this.linkImageUrlFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.linkImageUrlFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.linkImageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
      this.model.type = val
      this.isType = val
    },
    //改变图片
    changeImage(val) {
      this.webClone = false
      this.model.type = val
      this.isType = val
      this.changeTag = val
      if (this.linkImageUrl == '') {
        this.linkImageUrlFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.linkImageUrlFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.linkImageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
    },
    UploadImageSuccess(val) {
      this.imageUrl = val.length == 0 ? '' : val[0].url
      this.isType = 'image'
      this.model.type = 'image'
      if (this.imageUrl == '') {
        this.imageUrlFileList = []
      }
    },
    //改变网址
    changeWeb(val) {
      if (this.imageUrl == '') {
        this.imageUrlFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imageUrlFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      this.model.type = val
      this.isType = val
      this.changeTag = val
      if (this.webClone) {
        this.model.materialList[0].name = this.isWebList.name
        this.model.materialList[0].content = this.isWebList.content
        this.model.materialList[0].link = this.isWebList.link
        if (this.isDtle) {
          this.linkImageUrl = ''
          this.linkImageUrlFileList = []
          this.isDtle = false
        } else {
          this.linkImageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.isWebList.imageUrl,
            name: this.isWebList.name
          }
          this.linkImageUrl = this.linkImageUrlFileList[0].url
        }
      }
    },
    UploadLinkmageSuccess(val) {
      this.linkImageUrl = val.length == 0 ? '' : val[0].url
      this.isType = 'image_text'
      this.model.type = 'image_text'
      if (this.linkImageUrl == '') {
        this.linkImageUrlFileList = []
        // this.isDtle = true
      }
    },
    //改变小程序
    changeApp(val) {
      this.model.type = val
      this.isType = val
      this.changeTag = val
      if (this.imageUrl == '') {
        this.imageUrlFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imageUrlFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      if (this.linkImageUrl == '') {
        this.linkImageUrlFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.linkImageUrlFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.linkImageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
    },
    // 名片
    changeCard(val) {
      this.model.type = val
      this.isType = val
      this.changeTag = val
      if (this.imageUrl == '') {
        this.imageUrlFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imageUrlFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      if (this.linkImageUrl == '') {
        this.linkImageUrlFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.linkImageUrlFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.linkImageUrlFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
    },
    // 抽奖
    changeLottery(val) {
      this.model.type = val
      this.isType = val
    },
    // 附加内容项改变
    attachmentChange(val) {
      console.log('附加内容类型', val)
      if (val == 'text') {
        this.changeNone(val)
      } else if (val == 'image') {
        this.changeImage(val)
      } else if (val == 'image_text') {
        this.changeWeb(val)
      } else if (val == 'program') {
        this.changeApp(val)
      } else if (val == 'business_card') {
        this.changeCard(val)
      } else if (val == 'rolling_lottery') {
        this.changeLottery(val)
      }
    },
    // getSelectProgramItem() {
    //   let program = this.$refs.SelectProgramItem.success()
    //   console.log(program);
    // },
    // 插入表情包
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    // 插入昵称
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.model.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.model.message += myValue
      }
    },
    // 添加成员
    addMember() {
      this.dialogVisible.visible = true
      // this.$nextTick(() => {
      //   this.$refs.department.setCheckedNodes()
      // })
    },
    // 新建保存
    createSumbitAddBtn() {
      console.log('111')
      this.$refs.model.validate(valid => {
        console.log('222')
        if (valid) {
          // 必须选择目标成员
          if (!this.idList.length) {
            this.$message({
              message: '请选择发送目标人员',
              type: 'warning'
            })
            return
          }
          let options = {
            isEnabled: this.model.isEnabled,
            message: this.model.message,
            type: this.changeTag,
            userType: this.model.userType,
            welcomeUserList: this.idList
          }

          // 提交文本
          // 提交图片
          if (this.changeTag == 'image') {
            if (!this.imageUrl) {
              this.$message({
                message: '请上传图片',
                type: 'warning'
              })
              return
            } else {
              if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
                this.imageUrl = this.imageUrl.replace(/https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/, '')
              }
            }

            options.imageUrl = this.imageUrl
          }
          // 提交图文网页
          if (this.changeTag == 'image_text') {
            if (!this.linkImageUrl) {
              this.$message({
                message: '请上传图片',
                type: 'warning'
              })
              return
            } else {
              if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
                this.linkImageUrl = this.linkImageUrl.replace(
                  /https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/,
                  ''
                )
              }
            }
            options.imageUrl = this.linkImageUrl
            options.name = this.model.name
            options.content = this.model.content
            options.link = this.model.link
          }
          // 提交小程序
          if (this.changeTag == 'program') {
            if (!this.programIdProps.id) {
              this.$message.warning('请选择小程序')
              this.getProgarm()
              return
            }
            // let program = this.$refs.SelectProgramItem.success()
            // console.log(program)
            options.programId = this.programIdProps.id
            options.link = this.programModel.link
            options.name = this.programModel.name
            options.imageUrl = this.programModel.imageUrl
            console.log('选择小程序后提交的options', options)
            // this.options.forEach((item) => {
            //   if (item.id == this.model.programId) {
            //     options.programId = item.id
            //     options.link = item.page
            //     options.name = item.name
            //     options.imageUrl = item.logo
            //   }
            // })
          }
          // 提交抽奖
          if (this.changeTag == 'rolling_lottery') {
            if (!this.lotteryDialog.selectedLotteryData.id) {
              this.$message.warning('请选择抽奖')
              return
            }
            options.source = this.lotteryDialog.selectedLotteryData.id
          }
          console.log('提交参数', options)
          // 存在id时进行修改操作
          if (this.pageId) {
            options.id = this.pageId
            options.appId = this.appId
            options.createTime = this.model.createTime
            options.isDeleted = this.model.isDeleted
            options.mediaIdExpireTime = this.model.mediaIdExpireTime
            this.updateUserWelcome(options, res => {
              this.$message.success('修改欢迎语成功')
              this.$router.push('/main/scrm/operation-management/welcomemessage/list')
            })
          } else {
            this.addWelcome(options, res => {
              this.$message.success('新建欢迎语成功')
              this.$openNewPageBack()
            })
          }
        } else {
          return false
        }
      })
    },
    // ---添加发送对象对话框方法 ---
    setMembers(list) {
      console.log('6666666666666666666666666', list)
      this.memberList = list
      if (!this.memberList.length) {
        this.$message({
          message: '请选择发送成员后再提交',
          type: 'warning'
        })
        return
      }
      console.log(this.memberList)
      let idList = []
      let allList = []
      this.memberList.forEach(item => {
        idList.push({ userId: item.id, type: item.type })
        allList.push({ userId: item.id, type: item.type, userName: item.name })
      })
      console.log(idList)
      this.idList = idList
      this.allList = allList
      this.dialogVisible.visible = false
    },
    // 获取小程序信息
    // getProgramInfo() {
    //   console.log(this.model.programId)
    //   this.options.forEach((item) => {
    //     if (item.id == this.model.programId) {
    //       this.programInfoOption = item
    //     }
    //   })
    // },
    // ---添加发送对象对话框方法end ---
    // ---获取数据函数---
    // 新建欢迎语
    addWelcome(options, callback) {
      this.$http.addWelcome(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 修改欢迎语
    updateUserWelcome(options, callback) {
      this.$http.updateUserWelcome(options).then(res => {
        if (callback) {
          callback(res)
        }
      })
    },
    // 获取小程序列表
    // getProgarm() {
    //   this.$http.getProgarm().then((res) => {
    //     this.options = res.data.data
    //     console.log('这是小程序', res.data.data)
    //   })
    // },
    // 获取欢迎语详情
    getUserWelcome(id) {
      this.$http.getUserWelcome({ id }).then(res => {
        console.log('无敌', res)
        this.model = res.data.data
        this.changeTag = res.data.data.type
        this.appId = res.data.data.appId
        this.isType = this.changeTag
        if (this.changeTag == 'image') {
          this.imageUrl = res.data.data.imageUrl
          this.imageUrlFileList = [
            {
              name: 'image',
              url: this.imgHost + this.imageUrl
            }
          ]
          console.log(this.imageUrl)
        }
        if (this.changeTag == 'image_text') {
          this.linkImageUrl = res.data.data.imageUrl
          this.linkImageUrlFileList = [
            {
              name: 'image',
              url: this.imgHost + this.linkImageUrl
            }
          ]
        }
        if (this.changeTag == 'program') {
          this.programModel = {
            name: res.data.data.name,
            link: res.data.data.link,
            imageUrl: res.data.data.imageUrl
          }
          this.programIdProps.id = res.data.data.programId
          this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + res.data.data.imageUrl
          this.materialProgram.name = res.data.data.name
          // this.programIdProps = {
          //   id: res.data.data.programId,
          //   name: res.data.data.name,
          //   logo: res.data.data.imageUrl
          // }
          console.log(this.changeTag, this.programIdProps)
        }
        if (this.changeTag == 'rolling_lottery') {
          this.lotteryDialog.selectedLotteryData = {
            title: res.data.data.name,
            id: res.data.data.source
          }
        }
        res.data.data.welcomeUserList.forEach(item => {
          this.idList.push({ userId: item.userId, type: 0 })
          this.allList.push({ userId: item.userId, type: 0, userName: item.userName || item.deptName })
          this.memberList.push({ id: item.userId, name: item.userName || item.deptName, deptName: item.deptName })
        })
      })
    },
    // 抽奖选项更改
    handleLotterySelectionChange(val) {
      if (val.length > 1) {
        this.$refs.lotteryTable.clearSelection()
        this.$refs.lotteryTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.lotteryDialog.multipleSelection = list
      } else {
        this.lotteryDialog.multipleSelection = val
      }
    },
    clickLotteryRow(row) {
      this.$refs.lotteryTable.toggleRowSelection(row)
    },
    onLotterySizeChange(val) {
      this.lotteryDialog.page.pageSize = val
      this.lotteryDialog.page.pageNum = 1
      this.getLotteryPage()
    },
    onLotteryPageChange(val) {
      this.lotteryDialog.page.pageNum = val
      this.getLotteryPage()
    },
    searchLottery() {
      this.lotteryDialog.page.pageNum = 1
      this.getLotteryPage()
    },
    showLotteryDialog() {
      this.lotteryDialog.page.pageNum = 1
      this.lotteryDialog.page.pageSize = 15
      this.lotteryDialog.multipleSelection = []
      this.lotteryDialog.config.visible = true
      this.getLotteryPage()
    },
    getLotteryPage() {
      let params = {
        pageNum: this.lotteryDialog.page.pageNum,
        pageSize: this.lotteryDialog.page.pageSize,
        title: this.lotteryDialog.search.title
      }
      this.$http.getRollingLotteryPage(params).then(res => {
        this.lotteryDialog.tableData = res.data.data.list
        this.lotteryDialog.page.total = res.data.data.total
      })
    },
    chooseLottery() {
      if (this.lotteryDialog.multipleSelection.length > 0) {
        let data = this.lotteryDialog.multipleSelection[0]
        let obj = {
          title: data.title,
          id: data.id
        }
        this.lotteryDialog.selectedLotteryData = obj
        this.lotteryDialog.config.visible = false
      } else {
        this.$message.warning('请选择抽奖')
      }
    },
    // 获取可选附加内容列表
    getAttachmentList() {
      this.$http.getWelcomeAttachmentList().then(res => {
        this.attachmentList = res.data.data
      })
    }
  },

  filters: {
    limitType(val) {
      switch (val) {
        case 'total':
          return '每人可抽N次'
        case 'day':
          return '每人每天可抽N次'
      }
    },
    statusType(val) {
      switch (val) {
        case 'not-start':
          return '未开始'
        case 'ongoing':
          return '进行中'
        case 'stop':
          return '已停止'
        case 'end':
          return '已结束'
      }
    },
    formatterTime(time) {
      if (time) {
        return time.slice(0, time.length - 3)
      }
    }
  },
  created() {
    //  获取页面id
    this.getPageId()
    // 获取小程序
    this.getProgarm()
    // 获取企业成员树
    // this.getMembers()
    this.getAttachmentList()
  }
  // watch:{
  //     'programIdProps.id'(newValue,oldValue){
  //       console.log(newValue)
  //     }
  // }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}

.memberDetails {
  width: 100%;
  height: 100%;
}
.main_content {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  min-height: calc(100% - 56px);
  box-sizing: border-box;
  .main_box {
    width: 800px;
    .welcome-buttom {
      display: flex;
      .welcome-emjoi {
        display: flex;
        align-items: center;
        margin-right: auto;
      }
    }
    .tagname-form {
      .tagName {
        display: inline-block;
        border: 1px solid #546e95;
        padding: 0 5px;
        margin: 8px 8px 7px 0;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
        color: #546e95;
        i {
          color: #546e95;
        }
      }
    }
    .picture_tips {
      font-size: 14px;
      color: #606266;
    }
  }
}
.dialogVisibleTree {
  .footer_btn {
    display: flex;
    justify-content: flex-end;
  }
}
.programInfo {
  width: 217px;
  .programInfoContent {
    height: 36px;
    display: flex;
    .name {
      margin-left: 5px;
      line-height: 36px;
      color: #606266;
      font-size: 14px;
    }
  }
}
.program-mater-div {
  margin-bottom: 10px;
  border-radius: 5px;
  height: 56px;
  border: 1px solid #ebeef5;
  width: 218px;
  margin-left: 90px;
  line-height: 56px;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  user-select: none;
  cursor: pointer;
  span {
    color: #606266;
    font-size: 14px;
  }
}
.lottery-config {
  .select-box {
    position: relative;
    color: #606266;
    width: 217px;
    .select-content {
      border: 1px solid #e7eaec;
      border-radius: 4px;
      padding: 7px 10px;
      display: flex;
      align-items: center;
      line-height: 20px;
      cursor: pointer;
      .name {
        width: 175px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
        margin-right: 5px;
      }
    }
  }
}
.selection-dialog {
  .dialog-btns {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>
