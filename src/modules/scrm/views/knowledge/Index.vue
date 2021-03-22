<template>
  <div>
    <!-- <QcTable
      ref="table"
      :column="column"
      :menu="menu"
      :search-form="searchForm"
      :option="option"
      v-if="fresh"
    ></QcTable> -->
    <div class="addlivecode">
      <div class="container">
        <div class="operating-btn">
          <el-button
            type="primary"
            @click="openAddKeyword"
            size="small"
          >新增关键词</el-button>
        </div>
        <el-form
          inline
          :model="searchForm"
          label-width="100px"
          label-position="right"
          size="small"
        >
          <el-form-item
            label="关键词名称"
            style="margin-bottom: 0px"
          >
            <el-input
              placeholder="请输入关键词名称"
              v-model="searchForm.name"
              @input="searchList"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
          > </el-table-column>
          <el-table-column
            label="关键词名称"
            prop="keywordName"
            align="center"
          > </el-table-column>

          <el-table-column
            label="关键字"
            align="center"
            class="special-column"
            width="500px"
          >
            <template slot-scope="scope">
              <div>
                <span
                  v-for="(item, index) in scope.row.keywordList"
                  :key="index"
                >{{ item.keyword }}，</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="新增人"
            align="center"
            prop="createBy"
          > </el-table-column>
          <el-table-column
            label="新增时间"
            prop="createTime"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | allTableTimefilters }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            :formatter="formatterColumn"
            width="165px"
          > </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination
          :page="page"
          @sizeChange="onSizeChange"
          @pageChange="onPageChange"
        ></com-pagination>
      </div>
      <com-dialog
        :config="selectionDialog.config"
        @closeDialog="selectionDialog.config.visible = false"
      >
        <div class="editDiv">
          <el-form
            ref="models"
            :model="models"
            label-position="left"
            label-width="100px"
          >
            <el-form-item
              label="关键词名称"
              :rules="[{ required: true, message: '请填写该字段' }]"
              prop="keywordName"
            >
              <el-input v-model="models.keywordName"></el-input>
            </el-form-item>

            <el-form-item
              v-for="(item, index) in wordList"
              :key="index"
              label="关键字"
              :rules="[{ required: true, message: '请填写该字段' }]"
            >
              <el-input v-model="models.keywordList[index].keyword"></el-input>
            </el-form-item>
            <!-- <el-form-item label="文字简介">
            <el-input v-model="models.answerList[0].content"></el-input>
          </el-form-item>
          <el-form-item label="链接" v-if="model.answerList.link != ''">
            <el-input v-model="models.answerList[0].link"></el-input>
          </el-form-item>

          <el-form-item label="图片">
            <QcImageUpload class="uploadImage" width="40px" height="40px" v-model="models.answerList[0].imageUrl"
              >上传图片</QcImageUpload
            >
          </el-form-item> -->
            <div class="content-div">
              <div
                v-for="answerItem in models.answerList"
                :key="answerItem.id"
              >
                <!-- <el-form-item label="图片名称"><el-input placeholder="请输入图片名称"></el-input></el-form-item> -->
              </div>
            </div>
          </el-form>
        </div>
        <div
          class="Btn-two"
          style="display: flex; justify-content: flex-end"
        >
          <el-button @click="onCloseSave()">取消</el-button>
          <el-button
            type="primary"
            @click="onEditSave()"
          >确定</el-button>
        </div>
      </com-dialog>
      <!-- <el-dialog
      class="QwImageTextDialog"
      title="编辑关键词"
      :visible.sync="changeEditDialog"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="30%"
      height="50%"
      :before-close="callOffClick"
    >
      <i class="el-icon-close head_close el-dialog__headerbtn el-dialog__close" slot="title" @click="callOffClick"></i>
      <div class="editDiv">
        <el-form ref="models" :model="models">
          <el-form-item label="关键词名称" :rules="[{ required: true, message: '请填写该字段' }]" prop="keywordName">
            <el-input v-model="models.keywordName"></el-input>
          </el-form-item>

          <el-form-item
            v-for="(item, index) in wordList"
            :key="index"
            label="关键字"
            :rules="[{ required: true, message: '请填写该字段' }]"
          >
            <el-input v-model="models.keywordList[index].keyword"></el-input>
          </el-form-item>
          <el-form-item label="文字简介" prop="imageUrl">
            <el-input v-model="models.answerList[0].content"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="imageUrl" v-if="model.answerList.link != ''">
            <el-input v-model="models.answerList[0].link"></el-input>
          </el-form-item>

          <el-form-item label="图片" prop="logo">
            <QcImageUpload class="uploadImage" width="40px" height="40px" v-model="models.answerList[0].imageUrl"
              >上传图片</QcImageUpload
            >
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class=" QwFooter">
        <el-button @click="onCloseSave()">取 消</el-button>
        <el-button type="primary" @click="onEditSave()">确 定</el-button>
      </span>
    </el-dialog> -->
    </div>
  </div>
</template>

<script>
import api from '../../api/knowledge'
import ComDialog from '../../components/common/ComDialog'
import ComPagination from '../../components/common/ComPagination'
export default {
  components: { ComDialog, ComPagination },
  data() {
    return {
      selectionDialog: {
        config: {
          width: '800px',
          title: '编辑关键词',
          visible: false
        }
      },
      searchForm: {
        name: ''
      },
      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      tableData: [],
      height: 400,
      // searchForm: [{ label: '关键词', type: 'input', formName: 'searchKeyword', value: '' }],
      // menu: [
      //   {
      //     type: 'primary',
      //     label: '新增关键词',
      //     on: () => {
      //       // this.$router.push('mall/knowledge/form')
      //       this.$router.push(`/main/scrm/knowledge/form`)
      //     }
      //   }
      // ],
      // option: {
      //   url: 'api/admin/v1/knowledge/page'
      // },
      // column: [
      //   { type: 'index', label: '序号', align: 'center' },
      //   { prop: 'keywordName', label: '关键词名称', align: 'center' },
      //   {
      //     prop: 'keyword',
      //     label: '关键字',
      //     align: 'center',
      //     formatter: row => {
      //       return this.formatKeyword(row)
      //     }
      //   },
      //   { prop: 'createBy', label: '新增人', align: 'center' },
      //   { prop: 'createTime', label: '新增时间', align: 'center' },
      //   {
      //     label: '操作',
      //     align: 'center',
      //     formatter: row => {
      //       return (
      //         <div>
      //           <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
      //             编辑
      //           </el-button>
      //           <el-button
      //             type="text"
      //             onClick={() => {
      //               this.$confirm('是否删除该数据?', '提示', {
      //                 confirmButtonText: '确定',
      //                 cancelButtonText: '取消',
      //                 type: 'warning'
      //               })
      //                 .then(() => {
      //                   api.appDelete({ id: row.id }).then(() => {
      //                     this.$refs.table.onSearchKeep()
      //                     this.$message.success('删除成功')
      //                   })
      //                 })
      //                 .catch(() => {})
      //             }}
      //           >
      //             删除
      //           </el-button>
      //         </div>
      //       )
      //     }
      //   }
      // ],
      // formatKeyword(row) {
      //   let keyword = ''
      //   row.keywordList.forEach((item, idx) => {
      //     if (idx === 0) {
      //       keyword += item.keyword
      //     } else {
      //       keyword += ' , ' + item.keyword
      //     }
      //   })
      //   return keyword
      // },
      changeEditDialog: false,
      model: {
        keywordName: '',
        isDeleted: false,
        createTime: '',
        id: '',
        appId: '',
        createBy: '',
        searchKeyword: '',
        updateTime: '',
        keywordList: [
          {
            keyword: '',
            knowledgeId: '',
            id: '',
            sequence: ''
          }
        ],
        answerList: [
          {
            type: '',
            id: '',
            appId: '',
            isDeleted: false,
            createTime: '',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: '',
            konwledgeId: '',
            mediaId: '',
            sequence: ''
          }
        ]
      },
      models: {
        keywordName: '',
        isDeleted: false,
        createTime: '',
        id: '',
        appId: '',
        createBy: '',
        searchKeyword: '',
        updateTime: '',
        keywordList: [
          {
            keyword: '',
            knowledgeId: '',
            id: '',
            sequence: ''
          }
        ],
        answerList: [
          {
            type: '',
            id: '',
            appId: '',
            isDeleted: false,
            createTime: '',
            name: '',
            content: '',
            imageUrl: '',
            videoUrl: '',
            link: '',
            programId: '',
            file: '',
            createBy: '',
            konwledgeId: '',
            mediaId: '',
            sequence: ''
          }
        ]
      },
      wordList: [
        {
          keyword: '',
          knowledgeId: '',
          id: '',
          sequence: ''
        }
      ],
      answerList: [],
      id: '',
      fresh: true,
      page: {
        pageNum: 1,
        pageSize: 15
      }
    }
  },
  methods: {
    showEditDialog(row) {
      // this.model = Object.assign({}, row)
      // // this.changeEditDialog = true
      // this.models.keywordName = row.keywordName
      // this.models.keywordList = row.keywordList
      // this.models.searchKeyword = '1'
      // this.models.appId = row.answerList[0].appId
      // this.models.createTime = row.createTime
      // this.models.createBy = row.createBy
      // this.models.id = row.id
      // this.models.updateTime = row.updateTime
      // this.models.answerList = row.answerList
      // this.wordList = this.models.keywordList
      api.appGet({ id: row.id }).then(res => {
        this.selectionDialog.config.visible = true
        this.models = res.data.data
        this.wordList = this.models.keywordList
        // this.models.answerList = res.data.data.answerList
        console.log(this.models.answerList)
        // let rows = res.data.data
        // this.models.keywordName = rows.keywordName
        // this.models.keywordList = rows.keywordList
        // this.models.searchKeyword = '1'
        // this.models.appId = rows.answerList[0].appId
        // this.models.createTime = rows.createTime
        // this.models.createBy = rows.createBy
        // this.models.id = rows.id
        // this.models.updateTime = rows.updateTime
        // this.models.answerList = rows.answerList
        // this.wordList = this.models.keywordList
      })
    },
    appPage() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: this.searchForm.name
      }
      api.appPage(params).then(res => {
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onEditSave() {
      this.$refs.models.validate(flag => {
        if (flag) {
          api.addUpdate(this.models).then(() => {
            this.$message.success('更新成功')
            this.appPage()
            this.selectionDialog.config.visible = false
            // this.models = {}
          })
        }
      })
    },
    onCloseSave() {
      this.selectionDialog.config.visible = false
      // this.Refresh()
      this.models.keywordName = ''
      this.models.keywordList = ''
      this.models.searchKeyword = '1'
      this.models.appId = ''
      this.models.createTime = ''
      this.models.createBy = ''
      this.models.id = ''
      this.models.updateTime = ''
      this.models.answerList = []
      this.wordList = []
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight - document.querySelector('#table').offsetTop - TOP_HEADER_HEIGHT - PAGINATION_HEIGHT + 10
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.appPage()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.appPage()
    },
    searchList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.appPage()
    },
    reSearch() {
      this.searchForm.name = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.appPage()
    },
    formatterColumn(row) {
      return (
        <div>
          <el-button type="text" onClick={this.showEditDialog.bind(this, row)}>
            编辑
          </el-button>
        </div>
      )
    },
    openAddKeyword() {
      this.$router.push(`/main/scrm/knowledge/form`)
    },
    // callOffClick() {
    //   this.selectionDialog.config.visible = false
    //   // this.Refresh()
    // },

    Refresh() {
      this.fresh = false
      this.$nextTick(function () {
        this.fresh = true
      })
    }
  },
  created() {
    this.appPage()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
      window.onresize = () => {
        this.fullTableHeight()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ffffff;
}
.container {
  background-color: #ffffff;
  display: flex;
  padding: 20px;
  .operating-btn {
    margin-right: auto;
  }
}
.query-table-box {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  box-sizing: border-box;
}
.special-column {
  max-height: 200px;
  width: 200px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.editDiv {
  max-height: 600px;
  overflow-y: auto;
}
.content-div {
  // border: 1px solid red;
}
</style>
