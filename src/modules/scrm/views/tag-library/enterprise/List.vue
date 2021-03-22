<template>
  <div class="enterprise">
    <!-- 顶部导航 -->
    <TabButton
      :navList="navList"
      @change="changeNavBarFun"
    ></TabButton>
    <!-- 列表内容 -->
    <div
      class="middle_content"
      id="table-content"
    >
      <div
        class="enterprise_list"
        v-show="navBarFlag == 0"
      >
        <div class="btns_content">
          <div class="nums">目前已有企业标签：{{ enterpriseSearch.total }}</div>
          <div class="btns">
            <el-button
              type="primary"
              size="mini"
              @click="addEnterpriseTagGroup"
            >添加标签组</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="refreshEnterpriseTag"
            >标签同步</el-button>
          </div>
        </div>
        <div class="table">
          <template>
            <el-table
              :data="enterpriseTableData"
              style="width: 100%"
              :height="height"
              id="table"
              v-loading="isEnterpriseLoading"
            >
              <el-table-column
                prop="name"
                label="标签组名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="tagList"
                label="标签内容"
                align="center"
                width="800"
              >
                <template slot-scope="scope">
                  <!-- <el-tag v-for="(item, index) in scope.row.tagList" :key="index" style="margin: 5px" effect="plain">
                    {{ item.name }}
                  </el-tag> -->
                  <Tag
                    type="light"
                    icon="el-icon-price-tag"
                    v-for="(item, index) in scope.row.tagList"
                    :key="index"
                  >{{
                    item.name
                  }}</Tag>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="order" label="序号" align="center"> </el-table-column> -->
              <el-table-column
                prop="groupTime"
                label="新增时间"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.groupTime | allTableTimefilters }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="text"
                      @click="showEnterpriseEditDialog(scope.row)"
                    >修改</el-button>
                    <el-button
                      type="text"
                      @click="deteleEnterpriseTagGroup(scope.row.groupId)"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ enterpriseSearch.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="enterpriseSearchOnSizeChange"
            @current-change="enterpriseSearchOnPageChange"
            :page-sizes="[15, 30, 50]"
            :page-size="enterpriseSearch.pageSize"
            :current-page="enterpriseSearch.pageNum"
            :total="enterpriseSearch.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
      </div>
      <div
        class="behavior_list"
        v-show="navBarFlag == 1"
      >
        <div class="btns_content_list">
          <div class="nums">
            <div class="num_content">
              <el-alert
                type="warning"
                title="企业行为标签管理，系统可通过客户的行为自动打上行为标签，并记录在客户画像。编辑好标签后，请前往渠道获得或互动类型关联行为标签进行使用"
                show-icon
                :closable="false"
                class="alert"
              ></el-alert>
            </div>
            <div class="num_num">目前已有行为标签：{{ behaviorSearch.total }}</div>
          </div>
          <div class="btns">
            <el-button
              type="primary"
              size="mini"
              @click="addBehaviorTagGroup"
            >添加标签组</el-button>
          </div>
        </div>
        <div class="table">
          <template>
            <el-table
              :data="behaviorTableData"
              style="width: 100%"
              :height="height"
              id="table"
              v-loading="isBehaviorLoading"
            >
              <el-table-column
                prop="name"
                label="标签组名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="tagList"
                label="标签内容"
                align="center"
                width="800"
              >
                <template slot-scope="scope">
                  <Tag
                    type="light"
                    icon="el-icon-price-tag"
                    v-for="(item, index) in scope.row.tagList"
                    :key="index"
                  >
                    {{ item.name }}
                  </Tag>
                  <!-- <el-tag class="tag-item" v-for="(item, index) in scope.row.tagList"
                      :key="index" style="margin: 5px" effect="plain" @click="goToTagDetail(item, scope.row.name)">
                    {{ item.name }}
                  </el-tag> -->
                  <!-- <div class="tagList">
                    <span
                      class="behavior-tag-item"
                      v-for="(item, index) in scope.row.tagList"
                      :key="index"
                      @click="goToTagDetail(item, scope.row.name)"
                      >{{ item.name }}</span
                    >
                  </div> -->
                </template>
              </el-table-column>
              <!-- <el-table-column prop="sequence" label="序号" align="center"> </el-table-column> -->
              <el-table-column
                prop="createTime"
                label="新增时间"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.createTime | allTableTimefilters }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="text"
                      @click="showBehaviorEditDialog(scope.row)"
                    >修改</el-button>
                    <el-button
                      type="text"
                      @click="deteleBehaviorTagGroup(scope.row.id)"
                    >删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ behaviorSearch.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="behaviorSearchOnSizeChange"
            @current-change="behaviorSearchOnPageChange"
            :page-sizes="[15, 30, 50]"
            :page-size="behaviorSearch.pageSize"
            :current-page="behaviorSearch.pageNum"
            :total="behaviorSearch.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 企业标签弹窗 -->
    <!-- 添加标签组 -->
    <com-dialog
      :config="addEnterpriseTagDialog.config"
      @closeDialog="addEnterpriseTagDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="enterpriseModel"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="enterpriseModel.groupName"
          ></el-input>
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div
              class="addtag-input-content"
              v-for="(item, index) in enterpriseModel.tagList"
              :key="index"
            >
              <div class="inp">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  show-word-limit
                  v-model="item.name"
                ></el-input>
              </div>
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleEnterpriseRow(index)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button
              @click="addEnterpriseKeyWord"
              plain
              icon="el-icon-plus"
              size="small"
            >添加标签</el-button>
          </div>
        </div>
      </el-form>
      <div></div>
      <div
        class="Btn-two"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="closeEnterpriseAddDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="sumbitEnterpriseAddDialog()"
        >确定</el-button>
      </div>
    </com-dialog>
    <!-- 编辑标签组 -->
    <com-dialog
      :config="editEnterpriseDialog.config"
      @closeDialog="editEnterpriseDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="eidtExtendModel"
        :model="enterpriseEditModel"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称:">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="enterpriseEditModel.groupName"
          ></el-input>
          <!-- <span class="addtag-item-span">{{ enterpriseEditModel.groupName }}</span> -->
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div
              class="addtag-input-content"
              v-for="(item, index) in enterpriseEditModel.tagList"
              :key="index"
            >
              <div class="inp">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  show-word-limit
                  v-model="enterpriseEditModel.tagList[index].name"
                ></el-input>
              </div>
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleEnterpriseEditRow(item.tagId, item.id)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button
              @click="addEnterpriseEditKeyWord"
              plain
              icon="el-icon-plus"
              size="small"
            >添加标签</el-button>
          </div>
        </div>
      </el-form>
      <!-- <div class="addtag-addBtn"><el-button type="text" @click="addEnterpriseEditKeyWord()"> 添加标签</el-button></div> -->
      <!-- <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10"
            ><el-button type="text" style="color: red" @click="deteleEnterpriseTagGroup()"
              >删除标签组</el-button
            ></el-col
          >
        </el-row>
      </div> -->
      <div
        class="footer_btns"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="closeEnterpriseEditDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="sumbitEnterpriseEditDialog()"
        >确定</el-button>
      </div>
    </com-dialog>
    <!-- 行为标签弹窗 -->
    <!-- 添加标签组 -->
    <com-dialog
      :config="addBehaviorTagDialog.config"
      @closeDialog="addBehaviorTagDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="addExtendModel"
        :model="behaviorModel"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model="behaviorModel.name"
          ></el-input>
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div
              class="addtag-input-content"
              v-for="(item, index) in behaviorModel.tagList"
              :key="index"
            >
              <div class="inp">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  v-model="item.name"
                ></el-input>
              </div>
              <!-- <div class="score">
                <el-input placeholder="请输入分值" v-model="item.score"></el-input>
              </div> -->
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleBehaviorRow(index)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button
              @click="addBehaviorKeyWord"
              plain
              icon="el-icon-plus"
              size="small"
            >添加标签</el-button>
          </div>
        </div>
      </el-form>
      <div></div>
      <div
        class="Btn-two"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="closeBehaviorAddDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="sumbitBehaviorAddDialog()"
        >确定</el-button>
      </div>
    </com-dialog>
    <!-- 编辑标签组 -->
    <com-dialog
      :config="editBehaviorDialog.config"
      @closeDialog="editBehaviorDialog.config.visible = false"
      class="dialogSelect"
    >
      <el-form
        label-position="right"
        label-width="auto"
        ref="eidtExtendModel"
        :model="behaviorEditModel"
        class="el-form-filter"
      >
        <el-form-item label="标签组名称:">
          <el-input
            placeholder="请输入标签组名称"
            maxlength="15"
            show-word-limit
            v-model=" behaviorEditModel.name"
          ></el-input>
          <!-- <span>{{ behaviorEditModel.name }}</span> -->
        </el-form-item>
        <div class="addtag-item">
          <div class="addtag-title">标签</div>
          <div class="addtag-input">
            <div
              class="addtag-input-content"
              v-for="(item, index) in behaviorEditModel.tagList"
              :key="index"
            >
              <div class="inp">
                <el-input
                  placeholder="请输入标签名"
                  maxlength="15"
                  show-word-limit
                  v-model="behaviorEditModel.tagList[index].name"
                ></el-input>
              </div>
              <!-- <div class="score">
                <el-input placeholder="请输入分值" v-model="behaviorEditModel.tagList[index].score"></el-input>
              </div> -->
              <div class="btn">
                <el-button
                  circle
                  icon="el-icon-minus"
                  @click="deteleBehaviorEditRow(item.id)"
                  size="mini"
                ></el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button
              @click="addBehaviorEditKeyWord"
              plain
              icon="el-icon-plus"
              size="small"
            >添加标签</el-button>
          </div>
        </div>
      </el-form>
      <!-- <div class="addtag-addBtn"><el-button type="text" @click="addBehaviorEditKeyWord()">添加标签</el-button></div> -->
      <!-- <div class="Btn-two">
        <el-row :gutter="24">
          <el-col :span="10"
            ><el-button type="text" style="color: red" @click="deteleBehaviorTagGroup()">删除标签组</el-button></el-col
          >
        </el-row>
      </div> -->
      <div
        class="footer_btns"
        style="display: flex; justify-content: flex-end"
      >
        <el-button @click="closeBehaviorEditDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="sumbitBehaviorEditDialog()"
        >确定</el-button>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../../../components/common/ComDialog'
import ComPagination from '../../../components/common/ComPagination'
import TabButton from '../../../components/components/TabButton'
import Tag from '../../../components/components/Tag'
export default {
  components: { TabButton, Tag, ComDialog },
  data() {
    return {
      // 导航列表
      navList: [
        {
          name: '企业标签',
          isActive: true
        },
        {
          name: '行为标签',
          isActive: false
        }
      ],
      // 导航开关
      navBarFlag: 0,
      // 企业标签
      enterpriseTableData: [],
      enterpriseSearch: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      height: 400,
      isEnterpriseLoading: true,
      // 企业标签弹窗
      addEnterpriseTagDialog: {
        config: {
          width: '600px',
          title: '新增标签组',
          visible: false
        }
      },
      enterpriseModel: {
        groupName: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      },
      editEnterpriseDialog: {
        config: {
          width: '600px',
          title: '编辑标签组',
          visible: false
        }
      },
      enterpriseEditModel: {
        groupId: '',
        groupName: '',
        order: 0,
        tagList: []
      },
      // 行为标签
      behaviorTableData: [],
      behaviorSearch: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      isBehaviorLoading: true,
      // 行为标签弹窗
      addBehaviorTagDialog: {
        config: {
          width: '600px',
          title: '新增标签组',
          visible: false
        }
      },
      behaviorModel: {
        // groupId: '',
        name: '',
        tagList: [
          {
            id: '',
            name: ''
          }
        ]
      },
      whatBehaviorDialog: {
        config: {
          width: '500px',
          title: '行为标签',
          visible: false
        }
      },
      whatBehaviorMessage: [
        {
          message: '1.行为标签与其他类型标签不同在于带有分值属性，行为标签用以设置特定行为事件产生地自动打标签。'
        },
        {
          message:
            '2.标签分值用于标签被使用的次数情况，即客户带有该标签的深度表现，例如客户浏览商品的次数越多，对应标签的分值越高，说明越感兴趣。'
        },
        {
          message:
            '3.分值可以设置为0，即该标签无需分值，无需表现深度，例如通过扫码渠道参加了活动，则该渠道标签无需分值即深度的表现。'
        }
      ],
      editBehaviorDialog: {
        config: {
          width: '600px',
          title: '编辑标签组',
          visible: false
        }
      },
      behaviorEditModel: {
        id: '',
        name: '',
        tagList: []
      }
    }
  },
  methods: {
    // ---页面渲染函数---
    // 切换导航
    changeNavBarFun(index) {
      this.navBarFlag = index
      if (index == 0) {
        this.getEnterpriseTagPage({})
      } else if (index == 1) {
        this.getBehaviorTagPage({})
      }
    },
    // ---企业标签
    // 分页
    enterpriseSearchOnSizeChange(val) {
      this.enterpriseSearch.pageSize = val
      this.getEnterpriseTagPage({})
    },
    enterpriseSearchOnPageChange(val) {
      this.enterpriseSearch.pageNum = val
      this.getEnterpriseTagPage({})
    },
    getTableHeight() {
      const OTHER_HEIGHT = 40 + 50 + 52 + 52
      this.height = window.innerHeight - document.querySelector('#table-content').offsetTop - OTHER_HEIGHT
      console.log('当前高度' + this.height)
    },
    // 企业标签弹窗
    // --- 添加
    //添加标签组开始
    addEnterpriseTagGroup() {
      this.enterpriseModel.groupName = ''
      this.enterpriseModel.tagList = [{}]
      this.addEnterpriseTagDialog.config.visible = true
    },
    //删除
    deteleEnterpriseRow(index) {
      if (this.enterpriseModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.enterpriseModel.tagList.splice(index, 1)
      console.log(this.enterpriseModel.tagList)
    },
    //添加标签名
    addEnterpriseKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.enterpriseModel.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.enterpriseModel.tagList.push({ name: '' })
      return
    },
    //关闭添加标签组弹窗
    closeEnterpriseAddDialog() {
      this.enterpriseModel.groupName = ''
      this.enterpriseModel.tagList = [{}]
      this.addEnterpriseTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitEnterpriseAddDialog() {
      // let arr = this.enterpriseModel.tagList
      let flag = false
      let flags = false
      if (this.enterpriseModel.groupName == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.enterpriseModel.tagList[0].name == '') {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.enterpriseModel.tagList.forEach(item => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          console.log(this.enterpriseModel)
          this.$http.addEnterpriseGroup(this.enterpriseModel).then(() => {
            this.$message.success('添加成功')
            this.addEnterpriseTagDialog.config.visible = false
            this.enterpriseModel.groupName = ''
            this.enterpriseModel.tagList = [{}]
            this.getEnterpriseTagPage({})
          })
        }
      }
    },
    // --- 编辑
    //显示编辑弹窗
    showEnterpriseEditDialog(row) {
      this.enterpriseEditModel = {
        groupId: '',
        groupName: '',
        order: 0,
        tagList: []
      }
      this.enterpriseEditModel.groupName = row.name
      this.enterpriseEditModel.groupId = row.groupId
      this.enterpriseEditModel.order = row.order
      row.tagList.forEach(item => {
        this.enterpriseEditModel.tagList.push({
          name: item.name,
          order: item.order,
          tagId: item.tagId
        })
      })
      this.editEnterpriseDialog.config.visible = true
    },
    //删除添加标签
    deteleEnterpriseEditRow(tagId) {
      let wxTagIdList = []
      if (this.enterpriseEditModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }

      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wxTagIdList.push(tagId)
        this.$http.deteleEnterpriseGroup({ wxTagIdList: wxTagIdList }).then(() => {
          this.$message.success('删除标签名成功')

          this.getEnterpriseTagPage({})
        })
        this.enterpriseEditModel.tagList.some((item, i) => {
          if (item.tagId == tagId) {
            console.log(item.tagId)
            this.enterpriseEditModel.tagList.splice(i, 1)
            return true
          }
        })
      })

      // console.log(this.model.tagList)
    },
    //关闭编辑按钮
    closeEnterpriseEditDialog() {
      this.editEnterpriseDialog.config.visible = false
    },
    //确认编辑按钮
    sumbitEnterpriseEditDialog() {
      let flag = false
      let flags = false
      let newTagList = []
      if (this.enterpriseEditModel.groupName == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.enterpriseEditModel.tagList[0].name == '') {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.enterpriseEditModel.tagList.forEach(item => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.enterpriseEditModel.tagList.forEach(item => {
            newTagList.push({
              name: item.name,
              id: item.tagId,
              order: item.order
            })
          })
          this.enterpriseEditModel.tagList = newTagList
          console.log(this.enterpriseEditModel)
          this.$http.updateEnterpriseGroup(this.enterpriseEditModel).then(res => {
            this.$message.success('编辑成功')
            this.getEnterpriseTagPage({})
            this.editEnterpriseDialog.config.visible = false
          })
        }
      }
    },
    addEnterpriseEditKeyWord() {
      let keyword = ''
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.enterpriseEditModel.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.enterpriseEditModel.tagList.push({ name: keyword })
      return
    },
    deteleEnterpriseTagGroup(groupId) {
      let wxTagGroupIdList = []
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // wxTagGroupIdList.push(this.enterpriseEditModel.groupId)
          wxTagGroupIdList.push(groupId)
          this.$http.deteleEnterpriseGroup({ wxTagGroupIdList: wxTagGroupIdList }).then(() => {
            this.$message.success('删除标签组成功')
            this.editEnterpriseDialog.config.visible = false
            this.getEnterpriseTagPage({})
          })
        })
        .catch(() => {})
    },
    // ---行为标签
    // 分页
    behaviorSearchOnSizeChange(val) {
      this.behaviorSearch.pageSize = val
      this.getBehaviorTagPage({})
    },
    behaviorSearchOnPageChange(val) {
      this.behaviorSearch.pageNum = val
      this.getBehaviorTagPage({})
    },
    // ---添加
    //添加标签组开始
    addBehaviorTagGroup() {
      this.behaviorModel.name = ''
      this.behaviorModel.tagList = [{}]
      this.addBehaviorTagDialog.config.visible = true
    },
    //关闭添加标签组弹窗
    closeBehaviorAddDialog() {
      this.behaviorModel.name = ''
      this.behaviorModel.tagList = [{}]
      this.addBehaviorTagDialog.config.visible = false
    },
    //提交标签组弹窗
    sumbitBehaviorAddDialog() {
      // let arr = this.model.tagList
      let flag = false
      let flags = false
      if (this.behaviorModel.name == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.behaviorModel.tagList[0].name == undefined) {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.behaviorModel.tagList.forEach(item => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.$http.addBehavior(this.behaviorModel).then(() => {
            this.$message.success('添加成功')
            this.addBehaviorTagDialog.config.visible = false
            this.behaviorModel.name = ''
            this.behaviorModel.tagList = [{}]
            this.getBehaviorTagPage({})
          })
        }
      }
    },
    //删除
    deteleBehaviorRow(index) {
      if (this.behaviorModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.behaviorModel.tagList.splice(index, 1)
    },
    //添加标签名
    addBehaviorKeyWord() {
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.behaviorModel.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.behaviorModel.tagList.push({ name: '', score: '' })
      return
    },
    // ---编辑
    //显示编辑弹窗
    showBehaviorEditDialog(row) {
      this.behaviorEditModel = {
        id: '',
        name: '',
        appId: '',
        createTime: '',
        updateTime: '',
        isDeleted: true,
        tagList: []
      }
      this.behaviorEditModel.name = row.name
      this.behaviorEditModel.id = row.id
      this.behaviorEditModel.appId = row.appId
      this.behaviorEditModel.createTime = row.createTime
      this.behaviorEditModel.sequence = row.sequence
      row.tagList.forEach(item => {
        this.behaviorEditModel.tagList.push({
          name: item.name,
          score: item.score,
          id: item.id
        })
      })
      this.editBehaviorDialog.config.visible = true
    },
    //关闭编辑按钮
    closeBehaviorEditDialog() {
      this.editBehaviorDialog.config.visible = false
    },
    //确认编辑按钮
    sumbitBehaviorEditDialog() {
      let flag = false
      let flags = false
      let newTagList = []
      if (this.behaviorEditModel.name == '') {
        this.$message.warning('请输入标签分组名称')
      } else if (this.behaviorEditModel.tagList[0].name == undefined) {
        this.$message.warning('请输入标签名')
      } else {
        let newArr = []
        this.behaviorEditModel.tagList.forEach(item => {
          newArr.push(item.name)
          flags = item.name == ''
        })
        var s = newArr.join(',') + ','
        for (var i = 0; i < newArr.length; i++) {
          flag = s.replace(newArr[i] + ',', '').indexOf(newArr[i] + ',') > -1
        }
        if (flags == true) {
          this.$message.warning('请输入标签名')
        } else if (flag == true) {
          this.$message.warning('标签名字不能重复')
        } else {
          this.behaviorEditModel.tagList.forEach(item => {
            newTagList.push({
              name: item.name,
              id: item.id,
              score: item.score
            })
          })
          this.behaviorEditModel.tagList = newTagList
          console.log(this.behaviorEditModel)
          this.$http.updateBehavior(this.behaviorEditModel).then(() => {
            this.$message.success('编辑成功')
            this.getBehaviorTagPage({})
            this.editBehaviorDialog.config.visible = false
          })
        }
      }
    },
    addBehaviorEditKeyWord() {
      let keyword = ''
      if (this.flag) {
        this.$message.warning('请输入标签名')
      }
      if (this.behaviorEditModel.tagList.some(item => !item.name)) {
        this.$message.warning('请输入标签名')
        return
      }
      this.behaviorEditModel.tagList.push({ name: keyword })
      return
    },
    deteleBehaviorTagGroup(id) {
      let wxTagGroupIdList = ''
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          wxTagGroupIdList = id
          this.$http.deleteBehavior({ id: wxTagGroupIdList }).then(() => {
            this.$message.success('删除标签组成功')
            this.editBehaviorDialog.config.visible = false
            this.getBehaviorTagPage({})
          })
        })
        .catch(() => {})
    },
    //删除添加标签
    deteleBehaviorEditRow(id) {
      if (this.behaviorEditModel.tagList.length === 1) {
        this.$message.warning('至少含有一个标签')
        return
      }
      this.behaviorEditModel.tagList.some((item, i) => {
        if (item.id == id) {
          this.behaviorEditModel.tagList.splice(i, 1)
          return true
        }
      })
    },
    // ---获取数据函数---
    // 获取企业标签列表
    getEnterpriseTagPage(options) {
      options.pageNum = this.enterpriseSearch.pageNum
      options.pageSize = this.enterpriseSearch.pageSize
      this.isEnterpriseLoading = true
      this.$http.getEnterpriseTagPage(options).then(res => {
        console.log(res.data.data)
        this.enterpriseTableData = res.data.data.list
        this.enterpriseSearch.total = res.data.data.total
        this.isEnterpriseLoading = false
      })
    },
    // 同步标签
    refreshEnterpriseTag() {
      this.$http.refreshEnterpriseTag().then(() => {
        this.getEnterpriseTagPage({})
        this.$message.success('标签同步成功')
      })
    },
    // 获取企业标签列表
    getBehaviorTagPage(options) {
      options.pageNum = this.behaviorSearch.pageNum
      options.pageSize = this.behaviorSearch.pageSize
      this.isBehaviorLoading = true
      this.$http.getBehaviorPage(options).then(res => {
        console.log('行为标签', res)
        this.behaviorTableData = res.data.data.list
        this.behaviorSearch.total = res.data.data.total
        this.isBehaviorLoading = false
      })
    },
    // 查看标签详情
    goToTagDetail(item, groupName) {
      console.log('查看详情')
      // 缓存当前选中的菜单项
      sessionStorage.setItem('tagNavBarFlag', 1)
      this.$router.push(
        `/main/scrm/tag-library/behavior/detail?id=${item.id}&tagName=${item.name}&groupName=${groupName}`
      )
    }
  },
  created() {
    // 判断默认选中企业标签或者是行为标签
    let flag = sessionStorage.getItem('tagNavBarFlag')
    if (flag && flag != '') {
      this.navBarFlag = flag
      this.navList.map(item => (item.isActive = false))
      this.navList[flag].isActive = true
      this.getBehaviorTagPage({})
      sessionStorage.removeItem('tagNavBarFlag')
    } else {
      this.getEnterpriseTagPage({})
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
      window.onresize = () => {
        this.getTableHeight()
      }
    })
  },
  destroyed() {
    window.onresize = ''
  }
}
</script>

<style lang="scss" scoped>
.enterprise {
  width: 100%;
  height: 100%;
  .top_nav {
    width: 100%;
    height: 44px;
    // background-color: #F5F5F5;
    display: flex;
    ul {
      display: flex;
      background-color: #ffffff;
      background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
      li {
        width: 120px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        background-color: #ebeef5;
        font-size: 14px;
        user-select: none;
        // border-radius: 20px;
        cursor: pointer;
        &.active {
          border-radius: 0px;
          border-radius: 10px;
          background-color: #ffffff;
        }
        &.borderLeft {
          border-bottom-left-radius: 10px;
        }
        &.borderRight {
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
  .middle_content {
    width: 100%;
    height: calc(100% - 40px);
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
  }
  .enterprise_list,
  .behavior_list {
    .btns_content {
      display: flex;
      height: 30px;
      align-items: center;
      padding-bottom: 20px;
      .nums {
        flex: 1;
        font-size: 14px;
        color: #606266;
        margin-right: 20px;
        .num_content {
          margin: 20px 0;
          background-color: #fdf6ec;
          color: #e6a23c;
          font-size: 14px;
          padding-left: 10px;
        }
        .num_num {
          margin-bottom: 20px;
          padding-left: 10px;
        }
      }
      .btns {
        margin-left: auto;
      }
    }
    .btns_content_list {
      display: flex;
      align-items: center;
      .nums {
        flex: 1;
        font-size: 14px;
        color: #606266;
        margin-right: 20px;
        .num_content {
          // padding: 10px 0 10px 10px;
          margin-bottom: 20px;
          // background-color: #fdf6ec;
          // color: #e6a23c;
          font-size: 14px;
        }
        .num_num {
          margin-bottom: 20px;
          padding-left: 10px;
        }
      }
      .btns {
        margin-bottom: 55px;
        // border: 1px solid green;
        margin-left: auto;
      }
    }
    .table {
      .tagList {
        span {
          display: inline-block;
          padding: 5px 5px;
          margin: 5px;
          // border: 1px solid #dfdcdc;
          background-color: #f2f2f2;
          border-radius: 3px;
        }
      }
    }
    .page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      padding: 10px 15px;
      .pagination-count {
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        color: #7b7b7b;
        .count {
          margin-right: 20px;
        }
      }
    }
  }
}
.enterprise-tag {
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
  color: #303133;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .info-left {
    display: flex;
    .info-msg {
      margin-right: 40px;
      span {
        color: #1e90ff;
      }
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}

.iconMinu {
  margin-top: 5px;
  font-size: 17px;
  color: #d36b5d;
  background-color: #cdcdcd;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
}
.addtag-item {
  .addtag-title {
    padding: 5px 0;
  }
  .addtag-input {
    padding-top: 10px;
    .addtag-input-content {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .inp {
        flex: 1;
      }
      .score {
        padding-left: 10px;
        width: 110px;
      }
      .btn {
        width: 28px;
        padding-left: 10px;
      }
    }
  }
  .addtag-addBtn {
    margin-bottom: 20px;
    .el-button {
      color: #1e90ff;
    }
  }
}
::v-deep .el-table th {
  color: #303133;
  background-color: #ebeef5;
}
.common-table-box {
  // padding: 0 20px;
  box-sizing: border-box;
}
.tagName {
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
::v-deep .special-column {
  width: 700px;
  min-height: 10px;
}
.el-form-filter {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.tagname-form {
  min-height: 70px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.behavior-tag-item {
  cursor: pointer;
  border: 1px solid #f2f2f2;
  &:hover {
    border: 1px solid #294a7b;
    color: #294a7b;
  }
}
.tag-item {
  &:hover {
    background-color: #294a7b;
    color: #fff;
    cursor: pointer;
  }
}
</style>
