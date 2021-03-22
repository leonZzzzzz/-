<template>
  <div class="material">
    <div class="container">
      <div class="query-table-box">
        <div class="search-content">
          <div class="search-input">
            <el-input size="small" placeholder="请输入素材内容" v-model="search.page.name"></el-input>
          </div>
          <el-button size="small" type="primary" @click="searchFormData">查询</el-button>
          <el-button size="small" type="info" @click="resetSearchFormData">重置</el-button>
        </div>
      </div>
      <!-- 分类列表start -->
      <template v-if="!isSearchForm">
        <div class="table-info">
          <div class="info-left">
            <div class="tabs">
              <div
                class="tab-item"
                v-for="(item, index) in categoryList"
                :key="index"
                :class="item.type === categoryType ? 'tab-active' : ''"
                @click="categoryChange(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="info-right">
            <el-button size="small" type="primary" @click="showMaterialAddDialog">新增素材</el-button>
            <el-button size="small" type="primary" @click="showManagementDialog">管理分组</el-button>
          </div>
        </div>
        <div class="common-table-box">
          <div class="table-box-left">
            <select-table
              :tableData="menuTableData"
              :column="menuColumn"
              :currentRow="currentRow"
              @handleCurrentChange="_handleCurrentChange"
            >
            </select-table>
          </div>
          <div class="table-box-right">
            <template v-if="categoryType === 'text'">
              <com-table :tableData="tableData" :column="textColumn"></com-table>
            </template>
            <template v-else-if="categoryType === 'image'">
              <com-table :tableData="tableData" :column="imageColumn"></com-table>
            </template>
            <template v-else-if="categoryType === 'video'">
              <com-table :tableData="tableData" :column="videoColumn"></com-table>
            </template>
            <template v-else-if="categoryType === 'image_text'">
              <com-table :tableData="tableData" :column="imageTextColumn"></com-table>
            </template>
            <template v-else-if="categoryType === 'file'">
              <com-table :tableData="tableData" :column="fileColumn"></com-table>
            </template>
          </div>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"> </com-pagination>
        </div>
      </template>
      <!-- 分类列表end -->
      <!-- 搜索列表start -->
      <template v-else>
        <div class="search-box">
          <div class="search-table">
            <com-table :tableData="search.tableData" :column="search.column"></com-table>
          </div>
          <div class="common-pagination">
            <com-pagination
              :page="search.page"
              @sizeChange="searchSizeChange"
              @pageChange="searchPageChange"
            ></com-pagination>
          </div>
        </div>
      </template>
      <!-- 搜索列表end -->
    </div>
    <!-- 新增分组 -->
    <com-dialog :config="groupAddDialog.config" @closeDialog="groupAddDialog.config.visible = false">
      <div class="group-dialog">
        <el-form
          :model="groupAddDialog.model"
          :rules="groupRules"
          ref="groupAddModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="groupAddDialog.model.name" placeholder="请输入分组名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="选择素材类型" prop="selectedCategory">
            <el-select v-model="groupAddDialog.model.selectedCategory" disabled placeholder="请选择">
              <el-option v-for="(item, index) in options.category" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="groupAddDialog.model.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="addGroup">确定</div>
      </div>
    </com-dialog>
    <!-- 新增素材弹窗 -->
    <com-dialog :config="materialAddDialog.config" @closeDialog="materialAddDialog.config.visible = false">
      <div class="material-dialog">
        <div class="material">
          <material-editor
            ref="materialEditorAdd"
            :fromMaterial="false"
            :materialType="materialAddDialog.materialType"
            @typeChange="materialTypeChange"
          >
          </material-editor>
        </div>
        <div class="extend-option">
          <div class="option-content">
            <div class="option-left">行为标签</div>
            <div class="option-right">
              <div class="right-btn" v-if="selectedBehaviorTags.length <= 0" @click="showBehaviorDialog">添加</div>
              <div class="right-tag" v-for="(item, index) in selectedBehaviorTags" :key="index">{{ item }}</div>
              <div class="right-edit-btn" v-if="selectedBehaviorTags.length > 0" @click="showBehaviorDialog">编辑</div>
            </div>
          </div>
          <div class="option-tips">(即发送该素材内容给客户时自动打上对应的标签)</div>
        </div>
        <div class="extend-option">
          <div class="option-content">
            <div class="option-left">搜索关键词</div>
            <div class="option-right">
              <div class="right-btn" v-if="selectedKeyWords.length <= 0" @click="showKeySelectDialog">添加</div>
              <div class="right-tag" v-for="(item, index) in selectedKeyWords" :key="index">{{ item }}</div>
              <div class="right-edit-btn" v-if="selectedKeyWords.length > 0" @click="showKeySelectDialog">编辑</div>
            </div>
          </div>
        </div>
        <div class="dialog-input" v-if="materialAddDialog.materialType === 'image'">
          <div class="left-input">素材名称</div>
          <div class="input-content">
            <el-input v-model="materialAddDialog.input.imageName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
        <div class="dialog-input" v-if="materialAddDialog.materialType === 'video'">
          <div class="left-input">素材名称</div>
          <div class="input-content">
            <el-input v-model="materialAddDialog.input.videoName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
        <div class="category">
          <div class="category-select">
            <div class="left-input">选择分组</div>
            <div class="right-select">
              <el-select v-model="materialAddDialog.groupId" placeholder="请选择">
                <el-option v-for="item in options.group" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="category-select" style="width: 100%;">
            <span style="width: 73px;">选择标签&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div class="tag-group">
              <el-tag v-for="(tag, index) in materialAddDialog.tagList" :key="index" :disable-transitions="false">
                {{ tag.name }}
              </el-tag>
              <el-button type="primary" size="small" @click="showTagDialog">+ 点击选择</el-button>
            </div>
          </div> -->
        </div>
        <div class="dialog-submit-btn">
          <el-button
            type="primary"
            size="small"
            style="padding: 14px 50px"
            @click="checkAndSubmitMaterialData('add')"
            :loading="materialAddDialog.loading"
            >确定</el-button
          >
        </div>
      </div>
    </com-dialog>
    <!-- 管理分组弹窗 -->
    <com-dialog :config="managementDialog.config" @closeDialog="closeManagementDialog">
      <div class="management-dialog">
        <div class="query-table">
          <el-button size="small" type="primary" @click="showManagementGroupDialog">新增分组</el-button>
        </div>
        <div class="common-table-box">
          <tree-table :tableData="managementDialog.tableData" :column="managementDialog.column"></tree-table>
        </div>
      </div>
    </com-dialog>
    <!-- 编辑分组弹窗 -->
    <com-dialog :config="groupEditDialog.config" @closeDialog="closeGroupEditDialog">
      <div class="group-dialog">
        <el-form
          :model="groupEditDialog.model"
          :rules="groupRules"
          ref="groupEditModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="groupEditDialog.model.name" placeholder="请输入分组名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="groupEditDialog.model.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="editGroup">确定</div>
      </div>
    </com-dialog>
    <!-- 管理分组-新增分组弹窗 -->
    <com-dialog :config="managementGroupDialog.config" @closeDialog="closeManagementGroupDialog">
      <div class="group-dialog">
        <el-form
          :model="managementGroupDialog.model"
          :rules="groupRules"
          ref="managementModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="managementGroupDialog.model.name" placeholder="请输入分组名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="选择素材类型" prop="selectedCategory">
            <el-select v-model="managementGroupDialog.model.selectedCategory" placeholder="请选择">
              <el-option v-for="(item, index) in options.category" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="managementGroupDialog.model.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn" @click="addManagementGroup">确定</div>
      </div>
    </com-dialog>
    <!-- 选择标签弹窗 -->
    <com-dialog :config="tagDialog.config" @closeDialog="closeTagDialog">
      <div class="tag-content">
        <div class="selection-table">
          <el-table
            ref="multipleTable"
            :data="selectionData"
            style="width: 100%"
            height="400px"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
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
        <div class="submit-btn submit-btn-add" @click="submitSelectionData">确定</div>
      </div>
    </com-dialog>
    <!-- 文本详情弹窗 -->
    <com-dialog :config="textDetailDialog.config" @closeDialog="textDetailDialog.config.visible = false">
      <div class="text-detail">
        <div class="content">{{ textDetailDialog.content }}</div>
      </div>
      <div class="submit-btn" @click="textDetailDialog.config.visible = false">关闭</div>
    </com-dialog>
    <!-- 编辑素材弹窗 -->
    <com-dialog :config="materialEditDialog.config" @closeDialog="closeMaterialEditDialog">
      <div class="material-dialog">
        <div class="material">
          <material-editor
            ref="materialEditorEdit"
            :fromMaterial="false"
            :menus="editorMenus"
            :materialType="materialEditDialog.materialType"
            :editForm="materialEditDialog.editForm"
          >
          </material-editor>
        </div>
        <div class="extend-option">
          <div class="option-content">
            <div class="option-left">素材行为标签</div>
            <div class="option-right">
              <div class="right-btn" v-if="selectedBehaviorTags.length <= 0" @click="showBehaviorDialog">添加</div>
              <div class="right-tag" v-for="(item, index) in selectedBehaviorTags" :key="index">{{ item }}</div>
              <div class="right-edit-btn" v-if="selectedBehaviorTags.length > 0" @click="showBehaviorDialog">编辑</div>
            </div>
          </div>
          <div class="option-tips">(即发送该素材内容给客户时自动打上对应的标签)</div>
        </div>
        <div class="extend-option">
          <div class="option-content">
            <div class="option-left">素材搜索关键词</div>
            <div class="option-right">
              <div class="right-btn" v-if="selectedKeyWords.length <= 0" @click="showKeySelectDialog">添加</div>
              <div class="right-tag" v-for="(item, index) in selectedKeyWords" :key="index">{{ item }}</div>
              <div class="right-edit-btn" v-if="selectedKeyWords.length > 0" @click="showKeySelectDialog">编辑</div>
            </div>
          </div>
        </div>
        <div class="dialog-input" v-if="materialEditDialog.materialType === 'image'">
          <div class="left-input">素材名称</div>
          <div class="input-content">
            <el-input v-model="materialEditDialog.input.imageName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
        <div class="dialog-input" v-if="materialEditDialog.materialType === 'video'">
          <div class="left-input">素材名称</div>
          <div class="input-content">
            <el-input v-model="materialEditDialog.input.videoName" placeholder="请输入素材名称"> </el-input>
          </div>
        </div>
        <div class="category">
          <div class="category-select">
            <div class="left-input">选择分组</div>
            <div class="right-select">
              <el-select v-model="materialEditDialog.groupId" disabled placeholder="请选择">
                <el-option v-for="item in options.group" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="category-select" style="width: 100%;">
            <span style="width: 73px;">选择标签&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div class="tag-group">
              <el-tag v-for="(tag, index) in materialEditDialog.tagList" :key="index" :disable-transitions="false">
                {{ tag.name }}
              </el-tag>
              <el-button type="primary" size="small" @click="showTagEditDialog">+ 点击选择</el-button>
            </div>
          </div> -->
        </div>
        <div class="dialog-submit-btn">
          <el-button
            type="primary"
            size="small"
            @click="checkAndSubmitMaterialData('edit')"
            :loading="materialEditDialog.loading"
            >&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;确定&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-button
          >
        </div>
      </div>
    </com-dialog>
    <!-- 编辑素材-素材标签弹窗 -->
    <com-dialog :config="tagEditDialog.config" @closeDialog="closeTagEditDialog">
      <div class="tag-content">
        <div class="selection-table">
          <el-table
            ref="multipleTable"
            :data="selectionData"
            style="width: 100%"
            height="400px"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
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
        <div class="submit-btn submit-btn-add" @click="submitTagData">确定</div>
      </div>
    </com-dialog>
    <!-- 素材搜索关键词 -->
    <simple-dialog
      :config="keySelectDialog.config"
      @closeDialog="closeKeySelectDialog"
      @handleConfirm="closeKeySelectDialog"
    >
      <div class="keyword-content">
        <div class="add-btn" @click="showKeyAddDialog">添加</div>
        <div
          class="com-item"
          v-for="(item, index) in keyWordList"
          :key="index"
          :class="checkKeyWordActive(item) ? 'active' : ''"
          @click="onKeyWordSelect(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </simple-dialog>
    <!-- 新增关键词 -->
    <simple-dialog :config="keyAddDialog.config" @closeDialog="closeKeyAddDialog" @handleConfirm="addKeyWord">
      <div class="keyword-add">
        <div class="left-input">关键词</div>
        <div class="input-content">
          <el-input
            type="text"
            v-model="keyAddDialog.keyword"
            placeholder="最多6个字"
            maxlength="6"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </simple-dialog>
    <!-- 选择行为标签弹窗 -->
    <simple-dialog :config="behaviorDialog.config" @closeDialog="closeBehaviorDialog" @handleConfirm="saveBehaviorTag">
      <div class="behavior-dialog">
        <div class="selected-content">
          <div class="content-left">已选</div>
          <div class="content-right">
            <div class="selected-tag" v-for="(item, index) in selectedBehaviorTags" :key="index">
              <span>{{ item }}</span>
              <i class="el-icon-close" @click="cancelSelectBehaviorTag(item)"></i>
            </div>
          </div>
        </div>
        <div class="behavior-list">
          <div class="behavior-group" v-for="(item, index) in behaviorTagList" :key="index">
            <div class="group-title">{{ item.name }}</div>
            <div class="group-content">
              <div
                class="tag-item"
                v-for="(obj, idx) in item.tagList"
                :key="idx"
                :class="checkBehaviorTagActive(obj) ? 'active' : ''"
                @click="onBehaviorTagSelect(obj)"
              >
                {{ obj.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </simple-dialog>
  </div>
</template>

<script>
import SelectTable from '../../../components/common/SelectTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import MaterialEditor from '../../../components/common/SimpleMaterialEditor'
import ComTable from '../../../components/common/ComTable'
import TreeTable from '../../../components/common/TreeTable'
import VideoPreview from '../../../components/common/VideoPreview'
import ImagePreview from '../../../components/common/ImagePreview'
import SimpleDialog from '../../../components/common/SimpleDialog'
export default {
  components: {
    SelectTable,
    ComPagination,
    ComDialog,
    MaterialEditor,
    ComTable,
    TreeTable,
    VideoPreview,
    ImagePreview,
    SimpleDialog
  },
  data() {
    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分组名称'))
      } else {
        callback()
      }
    }
    return {
      options: {
        category: [
          { label: '文字素材', value: 'text' },
          { label: '图片素材', value: 'image' },
          { label: '视频素材', value: 'video' },
          { label: '图文素材', value: 'image_text' },
          // { label: '小程序', value: 'program' },
          { label: '文件素材', value: 'file' }
        ], //分类
        group: [], // 分组
        selectedCategory: '',
        selectedGroup: ''
      },
      categoryType: 'text',
      categoryList: [
        { name: '文字素材', type: 'text' },
        { name: '图片素材', type: 'image' },
        { name: '视频素材', type: 'video' },
        { name: '图文素材', type: 'image_text' },
        // { name: '小程序', type: 'program' },
        { name: '文件素材', type: 'file' }
      ],
      menuTableData: [], // 左边菜单数据
      currentRow: {}, // 选中项
      menuColumn: [
        {
          label: '分组名称',
          align: 'center',
          minWidth: '250px',
          prop: 'name',
          formatter: (row) => {
            return (
              <div>
                {row.id != 'add-new' ? (
                  <div>{row.name}&nbsp;&nbsp;&nbsp;&nbsp;</div>
                ) : (
                  // <el-button type="text" icon="el-icon-plus" onClick={this.showGroupAddDialog()}>新增分组</el-button>
                  <div class="group-btn" onClick={this.showGroupAddDialog.bind(this, row)}>
                    <i class="el-icon-plus" />
                    &nbsp;&nbsp;新增分组
                  </div>
                )}
              </div>
            )
          }
        }
      ],
      selectedGroupID: '', // 当前选择的分组ID
      tableData: [], // 素材列表
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
                  <div onClick={this.showTextDetailDialog.bind(this, row)}>
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
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showMaterialEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row.id)}>
                  删除
                </el-button>
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
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showMaterialEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row.id)}>
                  删除
                </el-button>
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
            return <video-preview videoData={row}></video-preview>
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
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showMaterialEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row.id)}>
                  删除
                </el-button>
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
                  <div onClick={this.showTextDetailDialog.bind(this, row)}>
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
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showMaterialEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row.id)}>
                  删除
                </el-button>
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
          formatter: (row) => {
            return (
              <div>
                <el-button type="text" onClick={this.showMaterialEditDialog.bind(this, row)}>
                  编辑
                </el-button>
                <el-button type="text" onClick={this.deleteMaterial.bind(this, row.id)}>
                  删除
                </el-button>
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
      groupRules: {
        name: [{ required: true, validator: nameValidator, trigger: 'blur' }]
      },
      groupEditDialog: {
        config: {
          width: '600px',
          title: '编辑分组',
          visible: false
        },
        model: {}
      },
      groupAddDialog: {
        config: {
          width: '600px',
          title: '新增分组',
          visible: false
        },
        model: {
          name: '',
          sequence: 0,
          selectedCategory: ''
        }
      },
      materialAddDialog: {
        config: {
          width: '800px',
          title: '新增素材',
          visible: false
        },
        input: {
          imageName: '',
          videoName: ''
        },
        materialType: 'text',
        groupId: '',
        tagList: [],
        loading: false
      },
      managementDialog: {
        // 管理分组弹窗
        config: {
          width: '900px',
          title: '管理分组',
          visible: false
        },
        tableData: [],
        column: [
          {
            label: '分组名称',
            align: 'left',
            minWidth: '250px',
            prop: 'name'
          },
          {
            label: '新增时间',
            align: 'left',
            minWidth: '150px',
            prop: 'createTime'
          },
          {
            label: '操作',
            align: 'center',
            minWidth: '150px',
            formatter: (row) => {
              return (
                <div>
                  {row.parentId !== '0' ? (
                    <div>
                      <el-button type="text" onClick={this.showGroupEditDialog.bind(this, row)}>
                        编辑
                      </el-button>
                      <el-button type="text" onClick={this.deleteGroup.bind(this, row.id)}>
                        删除
                      </el-button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              )
            }
          }
        ]
      },
      managementGroupDialog: {
        // 管理分组-新增分组弹窗
        config: {
          width: '600px',
          title: '新增分组',
          visible: false
        },
        model: {
          name: '',
          sequence: 0,
          selectedCategory: 'text'
        }
      },
      tagDialog: {
        config: {
          width: '900px',
          title: '选择标签',
          visible: false
        }
      },
      selectionData: [],
      selectionColumn: [
        {
          type: 'selection',
          align: 'center',
          width: '55px'
        },
        {
          label: '标签名称',
          align: 'center',
          minWidth: '150px',
          prop: 'name'
        },
        {
          label: '备注',
          align: 'center',
          minWidth: '150px',
          prop: 'describe'
        },
        {
          label: '排序号',
          align: 'center',
          minWidth: '150px',
          prop: 'sequence'
        }
      ],
      selectionPage: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      multipleSelection: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.id
      },
      // 文本详情弹窗
      textDetailDialog: {
        config: {
          width: '500px',
          title: '素材内容',
          visible: false
        },
        content: ''
      },
      // 编辑素材弹窗
      materialEditDialog: {
        config: {
          width: '800px',
          title: '编辑素材',
          visible: false
        },
        input: {
          imageName: '',
          videoName: ''
        },
        materialType: '',
        groupId: '',
        tagList: [],
        editForm: {},
        loading: false
      },
      editorMenus: [
        { type: 'text', title: '文字', icon: 'el-icon-edit', disabled: false },
        { type: 'image', title: '图片', icon: 'el-icon-picture-outline', disabled: false },
        { type: 'video', title: '视频', icon: 'el-icon-video-camera', disabled: false },
        { type: 'image_text', title: '图文', icon: 'el-icon-link', disabled: false },
        // { type: 'program', title: '小程序', icon: 'el-icon-chat-round', disabled: false },
        { type: 'file', title: '文件', icon: 'el-icon-document-add', disabled: false }
      ],
      tagEditDialog: {
        config: {
          width: '900px',
          title: '选择标签',
          visible: false
        }
      },
      isSearchForm: false, // 判断是否为搜索表单
      search: {
        tableData: [],
        column: [
          {
            type: 'index',
            label: '序号',
            minWidth: '150px',
            align: 'center'
          },
          {
            label: '素材内容',
            minWidth: '150px',
            align: 'center',
            prop: 'content',
            formatter: (row, column, cellValue, index) => {
              return {
                text: (
                  <div>
                    {row.content !== undefined && row.content.length > 100 ? (
                      <div onClick={this.showTextDetailDialog.bind(this, row)}>
                        {row.content.slice(0, 100) + '...'}
                        <el-button type="text" onClick={this.showTextDetailDialog.bind(this, row)}>
                          详情
                        </el-button>
                      </div>
                    ) : (
                      row.content
                    )}
                  </div>
                ),
                image: (
                  <div>
                    <image-preview imageUrl={row.imageUrl} height="90px"></image-preview>
                  </div>
                ),
                image_text: (
                  <div>
                    <el-tag size="mini" style="margin-right: 10px;">
                      图文
                    </el-tag>
                    {row.name}
                  </div>
                ),
                video: (
                  <video-preview videoData={row}></video-preview>
                  // <div style="display: flex; justify-content: center;">
                  //   <div style="width: 150px; display: flex; flex-direction: column;">
                  //     <video style="width: 150px; height: 100px;" src={row.videoUrl} controls="controls" />
                  //     <el-button type="small" onClick={this.getSearchVideoDetail.bind(this, row, index)}>
                  //       加载视频
                  //     </el-button>
                  //   </div>
                  // </div>
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
            align: 'center',
            prop: 'createBy'
          },
          {
            label: '类型',
            minWidth: '150px',
            align: 'center',
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
          total: 0,
          name: ''
        }
      },
      keySelectDialog: {
        config: {
          width: '600px',
          title: '选择素材搜索关键词',
          visible: false
        }
      },
      keyAddDialog: {
        config: {
          width: '600px',
          title: '新增关键词',
          visible: false
        },
        keyword: ''
      },
      keyWordList: [], // 关键词列表
      selectedKeyWordIds: [], // 当前选择的关键词id列表
      selectedKeyWords: [], // 存储选择的关键词名称列表
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择素材行为标签',
          visible: false
        }
      },
      behaviorTagList: [], // 行为标签列表
      selectedBehaviorTagIds: [], // 当前选择的行为标签id列表
      selectedBehaviorTags: [] // 存储选择的行为标签名称列表
    }
  },
  created() {
    this.getMaterialGroups()
  },
  methods: {
    // 搜索列表数据
    searchFormData() {
      this.isSearchForm = true
      this.search.page.pageNum = 1
      this.search.page.pageSize = 15
      this.getSearchFormData()
    },
    // 重置搜索
    resetSearchFormData() {
      this.search.page.name = ''
      this.isSearchForm = false
      this.getMaterialGroups()
    },
    searchSizeChange(val) {
      this.search.page.pageSize = val
      this.search.page.pageNum = 1
      this.getSearchFormData()
    },
    searchPageChange(val) {
      this.search.page.pageNum = val
      this.getSearchFormData()
    },
    getSearchFormData() {
      this.$http.getMaterialPage(this.search.page).then((res) => {
        this.search.tableData = res.data.data.list
        this.search.page.total = res.data.data.total
      })
    },
    categoryChange(item) {
      this.categoryType = item.type
      this.getMaterialGroups()
    },
    // 获取素材分组列表
    getMaterialGroups() {
      let type = this.categoryType
      let params = {
        pageNum: 1,
        pageSize: 999,
        type: type
      }
      this.$http.getMaterialGroups(params).then((res) => {
        let list = res.data.data.list
        this.menuTableData = list
        let obj = {
          id: 'add-new',
          name: '新增'
        }
        this.menuTableData.push(obj)
        if (list.length > 0) {
          // 默认选中第一项
          this.currentRow = list[0]
          this.selectedGroupID = list[0].id
          this.getMaterialPage(list[0].id)
        }
      })
    },
    // 根据分组获取素材列表
    getMaterialPage(groupId) {
      let params = {
        groupId: groupId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      this.$http.getMaterialPage(params).then((res) => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    _handleCurrentChange(row) {
      if (row.id !== 'add-new') {
        this.selectedGroupID = row.id
        this.page.pageNum = 1
        this.page.pageSize = 15
        this.currentRow = row
        this.getMaterialPage(row.id)
      }
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getMaterialPage(this.selectedGroupID)
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getMaterialPage(this.selectedGroupID)
    },
    // 显示新增分组弹窗
    showGroupAddDialog() {
      this.groupAddDialog.config.visible = true
      this.groupAddDialog.model.selectedCategory = this.categoryType
      this.groupAddDialog.model.name = ''
    },
    // 新增分组
    addGroup() {
      this.$refs.groupAddModel.validate((valid) => {
        if (valid) {
          let params = {
            name: this.groupAddDialog.model.name,
            type: this.groupAddDialog.model.selectedCategory,
            sequence: this.groupAddDialog.model.sequence
          }
          this.$http.addMaterialGroup(params).then(() => {
            this.$message.success('新增分组成功')
            this.groupAddDialog.config.visible = false
            this.getMaterialGroups()
          })
        }
      })
    },
    // 显示新增素材弹窗
    showMaterialAddDialog() {
      this.getGroupOptions(this.categoryType)
      this.materialAddDialog.materialType = this.categoryType
      if (this.selectedGroupID !== 'add-new') {
        this.materialAddDialog.groupId = this.selectedGroupID
      } else {
        this.materialAddDialog.groupId = ''
      }
      this.materialAddDialog.config.visible = true
      this.$nextTick(() => {
        this.$refs.materialEditorAdd.clearFormData()
      })
      // 清空选择的关键词列表
      this.selectedKeyWords = []
      this.selectedKeyWordIds = []
      // 清空选择的行为标签列表
      this.selectedBehaviorTags = []
      this.selectedBehaviorTagIds = []
    },
    // 素材类型改变
    materialTypeChange(val) {
      this.materialAddDialog.materialType = val
      this.getGroupOptions(val)
    },
    getGroupOptions(type) {
      this.materialAddDialog.groupId = ''
      let params = {
        pageNum: 1,
        pageSize: 999,
        type: type
      }
      this.$http.getMaterialGroups(params).then((res) => {
        let list = res.data.data.list
        let newList = []
        list.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.id
          }
          newList.push(obj)
        })
        // console.log('分组列表' + newList.length)
        this.options.group = newList
        // if (list.length > 0) {
        //   // 默认选择第一项
        //   this.materialAddDialog.groupId = list[0].id
        // }
      })
    },
    // 显示管理分组弹窗
    showManagementDialog() {
      // this.managementDialog.config.visible = true
      this.getMaterialGroupTree()
    },
    // 获取分组结构树
    getMaterialGroupTree() {
      this.$http.getMaterialGroupTree().then((res) => {
        this.managementDialog.tableData = res.data.data
        this.managementDialog.config.visible = true
      })
    },
    // 关闭管理分组弹窗
    closeManagementDialog() {
      this.managementDialog.config.visible = false
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.getMaterialGroups()
    },
    // 显示编辑分组弹窗
    showGroupEditDialog(row) {
      this.groupEditDialog.model = Object.assign({}, row)
      this.groupEditDialog.config.visible = true
    },
    // 更新分组信息
    editGroup() {
      this.$refs.groupEditModel.validate((valid) => {
        if (valid) {
          // 验证通过提交数据
          this.$http.updateMaterialGroup(this.groupEditDialog.model).then(() => {
            // 关闭弹窗，获取分组信息
            this.$message.success('编辑成功')
            this.groupEditDialog.config.visible = false
            this.getMaterialGroupTree()
          })
        }
      })
    },
    closeGroupEditDialog() {
      this.groupEditDialog.config.visible = false
    },
    // 删除分组
    deleteGroup(id) {
      this.$confirm('是否删除改分组', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteMaterialGroup({ id }).then(() => {
          // 重置page，获取分组列表
          this.$message.success('删除成功')
          this.getMaterialGroupTree()
        })
      })
    },
    showManagementGroupDialog() {
      this.managementGroupDialog.config.visible = true
    },
    addManagementGroup() {
      this.$refs.managementModel.validate((valid) => {
        if (valid) {
          let params = {
            name: this.managementGroupDialog.model.name,
            type: this.managementGroupDialog.model.selectedCategory,
            sequence: this.managementGroupDialog.model.sequence
          }
          this.$http.addMaterialGroup(params).then(() => {
            this.$message.success('新增分组成功')
            this.closeManagementGroupDialog()
            this.getMaterialGroupTree()
          })
        }
      })
    },
    closeManagementGroupDialog() {
      this.managementGroupDialog.config.visible = false
      this.managementGroupDialog.model.name = ''
      this.managementGroupDialog.model.selectedCategory = 'text'
      this.managementGroupDialog.model.sequence = 0
    },
    // 显示标签弹窗
    showTagDialog() {
      this.getMaterialTagPage()
      this.tagDialog.config.visible = true
    },
    getMaterialTagPage() {
      this.$http.getMaterialTagPage(this.selectionPage).then((res) => {
        this.selectionData = res.data.data.list
        this.selectionPage.total = res.data.data.total
      })
    },
    onSelectionSizeChange(val) {
      this.selectionPage.pageSize = val
      this.selectionPage.pageNum = 1
      this.getMaterialTagPage()
    },
    onSelectionPageChange(val) {
      this.selectionPage.pageNum = val
      this.getMaterialTagPage()
    },
    // 选项改变
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选中的项目' + val.length)
      // console.log('选项' + this.multipleSelection)
    },
    handleCloseTag(tag) {
      this.materialAddDialog.tagList.splice(this.materialAddDialog.tagList.indexOf(tag), 1)
      this.multipleSelection.splice(this.multipleSelection.indexOf(tag), 1)
    },
    closeTagDialog() {
      this.tagDialog.config.visible = false
    },
    submitSelectionData() {
      this.materialAddDialog.tagList = []
      this.multipleSelection.forEach((item) => {
        this.materialAddDialog.tagList.push(item)
      })
      this.tagDialog.config.visible = false
    },
    // 校验并新增\修改素材
    checkAndSubmitMaterialData(submitType) {
      // 校验格式
      let type = ''
      if (submitType === 'edit') {
        type = this.materialEditDialog.materialType
      } else {
        type = this.materialAddDialog.materialType
      }
      let params = {}
      if (submitType === 'add') {
        params = this.$refs.materialEditorAdd.checkMaterialValid()
      } else {
        params = this.$refs.materialEditorEdit.checkMaterialValid()
      }
      if (type === 'text') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitMaterialData(type, params)
          } else if (submitType === 'edit') {
            this.updateMaterialData(type, params)
          }
        } else {
          this.$message.warning('请输入素材内容')
        }
      } else if (type === 'image') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            if (this.materialAddDialog.input.imageName === '') {
              this.$message.warning('请输入素材名称')
            } else {
              params.name = this.materialAddDialog.input.imageName
              this.submitMaterialData(type, params)
            }
          } else if (submitType === 'edit') {
            if (this.materialEditDialog.input.imageName === '') {
              this.$message.warning('请输入素材名称')
            } else {
              params.name = this.materialEditDialog.input.imageName
              this.updateMaterialData(type, params)
            }
          }
        } else {
          this.$message.warning('请添加图片')
        }
      } else if (type === 'image_text') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitMaterialData(type, params)
          } else if (submitType === 'edit') {
            this.updateMaterialData(type, params)
          }
        } else {
          this.$message.warning('请添加图文')
        }
      } else if (type === 'program') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitMaterialData(type, params)
          } else if (submitType === 'edit') {
            this.updateMaterialData(type, params)
          }
        } else {
          this.$message.warning('请添加小程序')
        }
      } else if (type === 'file') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitMaterialData(type, params)
          } else if (submitType === 'edit') {
            this.updateMaterialData(type, params)
          }
        } else {
          this.$message.warning('请上传文件')
        }
      } else if (type === 'video') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            if (this.materialAddDialog.input.videoName === '') {
              this.$message.warning('请输入素材名称')
            } else {
              let fileId = params.fileId
              params.name = this.materialAddDialog.input.videoName
              this.$http.getVideoSignatureDetail({ fileId }).then((res) => {
                params.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
                this.submitMaterialData(type, params)
              })
            }
          } else if (submitType === 'edit') {
            if (this.materialEditDialog.input.videoName === '') {
              this.$message.warning('请输入素材名称')
            } else {
              let that = this
              let fileId = params.fileId
              params.name = that.materialEditDialog.input.videoName
              that.$http.getVideoSignatureDetail({ fileId }).then((res) => {
                params.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
                that.submitMaterialData(type, params)
              })
            }
          }
        } else {
          this.$message.warning('请上传视频')
        }
      }
    },
    submitMaterialData(type, params) {
      params.type = type
      if (this.materialAddDialog.groupId !== '') {
        this.materialAddDialog.loading = true
        let list = []
        this.materialAddDialog.tagList.forEach((item) => {
          let obj = {
            id: item.id
          }
          list.push(obj)
        })
        this.$set(params, 'materialTagList', list)
        this.$set(params, 'groupId', this.materialAddDialog.groupId)
        // 添加关键词字段
        this.$set(params, 'searchWordId', this.selectedKeyWordIds.join('_'))
        // 添加行为标签
        let behaviorTagList = this.selectedBehaviorTagIds.map((item) => {
          let obj = {
            id: item
          }
          return obj
        })
        this.$set(params, 'behaviorTagList', behaviorTagList)
        this.$http.addMaterialData(params).then(() => {
          this.$message.success('新增素材成功')
          this.materialAddDialog.loading = false
          // 重置page，重新获取分类，列表数据，关闭弹窗
          this.page.pageNum = 1
          this.page.pageSize = 15
          this.materialAddDialog.tagList = []
          this.materialAddDialog.groupId = ''
          this.materialAddDialog.input.imageName = ''
          this.materialAddDialog.input.videoName = ''
          this.getMaterialGroups()
          this.materialAddDialog.config.visible = false
        })
      } else {
        this.$message.warning('请选择分组')
      }
    },
    updateMaterialData(type, form) {
      this.materialEditDialog.loading = true
      let obj = this.materialEditDialog.editForm
      // 添加行为标签
      let behaviorTagList = this.selectedBehaviorTagIds.map((item) => {
        return { id: item }
      })
      let params = {
        id: obj.id,
        appId: obj.appId,
        isDeleted: obj.isDeleted,
        createTime: obj.createTime,
        type: type,
        name: form.name,
        content: form.content,
        imageUrl: form.imageUrl,
        videoUrl: form.videoUrl,
        link: form.link,
        programId: form.programId,
        file: form.file,
        fileId: form.fileId,
        fileName: form.fileName || form.name.split('.')[0],
        createBy: obj.createBy,
        source: obj.source,
        groupId: obj.groupId,
        materialTagList: this.materialEditDialog.tagList,
        groupName: obj.groupName,
        searchWordId: this.selectedKeyWordIds.join('_'),
        behaviorTagList: behaviorTagList
      }
      this.$http.updateMaterialData(params).then(() => {
        this.$message.success('修改素材成功')
        this.materialEditDialog.loading = false
        this.page.pageNum = 1
        this.page.pageSize = 15
        this.getMaterialPage(this.selectedGroupID)
        this.materialEditDialog.config.visible = false
      })
    },
    showTextDetailDialog(row) {
      this.textDetailDialog.config.visible = true
      this.textDetailDialog.content = row.content
    },
    // 删除素材
    deleteMaterial(id) {
      this.$confirm('是否删除改素材？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteMaterialData({ id }).then(() => {
          this.$message.success('删除成功')
          this.page.pageNum = 1
          this.page.pageSize = 15
          this.getMaterialPage(this.selectedGroupID)
        })
      })
    },
    // 打开编辑素材弹窗
    showMaterialEditDialog(row) {
      // 获取素材详情
      let id = row.id
      // 只可编辑当前类型素材，其它类型禁用
      this.editorMenus.forEach((item) => {
        item.disabled = true
      })
      if (row.type === 'text') {
        this.editorMenus[0].disabled = false
      } else if (row.type === 'image') {
        this.editorMenus[1].disabled = false
      } else if (row.type === 'video') {
        this.editorMenus[2].disabled = false
      } else if (row.type === 'image_text') {
        this.editorMenus[3].disabled = false
      } else if (row.type === 'file') {
        this.editorMenus[4].disabled = false
      }
      this.$http.getMaterialDetail({ id }).then((res) => {
        let data = res.data.data
        this.$set(this.materialEditDialog, 'editForm', data)
        this.getGroupOptions(data.type)
        this.materialEditDialog.materialType = data.type
        this.materialEditDialog.groupId = data.groupId
        this.materialEditDialog.tagList = data.materialTagList
        if (data.type === 'image') {
          this.materialEditDialog.input.imageName = data.name
        } else if (data.type === 'video') {
          this.materialEditDialog.input.videoName = data.name
        } else {
          this.materialEditDialog.input.imageName = ''
          this.materialEditDialog.input.videoName = ''
        }
        this.materialEditDialog.config.visible = true
        this.$nextTick(() => {
          this.$refs.materialEditorEdit.clearFormData()
          this.$refs.materialEditorEdit.setEditFormData()
        })
        // 获取搜索关键词
        let ids = []
        let keywords = []
        if (data.searchWordList) {
          data.searchWordList.forEach((item) => {
            ids.push(item.id)
            keywords.push(item.name)
          })
        }
        this.selectedKeyWordIds = ids
        this.selectedKeyWords = keywords
        // 行为标签
        let behaviorTagIds = []
        let behaviorTags = []
        if (data.behaviorTagList) {
          data.behaviorTagList.forEach((item) => {
            behaviorTagIds.push(item.id)
            behaviorTags.push(item.name)
          })
        }
        this.selectedBehaviorTagIds = behaviorTagIds
        this.selectedBehaviorTags = behaviorTags
      })
    },
    // 显示编辑标签弹窗
    showTagEditDialog() {
      this.getMaterialTagPage()
      this.tagEditDialog.config.visible = true
    },
    closeTagEditDialog() {
      this.tagEditDialog.config.visible = false
    },
    submitTagData() {
      this.materialEditDialog.tagList = []
      this.multipleSelection.forEach((item) => {
        this.materialEditDialog.tagList.push(item)
      })
      this.tagEditDialog.config.visible = false
    },
    // 关闭编辑素材弹窗
    closeMaterialEditDialog() {
      this.materialEditDialog.config.visible = false
    },
    /**
     * 第二批需求新增逻辑
     */
    showKeySelectDialog() {
      this.getKeyWords()
      this.keySelectDialog.config.visible = true
    },
    // 获取关键词列表
    getKeyWords() {
      let params = {
        pageNum: 1,
        pageSize: 999
      }
      this.$http.getMaterialSearchWordPage(params).then((res) => {
        this.keyWordList = res.data.data.list
      })
    },
    // 关键词是否被选中
    checkKeyWordActive(obj) {
      if (this.selectedKeyWordIds.includes(obj.id)) {
        return true
      } else {
        return false
      }
    },
    // 选择关键词
    onKeyWordSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedKeyWordIds.includes(obj.id)) {
        this.selectedKeyWordIds.splice(this.selectedKeyWordIds.indexOf(obj.id), 1)
        this.selectedKeyWords.splice(this.selectedKeyWords.indexOf(obj.name), 1)
      } else {
        if (this.selectedKeyWordIds.length >= 3) {
          this.$message.warning('只能选择三个关键词')
        } else {
          this.selectedKeyWordIds.push(obj.id)
          this.selectedKeyWords.push(obj.name)
        }
      }
    },
    closeKeySelectDialog() {
      this.keySelectDialog.config.visible = false
    },
    showKeyAddDialog() {
      this.keyAddDialog.keyword = ''
      this.keyAddDialog.config.visible = true
    },
    addKeyWord() {
      if (this.keyAddDialog.keyword !== '') {
        let params = {
          name: this.keyAddDialog.keyword,
          sequence: ''
        }
        this.$http.addMaterialSearchWord(params).then(() => {
          this.getKeyWords()
          this.$message.success('新增成功')
          this.keyAddDialog.config.visible = false
        })
      } else {
        this.$message.warning('关键词不能为空')
      }
    },
    closeKeyAddDialog() {
      this.keyAddDialog.config.visible = false
    },
    showBehaviorDialog() {
      let params = {
        pageNum: 1,
        pageSize: 999,
        name: ''
      }
      this.$http.getBehaviorTagPage(params).then((res) => {
        this.behaviorTagList = res.data.data.list
      })
      this.behaviorDialog.config.visible = true
    },
    // 行为标签是否被选中
    checkBehaviorTagActive(obj) {
      if (this.selectedBehaviorTagIds.includes(obj.id)) {
        return true
      } else {
        return false
      }
    },
    // 选择行为标签
    onBehaviorTagSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedBehaviorTagIds.includes(obj.id)) {
        this.selectedBehaviorTagIds.splice(this.selectedBehaviorTagIds.indexOf(obj.id), 1)
        this.selectedBehaviorTags.splice(this.selectedBehaviorTags.indexOf(obj.name), 1)
      } else {
        if (this.selectedBehaviorTagIds.length >= 9) {
          this.$message.warning('只能选择九个行为标签')
        } else {
          this.selectedBehaviorTagIds.push(obj.id)
          this.selectedBehaviorTags.push(obj.name)
        }
      }
    },
    cancelSelectBehaviorTag(name) {
      if (this.selectedBehaviorTags.includes(name)) {
        let idx = this.selectedBehaviorTags.indexOf(name)
        this.selectedBehaviorTagIds.splice(idx, 1)
        this.selectedBehaviorTags.splice(idx, 1)
      }
    },
    closeBehaviorDialog() {
      this.behaviorDialog.config.visible = false
    },
    saveBehaviorTag() {
      this.behaviorDialog.config.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.material {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.query-table-box {
  margin-bottom: 20px;
  .search-content {
    display: flex;
    .search-input {
      width: 300px;
      margin-right: 10px;
    }
  }
}
.table-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  .info-left {
    display: flex;
    .tabs {
      display: flex;
      .tab-item {
        padding: 0 10px 10px 10px;
        margin: 0 20px;
        border-bottom: 2px solid #ffffff;
        color: #222222;
        font-weight: bold;
        cursor: pointer;
      }
      .tab-active {
        color: #294a7b;
        border-bottom: 2px solid #294a7b;
      }
    }
  }
  .info-right {
    display: flex;
  }
}
.common-table-box {
  display: flex;
  .table-box-left {
    width: 302px;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    box-sizing: border-box;
    .tag-group {
      .tag {
        cursor: pointer;
      }
    }
  }
  .table-box-right {
    width: calc(100% - 302px);
    box-sizing: border-box;
  }
  .group-btn {
    cursor: pointer;
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.group-dialog {
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}
.material-dialog {
  padding: 0 20px;
  box-sizing: border-box;
  .material {
    margin-bottom: 20px;
  }
  .dialog-input {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
    margin-left: -18px;
    .left-input {
      width: 100px;
      text-align: right;
      margin-right: 20px;
    }
    .input-content {
      width: 248px;
    }
  }
  .category {
    .category-select {
      width: 345px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      margin-top: 20px;
      margin-left: -18px;
      .left-input {
        width: 100px;
        text-align: right;
        margin-right: 20px;
      }
      .right-select {
        width: 225px;
      }
    }
  }
}
.management-dialog {
  margin-bottom: 20px;
}
.dialog-submit-btn {
  display: flex;
  justify-content: center;
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
.submit-btn-add {
  margin: 10px auto;
}
.tag-content {
  width: 100%;
  height: 520px;
  padding: 0 20px;
  box-sizing: border-box;
}
.text-detail {
  padding: 0 20px;
  box-sizing: border-box;
  .content {
    line-height: 18px;
  }
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

// 第二批需求新增样式
.extend-option {
  margin-left: -18px;
  margin-top: 20px;
  .option-content {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .option-left {
      width: 100px;
      text-align: right;
      margin-right: 20px;
    }
    .option-right {
      display: flex;
      flex-flow: wrap;
      .right-btn {
        color: #294a7b;
        cursor: pointer;
      }
      .right-tag {
        padding: 8px 24px;
        border-radius: 4px;
        background-color: #e8e7e6;
        margin-right: 10px;
        margin-bottom: 8px;
      }
      .right-edit-btn {
        padding: 8px 24px;
        border-radius: 4px;
        background-color: #ffffff;
        margin-right: 10px;
        margin-bottom: 8px;
        cursor: pointer;
        border: 1px solid #e8e7e6;
        box-sizing: border-box;
        color: #294a7b;
      }
    }
  }
  .option-tips {
    color: #b5b5b5;
    margin-left: 120px;
  }
}
.keyword-content {
  display: flex;
  flex-flow: wrap;
  .add-btn {
    padding: 8px 24px;
    border-radius: 4px;
    background-color: #ffffff;
    margin-right: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    border: 1px solid #e8e7e6;
    box-sizing: border-box;
    color: #294a7b;
  }
  .com-item {
    padding: 8px 24px;
    border-radius: 4px;
    background-color: #e8e7e6;
    margin-right: 10px;
    margin-bottom: 8px;
    cursor: pointer;
  }
  .active {
    background-color: #294a7b;
    color: #ffffff;
  }
}
.keyword-add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  .left-input {
    margin-right: 10px;
  }
  .input-content {
    width: 300px;
  }
}
.behavior-dialog {
  width: 100%;
  max-height: 450px;
  overflow: auto;
  .selected-content {
    display: flex;
    margin-bottom: 20px;
    .content-left {
      margin-right: 20px;
      line-height: 34px;
    }
    .content-right {
      display: flex;
      flex-wrap: wrap;
      .selected-tag {
        display: flex;
        align-items: center;
        height: 34px;
        border-radius: 17px;
        padding: 0 10px;
        background-color: #f2f2f2;
        margin-right: 10px;
        margin-bottom: 10px;
        .el-icon-close {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .behavior-list {
    .behavior-group {
      margin-bottom: 20px;
      .group-title {
        margin-bottom: 10px;
      }
      .group-content {
        width: 100%;
        border: 1px solid #d7d7d7;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        .tag-item {
          height: 34px;
          border-radius: 17px;
          padding: 0 10px;
          background-color: #f2f2f2;
          margin-right: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          cursor: pointer;
        }
        .active {
          background-color: #294a7b;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
