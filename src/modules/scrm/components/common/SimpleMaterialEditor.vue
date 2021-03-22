<template>
  <div class="editor-container">
    <div class="material-editor">
      <div class="edit-menu">
        <div
          class="menu-item"
          v-for="(item, index) in menus"
          :key="index"
          :class="item.type === materialType ? 'active' : ''"
          @click="typeChange(item)"
          :style="item.disabled ? 'cursor: no-drop;' : ''"
        >
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </div>
      </div>
      <div class="edit-content" :style="`height: ${materialType === 'text' ? 155 : 190}px`">
        <template v-if="materialType === 'text'">
          <div style="box-sizing: border-box" class="text_image">
            <el-input
              v-model="text.form.content"
              :id="inputId"
              maxlength="1200"
              show-word-limit
              type="textarea"
              placeholder="请输入内容"
            >
            </el-input>
            <!-- <el-button-group v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="showMaterialSelectDialog"
                >从素材库中选择</el-button
              >
            </el-button-group> -->
          </div>
          <div class="btn-group" v-if="false">
            <emotion @selectedEmotion="insertTextMsg"></emotion>
          </div>
        </template>
        <template v-if="materialType === 'image'">
          <div class="upload-content" v-if="image.form.imageUrl === ''">
            <!-- <ImageUpload
              imageType="scrm"
              :image-url="image.form.imageUrl"
              :on-success="e => (image.form.imageUrl = e)"
            ></ImageUpload> -->
            <image-upload v-model="image.form.imageUrl" @onSuccess="imageSuccess"></image-upload>
            <div class="cont-tips">支持jpg/png格式，最大2MB</div>
            <!-- <div class="btn-group" v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button-group>
                <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="showMaterialSelectDialog"
                  >从素材库中选择</el-button
                >
              </el-button-group>
            </div> -->
          </div>
          <div class="img-show" v-else>
            <div class="img-box">
              <image-preview :imageUrl="image.form.imageUrl" height="150px" width="200px"></image-preview>
              <!-- <img style="width: 200px; height: 150px" :src="`${imgHost}${image.form.imageUrl}`" fit="cover" alt="" /> -->
              <i class="el-icon-delete" @click="image.form.imageUrl = ''"></i>
            </div>
          </div>
        </template>
        <template v-if="materialType === 'video'">
          <div class="upload-content" v-if="video.form.videoUrl === ''">
            <!-- <video-upload @onSuccess="videoUploadSuccess"></video-upload> -->
            <!-- <VideoUpload @onSuccess="videoUploadSuccess"></VideoUpload> -->
            <UploadOnlyVideo @success="videoUploadSuccess"></UploadOnlyVideo>
            <!-- <div class="cont-tips">支持mp4格式，最大10MB</div> -->
            <div class="btn-group" v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button-group>
                <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="showMaterialSelectDialog"
                  >从素材库中选择</el-button
                >
              </el-button-group>
            </div>
          </div>
          <div class="video-show" v-else>
            <div class="video-box">
              <div style="display: flex; flex-direction: column">
                <video-preview :videoData="video.form" height="150px" width="200px" source="edit"></video-preview>
                <i class="el-icon-delete" @click="video.form.videoUrl = ''"></i>
              </div>
            </div>
          </div>
        </template>
        <template v-if="materialType === 'image_text'">
          <div class="upload-content" v-if="!imageText.isValid">
            <div class="cont-wrap" @click="showImageTextDialog">
              <p class="icon el-icon-plus"></p>
            </div>
            <div class="cont-tips">添加图文</div>
            <div class="btn-group" v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button-group style="text-align: right">
                <div style="margin-bottom: 5px">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-folder-opened"
                    style="margin: 0"
                    @click="showMaterialMoreImage()"
                    >从素材库中选择</el-button
                  >
                </div>
                <!-- <div>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-folder-opened"
                    style="margin: 0"
                    @click="showMaterialSelectDialog('single')"
                    >从素材库->单图文中选择</el-button
                  >
                </div> -->
                <!-- <div style="margin-top: 5px">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-folder-opened"
                    style="margin: 0"
                    @click="showMaterialSelectDialog('numer')"
                    >从素材库->多图文中选择</el-button
                  >
                </div> -->
                <!-- <div style="margin-top:5px">
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-right: 15px"
                    icon="el-icon-folder-opened"
                    @click="showRadarSelectionDialog"
                    >从雷达中选择</el-button
                  >
                </div> -->
              </el-button-group>
            </div>
            <div class="btn-group" v-else>
              <el-button-group>
                <!-- <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button> -->
                <!-- <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="showSelectionDialog"
                  >从图文素材中选择</el-button
                > -->
              </el-button-group>
            </div>
          </div>
          <div class="image-text-show" v-else>
            <div class="image-text-box">
              <div class="box-title">{{ imageText.form.name }}</div>
              <div class="box-content">
                <image-preview :imageUrl="imageText.form.imageUrl" height="80px" width="80px"></image-preview>
                <div class="cont-desc">{{ imageText.form.content }}</div>
              </div>
              <!-- <div>
                <a style="color: #294a7b;" :href="imageText.form.link" target="_blank">{{ imageText.form.link }}</a>
              </div> -->
              <!-- <i class="el-icon-edit-outline" @click="imageText.dialog.config.visible = true"></i> -->
              <i class="el-icon-edit-outline" @click="showImageTextDialog"></i>
              <i class="el-icon-delete" @click="deleteCurrentImageText"></i>
            </div>
          </div>
        </template>
        <template v-if="materialType === 'program'">
          <div class="upload-content" v-if="!program.isValid">
            <div class="cont-wrap" @click="showProgramDialog">
              <p class="icon el-icon-plus"></p>
            </div>
            <div class="cont-tips">添加小程序</div>
            <div class="btn-group" v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button-group style="text-align: right">
                <!-- <div>
                  <el-button
                    type="primary"
                    size="small"
                    style="margin: 0"
                    icon="el-icon-folder-opened"
                    @click="showMaterialSelectDialog"
                    >从素材库中选择</el-button
                  >
                </div> -->

                <!-- <div style="margin-top:5px">
                  <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-folder-opened"
                    style="margin:0"
                    @click="showProgramSelectDialog"
                    >从列表中选择</el-button
                  >
                </div> -->
              </el-button-group>
            </div>
          </div>
          <div class="program-show" v-else>
            <el-alert
              title="小程序必须已经关联到企业微信工作台"
              type="warning"
              show-icon
              :closable="false"
              style="line-height: 20px; width: 424px; margin-bottom: 10px"
            >
            </el-alert>
            <div class="program-box">
              <div class="box-title">{{ program.form.name }}</div>
              <div class="box-content">
                <img style="width: 60px; height: 60px" :src="`${imgHost}${program.form.imageUrl}`" fit="cover" alt="" />
                <div class="cont-desc">{{ program.form.content }}</div>
                <i class="el-icon-edit-outline" @click="program.dialog.config.visible = true"></i>
                <i class="el-icon-delete" @click="deleteCurrentProgram"></i>
              </div>
            </div>
          </div>
        </template>
        <template v-if="materialType === 'file'">
          <div class="upload-content" v-if="file.form.file === ''">
            <file-upload @onSuccess="fileUploadSuccess"></file-upload>
            <div class="cont-tips">文件最大20MB</div>
            <div class="btn-group" v-if="fromMaterial" style="position: absolute; right: 15px; top: 10px">
              <el-button-group style="text-align: right">
                <div>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-folder-opened"
                    style="margin: 0"
                    @click="showMaterialSelectDialog"
                    >从素材库中选择</el-button
                  >
                </div>
                <!-- <div style="margin-top:5px">
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-right: 15px"
                    icon="el-icon-folder-opened"
                    @click="showRadarSelectionDialog"
                    >从雷达中选择</el-button
                  >
                </div> -->
              </el-button-group>
              <!-- <el-button-group>
                
                <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="showRadarSelectionDialog"
                  >从雷达中选择</el-button
                >
              </el-button-group> -->
            </div>
          </div>
          <div class="file-show" v-else>
            <div class="file-box">
              <div class="box-content">
                <i class="el-icon-document" style="font-size: 32px; color: #294a7b"></i>
                <div class="cont-desc">{{ file.form.name || file.form.fileName }}</div>
              </div>
              <i class="el-icon-delete" @click="deleteCurrentFile"></i>
            </div>
          </div>
        </template>
      </div>
      <!-- <p class="edit-content-tips" v-if="materialType === 'text'">建议话术内容最多不超过60字</p> -->
      <p class="edit-content-tips" v-if="materialType === 'file'">
        支持文件格式: pdf / doc / docx / xls / xlsx / txt / ppt / pptx
      </p>
    </div>
    <div class="extend-option" v-if="materialType === 'text'">
      <div class="option-content">
        <emotion @selectedEmotion="insertTextMsg"></emotion>
        <div class="option-content--box">
          <div class="option-left">
            插入替换文案
            <el-tooltip
              effect="dark"
              placement="top-end"
              content="非自定义替换即前端自动根据字段信息替换，自定义替换文案即前端人员可自行修改字段文案"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="option-right">
            <div class="right-group">
              <div class="group-item" @click="insertTextMsg('<客户昵称>')">客户昵称</div>
              <div class="group-item" @click="insertTextMsg('<成员昵称>')">成员昵称</div>
              <!-- <div class="group-item" @click="insertTextMsg('<编辑关键词>')">编辑关键词</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <com-dialog :config="imageText.dialog.config" @closeDialog="imageText.dialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="imageText.form" :rules="rules" ref="imageTextModel" label-position="right" label-width="auto">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="imageText.form.name"
              placeholder="请输入名称"
              clearable
              maxlength="64"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input
              v-model="imageText.form.link"
              placeholder="请输入链接地址"
              clearable
              maxlength="256"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="content">
            <el-input
              v-model="imageText.form.content"
              placeholder="请输入链接摘要"
              clearable
              maxlength="120"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="imageUrl">
            <image-upload v-model="imageText.form.imageUrl"></image-upload>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="checkAndSubmitImageText">确定</div>
      </div>
    </com-dialog>
    <com-dialog :config="program.dialog.config" @closeDialog="program.dialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="program.form" :rules="rules" ref="programModel" label-position="right" label-width="auto">
          <el-form-item label="名称" prop="name">
            <el-input v-model="program.form.name" placeholder="请输入名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input v-model="program.form.link" placeholder="请输入小程序链接" clearable> </el-input>
          </el-form-item>
          <el-form-item label="小程序Id" prop="programId">
            <el-input v-model="program.form.programId" placeholder="请输入小程序id" clearable> </el-input>
          </el-form-item>
          <el-form-item label="封面" prop="imageUrl">
            <!-- <ImageUpload
              imageType="scrm"
              :image-url="program.form.imageUrl"
              :on-success="e => (program.form.imageUrl = e)"
            ></ImageUpload> -->
            <image-upload
              :image-url="program.form.imageUrl"
              :on-success="e => (program.form.imageUrl = e)"
            ></image-upload>
            <program-alert style="margin-top: 20px"></program-alert>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="checkAndSubmitProgram">确定</div>
      </div>
    </com-dialog>
    <!-- 从系统图文素材选取列表 -->
    <com-dialog :config="selectionDialog.config" @closeDialog="selectionDialog.config.visible = false">
      <div class="selection-content">
        <div class="query-table" style="margin-bottom: 10px">
          <el-button size="small" type="primary" @click="goToNewPage">新增图文</el-button>
        </div>
        <div class="selection-table">
          <el-table
            ref="multipleTable"
            :data="selectionDialog.data"
            style="width: 100%"
            height="500px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-for="(item, index) in selectionDialog.column" :key="index" v-bind="item">
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="selectionDialog.page"
            @sizeChange="onSelectionSizeChange"
            @pageChange="onSelectionPageChange"
          ></com-pagination>
        </div>
        <div class="submit-btn selection-btn" @click="chooseImageText">确定</div>
      </div>
    </com-dialog>
    <!-- 从素材库中选择素材 -->
    <com-dialog :config="materialSelectDialog.config" @closeDialog="materialSelectDialog.config.visible = false">
      <div class="selection-content" style="height: unset">
        <div class="table-box">
          <!-- <div class="box-left">
            <select-table
              :tableData="menuTableData"
              :column="menuColumn"
              :currentRow="currentRow"
              :isFull="false"
              :height="500"
              @handleCurrentChange="_handleCurrentChange"
            >
            </select-table>
          </div> -->
          <div class="box-right">
            <div class="table-search" style="display: flex; margin-bottom: 20px">
              <el-select
                size="small"
                v-model="selectedGroupID"
                placeholder="请选择"
                @change="selectTextChange()"
                clearable
              >
                <el-option v-for="item in menuTableData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <el-input
                style="width: 200px; margin-left: 20px"
                size="small"
                v-model="selectTextName"
                @input="getMaterialPage(selectedGroupID, selectTextName)"
                placeholder="请输入素材名称、关键字"
                clearable
              ></el-input>
              <!-- <el-input
                style="width:200px;margin-left:20px"
                size="small"
                v-model="selectKeyName"
                @input="getMaterialPage(selectedGroupID, selectTextName, selectKeyName)"
                placeholder="请输入关键字"
                clearable
              ></el-input> -->
            </div>
            <template v-if="materialType === 'text'">
              <com-table :tableData="tableData" :column="textColumn" :isFull="false" :height="500"></com-table>
            </template>
            <template v-if="materialType === 'image'">
              <com-table :tableData="tableData" :column="imageColumn" :isFull="false" :height="500"></com-table>
            </template>
            <template v-if="materialType === 'video'">
              <com-table :tableData="tableData" :column="videoColumn" :isFull="false" :height="500"></com-table>
            </template>
            <template v-if="materialType === 'image_text'">
              <com-table :tableData="tableData" :column="imageTextColumn" :isFull="false" :height="500"></com-table>
            </template>
            <template v-if="materialType === 'file'">
              <com-table :tableData="tableData" :column="fileColumn" :isFull="false" :height="500"></com-table>
            </template>
            <template v-if="materialType === 'program'">
              <com-table :tableData="tableData" :column="programColumn" :isFull="false" :height="500"></com-table>
            </template>
          </div>
        </div>
        <div class="group-total" style="margin-top: 10px">共: {{ customerTotal }} 条数据</div>
        <div class="group-btn">
          <el-button style="margin-right: 20px" type="primary" @click="submitSelectedMaterial">确定</el-button>
          <el-button style="margin-right: 20px" @click="closeSelectedMaterial">取消</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- 文本详情弹窗 -->
    <com-dialog :config="textDetailDialog.config" @closeDialog="textDetailDialog.config.visible = false">
      <div class="text-detail">
        <div class="content">{{ textDetailDialog.content }}</div>
      </div>
      <div class="submit-btn" @click="textDetailDialog.config.visible = false">关闭</div>
    </com-dialog>
    <!-- 从雷达列表中选择 -->
    <com-dialog :config="radarDialog.config" @closeDialog="radarDialog.config.visible = false">
      <div class="selection-content">
        <div class="selection-table">
          <el-table
            ref="radarTable"
            :data="radarDialog.data"
            style="width: 100%"
            height="500px"
            @selection-change="handleRadarSelectionChange"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <el-table-column label="标题" prop="title" align="center"></el-table-column>
            <el-table-column
              label="简介"
              prop="linkAbstract"
              align="center"
              v-if="materialType === 'image_text'"
            ></el-table-column>
            <el-table-column
              label="简介"
              prop="fileDescribe"
              align="center"
              v-if="materialType === 'file'"
            ></el-table-column>
            <el-table-column label="客户标签" align="center" width="300px">
              <template slot-scope="scope">
                <div class="radar-tag-list">
                  <span v-for="(item, index) in scope.row.behaviorTagList" :key="index">{{ item.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="类型" prop="type" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.type | radarType }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="selection-pagination">
          <com-pagination
            :page="radarDialog.page"
            @sizeChange="onRadarSizeChange"
            @pageChange="onRadarPageChange"
          ></com-pagination>
        </div>
        <div class="submit-btn selection-btn" @click="chooseRadar">确定</div>
      </div>
    </com-dialog>
    <!-- 从小程序列表中选择 -->
    <com-dialog :config="programDialog.config" @closeDialog="programDialog.config.visible = false">
      <div class="selection-content" style="height: auto">
        <div class="selection-table">
          <el-table
            ref="programTable"
            :data="programDialog.data"
            style="width: 100%"
            height="500px"
            @selection-change="handleProgramSelectionChange"
          >
            <el-table-column type="selection" align="center" width="55px"></el-table-column>
            <el-table-column label="名称" prop="name" align="center"></el-table-column>
            <el-table-column label="ID" prop="wxAppId" align="center"></el-table-column>
            <el-table-column label="链接" prop="page" align="center"></el-table-column>
            <el-table-column label="封面" prop="logo" align="center">
              <template slot-scope="scope">
                <img style="width: 55px; height: 55px" :src="`${imgHost}${scope.row.logo}`" fit="cover" alt="" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="submit-btn selection-btn" style="margin-top: 20px" @click="chooseProgram">确定</div>
      </div>
    </com-dialog>

    <!--单图文/多图文从素材库中选择-->
    <com-dialog
      :config="materialTextImageSelectDialog.config"
      @closeDialog="materialTextImageSelectDialog.config.visible = false"
    >
      <div class="menu-div">
        <ul>
          <li
            v-for="(item, index) in menu"
            :key="index"
            @click="chooseMenuItem(index, item.type)"
            :class="ItemIndex == index ? 'active' : ''"
          >
            <i :class="item.icon"></i><span>{{ item.value }}</span>
          </li>
        </ul>
      </div>

      <div class="box-right">
        <div class="table-search" style="display: flex; margin-bottom: 20px">
          <el-select size="small" v-model="selectedGroupID" placeholder="请选择" @change="selectTextChange()" clearable>
            <el-option v-for="item in menuTableData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
          <el-input
            style="width: 200px; margin-left: 20px"
            size="small"
            v-model="selectTextName"
            @input="getMaterialPage(selectedGroupID, selectTextName)"
            placeholder="请输入素材名称、关键字"
            clearable
          ></el-input>
        </div>
        <template>
          <com-table :tableData="tableData" :column="imageTextColumn" :isFull="false" :height="500"></com-table>
        </template>
      </div>
      <div class="group-total" style="margin-top: 10px">共: {{ customerTotal }} 条数据</div>
      <div class="group-btn">
        <el-button style="margin-right: 20px" type="primary" @click="submitSelectedMaterial">确定</el-button>
        <el-button style="margin-right: 20px" @click="closeSelectedMaterial">取消</el-button>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../common/ComDialog'
import FileUpload from '../common/FileUpload'
// import VideoUpload from '../common/VideoUpload'
import ComPagination from '../common/ComPagination'
import ComTable from '../common/ComTable'
import VideoPreview from '../common/VideoPreview'
import ImagePreview from '../common/ImagePreview'
import Emotion from '../common/Emotion'
import ImageUpload from '../common/ImageUpload'
import UploadOnlyVideo from '../components/UploadOnlyVideo'
import ProgramAlert from '../components/ProgramAlert'

const menus = [
  { type: 'text', title: '文字', icon: 'el-icon-edit' },
  { type: 'image', title: '图片', icon: 'el-icon-picture-outline' },
  { type: 'video', title: '视频', icon: 'el-icon-video-camera' },
  { type: 'image_text', title: '图文', icon: 'el-icon-link' },
  { type: 'file', title: '文件', icon: 'el-icon-document-add' },
  { type: 'program', title: '小程序', icon: 'el-icon-chat-round' }
]
export default {
  components: {
    ComDialog,
    FileUpload,
    // VideoUpload,
    ComPagination,
    ComTable,
    VideoPreview,
    ImagePreview,
    Emotion,
    ImageUpload,
    UploadOnlyVideo,
    ProgramAlert
  },
  props: {
    // 素材的类型
    materialType: {
      type: String,
      default: () => {
        return 'text'
      }
    },
    // 需要编辑的表单
    editForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 菜单
    menus: {
      type: Array,
      default: () => {
        return menus
      }
    },
    // 是否从素材库中选择
    fromMaterial: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else {
        callback()
      }
    }
    let linkValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入链接地址'))
      } else {
        callback()
      }
    }
    let contentValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入摘要'))
      } else {
        callback()
      }
    }
    let imageValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    let programIdValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入小程序id'))
      } else {
        callback()
      }
    }
    return {
      inputId: Math.random().toString(36).substr(2), // 文本输入id设为随机字符串，以免在编辑或者添加文本时插入文本的id相同
      imageTextLink: 'http://x.wego168.com/hyzs/scrm/#/news?id=',
      // menus: [
      //   {type: 'text', title: '文字', icon: 'el-icon-edit'},
      //   {type: 'image', title: '图片', icon: 'el-icon-picture-outline'},
      //   {type: 'video', title: '视频', icon: 'el-icon-video-camera'},
      //   {type: 'image_text', title: '图文', icon: 'el-icon-link'},
      //   {type: 'program', title: '小程序', icon: 'el-icon-chat-round'},
      //   {type: 'file', title: '文件', icon: 'el-icon-document-add'},
      // ],
      baseForm: {
        type: '',
        name: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        link: '',
        programId: '',
        file: '',
        fileId: '', // 视频的fileId
        fileName: '' // 文件名称
      },
      text: {
        form: {}
      },
      image: {
        form: {}
      },
      video: {
        form: {}
      },
      file: {
        form: {}
      },
      imageText: {
        dialog: {
          config: {
            width: '800px',
            title: '新建图文',
            visible: false
          }
        },
        form: {},
        isValid: false
      },
      program: {
        dialog: {
          config: {
            width: '800px',
            title: '添加小程序',
            visible: false
          }
        },
        form: {},
        isValid: false
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }],
        link: [{ required: true, validator: linkValidator, trigger: 'blur' }],
        content: [{ required: true, validator: contentValidator, trigger: 'blur' }],
        imageUrl: [{ required: true, validator: imageValidator, trigger: 'blur' }],
        programId: [{ required: true, validator: programIdValidator, trigger: 'blur' }]
      },
      selectionDialog: {
        config: {
          width: '1020px',
          title: '选择图文消息',
          visible: false
        },
        data: [],
        column: [
          // {
          //   type: 'selection',
          //   align: 'center',
          //   width: '55px'
          // },
          {
            label: '封面',
            align: 'center',
            minWidth: '120px',
            prop: 'iconUrl',
            formatter: row => {
              return (
                <div>
                  <image-preview imageUrl={row.iconUrl} height="90px"></image-preview>
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
            minWidth: '100px',
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
            formatter: row => {
              return row.isDisplay ? '是' : '否'
            }
          },
          {
            label: '创建时间',
            align: 'center',
            minWidth: '120px',
            prop: 'createTime'
          },
          {
            label: '操作',
            width: '150px',
            align: 'center',
            fixed: 'right',
            formatter: (row, column, cellValue, index) => {
              return (
                <div>
                  {row.selected ? (
                    <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                      取消
                    </el-button>
                  ) : (
                    <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                      选择
                    </el-button>
                  )}
                </div>
              )
            }
          }
        ],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        multipleSelection: []
      },
      materialDialog: {
        config: {
          width: '1020px',
          title: '选择素材',
          visible: false
        },
        tableData: [],
        column: [
          {
            type: 'selection',
            align: 'center',
            width: '55px'
          },
          {
            label: '素材内容',
            minWidth: '200px',
            align: 'left',
            prop: 'content',
            formatter: (row, column, cellValue, index) => {
              return {
                text: <div>{row.content}</div>,
                image: <img src={this.imgHost + row.imageUrl} style="width:80px;height:80px;" alt="" />,
                image_text: (
                  <div>
                    <el-tag size="mini" style="margin-right: 10px;">
                      图文
                    </el-tag>
                    {row.name}
                  </div>
                ),
                video: (
                  <div style="display: flex;">
                    <div style="width: 150px; display: flex; flex-direction: column;">
                      <video style="width: 150px; height: 100px;" src={row.videoUrl} controls="controls" />
                      <el-button type="small" onClick={this.getVideoDetail.bind(this, row, index)}>
                        加载视频
                      </el-button>
                    </div>
                  </div>
                ),
                program: (
                  <div>
                    <el-tag size="mini" style="margin-right: 10px;" type="success">
                      小程序
                    </el-tag>
                    {row.name}
                  </div>
                ),
                file: (
                  <div>
                    <el-tag size="mini" style="margin-right: 10px;" type="warning">
                      文件
                    </el-tag>
                    {row.name || row.fileName}
                  </div>
                )
              }[row.type]
            }
          },
          {
            label: '新增人',
            minWidth: '150px',
            align: 'left',
            prop: 'createBy'
          },
          {
            label: '类型',
            minWidth: '150px',
            align: 'left',
            prop: 'type',
            formatter: row => {
              return {
                text: '文字',
                image: '图片',
                image_text: '图文',
                video: '视频',
                program: '小程序',
                file: '文件'
              }[row.type]
            }
          }
        ],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        multipleSelection: []
      },
      // 选择素材弹窗
      materialSelectDialog: {
        config: {
          width: '1220px',
          title: '选择素材',
          visible: false
        }
      },
      // 选择多图文/单图文素材弹窗
      materialTextImageSelectDialog: {
        config: {
          width: '1220px',
          title: '选择素材',
          visible: false
        }
      },
      menuTableData: [], // 左边菜单数据
      currentRow: {}, // 选中项
      menuColumn: [
        {
          label: '分组名称',
          align: 'center',
          minWidth: '250px',
          prop: 'name'
        }
      ],
      selectedGroupID: '', // 当前选择的分组ID
      tableData: [], // 素材列表
      selectedMaterial: {}, // 当前选择的素材
      textColumn: [
        {
          label: '素材内容',
          minWidth: '200px',
          align: 'center',
          // prop: 'content'
          formatter: row => {
            return (
              <div>
                {(row.content && row.content.length) > 100 ? (
                  <div>
                    {row.content.slice(0, 100) + '...'}
                    <el-button type="text" onClick={this.showTextDetailDialog.bind(this, row)}>
                      详情
                    </el-button>
                  </div>
                ) : (
                  row.content
                )}
              </div>
            )
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      imageColumn: [
        {
          label: '素材名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '素材内容',
          minWidth: '150px',
          align: 'center',
          prop: 'imageUrl',
          formatter: row => {
            return (
              <div>
                <image-preview imageUrl={row.imageUrl} height="90px"></image-preview>
              </div>
            )
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      videoColumn: [
        {
          label: '素材名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '素材内容',
          minWidth: '150px',
          align: 'center',
          prop: 'videoUrl',
          formatter: row => {
            return (
              <div>
                <video-preview videoData={row}></video-preview>
              </div>
            )
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button style="color:red" type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      imageTextColumn: [
        {
          label: '封面',
          minWidth: '150px',
          align: 'center',
          prop: 'imageUrl',
          formatter: row => {
            return (
              <div>
                <image-preview imageUrl={row.imageUrl} width="150px"></image-preview>
              </div>
            )
          }
        },
        {
          label: '图文名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '图文链接',
          minWidth: '150px',
          align: 'center',
          prop: 'link',
          formatter: row => {
            return (
              <div>
                <a style="color: #294a7b;" href={row.link} target="_blank">
                  {row.link}
                </a>
              </div>
            )
          }
        },
        {
          label: '图文摘要',
          minWidth: '150px',
          align: 'center',
          formatter: row => {
            return (
              <div>
                {(row.content && row.content.length) > 100 ? (
                  <div>
                    {row.content.slice(0, 100) + '...'}
                    <el-button type="text" onClick={this.showTextDetailDialog.bind(this, row)}>
                      详情
                    </el-button>
                  </div>
                ) : (
                  row.content
                )}
              </div>
            )
          }
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button style="color:red" type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      fileColumn: [
        {
          label: '文件名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name',
          formatter: row => {
            return <div>{row.name || row.fileName}</div>
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button style="color:red" type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],

      // 文本详情弹窗
      textDetailDialog: {
        config: {
          width: '500px',
          title: '素材内容',
          visible: false
        },
        content: ''
      },
      // 选择雷达的弹窗
      radarDialog: {
        config: {
          width: '1020px',
          title: '选择雷达',
          visible: false
        },
        data: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0
        },
        multipleSelection: []
      },
      // 选择小程序的弹窗
      programDialog: {
        config: {
          width: '1020px',
          title: '选择小程序',
          visible: false
        },
        data: [],
        multipleSelection: []
      },

      //zhw
      selectTextName: '', //素材名称
      selectKeyName: '', //关键字搜索
      programColumn: [
        {
          label: '名称',
          align: 'center',
          prop: 'name'
        },
        {
          label: 'ID',
          align: 'center',
          prop: 'programId'
        },
        {
          label: '链接',
          align: 'center',
          prop: 'link'
        },
        {
          label: '封面',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return <img src={this.imgHost + row.imageUrl} style="width:80px;height:80px;" alt="" />
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      customerTotal: 0,
      numerType: '',

      fileList: {},
      //多图文单图文链接
      menu: [
        { type: 'image_text', value: '单图文', icon: 'el-icon-link' },
        { type: 'numerous_image_text', value: '多图文', icon: 'el-icon-link' }
      ],
      ItemIndex: 0 //选择的第几项,默认为第一项
      //zhw end
    }
  },
  filters: {
    radarType(val) {
      switch (val) {
        case 'link':
          return '链接'
        case 'file':
          return '文件'
      }
    }
  },
  created() {
    this.getImageTextLink()
    this.cloneFormData()
    // 新增图文后返回当前页面后表单自动填入新增的图文
    let obj = sessionStorage.getItem('ScrmTalkingImageText')
    if (obj && obj != '{}') {
      this.selectionDialog.multipleSelection = [obj]
      this.chooseImageText()
      sessionStorage.removeItem('ScrmTalkingImageText')
    }
  },
  methods: {
    //zhw

    // changeMoreImage() {
    //   this.selectedGroupID = ''
    //   this.selectTextName = ''
    //   this.materialTextImageSelectDialog.config.visible = false
    // },
    // colseMoreImage() {
    //   this.selectedGroupID = ''
    //   this.selectTextName = ''
    //   this.materialTextImageSelectDialog.config.visible = false
    // },
    //点击选择分类
    selectTextChange() {
      this.getMaterialPage(this.selectedGroupID, this.selectTextName)
    },

    // 点击单图文以及多图文的从素材库中选择按钮
    showMaterialMoreImage() {
      this.materialType = 'image_text'
      this.numerType = 'single'
      this.materialTextImageSelectDialog.config.visible = true
      this.ItemIndex = 0
      this.getMaterialGroups()
    },

    //选择单图文/多图文选项
    chooseMenuItem(index, type) {
      this.ItemIndex = index

      if (type == 'image_text') {
        // this.numerType = 'numer'
        this.numerType = 'single'
      } else {
        this.numerType = 'numer'
      }
      this.materialType = type
      // if (type === 'image_text') {
      this.getMaterialGroups()
      // } else {
      //   this.getMoreMaterialNo()
      // }
    },
    //zhw end

    getImageTextLink() {
      const IS_DEV = process.env.NODE_ENV == 'development'
      if (IS_DEV) {
        this.imageTextLink = 'http://x.wego168.com/hyzs/scrm/#/news?id='
      } else {
        this.imageTextLink = this.baseUrl + '/scrm/#/news?id='
      }
      // console.log('文本链接' + this.imageTextLink)
    },
    cloneFormData() {
      this.text.form = Object.assign({}, this.baseForm)
      this.image.form = Object.assign({}, this.baseForm)
      this.video.form = Object.assign({}, this.baseForm)
      this.imageText.form = Object.assign({}, this.baseForm)
      this.program.form = Object.assign({}, this.baseForm)
      this.file.form = Object.assign({}, this.baseForm)
    },
    typeChange(item) {
      this.$emit('typeChange', item.type)
      // this.materialType = item.type
    },
    // 素材库选择素材弹窗
    // showMaterialDialog() {
    //   let that = this
    //   that.materialDialog.config.visible = true
    //   that.getMaterialPage()
    // },
    // getMaterialPage() {
    //   let that = this
    //   let params = {
    //     type: that.materialType,
    //     pageNum: that.materialDialog.page.pageNum,
    //     pageSize: that.materialDialog.page.pageSize
    //   }
    //   that.$http.getMaterialPage(params).then(res => {
    //     that.materialDialog.tableData = res.data.data.list
    //     that.materialDialog.page.total = res.data.data.total
    //   })
    // },
    // 选项改变
    // materialSelectionChange(val) {
    //   console.log('返回选项长度' + val.length)
    //   // this.materialDialog.multipleSelection = []
    //   if (val.length > 1) {
    //     this.$refs.materialTable.clearSelection()
    //     this.$refs.materialTable.toggleRowSelection(val[val.length - 1])
    //     let list = []
    //     list.push(val[val.length - 1])
    //     this.materialDialog.multipleSelection = list
    //   } else {
    //     this.materialDialog.multipleSelection = val
    //   }
    // },
    // onMaterialSizeChange(val) {
    //   this.materialDialog.page.pageSize = val
    //   this.materialDialog.page.pageNum = 1
    //   this.getMaterialPage()
    // },
    // onMaterialPageChange(val) {
    //   this.materialDialog.page.pageNum = val
    //   this.getMaterialPage()
    // },
    // 选择素材并确定
    // chooseMaterial() {
    //   if (this.materialDialog.multipleSelection.length <= 0) {
    //     this.$message.warning('请选择素材')
    //   } else if (this.materialDialog.multipleSelection.length > 1) {
    //     this.$message.warning('只能选择一条素材')
    //   } else {
    //     let obj = this.materialDialog.multipleSelection[0]
    //     let type = this.materialType
    //     if (type === 'text') {
    //       this.setTextForm(obj)
    //     } else if (type === 'image') {
    //       this.setImageForm(obj)
    //     } else if (type === 'image_text') {
    //       this.setImageTextForm(obj)
    //     } else if (type === 'program') {
    //       this.setProgramForm(obj)
    //     } else if (type === 'file') {
    //       this.setFileForm(obj)
    //     } else if (type === 'video') {
    //       this.setVideoForm(obj)
    //     }
    //     // 关闭弹窗，重置page
    //     this.materialDialog.config.visible = false
    //     this.materialDialog.page.pageSize = 15
    //     this.materialDialog.page.pageNum = 1
    //   }
    // },
    setTextForm(obj) {
      this.text.form.content = obj.content
    },
    setImageForm(obj) {
      this.image.form.imageUrl = obj.imageUrl
    },
    setImageTextForm(obj) {
      console.log(obj)
      this.imageText.form.name = obj.name
      this.imageText.form.link = obj.link
      this.imageText.form.content = obj.content
      this.imageText.form.imageUrl = obj.imageUrl
      this.imageText.form.radarId = obj.radarId ? obj.radarId : ''
      this.imageText.form.quoteId = obj.id ? obj.id : ''
      this.imageText.isValid = true
    },
    setProgramForm(obj) {
      this.program.form.name = obj.name
      this.program.form.link = obj.link
      this.program.form.programId = obj.programId
      this.program.form.imageUrl = obj.imageUrl
      this.program.isValid = true
    },
    setFileForm(obj) {
      this.file.form.name = obj.name
      // this.file.form.fileName = obj.fileName
      this.file.form.fileName = obj.name.split('.')[0]
      this.file.form.file = obj.file
      this.file.form.radarId = obj.radarId ? obj.radarId : ''
    },
    setVideoForm(obj) {
      this.video.form.fileId = obj.fileId
      this.video.form.videoUrl = obj.videoUrl
      this.video.form.name=obj.name
      this.video.form.radarId = obj.radarId ? obj.radarId : ''
    },
    getVideoDetail(row, index) {
      let fileId = row.fileId
      if (!fileId) return this.$message.warning('请上传视频')
      this.$http.getVideoSignatureDetail({ fileId }).then(res => {
        let videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
        this.$set(this.materialDialog.tableData[index], 'videoUrl', videoUrl)
      })
    },
    // 新增图文弹窗
    showImageTextDialog() {
      this.imageText.dialog.config.visible = true
    },
    // 打开选择系统图文的弹窗
    showSelectionDialog() {
      this.selectionDialog.config.visible = true
      this.getImageTextPage()
    },
    // 获取系统图文列表
    getImageTextPage() {
      let that = this
      that.$http.getImageTextPage(that.selectionDialog.page).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          this.$set(item, 'selected', false)
        })
        // console.log(list)
        that.selectionDialog.data = list
        that.selectionDialog.page.total = that.selectionDialog.data.length
      })
    },
    onSelectionSizeChange(val) {
      this.selectionDialog.page.pageSize = val
      this.selectionDialog.page.pageNum = 1
      this.getImageTextPage()
    },
    onSelectionPageChange(val) {
      this.selectionDialog.page.pageNum = val
      this.getImageTextPage()
    },
    // 新增图文，跳转到图文编辑页
    goToNewPage() {
      // console.log(this)
      // 是否使用缓存话术列表页的数据
      this.$store.commit('scrm/isNeedUseTalkingPage', true)
      this.$router.push('/main/base/news/detail?sourcePage=ScrmTalkingList')
    },
    // 选项改变
    handleSelectionChange(val) {
      // console.log('返回选项长度' + val.length)
      // this.selectionDialog.multipleSelection = []
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.selectionDialog.multipleSelection = list
      } else {
        this.selectionDialog.multipleSelection = val
      }
      // this.selectionDialog.multipleSelection = val
    },
    // 在系统图文消息中选择
    chooseImageText() {
      if (this.selectionDialog.multipleSelection.length <= 0) {
        this.$message.warning('请选择图文')
      } else if (this.selectionDialog.multipleSelection.length > 1) {
        this.$message.warning('只能选择一条图文')
      } else {
        let obj = this.selectionDialog.multipleSelection[0]
        this.imageText.form.name = obj.title
        this.imageText.form.link = this.imageTextLink + obj.id
        this.imageText.form.content = obj.info
        this.imageText.form.imageUrl = obj.iconUrl
        this.imageText.isValid = true
        this.selectionDialog.config.visible = false
      }
    },
    onSizeChange(val) {
      this.selectionDialog.page.pageSize = val
      this.selectionDialog.page.pageNum = 1
      this.getImageTextPage()
    },
    onPageChange(val) {
      this.selectionDialog.page.pageNum = val
      this.getImageTextPage()
    },
    // 删除当前图文信息
    deleteCurrentImageText() {
      this.imageText.form.name = ''
      this.imageText.form.link = ''
      this.imageText.form.content = ''
      this.imageText.form.imageUrl = ''
      this.imageText.isValid = false
      this.$emit('clearRadarSetting')
    },
    // 新增小程序弹窗
    showProgramDialog() {
      this.program.dialog.config.visible = true
    },
    // 删除当前小程序信息
    deleteCurrentProgram() {
      this.program.form.name = ''
      this.program.form.link = ''
      this.program.form.programId = ''
      this.program.form.imageUrl = ''
      this.program.isValid = false
    },
    // 媒体和文件上传成功后会触发此事件，父组件监听此事件可以拿到数据做某些事
    emitDataToParent() {
      // console.log('emitDataToParent', this.checkMaterialValid())
      this.$emit('fileDataChange', this.checkMaterialValid())
    },
    // 图片上传成功
    imageSuccess(data) {
      let { url, file } = data
      // console.log(file)
      if (!file || !file.name) file = { name: '' }
      this.image.form.name = file.name
      this.image.form.fileName = file.name.split('.')[0]
      this.emitDataToParent()
    },
    // 视频上传成功
    videoUploadSuccess(data) {
      // let { video, file } = data
      // this.video.form.videoUrl = video.videoUrl --
      // if (!file || !file.name) file = { name: '' }
      // this.video.form.fileId = video.fileId
      // this.video.form.videoUrl = video.videoUrl
      // this.video.form.name = file.name
      // this.video.form.fileName = file.name.split('.')[0]
      this.video.form.fileId = data.fileId
      this.video.form.videoUrl = data.videoUrl

      // console.log('this.video.form',this.video.form)
      this.emitDataToParent()
    },
    // 获取视频详情
    getVideoDetatil() {
      let that = this
      let fileId = that.video.form.fileId
      that.$http.getVideoSignatureDetail({ fileId }).then(res => {
        that.video.form.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
      })
    },
    // 文件上传成功
    fileUploadSuccess(file) {
      if (!file) file = { name: '', address: '' }
      this.file.form.file = file.address
      this.file.form.name = file.name
      this.file.form.fileName = file.name.split('.')[0]
      this.emitDataToParent()
    },
    // 删除当前文件信息
    deleteCurrentFile() {
      this.file.form.file = ''
      this.file.form.name = ''
      this.file.form.fileName = ''
      this.$emit('clearRadarSetting')
    },
    // 图文信息校验
    checkAndSubmitImageText() {
      this.$refs.imageTextModel.validate(valid => {
        if (valid) {
          // 验证通过关闭弹窗
          this.imageText.isValid = true
          this.imageText.dialog.config.visible = false
        }
      })
    },
    // 小程序
    checkAndSubmitProgram() {
      this.$refs.programModel.validate(valid => {
        if (valid) {
          // 验证通过关闭弹窗
          this.program.isValid = true
          this.program.dialog.config.visible = false
        }
      })
    },
    // 编辑表单内容
    setEditFormData() {
      let form = Object.assign({}, this.editForm)
      // console.log('返回值' + form.type)
      if (form.type === 'text') {
        this.text.form = form
      } else if (form.type === 'image') {
        this.image.form = form
      } else if (form.type === 'video') {
        this.video.form = form
      } else if (form.type === 'image_text') {
        this.imageText.form = form
        this.imageText.isValid = true
      } else if (form.type === 'program') {
        this.program.form = form
        this.program.isValid = true
      } else if (form.type === 'file') {
        this.file.form = form
      }
    },
    // 校验表单格式, 校验错误返回false，正确返回对象
    checkMaterialValid() {
      let valid = false
      let form = {}
      let type = this.materialType
      if (type === 'text') {
        valid = this.checkTextForm()
        if (valid) {
          form = this.text.form
        }
      } else if (type === 'image') {
        valid = this.checkImageForm()
        if (valid) {
          form = this.image.form
        }
      } else if (type === 'image_text') {
        valid = this.checkImageTextForm()
        if (valid) {
          form = this.imageText.form
        }
      } else if (type === 'program') {
        valid = this.checkProgramForm()
        if (valid) {
          form = this.program.form
        }
      } else if (type === 'file') {
        valid = this.checkFileForm()
        if (valid) {
          form = this.file.form
        }
      } else if (type === 'video') {
        valid = this.checkVideoForm()
        if (valid) {
          form = this.video.form
        }
      }
      if (valid) {
        return form
      } else {
        return false
      }
    },
    checkTextForm() {
      let form = this.text.form
      if (form.content == '') {
        return false
      } else {
        return true
      }
    },
    checkImageForm() {
      let form = this.image.form
      if (form.imageUrl == '') {
        return false
      } else {
        return true
      }
    },
    checkImageTextForm() {
      if (this.imageText.isValid) {
        return true
      } else {
        return false
      }
    },
    checkProgramForm() {
      if (this.program.isValid) {
        return true
      } else {
        return false
      }
    },
    checkFileForm() {
      let form = this.file.form
      if (form.file == '') {
        return false
      } else {
        return true
      }
    },
    checkVideoForm() {
      let form = this.video.form
      if (form.video == '') {
        return false
      } else {
        return true
      }
    },
    // 清除表单数据
    clearFormData() {
      // console.log('清除数据')
      // 清除带有弹窗的数据
      this.imageText.isValid = false
      this.program.isValid = false
      // 重置所有表单数据
      this.cloneFormData()
    },
    showMaterialSelectDialog(data) {
      // console.log(data)
      this.numerType = data
      this.materialSelectDialog.config.visible = true
      // if (this.materialType === 'image_text') {
      //   this.tableData = []
      //   this.getImageTextPage()
      // } else {
      this.getMaterialGroups()
      // }
      // this.getMaterialGroups()
    },
    // 获取素材分组列表
    getMaterialGroups() {
      this.menuTableData = []
      let type = this.materialType
      // if (type == 'image_text') {
      //   console.log('如果等于图文')
      //   if (this.numerType == 'numer') {
      //     type = 'numerous_image_text'
      //   } else if (this.numerType == 'single') {
      //     type = 'image_text'
      //   }
      // }
      let params = {
        pageNum: 1,
        pageSize: 999,
        type: type
      }
      this.$http.getMaterialGroups(params).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          if (item.series == 1) {
            this.menuTableData.push(item)
          }
        })
        // this.menuTableData = list
        if (list.length > 0) {
          // 默认选中第一项
          this.currentRow = list[0]
          this.selectedGroupID = ''
        }
        this.getMaterialPage()
      })
    },
    // getMoreMaterialNo(groupId, name) {
    //   console.log('进来之后筛选')
    //   this.menuTableData = []
    //   let type = this.materialType
    //   let params = {
    //     pageNum: 1,
    //     pageSize: 999,
    //     type: type,
    //     groupId: groupId,
    //     name: name
    //   }
    //   this.$http.getMaterialGroups(params).then(res => {
    //     let list = res.data.data.list
    //     list.forEach(item => {
    //       if (item.series == 1) {
    //         this.menuTableData.push(item)
    //       }
    //     })
    //     // this.menuTableData = list
    //     if (list.length > 0) {
    //       // 默认选中第一项
    //       this.currentRow = list[0]
    //       this.selectedGroupID = ''
    //     }
    //     this.getMoreImageTextPage()
    //     // this.getMaterialPage()
    //   })
    // },

    // getMoreImageTextPage(groupId, name) {
    //   let type = this.materialType
    //   let params = {
    //     type: type,
    //     groupId: groupId,
    //     pageNum: 1,
    //     pageSize: 999,
    //     name: name
    //   }
    //   this.$http.numMoregraphic(params).then(res => {
    //     let list = res.data.data.list
    //     list.forEach(item => {
    //       this.$set(item, 'selected', false)
    //     })
    //     this.tableData = list
    //     this.customerTotal = this.tableData.length
    //   })
    // },

    _handleCurrentChange(row) {
      this.currentRow = row
      this.getMaterialPage(row.id)
    },
    getMaterialPage(groupId, name) {
      let type = this.materialType
      let url = 'getMaterialPage'
      if (type == 'image_text') {
        if (this.numerType == 'numer') {
          type = 'numerous_image_text'
          url = 'numMoregraphic'
        } else if (this.numerType == 'single') {
          type = 'image_text'
          url = 'getMaterialPage'
        }
      }
      let params = {
        type: type,
        groupId: groupId,
        pageNum: 1,
        pageSize: 999,
        name: name
      }
      this.getgrapicList(url, params)
    },
    getgrapicList(officer, params) {
      this.$http[officer](params).then(res => {
        // console.log(res.data.data.list)
        let list = res.data.data.list
        list.forEach(item => {
          this.$set(item, 'selected', false)
        })
        // console.log('返回值' + list[0].selected)
        this.tableData = list
        this.customerTotal = this.tableData.length
      })
    },
    showTextDetailDialog(row) {
      this.textDetailDialog.config.visible = true
      this.textDetailDialog.content = row.content
    },
    cancelSelected() {
      this.tableData.forEach(item => {
        this.$set(item, 'selected', false)
      })
      this.selectedMaterial = {}
    },
    confirmSelected(row, index) {
      this.tableData.forEach(item => {
        this.$set(item, 'selected', false)
      })
      this.$set(this.tableData[index], 'selected', true)
      this.selectedMaterial = row
    },
    // 提交选中的素材
    submitSelectedMaterial() {
      // 判断是否已选择素材
      if (Object.keys(this.selectedMaterial).length !== 0) {
        let type = this.materialType
        let obj = this.selectedMaterial
        if (type === 'text') {
          this.setTextForm(obj)
        } else if (type === 'image') {
          this.setImageForm(obj)
        } else if (type === 'image_text' || type === 'numerous_image_text') {
          if (this.numerType == 'numer') {
            if (obj.isRadar) {
              this.getInteractRadarDetail(obj.radarId)
              setTimeout(() => {
                let list = []
                list.push({
                  type: 'image_text',
                  radarId:obj.radarId,
                  isBehaviorTag: this.fileList.isBehaviorTag,
                  isBehaviorNotice: this.fileList.isBehaviorNotice,
                  isActionNotice: this.fileList.isActionNotice,
                  behaviorTagList: this.fileList.behaviorTagList
                })
                this.$emit('fileList', list)
              }, 100)
            }
            // console.log('多图文', obj)
            this.getNumerLink(obj)
          } else if (this.numerType == 'single') {
            if (obj.isRadar) {
              this.getInteractRadarDetail(obj.radarId)
              setTimeout(() => {
                let list = []
                list.push({
                  type: 'image_text',
                  radarId:obj.radarId,
                  isBehaviorTag: this.fileList.isBehaviorTag,
                  isBehaviorNotice: this.fileList.isBehaviorNotice,
                  isActionNotice: this.fileList.isActionNotice,
                  behaviorTagList: this.fileList.behaviorTagList
                })
                this.$emit('fileList', list)
              }, 100)
            }
            // console.log('单图文', obj)
            this.setImageTextForm(obj)
          }
        } else if (type === 'program') {
          this.setProgramForm(obj)
        } else if (type === 'file') {
          // setTimeout(() => {
          // console.log('文件类型获取的obj', obj)
          // return
          // this.file.form.file = obj.file
          // this.file.form.name = obj.fileName
          // this.file.form.fileName = obj.fileName
          // this.emitDataToParent()
          // }, 100)
          // console.log('从素材库中选择的时候替换', this.file.form.name)
          if (obj.isRadar) {
            this.getInteractRadarDetail(obj.radarId)
            setTimeout(() => {
              let list = []
              list.push({
                type: 'file',
                radarId:obj.radarId,
                isBehaviorTag: this.fileList.isBehaviorTag,
                isBehaviorNotice: this.fileList.isBehaviorNotice,
                isActionNotice: this.fileList.isActionNotice,
                behaviorTagList: this.fileList.behaviorTagList
              })
              this.$emit('fileList', list)
            }, 100)
          }
          this.setFileForm(obj)
        } else if (type === 'video') {
          if (obj.isRadar) {
            this.getInteractRadarDetail(obj.radarId)
            setTimeout(() => {
              let list = []
              list.push({
                type: 'video',
                radarId:obj.radarId,
                isBehaviorTag: this.fileList.isBehaviorTag,
                isBehaviorNotice: this.fileList.isBehaviorNotice,
                isActionNotice: this.fileList.isActionNotice,
                behaviorTagList: this.fileList.behaviorTagList
              })
              this.$emit('fileList', list)
              console.log(list)
            }, 100)
          }
          this.setVideoForm(obj)
        }
        this.materialSelectDialog.config.visible = false
        this.materialTextImageSelectDialog.config.visible = false
        this.selectedMaterial = {}
      } else {
        this.$message.warning('请选择素材')
      }
    },
    // 取消选择素材
    closeSelectedMaterial() {
      this.selectedMaterial = {}
      this.materialSelectDialog.config.visible = false
      this.materialTextImageSelectDialog.config.visible = false
      this.selectTextName = ''
    },
    // 获取多图文的link和code
    getNumerLink(obj) {
      console.log(obj)
      this.$http.getLinkandCode({ id: obj.id }).then(res => {
        this.imageText.form.name = obj.name
        this.imageText.form.link = res.data.data.link
        this.imageText.form.content = obj.content
        this.imageText.form.imageUrl = obj.imageUrl
        this.imageText.form.mediaId = res.data.data.materialId
        this.imageText.form.radarId = obj.radarId ? obj.radarId : ''
        this.imageText.form.quoteId = obj.id ? obj.id : ''
        this.imageText.form.mark = 'numerousImageText'
        this.imageText.isValid = true
      })
    },

    /**
     * 第二批需求新增逻辑
     */
    // 插入替换文案或表情
    insertTextMsg(val) {
      let textInput = document.getElementById(this.inputId)
      // 插入表情
      let insert = textInput.selectionStart
      this.text.form.content = textInput.value.substr(0, insert) + val + textInput.value.substr(insert)
    },
    // 插入替换文案
    // async insertTextMsg(myValue) {
    //   let textInput = document.getElementById(this.inputId)
    //   if (textInput.selectionStart || textInput.selectionStart === 0) {
    //     let startPos = textInput.selectionStart
    //     let endPos = textInput.selectionEnd
    //     this.text.form.content =
    //       textInput.value.substring(0, startPos) + myValue + textInput.value.substring(endPos, textInput.value.length)
    //     await this.$nextTick()
    //     textInput.focus()
    //     textInput.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
    //   } else {
    //     this.text.form.content += myValue
    //   }
    // }
    // insertTextMsg(val) {
    //   let content = ''
    //   if (val === 'customer') {
    //     content = '<客户昵称>'
    //   } else if (val === 'member') {
    //     content = '<成员昵称>'
    //   } else if (val === 'define') {
    //     content = '<编辑关键词>'
    //   }
    //   let textInput = document.getElementById('textInput')
    //   // 插入表情
    //   let insert = textInput.selectionStart
    //   this.text.form.content = textInput.value.substr(0, insert) + content + textInput.value.substr(insert)
    // }
    //
    // 打开选择雷达的弹窗
    showRadarSelectionDialog() {
      this.radarDialog.config.visible = true
      this.getRadarPage()
    },
    // 获取雷达列表
    getRadarPage() {
      let type = ''
      if (this.materialType === 'image_text') {
        type = 'link'
      } else if (this.materialType === 'file') {
        type = 'file'
      }
      let params = {
        pageNum: this.radarDialog.page.pageNum,
        pageSize: this.radarDialog.page.pageSize,
        type: type,
        title: ''
      }
      this.$http.getInteractRadarPage(params).then(res => {
        this.radarDialog.data = res.data.data.list
        this.radarDialog.page.total = res.data.data.total
      })
    },
    onRadarSizeChange(val) {
      this.radarDialog.page.pageSize = val
      this.radarDialog.page.pageNum = 1
      this.getRadarPage()
    },
    onRadarPageChange(val) {
      this.radarDialog.page.pageNum = val
      this.getRadarPage()
    },
    // 雷达选项改变
    handleRadarSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.radarTable.clearSelection()
        this.$refs.radarTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.radarDialog.multipleSelection = list
      } else {
        this.radarDialog.multipleSelection = val
      }
    },
    // 从雷达中选择
    chooseRadar() {
      if (this.radarDialog.multipleSelection.length <= 0) {
        this.$message.warning('请选择雷达')
      } else if (this.radarDialog.multipleSelection.length > 1) {
        this.$message.warning('只能选择一条雷达')
      } else {
        let obj = this.radarDialog.multipleSelection[0]
        if (this.materialType === 'image_text') {
          this.imageText.form.name = obj.linkTitle
          this.imageText.form.link = obj.link
          this.imageText.form.content = obj.linkAbstract
          this.imageText.form.imageUrl = obj.linkCover
          this.imageText.isValid = true
        } else if (this.materialType === 'file') {
          this.file.form.file = obj.fileUrl
          this.file.form.name = obj.fileName
          this.file.form.fileName = obj.fileName.split('.')[0]
          this.emitDataToParent()
        }
        this.radarDialog.config.visible = false
        this.$emit('getRadarModel', obj)
      }
    },
    // 从小程序列表中选择小程序
    showProgramSelectDialog() {
      this.programDialog.config.visible = true
      this.$http.getProgarm().then(res => {
        this.programDialog.data = res.data.data
      })
    },
    handleProgramSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.programTable.clearSelection()
        this.$refs.programTable.toggleRowSelection(val[val.length - 1])
        let list = []
        list.push(val[val.length - 1])
        this.programDialog.multipleSelection = list
      } else {
        this.programDialog.multipleSelection = val
      }
    },
    chooseProgram() {
      let obj = this.programDialog.multipleSelection[0]
      this.programDialog.config.visible = false
      this.program.form.name = obj.name
      this.program.form.link = obj.page
      this.program.form.programId = obj.wxAppId
      this.program.form.imageUrl = obj.logo
      this.program.isValid = true
    },

    // zhw
    getInteractRadarDetail(id) {
      this.$http.getInteractRadarDetail({ id: id }).then(res => {
        this.fileList = res.data.data
      })
    }
    // zhw end
  }
}
</script>

<style lang="scss" scoped>
.material-editor {
  width: 100%;
  // height: 350px;
  // overflow: auto;
  box-sizing: border-box;
  .edit-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menu-item {
      position: relative;
      flex: 1;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &::after {
        content: '';
        position: absolute;
        left: 30%;
        right: 30%;
        bottom: 10px;
        width: 44%;
        border-bottom: 2px solid transparent;
      }
      i {
        font-size: 20px;
      }
      span {
        font-size: 16px;
        margin-left: 5px;
      }
    }
    .active {
      color: $--color-primary;
      position: relative;
      &::after {
        // border-color: $--color-primary;
        width: 14px;
        height: 14px;
        border: solid #eeeeee;
        border-width: 2px 0 0 2px;
        background-color: #ffffff;
        transform: rotate(45deg);
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        margin: 0 auto;
        z-index: 9999;
      }
    }
  }
  .edit-content {
    position: relative;
    width: 100%;
    // height: 280px;
    border: 1px solid #eee;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    .text_image {
      padding-top: 10px;
      &::v-deep .el-textarea__inner {
        padding: 15px;
      }
    }
    .btn-group {
      position: absolute;
      top: 10px;
      right: 0px;
      display: flex;
    }
    .upload-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .cont-wrap {
        position: relative;
        width: 100px;
        height: 100px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        // box-sizing: border-box;
        cursor: pointer;
        .icon {
          position: absolute;
          font-size: 30px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #b5b5b5;
        }
      }
      .cont-tips {
        margin-top: 10px;
        font-size: 13px;
      }
    }
    .img-show {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .img-box {
        width: 202px;
        height: 152px;
        position: relative;
        border: 1px solid #eee;
      }
    }
    .video-show {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .video-box {
        width: 202px;
        height: 152px;
        position: relative;
        border: 1px solid #eee;
      }
    }
    .image-text-show {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .image-text-box {
        position: relative;
        width: 402px;
        padding: 10px;
        min-height: 132px;
        max-height: 200px;
        border: 1px solid #eee;
        line-height: 1.3;
        overflow-x: hidden;
        overflow-y: auto;
        .box-title {
          width: calc(100% - 30px);
          line-height: 30px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .box-content {
          display: flex;
          .cont-desc {
            flex: 1;
            margin-left: 10px;
            margin-right: 30px;
            overflow: hidden;
          }
        }
      }
    }
    .program-show {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .program-box {
        width: 402px;
        height: 90px;
        padding: 10px;
        position: relative;
        border: 1px solid #eee;
        .box-title {
          line-height: 30px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .box-content {
          display: flex;
          .cont-desc {
            flex: 1;
            margin-left: 10px;
            margin-right: 30px;
            line-height: 1.3;
            overflow: hidden;
          }
        }
      }
    }
    .file-show {
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .file-box {
        width: 402px;
        height: 102px;
        padding: 10px;
        position: relative;
        border: 1px solid #eee;
        .box-content {
          display: flex;
          .cont-desc {
            flex: 1;
            margin-left: 10px;
            margin-right: 30px;
            overflow: hidden;
          }
        }
      }
    }
    .el-icon-delete {
      position: absolute;
      top: 10px;
      right: -30px;
      font-size: 24px;
      cursor: pointer;
      color: #f56c6c;
    }
    .el-icon-edit-outline {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      color: #294a7b;
      cursor: pointer;
    }
    .image-text-box {
      .el-icon-delete {
        position: absolute;
        top: 40px !important;
        right: 10px !important;
      }
    }
    .img-box {
      .el-icon-delete {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
  .edit-content-tips {
    font-size: 12px;
    padding-top: 10px;
    color: #888;
  }
  // .edit-footer {
  //   // margin-bottom: 15px;
  // }
}
.selection-content {
  width: 100%;
  height: 630px;
  box-sizing: border-box;
  .selection-btn {
    margin: auto;
  }
}
.submit-btn {
  width: 200px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  background-color: #294a7b;
  margin: 60px auto;
  border-radius: 3px;
  cursor: pointer;
}
.query-table-box {
  .search-content {
    display: flex;
    .search-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
.table-box {
  display: flex;
  .box-left {
    width: 262px;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    box-sizing: border-box;
  }
  .box-right {
    // width: calc(100% - 262px);
    width: 100%;
    box-sizing: border-box;
    border-right: 1px solid #ebeef5;
  }
}
.group-btn {
  display: flex;
  margin-top: 20px;
  flex-direction: row-reverse;
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
::v-deep .el-textarea__inner {
  border: none;
  height: 150px;
}
::v-deep .tip-text {
  background-color: #f9f9f9;
}
::v-deep .el-form-item--small.el-form-item {
  margin-right: 20px;
}
::v-deep thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}

// 第二批需求新增样式
.extend-option {
  margin-top: 20px;
  .option-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .option-content--box {
      display: flex;
      align-items: center;
      // margin-bottom: 15px;
    }
    .option-left {
      width: 120px;
      padding-right: 12px;
      box-sizing: border-box;
      text-align: left;
    }
    .option-right {
      .right-group {
        display: flex;
        .group-item {
          padding: 5px 10px;
          border: 1px solid #294a7b;
          border-radius: 3px;
          color: #294a7b;
          cursor: pointer;
          margin-right: 10px;
        }
      }
    }
  }
  .option-tips {
    margin-left: 120px;
    color: #b5b5b5;
  }
}
.radar-tag-list {
  span {
    display: inline-block;
    border: 1px solid #dcdfe6;
    padding: 2px 5px;
    margin: 0 8px 7px 0;
    border-radius: 3px;
  }
}

// zhw
.menu-div {
  ul {
    width: 100%;
    display: flex;
    li {
      flex: 1;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
    .active {
      color: #294a7b;
    }
  }
}
.box-right {
  margin: 20px;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid #ebeef5;
}
.group-btn {
  display: flex;
  margin-top: 20px;
  flex-direction: row-reverse;
}
// zhw end
</style>
