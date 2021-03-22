<template>
  <div>
    <QcNavigationPage content="新建活码">
      <el-form :model="model" ref="model">
        <!-- <el-form-item label="渠道名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="企业" :rules="[{ required: true, message: '请填写该字段' }]">
          <el-input v-model="model.corporate"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-radio v-model="model.type" label="单人"></el-radio>
          <el-radio v-model="model.type" label="双人"></el-radio>
        </el-form-item>
        <el-form-item label="激码成员:">
          <el-button type="info" @click="openAddVisible">添加</el-button>
        </el-form-item>
        <el-form-item label="添加设置:">
          <el-checkbox v-model="model.isVerify">客户添加时无需确认自动成为好友</el-checkbox>
        </el-form-item>
        <el-form-item label="选择标签:">
          添加标签后，从此渠道添加的客户，会自动打上以下企业标签
        </el-form-item>  -->
        <el-form-item
          ><el-button type="info" @click="openLabel">选择标签</el-button>
          <!-- <el-button type="info" @click="openAddLabel">+新增标签</el-button> -->
        </el-form-item>
        <el-form-item></el-form-item>
        <!-- <el-form-item label="添加欢迎语:">
          添加标签后，从此渠道添加的客户，会自动发送以下欢迎语
        </el-form-item>
        <el-form-item> <el-button type="info">添加欢迎语</el-button></el-form-item>
        <el-form-item>
          <el-button @click="onSave()" type="primary">保存</el-button>
        </el-form-item> -->
      </el-form>
    </QcNavigationPage>

    <!-- <el-dialog title="添加活码成员" width="50%" :visible.sync="addPeople" :modal-append-to-body="false">
      <QcTable ref="table" :option="option" :search-form="searchForm" :column="column"></QcTable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPeople = false">取 消</el-button>
        <el-button type="primary" @click="addPeople = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="企业标签" width="50%" :visible.sync="chooseLabel" :modal-append-to-body="false">
      <el-form class="QyTableTitle">
        <!-- <span class="elClear"
          ><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          ></span
        > -->
        <el-form-item v-for="(item, index) in tabLists" :key="index">
          <div class="elItem">
            <el-form-item>
              <span class="QyLabel">{{ item.name }}</span></el-form-item
            >

            <el-form-item>
              <!-- <div class="checkTitle">活动</div> -->
              <!-- <el-row class="checkRow" :gutter="20"> -->
              <!-- <el-col class="checkCol" :span="6"
              ><el-checkbox class="checkBox"></el-checkbox>决战大苏打是可见的卢卡斯</el-col
            > -->

              <div style="margin: 40px 0"></div>
              <el-checkbox-group v-model="models.tagList" @change="handleCheckedCitiesChange(item.id)">
                <el-checkbox border>{{ item.tagName }}</el-checkbox>
              </el-checkbox-group>
              <!-- </el-row> -->
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseLabel = false">取消</el-button>
        <el-button type="primary" @click="chooseLabel = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      class="newTitle"
      title="新建标签"
      width="50%"
      :model="tabModels"
      :visible.sync="addLabel"
      :modal-append-to-body="false"
    >
      <el-form>
        <el-form-item label="标签"
          ><el-input placeholder="输入标签名字" v-model="tabModels.name"></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addLabel = false">取 消</el-button>
        <el-button type="primary" @click="onAddLabel()">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import api from '../../api/poster'
// const cityOptions = ['上海', '北京', '广州', '深圳']

export default {
  data() {
    return {
      chooseEnterprise: '',
      radio: '1',
      checked: false,
      addPeople: false,
      chooseLabel: false,
      addLabel: false,
      // option: {
      //   url: 'api/admin/v1/dynamicQrcode/page'
      // },
      // searchForm: [{ label: '名称', type: 'input', formName: 'name' }],
      // column: [
      //   { type: 'selection', width: '50px', align: 'center' },
      //   { label: '序号', type: 'index', width: '50px', align: 'center' },
      //   {
      //     label: '企业号',
      //     prop: 'name',
      //     width: '200px'
      //   },

      //   {
      //     label: '备注',
      //     align: 'center'
      //   },
      //   { label: '状态', prop: 'sortNumber', align: 'center' },
      //   { label: '相关子账户', prop: 'sortNumber', align: 'center' }
      // ],
      checkAll: false,
      checkedCities: [],
      // cities: cityOptions,
      isIndeterminate: true,
      model: {
        channel: '',
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: '',
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
        corporate: '',
        tagList: [
          {
            tagId: ''
          }
        ],
        isVerify: false,
        type: 0,
        userList: [
          {
            userId: ''
          }
        ]
      },
      models: {
        channel: '',
        materialList: [
          {
            id: '',
            appId: '',
            isDeleted: true,
            createTime: '',
            type: '',
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
        corporate: '',
        tagList: [
          {
            tagId: ''
          }
        ],
        isVerify: false,
        type: 0,
        userList: [
          {
            userId: ''
          }
        ]
      },
      tabLists: []
    }
  },
  methods: {
    onSave() {},
    openAddVisible() {
      this.addPeople = true
    },
    openLabel() {
      this.chooseLabel = true
    },
    openAddLabel() {
      this.addLabel = true
    },
    handleCheckAllChange(val) {
      let that = this
      // console.log(val)
      this.checkedCities = val ? that.tabLists : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tabLists.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tabLists.length

      this.model.tagList = value
      console.log(this.model.tagList)
    },
    addPage() {
      api.dynamicQrcodePage().then((res) => {
        console.log(res)
      })
    },
    addGet() {
      api.dynamicQrcodeGet().then((res) => {
        console.log(res)
      })
    },
    tabList() {
      api.tabList().then((res) => {
        // console.log(res.data.data.list)
        this.tabLists = res.data.data.list
        // this.model.tagList = res.data.data.list
        console.log(res.data.data.list)
      })
    },
    addTab() {}
  },
  created() {
    // this.onAddLabel()
    // this.addPage()
    // this.addGet()
    this.tabList()
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  text-align: center;
  border-radius: 2%;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 800px;
  // max-height: calc(100%, -30px);
  // max-width: calc(100%, -30px);
  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .dialog-footer {
    // position: relative;
    left: -38%;
  }
}

.QyTableTitle {
  .elItem {
    display: flex;
    justify-content: space-between;

    .QyLabel {
      font-size: 16px;
      font-weight: bold;
    }
    .elClear {
      color: blue;
    }
  }
  .checkTitle {
    color: #718190;
    font-size: 14px;
    text-align: left;
  }
  .checkRow {
    .checkCol {
      border: 1px solid red;
      margin: 10px;
      .checkBox {
        padding-right: 2px;
      }
    }
  }
}

.el-checkbox-group {
  margin-left: -800px;
}
</style>
