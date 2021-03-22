<template>
  <div>
    <div
      class="header_nav"
      style="margin-bottom: 15px"
    >
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.go(-1)"
      >客户详情</el-button>
    </div>

    <div class="container">
      <div class="top_nav">
        <img src="https://wx.qlogo.cn/mmhead/eytJa9K5jkqq0cOveYwaeKqXqJwKJiaOTC8wPxicPxnASVmqQE5tSyRQ/0" />
        <div style="margin-left:10px">
          <div class="client">
            客户昵称 <span style="font-size:12px;color:#fa9635">@微信</span><span>（备注名或姓名）</span>
            <i
              class="el-icon-male"
              style="color:rgb(66, 126, 186)"
            ></i>
            <!-- <i class='el-icon-female' style='color: rgb(237, 73, 151)'></i> -->
            <i
              class="el-icon-edit"
              @click=";(visible.visibleEdit = true), (visible.vtext = '编辑备注名')"
            ></i>
          </div>
          <div class="top_label">手机：123456789</div>
          <div class="top_label">所在地：地址</div>
          <div class="top_label">
            标签：暂无<i
              class="el-icon-edit"
              @click=";(visible.visibleEdit = true), (visible.vtext = '编辑标签')"
            ></i>
          </div>
          <div class="top_label">
            简介：暂无<i
              class="el-icon-edit"
              @click=";(visible.visibleEdit = true), (visible.vtext = '编辑简介')"
            ></i>
          </div>
        </div>
      </div>

      <div class="statis">
        <div class="inform">
          <div>预计成交率</div>
          <div>暂无<i class="el-icon-edit"></i></div>
        </div>
        <div class="inform">
          <div>所在群</div>
          <div>暂无</div>
        </div>
        <div class="inform">
          <div>上次联系</div>
          <div>暂无</div>
        </div>
        <div class="inform">
          <div>联系次数</div>
          <div>暂无</div>
        </div>
        <div class="inform nobr">
          <div>归属企业成员</div>
          <el-tooltip
            content="成员名称-职位-企业"
            placement="bottom"
            effect="light"
          >
            <div style="border:1px solid transparent">成员名称-职位-企业</div>
          </el-tooltip>
        </div>
      </div>
      <el-tabs
        type="border-card"
        class="clicontent"
        :style="{ height: height + 'px' }"
      >
        <el-tab-pane label="跟进记录">
          <div>
            <div class="followup">
              <span>跟进状态：</span>
              <el-select
                v-model="type"
                clearable
                placeholder="请选择"
                class="gapsel"
              >
                <el-option
                  v-for="item in typeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="followup">
              <el-input
                class="record"
                type="textarea"
                placeholder="添加跟进记录，1000字以内"
                maxlength="1000"
              ></el-input>
            </div>

            <div
              class="followup"
              style="display: flex;flex-wrap:wrap;width:550px"
            >
              <div
                v-if="followImages.length > 0"
                v-for="(pic, index) in followImages"
                :key="index"
                style="position:relative;margin-right:5px;margin-bottom:2px;"
              >
                <!-- <img :src="`${imgHost}${pic}`" style="width:100px;height:100px;"/> -->
                <el-image
                  :src="`${pic}`"
                  :preview-src-list="followImages"
                  style="width:100px;height:100px;"
                ></el-image>
                <i
                  class="el-icon-circle-close"
                  style="position:absolute;top:0px;right:0px;color:red"
                  @click="deletefollow(index)"
                ></i>
              </div>
              <div v-if="followImages.length < 9">
                <image-upload :on-success="(e) => followRecord(e)"></image-upload>
                <div class="upnum">(可上传9张图片)</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="互动轨迹">
          <div class="int_box">
            <div class="intercartbox">
              <div>
                <i class="el-icon-edit-outline interart"></i>
                <span>2020-11-12 14:33:34</span>
              </div>
              <div class="intercon">
                <div>完善客户信息：预计成交率</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户画像">
          <div
            class="int_box"
            v-if="!isedit"
          >
            <div style="margin-bottom:10px">
              <el-button
                size="small"
                type="primary"
                plain
                @click="isedit = true"
              >编辑</el-button>
            </div>
            <div
              class="portrayal"
              :style="{ height: height - 40 - 30 - 42 + 'px' }"
            >
              <div class="portrow">
                <div>手机</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>姓名</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>性别</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>生日</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>年龄</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>QQ</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>邮箱</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>爱好</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>学历</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>年收入</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>行业</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>公司</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>区域</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>地址</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>身份证</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>微信号</div>
                <div>暂无</div>
              </div>
              <div class="portrow">
                <div>图片</div>
                <div>暂无</div>
              </div>
            </div>
          </div>
          <div
            class="int_box"
            v-if="isedit"
          >
            <div style="margin-bottom:10px">
              <el-button
                size="small"
                type="primary"
                plain
                @click="isedit = false"
              >取消</el-button>
              <el-button
                size="small"
                type="primary"
              >提交</el-button>
            </div>
            <div
              class="portrayal"
              :style="{ height: height - 40 - 30 - 42 + 'px' }"
            >
              <div class="portrow">
                <div>手机</div>
                <el-input
                  placeholder="请输入手机号"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>姓名</div>
                <el-input
                  placeholder="请输入姓名"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>性别</div>
                <el-select
                  v-model="type"
                  clearable
                  placeholder="请选择性别"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in gender"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="portrow">
                <div>生日</div>
                <el-date-picker
                  style="width:180px"
                  v-model="birthday"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </div>
              <div class="portrow">
                <div>年龄</div>
                <el-input
                  type="number"
                  placeholder="请输入年龄"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>QQ</div>
                <el-input
                  placeholder="请输入QQ"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>邮箱</div>
                <el-input
                  placeholder="请输入邮箱"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>爱好</div>
                <el-input
                  placeholder="请输入爱好"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>学历</div>
                <el-select
                  v-model="type"
                  clearable
                  placeholder="请选择学历"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in education"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="portrow">
                <div>年收入</div>
                <el-select
                  v-model="type"
                  clearable
                  placeholder="请选择年收入"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in typeoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="portrow">
                <div>行业</div>
                <el-select
                  v-model="type"
                  clearable
                  placeholder="请选择行业"
                  style="width:180px"
                >
                  <el-option
                    v-for="item in typeoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="portrow">
                <div>公司</div>
                <el-input
                  placeholder="请输入公司名"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>区域</div>
                <el-cascader
                  style="width:180px"
                  size="large"
                  :options="addressoptions"
                  v-model="selectedOptions"
                  @change="addressChange"
                >
                </el-cascader>
              </div>
              <div class="portrow">
                <div>地址</div>
                <el-input
                  placeholder="请输入地址"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>身份证</div>
                <el-input
                  placeholder="请输入身份证号"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portrow">
                <div>微信号</div>
                <el-input
                  placeholder="请输入微信号"
                  style="width:180px"
                ></el-input>
              </div>
              <div class="portcol">
                <div class="picimg">图片</div>
                <div class="loadpic">
                  <div
                    v-if="imagelist.length > 0"
                    v-for="(pic, index) in imagelist"
                    :key="index"
                    class="imgbox"
                  >
                    <!-- <img :src="`${imgHost}${pic}`" style="width:50px;height:50px;"/> -->
                    <el-image
                      :src="pic"
                      :preview-src-list="imagelist"
                      style="width:50px;height:50px;"
                    ></el-image>
                    <i
                      class="el-icon-circle-close"
                      @click="deletePic(index)"
                    ></i>
                  </div>
                  <UploadImagesList :on-success="(e) => getLinkCover(e)"></UploadImagesList>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="visible.vtext"
      :visible.sync="visible.visibleEdit"
      :append-to-body="true"
      :before-close="closeEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="400px"
    >
      <el-input type="text"></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeEdit()">取 消</el-button>
        <el-button
          type="primary"
          @click="successEdit()"
          :loading="loading"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../../api/dimission'
// import ComPagination from '../../components/common/ComPagination'
import UploadImagesList from '../../components/common/UploadImagesList'
import ImageUpload from '../../components/common/ImageUpload'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  components: { UploadImagesList },
  data() {
    return {
      visible: {
        visibleEdit: false,
        vtext: ''
      },

      isedit: false,
      type: '',
      birthday: '',
      imagelist: [],
      gender: [
        { label: '女', value: '1' },
        { label: '女', value: '1' },
        { label: '未知', value: '3' }
      ],
      typeoptions: [
        { label: '未跟进', value: '11' },
        { label: '跟进中', value: '22' },
        { label: '已拒绝', value: '33' },
        { label: '已成交', value: '44' }
      ],
      education: [
        { label: '中专', value: '1' },
        { label: '大专', value: '2' },
        { label: '本科', value: '3' },
        { label: '硕士', value: '4' },
        { label: '博士', value: '5' }
      ],
      height: '',
      addressoptions: regionData,
      selectedOptions: [],
      followImages: []
    }
  },
  created() {},
  methods: {
    // 跟进记录的图片
    followRecord(e) {
      var img = this.imgHost + e
      this.followImages.push(img)
    },
    deletefollow(index) {
      this.followImages.splice(index, 1)
    },
    // 用户画像图片
    getLinkCover(e) {
      console.log(e)
      var img = this.imgHost + e
      this.imagelist.push(img)
    },
    // 删除图片
    deletePic(index) {
      this.imagelist.splice(index, 1)
    },
    addressChange(arr) {
      console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]])
    },
    // 弹窗确定
    successEdit() {},
    // 关闭弹窗
    closeEdit() {
      this.visible.visibleEdit = false
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 50,
        PAGINATION_HEIGHT = 155,
        PADDING_BOTTOM_HEIGHT = 110,
        PADDING_TOP_HEIGHT = 40
      this.height =
        window.innerHeight -
        // document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT -
        90
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-info {
  padding: 0 20px;
  box-sizing: border-box;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  .info-msg {
    margin-right: 40px;
    span {
      color: #1e90ff;
    }
  }
  .table-info-btns {
    margin-left: auto;
  }
}

.container {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  background-color: #ffffff;
  .top_nav {
    display: flex;
    padding: 0 20px;
    padding-bottom: 15px;
    color: #606266;
    line-height: 25px;
    img {
      width: 125px;
      height: 125px;
      border-radius: 7px;
    }
    .top_label {
      font-size: 14px;
      .el-icon-edit {
        margin-left: 10px;
      }
    }
    .client {
      font-size: 18px;
      font-weight: bold;
      .el-icon-edit {
        margin-left: 10px;
      }
    }
  }
}
.statis {
  background: rgb(245, 244, 244);
  display: flex;
  justify-content: space-between;
  margin: 0 20px 20px 20px;
  // padding: 15px 0;
  color: #606266;
  .inform {
    text-align: center;
    width: 20%;
    border-right: 1px solid rgb(223, 222, 222);
    div {
      margin: 20px 0;
    }
    div:last-child {
      font-size: 14px;
    }
  }
  .nobr {
    border: none;
  }
}
.clicontent {
  margin: 0 20px 0px 20px;
  // height: 485px;
  color: #606266;
}
.followup {
  font-size: 14px;
  margin: 10px 15px;
  margin-bottom: 25px;
  .upnum {
    margin-top: 5px;
    font-size: 12px;
  }
}
::v-deep .el-textarea__inner {
  height: 100px;
  width: 600px;
}
.int_box {
  margin: 0px 15px;
  font-size: 15px;
  .intercartbox {
    .interart {
      color: #1890ff;
      font-size: 20px;
      margin-right: 10px;
    }
    .intercon {
      border-left: 1px solid #ddd;
      height: 60px;
      margin-top: 5px;
      margin-left: 9px;
      div {
        background: #eee;
        margin-left: 21px;
        padding: 10px;
      }
    }
    // .intercon:last-child {
    //   border: none;
    // }
  }
}
.int_box > .intercartbox:last-child > .intercon {
  border: none;
}
.portrayal {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  // overflow: auto;
  // height: 330px;
  // height: 365px;
  overflow: auto;
  .portrow {
    padding-right: 40px;
    // padding: 8px 15px;
    height: 40px;
    width: 47%;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    div:first-child {
      height: 26px;
      line-height: 26px;
      background: #1890ff;
      color: #fff;
      font-size: 14px;
      padding: 0px 8px;
      border-radius: 5px;
      margin-top: 7px;
    }
    div:last-child {
      line-height: 40px;
    }
  }
  .portrow:nth-child(even) {
    padding-right: 0px;
  }
  .portcol {
    padding-right: 40px;
    // padding: 8px 15px;
    height: 40px;
    width: 47%;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    .picimg {
      height: 26px;
      line-height: 26px;
      background: #1890ff;
      color: #fff;
      font-size: 14px;
      padding: 0px 8px;
      border-radius: 5px;
      margin-top: 7px;
    }
    .loadpic {
      width: 165px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-top: 2px;
      .imgbox {
        margin-bottom: 5px;
        position: relative;
        margin-left: 5px;
        width: 50px;
        height: 50px;
        i {
          position: absolute;
          top: 0;
          right: 0;
          color: red;
        }
      }
    }
  }
}
.query-table-box {
  // box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // margin-left: auto;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}

.title-div {
  // border: 1px solid red;
  margin: 20px;
  span {
    cursor: pointer;
    background-color: #f5f5f5;
    color: #000;
    padding: 10px 20px;
    user-select: none;
    font-size: 14px;
  }
}
.checked {
  background-color: #ffffff !important;
  // color: #fff !important;
}

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
</style>
