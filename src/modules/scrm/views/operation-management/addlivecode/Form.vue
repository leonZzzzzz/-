<template>
  <div class="grouplive-form">
    <QcNavigationPage class="prodocu-page" content="创建活码"  full :footerBlockH="45">
      <div class="groupname-form">
        <el-form label-position="right" label-width="100px">
          <div class="modular">
            <div class="title">
              <p>基础信息</p>
            </div>
            <el-form-item label="活码名称" :required="true">
              <el-input
                type="text"
                maxlength="32"
                show-word-limit
                size="small"
                placeholder="最多可输入32字"
                style="width: 800px"
                v-model="model.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="活码类型" :required="true">
              <el-radio-group v-model="model.type" @change="onRadioChange">
                <el-radio :label="1">单人</el-radio>
                <el-radio :label="2">多人</el-radio>
                <el-radio :label="3">批量单人</el-radio>
              </el-radio-group>
              <div>
                <el-alert
                  title="添加后类型不可修改"
                  type="warning"
                  show-icon
                  :closable="false"
                  style="line-height: 20px; width: 350px"
                >
                </el-alert>
              </div>
            </el-form-item>
            <!-- <el-form-item label="类型" :required="true">
              <el-radio-group>
                <el-radio>一人一码</el-radio>
                <el-radio>多人多码</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="关联人员" :required="true">
              <div class="tag-item" v-if="form.momentsUsers.length != 0">
                <!-- <span class="tag-item-content" v-for="(item, index) in form.momentsUsers" :key="index">
                  <i class="item-icon el-icon-s-custom"></i>
                  {{ item.name }}
                </span> -->
                <Tag v-for="(item, index) in form.momentsUsers" :key="index">{{ item.name }}</Tag>
              </div>
              <div class="add-title">
                <el-button icon="el-icon-plus" @click="addPeople" plain size="small">添加</el-button>
                (即该活码可以添加的人员，多人随机分配)
              </div>
            </el-form-item>
            <el-form-item label="行为标签">
              <div class="remark_content">
                <div class="remark_content_btns">
                  <el-button
                    icon="el-icon-plus"
                    @click=";(BehaviorLabelDialogVisible = true), (behaviorLabelType = true)"
                    plain
                    size="mini"
                    circle
                  ></el-button>
                </div>
                <!-- <el-form class="none-form" v-if="tagNameList.length == 0">
                  <el-form-item class="none-tag">
                    暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
                  </el-form-item>
                </el-form> -->
                <div :class="['remark_content_box', remarkContentBoxShowFlag ? 'show' : '']">
                  <div ref="remark_content_box">
                    <div v-for="(item, index) in tagNameList" :key="index" class="remark_tag_box">
                      <div class="remark_tagGroupTitle">{{ item.name }}</div>
                      <div class="remark_tagChange">
                        <div class="remark_tagChange_content">
                          <div
                            @click="changeTags(items.tagId, items.id, items.name)"
                            v-for="(items, indexs) in item.tagList"
                            :key="indexs"
                            :class="['item', spanIndex.includes(items.id) ? 'active' : '']"
                          >
                            {{ items.name }}
                          </div>
                        </div>
                      </div>
                      <div class="remark_tag_box_btn">
                        <el-button icon="el-icon-edit" @click="updateBehav(index)" plain size="mini" circle></el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="showmore" v-if="remarkContentBoxHeight > 153">
                  <el-button type="text" @click="remarkContentBoxShowFlag = !remarkContentBoxShowFlag"
                    >{{ remarkContentBoxShowFlag ? '收起' : '展开'
                    }}<i :class="[remarkContentBoxShowFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i
                  ></el-button>
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="自定义logo">
              <div class="logo-div">
                <div class="logo-model">
                  <img :src="imgHost + '/attachments/scrm/f6b7cbbcba0c4ccbbac49d13b82573e5.png'" alt="" />
                  <div class="logo-show" v-if="this.model.customizedLogo">
                    <img :src="imgHost + this.model.customizedLogo" alt="" />
                  </div>
                </div>
                <div class="logo-upload">
                  <upload-image-vmodel :width="100" :height="100" v-model="model.customizedLogo"> </upload-image-vmodel>
                
                </div>
              </div>
              <div class="logo-title" style="color: #909399; margin-left: 5px">
                推荐像素80*80，如果上传，将会替换活码中间的图片
              </div>
            </el-form-item>
            <el-form-item label="添加时是否无需验证" label-width="200" :required="true">
              <el-switch v-model="model.isVerify" active-color="#294A7B" inactive-color="#DCDFE6"> </el-switch>
            </el-form-item> -->
          </div>
          <div class="modular">
            <div class="title">
              <p>设置欢迎语</p>
            </div>
            <div class="tips" style="margin-bottom: 20px; width: 900px">
              <el-alert
                title="因企业微信限制，若使用成员已在「企业微信后台」配置了欢迎语，这里的欢迎语将不会生效"
                type="warning"
                show-icon
                :closable="false"
                style="line-height: 30px"
              >
              </el-alert>
            </div>
            <el-form-item label="设置欢迎语">
              <el-radio-group v-model="model.sendWelcomeType">
                <el-radio :label="1">渠道欢迎语</el-radio>
                <el-radio :label="0">默认欢迎语</el-radio>
                <el-radio :label="-1">不发送欢迎语</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="欢迎语" v-show="model.sendWelcomeType == 1">
              <el-input
                id="textInput"
                class="record_input"
                type="textarea"
                style="width: 800px"
                maxlength="2000"
                show-word-limit
                size="small"
                placeholder="最多可输入2000字"
                height="400px"
                :rows="6"
                resize="none"
                v-model="model.message"
              >
              </el-input>
              <div class="welcome-buttom">
                <div>
                  <emotion @selectedEmotion="_selectedEmotion"></emotion>
                </div>
                <div>
                  <span class="welcome-firstname">插入昵称</span>
                  <el-button type="primary" @click="insert('<客户昵称>')" size="mini" plain>客户昵称</el-button>
                  <el-button type="primary" @click="insert('<成员昵称>')" size="mini" plain>成员昵称</el-button>
                  <!-- <span class="welcome-customername" >客户昵称</span>
                  <span class="welcome-salename" >客户昵称</span> -->
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="附加内容" :required="true" v-show="model.sendWelcomeType == 1">
              <el-radio-group v-model="model.materialList[0].type">
                <el-radio label="text" @change="changeNone">无</el-radio>
                <el-radio label="image" @change="changeImage">图片</el-radio>
                <el-radio label="image_text" @change="changeWeb">网页</el-radio>
                <el-radio label="program" @change="changeApp">小程序</el-radio>
                <el-radio label="business_card" @change="changeCard">名片</el-radio>
                <el-radio label="rolling_lottery" @change="changeLottery">抽奖</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="附加内容" :required="true" v-show="model.sendWelcomeType == 1">
              <el-radio-group v-model="model.materialList[0].type">
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

            <div class="image-div" v-if="model.materialList[0].type === 'image'" v-show="model.sendWelcomeType == 1">
              <!-- <QcImageUpload width="100px" height="100px" class="image-upload" v-model="imageUrl"> </QcImageUpload>
              <div class="tips_words">上传图片</div> -->
              <div class="tips_words">
                <UploadImage :fileList="imgFileList" @success="imageSuccess"></UploadImage>
              </div>
            </div>
            <div class="web-div" v-if="model.materialList[0].type === 'image_text'" v-show="model.sendWelcomeType == 1">
              <el-form-item :required="true" label="链接标题">
                <el-input maxlength="64" placeholder="最多可输入64个字" v-model="model.materialList[0].name"></el-input>
              </el-form-item>
              <el-form-item label="链接简介">
                <el-input placeholder="最多可输入32个字" v-model="model.materialList[0].content"></el-input>
              </el-form-item>
              <el-form-item :required="true" label="链接地址">
                <el-input placeholder="请输入链接地址" v-model="model.materialList[0].link"></el-input>
              </el-form-item>
              <el-form-item :required="true" label="封面图">
                <!-- <QcImageUpload width="100px" height="100px" v-model="linkImageUrl"> </QcImageUpload>
                <div class="tips_words">上传图片</div> -->
                <UploadImage :fileList="imgTextFileList" @success="imageTextSuccess"></UploadImage>
              </el-form-item>
            </div>
            <div class="app-div" v-if="model.materialList[0].type === 'program'" v-show="model.sendWelcomeType == 1">
              <!-- <SelectProgramItem ref="SelectProgramItem" :programIdProps="model.programAppId"></SelectProgramItem> -->
              <el-form-item label="配置小程序" :required="true">
                <el-select
                  placeholder="请选择"
                  v-model="model.materialList[0].programId"
                  @change="changeSelect()"
                  @clear="clearSelect()"
                  clearable
                >
                  <el-option
                    class="app-select"
                    v-for="(item, index) in options"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <div class="progarm-div" v-if="materialProgram.url && materialProgram.name">
                  <img :src="materialProgram.url" style="width: 36px; height: 36px; border-radius: 50%; padding: 10px" />
                  <span>{{ materialProgram.name }}</span>
                </div>
              </el-form-item>
              <!-- <SelectProgramItem ref="SelectProgramItem"></SelectProgramItem> -->
              <!-- <SelectProgramItem ref="SelectProgramItem" :programProps="programIdProps"></SelectProgramItem> -->
            </div>
            <el-form-item
              v-if="
                model.materialList[0].type !== 'text' &&
                model.materialList[0].type !== 'business_card' &&
                model.materialList[0].type !== 'rolling_lottery' &&
                model.materialList[0].type !== 'image' &&
                model.materialList[0].type !== 'program'
              "
            >
              <material-btn :isType="isType" @success="materialSuccess"></material-btn>
            </el-form-item>
            <el-form-item
              label="选择抽奖"
              :required="true"
              v-if="model.materialList[0].type === 'rolling_lottery'"
              v-show="model.sendWelcomeType == 1"
            >
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

            <!-- <el-form-item label="扫码行为标签">
              <div class="info-itemtag-div">
                <span class="edit-tag" @click="openBehavior()" v-if="listSpanName.length != 0">编辑</span>
                <span class="info-itemtag" v-for="(item, EnertTag) in listSpanName" :key="EnertTag">
                  {{ item.name || '--' }}
                </span>
              </div>
              <div>
                <el-button type="text" @click="openBehavior()" v-if="listSpanName.length == 0">添加</el-button>
                <div class="add-title">(即该活码可以添加的客户打上对应的标签)</div>
              </div>
            </el-form-item> -->
          </div>
          <div class="modular">
            <div class="title">
              <p>功能设置</p>
            </div>
            <el-form-item label="二维码预览">
              <div class="logo-div">
                <div class="logo-model">
                  <img :src="imgHost + '/attachments/scrm/f6b7cbbcba0c4ccbbac49d13b82573e5.png'" alt="" />
                  <div class="logo-show" v-if="this.model.customizedLogo">
                    <img :src="imgHost + this.model.customizedLogo" alt="" />
                  </div>
                </div>
                <div class="logo-upload">
                  <upload-image-vmodel :width="100" :height="100" v-model="model.customizedLogo"> </upload-image-vmodel>
                </div>
              </div>
              <div class="logo-title" style="color: #909399; margin-left: 5px">
                *此二维码只是样式预览效果,请勿直接使用
                <!-- 推荐像素80*80，如果上传，将会替换活码中间的图片 -->
              </div>
            </el-form-item>
            <el-form-item label="自动通过好友" label-width="200" :required="true">
              <el-switch v-model="model.isVerify" active-color="#294A7B" inactive-color="#DCDFE6"> </el-switch>
            </el-form-item>
            <!-- <el-form-item>
              <div style="margin-top: 20px">
                <el-button @click="cancelLiveCode">取消</el-button>
                <el-button type="primary" @click="sumbitLivecode" :disabled="isSuccess">保存</el-button>
              </div>
            </el-form-item> -->
          </div>
        </el-form>
        
        <com-dialog :config="addTagDialog.config" @closeDialog="closeAdd" class="editRecordCom">
          <div class="remark-content">
            <el-form class="none-form" v-if="tagNameList.length == 0">
              <el-form-item class="none-tag">
                暂无创建的行为标签，<el-button type="text" @click="nextRouter">请先前往创建&nbsp;&gt;</el-button>
              </el-form-item>
            </el-form>

            <div class="selectGroup" v-if="tagNameList.length != 0">
              <div class="leftTitle">
                <span>已选</span>
              </div>
              <div class="rightTags">
                <el-tag
                  v-for="(tag, index) in spanName"
                  :key="index"
                  closable
                  type="info"
                  :disable-transitions="true"
                  @close="closeTagList(tag, index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div v-for="(item, index) in tagNameList" :key="index">
              <div class="tagGroupTitle">{{ item.name }}</div>
              <div class="tagChange">
                <div
                  @click="changeTags(items.tagId, items.id, items.name)"
                  v-for="(items, indexs) in item.tagList"
                  :key="indexs"
                  :class="{ active: spanIndex.includes(items.id) }"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
            <div class="Btn-two">
              <el-row :gutter="24">
                <el-col :span="7">&nbsp; </el-col>
                <el-col :span="7">&nbsp;</el-col>
                <el-col :span="5">
                  <el-button type="info" @click="closeTagDialog()">取消</el-button>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </com-dialog>
      </div>
      <div slot="footer">
        <el-button @click="cancelLiveCode">取消</el-button>
        <el-button type="primary" @click="sumbitLivecode" :disabled="isSuccess">保存</el-button>
      </div>
    </QcNavigationPage>
    <!-- 多人或批量单人的树形选择组件 -->
    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>
    <!-- <behavior-dialog
      :config="behaviorDialog.config"
      @closeDialog="behaviorDialog.config.visible = false"
      @handleConfirm="handleBehavior"
    >
    </behavior-dialog> -->
    <BehaviorLabel
      :dialogVisible="BehaviorLabelDialogVisible"
      :fileList="updateBehavList"
      :type="behaviorLabelType"
      @closeDialog="BehaviorLabelDialogVisible = false"
      @reloadData="getEnterList"
    ></BehaviorLabel>
    <!-- 单人的树形选择组件 -->
    <department-single-dialog
      :config="departmentSingleDialog.config"
      @closeDialog="departmentSingleDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-single-dialog>
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
import api from '../../../api/operation-management'
import Emotion from '../../../components/common/Emotion'
import BehaviorLabel from '../../../components/components/BehaviorLabel'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
import DepartmentSingleDialog from '../../../components/components/MemberTreeSingleDialog'
import UploadImage from '../../../components/components/UploadImage'
import Tag from '../../../components/components/Tag'
import UploadImageVmodel from '../../../components/components/UploadImageVmodel'
import ComPagination from '../../../components/common/ComPagination'
import MaterialBtn from '../../../components/material/MaterialBtn'
export default {
  components: {
    ComDialog,
    Emotion,
    DepartmentDialog,
    BehaviorLabel,
    DepartmentSingleDialog,
    UploadImage,
    Tag,
    UploadImageVmodel,
    ComPagination,
    MaterialBtn
  },
  data() {
    return {
      // changeTag: 'text',
      // behaviorDialog: {+

      //   config: {
      //     width: '800px',
      //     title: '选择关联人员',
      //     visible: false
      //   }
      // },
      remarkContentBoxHeight: 0,
      remarkContentBoxShowFlag: false,
      textarea: '',
      val: '',
      isSuccess: false,
      addTagDialog: {
        config: {
          width: '600px',
          title: '关联行为标签',
          visible: false
        }
      },
      updateBehavList: {},
      BehaviorLabelDialogVisible: false,
      behaviorLabelType: true,
      options: [], //小程序选项
      model: {
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: 'text',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: ''
          }
        ],
        mode: 1,
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: '',
        state: 'channel',
        sendWelcomeType: 1,
        isVerify: true,
        customizedLogo: ''
      },
      imageUrl: '',
      linkImageUrl: '',
      departmentDialog: {
        // 多人选择树
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      form: {
        momentsUsers: [] // 同步人员列表{cropUserId, userId, name, mobile, position}
      },
      tagList: [],
      spanName: [],
      spanIndex: [], //点击标签颜色会变得数组
      tagNameList: [], //获取编辑整个分组的信息
      newArrsCustomer: [],
      sumbitSpanName: [],
      listSpanName: [],
      departmentSingleDialog: {
        // 单人选择树
        config: {
          width: '800px',
          title: '选择关联人员',
          visible: false
        }
      },
      //zhw新增

      imgFileList: [], // 图片上传组件的list
      imgTextFileList: [], //图文图片上传组件的list
      webClone: false, // 从素材库中选择的是不是网页
      proClone: false, //从素材库中选择的是不是小程序
      isWebList: [],
      isProList: [],
      isType: 'text', // 传给组件的类型
      //选择后得小程序
      materialProgram: {
        url: '',
        name: ''
      },
      isDtle: false, //如果删除了的话
      programModel: {
        name: '',
        link: '',
        imageUrl: ''
      },
      imgLogoList: [], //存储logo的上传列表

      //zhw新增结束
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
      naviagetionPageWidth: 0,
      attachmentList: [] // 可选附加内容列表
    }
  },
  methods: {
    updateBehav(index) {
      this.BehaviorLabelDialogVisible = true
      this.behaviorLabelType = false
      this.updateBehavList = this.tagNameList[index]
      console.log(this.tagNameList[index])
    },
    //改变无
    changeNone(val) {
      this.webClone = false
      if (this.imageUrl == '') {
        this.imgFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imgFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      if (this.linkImageUrl == '') {
        this.imgTextFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgTextFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.imgTextFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
      this.model.materialList[0].type = val
      this.isType = val
    },
    //改变图片
    changeImage(val) {
      this.webClone = false
      this.model.materialList[0].type = val
      this.isType = val
      if (this.linkImageUrl == '') {
        this.imgTextFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgTextFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.imgTextFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
    },
    //改变网址
    changeWeb(val) {
      if (this.imageUrl == '') {
        this.imgFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imgFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      this.isType = val
      this.model.materialList[0].type = val
      if (this.webClone) {
        this.model.materialList[0].name = this.isWebList.name
        this.model.materialList[0].content = this.isWebList.content
        this.model.materialList[0].link = this.isWebList.link
        if (this.isDtle) {
          this.linkImageUrl = ''
          this.imgTextFileList = []
          this.isDtle = false
        } else {
          this.imgTextFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.isWebList.imageUrl,
            name: this.isWebList.name
          }
          this.linkImageUrl = this.imgTextFileList[0].url
        }
      }
    },
    //改变小程序
    changeApp(val) {
      this.webClone = false
      if (this.imageUrl == '') {
        this.imgFileList = []
      } else {
        if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgFileList[0] = {
            url: this.imageUrl,
            status: 'success'
          }
        } else {
          this.imgFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.imageUrl,
            status: 'success'
          }
        }
      }
      if (this.linkImageUrl == '') {
        this.imgTextFileList = []
      } else {
        if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
          this.imgTextFileList[0] = {
            url: this.linkImageUrl,
            status: 'success'
          }
        } else {
          this.imgTextFileList[0] = {
            url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + this.linkImageUrl,
            status: 'success'
          }
        }
      }
      this.isType = val
      this.model.materialList[0].type = val
      if (this.proClone) {
        this.model.materialList[0].programId = this.isProList.programId
        this.model.materialList[0].link = this.isProList.link
        this.model.materialList[0].name = this.isProList.name
        this.model.materialList[0].imageUrl = this.isProList.imageUrl
      }
    },
    // 改变名片
    changeCard(val) {
      this.model.materialList[0].type = val
      this.isType = val
    },
    // 改变抽奖
    changeLottery(val) {
      this.model.materialList[0].type = val
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
    //点击扫码行为添加按钮
    addScanCode() {
      this.addTagDialog.config.visible = true
    },
    //点击前往创建行为标签页面
    nextRouter() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    closeAdd() {
      this.addTagDialog.config.visible = false
    },
    imageSuccess(val) {
      this.imageUrl = val[0] ? val[0].url : ''
      if (this.imageUrl == '') {
        this.imgFileList = []
      }
    },
    imageTextSuccess(val) {
      this.linkImageUrl = val[0] ? val[0].url : ''
      if (this.linkImageUrl == '') {
        this.imgTextFileList = []
        // this.isDtle = true
      }
      console.log('数据', this.linkImageUrl)
      console.log('显示', this.imgTextFileList)
    },
    //关闭关联标签弹
    closeTagDialog() {
      this.spanName = []
      this.spanIndex = []
      this.sumbitSpanName = []
      this.addTagDialog.config.visible = false
    },
    //提交关联标签按钮
    sumbitTagDialog() {
      this.sumbitSpanName = []
      this.spanName.forEach(item => {
        this.sumbitSpanName.push(item)
      })
      this.addTagDialog.config.visible = false
    },
    //点击编辑打开弹窗
    editTagDialog() {
      this.addTagDialog.config.visible = true
    },
    editEnterTag() {
      this.addTagDialog.config.visible = true
    },
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
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.model.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    //获取小程序
    getProgarm() {
      this.options = []
      api.getProgarm().then(res => {
        this.options = res.data.data
      })
      this.getMaterialPage()
    },
    changeSelect() {
      this.options.forEach(item => {
        if (item.id == this.model.materialList[0].programId) {
          console.log(item)
          // this.model.materialList[0].link = item.page
          // this.model.materialList[0].name = item.name
          if (item.page) {
            this.programModel.link = item.page
          } else {
            this.programModel.link = item.link
          }

          this.programModel.name = item.name
          this.materialProgram.name = item.name
          if (item.logo) {
            // this.model.materialList[0].imageUrl = item.logo
            this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + item.logo
            this.programModel.imageUrl = item.logo
          } else {
            // this.model.materialList[0].imageUrl = item.imageUrl
            this.programModel.imageUrl = item.imageUrl
            this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + item.imageUrl
          }

          console.log(this.materialProgram)
        }
      })
    },
    handleConfirm(list) {
      // this.form.momentsUsers = []
      this.form.momentsUsers = list
      if (this.model.type === 1) {
        // 选择单人
        this.departmentSingleDialog.config.visible = false
      } else {
        // 选择多人或批量单人
        this.departmentDialog.config.visible = false
      }
      console.log(this.form.momentsUsers)
    },
    //关联人员添加按钮
    addPeople() {
      if (this.model.type === 1) {
        // 选择单人
        this.departmentSingleDialog.config.visible = true
      } else {
        // 选择多人或批量单人
        this.departmentDialog.config.visible = true
      }
    },
    //保存按钮
    sumbitLivecode() {
      // let program = this.$refs.SelectProgramItem.success()
      // this.model.materialList[0].programId = program.id
      if (this.model.name == '') {
        this.$message.warning('请填写活码名称')
      } else if (this.model.message.length > 2000) {
        this.$message.warning('欢迎语不能超过2000个字')
      } else if (this.form.momentsUsers.length == 0) {
        this.$message.warning('请选择关联人员')
      } else {
        if (this.model.materialList[0].type == 'image') {
          if (this.imageUrl == '') {
            this.$message.warning('请上传图片')
            return
          } else {
            if (this.imageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
              this.imageUrl = this.imageUrl.replace(/https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/, '')
            }
            this.model.materialList[0].imageUrl = this.imageUrl
            this.model.materialList[0].programId = ''
            this.model.materialList[0].link = ''
            this.model.materialList[0].content = ''
            this.model.materialList[0].name = ''
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            this.programModel.link = ''
            this.programModel.name = ''
            this.programModel.imageUrl = ''
            //填写增加语句
            this.addCode()
          }
        } else if (this.model.materialList[0].type == 'image_text') {
          if (this.model.name == '') {
            this.$message.warning('请填写链接标题')
          } else if (this.model.materialList[0].link == '') {
            this.$message.warning('请填写链接地址')
          }
          // else if (this.model.materialList[0].content == '') {
          //   this.$message.warning('请填写链接简介')
          // }
          else if (this.linkImageUrl == '') {
            this.$message.warning('请上传图片')
          } else {
            // 填写增加语句
            if (this.linkImageUrl.includes('https://athena-1255600302.cos.ap-guangzhou.myqcloud.com')) {
              this.linkImageUrl = this.linkImageUrl.replace(
                /https:\/\/athena-1255600302.cos.ap-guangzhou.myqcloud.com/,
                ''
              )
            }
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            this.model.materialList[0].imageUrl = this.linkImageUrl
            this.model.materialList[0].programId = ''
            this.programModel.link = ''
            this.programModel.name = ''
            this.programModel.imageUrl = ''
            this.addCode()
          }
        } else if (this.model.materialList[0].type == 'program') {
          if (this.model.materialList[0].programId == '') {
            this.$message.warning('请选择小程序')
          } else {
            //填写增加语句
            this.model.materialList[0].content = ''
            this.model.materialList[0].videoUrl = ''
            this.model.materialList[0].file = ''
            this.model.materialList[0].imageUrl = this.programModel.imageUrl
            this.model.materialList[0].link = this.programModel.link
            this.model.materialList[0].name = this.programModel.name
            console.log(this.model.materialList[0])
            this.addCode()
          }
        } else if (this.model.materialList[0].type == 'business_card') {
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].imageUrl = ''
          console.log('名片类型')
          this.addCode()
        } else if (this.model.materialList[0].type == 'rolling_lottery') {
          if (!this.lotteryDialog.selectedLotteryData.id) {
            this.$message.warning('请选择抽奖')
            return
          }
          this.model.materialList[0].source = this.lotteryDialog.selectedLotteryData.id
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].imageUrl = ''
          console.log('抽奖类型', this.model)
          this.addCode()
        } else {
          //如果是文字类型的话
          //填写增加语句
          this.model.materialList[0].programId = ''
          this.model.materialList[0].link = ''
          this.model.materialList[0].content = ''
          this.model.materialList[0].name = ''
          this.model.materialList[0].videoUrl = ''
          this.model.materialList[0].file = ''
          this.model.materialList[0].imageUrl = ''
          console.log('文本类型')
          this.addCode()
          // console.log(this.model)
        }
      }
    },
    //取消
    cancelLiveCode() {
      this.model = {
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: 'text',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: ''
          }
        ],
        mode: 1,
        behaviorTagList: [],
        type: 1,
        userList: [],
        name: '',
        message: ''
      }
      this.form.momentsUsers = []
      this.imageUrl = ''
      this.linkImageUrl = ''
      this.spanIndex = []
      this.spanName = []
      this.sumbitSpanName = []
      this.model.userList = []
      this.$openNewPageBack()
    },
    addCode() {
      this.isSuccess = true
      this.model.userList = []
      this.model.behaviorTagList = []
      this.form.momentsUsers.forEach(item => {
        this.model.userList.push({ userId: item.id, wxUserId: item.userId })
      })
      this.spanIndex.forEach(item => {
        this.model.behaviorTagList.push({ id: item })
      })
      // if (this.model.type == 3) {
      // }

      api.addLiveCode(this.model).then(res => {
        console.log('成功失败返回的res', res)
        if (res.data.code == 20000) {
          console.log('如果成功灰烬这里')
          this.cancelLiveCode()
          this.$message.success('添加成功')
          this.$router.push('/main/scrm/operation-management/addlivecode/list')
          this.isSuccess = false
        } else {
          console.log('如果失败灰烬这里', res.data.code)
          this.$message.warning(res.data.message)
          this.isSuccess = false
        }
      })
    },
    closeTagList(tag, index) {
      this.spanName.splice(index, 1)
      this.spanIndex.splice(index, 1)
      console.log(this.spanIndex)
    },
    getEnterList() {
      api.getBehaviorPages().then(res => {
        let list = res.data.data
        this.tagNameList = res.data.data
        list.forEach(item => {
          this.tagList.push(item.tagList)
        })
      })
    },
    changeTags(tagId, id, name) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
      }
      // console.log(this.spanIndex)
    },
    goBack() {
      this.$openNewPageBack()
    },
    getRemarkContentBoxHeight() {
      let height = this.$refs.remark_content_box.offsetHeight
      // console.log(height)
      this.remarkContentBoxHeight = height
    },
    // 活码类型改变
    onRadioChange(val) {
      this.form.momentsUsers = []
    },

    imageLogoSuccess(val) {
      this.model.customizedLogo = val[0] ? val[0].url : ''
    },
    // zhw添加的

    //清除选择项
    clearSelect() {
      this.materialProgram = {
        url: '',
        name: ''
      }
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
          this.options.push(item)
        })

        console.log(this.options)
      })
    },
    materialSuccess(val) {
      this.model.materialList[0].type = ''
      this.isType = val.type
      if (val.type == 'image') {
        setTimeout(() => {
          this.model.materialList[0].type = 'image'
        }, 100)
        //负责显示的
        this.imgFileList[0] = {
          url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl,
          name: val.name
        }

        //this.imageUrl 是配合上传的
        this.imageUrl = this.imgFileList[0].url

        console.log('从素材库中选择的图片', this.imageUrl)
      } else if (val.type == 'image_text' || val.type == 'numerous_image_text') {
        this.webClone = true
        this.isWebList = val
        this.imgTextFileList = []
        setTimeout(() => {
          this.model.materialList[0].type = 'image_text'
        }, 100)
        this.model.materialList[0].name = val.name
        this.model.materialList[0].content = val.content
        this.model.materialList[0].link = val.link
        this.imgTextFileList[0] = {
          url: 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl,
          name: val.name
        }
        this.linkImageUrl = this.imgTextFileList[0].url
        if (this.linkImageUrl) {
          setTimeout(() => {
            console.log('定时器获取的', this.linkImageUrl)
          }, 0)
        }
        console.log('这是获取到的图文链接的链接', this.linkImageUrl)
        console.log('这是获取到的从素材库中选择的图片', this.isWebList)
      } else if (val.type == 'program') {
        this.proClone = true
        this.isProList = val
        setTimeout(() => {
          this.model.materialList[0].type = 'program'
        }, 100)
        this.model.materialList[0].programId = val.programId
        this.programModel.link = val.link
        this.programModel.name = val.name
        this.programModel.imageUrl = val.imageUrl
        // this.model.materialList[0].link = val.link
        // this.model.materialList[0].name = val.name
        // this.model.materialList[0].imageUrl = val.imageUrl
        this.materialProgram.url = 'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com' + val.imageUrl
        this.materialProgram.name = val.name
      }
    },

    // zhw添加结束的

    // openBehavior() {
    //   this.behaviorDialog.config.visible = true
    // },
    // handleBehavior(list) {
    //   this.listSpanName = list
    //   this.behaviorDialog.config.visible = false
    // }
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
      this.$http.getLiveCodeAttachmentList().then(res => {
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
    this.getProgarm()
    this.getEnterList()
    this.getAttachmentList()
  },
  mounted() {
    if (this.$refs.naviagetionPage) {
        this.naviagetionPageWidth = this.$refs.naviagetionPage.offsetWidth + 'px'
      }
  },
  updated() {
    this.$nextTick(() => {
      this.getRemarkContentBoxHeight()
    })
  }
}
</script>
<style lang="scss" scoped>
.grouplive-form {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .groupname-form {
    .record_input {
      width: 500px;
    }
    .welcome-buttom {
      width: 800px;
      height: 40px;
      // border: 1px solid red;
      display: flex;
      justify-content: space-between;

      .welcome-div {
        margin-top: 10px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .welcome-customername {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
        .welcome-salename {
          padding: 5px;
          border: 1px solid #294a7b;
          color: #294a7b;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
        }
      }
    }
  }
}
.grouplive-form ::v-deep .naviagetion-page {
  background: transparent !important;
  &__header {
    padding: 0;
  }
  &__body {
    padding: 20px 0;
  }
}

.image-div {
  .image-upload {
    margin-left: 100px;
  }
  .tips_words {
    margin-left: 100px;
    margin-bottom: 20px;
    font-size: 14px;
    color: darkgrey;
    margin-top: 10px;
  }
}
.web-div {
  width: 900px;
  .tips_words {
    margin-left: 20px;
    font-size: 14px;
    color: darkgrey;
  }
}
// .app-div {
//   .app-select {
//     width: 500px;
//   }
// }

.el-select-dropdown {
  width: 100%;
}

.add-title {
  color: darkgrey;
  font-size: 14px;
}
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;
    font-size: 14px;
  }
}
.none-tag {
  text-align: center;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  margin-right: 10px;
  // margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}
.edit-tag {
  display: inline;
  color: #294a7b;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 13px;
  cursor: pointer;
}
.tag-item {
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  line-height: 14px;
  border-radius: 3px;
  .item-icon {
    color: #294a7b;
  }
  span {
    border: 1px solid #dcdfe6;
    padding: 5px;
    cursor: pointer;
    margin: 8px 8px 7px 0;
    border-radius: 3px;
  }
}
.welcome-emjoi {
  margin-top: 10px;
}
.remark-content {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
    // border: 1px solid red;
    .leftTitle {
      display: inline;
      span {
        display: inline-block;
        margin-top: 5px;
        // border: 1px solid red;
      }
    }
    .rightTags {
      display: inline;

      .el-tag {
        margin-left: 10px;
        margin-top: 5px;
      }
    }
  }
}
.remark_content_box {
  height: 153px;
  overflow: hidden;
  &.show {
    height: auto;
    overflow: none;
  }
}

.tagGroupTitle {
  padding: 20px 0;
}
.tagChange {
  // border: 1px solid #ccc;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  div {
    font-size: 12px;
    margin: 10px 10px 10px 0;
    padding: 8px 20px;
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 5px;
    display: inline-block;
    border-color: #e9e9eb;
    cursor: pointer;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  padding: 5px 20px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}
.info-itemtag-div {
  width: 500px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

// fo
.title {
  color: #606266;
  font-size: 16px;
  padding-bottom: 20px;
  p {
    padding: 10px 0;
    position: relative;
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
      left: -20px;
    }
  }
}
.itemtag_content {
  margin-top: 10px;
}
.remark_content {
  padding: 50px 18px 30px 20px;
  width: 800px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  position: relative;
  .remark_content_btns {
    position: absolute;
    top: 4px;
    right: 18px;
  }
  .remark_tag_box {
    display: flex;
    // margin-bottom: 10px;
    color: #606266;
    position: relative;
    .remark_tagGroupTitle {
      width: 72px;
      margin-right: 20px;
      text-align: left;
      line-height: 30px;
    }
    .remark_tagChange {
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      flex: 1;
      .remark_tagChange_content {
        display: flex;
        flex-wrap: wrap;
        padding-right: 46px;
        .item {
          margin-bottom: 10px;
          cursor: pointer;
          padding: 5px;
          background-color: #fff;
          border-radius: 4px;
          height: 20px;
          line-height: 20px;
          margin-right: 10px;
        }
      }
    }
    .remark_tag_box_btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .showmore {
    position: absolute;
    right: 10px;
    bottom: 0px;
  }
}
.modular {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}
.welcome-firstname {
  color: #606266;
  margin-right: 10px;
}
.welcome-buttom {
  display: flex;
  align-items: center;
}
.progarm-div {
  margin-top: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  height: 56px;
  border: 1px solid #ebeef5;
  width: 218px;
  line-height: 56px;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  user-select: none;
  cursor: pointer;
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
.logo-div {
  // border: 1px solid red;
  display: flex;
  // width: 600px;
  .logo-model {
    width: 200px;
    height: 200px;
    position: relative;
    // border: 1px solid green;
    img {
      width: 200px;
      height: 200px;
      z-index: 0;
    }
    .logo-show {
      position: absolute;
      top: 80px;
      left: 80px;
      z-index: 1;
      width: 40px;
      height: 40px;
      background-color: #fff;
      img {
        // border-radius: 5px;
        width: 40px;
        height: 40px;
      }
    }
  }
  .logo-upload {
    margin-top: 95px;
  }
}
</style>
