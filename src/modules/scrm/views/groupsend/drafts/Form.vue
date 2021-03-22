<template>
  <div class="newlyaddedDiv">
    <div class="top_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">修改草稿箱</el-button>
    </div>
    <div class="main_content">
      <div class="personal-cancel">
        <div class="personal-content">
          <div class="personal-send-title">基础信息</div>
          <div class="personal-send-form">
            <el-form label-width="120px">
              <el-form-item label="群发标题" :required="true">
                <el-input
                  placeholder="群发标题仅内部可见"
                  maxlength="30"
                  v-model="models.name"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="选择客户:" :required="true" v-if="models.chatType == 'single'">
                <div
                  class="personal-send-userbox"
                  @click="showSelectionCustomerList()"
                  v-if="allCustomerLength == models.messageTargetList.length"
                >
                  <i class="el-icon-user-solid icon-user"></i>
                  <span>全部客户</span>
                  <i class="el-icon-arrow-down icon-down"></i>
                </div>
                <div
                  class="personal-send-userbox"
                  @click="showSelectionCustomerList()"
                  v-if="models.messageTargetList.length != allCustomerLength"
                >
                  <i class="el-icon-user-solid icon-user"></i>
                  <span>指定客户</span>
                  <i class="el-icon-arrow-down icon-down"></i>
                </div>
                <!-- <div
                  class="personal-send-userbox-tagname"
                  @click="showSelectionCustomerList()"
                  v-if="spanName.length != 0"
                >
                  <i class="el-icon-user-solid icon-user"></i>
                  <div>
                    <el-tag v-for="(tagItem, tagIndex) in spanName" :key="tagIndex">{{ tagItem }}</el-tag>
                  </div>

                  <i class="el-icon-arrow-down icon-down"></i>
                </div> -->
                <div
                  class="personal-send-userbox-differ"
                  v-if="models.messageTargetList.length == 0 && models.chatType == 'single' && spanName.length == 0"
                >
                  <span
                    >将群发消息给全部账号的<span class="diff-text">{{ allCustomerListLength }}</span
                    >个客户</span
                  >
                </div>
                <div v-if="models.chatType === 'single' && models.messageTargetList != 0" class="customer-div-margin">
                  <el-form-item>
                    <el-table
                      :data="models.messageTargetList"
                      style="width: 100%"
                      height="201"
                      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
                    >
                      <el-table-column v-for="(item, index) in customerColumn" :key="index" v-bind="item">
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="选择指定群:" :required="true" v-if="models.chatType == 'group'">
                <div class="personal-send-userbox" @click="showGroupSelectionCustomerList()">
                  <i class="el-icon-user-solid icon-user"></i><span>指定群</span>
                  <i class="el-icon-arrow-down icon-down"></i>
                </div>
                <div style="margin-top: 10px">
                  <el-alert
                    title="群主收到群发任务后,可在企业微信上选择群聊发送群发消息"
                    type="warning"
                    show-icon
                    :closable="false"
                    style="height: 36px"
                  >
                  </el-alert>
                </div>
                <div v-if="models.chatType === 'group' && groupMessageList.length != 0" class="customer-div-margin">
                  <el-form-item>
                    <el-table
                      :data="groupMessageList"
                      style="width: 100%"
                      height="171"
                      :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
                    >
                      <el-table-column v-for="(item, index) in GroupColumn" :key="index" v-bind="item">
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="personal-send-title">群发内容</div>
          <div class="personal-send-form">
            <el-form label-width="120px">
              <el-form-item label="群发消息1:">
                <div class="personal-send-item-background">
                  <el-input
                    placeholder="回复内容不能超过1300个字"
                    id="textInput"
                    class="textarea-input"
                    type="textarea"
                    maxlength="1300"
                    size="small"
                    :rows="6"
                    resize="none"
                    v-model="models.message"
                    show-word-limit
                    style="width: 100%"
                  ></el-input>
                </div>
                <div class="welcome-buttom">
                  <div class="welcome-emjoi">
                    <emotion @selectedEmotion="_selectedEmotion"></emotion>
                  </div>
                  <div class="welcome-div">
                    <span class="welcome-firstname">插入昵称</span>
                    <span class="welcome-customername" v-if="models.chatType == 'single'" @click="insert('<客户昵称>')"
                      >客户昵称</span
                    >
                    <span class="welcome-salename" @click="insert('<成员昵称>')">成员昵称</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="群发消息2:">
                <div class="send-item-senond">
                  <span class="send-item-scenod-title">选择群发类型</span>
                  <el-radio-group v-model="contentType">
                    <el-radio label="">无</el-radio>
                    <el-radio label="image">图片</el-radio>
                    <el-radio label="image_text">网页</el-radio>
                    <el-radio label="program">小程序</el-radio>
                  </el-radio-group>
                  <div class="send-item-image" v-if="contentType === 'image'">
                    <!-- <div class="send-item-image-title">
                    <span>图片名称:</span
                    ><el-input
                      placeholder="请输入图片名称"
                      v-model="imageName"
                      class="send-item-image-input"
                    ></el-input>
                  </div> -->
                    <div class="send-item-image-upload">
                      <span class="send-item-image-uptitle">请上传图片:</span>
                      <QcImageUpload
                        :data="{ imageType: 'scrm' }"
                        width="100px"
                        height="100px"
                        class="image-upload"
                        v-model="imageUrl"
                      >
                      </QcImageUpload>
                      <span class="send-item-image-kong">&nbsp;</span>
                    </div>
                  </div>
                  <div class="send-item-image-text" v-if="contentType === 'image_text'">
                    <div class="send-item-image-left">
                      <div class="send-item-image-title">
                        <span>链接标题:</span
                        ><el-input
                          maxlength="30"
                          placeholder="请输入链接标题"
                          v-model="programName"
                          class="send-item-image-input"
                        ></el-input>
                      </div>
                      <div class="send-item-image-title">
                        <span>链接简介:</span
                        ><el-input
                          maxlength="30"
                          placeholder="请输入链接简介"
                          v-model="programContent"
                          class="send-item-image-input"
                        ></el-input>
                      </div>
                      <div class="send-item-image-title">
                        <span>链接地址:</span
                        ><el-input
                          placeholder="请输入链接地址"
                          v-model="programLink"
                          class="send-item-image-input"
                        ></el-input>
                      </div>
                      <div class="send-item-image-upload">
                        <span class="send-item-image-uptitle">请上传图片:</span>
                        <QcImageUpload
                          :data="{ imageType: 'scrm' }"
                          width="100px"
                          height="100px"
                          class="image-upload"
                          v-model="programImage"
                        >
                        </QcImageUpload>
                        <span class="send-item-image-kong">&nbsp;</span>
                      </div>
                    </div>
                    <div class="send-item-image-right">
                      <i class="el-icon-circle-plus plus-icon-text" @click="openImageText"></i>
                    </div>
                  </div>
                  <div class="send-item-program" v-if="contentType === 'program'">
                    <SelectProgramItem ref="SelectProgramItem" :program-props="programIdProps"></SelectProgramItem>
                    <!-- <span class="send-item-title">配置小程序:</span>
                    <el-select
                      clearable
                      placeholder="请选择"
                      v-model="appProgramId"
                      @change="changeSendSelect()"
                      class="send-item-select"
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
                    <i class="el-icon-circle-plus plus-icon" @click="openAddProgram"></i> -->
                  </div>
                </div>
                <div style="margin-top: 10px" v-if="models.chatType == 'single'">
                  <el-alert
                    title="客户每个月最多接收来自同一企业的管理员的 4 条群发消息，4条消息可在同一天发送"
                    type="warning"
                    show-icon
                    :closable="false"
                    style="height: 36px"
                  >
                  </el-alert>
                </div>
                <div style="margin-top: 10px" v-if="models.chatType == 'group'">
                  <el-alert
                    title="每个群聊每个自然月最多接受来自统一企业管理员的 4 条群发消息，4条消息可在同一天发送"
                    type="warning"
                    show-icon
                    :closable="false"
                    style="height: 36px"
                  >
                  </el-alert>
                </div>
              </el-form-item>
              <el-form-item label="群发时间" :required="true">
                <el-radio-group v-model="models.sendType">
                  <el-radio label="now" @change="changefalseVisible">立即群发</el-radio>
                  <el-radio label="time" @change="changeVisible">定时群发</el-radio>
                </el-radio-group>

                <div v-if="models.sendType == 'time' || changeIndex == true">
                  <span style="margin-right: 10px; color: rgb(118, 121, 133)">发送时间</span>
                  <el-date-picker
                    v-model="models.scheduledSendTime"
                    @change="time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions0"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
              <el-form-item class="btn-primary-padding">
                <el-button @click="saveDrafts" :disabled="isDraftDisable">保存到草稿箱</el-button>
                <el-button @click="addBtn" type="primary" :disabled="isDisable">确认发布</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="personal-mobile">
          <div class="personal-content">
            <div class="personal-content-title">客户收到的信息</div>
            <div class="personal-content-image">
              <img src="../../../images/groupsendMobile.png" />
              <div class="personal-content-div">
                <div class="personal-content-div-time">
                  <span>{{ newTime }}</span>
                </div>
                <div class="personal-content-div-text" v-if="models.message.length != 0">
                  <span>
                    <i class="el-icon-user-solid icon-user"></i>
                  </span>
                  <div class="personal-content-div-textcontent">
                    <p v-html="parsingEmoji(models.message)"></p>
                  </div>
                </div>
                <div class="personal-content-div-image" v-if="imageUrl != '' && contentType == 'image'">
                  <span>
                    <i class="el-icon-user-solid icon-user"></i>
                  </span>
                  <div class="personal-content-image-image">
                    <el-image class="image-div" :src="imgHost + imageUrl"></el-image>
                  </div>
                </div>
                <div
                  class="personal-content-div-program"
                  v-if="
                    (programName != '' || programContent != '' || programImage != '' || programLink != '') &&
                      contentType == 'image_text'
                  "
                >
                  <span>
                    <i class="el-icon-user-solid icon-user"></i>
                  </span>
                  <div class="personal-content-program-box">
                    <div class="personal-content-program-name">
                      <p v-if="programName == ''">链接</p>
                      <p v-if="programName != ''">{{ programName }}</p>
                    </div>
                    <div class="personal-content-flex">
                      <div class="personal-content-flex-left">
                        <p v-if="programContent == ''">链接简介</p>
                        <p v-if="programContent != ''">{{ programContent }}</p>
                      </div>
                      <div class="personal-content-flex-right">
                        <div class="per-program-elimage" v-if="programImage != ''">
                          <img class="common-table-image" :src="imgHost + programImage" />
                        </div>
                        <div v-if="programImage == ''">
                          <img class="image-img" src="https://assets.weibanzhushou.com/default-cover.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 客户列表 -->
    <com-dialog :config="addDialog.config" @closeDialog="closeAddDialog">
      <div class="add-content">
        <div class="query-table">
          <div class="query-table-left" style="width: 100%; display: flex; justify-content: flex-end">
            <div class="search-input" style="margin-right: 10px">
              <el-input placeholder="输入客户名称" v-model="selectionSearchContent" @input="selectionSearch">
              </el-input>
            </div>
            <div class="quert-table-title" @click="openTagList()">
              <span class="query-table-choose" v-if="spanName.length == 0">请选择</span>
              <template v-if="spanName.length != 0">
                <el-tag v-for="(tag, index) in spanName" :key="index" type="info" :disable-transitions="true">
                  {{ tag }}
                </el-tag>
              </template>
              <i class="el-icon-arrow-down chosse-i"></i>
            </div>
            <div class="search-input">
              <el-select
                v-model="lifeCycleIdList"
                clearable
                multiple
                collapse-tags
                @change="selectionSearch"
                class="customer-selection"
                placeholder="请选择客户生命周期"
              >
                <el-option
                  v-for="(LifeCycleItem, CycleIndex) in customerLifeCycleList"
                  :key="CycleIndex"
                  :label="LifeCycleItem.cycleName"
                  :value="LifeCycleItem.id"
                >
                </el-option>
              </el-select>
            </div>
            <!-- <div class="search-input">
              <el-checkbox v-model="models.isNowUser" class="checkbox-is-now">以添加时的客户接收为准</el-checkbox>
            </div> -->
            <!-- <el-button type="primary" @click="selectionSearch">搜索</el-button>
            <el-button size="small" type="info" @click="refreshSelectionList">&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button> -->
          </div>
        </div>
        <div class="selection-table">
          <el-table
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
            ref="multipleTable"
            :data="selectionData"
            style="width: 100%"
            height="400"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            class="select-div"
          >
            <el-table-column
              v-for="(item, index) in selectionColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionPage"
            @sizeChange="onSelectionSizeChange"
            @pageChange="onSelectionPageChange"
          ></com-pagination>
        </div>
        <!-- <el-row :gutter="24">
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="4"><div class="close-btn" @click="closeAddDialog">取消</div></el-col>
          <el-col :span="4"> <div class="submit-btn-add" @click="submitSelectionData">确定</div></el-col>
          <el-col :span="8">&nbsp;</el-col>
        </el-row> -->
        <div class="footer_btns" style="display: flex; justify-content: flex-end; margin-top: 20px">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button type="primary" @click="submitSelectionData">确定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 标签选择 -->
    <com-dialog
      :config="selectEnterDialog.config"
      @closeDialog="selectEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <div v-if="tagNameList.length == 0" class="tag-from-none">
        暂无企业标签，<el-button type="text" @click="openEnterTagList">点击添加企业标签</el-button>
      </div>
      <div v-if="tagNameList.length != 0">
        <!-- <div class="selectGroup">
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
        </div> -->
        <div class="select-div-dispose">
          <div v-for="(item, index) in tagNameList" :key="index">
            <div class="tagGroupTitle">{{ item.name }}</div>
            <div class="tagChange">
              <div
                @click="changeTag(items.tagId, items.id, items.name, items.groupId)"
                v-for="(items, indexs) in item.tagList"
                :key="indexs"
                :class="{ active: spanIndex.includes(items.id) }"
              >
                {{ items.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="Btn-two" style="display: flex; justify-content: flex-end">
        <el-button @click="closeTagDialog()" plain>取消</el-button>
        <el-button type="primary" @click="sumbitTagDialog()">确定</el-button>
      </div>
    </com-dialog>
    <com-dialog :config="changeGroupDialog.config" @closeDialog="closeGroupDialog">
      <div class="add-content">
        <div class="query-table">
          <div class="search-input">
            <el-button size="small" type="primary" @click="reFreshGroupCustomer" :loading="syncLoading"
              >刷新群客户同步</el-button
            >
          </div>
          <div class="query-table-left">
            <div class="search-input">
              <div class="search-input-name">群名称</div>
              <el-input
                size="small"
                placeholder="输入群名称"
                v-model="selectionGroupSearchContent"
                @input="selectionGroupSearch"
                clearable
              >
                <!-- <el-button slot="append" icon="el-icon-search" @click="selectionGroupSearch"></el-button> -->
              </el-input>
            </div>
            <!-- <el-button size="small" type="info" @click="refreshGroupSelectionList"
              >&nbsp;&nbsp;重置&nbsp;&nbsp;</el-button
            > -->
          </div>
        </div>
        <div class="selection-table">
          <el-table
            ref="multipleGroupTable"
            :data="selectionGroupData"
            style="width: 100%"
            height="400"
            :row-key="getGroupRowKey"
            @selection-change="handleGroupSelectionChange"
            class="disabledCheck"
          >
            <el-table-column
              v-for="(item, index) in selectionGroupColumn"
              :key="index"
              v-bind="item"
              :reserve-selection="true"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionGroupPage"
            @sizeChange="onGroupSelectionSizeChange"
            @pageChange="onGroupSelectionPageChange"
          ></com-pagination>
        </div>
        <div class="footer_btns" style="display: flex; justify-content: flex-end; margin-top: 20px">
          <el-button @click="closeGroupDialog">取消</el-button>
          <el-button type="primary" @click="sumbitGroupSelectionData">确定</el-button>
        </div>
      </div>
    </com-dialog>

    <com-dialog
      :config="selectEditEnterDialog.config"
      @closeDialog="selectEditEnterDialog.config.visible = false"
      class="dialogSelect"
    >
      <div class="selectGroup">
        <div class="leftTitle">
          <span>已选</span>
        </div>
        <div class="rightTags">
          <el-tag
            v-for="(tag, index) in spanEditName"
            :key="index"
            closable
            type="info"
            :disable-transitions="true"
            @close="closeEditTagList(tag, index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <div class="select-div-dispose">
        <div v-for="(item, index) in tagEditNameList" :key="index">
          <div class="tagGroupTitle">{{ item.name }}</div>
          <div class="tagChange">
            <div
              @click="changeEditTag(items.tagId, items.id, items.name)"
              v-for="(items, indexs) in item.tagList"
              :key="indexs"
              :class="{ active: spanEditIndex.includes(items.id) }"
            >
              {{ items.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="6">
            <el-button type="info" @click="closeEditTagDialog()">取消</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="sumbitEditTagDialog()">确定</el-button>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
    </com-dialog>
    <com-dialog :config="addProgram.config" @closeDialog="closeProgram" class="dialogSelect">
      <div class="program-add-form">
        <el-form label-position="right" label-width="100px">
          <el-form-item label="小程序标题:" :required="true">
            <el-input v-model="programForm.name" placeholder="请输入小程序标题"></el-input>
          </el-form-item>
          <el-form-item label="小程序ID:" :required="true">
            <el-input v-model="programForm.wxAppId" placeholder="请输入小程序ID"></el-input>
          </el-form-item>
          <el-form-item label="小程序链接" :required="true">
            <el-input v-model="programForm.page" placeholder="请输入小程序链接"></el-input>
          </el-form-item>
          <el-form-item label="上传图片:" :required="true">
            <QcImageUpload
              :data="{ imageType: 'scrm' }"
              width="100px"
              height="100px"
              class="image-upload"
              v-model="programForm.logo"
            >
            </QcImageUpload>
          </el-form-item>
        </el-form>
      </div>
      <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="6">&nbsp; </el-col>
          <el-col :span="6">
            <el-button type="info" @click="closeProgram()">取消</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="sumbitProgram()">确定</el-button>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
    </com-dialog>
    <com-dialog :config="selectionDialog.config" @closeDialog="selectionDialog.config.visible = false">
      <div>
        <el-button type="primary" style="margin: 0 5px 5px 5px" @click="openTextImageView">新建图文信息</el-button>
      </div>
      <div class="selection-content">
        <div class="selection-table">
          <el-table
            :header-cell-style="{
              'text-align': 'center',
              'background-color': '#ebeef5',
              color: '#333333',
              height: '40px'
            }"
            ref="imageTextMultipleTable"
            :data="selectionDialog.data"
            style="width: 100%"
            height="500px"
            @selection-change="handleSelectionChangeImageText"
          >
            <el-table-column v-for="(item, index) in selectionDialog.column" :key="index" v-bind="item">
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination :page="selectionDialog.page"></com-pagination>
        </div>
        <div class="submit-btn selection-btn" @click="chooseImageText">确定</div>
      </div>
    </com-dialog>
    <!-- </QcNavigationPage> -->
  </div>
</template>

<script>
import api from '../../../api/groupsend'
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import Emotion from '../../../components/common/Emotion'
import ImagePreview from '../../../components/common/ImagePreview'
import SelectProgramItem from '../../../components/components/SelectProgramItem'
export default {
  components: { ComPagination, ComDialog, Emotion, ImagePreview, SelectProgramItem },
  inject: ['reload'],
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分组名称'))
      } else {
        callback()
      }
    }
    return {
      imageId: '',
      imageCreateTime: '',
      imageAppId: '',
      imageIsDelete: false,
      imageUpdateTime: '',
      imageGroupChatSendMessageId: '',
      imageMediaId: '',
      sequence: '',
      imageTextId: '',
      programTextId: '',
      imageTextLink: 'http://x.wego168.com/hyzs/scrm/#/news?id=',
      options: [],
      contentType: '',
      textContent: '',
      // imageName: '', //第一个图片名称
      imageUrl: '', //都一个图片链接
      programName: '', //第一个链接的名称
      programContent: '', //第一个链接的简介
      programLink: '', //第一个链接
      programImage: '', //第一个链接的图片链接
      appProgramId: '',
      addProgramName: '',
      addProgramLink: '',
      addProgramImage: '',
      name: '',
      sendType: '',
      singleMessageUserList: [],
      models: {
        id: '',
        createTime: '',
        name: '',
        chatType: '',
        sender: '',
        sendType: '',
        status: '',
        message: '',
        isNowUser: true,
        scheduledSendTime: new Date(),
        sendSuccessRate: 0,
        leftSendQuantity: 0,
        statusName: '',
        messageItemList: [],
        messageUserList: [],
        tagId: '',
        lifeCycleId: ''
      },
      page: {
        pageNun: 1,
        pageSize: 15,
        total: 0
      },
      value: '',
      changeIndex: false,
      fresh: true, //刷新整个组件
      timePicker: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      form: {
        type: '',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '',
        appId: '',
        createBy: '',
        createTime: '',
        id: '',
        isDeleted: false,
        source: ''
      },

      messageItemList: [],
      messageUserList: [],
      tableData: [],
      addDialog: {
        config: {
          width: '1100px',
          title: '选择客户',
          visible: false
        }
      },
      changeGroupDialog: {
        config: {
          width: '900px',
          title: '选择指定群',
          visible: false
        }
      },
      selectionSearchContent: '',
      selectionGroupSearchContent: '',
      selectionData: [],
      selectionGroupData: [],
      getRowKeys(row) {
        return row.id
      },
      getGroupRowKey(row) {
        return row.id
      },
      selectionGroupColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'name', label: '群名称', align: 'center' },
        // {
        //   label: '微信群ID',
        //   align: 'center',
        //   prop: 'chatId'
        // },
        { prop: 'ownerName', label: '创建人', labelWidth: '200', align: 'center' },
        { prop: 'createTime', label: '创建时间', labelWidth: '200', align: 'center' }
      ],

      selectionColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          label: '姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'name'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'avatar',
          formatter: (row) => {
            return <img src={row.avatar} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          prop: 'genderName'
        },
        {
          label: '创建时间',
          align: 'center',
          minWidth: '120px',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          align: 'center',
          minWidth: '120px',
          prop: 'updateTime'
        }
      ],
      selectionPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      selectionGroupPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },

      //选择客户后的页面客户列表
      customerColumn: [
        {
          label: '序号',
          align: 'center',
          type: 'index'
        },
        {
          label: '客户姓名',
          align: 'center',
          minWidth: '120px',
          prop: 'userName'
        },
        {
          label: '手机号',
          align: 'center',
          minWidth: '120px',
          prop: 'mobile'
        },
        {
          label: '头像',
          align: 'center',
          minWidth: '120px',
          prop: 'headImage',
          formatter: (row) => {
            return <img src={row.headImage} alt="" width="44" height="44" />
          }
        },
        {
          label: '性别',
          align: 'center',
          minWidth: '120px',
          formatter: (row) => {
            return row.gender === 0 ? '未知' : row.gender === 1 ? '男' : '女'
          }
        },
        {
          label: '操作',
          align: 'center',
          // fixed: 'right',
          minWidth: '120px',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteUserList.bind(this, row, index)}>
                  取消添加
                </el-button>
              </div>
            )
          }
        }
      ],
      GroupColumn: [
        { type: 'index', label: '序号', align: 'center' },
        { prop: 'groupChatName', label: '群名称', align: 'center' },
        { prop: 'groupChatOwner', label: '创建人', align: 'center' },
        { prop: 'groupChatQuantity', label: '群人数', align: 'center' },
        {
          label: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                <el-button type="text" onClick={this.deleteGroupList.bind(this, row, index)}>
                  取消添加
                </el-button>
              </div>
            )
          }
        }
      ],

      deteleList: [],
      deteleGroupList: [],
      groupMessageList: [],
      searchForm: {
        tags: []
      },
      selectEnterDialog: {
        config: {
          width: '600px',
          title: '选择企业客户标签',
          visible: false
        }
      },

      spanName: [],
      tagNameList: [], //获取编辑整个分组的信息
      tagList: [], //获取到的企业列表存放的地方
      spanIndex: [], //获取到的企业列表存放的地方

      tagEditNameList: [],
      forms: {
        momentsUsers: []
      },
      customerLifeCycleList: [],
      customerLifeCycleId: '',
      selectEditEnterDialog: {
        config: {
          width: '600px',
          title: '选择企业客户标签',
          visible: false
        }
      },
      spanEditName: [],
      spanEditIndex: [],
      newGroupList: [],
      GroupData: [],
      newTime: '',
      stringNews: '',
      groupId: [],
      lifeCycleIdList: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      addProgram: {
        config: {
          width: '500px',
          title: '添加小程序',
          visible: false
        }
      },
      programForm: {
        name: '',
        wxAppId: '',
        logo: '',
        page: ''
      },
      programIdProps: {
        id: '',
        name: '',
        logo: ''
      },
      // chooseCustomer: 'allCustomer',
      selectionDialog: {
        config: {
          width: '1020px',
          title: '选择图文消息',
          visible: false
        },
        data: [],
        column: [
          {
            type: 'selection',
            align: 'center',
            width: '55px'
          },
          {
            label: '封面',
            align: 'center',
            minWidth: '120px',
            prop: 'iconUrl',
            formatter: (row) => {
              return (
                <div>
                  <image-preview imageUrl={row.iconUrl} height="90px" />
                </div>
              )
            }
          },
          {
            label: '标题',
            align: 'center',
            minWidth: '120px',
            prop: 'title'
          },
          {
            label: '分类',
            align: 'center',
            minWidth: '120px',
            prop: 'categoryName'
          },
          {
            label: '简介',
            align: 'center',
            minWidth: '200px',
            prop: 'info'
          },
          {
            label: '是否显示',
            align: 'center',
            minWidth: '120px',
            prop: 'isDisplay',
            formatter: (row) => {
              return row.isDisplay ? '是' : '否'
            }
          },
          {
            label: '创建时间',
            align: 'center',
            minWidth: '120px',
            prop: 'createTime'
          }
        ],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        imageTextMultipleTable: []
      },
      allCustomerList: [],
      allCustomerListLength: '',
      syncLoading: false,
      isDisable: false,
      isDraftDisable: false,
      allCustomerLength: 0
    }
  },

  methods: {
    currenTime() {
      setInterval(this.getTime, 500)
    },
    getTime() {
      this.newTime = ''
      const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      this.newTime = hh + ':' + mm
    },
    addBtn() {
      this.models.messageItemList = []
      if (this.models.name === '') {
        this.$message.warning('群发标题不能为空')
        return
      } else if (this.models.chatType === '') {
        this.$message.warning('群发对象不能为空')
        return
      } else if (this.models.message.length > 1300) {
        this.$message.warning('消息内容不能超过1300个字')
        return
      } else if (this.models.sendType === '') {
        this.$message.warning('群发类型不能为空')
        return
      } else {
        if (this.models.chatType == 'group') {
          if (this.models.messageTargetList.length == 0) {
            this.$message.warning('请选择指定群')
            return
          }
        }
        if (this.contentType == 'image') {
          if (this.imageUrl == '') {
            this.$message.warning('请上传图片')
            return
          }
          this.models.messageItemList.push({
            type: 'image',
            imageUrl: this.imageUrl,
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.contentType == 'image_text') {
          if (this.programName == '') {
            this.$message.warning('请输入链接标题')
            return
          }
          if (this.programContent == '') {
            this.$message.warning('请输入链接简介')
            return
          }
          if (this.programLink == '') {
            this.$message.warning('请输入链接地址')
            return
          }
          if (this.programImage == '') {
            this.$message.warning('请上传链接图片')
            return
          }
          this.models.messageItemList.push({
            name: this.programName,
            content: this.programContent,
            link: this.programLink,
            imageUrl: this.programImage,
            type: 'image_text',
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.contentType == 'program') {
          if (this.appProgramId == '') {
            this.$message.warning('请选择小程序')
            return
          }
          this.models.messageItemList.push({
            type: 'program',
            programId: this.appProgramId,
            name: this.addProgramName,
            link: this.addProgramLink,
            imageUrl: this.addProgramImage,
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.models.sendType === 'time') {
          if (this.models.scheduledSendTime == null || this.models.scheduledSendTime == '') {
            this.$message.warning('请选择发送时间')
            return
          }
          if (this.models.scheduledSendTime !== '') {
            let remindTime = this.models.scheduledSendTime
            let srt = remindTime.toString()
            srt = srt.replace('/-/g', '/')
            let oldTime = new Date(srt).getTime()
            if (oldTime <= new Date().getTime()) {
              this.$message.warning('请选择正确的定时发送时间')
              return
            }
          }
        }

        this.addSave()
      }
    },
    addSave() {
      this.models.status = 'new'
      this.models.statusName = ''
      this.models.sendTime = ''
      if (this.models.chatType == 'single') {
        this.models.tagId = this.stringNews
        this.models.lifeCycleId = this.customerLifeCycleId
      }
      if (this.models.sendType == 'now') {
        this.models.scheduledSendTime = ''
      }
      if (this.models.sendType == 'time') {
        if (this.models.scheduledSendTime.length != 19) {
          this.models.scheduledSendTime += ':00'
        }
      }

      if (this.models.messageTargetList.length == 0 && this.models.chatType == 'single') {
        this.models.messageTargetList = this.allCustomerList
      }
      this.isDisable = true
      // console.log(this.models)
      api.reSaveSend(this.models).then((res) => {
        if (res.data.code === 20000) {
          this.$message.success('添加成功，等待客户所属同事确认发送')
          this.$openNewPageBack()
          setTimeout(() => {
            this.isDisable = false
          }, 3000)
        } else {
          this.$message.error('添加失败')
          this.$openNewPageBack()
        }
      })
    },
    //立即群发
    changefalseVisible() {
      this.models.sendType = 'now'
      this.changeIndex = false
      // this.models.scheduledSendTime = ''
    },
    //选择群发时间
    changeVisible() {
      this.models.sendType = 'time'
      this.changeIndex = true
    },
    time(datetime) {
      let startAt = (new Date(this.date) * 1000) / 1000
      if (startAt < Date.now()) {
        datetime = new Date()
      }
      this.models.scheduledSendTime = datetime
      let remindTime = this.models.scheduledSendTime
      let srt = remindTime.toString()
      srt = srt.replace('/-/g', '/')
      let oldTime = new Date(srt).getTime()
      if (oldTime <= new Date().getTime()) {
        this.$message.warning('请选择正确的定时发送时间')
        return
      }
    },
    saveDrafts() {
      this.models.messageItemList = []
      if (this.models.name === '') {
        this.$message.warning('群发标题不能为空')
        return
      } else if (this.models.chatType === '') {
        this.$message.warning('群发对象不能为空')
        return
      } else if (this.models.message.length > 1300) {
        this.$message.warning('消息内容不能超过1300个字')
        return
      } else {
        if (this.models.chatType == 'group') {
          if (this.models.messageTargetList.length == 0) {
            this.$message.warning('请选择指定群')
            return
          }
        }
        if (this.contentType == 'image') {
          if (this.imageUrl == '') {
            this.$message.warning('请上传图片')
            return
          }
          this.models.messageItemList.push({
            type: 'image',
            imageUrl: this.imageUrl,
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.contentType == 'image_text') {
          if (this.programName == '') {
            this.$message.warning('请输入链接标题')
            return
          }
          if (this.programContent == '') {
            this.$message.warning('请输入链接简介')
            return
          }
          if (this.programLink == '') {
            this.$message.warning('请输入链接地址')
            return
          }
          if (this.programImage == '') {
            this.$message.warning('请上传链接图片')
            return
          }
          this.models.messageItemList.push({
            name: this.programName,
            content: this.programContent,
            link: this.programLink,
            imageUrl: this.programImage,
            type: 'image_text',
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.contentType == 'program') {
          let program = this.$refs.SelectProgramItem.success()
          this.appProgramId = program.id
          this.addProgramName = program.name
          this.addProgramLink = program.page
          this.addProgramImage = program.logo
          if (this.appProgramId == '') {
            this.$message.warning('请选择小程序')
            return
          }
          this.models.messageItemList.push({
            type: 'program',
            programId: this.appProgramId,
            name: this.addProgramName,
            link: this.addProgramLink,
            imageUrl: this.addProgramImage,
            id: this.imageId,
            createTime: this.imageCreateTime,
            groupChatSendMessageId: this.imageGroupChatSendMessageId,
            isDeleted: this.imageIsDelete,
            mediaId: this.imageMediaId,
            sequence: this.sequence,
            updateTime: this.imageUpdateTime
          })
        }
        if (this.models.sendType === 'time') {
          if (this.models.scheduledSendTime == null) {
            this.$message.warning('请选择发送时间')
            return
          }
          if (this.models.scheduledSendTime != null) {
            let remindTime = this.models.scheduledSendTime
            let srt = remindTime.toString()
            srt = srt.replace('/-/g', '/')
            let oldTime = new Date(srt).getTime()
            if (oldTime <= new Date().getTime()) {
              this.$message.warning('请选择正确的定时发送时间')
              return
            }
          }
        }
        this.addDraftsFun()
      }
    },
    addDraftsFun() {
      this.models.status = null
      this.models.sendTime = ''

      if (this.models.chatType == 'single') {
        this.models.tagId = this.stringNews
        this.models.lifeCycleId = this.customerLifeCycleId
      }
      if (this.models.messageTargetList.length == 0 && this.models.chatType == 'single') {
        this.models.messageTargetList = this.allCustomerList
      }
      if (this.models.sendType == 'now') {
        this.models.scheduledSendTime = ''
      }
      if (this.models.sendType == 'time') {
        if (this.models.scheduledSendTime.length != 19) {
          this.models.scheduledSendTime += ':00'
        }
      }

      this.isDraftDisable = true
      // console.log(this.models)
      api.reSaveSend(this.models).then((res) => {
        this.$message.success('保存到草稿箱成功')
        this.NewAddgetPage()
        setTimeout(() => {
          this.isDraftDisable = false
        }, 3000)
        this.$openNewPageBack()
      })
    },

    /*这是群发的开始*/
    closeGroupDialog() {
      this.changeGroupDialog.config.visible = false
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
    },
    selectionGroupSearch() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.getGroupSelectionCustomerList()
    },
    refreshGroupSelectionList() {
      this.selectionGroupPage.pageNum = 1
      this.selectionGroupPage.pageSize = 15
      this.selectionGroupPage.total = 0
      this.selectionGroupSearchContent = ''
      this.getGroupSelectionCustomerList()
    },

    //判断当前表格是选中还是未选中
    //选择客户
    handleSelectionChange(val) {
      this.messageUserList = []
      val.forEach((item) => {
        this.messageUserList.push({
          targetId: item.id,
          headImage: item.avatar,
          mobile: item.mobile,
          gender: item.gender,
          userName: item.name
        })
      })
    },

    onGroupSelectionPageChange(val) {
      this.selectionGroupPage.pageNum = val
      this.getGroupSelectionCustomerList()
    },
    onGroupSelectionSizeChange(val) {
      this.selectionGroupPage.pageSize = val
      this.selectionGroupPage.pageNum = 1
      this.getGroupSelectionCustomerList()
    },
    //选择群
    handleGroupSelectionChange(val) {
      this.newGroupList = []
      if (val.length > 1) {
        this.$refs.multipleGroupTable.clearSelection()
        this.$refs.multipleGroupTable.toggleRowSelection(val[val.length - 1])
        return
      }
      this.newGroupList = val[val.length - 1]
      // console.log(this.newGroupList)
    },
    sumbitGroupSelectionData() {
      // console.log(this.newGroupList)
      if (this.newGroupList != undefined) {
        this.groupMessageList = []
        this.GroupData = []
        this.GroupData.push(this.newGroupList)
        this.GroupData.forEach((item) => {
          this.groupMessageList.push({
            targetId: item.id,
            groupChatName: item.name,
            groupChatOwner: item.ownerName,
            groupChatQuantity: item.quantity,
            sender: item.owner
          })
          this.models.sender = item.owner
        })
        this.models.messageTargetList = this.groupMessageList
        this.changeGroupDialog.config.visible = false
      } else {
        this.$message.warning('请选择指定群')
      }
    },
    showGroupSelectionCustomerList() {
      this.changeGroupDialog.config.visible = true
      this.getGroupSelectionCustomerList()
    },

    /*这是群发的结束 */

    /*这是群发客户的开始*/
    selectionSearch() {
      this.customerLifeCycleId = ''
      this.customerLifeCycleId = this.lifeCycleIdList.join('_')
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.getSelectionCustomerList()
    },
    refreshSelectionList() {
      this.selectionPage.pageNum = 1
      this.selectionPage.pageSize = 15
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
      this.searchForm.tags = []
      this.spanName = []
      this.spanIndex = []
      this.customerLifeCycleId = ''
      this.stringNews = ''
      this.groupId = []
      this.lifeCycleIdList = []
      this.getSelectionCustomerList()
    },

    onSelectionSizeChange(val) {
      this.selectionPage.pageSize = val
      this.selectionPage.pageNum = 1
      this.getSelectionCustomerList()
    },
    onSelectionPageChange(val) {
      this.selectionPage.pageNum = val
      this.getSelectionCustomerList()
    },

    //关闭添加客户弹窗
    closeAddDialog() {
      this.addDialog.config.visible = false
      this.selectionPage.pageSize = 15
      this.selectionPage.pageNum = 1
      this.selectionPage.total = 0
      this.selectionSearchContent = ''
      // this.customerLifeCycleId = ''
    },
    // 提交选项，添加客户到分组
    submitSelectionData() {
      this.models.messageTargetList = []
      if (this.messageUserList.length != 0) {
        this.messageUserList.forEach((item) => {
          this.models.messageTargetList.push({
            targetId: item.targetId,
            headImage: item.headImage,
            mobile: item.mobile,
            gender: item.gender,
            userName: item.userName
          })
        })
      }
      let newArr = []
      for (var i = 0; i < this.models.messageTargetList.length; i++) {
        for (var j = i + 1; j < this.models.messageTargetList.length; j++) {
          if (this.models.messageTargetList[i].targetId === this.models.messageTargetList[j].targetId) {
            ++i
          }
        }
        newArr.push(this.models.messageTargetList[i])
      }

      this.models.messageTargetList = newArr
      this.addDialog.config.visible = false
    },
    //显示弹窗
    showSelectionCustomerList() {
      this.addDialog.config.visible = true
      this.getSelectionCustomerList()
    },

    //群发的获取表格
    getGroupSelectionCustomerList() {
      let that = this
      let params = {
        pageNum: that.selectionGroupPage.pageNum,
        pageSize: that.selectionGroupPage.pageSize,
        name: that.selectionGroupSearchContent
      }
      api.groupList(params).then((res) => {
        that.selectionGroupData = res.data.data.list
        that.selectionGroupPage.total = res.data.data.total
        this.$nextTick(() => {
          let length = this.groupMessageList
          this.selectionGroupData.forEach((item) => {
            let modelFlag = length.some((label) => item.id === label.targetId)
            if (modelFlag) {
              this.$refs.multipleGroupTable.toggleRowSelection(item, true)
            }
            let flag = this.deteleGroupList.some((label) => item.id === label)
            if (flag) {
              this.$refs.multipleGroupTable.toggleRowSelection(item, false)
              let i = this.deteleGroupList.findIndex((label) => label === item.id)
              this.deteleList.splice(i, 1)
            }
          })
        })
      })
    },
    //客户的获取表格
    getSelectionCustomerList() {
      let that = this
      let params = {
        pageNum: that.selectionPage.pageNum,
        pageSize: that.selectionPage.pageSize,
        name: that.selectionSearchContent,
        tagId: that.stringNews,
        lifeCycleId: that.customerLifeCycleId
      }
      api.getCustomerSelectPage(params).then((res) => {
        that.selectionData = res.data.data.list
        that.selectionPage.total = res.data.data.total
        this.$nextTick(() => {
          let length = this.models.messageTargetList
          this.selectionData.forEach((item) => {
            let modelFlag = length.some((label) => item.id === label.targetId)
            if (modelFlag) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
            let flag = this.deteleList.some((label) => item.id === label)
            if (flag) {
              this.$refs.multipleTable.toggleRowSelection(item, false)
              let i = this.deteleList.findIndex((label) => label === item.id)
              this.deteleList.splice(i, 1)
            }
          })
        })
      })
    },
    /*这是群发客户的结束*/

    //删除客户列表的客户
    deleteUserList(row, index) {
      this.models.messageTargetList.splice(index, 1)
      this.deteleList.push(row.targetId)
    },
    //删除群发客户列表的数据
    deleteGroupList(row, index) {
      this.deteleGroupList = []
      this.GroupData.splice(index, 1)
      this.groupMessageList.splice(index, 1)
      this.deteleGroupList.push(row.targetId)
      // console.log(row)
      // this.singleMessageUserList.splice(index, 1)
    },
    //根据id获取群发列表内容
    NewAddgetPage() {
      this.models.messageItemList = []
      api.getCordGroup({ id: this.$route.query.id }).then((res) => {
        this.models.chatType = res.data.data.chatType
        if (this.models.chatType === 'single') {
          this.models = res.data.data
          if (this.models.scheduledSendTime == undefined) {
            this.models.scheduledSendTime = new Date()
          }
          this.models.messageItemList.forEach((item) => {
            this.contentType = item.type
            if (this.contentType == 'image') {
              // this.imageName = item.name
              this.imageUrl = item.imageUrl
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            } else if (this.contentType == 'image_text') {
              this.programName = item.name
              this.programImage = item.imageUrl
              this.programLink = item.link
              this.programContent = item.content
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            } else if (this.contentType == 'program') {
              this.programIdProps.id = item.programId
              this.programIdProps.name = item.name
              this.programIdProps.logo = item.imageUrl
              this.appProgramId = item.programId
              this.addProgramName = item.name
              this.addProgramLink = item.link
              this.addProgramImage = item.imageUrl
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            }
          })
        } else if (this.models.chatType === 'group') {
          this.models = res.data.data
          if (this.models.scheduledSendTime == undefined) {
            this.models.scheduledSendTime = new Date()
          }
          this.groupMessageList = res.data.data.messageTargetList
          this.models.messageItemList.forEach((item) => {
            this.contentType = item.type
            if (this.contentType == 'image') {
              // this.imageName = item.name
              this.imageUrl = item.imageUrl
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            } else if (this.contentType == 'image_text') {
              this.programName = item.name
              this.programImage = item.imageUrl
              this.programLink = item.link
              this.programContent = item.content
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            } else if (this.contentType == 'program') {
              this.programIdProps.id = item.programId
              this.programIdProps.name = item.name
              this.programIdProps.logo = item.imageUrl
              this.appProgramId = item.programId
              this.addProgramName = item.name
              this.addProgramLink = item.link
              this.addProgramImage = item.imageUrl
              this.imageId = item.id
              this.imageCreateTime = item.createTime
              this.imageAppId = item.appId
              this.imageIsDelete = item.isDeleted
              this.imageUpdateTime = item.updateTime
              this.imageGroupChatSendMessageId = item.groupChatSendMessageId
              this.imageMediaId = item.mediaId
              this.sequence = item.sequence
            }
          })
        }
      })
    },
    openTagList() {
      this.selectEnterDialog.config.visible = true
    },
    closeTagList(tag, index) {
      let that = this
      that.spanName.splice(index, 1)
      that.spanIndex.splice(index, 1)
      that.groupId.splice(index, 1)
    },

    getEnterList() {
      api.getEnterTagList().then((res) => {
        this.tagNameList = res.data.data
        this.tagEditNameList = res.data.data
      })
    },
    changeTag(tagId, id, name, groupId) {
      let arrIndex = this.spanIndex.indexOf(id)
      let newName = this.spanName.indexOf(name)
      let newGroup = this.groupId.indexOf(id)
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1)
        this.spanName.splice(newName, 1)
        this.groupId.splice(newGroup, 1)
      } else {
        this.spanIndex.push(id)
        this.spanName.push(name)
        this.groupId.push({ groupId: groupId, id: id })
      }
    },

    closeTagDialog() {
      this.selectEnterDialog.config.visible = false
      this.spanIndex = []
      this.spanName = []
      this.searchForm.tags = []
      this.groupId = []
      this.stringNews = ''
    },
    sumbitTagDialog() {
      // let map = new Map()
      let groupIds = {}
      let newArr = []
      let groupId = JSON.parse(JSON.stringify(this.groupId))
      newArr = groupId.filter((val, index) => {
        if (val.groupId in groupIds) {
          groupId[groupIds[val.groupId]].id += '_' + val.id

          return false
        } else {
          groupIds[val.groupId] = index
          return true
        }
      })
      let newTagList = []
      newTagList = newArr.map((item) => item.id)
      this.stringNews = newTagList.join(',')
      this.selectEnterDialog.config.visible = false
      this.selectionSearch()
    },
    showEditTag() {
      this.selectEditEnterDialog.config.visible = true
    },

    closeEditTagList(tag, index) {
      let that = this
      that.spanEditName.splice(index, 1)
      that.spanEditIndex.splice(index, 1)
    },
    changeEditTag(tagId, id, name) {
      let arrIndex = this.spanEditIndex.indexOf(id)
      let newName = this.spanEditName.indexOf(name)
      if (arrIndex > -1) {
        this.spanEditIndex.splice(arrIndex, 1)
        this.spanEditName.splice(newName, 1)
      } else {
        this.spanEditIndex.push(id)
        this.spanEditName.push(name)
      }
    },
    closeEditTagDialog() {
      this.selectEditEnterDialog.config.visible = false
      this.spanEditIndex = []
      this.spanEditName = []
    },
    sumbitEditTagDialog() {
      this.forms.momentsUsers = []
      this.spanEditName.forEach((item) => {
        this.forms.momentsUsers.push({ name: item })
      })
      this.selectEditEnterDialog.config.visible = false
    },
    showEnterList() {
      this.selectEditEnterDialog.config.visible = true
    },
    async insert(myValue) {
      let myField = document.getElementById('textInput')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.models.message =
          myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.models.message += myValue
      }
    },
    _selectedEmotion(val) {
      let message = document.getElementById('textInput')
      let insert = message.selectionStart
      this.models.message = message.value.substr(0, insert) + val + message.value.substr(insert)
    },
    changeSendSelect(val) {
      this.addProgramName = ''
      this.addProgramLink = ''
      this.addProgramImage = ''
      this.options.forEach((item) => {
        if (item.id == this.appProgramId) {
          this.addProgramName = item.wxAppId
          this.addProgramLink = item.page
          this.addProgramImage = item.logo
        }
      })
    },
    getProgarm() {
      api.getProgarmPage().then((res) => {
        this.options = res.data.data.list
      })
    },
    trunBack() {
      this.$openNewPageBack()
    },
    getCustomerLifeCyle() {
      this.$http.getCustomerLifeCyle().then((res) => {
        let list = res.data.data.list
        list.forEach((item) => {
          this.customerLifeCycleList.push({ id: item.id, cycleName: item.cycleName })
        })
      })
    },
    changeSelect(val) {
      this.customerLifeCycleList.forEach((item) => {
        if (item.id === val) {
          this.customerLifeCycleId = item.id
        }
      })
    },
    openEnterTagList() {
      this.$router.push('/main/scrm/tag-library/enterprise/list')
    },
    openAddProgram() {
      this.addProgram.config.visible = true
    },

    closeProgram() {
      this.programForm = {
        name: '',
        wxAppId: '',
        logo: '',
        page: ''
      }
      this.addProgram.config.visible = false
    },
    sumbitProgram() {
      if (this.programForm.name === '') {
        this.$message.warning('请输入小程序标题')
        return
      }
      if (this.programForm.wxAppId === '') {
        this.$message.warning('请输入小程序ID')
        return
      }
      if (this.programForm.page === '') {
        this.$message.warning('请输入小程序链接')
        return
      }
      if (this.programForm.logo === '') {
        this.$message.warning('请上传小程序图片')
        return
      }
      api.addProgarm(this.programForm).then(() => {
        this.$message.success('添加小程序成功')
        this.programForm = {
          name: '',
          wxAppId: '',
          logo: '',
          page: ''
        }
        this.getProgarm()
      })
      this.addProgram.config.visible = false
    },
    handleSelectionChangeImageText(val) {
      // console.log('返回选项长度' + val.length)
      // this.selectionDialog.multipleSelection = []
      if (val.length > 1) {
        this.$refs.imageTextMultipleTable.clearSelection()
        this.$refs.imageTextMultipleTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.selectionDialog.imageTextMultipleTable = list
      } else {
        this.selectionDialog.imageTextMultipleTable = val
      }
      // this.selectionDialog.multipleSelection = val
    },
    getImageTextPage() {
      let that = this
      that.$http.getImageTextPage(that.selectionDialog.page).then((res) => {
        that.selectionDialog.data = res.data.data.list
        // console.log(that.selectionDialog.data)
        that.selectionDialog.page.total = res.data.data.total
      })
    },
    chooseImageText() {
      if (this.selectionDialog.imageTextMultipleTable.length <= 0) {
        this.$message.warning('请选择图文')
      } else if (this.selectionDialog.imageTextMultipleTable.length > 1) {
        this.$message.warning('只能选择一条图文')
      } else {
        let obj = this.selectionDialog.imageTextMultipleTable[0]
        this.programName = obj.title
        this.programLink = this.imageTextLink + obj.id
        this.programContent = obj.info
        this.programImage = obj.iconUrl
        // this.imageText.isValid = true
        this.selectionDialog.config.visible = false
      }
    },
    openImageText() {
      this.selectionDialog.config.visible = true
    },
    getImageTextLink() {
      const IS_DEV = process.env.NODE_ENV == 'development'
      if (IS_DEV) {
        this.imageTextLink = 'http://x.wego168.com/hyzs/scrm/#/news?id='
      } else {
        this.imageTextLink = this.baseUrl + '/scrm/#/news?id='
      }
      // console.log('文本链接' + this.imageTextLink)
    },
    openTextImageView() {
      this.$router.push('/main/base/news/detail')
    },
    getAllCustomer() {
      this.allCustomerList = []
      let params = {
        pageNum: 1,
        pageSize: 1000
      }
      api.getCustomerSelectPage(params).then((res) => {
        let customerList = res.data.data.list
        this.allCustomerListLength = res.data.data.total
        if (customerList.length != 0) {
          customerList.forEach((item) => {
            this.allCustomerList.push({ targetId: item.id })
            this.allCustomerLength = this.allCustomerList.length
          })
        }
      })
      // console.log(this.allCustomerList)
    },
    reFreshGroupCustomer() {
      this.syncLoading = true
      this.$http.syncCustomerList().then(() => {
        this.$message.success('同步成功')
        this.syncLoading = false
        this.getColonyList()
      })
    }
  },
  created() {
    this.getAllCustomer()
    this.NewAddgetPage()
    this.getEnterList()
    this.getProgarm()
    this.getCustomerLifeCyle()
    this.getImageTextLink()
    this.getImageTextPage()
    console.log(this.spanName.length)
    // console.log(this.models.messageTargetList)
  },
  mounted() {
    this.currenTime()
  },
  beforeDestroy: function() {
    if (this.getTime) {
      clearInterval(this.getTime) // 在Vue实例销毁前，清除时间定时器
    }
  }
}
</script>

<style lang="scss" scoped>
.newlyaddedDiv {
  width: 100%;
  // height: 100%;
  padding-right: 20px;
  .addQunFa {
    font-weight: bold;
    font-size: 16px;
    color: #4d4d4d;
    margin: 10px 0;
  }
  .second {
    display: block;
  }
  .secondSpan {
    padding-left: 10px;
  }
  .inputBox {
    text-align: center;
  }
  .zhuTitle {
    display: inline-block;
    color: rgba(213, 215, 222, 1);
    font-size: 14px;
    margin-left: 60px;
  }
}
.MessageDiv {
  margin-top: 10px;
}

.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto auto auto;
  border-radius: 3px;
  cursor: pointer;
}

.dialog-input {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  .input-content {
    width: 217px;
  }
}
.Table-text {
  margin-bottom: 30px;
  width: 50%;
  color: #6e6c6c;
}
.el-table__body-wrapper {
  z-index: -1 !important;
}

.el-table {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }
}
// .sendBtn {
//   // margin-left: 10px;
// }
.add-content {
  width: 100%;
  height: 556px;
  // padding: 0 20px;
  box-sizing: border-box;
}
.query-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-left {
    display: flex;
    .search-input {
      // margin-right: 20px;
      display: flex;
      .search-input-name {
        width: 100px;
        height: 32px;
        line-height: 32px;
        padding-right: 10px;
        text-align: right;
        color: #606266;
      }
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .customer-total {
      margin-right: 30px;
      span {
        color: #ffa500;
      }
    }
  }
}
.submit-btn-add {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
}
.close-btn {
  border-radius: 3px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #5c6064;
  cursor: pointer;
}
.quert-table-title:hover {
  border: 1px solid #a2a4a8;
}
.quert-table-title::-webkit-scrollbar {
  display: none;
}
.quert-table-title {
  overflow-y: hidden;
  overflow-x: scroll;
  position: relative;
  cursor: pointer;
  width: 300px;
  border: 1px solid #dcdfe6;
  height: 34px;
  border-radius: 5px;
  line-height: 34px;
  margin-right: 10px;
  .query-table-choose {
    color: #c0c4cc;
    margin-left: 20px;
  }
  .chosse-i {
    position: absolute;
    right: 10px;
    margin-top: 10px;
    color: #c0c4dd;
    // border: 1px solid red;
  }
}
.tagGroupTitle {
  padding: 14px;
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
    left: 0px;
  }
}
.active {
  // font-size: 20px !important;
  background-color: #294a7b !important;
  color: #fff !important;
}
.tagIndex {
  border: 1px solid #e9e9eb;
  color: #294a7b !important;
  background-color: #ffffff !important;
}
.el-tag {
  margin: 0 4px;
}
.dialogSelect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .selectGroup {
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
.Btn-two {
  margin: 20px 0;

  .el-button {
    width: 100px;

    font-size: 14px;
  }
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
.enert-tag {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  // border: 1px solid red;
  max-height: 60px;
  padding: 10px 0;
  width: 50%;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
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
.info-itemtag {
  // border: 1px solid red;
  display: inline-block;
  color: #333333;
  background-color: #f2f2f2;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  margin-right: 10px;
  padding: 5px 10px;
  // margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
}

.remark-content {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

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

// .tagGroupTitle {
//   padding: 20px 0;
// }
.tagChange {
  padding-right: 10px;
  // border: 1px solid #ccc;
  width: 95%;
  border-radius: 5px;
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
.none-tag {
  text-align: center;
}
.colse-icon:hover {
  color: #294a7b;
}
.colse-icon {
  cursor: pointer;
  margin-top: 10px;
  margin-right: 15px;
  right: 0;
  top: 0;
  position: absolute;
}
.select-div-dispose {
  height: 400px;
  overflow-y: auto;
}
.textarea-input {
  width: 500px;
  ::v-deep .el-textarea__inner {
    padding-bottom: 20px;
  }
  ::v-deep .el-input__count {
    width: calc(100% - 2px);
    bottom: 1px;
    height: 20px;
    line-height: 20px;
    text-align: right;
    left: 1px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.welcome-buttom {
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
.welcome-emjoi {
  margin-top: 10px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.background-form {
  margin-left: 10px;
  width: 700px;
  background-color: rgb(248, 247, 247);
}
.form-item-width {
  position: relative;
  padding: 20px 0;
  width: 600px;
}
.btn-primary-padding {
  padding: 10px 0;
}

/deep/ thead {
  .select-div .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
.personal-content {
  flex: 2;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  .personal-send-title {
    width: 95%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #262626;
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
  .personal-send-form {
    padding-top: 20px;
    .personal-send-userbox {
      user-select: none;
      cursor: pointer;
      border-radius: 5px;
      text-align: center;
      width: 150px;
      border: 1px solid rgba(228, 223, 223, 0.8);
      .icon-user {
        margin-left: 20px;
        margin-right: 5px;
        width: 25px;
        height: 25px;
        line-height: 25px;
        background-color: #294a7b;
        color: #fff;
        border-radius: 50%;
      }

      .icon-down {
        color: rgba(182, 178, 178, 0.8);
        padding-left: 20px;
      }
    }
    .personal-send-userbox-title {
      margin: 10px 0;
      width: 500px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      background-color: rgba(36, 68, 116, 0.5);
      color: #ffffff;
      padding-left: 10px;
      border-radius: 5px;
    }
  }
}
.personal-send-userbox:hover {
  border-color: #294a7b !important;
}
.send-item-senond {
  border-radius: 5px;
  // min-height: 200px;
  padding: 10px;
  background-color: #f6f6f6;
  .send-item-scenod-title {
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
  }
  .send-item-image {
    color: #606266;
    .send-item-image-title {
      padding: 10px 0;
      display: flex;
      text-align: right;
      span {
        margin-right: 10px;
        flex: 1;
      }
      .send-item-image-input {
        margin-right: 100px;
        flex: 4;
      }
    }
    .send-item-image-upload {
      padding: 10px 0;
      display: flex;
      // .send-item-image-uptitle {
      //   flex: 0.8;
      // }
      .image-upload {
        // flex: 1;
        margin-left: 20px;
        background-color: #fff;
      }
      .send-item-image-kong {
        flex: 3;
      }
    }
  }
}
.send-item-program {
  display: flex;
  padding: 10px 0;
  text-align: center;
  .send-item-title {
    color: #606266;
    // padding-left: 10px;
    text-align: right;
    flex: 0.9;
    // margin-right: 20px;
  }
  .send-item-select {
    margin-left: 10px;
    margin-right: 100px;
    flex: 2.8;
  }
  .plus-icon {
    cursor: pointer;
    display: inline;
    flex: 0.5;
    font-size: 30px;
    color: #294a7b;
  }
  .plus-icon:hover {
    color: rgba(36, 68, 116, 0.5);
  }
}
.warning-title {
  margin: 20px 0 0 0;
  height: 40px;
  width: 650px;
  line-height: 40px;
  background-color: rgba(36, 68, 116, 0.5);
  color: #ffffff;
  padding-left: 10px;
  border-radius: 5px;
}
.personal-mobile {
  flex: 1;
  .personal-content {
    width: 500px;
    // border: 1px solid red;

    .personal-content-title {
      font-size: 14px;
      color: #606266;
      padding: 20px 0;
      text-align: center;
    }
    .personal-content-image {
      text-align: center;
      position: relative;
      img {
        width: 270px;
        height: 535px;
      }
      .personal-content-div {
        height: 350px;
        width: 255px;
        top: 90px;
        left: 120px;
        position: absolute;
        overflow-y: auto;
        .personal-content-div-time {
          span {
            font-size: 12px;
            color: #606266;
          }
        }
        .personal-content-div-text {
          // border: 1px solid green;
          text-align: left;
          display: flex;
          span {
            display: inline-block;
            padding: 20px 0 0 20px;
            flex: 0.8;
            .icon-user {
              text-align: center;
              background-color: #294a7b;
              width: 30px;
              height: 30px;
              color: #fff;
              border-radius: 5px;
              line-height: 30px;
            }
          }
          .personal-content-div-textcontent {
            position: relative;
            cursor: pointer;
            // border: 1px solid red;
            margin-right: 20px;
            // width: 250px;
            margin-top: 20px;
            flex: 3.5;

            p {
              user-select: none;
              cursor: pointer;
              line-height: 15px;
              letter-spacing: 1px;
              width: 150px;
              word-wrap: break-word;
              border-radius: 5px;
              padding: 10px;
              background-color: #fff;
              font-size: 12px;
              color: #595959;
            }
          }
        }
      }
    }
  }
}
.personal-content-div::-webkit-scrollbar {
  width: 2px;
  height: 20px;
}
.personal-content-div-image {
  // border: 1px solid green;
  display: flex;
  span {
    display: inline-block;
    padding: 20px 0 0 20px;
    flex: 0.8;
    .icon-user {
      text-align: center;
      background-color: #294a7b;
      width: 30px;
      height: 30px;
      color: #fff;
      border-radius: 5px;
      line-height: 30px;
    }
  }
  .personal-content-image-image {
    cursor: pointer;
    // flex: 3;
    // margin: 20px 20px 0 0;
    // border: 1px solid red;
    margin: 20px 60px 0px 10px;
    .image-div {
      // margin: 20px;
      display: inline;
      cursor: pointer;
    }
  }
}
.personal-content-div-program {
  display: flex;
  span {
    display: inline-block;
    padding: 20px 0 0 17px;
    flex: 0.8;
    .icon-user {
      text-align: center;
      background-color: #294a7b;
      width: 30px;
      height: 30px;
      color: #fff;
      border-radius: 5px;
      line-height: 30px;
    }
  }
  .personal-content-program-box {
    position: relative;
    cursor: pointer;
    margin: 20px 20px 0 7px;
    flex: 3.5;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    text-align: left;
    .personal-content-program-name {
      font-size: 12px;
      color: #595959;
      p {
        user-select: none;
        cursor: pointer;
        line-height: 15px;
        letter-spacing: 1px;
        width: 150px;
        word-wrap: break-word;
        font-size: 12px;
        color: #595959;
      }
    }
    .personal-content-flex {
      display: flex;
      .personal-content-flex-left {
        // border: 1px solid red;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        flex: 2.5;
        height: 50px;
        p {
          padding: 5px 5px 5px 0;
          user-select: none;
          cursor: pointer;
          line-height: 15px;
          letter-spacing: 1px;
          width: 100px;
          word-wrap: break-word;
          font-size: 12px;
          color: #595959;
        }
      }
      .personal-content-flex-right {
        height: 50px;
        flex: 1.5;
        padding: 5px 0 0 10px;
        .image-img {
          width: 40px;
          height: 40px;
        }
        .per-program-elimage {
          img {
            width: 40px;
            height: 40px;
          }
        }
      }
    }
  }
}
.personal-cancel {
  display: flex;
}
.cancel-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 0;
  margin-left: 20px;

  span {
    padding-top: 10px;
    font-size: 17px;
  }
}
.tag-from-none {
  padding: 10px 0;
  text-align: center;
}
.checkbox-is-now {
  margin-top: 8px;
}
.personal-content-div-textcontent::before,
.personal-content-program-box::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border: 8px solid #fff;
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  position: absolute;
  // z-index: 999;
  top: 8px;
  left: -15px;
}
.personal-send-userbox-tagname {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  max-width: 300px;
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  border: 1px solid rgba(228, 223, 223, 0.8);
  padding-bottom: 2px;
  .icon-user {
    margin-top: 7px;
    margin-left: 20px;
    margin-right: 5px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    background-color: #294a7b;
    color: #fff;
    border-radius: 50%;
    // margin-bottom: 5px;
  }
  div {
    // border: 1px solid red;
    width: 200px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-down {
    margin-top: 10px;
    margin-right: 10px;
    color: rgba(182, 178, 178, 0.8);
    // padding-left: 20px;
  }
}
.personal-send-userbox-tagname:hover {
  border-color: #294a7b !important;
}
.send-item-image-text {
  position: relative;
  // display: flex;
  color: #606266;
  .send-item-image-title {
    padding: 10px 0;
    display: flex;
    text-align: right;
    span {
      margin-right: 10px;
      flex: 1;
    }
    .send-item-image-input {
      margin-right: 100px;
      flex: 4;
    }
  }
  .send-item-image-upload {
    padding: 10px 0;
    display: flex;
    .send-item-image-uptitle {
      text-align: right;
      // border: 1px solid red;
      flex: 0.8;
    }
    .image-upload {
      display: block;
      // flex: 1;
      margin-left: 5px;
      background-color: #fff;
    }
    .send-item-image-kong {
      flex: 3;
    }
  }
}
.send-item-image-right {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 8px;
  margin-top: 10px;
  .plus-icon-text {
    cursor: pointer;
    display: inline;
    flex: 0.5;
    font-size: 30px;
    color: #294a7b;
  }
  .plus-icon-text:hover {
    color: rgba(36, 68, 116, 0.5);
  }
}
.customer-div-margin {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
.personal-send-userbox-differ {
  margin: 10px 0;
  width: 300px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: rgba(36, 68, 116, 0.5);
  color: #ffffff;
  padding-left: 10px;
  border-radius: 5px;
  .diff-text {
    margin: 0 4px;
    color: #2f4c8b;
  }
}
.main_content {
  margin-top: 20px;
  background-color: #fff;
  padding-top: 20px;
}
</style>
