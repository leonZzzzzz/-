<template>
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
    <div class="edit-content">
      <template v-if="materialType === 'text'">
        <div>
          <el-input v-model="text.form.content" type="textarea" placeholder="请输入话术内容" show-word-limit>
          </el-input>
        </div>
      </template>
      <template v-if="materialType === 'image'">
        <div class="upload-content" v-if="image.form.imageUrl === ''">
          <!-- <ImageUpload
            imageType="qywx"
            :image-url="image.form.imageUrl"
            :on-success="e => (image.form.imageUrl = e)"
          ></ImageUpload> -->
          <image-upload v-model="image.form.imageUrl"></image-upload>
          <div class="cont-tips">支持jpg/png格式，最大2MB</div>
          <div class="btn-group" v-if="fromMaterial">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <el-button type="primary" size="small" @click="showMaterialSelectDialog">从素材库中选择</el-button>
            </el-button-group>
          </div>
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
          <video-upload @onSuccess="videoUploadSuccess"></video-upload>
          <!-- <VideoUpload @onSuccess="videoUploadSuccess"></VideoUpload> -->
          <div class="cont-tips">支持mp4格式，最大10MB</div>
          <div class="btn-group" v-if="fromMaterial">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <el-button type="primary" size="small" @click="showMaterialSelectDialog">从素材库中选择</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="video-show" v-else>
          <div class="video-box">
            <div style="display: flex; flex-direction: column;">
              <video-preview :videoData="video.form" height="150px" width="200px"></video-preview>
              <!-- <video :src="video.form.videoUrl" controls style="width: 200px; height: 150px;"></video> -->
              <i class="el-icon-delete" @click="video.form.videoUrl = ''"></i>
              <!-- <el-button size="mini" @click="getVideoDetatil">加载视频</el-button> -->
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
          <div class="btn-group" v-if="fromMaterial">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <!-- <el-button type="primary" size="small" @click="showSelectionDialog">从图文素材中选择</el-button> -->
              <el-button type="primary" size="small" @click="showMaterialSelectDialog">从素材库中选择</el-button>
            </el-button-group>
          </div>
          <div class="btn-group" v-else>
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <!-- <el-button type="primary" size="small" @click="showSelectionDialog">从图文素材中选择</el-button> -->
            </el-button-group>
          </div>
        </div>
        <div class="image-text-show" v-else>
          <div class="image-text-box">
            <div class="box-title">{{ imageText.form.name }}</div>
            <div class="box-content">
              <image-preview :imageUrl="imageText.form.imageUrl" height="80px" width="80px"></image-preview>
              <!-- <img style="width: 80px; height: 80px" :src="`${imgHost}${imageText.form.imageUrl}`" fit="cover" /> -->
              <div class="cont-desc">{{ imageText.form.content }}</div>
            </div>
            <div>
              <a style="color: #294a7b;" :href="imageText.form.link" target="_blank">{{ imageText.form.link }}</a>
            </div>
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
          <div class="btn-group" v-if="fromMaterial">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <el-button type="primary" size="small" @click="showMaterialSelectDialog">从素材库中选择</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="program-show" v-else>
          <div class="program-box">
            <div class="box-title">{{ program.form.name }}</div>
            <div class="box-content">
              <img style="width: 100px; height: 100px" :src="`${imgHost}${program.form.imageUrl}`" fit="cover" alt="" />
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
          <!-- <FileUpload @onSuccess="fileUploadSuccess"></FileUpload> -->
          <div class="cont-tips">文件最大20MB</div>
          <div class="btn-group" v-if="fromMaterial">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-folder-opened"></el-button>
              <el-button type="primary" size="small" @click="showMaterialSelectDialog">从素材库中选择</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="file-show" v-else>
          <div class="file-box">
            <div class="box-content">
              <i class="el-icon-document" style="font-size: 32px; color: #294A7B;"></i>
              <div class="cont-desc">{{ file.form.name || file.form.fileName }}</div>
            </div>
            <i class="el-icon-delete" @click="file.form.file = ''"></i>
          </div>
        </div>
      </template>
    </div>

    <com-dialog :config="imageText.dialog.config" @closeDialog="imageText.dialog.config.visible = false">
      <div class="dialog-content">
        <el-form :model="imageText.form" :rules="rules" ref="imageTextModel" label-position="right" label-width="auto">
          <el-form-item label="名称" prop="name">
            <el-input v-model="imageText.form.name" placeholder="请输入名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input v-model="imageText.form.link" placeholder="请输入链接地址" clearable> </el-input>
          </el-form-item>
          <el-form-item label="简介" prop="content">
            <el-input v-model="imageText.form.content" placeholder="请输入链接简介" clearable> </el-input>
          </el-form-item>
          <el-form-item label="封面" prop="imageUrl">
            <!-- <ImageUpload
              imageType="qywx"
              :image-url="imageText.form.imageUrl"
              :on-success="e => (imageText.form.imageUrl = e)"
            ></ImageUpload> -->
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
              imageType="qywx"
              :image-url="program.form.imageUrl"
              :on-success="e => (program.form.imageUrl = e)"
            ></ImageUpload> -->
            <image-upload v-model="program.form.imageUrl"></image-upload>
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
          <com-pagination :page="selectionDialog.page"></com-pagination>
        </div>
        <div class="submit-btn selection-btn" @click="chooseImageText">确定</div>
      </div>
    </com-dialog>
    <!-- 从素材库中选择素材 -->
    <com-dialog :config="materialSelectDialog.config" @closeDialog="materialSelectDialog.config.visible = false">
      <div class="selection-content" style="height: unset;">
        <div class="table-box">
          <div class="box-left">
            <select-table
              :tableData="menuTableData"
              :column="menuColumn"
              :currentRow="currentRow"
              :isFull="false"
              :height="500"
              @handleCurrentChange="_handleCurrentChange"
            >
            </select-table>
          </div>
          <div class="box-right">
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
          </div>
        </div>
        <div class="group-btn">
          <el-button style="margin-right: 20px;" type="primary" @click="submitSelectedMaterial">确定</el-button>
          <el-button style="margin-right: 20px;" @click="closeSelectedMaterial">取消</el-button>
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
  </div>
</template>

<script>
import ComDialog from '../common/ComDialog'
import FileUpload from '../common/FileUpload'
import VideoUpload from '../common/VideoUpload'
import ComPagination from '../common/ComPagination'
import SelectTable from '../common/SelectTable'
import ComTable from '../common/ComTable'
import VideoPreview from '../common/VideoPreview'
import ImagePreview from '../common/ImagePreview'
import ImageUpload from '../common/ImageUpload'

const menus = [
  { type: 'text', title: '文字', icon: 'el-icon-edit' },
  { type: 'image', title: '图片', icon: 'el-icon-picture-outline' },
  { type: 'video', title: '视频', icon: 'el-icon-video-camera' },
  { type: 'image_text', title: '图文', icon: 'el-icon-link' },
  // { type: 'program', title: '小程序', icon: 'el-icon-chat-round' },
  { type: 'file', title: '文件', icon: 'el-icon-document-add' }
]
export default {
  components: {
    ComDialog,
    FileUpload,
    VideoUpload,
    ComPagination,
    SelectTable,
    ComTable,
    VideoPreview,
    ImagePreview,
    ImageUpload
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
        callback(new Error('请输入简介'))
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
            formatter: (row) => {
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
          prop: 'content',
          formatter: (row) => {
            return (
              <div>
                {row.content.length > 100 ? (
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
          label: '操作人',
          minWidth: '150px',
          align: 'center',
          prop: 'createBy'
        },
        {
          label: '操作时间',
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
                  <el-button type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消添加
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    添加素材
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
          formatter: (row) => {
            return (
              <div>
                <image-preview imageUrl={row.imageUrl} height="90px"></image-preview>
              </div>
            )
          }
        },
        {
          label: '操作人',
          minWidth: '150px',
          align: 'center',
          prop: 'createBy'
        },
        {
          label: '操作时间',
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
                  <el-button type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消添加
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    添加素材
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
          formatter: (row) => {
            return (
              <div>
                <video-preview videoData={row}></video-preview>
              </div>
            )
          }
        },
        {
          label: '操作人',
          minWidth: '150px',
          align: 'center',
          prop: 'createBy'
        },
        {
          label: '操作时间',
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
                  <el-button type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消添加
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    添加素材
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
          formatter: (row) => {
            return (
              <div>
                <image-preview imageUrl={row.imageUrl} height="90px"></image-preview>
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
          formatter: (row) => {
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
          label: '图文简介',
          minWidth: '150px',
          align: 'center',
          prop: 'content',
          formatter: (row) => {
            return (
              <div>
                {row.content.length > 100 ? (
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
          label: '操作时间',
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
                  <el-button type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消添加
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    添加素材
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
          formatter: (row) => {
            return <div>{row.name || row.fileName}</div>
          }
        },
        {
          label: '操作人',
          minWidth: '150px',
          align: 'center',
          prop: 'createBy'
        },
        {
          label: '操作时间',
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
                  <el-button type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消添加
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    添加素材
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
      }
    }
  },
  created() {
    this.getImageTextLink()
    this.cloneFormData()
  },
  methods: {
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
      this.imageText.form.name = obj.name
      this.imageText.form.link = obj.link
      this.imageText.form.content = obj.content
      this.imageText.form.imageUrl = obj.imageUrl
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
    },
    setVideoForm(obj) {
      this.video.form.fileId = obj.fileId
      this.video.form.videoUrl = obj.videoUrl
    },
    getVideoDetail(row, index) {
      let that = this
      let fileId = row.fileId
      if (fileId) {
        that.$http.getVideoSignatureDetail({ fileId }).then((res) => {
          let videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
          that.$set(that.materialDialog.tableData[index], 'videoUrl', videoUrl)
        })
      } else {
        that.$message.warning('无效的素材内容，请重新上传')
      }
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
      that.$http.getImageTextPage(that.selectionDialog.page).then((res) => {
        that.selectionDialog.data = res.data.data.list
        that.selectionDialog.page.total = res.data.data.total
      })
    },
    // 新增图文，跳转到图文编辑页
    goToNewPage() {
      this.$router.push('/main/base/news/detail')
    },
    // 选项改变
    handleSelectionChange(val) {
      console.log('返回选项长度' + val.length)
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
    onSizeChange(val) {
      this.selectionDialog.page.pageSize = val
      this.selectionDialog.page.pageNum = 1
      this.getImageTextPage()
    },
    onPageChange(val) {
      this.selectionDialog.page.pageNum = val
      this.getImageTextPage()
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
    // 删除当前图文信息
    deleteCurrentImageText() {
      this.imageText.form.name = ''
      this.imageText.form.link = ''
      this.imageText.form.content = ''
      this.imageText.form.imageUrl = ''
      this.imageText.isValid = false
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
    // 视频上传成功
    videoUploadSuccess(video) {
      // this.video.form.videoUrl = video.videoUrl
      // console.log('获取视频签名')
      this.video.form.fileId = video.fileId
      this.video.form.videoUrl = video.videoUrl
    },
    // 获取视频详情
    getVideoDetatil() {
      let that = this
      let fileId = that.video.form.fileId
      that.$http.getVideoSignatureDetail({ fileId }).then((res) => {
        that.video.form.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
      })
    },
    // 文件上传成功
    fileUploadSuccess(file) {
      this.file.form.name = file.name
      this.file.form.fileName = file.name.split('.')[0]
      this.file.form.file = file.address
    },
    // 图文信息校验
    checkAndSubmitImageText() {
      this.$refs.imageTextModel.validate((valid) => {
        if (valid) {
          // 验证通过关闭弹窗
          this.imageText.isValid = true
          this.imageText.dialog.config.visible = false
        }
      })
    },
    // 小程序
    checkAndSubmitProgram() {
      this.$refs.programModel.validate((valid) => {
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
    showMaterialSelectDialog() {
      this.materialSelectDialog.config.visible = true
      this.getMaterialGroups()
    },
    // 获取素材分组列表
    getMaterialGroups() {
      let type = this.materialType
      let params = {
        pageNum: 1,
        pageSize: 999,
        type: type
      }
      this.$http.getMaterialGroups(params).then((res) => {
        let list = res.data.data.list
        this.menuTableData = list
        if (list.length > 0) {
          // 默认选中第一项
          this.currentRow = list[0]
          this.selectedGroupID = list[0].id
          this.getMaterialPage(list[0].id)
        }
      })
    },
    _handleCurrentChange(row) {
      this.currentRow = row
      this.getMaterialPage(row.id)
    },
    getMaterialPage(groupId) {
      let params = {
        groupId: groupId,
        pageNum: 1,
        pageSize: 999
      }
      this.$http.getMaterialPage(params).then((res) => {
        let list = res.data.data.list
        list.forEach((item) => {
          this.$set(item, 'selected', false)
        })
        // console.log('返回值' + list[0].selected)
        this.tableData = list
      })
    },
    showTextDetailDialog(row) {
      this.textDetailDialog.config.visible = true
      this.textDetailDialog.content = row.content
    },
    cancelSelected() {
      this.tableData.forEach((item) => {
        this.$set(item, 'selected', false)
      })
      this.selectedMaterial = {}
    },
    confirmSelected(row, index) {
      this.tableData.forEach((item) => {
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
        } else if (type === 'image_text') {
          this.setImageTextForm(obj)
        } else if (type === 'program') {
          this.setProgramForm(obj)
        } else if (type === 'file') {
          this.setFileForm(obj)
        } else if (type === 'video') {
          this.setVideoForm(obj)
        }
        this.materialSelectDialog.config.visible = false
        this.selectedMaterial = {}
      } else {
        this.$message.warning('请选择素材')
      }
    },
    // 取消选择素材
    closeSelectedMaterial() {
      this.selectedMaterial = {}
      this.materialSelectDialog.config.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.material-editor {
  width: 100%;
  height: 350px;
  border: 1px solid #eee;
  box-sizing: border-box;
  .edit-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
    .menu-item {
      flex: 1;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 20px;
      }
      span {
        font-size: 16px;
        margin-left: 5px;
      }
    }
    .active {
      color: #294a7b;
      background-color: #ffffff;
    }
  }
  .edit-content {
    width: 100%;
    height: 280px;
    position: relative;
    .btn-group {
      position: absolute;
      top: 10px;
      right: 10px;
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
        width: 402px;
        height: 132px;
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
        height: 132px;
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
    }
    .el-icon-edit-outline {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 24px;
      color: #294a7b;
      cursor: pointer;
    }
  }
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
    width: calc(100% - 262px);
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
  height: 230px;
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
</style>
