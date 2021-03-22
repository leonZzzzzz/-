<template>
  <div class="talking">
    <div class="container">
      <header class="talking-h" v-if="introPage != 'drainage'">
        <el-button type="primary" @click="showSpeechAddDialog" size="small">新建话术</el-button>
        <el-button type="primary" @click="showCategoryDialog" size="small">管理分组</el-button>
        <!-- <el-button type="text">导入话术</el-button> -->
        <el-input
          class="search-input"
          v-model="search.page.searchWordName"
          type="text"
          clearable
          style="width: 260px"
          placeholder="请输入话术内容、关键字"
          @input="searchFormData"
          size="small"
        >
          <!-- <el-button slot="append" icon="el-icon-search" @click="searchFormData"></el-button> -->
        </el-input>
      </header>
      <!-- 分类列表start -->
      <main v-show="!isSearchForm" class="talking-m" :style="introPage == 'drainage' ? 'marginTop:0px' : ''">
        <div class="tabs">
          <div
            class="tabs-item"
            v-for="item in categoryList"
            :key="item.id"
            :class="item.id === currentCategoryID ? 'tabs-item--active' : ''"
            @click="categoryChange(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="common-table-box" id="common-table-box">
          <div class="table-box-left">
            <select-table
              :isFull="isFull"
              :height="tableHeight + 52"
              :loading="menuTableLoading"
              :tableData="menuTableData"
              :column="menuColumn"
              :currentRow="currentRow"
              @handleCurrentChange="_handleCurrentChange"
            ></select-table>
          </div>
          <div class="table-box-right">
            <com-table
              :isFull="isFull"
              :height="tableHeight"
              :loading="tableLoading"
              :tableData="tableData"
              :column="column"
            ></com-table>
          </div>
        </div>
        <div class="common-pagination">
          <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
        </div>
      </main>
      <!-- 分类列表end -->
      <!-- 搜索列表start -->
      <template v-if="isSearchForm">
        <div class="search-box" style="margin-top: 15px">
          <div class="search-table">
            <com-table
              :isFull="isFull"
              :height="searchTableHeight"
              :loading="tableLoading"
              :tableData="search.tableData"
              :column="search.column"
            ></com-table>
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
    <!-- 编辑话术内容 -->
    <com-dialog :config="speechEditDialog.config" @closeDialog="closeSpeechEditDialog">
      <div class="speech-dialog">
        <div class="speech_dialog_content">
          <!-- 编辑区域 -->
          <div class="material">
            <material-editor
              ref="materialEditorEdit"
              :menus="menus"
              :materialType="materialEditor.type"
              :editForm="speechEditDialog.editForm"
              @fileDataChange="materialFileDataChange"
              @typeChange="materialTypeChange"
              @getRadarModel="_geRadarModel"
              @clearRadarSetting="_clearRadarSetting"
              @fileList="fileList"
            >
            </material-editor>
          </div>
          <!-- 表单区域 -->
          <el-form label-width="120px" label-position="left">
            <el-form-item label="选择分组">
              <div class="category-select">
                <el-select v-model="options.selectedCategory" placeholder="请选择" @change="optionChange">
                  <el-option v-for="item in options.category" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="options.selectedGroup" placeholder="请选择" @change="groupOptionChange">
                  <el-option v-for="item in options.group" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="搜索关键词">
              <div class="extend-option">
                <div class="option-content">
                  <div class="option-right">
                    <el-button
                      icon="el-icon-plus"
                      plain
                      size="small"
                      v-if="selectedKeyWords.length <= 0"
                      @click="showKeySelectDialog"
                      >添加</el-button
                    >
                    <!-- <div class="right-btn" v-if="selectedKeyWords.length <= 0" @click="showKeySelectDialog">添加</div> -->
                    <div class="right-tag" v-for="(item, index) in selectedKeyWords" :key="index">{{ item }}</div>
                    <!-- <div class="right-edit-btn" v-if="selectedKeyWords.length > 0" @click="showKeySelectDialog">编辑</div> -->
                    <el-button
                      icon="el-icon-edit"
                      style="height: 32px"
                      plain
                      size="small"
                      v-if="selectedKeyWords.length > 0"
                      @click="showKeySelectDialog"
                      >编辑</el-button
                    >
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="行为标签">
              <div class="form-item__behavior-wrap">
                <div class="behavior-list" ref="behaviorTagList">
                  <div v-if="!behaviorTagList.length">
                    暂无标签
                    <span style="color: #294a7b" @click="$router.push('/main/scrm/tag-library/behavior/list')"
                      >去添加</span
                    >
                  </div>
                  <div class="behavior-group" v-for="(group, index) in behaviorTagList" :key="index">
                    <div class="group-title">{{ group.name }}</div>
                    <div class="group-content">
                      <el-button class="button-new-tag" size="small" @click="behaviorDialogVisible(true, group.tagList)">+ 添加</el-button>
                    <el-tag
                      v-for="tag in selectedBehaviorTagsItem(group.id)"
                      :key="tag.id"
                      :disable-transitions="false"
                      closable
                      @close="onBehaviorTagSelect(tag)">
                      {{tag.name}}
                    </el-tag>

                      <el-tag
                        v-for="tag in group.tagList"
                        :key="tag.id"
                        :disable-transitions="false"
                        :type="selectedBehaviorTags.some((item) => item.id === tag.id) ? '' : 'info'"
                        :effect="selectedBehaviorTags.some((item) => item.id === tag.id) ? 'light' : 'plain'"
                        @click="onBehaviorTagSelect(tag)"
                        style="cursor: pointer"
                      >
                        {{ tag.name }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item> -->
            <el-form-item label="话术标题" v-if="['image', 'video', 'file'].includes(materialEditor.type)">
              <el-input
                v-model="speechEditDialog.input[materialEditor.type + 'Name']"
                maxlength="60"
                show-word-limit
                placeholder="请输入话术标题"
              />
            </el-form-item>
            <el-form-item label="文件简介" v-if="['file'].includes(materialEditor.type)">
              <div style="display: flex; align-items: center">
                <el-input
                  v-model="speechEditDialog.fileDescribe"
                  maxlength="256"
                  show-word-limit
                  placeholder="请输入文件简介(选填)"
                >
                </el-input>
                <el-tooltip
                  effect="dark"
                  placement="right"
                  content="用于发送雷达链接时作为链接的简介展示"
                  style="margin-left: 5px"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <!-- 图文雷达相关start -->
            <!-- <el-form-item label="雷达追踪" v-if="['image_text'].includes(materialEditor.type)">
              <div class="radar-content">
                <input class="check-type" type="checkbox" v-model="imageTextRadarSetting.isRadar" />同步到雷达链接
                <el-tooltip
                  effect="dark"
                  placement="right"
                  content="使用雷达链接发送，可追踪链接打开记录"
                  style="margin-left: 5px"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item> -->
            <el-form-item
              label="雷达信息"
              v-if="
                ['image_text'].includes(materialEditor.type) &&
                speechEditDialog.config.title == '新建话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="imageTextRadarSetting.form.isBehaviorNotice"
                  />行为通知
                  <!-- <el-checkbox v-model="imageTextRadarSetting.form.isBehaviorNotice">行为通知</el-checkbox> -->
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="imageTextRadarSetting.form.isActionNotice"
                  />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="imageTextRadarSetting.form.isBehaviorTag"
                  />客户标签
                  <!-- <el-checkbox v-model="imageTextRadarSetting.form.isBehaviorTag">客户标签</el-checkbox> -->
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="imageTextRadarSetting.form.isBehaviorTag">
                  <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                  <div class="selected-tags-box" v-if="selectedBehaviorTags.length > 0">
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="雷达信息"
              v-if="
                ['image_text'].includes(materialEditor.type) &&
                imageTextRadarSetting.isFromRadar &&
                speechEditDialog.config.title == '编辑话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="imageTextRadarSetting.form.isBehaviorNotice"
                  />行为通知
                  <!-- <el-checkbox v-model="imageTextRadarSetting.form.isBehaviorNotice">行为通知</el-checkbox> -->
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="imageTextRadarSetting.form.isActionNotice"
                  />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="imageTextRadarSetting.form.isBehaviorTag" />
                  客户标签
                  <!-- <el-checkbox v-model="imageTextRadarSetting.form.isBehaviorTag">客户标签</el-checkbox> -->
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="imageTextRadarSetting.form.isBehaviorTag">
                  <div class="selected-tags-box">
                    <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 图文雷达相关end -->

            <!-- 文件雷达相关start -->
            <!-- <el-form-item label="雷达追踪" v-if="['file'].includes(materialEditor.type)">
              <div class="radar-content">
                <input class="check-type" type="checkbox" v-model="fileRadarSetting.isRadar" />同步到雷达链接
                <el-tooltip
                  effect="dark"
                  placement="right"
                  content="使用雷达链接发送，可追踪链接打开记录"
                  style="margin-left: 5px"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item> -->
            <el-form-item
              label="雷达信息"
              v-if="
                ['file'].includes(materialEditor.type) &&
                speechEditDialog.config.title == '新建话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isBehaviorNotice" />行为通知
                  <!-- <el-checkbox v-model="fileRadarSetting.form.isBehaviorNotice">行为通知</el-checkbox> -->
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isActionNotice" />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isBehaviorTag" />客户标签
                  <!-- <el-checkbox v-model="fileRadarSetting.form.isBehaviorTag">客户标签</el-checkbox> -->
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="fileRadarSetting.form.isBehaviorTag">
                  <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                  <div class="selected-tags-box" v-if="selectedBehaviorTags.length > 0">
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!--编辑文件类型的雷达-->
            <el-form-item
              label="雷达信息"
              v-if="
                ['file'].includes(materialEditor.type) &&
                fileRadarSetting.isRadar &&
                speechEditDialog.config.title == '编辑话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isBehaviorNotice" />行为通知
                  <!-- <el-checkbox v-model="fileRadarSetting.form.isBehaviorNotice">行为通知</el-checkbox> -->
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isActionNotice" />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="fileRadarSetting.form.isBehaviorTag" />客户标签
                  <!-- <el-checkbox v-model="fileRadarSetting.form.isBehaviorTag">客户标签</el-checkbox> -->
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="fileRadarSetting.form.isBehaviorTag">
                  <div class="selected-tags-box">
                    <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 文件雷达相关end -->

            <!-- 视频类型雷达start -->
            <!-- <el-form-item label="雷达追踪" v-if="['video'].includes(materialEditor.type)">
              <div class="radar-content">
                <input class="check-type" type="checkbox" v-model="videoRadarSetting.isRadar" />同步到雷达链接
                <el-tooltip
                  effect="dark"
                  placement="right"
                  content="使用雷达链接发送，可追踪链接打开记录"
                  style="margin-left: 5px"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </el-form-item> -->
            <el-form-item
              label="雷达信息"
              v-if="
                ['video'].includes(materialEditor.type) &&
                speechEditDialog.config.title == '新建话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="videoRadarSetting.form.isBehaviorNotice"
                  />行为通知
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="videoRadarSetting.form.isActionNotice"
                  />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="videoRadarSetting.form.isBehaviorTag"
                  />客户标签
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="videoRadarSetting.form.isBehaviorTag">
                  <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                  <div class="selected-tags-box" v-if="selectedBehaviorTags.length > 0">
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="雷达信息"
              v-if="
                ['video'].includes(materialEditor.type) &&
                videoRadarSetting.isRadar &&
                speechEditDialog.config.title == '编辑话术'
              "
            >
              <div class="radar-setting">
                <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="videoRadarSetting.form.isBehaviorNotice"
                  />行为通知
                  <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
                </div>
                <!-- <div class="setting-item">
                  <input
                    class="check-type"
                    type="checkbox"
                    v-model="videoRadarSetting.form.isActionNotice"
                  />动态通知
                  <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
                </div> -->
                <div class="setting-item">
                  <input class="check-type" type="checkbox" v-model="videoRadarSetting.form.isBehaviorTag" />
                  客户标签
                  <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
                </div>
                <div class="setting-tags" v-if="videoRadarSetting.form.isBehaviorTag">
                  <div class="selected-tags-box">
                    <el-button style="margin-bottom: 10px" size="small" @click="addTagDialog"> + 添加标签</el-button>
                    <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                      <span class="tag-name">{{ item.name }}：</span>
                      分值&nbsp;&nbsp;<el-input-number size="mini" v-model="item.businessScore"></el-input-number>
                      <i class="el-icon-remove-outline" @click="deleteSelectedTag(index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 视频类型雷达end -->

            
            <el-form-item label="排序号">
              <el-input-number v-model="seqNum" :step="1" step-strictly :min="0"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <!-- 确认按钮 -->
        <div class="footer_btn" style="display: flex; justify-content: flex-end; margin-top: 20px">
          <el-button @click="cancelCheckAndSubmitSpeechData">取消</el-button>
          <el-button
            type="primary"
            @click="checkAndSubmitSpeechData('edit')"
            :disabled="createNewWordsWayFlag"
            :loading="createNewWordsWayFlag"
            >确定</el-button
          >
          <!-- <el-button type="primary" :loading="speechEditDialog.loading" @click="checkAndSubmitSpeechData('edit')" :disabled="speechEditDialog.loading">确定</el-button> -->
        </div>
        <!-- <div class="dialog-submit-btn">
          <el-button
            type="primary"
            size="small"
            :loading="speechEditDialog.loading"
            style="padding: 14px 50px"
            @click="checkAndSubmitSpeechData('edit')"
            >确定</el-button
          >
        </div> -->
      </div>
    </com-dialog>
    <!-- 添加分组-从二级分组直接添加 -->
    <com-dialog :config="groupAddDialog.config" @closeDialog="showGroupAddDialog(false)">
      <div class="group-dialog">
        <el-form :model="groupAddForm" :rules="groupRules" ref="groupAddModel" label-position="left" label-width="auto">
          <el-form-item label="分组名称" prop="name">
            <el-input
              v-model="groupAddForm.name"
              placeholder="请输入分组名称"
              clearable
              @input="groupAddFormInput"
              maxlength="12"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="选择一级分组" prop="selectedCategory">
            <el-select v-model="groupAddForm.selectedCategory" disabled>
              <el-option
                v-for="(item, index) in options.category"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="groupAddForm.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="showGroupAddDialog(false)">取消</el-button>
          <el-button type="primary" @click="addNewGroup">确定</el-button>
        </div>
        <!-- <div class="submit-btn" @click="addNewGroup">确定</div> -->
      </div>
    </com-dialog>
    <!-- 管理分组弹窗 -->
    <com-dialog :config="categoryDialog.config" @closeDialog="closeCategoryDialog">
      <div class="category-dialog">
        <div class="query-table">
          <el-button size="small" type="primary" @click="showCategoryAddDialog">添加分组</el-button>
        </div>
        <div class="common-table-box">
          <tree-table :tableData="categoryDialog.tableData" :column="categoryDialog.column"></tree-table>
        </div>
      </div>
    </com-dialog>
    <!-- 编辑父类分组弹窗 -->
    <com-dialog :config="categoryEditDialog.config" @closeDialog="categoryEditDialog.config.visible = false">
      <div class="group-dialog">
        <el-form
          :model="categoryEditDialog.form"
          :rules="groupRules"
          ref="categoryEditModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="categoryEditDialog.form.name" placeholder="请输入分组名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="categoryEditDialog.form.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="categoryEditDialog.config.visible = false">取消</el-button>
          <el-button type="primary" @click="editCategory">确定</el-button>
        </div>
        <!-- <div class="submit-btn" @click="editCategory">确定</div> -->
      </div>
    </com-dialog>
    <!-- 管理分组-添加分组弹窗 -->
    <com-dialog :config="categoryAddDialog.config" @closeDialog="closeCategoryAddDialog">
      <div class="group-dialog">
        <el-form
          :model="categoryAddDialog.form"
          :rules="groupRules"
          ref="categoryAddModel"
          label-position="right"
          label-width="auto"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input
              v-model="categoryAddDialog.form.name"
              placeholder="请输入分组名称"
              clearable
              maxlength="12"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择一级分组" prop="selectedCategory">
            <el-select
              v-model="categoryAddDialog.form.selectedCategory"
              clearable
              placeholder="新增为一级分组则不用选择"
            >
              <el-option v-for="(item, index) in options.category" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sequence">
            <el-input v-model="categoryAddDialog.form.sequence" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btn" style="display: flex; justify-content: flex-end">
          <el-button @click="closeCategoryAddDialog">取消</el-button>
          <el-button type="primary" @click="addCategory">确定</el-button>
        </div>
        <!-- <div class="submit-btn" @click="addCategory">确定</div> -->
      </div>
    </com-dialog>
    <!-- 话术内容详情弹窗 -->
    <com-dialog :config="speechDetailDialog.config" @closeDialog="speechDetailDialog.config.visible = false">
      <div class="speech-detail">
        <div class="content">{{ speechDetailDialog.content }}</div>
      </div>
      <div class="submit-btn" @click="speechDetailDialog.config.visible = false">关闭</div>
    </com-dialog>
    <!-- 搜索关键词 -->
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
    <com-dialog :config="behaviorDialog.config" @closeDialog="behaviorDialogVisible">
      <div class="tag-dialog">
        <div class="dialog-content">
          <div class="selected-content">
            <div class="content-left">已选</div>
            <div class="content-right">
              <div class="selected-tag" v-for="(item, index) in selectedBehaviorTags" :key="index">
                <span>{{ item.name }}</span>
                <i class="el-icon-close" @click="cancelSelectBehaviorTag(item)"></i>
              </div>
            </div>
          </div>
          <div class="tag-list">
            <div class="tag-group" v-for="(item, index) in behaviorGroupItemTags" :key="index">
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
        <div class="group-btn">
          <el-button @click="behaviorConfirm">取 消</el-button>
          <el-button type="primary" @click="behaviorConfirm">确 定</el-button>
        </div>
      </div>
    </com-dialog>
    <!-- <simple-dialog
      :config="behaviorDialog.config"
      @closeDialog="behaviorDialogVisible"
      @handleConfirm="behaviorDialogVisible"
    >
      <div class="behavior-dialog">
        <div class="selected-content">
          <div class="content-left">已选</div>
          <div class="content-right">
            <div class="selected-tag" v-for="tag in selectedBehaviorTags" :key="tag.id">
              <span>{{ tag.name }}</span>
              <i class="el-icon-close" @click="cancelSelectBehaviorTag(tag)"></i>
            </div>
          </div>
        </div>
        <div class="behavior-list">
          <div class="behavior-group">
            <div class="group-title">请选择行为标签</div>
            <div class="group-content">
              <div
                class="tag-item"
                v-for="tag in behaviorGroupItemTags"
                :key="tag.id"
                :class="checkBehaviorTagActive(tag) ? 'active' : ''"
                @click="onBehaviorTagSelect(tag)"
              >
                {{ tag.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </simple-dialog> -->
  </div>
</template>

<script>
import ComTable from '../../../components/common/ComTable'
import SelectTable from '../../../components/common/SelectTable'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import MaterialEditor from '../../../components/common/SimpleMaterialEditor'
import TreeTable from '../../../components/common/TreeTable'
// import VideoPreview from '../../../components/common/VideoPreview'
// import ImagePreview from '../../../components/common/ImagePreview'
import SimpleDialog from '../../../components/common/SimpleDialog'
import speechMinxins from './speechMinxins'
export default {
  mixins: [speechMinxins],
  components: {
    ComTable,
    SelectTable,
    ComPagination,
    ComDialog,
    MaterialEditor,
    TreeTable,
    // VideoPreview,
    // ImagePreview,
    SimpleDialog
  },
  props: {
    introPage: {
      type: String,
      default: ''
    }
  },
  data() {
    // 限制分组名称只能为6个汉字或12个字母数字！
    let groupNameValidator = (rule, value, callback) => {
      let flag = 1
      //[\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
      let rx = /[a-z\d]/i,
        rxcn = /[\u4e00-\u9fa5]/,
        num = 0,
        chr
      for (var i = 0, j = value.length; i < j; i++) {
        chr = value.charAt(i)

        if (rx.test(chr)) num += 1
        else if (rxcn.test(chr)) num += 2
        else {
          flag = 3
          break
        }
      }
      if (flag != 3) {
        if (num < 1) {
          callback(new Error('请输入分组名称！'))
        } else if (num > 12) {
          callback(new Error('字数不能超过6个汉字或12个字母数字！'))
        } else {
          callback()
        }
      } else {
        callback(new Error('不能包含除中文、字母、数字以外的字符！'))
      }
    }
    return {
      isFull: false,
      tableHeight: 400,
      searchTableHeight: 400,
      menus: Object.freeze([
        { type: 'text', title: '文字', icon: 'el-icon-edit' },
        { type: 'image', title: '图片', icon: 'el-icon-picture-outline' },
        { type: 'video', title: '视频', icon: 'el-icon-video-camera' },
        { type: 'image_text', title: '图文', icon: 'el-icon-link' },
        { type: 'file', title: '文件', icon: 'el-icon-document-add' },
        { type: 'program', title: '小程序', icon: 'el-icon-chat-round' }
      ]),
      categoryList: [],
      currentCategoryID: '',
      currentGroupID: '',
      createNewWordsWayFlag: false,
      options: {
        category: [], // 一级分组选项
        group: [], // 二级分组选项
        selectedCategory: '', // 当前选中项
        selectedGroup: '' // 当前选中项
      },
      menuTableData: [], // 左边菜单数据
      currentRow: {}, // 选中项
      menuTableLoading: false, // 左侧分组表格加载状态
      tableLoading: false, // 表格加载状态
      tableData: [], // 右边数据
      menuColumn: Object.freeze([
        {
          label: '分组名称',
          align: 'center',
          minWidth: '178px',
          prop: 'name',
          formatter: row => {
            return (
              <div>
                {row.id != 'add-new' ? (
                  <div class="speech-category">{row.name}</div>
                ) : (
                  <div class="group-btn" onClick={this.showGroupAddDialog.bind(this)}>
                    <i class="el-icon-plus" />
                    &nbsp;&nbsp;添加分组
                  </div>
                )}
              </div>
            )
          }
        }
      ]),
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      materialEditor: {
        type: 'text'
      },
      groupForm: {},
      groupRules: {
        // name: [{ required: true, validator: groupNameValidator, trigger: 'input' }]
        name: [
          { required: true, message: '请输入分组名称！', trigger: 'blur' },
          { min: 0, max: 12, message: '字数不能超过12个字符！', trigger: 'blur' }
        ]
      },
      groupAddDialog: {
        config: {
          width: '600px',
          title: '添加分组',
          visible: false
        }
      },
      groupAddForm: {
        name: '',
        sequence: 0,
        selectedCategory: ''
      },
      // 管理分组弹窗
      categoryDialog: {
        config: {
          width: '900px',
          title: '管理分组',
          visible: false
        },
        tableData: [],
        column: Object.freeze([
          {
            label: '分组名称',
            align: 'left',
            minWidth: '250px',
            prop: 'name'
          },
          {
            label: '排序号',
            align: 'center',
            minWidth: '150px',
            prop: 'sequence'
          },
          {
            label: '创建时间',
            align: 'center',
            minWidth: '150px',
            prop: 'createTime'
          },
          // {row.childs && row.childs.length > 0 && (
          //   <el-button type="text" onClick={this.showCategoryAddDialog.bind(this, row)}>
          //     添加子分组
          //   </el-button>
          // )}
          {
            label: '操作',
            align: 'center',
            minWidth: '150px',
            formatter: row => {
              return (
                <div style="padding: 0 10px;">
                  {row.parentId == 0 && (
                    <el-button type="text" onClick={this.showCategoryAddDialog.bind(this, row)}>
                      添加子分组
                    </el-button>
                  )}
                  <el-popover popper-class="categoryDialog-row-popover" placement="bottom" v-model={row.visible}>
                    <div class="categoryDialog-row-btn">
                      <el-button type="text" onClick={this.showCategoryEditDialog.bind(this, row)}>
                        修改
                      </el-button>
                    </div>
                    <div class="categoryDialog-row-btn">
                      <el-button type="text" onClick={this.deleteCategory.bind(this, row.id)}>
                        删除
                      </el-button>
                    </div>
                    <el-button slot="reference" type="text" style="padding-left: 10px;">
                      编辑
                    </el-button>
                  </el-popover>
                </div>
              )
            }
          }
        ])
      },
      categoryEditDialog: {
        config: {
          width: '600px',
          title: '编辑分组',
          visible: false
        },
        form: {}
      },
      // 管理分组-添加分组
      categoryAddDialog: {
        config: {
          width: '600px',
          title: '添加分组',
          visible: false
        },
        form: {
          name: '',
          sequence: 0,
          selectedCategory: ''
        }
      },
      // 话术内容弹窗
      speechDetailDialog: {
        config: {
          width: '500px',
          title: '话术内容',
          visible: false
        },
        content: ''
      },
      keySelectDialog: {
        config: {
          width: '600px',
          title: '选择搜索关键词',
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
      selectedKeyWords: [], // 存储选择的关键词名称列表,
      isSearchFormActive: false, // 判断是否点击了搜索表单
      // 行为标签弹窗
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择客户标签',
          visible: false
        }
      },
      showMoreBehaviorTag: '', // 是否展开更多
      behaviorTagList: [], // 行为标签列表
      behaviorGroupItemTags: [], // 行为标签分组的标签列表
      selectedBehaviorTags: [], // 存储选中的行为标签列表
      seqNum: 0, // 话术排序
      updateSeqNum: 0, // 修改话术排序
      isRadar: true, // 是否同步到互动雷达
      radarTitle: '', // 雷达标题
      isFromRadar: false,
      radarSetting: {
        form: {}
      },
      imageTextRadarSetting: {
        isRadar: true, // 是否同步到互动雷达
        radarTitle: '', // 雷达标题
        isFromRadar: false, // 是否从雷达中选择
        form: {
          isBehaviorNotice: false,
          isActionNotice: true,
          isBehaviorTag: false
        } // 雷达详情
      },
      fileRadarSetting: {
        isRadar: true, // 是否同步到互动雷达
        radarTitle: '', // 雷达标题
        isFromRadar: false, // 是否从雷达中选择
        form: {
          isBehaviorNotice: false,
          isActionNotice: true,
          isBehaviorTag: false
        } // 雷达详情
      },
      videoRadarSetting: {
        isRadar: true, // 是否同步到互动雷达
        radarTitle: '', // 雷达标题
        isFromRadar: false, // 是否从雷达中选择
        form: {
          isBehaviorNotice: false,
          isActionNotice: true,
          isBehaviorTag: false
        } // 雷达详情
      },

      // zhw
      isRadarDisable: false, //是否禁用文件同步到雷达
      isDeleteTag: false, // 是否点击了删除标签的按钮文件类型
      isImageRadarDisable: false, // 是否禁用图文同步到雷达
      isImageDeleteTag: false //图文的是否点击了删除标签的按钮
      // zhw end
    }
  },
  watch: {
    categoryList() {
      this.$nextTick(() => {
        this.fullTableHeight()
      })
    }
  },
  computed: {
    // 判断是否为搜索表单
    isSearchForm() {
      if (!this.search.page || !this.search.page.searchWordName) this.isSearchFormActive = false
      return this.search.page.searchWordName && this.isSearchFormActive ? true : false
    },
    // 返回当前选中行为标签分组的tags
    selectedBehaviorTagsItem() {
      return groupId => {
        return this.selectedBehaviorTags.filter(item => item.groupId === groupId)
      }
    },
    // 判断同步到雷达是否被禁用
    // isDisabledFn() {
    //   if (this.speechEditDialog.editForm.isRadar && this.speechEditDialog.editForm.id) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // 判断同步到雷达是否被禁用
    isImageTextDisabledFn() {
      // if (this.speechEditDialog.editForm.isRadar && this.speechEditDialog.editForm.id && this.speechDetailDialog.editForm.type === 'image_text') {
      //   return true
      // } else {
      //   return false
      // }
    },
    isFileDisabledFn() {
      // if (this.speechEditDialog.editForm.isRadar && this.speechEditDialog.editForm.id && this.speechDetailDialog.editForm.type === 'file') {
      //   return true
      // } else {
      //   return false
      // }
    }
  },
  created() {
    this.isNeedUseTalkingPage()
    this.getSpeechCategory()
    // this.getCategoryOptions()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  },
  beforeDestroy() {
    //  缓存本页的数据
    this.$store.commit('scrm/updateTalkingPage', this.$data)
  },
  methods: {
    // zhw
    fileList(val) {
      console.log(val)
      if (val[0].type == 'file') {
        // console.log('文件获取到的雷达信息', val)
        this.isRadarDisable = true
        this.fileRadarSetting.isRadar = true
        this.fileRadarSetting.isFromRadar=true
        this.fileRadarSetting.radarId=val[0].radarId
        this.fileRadarSetting.form.isBehaviorNotice = val[0].isBehaviorNotice
        this.fileRadarSetting.form.isActionNotice = val[0].isActionNotice
        this.fileRadarSetting.form.isBehaviorTag = val[0].isBehaviorTag

        this.selectedBehaviorTags = []
        if(val[0].behaviorTagList&&val[0].behaviorTagList.length>0){
          val[0].behaviorTagList.forEach(item => {
            this.selectedBehaviorTags.push({ name: item.name, businessScore: item.businessScore, id: item.id })
          })
        }else{
          this.selectedBehaviorTags=[]
        }
      } else if (val[0].type == 'image_text') {
        this.isImageRadarDisable = true
        this.imageTextRadarSetting.isRadar = true
        this.imageTextRadarSetting.isFromRadar=true
        this.imageTextRadarSetting.radarId=val[0].radarId
        this.imageTextRadarSetting.form.isBehaviorNotice = val[0].isBehaviorNotice
        this.imageTextRadarSetting.form.isActionNotice = val[0].isActionNotice
        this.imageTextRadarSetting.form.isBehaviorTag = val[0].isBehaviorTag

        this.selectedBehaviorTags = []
        if(val[0].behaviorTagList&&val[0].behaviorTagList.length>0){
          val[0].behaviorTagList.forEach(item => {
            this.selectedBehaviorTags.push({ name: item.name, businessScore: item.businessScore, id: item.id })
          })
        }else{
          this.selectedBehaviorTags=[]
        }
      }else if(val[0].type == 'video'){
        // this.isImageRadarDisable = true
        this.videoRadarSetting.isRadar = true
        this.videoRadarSetting.isFromRadar=true
        this.videoRadarSetting.radarId=val[0].radarId
        this.videoRadarSetting.form.isBehaviorNotice = val[0].isBehaviorNotice
        this.videoRadarSetting.form.isActionNotice = val[0].isActionNotice
        this.videoRadarSetting.form.isBehaviorTag = val[0].isBehaviorTag

        this.selectedBehaviorTags = []
        if(val[0].behaviorTagList&&val[0].behaviorTagList.length>0){
          val[0].behaviorTagList.forEach(item => {
            this.selectedBehaviorTags.push({ name: item.name, businessScore: item.businessScore, id: item.id })
          })
        }else{
          this.selectedBehaviorTags=[]
        }
      }
    },
    // zhw end

    deleteSelectedTag(idx) {
      this.selectedBehaviorTags.splice(idx, 1)
    },
    //关闭选择标签按钮
    behaviorConfirm() {
      this.behaviorDialog.config.visible = false
      let list = []
      this.selectedBehaviorTags.forEach(item => {
        if (item.businessScore == undefined) {
          item.businessScore = 1
        }
      })
    },
    //点击添加标签按钮
    addTagDialog() {
      this.behaviorDialog.config.visible = true
      this.getBehaviorTagPage()
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 36,
        PADDING_BOTTOM_HEIGHT = 52,
        PADDING_TOP_HEIGHT = 0
      this.tableHeight =
        window.innerHeight -
        document.querySelector('#common-table-box').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    searchFullTableHeight() {
      this.searchTableHeight = window.innerHeight - 188
      // console.log(this.searchTableHeight)
    },
    isNeedUseTalkingPage() {
      // 这里主要的作用是：比如在跳转到新增图文页面后，返回此页面时保证之前的状态不消失（弹窗依然打开，选中的标签也在）
      try {
        // 判断是否需要使用缓存的数据，有缓存页面data数据
        let isNeedUseTalkingPage = this.$store.state.scrm.isNeedUseTalkingPage || false
        let pageData = this.$store.state.scrm.talkingPageData || false
        if (isNeedUseTalkingPage && pageData && JSON.stringify(pageData) != '{}') {
          // this.$data // 组件当前data对象
          // this.$options.data() // 组件初始化状态下的data对象
          Object.assign(this.$data, pageData) // 设置data的值
          this.$store.commit('scrm/isNeedUseTalkingPage', false)
          this.$store.commit('scrm/updateTalkingPage', {})
        }
      } catch (er) {
        // console.log(err)
      }
    },
    // 搜索列表数据
    searchFormData() {
      this.isSearchFormActive = true // 设置为true同时有值就显示表单搜索结果
      this.search.page.pageNum = 1
      this.search.page.pageSize = 15
      // console.log('6666')
      this.searchFullTableHeight()
      this.getSearchFormData()
    },
    // 重置搜索
    resetSearchFormData() {
      this.search.page.searchWordName = ''
      this.getSpeechCategory()
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
      let that = this
      that.$http.getSpeechcraftPage(that.search.page).then(res => {
        that.search.tableData = res.data.data.list
        that.search.page.total = res.data.data.total
      })
    },
    // 获取话术库分组
    getSpeechCategory() {
      let params = {
        parentId: 0
      }
      this.$http.getSpeechcraftGroupList(params).then(res => {
        let list = res.data.data
        if (list.length > 0) {
          this.categoryList = list
          // 不存在就默认选中第一项
          if (!this.currentCategoryID) this.currentCategoryID = list[0].id
          this.getSpeechList(this.currentCategoryID) // 刷新分组数据
        }
        // 设置一级分组选项
        let newList = []
        list.forEach(item => {
          let obj = {
            label: item.name,
            value: item.id
          }
          newList.push(obj)
        })
        this.options.category = newList
      })
    },
    categoryChange(item) {
      this.currentCategoryID = item.id
      this.menuTableData = []
      this.tableData = []
      this.getSpeechList(item.id)
      // this.getGroupOptions(item.id)
    },
    // 获取分组下的数据列表
    getSpeechList(parentId) {
      // console.log('111')
      this.menuTableLoading = true
      this.tableLoading = true
      this.$http
        .getSpeechcraftGroupList({ parentId })
        .then(res => {
          // console.log('分组信息的数据', res)
          this.menuTableLoading = false
          let list = [].concat(res.data.data)
          this.menuTableData = list
          let obj = {
            id: 'add-new',
            name: '新增'
          }
          this.menuTableData.push(obj)
          // console.log('list的数据', list)
          if (list.length > 0) {
            // console.log('如果list大于0就进来了')
            // 默认选中第一项
            this.currentRow = list[0]
            this.currentGroupID = list[0].id
            // console.log(this.currentRow)
            // console.log(this.currentGroupID)
            this.tableLoading = false
            // this.getSpeechcraftPage()
          } else {
            this.tableLoading = false
          }

          // 设置二级分组选项
          let newList = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.id
            }
            newList.push(obj)
          })
          this.options.group = newList
          // console.log('分组数据', newList)
        })
        .catch(() => (this.menuTableLoading = false))
    },
    // 获取分组下对应的话术列表
    getSpeechcraftPage() {
      let that = this
      let params = {
        groupId: that.currentRow.id,
        pageNum: that.page.pageNum,
        pageSize: that.page.pageSize
      }
      that.tableLoading = true
      that.$http
        .getSpeechcraftPage(params)
        .then(res => {
          that.tableData = res.data.data.list
          that.page.total = res.data.data.total
          that.tableLoading = false
        })
        .catch(() => {
          that.tableLoading = false
        })
    },
    _handleCurrentChange(row) {
      if (row && row.id !== 'add-new') {
        this.currentGroupID = row.id
        this.page.pageNum = 1
        this.page.pageSize = 15
        this.page.total = 0
        this.currentRow = row
        this.getSpeechcraftPage()
      }
      // console.log('选中项' + row.name)
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getSpeechcraftPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getSpeechcraftPage()
    },
    // 选中值改变
    optionChange(val) {
      // console.log(val);
      // console.log('当前选项' + val)
      // this.currentCategoryID = val
      // this.options.selectedGroup = val
      this.getGroupOptions(val)
    },
    groupOptionChange(val) {
      // console.log(val);
      // this.options.selectedGroup = val
      // if (val === 'addGroup') {
      //   console.log('添加分组')
      //   this.groupAddDialog.config.visible = true
      // }
    },
    getCategoryOptions() {
      let that = this
      let params = {
        parentId: 0
      }
      that.$http.getSpeechcraftGroupList(params).then(res => {
        let list = res.data.data
        let newList = []
        list.forEach(item => {
          let obj = {
            label: item.name,
            value: item.id
          }
          newList.push(obj)
        })
        that.options.category = newList
        // 默认选中第一项
        // that.options.selectedCategory = newList[0].value
        that.getGroupOptions(that.currentCategoryID)
      })
    },
    getGroupOptions(parentId) {
      let that = this
      // let parentId = that.options.selectedCategory
      that.$http.getSpeechcraftGroupList({ parentId }).then(res => {
        let list = res.data.data
        let newList = []
        // let obj = {
        //   label: '新建分组',
        //   value: 'addGroup'
        // }
        // newList.push(obj)
        list.forEach(item => {
          let obj = {
            label: item.name,
            value: item.id
          }
          newList.push(obj)
        })
        that.options.group = newList
      })
    },
    // 显示添加分组弹窗,从二级分组直接添加
    showGroupAddDialog(state = true) {
      if (state) {
        this.groupAddForm.selectedCategory = this.currentCategoryID
        this.groupAddDialog.config.visible = true
        this.groupAddForm.name = ''
      } else {
        this.groupAddDialog.config.visible = false
        this.groupAddForm.sequence = 0
      }
    },
    // 确定并添加分组
    addNewGroup() {
      this.$refs.groupAddModel.validate(valid => {
        if (valid) {
          // 验证通过并提交数据
          let params = {
            parentId: this.groupAddForm.selectedCategory,
            name: this.groupAddForm.name,
            sequence: this.groupAddForm.sequence
          }
          this.$http.addSpeechcraftGroup(params).then(() => {
            this.$message.success('添加分组成功')
            this.showGroupAddDialog(false) // 关闭弹窗
            this.getSpeechList(this.currentCategoryID)
            this.getCategoryOptions()
          })
        }
      })
    },
    getSearchVideoDetail(row, index) {
      let that = this
      let fileId = row.fileId
      if (fileId) {
        that.$http.getVideoSignatureDetail({ fileId }).then(res => {
          let videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
          that.$set(that.search.tableData[index], 'videoUrl', videoUrl)
        })
      } else {
        that.$message.warning('无效的素材内容，请重新上传')
      }
    },
    // 显示管理分组弹窗
    showCategoryDialog() {
      // this.categoryDialog.config.visible = true
      this.getSpeechGroupTree()
    },
    // 获取分组结构树
    getSpeechGroupTree() {
      this.$http.getSpeechcraftGroupTree().then(res => {
        // console.log('这是分组树', res.data.data)
        this.categoryDialog.tableData = res.data.data
        this.categoryDialog.config.visible = true
      })
    },
    // 关闭管理分组的弹窗
    closeCategoryDialog() {
      this.categoryDialog.config.visible = false
      // 重置page，重新获取分类，列表数据，关闭弹窗
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getSpeechCategory()
      this.getCategoryOptions()
    },
    getCategoryList() {
      let that = this
      let parentId = 0
      that.$http.getSpeechcraftGroupList({ parentId }).then(res => {
        that.categoryDialog.tableData = res.data.data
      })
    },
    // 编辑父类分组
    showCategoryEditDialog(row) {
      this.categoryEditDialog.form = Object.assign({}, row)
      this.categoryEditDialog.config.visible = true

      // console.log('修改', this.categoryEditDialog.form)
    },
    editCategory() {
      let that = this
      that.$refs.categoryEditModel.validate(valid => {
        if (valid) {
          // 验证通过并提交数据
          let params = {
            id: that.categoryEditDialog.form.id,
            name: that.categoryEditDialog.form.name,
            sequence: that.categoryEditDialog.form.sequence
          }
          that.$http.updateSpeechcraftGroup(params).then(() => {
            // 关闭弹窗，重新获取父类分组信息
            that.$message.success('编辑成功')
            that.categoryEditDialog.config.visible = false
            that.getSpeechGroupTree()
            that.getCategoryOptions()
          })
        }
      })
    },
    // 新增父类分组
    showCategoryAddDialog(row) {
      this.categoryAddDialog.config.visible = true
      if (row && row.id) {
        this.categoryAddDialog.form.selectedCategory = row.id
      }
    },
    // 管理分组-添加分组
    addCategory() {
      this.$refs.categoryAddModel.validate(valid => {
        if (valid) {
          // 验证通过并提交数据
          if (this.categoryAddDialog.form.selectedCategory === '') {
            // 新增一级分组
            let params = {
              parentId: 0,
              name: this.categoryAddDialog.form.name,
              sequence: this.categoryAddDialog.form.sequence
            }
            this.$http.addSpeechcraftGroup(params).then(() => {
              this.$message.success('添加分组成功')
              this.closeCategoryAddDialog()
              this.getSpeechGroupTree()
              this.getCategoryOptions()
            })
          } else {
            // 新增二级分组
            let params = {
              parentId: this.categoryAddDialog.form.selectedCategory,
              name: this.categoryAddDialog.form.name,
              sequence: this.categoryAddDialog.form.sequence
            }
            this.$http.addSpeechcraftGroup(params).then(() => {
              this.$message.success('添加分组成功')
              this.closeCategoryAddDialog()
              this.getSpeechGroupTree()
            })
          }
        }
      })
    },
    // 分组校验
    groupAddFormInput(value) {
      // let flag = 1
      // //[\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
      // let rx = /[a-z\d]/i,
      //   rxcn = /[\u4e00-\u9fa5]/,
      //   num = 0,
      //   chr
      // for (var i = 0, j = value.length; i < j; i++) {
      //   chr = value.charAt(i)
      //   if (rx.test(chr)) num += 1
      //   else if (rxcn.test(chr)) num += 2
      //   else {
      //     flag = 3
      //     break
      //   }
      // }
      // if (flag != 3) {
      //   if (num < 1) {
      //     callback(new Error('请输入分组名称！'))
      //   } else if (num > 12) {
      //     this.groupAddForm.name =
      //     callback(new Error('字数不能超过6个汉字或12个字母数字！'))
      //   } else {
      //     callback()
      //   }
      // }
    },
    // 分组管理-添加分组弹窗关闭
    closeCategoryAddDialog() {
      this.categoryAddDialog.config.visible = false
      this.categoryAddDialog.form.name = ''
      this.categoryAddDialog.form.selectedCategory = ''
      this.categoryAddDialog.form.sequence = 0
    },
    // 删除父类分组
    deleteCategory(id) {
      this.$confirm('是否删除该分组', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteSpeechcraftGroup({ id }).then(() => {
          // 获取父类分组列表
          this.$message.success('删除成功')
          this.getSpeechGroupTree()
        })
      })
    },
    // 素材类型改变
    materialTypeChange(val) {
      console.log(this.fileRadarSetting)
      this.materialEditor.type = val
    },
    // 素材文件上传成功后会触发此事件,把文件名赋值给话术名称
    materialFileDataChange(data) {
      console.log(data,this.speechEditDialog)
      let model = this.speechEditDialog
      if (typeof data === 'object') {
        switch (this.materialEditor.type) {
          case 'image':
            model.input.imageName = data.fileName
            break
          case 'video':
            model.input.videoName = data.fileName
            break
          case 'file':
            model.input.fileName = data.name
            break
        }
      }
    },
    // 校验并新增/修改话术
    checkAndSubmitSpeechData() {
      console.log(this.fileRadarSetting)
      this.createNewWordsWayFlag = true
      let model = this.speechEditDialog
      let type = this.materialEditor.type
      let submitType = model.editForm && model.editForm.id ? 'edit' : 'add'
      // console.log('素材类型' + type)
      let params = {}
      params = this.$refs.materialEditorEdit.checkMaterialValid()
      console.log('parmas=>>>', params)
      // 排序号
      // params.seqNum = this.seqNum
      // 校验格式
      if (type === 'text') {
        // 校验文本格式，返回表单
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitSpeechData(type, params)
          } else if (submitType === 'edit') {
            this.updateSpeechData(type, params)
          }
        } else {
          this.$message.warning('请输入话术内容')
          this.createNewWordsWayFlag = false
        }
      } else if (type === 'image') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            if (model.input.imageName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              params.name = model.input.imageName
              this.submitSpeechData(type, params)
            }
          } else if (submitType === 'edit') {
            if (model.input.imageName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              params.name = model.input.imageName
              this.updateSpeechData(type, params)
            }
          }
        } else {
          this.$message.warning('请添加图片')
          this.createNewWordsWayFlag = false
        }
      } else if (type === 'image_text') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitSpeechData(type, params)
          } else if (submitType === 'edit') {
            this.updateSpeechData(type, params)
          }
        } else {
          this.$message.warning('请添加图文')
          this.createNewWordsWayFlag = false
        }
      } else if (type === 'program') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            this.submitSpeechData(type, params)
          } else if (submitType === 'edit') {
            this.updateSpeechData(type, params)
          }
        } else {
          this.$message.warning('请添加小程序')
          this.createNewWordsWayFlag = false
        }
      } else if (type === 'file') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          // if (submitType === 'add') {
          //   this.submitSpeechData(type, params)
          // } else if (submitType === 'edit') {
          //   this.updateSpeechData(type, params)
          // }
          // console.log('提交之前我先拦截看下数据>>>', params)

          if (submitType === 'add') {
            if (model.input.fileName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              params.name = model.input.fileName
              this.submitSpeechData(type, params)
            }
          } else if (submitType === 'edit') {
            // console.log('进入编辑话术>>>', params)
            if (model.input.fileName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              params.name = model.input.fileName
              // console.log('如果不为空在编辑话术,', params)
              this.updateSpeechData(type, params)
            }
          }
        } else {
          this.$message.warning('请上传文件')
          this.createNewWordsWayFlag = false
        }
      } else if (type === 'video') {
        // let params = this.$refs.materialEditor.checkMaterialValid()
        if (typeof params === 'object') {
          if (submitType === 'add') {
            if (model.input.videoName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              let fileId = params.fileId
              if (!fileId) {
                this.createNewWordsWayFlag = false
                return this.$message.warning('请上传视频')
              }
              params.name = model.input.videoName
              // this.submitSpeechData(type, params)
              this.$http.getVideoSignatureDetail({ fileId }).then(res => {
                params.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
                this.submitSpeechData(type, params)
              })
              .catch(() => {
                this.$message.warning('视频文件正在处理中，请稍后重试')
                this.createNewWordsWayFlag = false
              })
            }
          } else if (submitType === 'edit') {
            if (model.input.videoName === '') {
              this.$message.warning('请输入话术标题')
              this.createNewWordsWayFlag = false
            } else {
              let fileId = params.fileId
              if (!fileId) {
                this.createNewWordsWayFlag = false

                return this.$message.warning('请上传视频')
              }
              params.name = model.input.videoName
              // this.updateSpeechData(type, params)
              this.$http.getVideoSignatureDetail({ fileId }).then(res => {
                params.videoUrl = res.data.data.file.url + res.data.data.playSignature.queryString
                this.updateSpeechData(type, params)
              })
              .catch(() => {
                this.$message.warning('视频文件正在处理中，请稍后重试')
                this.createNewWordsWayFlag = false
              })
            }
          }
        } else {
          this.$message.warning('请上传视频')
          this.createNewWordsWayFlag = false
        }
      }
    },
    cancelCheckAndSubmitSpeechData() {
      this.speechEditDialog.config.visible = false
      this.createNewWordsWayFlag = false
    },
    submitSpeechData(type, params) {
      let that = this
      params.type = type
      let list = []
      if (
        that.options.selectedGroup !== '' &&
        that.options.selectedGroup !== 'addGroup' &&
        that.options.selectedCategory !== ''
      ) {
        that.speechAddDialog.loading = true
        that.speechEditDialog.loading = true
        let obj1 = {
          id: that.options.selectedGroup
        }
        let obj2 = {
          id: that.options.selectedCategory
        }
        list.push(obj1)
        list.push(obj2)
        that.$set(params, 'speechcraftGroupList', list)
        // 添加关键词字段
        that.$set(params, 'searchWordId', this.selectedKeyWordIds.join('_'))
        // 添加行为标签
        // let behaviorTagList = this.selectedBehaviorTags.map(item => {
        //   return { id: item.id }
        // })
        // that.$set(params, 'behaviorTagList', behaviorTagList)
        that.$set(params, 'seqNum', this.seqNum)
        // 互动雷达
        if (type === 'image_text') {
          console.log(that.imageTextRadarSetting,params)
          that.imageTextRadarSetting.isRadar=true
          if (that.imageTextRadarSetting.isRadar) {
            // 默认链接标题
            that.imageTextRadarSetting.radarTitle = params.name
            // console.log('链接标题', params.name)
            // if (that.imageTextRadarSetting.radarTitle === '') {
            //   that.$message.warning('请输入雷达标题')
            //   that.createNewWordsWayFlag = false
            //   return
            // } else {
            //   that.$set(params, 'isRadar', that.imageTextRadarSetting.isRadar)
            //   that.$set(params, 'radarTitle', that.imageTextRadarSetting.radarTitle)
            //   that.$set(params, 'radarType', 'link')
            // }
            that.$set(params, 'isRadar', that.imageTextRadarSetting.isRadar)
            that.$set(params, 'radarTitle', that.imageTextRadarSetting.radarTitle)
            that.$set(params, 'radarType', 'link')

            
            that.imageTextRadarSetting.form.isActionNotice = true
            if (that.imageTextRadarSetting.form.isBehaviorNotice == undefined) {
              that.imageTextRadarSetting.form.isBehaviorNotice = false
            }
            if (that.imageTextRadarSetting.form.isBehaviorTag == undefined) {
              that.imageTextRadarSetting.form.isBehaviorTag = false
            }
            that.$set(params, 'radarRequest', that.imageTextRadarSetting.form)
            console.log(that.imageTextRadarSetting)
            if (that.imageTextRadarSetting.form.isBehaviorTag) {
              if(this.selectedBehaviorTags.length == 0){
                this.$message.warning('请选择客户标签')
                this.createNewWordsWayFlag = false
                return
              }else{
                let list = []
                this.selectedBehaviorTags.forEach(item => {
                  list.push({ id: item.id, businessScore: item.businessScore })
                })
                this.$set(params.radarRequest, 'radarTagList', list)
              }
            } else {
              this.$set(params.radarRequest, 'radarTagList', [])
            }
          } else {
            that.$set(params, 'isRadar', true)
            that.$set(params, 'radarTitle', '')
            that.$set(params, 'radarRequest', that.imageTextRadarSetting.form)
            this.$set(params, 'radarTagList', [])
          }
          if (that.imageTextRadarSetting.isFromRadar) {
            that.$set(params, 'radarId', that.imageTextRadarSetting.radarId)
          }
        } else if (type === 'file') {
          that.fileRadarSetting.isRadar=true
          if (that.fileRadarSetting.isRadar) {
            // 默认文件标题
            that.fileRadarSetting.radarTitle = params.name
          
            that.$set(params, 'isRadar', that.fileRadarSetting.isRadar)
            that.$set(params, 'radarTitle', that.fileRadarSetting.radarTitle)
            that.$set(params, 'radarType', 'file')
            that.$set(params, 'fileName', params.name)
            // console.log('测试数据:', that.fileRadarSetting.form.isActionNotice)
            // console.log('测试数据:', that.fileRadarSetting.form.isBehaviorNotice)
            // console.log('测试数据:', that.fileRadarSetting.form.isBehaviorTag)
            that.fileRadarSetting.form.isActionNotice = true
            if (that.fileRadarSetting.form.isBehaviorNotice == undefined) {
              that.fileRadarSetting.form.isBehaviorNotice = false
            }
            if (that.fileRadarSetting.form.isBehaviorTag == undefined) {
              that.fileRadarSetting.form.isBehaviorTag = false
            }
            that.$set(params, 'radarRequest', that.fileRadarSetting.form)
            if (that.fileRadarSetting.form.isBehaviorTag) {
              if(this.selectedBehaviorTags.length == 0){
                this.speechEditDialog.loading = false
                this.$message.warning('请选择客户标签')
                this.createNewWordsWayFlag = false
                return
              }else{
                let list = []
                this.selectedBehaviorTags.forEach(item => {
                  list.push({ id: item.id, businessScore: item.businessScore })
                })
                this.$set(params.radarRequest, 'radarTagList', list)
              }
            } else {
              this.$set(params.radarRequest, 'radarTagList', [])
            }
          } else {
            that.$set(params, 'isRadar', true)
            that.$set(params, 'radarTitle', '')
            that.$set(params, 'radarRequest', that.fileRadarSetting.form)
            this.$set(params, 'radarTagList', [])
            // that.$set(params, 'isActionNotice', false)
            // that.$set(params, 'isBehaviorTag', false)
          }
          if (that.fileRadarSetting.isFromRadar) {
            that.$set(params, 'radarId', that.fileRadarSetting.radarId)
          }
          that.$set(params, 'fileDescribe', that.speechEditDialog.fileDescribe)
        } 
        else if(type === 'video'){
          that.videoRadarSetting.isRadar=true
          if(that.videoRadarSetting.isRadar){
            that.$set(params, 'isRadar', that.videoRadarSetting.isRadar)
            that.$set(params, 'radarTitle', params.name)
            that.$set(params, 'radarRequest', that.videoRadarSetting.form)
            that.$set(params, 'radarType', 'video')

            if (that.videoRadarSetting.form.isBehaviorTag) {
              if(this.selectedBehaviorTags.length == 0){
                this.speechEditDialog.loading = false
                this.$message.warning('请选择客户标签')
                this.createNewWordsWayFlag = false
                return
              }else{
                let list = []
                this.selectedBehaviorTags.forEach(item => {
                  list.push({ id: item.id, businessScore: item.businessScore })
                })
                this.$set(params.radarRequest, 'radarTagList', list)
              }
            } else {
              this.$set(params.radarRequest, 'radarTagList', [])
            }
          }else{
            that.$set(params, 'isRadar', true)
            that.$set(params, 'radarTitle', '')
            that.$set(params, 'radarRequest', that.fileRadarSetting.form)
            this.$set(params, 'radarTagList', [])
          }
          if (that.videoRadarSetting.isFromRadar) {
            that.$set(params, 'radarId', that.videoRadarSetting.radarId)
          }
          // return
        }
        else {
          // 文本、图片、小程序类型的不需要同步到雷达
          that.$set(params, 'isRadar', false)
          that.$set(params, 'radarTitle', '')
          that.$set(params, 'fileDescribe', '')
        }
        // 发送请求
        that.$http
          .addSpeechcraft(params)
          .then(() => {
            that.$message.success('新增话术成功')
            that.speechAddDialog.loading = false
            that.speechEditDialog.loading = false
            // 重置page，重新获取分类，列表数据，关闭弹窗
            that.page.pageNum = 1
            that.page.pageSize = 15
            that.page.total = 0
            that.getSpeechcraftPage()
            // that.getSpeechCategory()
            that.speechAddDialog.config.visible = false
            that.speechEditDialog.config.visible = false
            this.createNewWordsWayFlag = false
          })
          .catch(() => {
            this.createNewWordsWayFlag = false
          })
      } else {
        that.$message.warning('请选择分组')
      }
    },
    updateSpeechData(type, form) {
      let that = this
      that.speechEditDialog.loading = true
      let params = this.speechEditDialog.editForm
      params.type = type
      params.name = form.name
      params.content = form.content
      params.imageUrl = form.imageUrl
      params.videoUrl = form.videoUrl
      params.link = form.link
      params.programId = form.programId
      params.file = form.file
      params.fileId = form.fileId
      params.fileName = form.fileName || form.name.split('.')[0]
      params.searchWordId = this.selectedKeyWordIds.join('_')
      // 添加行为标签
      let behaviorTagList = this.selectedBehaviorTags.map(item => {
        return { id: item.id }
      })
      // that.$set(params, 'behaviorTagList', behaviorTagList)
      params.behaviorTagList = behaviorTagList
      params.speechcraftGroupList = [
        {
          id: this.options.selectedGroup
        },
        {
          id: this.options.selectedCategory
        }
      ]
      params.seqNum = this.seqNum
      // 互动雷达
      if (type === 'image_text') {
        // params.isRadar = false
        this.$delete(params, 'behaviorTagList')
        if (this.imageTextRadarSetting.isRadar) {
          // 默认链接标题
          this.imageTextRadarSetting.radarTitle = params.name
          // console.log('params的radar', params.radarRequest.radarTagList)
          if (this.isImageDeleteTag) {
            params.radarRequest.radarTagList = this.selectedBehaviorTags
          } else {
            params.radarRequest.radarTagList = this.selectedBehaviorTags
          }
          let radarRequest = {}
          this.$set(params, 'radarRequest', radarRequest)
          if (this.imageTextRadarSetting.form.isBehaviorNotice == undefined) {
            this.$set(params.radarRequest, 'isBehaviorNotice', false)
          } else {
            this.$set(params.radarRequest, 'isBehaviorNotice', this.imageTextRadarSetting.form.isBehaviorNotice)
          }
          // if (this.imageTextRadarSetting.form.isActionNotice == undefined) {
          //   this.$set(params.radarRequest, 'isActionNotice', true)
          // } else {
          //   this.$set(params.radarRequest, 'isActionNotice', this.imageTextRadarSetting.form.isActionNotice)
          // }
          if (this.imageTextRadarSetting.form.isBehaviorTag == undefined) {
            this.$set(params.radarRequest, 'isBehaviorTag', false)
          } else {
            this.$set(params.radarRequest, 'isBehaviorTag', this.imageTextRadarSetting.form.isBehaviorTag)
          }
          if (this.imageTextRadarSetting.form.isBehaviorTag) {
            // console.log('编辑图文类型的时候的客户标签', this.selectedBehaviorTags)
            if (this.selectedBehaviorTags.length == 0) {
              this.createNewWordsWayFlag = false
              this.$message.warning('请选择客户标签')
              return
            } else {
              this.$set(params.radarRequest, 'radarTagList', this.selectedBehaviorTags)
            }
          } else {
            this.$set(params.radarRequest, 'radarTagList', [])
          }
          // if (this.imageTextRadarSetting.radarTitle === '') {
          //   this.$message.warning('请输入雷达标题')
          //   this.createNewWordsWayFlag = false
          //   return
          // } else {
          //   params.isRadar = this.imageTextRadarSetting.isRadar
          //   params.radarTitle = this.imageTextRadarSetting.radarTitle
          //   params.radarType = 'link'
          // }
          // params.isRadar = this.imageTextRadarSetting.isRadar
          params.isRadar = this.imageTextRadarSetting.isRadar
          params.radarTitle = this.imageTextRadarSetting.radarTitle
          params.radarType = 'link'
        }
        if (this.imageTextRadarSetting.isFromRadar) {
          params.radarId = this.imageTextRadarSetting.radarId
        } else {
          params.radarId = ''
        }
      } else if (type === 'file') {
        params.isRadar = true
        this.$delete(params, 'behaviorTagList')
        if (this.fileRadarSetting.isRadar) {
          // 默认文件标题
          this.fileRadarSetting.radarTitle = params.name
          if (this.isDeleteTag) {
            params.radarRequest.radarTagList = this.selectedBehaviorTags
          }
          let radarRequest = {}
          this.$set(params, 'radarRequest', radarRequest)
          if (this.fileRadarSetting.form.isBehaviorNotice == undefined) {
            this.$set(params.radarRequest, 'isBehaviorNotice', false)
          } else {
            this.$set(params.radarRequest, 'isBehaviorNotice', this.fileRadarSetting.form.isBehaviorNotice)
          }
          // if (this.fileRadarSetting.form.isActionNotice == undefined) {
          //   this.$set(params.radarRequest, 'isActionNotice', true)
          // } else {
          //   this.$set(params.radarRequest, 'isActionNotice', this.fileRadarSetting.form.isActionNotice)
          // }
          if (this.fileRadarSetting.form.isBehaviorTag == undefined) {
            this.$set(params.radarRequest, 'isBehaviorTag', false)
          } else {
            this.$set(params.radarRequest, 'isBehaviorTag', this.fileRadarSetting.form.isBehaviorTag)
          }
          if (this.fileRadarSetting.form.isBehaviorTag) {
            if (this.selectedBehaviorTags.length == 0) {
              this.createNewWordsWayFlag = false
              this.$message.warning('请选择客户标签')
              return
            } else {
              this.$set(params.radarRequest, 'radarTagList', this.selectedBehaviorTags)
            }
          } else {
            this.$set(params.radarRequest, 'radarTagList', [])
          }

          params.isRadar = this.fileRadarSetting.isRadar
          params.radarTitle = this.fileRadarSetting.radarTitle
          params.radarType = 'file'
          params.fileName = params.name
          // console.log('修改文件数据时候的数据', params)
        }
        if (this.fileRadarSetting.isFromRadar) {
          params.radarId = this.fileRadarSetting.radarId
        } else {
          params.radarId = ''
        }
      }
      if (type === 'file') {
        params.fileDescribe = this.speechEditDialog.fileDescribe
      } else {
        params.fileDescribe = ''
      }
      that.$http
        .updateSpeechcraft(params)
        .then(() => {
          that.$message.success('修改话术成功')
          that.speechEditDialog.loading = false
          // 重置page，重新获取分类，列表数据，关闭弹窗
          that.page.pageNum = 1
          that.page.pageSize = 15
          that.page.total = 0
          that.getSpeechcraftPage()
          that.speechEditDialog.config.visible = false
          this.createNewWordsWayFlag = false
          this.isDeleteTag = false
          this.isImageDeleteTag = false
        })
        .catch(() => {
          this.createNewWordsWayFlag = false
          this.isDeleteTag = false
          this.isImageDeleteTag = false
        })
    },
    // 关闭新增话术弹窗，重置弹窗数据
    clearAllSpeechDialogData() {
      // 分组信息
      this.options.selectedCategory = ''
      this.options.selectedGroup = ''
      // 弹窗输入信息
      this.speechAddDialog.input.imageName = ''
      this.speechAddDialog.input.videoName = ''
      // 类型
      this.materialEditor.type = 'text'
      // 素材编辑器
      // this.$refs.materialEditorEdit.clearFormData()
    },
    // 话术内容详情
    showSpeechDetailDialog(row) {
      this.speechDetailDialog.config.visible = true
      this.speechDetailDialog.content = row.content
    },
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
      this.$http.getSpeechSearchWordPage(params).then(res => {
        this.keyWordList = res.data.data.list
      })
    },
    // 关键词是否被选中
    checkKeyWordActive(obj) {
      if (this.selectedKeyWordIds.indexOf(obj.id) > -1) {
        return true
      } else {
        return false
      }
    },
    // 选择关键词
    onKeyWordSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedKeyWordIds.indexOf(obj.id) > -1) {
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
        this.$http.addSpeechSearchWord(params).then(() => {
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
    // 行为标签区域开始
    // 是否显示行为标签弹窗
    behaviorDialogVisible(state = false, tagList) {
      this.behaviorDialog.config.visible = state
      // console.log(tagList)
      if (tagList) this.behaviorGroupItemTags = JSON.parse(JSON.stringify(tagList))
      else this.behaviorGroupItemTags = []
    },
    // 获取行为标签
    getBehaviorTagPage() {
      // let params = {
      //   pageNum: 1,
      //   pageSize: 999,
      //   name: ''
      // }
      this.$http.getBehaviorPages().then(res => {
        this.behaviorTagList = res.data.data
        this.behaviorGroupItemTags = this.behaviorTagList
        // this.$nextTick(() => {
        //   let h = this.$refs.behaviorTagList.offsetHeight;
        //   // 大于两行高度就显示展开按钮
        //   this.showMoreBehaviorTag = h < 80 ? '1' : ''
        // })
      })
    },
    // 行为标签是否被选中
    checkBehaviorTagActive(obj) {
      let flag = this.selectedBehaviorTags.some(item => item.id === obj.id)
      if (flag) {
        return true
      } else {
        return false
      }
    },
    // 选择行为标签
    onBehaviorTagSelect(obj) {
      // 当前已经选中则取消选择，否则选中当前项
      if (this.selectedBehaviorTags.some(item => item.id === obj.id)) {
        this.selectedBehaviorTags.splice(
          this.selectedBehaviorTags.findIndex(item => item.id === obj.id),
          1
        )
      } else {
        this.selectedBehaviorTags.push(obj)
      }
    },
    cancelSelectBehaviorTag(obj) {
      this.selectedBehaviorTags.splice(
        this.selectedBehaviorTags.findIndex(item => item.id === obj.id),
        1
      )
    },
    // 行为标签区域结束
    // 获取雷达详情
    // _geRadarModel(obj) {
    //   let id = obj.id
    //   this.isFromRadar = true
    //   this.$http.getInteractRadarDetail({ id }).then(res => {
    //     this.radarSetting.form = res.data.data
    //   })
    // },
    // _clearRadarSetting() {
    //   this.isRadar = false
    //   this.speechEditDialog.editForm.isRadar = false
    //   this.isFromRadar = false
    //   this.radarSetting.form = {}
    // }
    _geRadarModel(obj) {
      let id = obj.id
      this.$http.getInteractRadarDetail({ id }).then(res => {
        if (this.materialEditor.type === 'image_text') {
          this.imageTextRadarSetting.isFromRadar = true
          this.imageTextRadarSetting.form = res.data.data
        } else if (this.materialEditor.type === 'file') {
          this.fileRadarSetting.isFromRadar = true
          this.fileRadarSetting.form = res.data.data
          this.speechEditDialog.fileDescribe = res.data.data.fileDescribe
        }
      })
    },
    _clearRadarSetting() {
      if (this.materialEditor.type === 'image_text') {
        this.speechEditDialog.editForm.isRadar = true
        this.imageTextRadarSetting.isRadar = true
        this.imageTextRadarSetting.isFromRadar = false
        this.imageTextRadarSetting.radarId=''
        this.imageTextRadarSetting.form = {isActionNotice:true,isBehaviorNotice: false,isBehaviorTag: false}
        this.isImageRadarDisable = false
        this.isImageDeleteTag = true
        this.selectedBehaviorTags = []
      } else if (this.materialEditor.type === 'file') {
        this.speechEditDialog.editForm.isRadar = true
        this.fileRadarSetting.isRadar = true
        this.fileRadarSetting.isFromRadar = false
        this.fileRadarSetting.radarId=''
        this.fileRadarSetting.form = {isActionNotice:true,isBehaviorNotice: false,isBehaviorTag: false}
        this.isRadarDisable = false
        this.selectedBehaviorTags = []
        this.isDeleteTag = true
      }else if (this.materialEditor.type === 'video') {
        this.speechEditDialog.editForm.isRadar = true
        this.videoRadarSetting.isRadar = true
        this.videoRadarSetting.isFromRadar = false
        this.videoRadarSetting.radarId=''
        this.videoRadarSetting.form = {isActionNotice:true,isBehaviorNotice: false,isBehaviorTag: false}
        // this.isRadarDisable = false
        this.selectedBehaviorTags = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.talking {
  position: relative;

  .theme-color {
    color: $--color-primary;
  }
  .theme-border-color {
    border-color: $--color-primary;
  }
  %clearfix {
    &::after {
      content: ' ';
      display: block;
      visibility: hidden;
      height: 0;
      clear: both;
    }
  }

  .talking-h {
    background-color: #ffffff;
    padding: 20px;
    @extend %clearfix;
    .search-input {
      float: right;
      width: 210px;
    }
  }

  .talking-m {
    margin-top: 15px;
    min-height: 200px;
    .tabs {
      background-color: #ffffff;
      padding: 6px 20px;
      display: flex;
      flex-wrap: wrap;
      .tabs-item {
        padding: 10px;
        font-size: 14px;
        cursor: pointer;
        // border-bottom: 2px solid transparent;
        color: #606266;
        margin-right: 20px;
        position: relative;
        line-height: 16px;
      }
      .tabs-item--active {
        color: $--color-primary;
        // border-color: $--color-primary;
        font-weight: bold;
        font-size: 16px;
        // &::after {
        //   content: '';
        //   display: block;
        //   width: 0;
        //   height: 0;
        //   background-color: $--color-primary;
        //   position: absolute;
        //   left: 0;
        //   right: 0;
        //   bottom: -7px;
        //   margin: 0 auto;
        // }
      }
    }
    .common-table-box {
      display: flex;
      margin-top: 15px;
      .table-box-left {
        width: 180px;
        margin-right: 15px;
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
        width: calc(100% - 195px);
        border-right: 1px solid #ebeef5;
        box-sizing: border-box;
      }
      .group-btn {
        cursor: pointer;
      }
    }
  }
}
// .container {
//   width: 100%;
//   height: 100%;
//   // background-color: #ffffff;
//   padding: 20px;
//   box-sizing: border-box;
// }

.group-dialog {
  width: 100%;
  // height: 220px;
  // padding: 40px;
  box-sizing: border-box;
}
.speech-dialog {
  position: relative;
  left: 0;
  top: -20px;
  .dialog-input {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    margin-left: 26px;
    .input-content {
      width: 248px;
    }
  }
}
.speech-dialog {
  // padding: 0 20px;
  box-sizing: border-box;
  .speech_dialog_content {
    max-height: 555px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 760px;
    padding-right: 20px;
  }
  .material {
    margin-bottom: 20px;
  }
  .category-select {
    display: flex;
    align-items: center;
    ::v-deep .el-select {
      width: 130px;
      margin-right: 15px;
    }
  }
}
.category-dialog {
  margin-bottom: 20px;
}
.speech-detail {
  padding: 0 20px;
  box-sizing: border-box;
  .content {
    line-height: 18px;
  }
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
.common-pagination {
  width: calc(100% - 195px);
  position: absolute;
  right: 0;
  bottom: 0;
}

.search-box {
  .common-pagination {
    width: 100%;
  }
}

.form-item__behavior-wrap {
  // width: 100%;
  min-height: 30px;
  // max-height: 82px;
  padding: 15px 20px;
  border-radius: 5px;
  background: #f6f6f6;
  // overflow: auto;
  ::v-deep .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .button-new-tag {
    height: 28px;
    line-height: 28px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .behavior-group {
    display: flex;
    margin-bottom: 10px;
    .group-title {
      margin-right: 10px;
      flex-shrink: 0;
      line-height: 1.5;
      width: 80px;
      padding-top: 9px;
      box-sizing: border-box;
    }
  }
}

.extend-option {
  // margin-left: -18px;
  // margin-top: 20px;
  // margin-bottom: 25px;
  .option-content {
    display: flex;
    align-items: center;
    // margin-bottom: 10px;
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
        margin-right: 10px;
        margin-bottom: 8px;
        padding: 0px 24px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        background-color: #e8e7e6;
      }
      .right-edit-btn {
        margin-right: 10px;
        margin-bottom: 8px;
        padding: 0px 24px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #e8e7e6;
        background-color: #ffffff;
        color: #294a7b;
        cursor: pointer;
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
::v-deep .el-select {
  width: 100%;
}

// 行为标签弹窗
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
.radar-setting {
  .setting-item {
    .s-tips {
      font-size: 14px;
      color: #909399;
    }
  }
  .setting-tags {
    margin-left: 25px;
    .tags-btn {
      margin: 0 10px 10px 0;
    }
    .tag-item {
      margin: 0 10px 10px 0;
    }
    .selected-tags-box {
      padding: 20px;
      background: #fbfbfb;
      border-radius: 2px;
      border: 1px solid #eee;
      font-size: 14px;
      .s-tag-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .tag-name {
          margin-right: 10px;
        }
        .el-icon-remove-outline {
          font-size: 24px;
          margin-left: 10px;
          cursor: pointer;
          color: #82848a;
        }
      }
    }
  }
}
.check-type[type='checkbox' i] {
  zoom: 120%;
}
</style>

<style lang="scss">
.categoryDialog-row-popover {
  min-width: 0 !important;
  width: 80px;
  padding: 0;
  text-align: center;
  .categoryDialog-row-btn {
    padding: 5px 0;
    border-bottom: 2px solid #eee;
    &:last-child {
      border-bottom-color: transparent;
    }
    .el-button {
      color: #333;
    }
  }
}
.tag-dialog {
  .dialog-content {
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
    .tag-list {
      .tag-group {
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
  .group-btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
}
</style>
