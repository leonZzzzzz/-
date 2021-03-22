<template>
  <div class="member-div">
    <div class="member-title">
      <el-alert type="warning" show-icon :closable="false" class="alert">
        <template>
          <div class="alert-content">
            <div class="cont-left">
              <p>
                快速，全面地传递企业、个人、商品信息，展示自己和企业的专业形象
                实时记录客户行为，智能提醒员工名片浏览情况和记录客户的动态轨迹，分析客户意向，精准判断客户需求
                <el-button type="text" style="margin-left: 5px; padding: 0" @click="checkGuide">查看指引</el-button>
              </p>
            </div>
            <div class="cont-right">
              <el-switch
                v-model="switchStatus"
                active-color="#294a7b"
                :active-value="true"
                :inactive-value="false"
                @change="onSwitchChange"
              >
              </el-switch>
              <span style="color: #294a7b">是否开启名片&nbsp;&nbsp;</span>
            </div>
          </div>
        </template>
      </el-alert>
    </div>
    <!-- 名片功能未开启时显示 -->
    <div class="member-empty" v-if="!cardOpenStatus">
      <div class="image-list">
        <img :src="imgHost + '/attachments/scrm/b308c22e1936415a9e6b723fef6555d6.png'" />
        <img :src="imgHost + '/attachments/scrm/4059807558cd478699d318bae0d476f4.png'" />
      </div>
    </div>
    <div class="member-container" v-else>
      <div class="member-btn">
        <el-button size="small" type="primary" @click="openMember">设置成员</el-button>
        <el-button size="small" type="primary" @click="openEnter">企业信息</el-button>
        <el-button size="small" type="primary" @click="openPoster">企业海报</el-button>
      </div>
      <div class="cardsetting">
        <el-form label-width="auto" label-position="right">
          <el-form-item label="属性名称">
            <p class="xfo-p" v-show="!showval">
              {{ settingCard.name }}
              <el-button type="text" icon="el-icon-edit-outline" @click="clickIsShow('showval', true)"></el-button>
            </p>
            <el-input
              v-show="showval"
              ref="showval"
              v-model="settingCard.name"
              maxlength="5"
              show-word-limit
              placeholder="请输入属性名称"
              style="width: 200px"
              @blur="clickIsShow('showval', false)"
              @change="isChangeFlag = true"
            ></el-input>
          </el-form-item>
          <el-form-item label="小程序标题">
            <p class="xfo-p" v-if="!showtitle">
              {{ settingCard.programTitle }}
              <el-button type="text" icon="el-icon-edit-outline" @click="clickIsShow('showtitle', true)"></el-button>
            </p>
            <el-input
              v-show="showtitle"
              ref="showtitle"
              v-model="settingCard.programTitle"
              maxlength="16"
              show-word-limit
              placeholder="请输入链接标题"
              style="width: 200px"
              @blur="clickIsShow('showtitle', false)"
              @change="isChangeFlag = true"
            ></el-input>
          </el-form-item>
          <el-form-item label="样例">
            <el-button type="text" @click="onPreview">查看</el-button>
            <el-image-viewer 
              v-if="showViewer" 
              :on-close="closeViewer" 
              :url-list="[exampleUrl]" />
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="cardsetting">
        <div class="nature">
          <span class="nature_val">属性</span>
          <span v-show="!showval" style="display:flex">
            <span style="margin-left:10px">{{settingCard.name}}</span>
            <i class="el-icon-edit-outline edit" @click="showval=true"></i>
          </span>
          <el-input
            v-show="showval"
            v-model="settingCard.name"
            maxlength="5"
            show-word-limit
            placeholder="请输入属性名称"
            style="width: 200px;display:none;margin-left:10px;"
            @blur="setCardSetting('name')"
            @change="isChangeFlag = true"
          ></el-input>
        </div>
        <div class="nature">
          <span class="nature_val">小程序标题</span>
          <span style="display:flex" v-show="!showtitle">
            <span style="margin-left:10px">{{settingCard.programTitle}}</span>
            <i class="el-icon-edit-outline edit"  @click="showtitle=true"></i>
          </span>
          <el-input
            v-show="showtitle"
            v-model="settingCard.programTitle"
            maxlength="5"
            show-word-limit
            placeholder="请输入小程序标题"
            style="width: 200px;display:none;margin-left:10px;"
            @blur="setCardSetting('title')"
            @change="isChangeFlag = true"
          ></el-input>
        </div>
      </div> -->
      <div class="enterprise-div">
        <div class="xfo-card" v-for="(item, index) in tableData" :key="index">
          <div class="xfo-card-content">
            <div class="test-div" @click="openDetail(item)">
              <div class="test-image-right-position" v-if="item.name == null && item.avatar == null" @click.stop="">
                初始化失败，请该成员实名后再重试
              </div>
              <div class="test-img-left">
                <img :src="item.avatar == null ? item.userAvatar : item.avatar" alt="" />
                <div class="xfo-data">
                  <span
                    ><i class="el-icon-collection-tag"></i><i>{{ item.topQuantity || 0 }}</i></span
                  >
                  <span
                    ><i class="el-icon-view"></i><i>{{ item.viewPersonQuantity || 0 }}</i></span
                  >
                  <span
                    ><i class="el-icon-thumb"></i><i>{{ item.phraseQuantity || 0 }}</i></span
                  >
                </div>
              </div>
              <div class="test-img-right">
                <div class="test-container">
                  <div class="test-introduct">
                    <div class="introduct-div">
                      <div :class="item.name && item.name.length >= 6 ? 'div-first-active' : 'div-first'">
                        {{ item.name == null ? item.userName : item.name | isSplice
                        }}<i class="xfo-position">{{ item.position || '' }}</i>
                      </div>
                      <div class="default-show-icon" title="点亮设为默认展示名片" @click.stop="setCardDefault(item)">
                        <span class="qcfont qc-icon-xingxing active-start" v-if="item.isDefault"></span>
                        <span class="qcfont qc-icon-xingxing1" v-else></span>
                      </div>
                    </div>
                  </div>
                  <div class="xfo-list">
                    <ul>
                      <li>
                        <p class="xfo-text addres">{{ item.address || '--' }}</p>
                        <p class="xfo-icon el-icon-location-outline"></p>
                      </li>
                      <li>
                        <p class="xfo-text phone">{{ item.phone || '--' }}</p>
                        <p class="xfo-icon el-icon-mobile-phone"></p>
                      </li>
                      <li>
                        <p class="xfo-text email">
                          {{ item.email || '--' }}
                        </p>
                        <p class="xfo-icon el-icon-message"></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="xfo-card-tips" v-if="item.name == null">初始化失败，请在“设置成员”中设置</div> -->
          </div>
        </div>
      </div>
      <div class="member-list">
        <div class="member-list-none" v-if="page.pageSize > page.total">
          <el-button type="text">暂无更多</el-button>
        </div>
        <div class="member-list-none" v-else>
          <el-button type="text" @click="changeMore">点击加载更多</el-button>
        </div>
      </div>
    </div>

    <department-dialog
      :config="departmentDialog.config"
      @closeDialog="departmentDialog.config.visible = false"
      :selectedList="form.momentsUsers"
      ref="department"
      @handleConfirm="handleConfirm"
    >
    </department-dialog>

    <com-dialog :config="editDialog.config" @closeDialog="closeDialog">
      <div class="form-dialog">
        <TabButton :navList="navList" @change="changeNav"></TabButton>
        <div class="form-container">
          <div v-if="isShow == true">
            <div class="zanwu-card" v-if="createdList.length == 0">所有成员名片均已创建，无需初始化</div>
            <template v-if="createdList.length != 0">
              <div class="test-div" v-for="(item, index) in createdList" :key="index">
                <div class="test-img-left">
                  <img :src="item.avatar" alt="" />
                </div>
                <div class="test-img-right">
                  <div class="test-container">
                    <div class="test-top">
                      {{ item.name }}
                    </div>
                    <div class="test-introduct">
                      <div class="test-introContent">{{ item.position }}</div>
                      <div class="test-introTitle"><i class="el-icon-user"></i></div>
                    </div>
                    <div class="test-address">
                      <div class="test-address-content">{{ item.address }}</div>
                      <div class="test-address-Title"><i class="el-icon-location-outline"></i></div>
                    </div>
                    <div class="test-tel">
                      <div class="test-address-content">{{ item.phone }}</div>
                      <div class="test-address-Title"><i class="el-icon-phone-outline"></i></div>
                    </div>
                    <div class="test-email">
                      <div class="test-address-content">{{ item.email }}</div>
                      <div class="test-address-Title"><i class="el-icon-message"></i></div>
                    </div>
                    <div class="test-zan">
                      <el-button type="text" @click="editCard(item)">修改</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-if="isShow == false">
            <div class="test-div" v-for="(item, index) in existList" :key="index" @click="changeDetail(item)">
              <div class="test-img-left">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="test-img-right">
                <div class="test-container">
                  <div class="test-top">
                    {{ item.name }}
                  </div>
                  <div class="test-introduct">
                    <div class="test-introContent">{{ item.position }}</div>
                    <div class="test-introTitle"><i class="el-icon-user"></i></div>
                  </div>
                  <div class="test-address">
                    <div class="test-address-content">{{ item.address }}</div>
                    <div class="test-address-Title"><i class="el-icon-location-outline"></i></div>
                  </div>
                  <div class="test-tel">
                    <div class="test-address-content">{{ item.phone }}</div>
                    <div class="test-address-Title"><i class="el-icon-phone-outline"></i></div>
                  </div>
                  <div class="test-email">
                    <div class="test-address-content">{{ item.email }}</div>
                    <div class="test-address-Title"><i class="el-icon-message"></i></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="customer-btn">
        <div>
          <el-button v-if="isShow == true" @click="closeNoticeDialog()">取消</el-button>
          <el-button type="primary" v-if="isShow == true && createdList.length != 0" @click="sumbitNotice()"
            >确定</el-button
          >
        </div>
      </div>
    </com-dialog>
    <com-dialog :config="editCardDialog.config" @closeDialog="closeEditDialog">
      <div class="form-div">
        <el-form label-position="right" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="model.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="model.position" placeholder="请输入职位"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="model.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="model.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="customer-btn">
        <div>
          <el-button @click="closeEditDialog()">取消</el-button>
          <el-button type="primary" @click="sumbitEditNotice()">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <HowToAdd :configure="configureWhatToAdd" @closeDialog="closeWhatToAdd" @success="successWhatToAdd"></HowToAdd>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import DepartmentDialog from '../../../components/components/MemberTreeLinkageDialog'
import ComDialog from '../../../components/common/ComDialog'
import TabButton from '../../../components/components/TabButton'
import HowToAdd from '../../../components/components/CheckGuide'

export default {
  components: {
    ElImageViewer,
    DepartmentDialog,
    ComDialog,
    TabButton,
    HowToAdd
  },
  data() {
    return {
      showViewer:false,
      exampleUrl:'https://athena-1255600302.cos.ap-guangzhou.myqcloud.com/public/pc-guide/business_card_external_attr_01.png',
      isChangeFlag:false,
      showval:false,
      showtitle:false,
      configureWhatToAdd: {
        // 如何添加新成员
        title: '查看指引',
        visible: false
      },
      departmentDialog: {
        config: {
          width: '800px',
          title: '选择设置人员',
          visible: false
        }
      },
      form: {
        momentsUsers: [] // 同步人员列表{cropUserId, userId, name, mobile, position}
      },
      page: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      tableData: [],
      editDialog: {
        config: {
          width: '1200px',
          title: '初始化名片',
          visible: false
        }
      },
      editCardDialog: {
        config: {
          width: '600px',
          title: '修改名片',
          visible: false
        }
      },
      navList: [
        { name: '预创建', isActive: true },
        { name: '已存在', isActive: false }
      ],
      existList: [],
      createdList: [],
      isShow: true,
      model: {},
      memberBoo: false,
      cardOpenStatus: false,
      switchStatus: false,
      settingCard:{}
    }
  },
  filters: {
    isSplice(options) {
      if (options.length > 14) {
        return options.substring(0, 14) + '...'
      } else {
        return options
      }
    }
  },
  methods: {
    onPreview() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    // 获取名片对外属性设置
    getCardSetting(){
      this.$http.businessCardExternalSetting().then(res=>{
        this.settingCard=res.data.data
      })
    },
    clickIsShow(flag, bool) {
      this[flag] = bool
      if (bool) {
        this.$nextTick(() => {
          let dom = this.$refs[flag].$el.children[0].focus()
        })
      } else if (this.isChangeFlag) {
        this.isChangeFlag = false
        let options = {}
        if (flag == 'showval') {
          options = this.name
        }
        if (flag == 'showtitle') {
          options = this.title
        }
        this.$http.UpdatebusinessCardPropertySetting(this.settingCard).then(res=>{
          this.$message.success(res.data.message)
        })
      }
    },
    // 修改名片对外属性设置
    setCardSetting(card){
      if(card=='name'){
        this.showval=false
      }else if(card=='title'){
        this.showtitle=false
      }
      this.$http.UpdatebusinessCardPropertySetting(this.settingCard).then(res=>{
        
      })
    },
    checkGuide() {
      this.configureWhatToAdd.visible = true
    },
    //关闭指引弹窗按钮
    closeWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //点击查看指引成功按钮
    successWhatToAdd() {
      this.configureWhatToAdd.visible = false
    },
    //点击企业海报
    openPoster() {
      this.$router.push('/main/scrm/bussiness-card/poster/list')
    },
    //点击企业信息按钮
    openEnter() {
      this.$router.push('/main/scrm/bussiness-card/enterprise/list?status=push')
    },
    //点击查看详情
    openDetail(item) {
      this.$openNewPage({path: `/main/scrm/bussiness-card/card/detail?id=${item.businessCardId}`})
    },
    async setCardDefault(item) {
      if (item.isDefault) {
        // 取消
        // await this.$http.cancelBusinessCardDefault({id: item.businessCardId})
        // // 刷新列表
        // this.getBussinessUser()
      } else {
        // 设置
        await this.$http.setBusinessCardDefault({id: item.businessCardId})
        // 刷新列表
        this.getBussinessUser()
      }
    },
    //关闭编辑窗口
    closeEditDialog() {
      this.editCardDialog.config.visible = false
    },
    //编辑窗口的确认按钮
    sumbitEditNotice() {
      this.editCardDialog.config.visible = false
      this.createdList.forEach(item => {
        if (item.id == this.model.id) {
          item = this.model
        }
      })
    },
    //点击初始化名片按钮
    editCard(item) {
      this.model = item
      this.editCardDialog.config.visible = true
    },
    //弹窗内导航切换
    changeNav() {
      this.isShow = !this.isShow
    },
    closeNoticeDialog() {
      this.editDialog.config.visible = false
    },
    //
    sumbitNotice() {
      if (this.isShow == true) {
        if (this.createdList.length == 0) {
          this.$message.warning('名片不能为空')
          return
        } else {
          this.newBussinessCard(this.createdList)
        }
      } else {
        this.editDialog.config.visible = false
      }
    },
    closeDialog() {
      this.editDialog.config.visible = false
    },
    openCard() {
      this.editDialog.config.visible = true
      this.initBussinessCard()
    },
    changeMore() {
      this.page.pageSize += 20
      this.getBussinessUser()
    },
    openMember() {
      this.departmentDialog.config.visible = true
    },
    handleConfirm(list) {
      this.memberBoo = true
      let newList = []
      let List = ''
      this.form.momentsUsers = list

      this.form.momentsUsers.forEach(item => {
        newList.push(item.id)
      })
      List = newList.join(',')
      this.updateBussinessUser(List)
    },
    updateBussinessUser(list) {
      let params = {
        userId: list
      }
      this.$http.updateBussinessUser(params).then(res => {
        this.initBussinessCard()
        this.departmentDialog.config.visible = false
      })
    },

    newBussinessCard(params) {
      this.$http.newBussinessCard(params).then(res => {
        if (res.data.code == 20000) {
          this.$message.success(res.data.message)
          this.getBussinessUser()
          this.editDialog.config.visible = false
        }
      })
    },
    getBussinessUser() {
      this.form.momentsUsers = []
      let params = {
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      this.$http.getBussinessUser(params).then(res => {
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          this.form.momentsUsers.push({
            id: item.userId,
            name: item.name,
            isDeleted: item.isDeleted,
            userName: item.userName
          })
        })
        this.page.total = res.data.data.length
      })
    },
    initBussinessCard() {
      this.$http.initBussinessCard().then(res => {
        this.createdList = res.data.data.create
        this.existList = res.data.data.exist
        if (this.createdList.length != 0 && this.memberBoo == true) {
          this.newBussinessCard(this.createdList)
          this.memberBoo = false
        } else {
          this.$message.success('设置成功')
          this.getBussinessUser()
        }
      })
    },
    // 获取企业名片开启状态
    getBusinessCardOpenStatus() {
      this.$http.getBusinessCardOpenStatus().then(res => {
        let data = res.data.data
        if (data.value == 'checked') {
          this.cardOpenStatus = true
          this.switchStatus = true
        } else {
          this.cardOpenStatus = false
          this.switchStatus = false
        }
      })
    },
    onSwitchChange(val) {
      console.log('开启状态', val)
      if (!val) {
        this.$confirm('关闭后，欢迎语/渠道活码将不可使用名片回复，企微端/小程序端成员名片将无法访问，确认要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            value: 'unchecked'
          }
          this.$http.updateBussinessCardOpenStatus(params).then(() => {
            this.$message.success('企业名片功能已关闭')
            this.getBusinessCardOpenStatus()
          })
        })
        .catch(() => {
          this.switchStatus = !val
        })
      } else {
        this.$confirm('是否开启企业名片功能', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            value: 'checked'
          }
          this.$http.updateBussinessCardOpenStatus(params).then(() => {
            this.$message.success('企业名片功能已开启')
            this.getBusinessCardOpenStatus()
          })
        })
        .catch(() => {
          this.switchStatus = !val
        })
      }
    }
  },
  created() {
    this.getBussinessUser()
    this.getBusinessCardOpenStatus()
    this.getCardSetting()
  }
}
</script>

<style lang="scss" scoped>
.member-div {
  width: 100%;
  // height: 100%;
  background-color: #fff;
  .member-title {
    padding: 20px;
    .alert {
      width: 100%;
      .alert-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        .cont-left {
          display: flex;
          p {
            line-height: 20px;
          }
        }
        .cont-right {
          display: flex;
          width: 180px;
          align-items: center;
          flex-direction: row-reverse;
          flex-shrink: 0;
          font-size: 14px;
        }
      }
    }
  }
  .member-empty {
    .image-list {
      max-width: 1920px;
      margin: auto;
      img {
        max-width: 100%;
      }
    }
  }
  .member-container {
    height: 100%;
    padding: 0px 20px 0 20px;
    .enterprise-div {
      // width: 100%;
      // height: 100%;
      // background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-around;
      .none {
        text-align: center;
        color: #606266;
        font-size: 14px;
      }
      // .xfo-card {
      //   margin-right: 12px;
      // }
      .xfo-card-content {
        position: relative;
        .test-div {
          cursor: pointer;
          margin: 20px 12px 20px 0;
          width: 300px;
          height: 150px;
          background-color: #ffffff;
          display: flex;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          .test-image-right-position {
            border-radius: 15px;
            z-index: 999;
            position: absolute;
            top: 0;
            left: 0;
            width: 300px;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            text-align: center;
            line-height: 150px;
          }
          .test-img-left {
            clip-path: polygon(0 0, 100% 0, 60% 100%, 0% 100%);
            position: relative;
            img {
              // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
              border-top-left-radius: 15px;
              border-bottom-left-radius: 15px;
              width: 150px;
              height: 150px;
            }
            .xfo-data {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              font-size: 12px;
              height: 20px;
              line-height: 20px;
              padding-left: 10px;
              box-sizing: border-box;
              background-image: linear-gradient(to right, rgba(200, 200, 200, 0.5), rgba(200, 200, 200, 0));
              color: #fff;
              span {
                margin-right: 10px;
              }
            }
          }
          .test-img-right {
            margin-left: -50px;
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);

            .test-container {
              background-color: #fff;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
              width: 200px;
              height: 150px;
              border-top-right-radius: 15px;
              border-bottom-right-radius: 15px;
              .test-top {
                text-align: right;
                padding: 0px 20px;
                font-size: 16px;
                color: #616161;
              }
              .test-introduct {
                width: 220px;
                height: 45px;
                background-image: url(../../../images/card-bg.png);
                display: flex;
                position: relative;
                top: -1px;
                left: 0;
                .introduct-div {
                  position: relative;
                  margin-left: 60px;
                  width: 140px;
                  overflow: hidden;
                  .div-first {
                    color: #6a6969;
                    font-weight: bold;
                    line-height: 45px;
                    padding-left: 10px;
                    .xfo-position {
                      color: #b0aeae;
                      font-size: 12px;
                    }
                  }
                  .div-first-active {
                    // text-overflow: ellipsis;
                    // display: -webkit-box;
                    // -webkit-line-clamp: 2;
                    // -webkit-box-orient: vertical;
                    font-size: 12px;
                    color: #6a6969;
                    font-weight: bold;
                    line-height: 22px;
                    padding-left: 10px;
                    .xfo-position {
                      color: #b0aeae;
                      font-size: 12px;
                    }
                  }
                  .default-show-icon {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 10px;
                    span {
                      font-size: 17px;
                      color: #b0aeae;
                    }
                    .active-start {
                      color: rgb(245, 204, 60);
                    }
                  }
                }
              }
              .xfo-list {
                text-align: right;
                font-size: 12px;
                color: #808080;
                li {
                  display: flex;
                  line-height: 20px;
                  .xfo-text {
                    padding-right: 5px;
                  }
                  .addres {
                    margin-left: 35px;
                    width: 135px;
                  }
                  .phone {
                    margin-left: 35px;
                    width: 135px;
                  }
                  .email {
                    margin-left: 30px;
                    width: 140px;
                    // border: 1px solid red;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .xfo-icon {
                    display: flex;
                    align-items: center;
                  }
                }
              }
              .test-address {
                margin-top: 10px;
                display: flex;
                color: #8d8e97;
                font-size: 12px;
                text-align: left;
                padding: 0 20px 0 60px;

                .test-address-content {
                  flex: 1;
                  text-align: right;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .test-address-Title {
                  margin-left: auto;
                  font-size: 14px;
                  margin-left: 5px;
                }
              }
              .test-tel {
                margin-top: 10px;
                display: flex;
                color: #8d8e97;
                font-size: 12px;
                text-align: right;
                padding: 0 20px 0 50px;
                .test-address-content {
                  margin-left: auto;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .test-address-Title {
                  font-size: 14px;
                  margin-left: 5px;
                }
              }
              .test-email {
                margin: 10px 0;
                display: flex;
                color: #8d8e97;
                font-size: 12px;
                text-align: right;
                padding: 0 20px 0 30px;
                .test-address-content {
                  margin-left: auto;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .test-address-Title {
                  font-size: 14px;
                  margin-left: 5px;
                }
              }
              .test-zan {
                color: #8d8e97;
                margin-left: 20px;
                font-size: 12px;
                padding: 5px 20px 5px 0;
                text-align: right;
                span {
                  border: 1px solid #8d8e97;
                  padding: 2px;
                }
              }
              .test-zan-two {
                color: #8d8e97;
                padding: 5px 0;
                font-size: 12px;
                margin-left: 20px;
                margin-right: 20px;
                text-align: right;
                span {
                  padding: 2px;
                  border: 1px solid #8d8e97;
                  margin-left: 5px;
                  i {
                    margin-right: 2px;
                    color: #294a7b;
                  }
                }
              }
            }
          }
        }
        .xfo-card-tips {
          position: absolute;
          top: 0;
          left: 0;
          width: 300px;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          user-select: none;
        }
      }
    }
    .look-div {
      margin-right: 5px;
    }
    .member-btn {
      margin-bottom: 20px;
    }
    .member-list {
      margin: 0 20px;
      .member-li {
        cursor: pointer;
        padding: 10px 20px;
        border: 1px solid rgb(210, 213, 221);
        width: 200px;
        display: flex;
        margin: 20px 20px 20px 0;
        .image-div {
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .name-div {
          margin-left: 20px;
          color: #606266;
          line-height: 50px;
        }
        .el-button {
          margin-left: auto;
          margin-top: -5px;
          // font-size: 14px;
          // line-height: 50px;
        }
      }
    }
    // }
    .member-list-none {
      text-align: center;
      color: #606266;
    }
  }
}
.form-dialog {
  .form-container {
    background-color: #f8f8f8;
    // border: 1px solid green;
    max-height: 600px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 2px;
    }
    .zanwu-card {
      padding: 20px;
      text-align: center;
    }
    .test-div {
      cursor: pointer;
      margin: 10px 20px 10px 10px;
      width: 300px;
      // margin: 0 auto;
      display: flex;
      .test-img-left {
        clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%);

        img {
          box-shadow: -4px 3px 5px 2px rgba($color: #333, $alpha: 0.2);
          border-top-left-radius: 30px;
          border-bottom-left-radius: 30px;
          width: 200px;
          height: 200px;
        }
      }
      .test-img-right {
        margin-left: -50px;
        clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
        .test-container {
          background-color: #fff;
          box-shadow: 4px 3px 5px 2px rgba($color: #333, $alpha: 0.2);
          width: 160px;
          height: 160px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          .test-top {
            text-align: right;
            padding: 10px 20px;
            font-size: 16px;
            color: #616161;
          }
          .test-introduct {
            display: flex;
            color: #8d8e97;
            font-size: 1px;
            padding: 0 20px 0 60px;
            .test-introContent {
              flex: 1;
              text-align: right;
              padding-right: 5px;
              // margin-right: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .test-introTitle {
              margin-left: auto;
              font-size: 14px;
            }
          }
          .test-address {
            margin-top: 10px;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: left;
            padding: 0 20px 0 60px;

            .test-address-content {
              flex: 1;
              text-align: right;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .test-address-Title {
              margin-left: auto;
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-tel {
            margin-top: 10px;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: right;
            padding: 0 20px 0 50px;
            .test-address-content {
              margin-left: auto;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .test-address-Title {
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-email {
            margin: 10px 0;
            display: flex;
            color: #8d8e97;
            font-size: 12px;
            text-align: right;
            padding: 0 20px 0 30px;
            .test-address-content {
              margin-left: auto;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .test-address-Title {
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .test-zan {
            color: #8d8e97;
            margin-left: 20px;
            font-size: 12px;
            padding: 5px 20px 5px 0;
            text-align: right;
            span {
              border: 1px solid #8d8e97;
              padding: 2px;
            }
          }
          .test-zan-two {
            color: #8d8e97;
            padding: 5px 0;
            font-size: 12px;
            margin-left: 20px;
            margin-right: 20px;
            text-align: right;
            span {
              padding: 2px;
              border: 1px solid #8d8e97;
              margin-left: 5px;
              i {
                margin-right: 2px;
                color: #294a7b;
              }
            }
          }
        }
      }
    }
  }
}
.customer-btn {
  padding-top: 20px;
  display: flex;
  justify-content: flex-start;
  div {
    margin-left: auto;
  }
}
::v-deep .el-alert__content {
  width: 100%;
}
::v-deep .el-alert__icon.is-big {
  font-size: 20px;
  width: 20px;
}
::v-deep .el-alert__description {
  margin-top: 0;
}
.cardsetting {
  border: 1px solid #eee;
  padding: 10px 15px;
  border-radius: 5px;
  background: rgb(250, 249, 249);
}
.xfo-p {
  width: 120px;
  .el-button {
    display: none;
  }
  &:hover {
    .el-button {
      display: inline-block;
    }
  }
}
.el-form-item {
  margin-bottom: 1px;
}
</style>
