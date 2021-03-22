<style lang="scss" scoped>
.keys {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #e8e7e6;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
  .keydelete {
    position: absolute;
    top: 0px;
    right: 0px;
    display: none;
  }
}
.keys:hover .keydelete {
  display: block;
}
.activekey {
  background-color: #294a7b;
  color: #ffffff;
}
.add-btn {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #ffffff;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid #e8e7e6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #294a7b;
}
.havekey {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 24px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  background-color: #e8e7e6;
  position: relative;
  .keydelete {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
  }
}
.havekey:hover .keydelete {
  display: block;
}
.haveedit {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 15px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}
.matebox {
  display: flex;
  .matename {
    width: 500px;
  }
}
/* .matebox:hover .matebtn {
  display: block;
} */
.matebtn {
  margin-left: 20px;
  /* display: none; */
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
            margin-left: 10px;
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
<template>
  <el-dialog
    :title="id ? '编辑多图文' : '新建多图文'"
    :visible.sync="visible"
    width="1000px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="model"
      ref="model"
      label-width="100px"
      label-position="right"
    >
      <el-form-item
        label="多图文标题"
        prop="name"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input
          v-model="model.name"
          maxlength="64"
          placeholder="标题最长为64个字符"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="多图文分类"
        prop="groupId"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-cascader
          :options="data"
          :props="{ value: 'id', label: 'name', children: 'childs' }"
          :show-all-levels="true"
          v-model="model.groupId"
          style="width:400px"
          @change="changeCascader"
          ref="elcascader"
          @visible-change="elCascaderOnlick"
          @expand-change="elCascaderOnlick"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="多图文封面"
        prop="imageUrl"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <QcImageUpload
          v-model="model.imageUrl"
          width="100px"
          height="100px"
        ></QcImageUpload>
      </el-form-item>
      <el-form-item
        label="多图文简介"
        prop="content"
        :rules="[{ required: true, message: '该字段不能为空' }]"
      >
        <el-input
          type="textarea"
          v-model="model.content"
          maxlength="64"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键字">
        <el-button
          v-if="selectedKeyWords.length == 0"
          @click=";(keywordModel = true), getKeySear()"
        ><i class="el-icon-plus"></i>添加</el-button>
        <div
          v-else
          style="display:flex;flex-wrap:wrap"
        >
          <div
            class="havekey"
            v-for="(item, i) in selectedKeyWords"
            :key="i"
          >{{ item }}<i class="el-icon-circle-close keydelete" @click="selectedKeyWords.splice(i,1),selectedKeyWordIds.splice(i,1)"></i></div>
          <el-button
            class="haveedit"
            size="mini"
            @click=";(keywordModel = true), getKeySear()"
          ><i class="el-icon-edit"></i>编辑</el-button>
        </div>
      </el-form-item>
      <el-form-item label="雷达追踪">
        <!-- <el-switch v-model="model.isRadar"></el-switch>
        <span style="margin:0 10px 0 5px">同步到雷达链接</span>
        <el-tooltip
          effect="dark"
          placement="right"
          content="使用雷达链接发送，可追踪链接打开记录"
          style="margin-left: 5px">
          <i class="el-icon-question"></i>
        </el-tooltip> -->
        <div>
          <div class="setting-item">
              <el-checkbox @change="getnumber" v-model="model.radarRequest.isBehaviorNotice">行为通知</el-checkbox>
              <span class="s-tips">（当客户点击雷达时，发送雷达的员工将会收到消息提醒）</span>
            </div>
            <!-- <div class="setting-item">
              <el-checkbox @change="getnumber" v-model="model.radarRequest.isActionNotice">动态通知</el-checkbox>
              <span class="s-tips">（当客户点击雷达时，会将客户的打开行为记录在客户动态里）</span>
            </div> -->
            <div class="setting-item">
              <el-checkbox @change="getnumber" v-model="model.radarRequest.isBehaviorTag">客户标签</el-checkbox>
              <span class="s-tips">（给点击雷达的客户打上选中的标签）</span>
            </div>
            <div class="setting-tags" v-if="model.radarRequest.isBehaviorTag">
              <el-button size="mini" icon="el-icon-plus" class="tags-btn" @click="behaviorDialog.config.visible = true,getBehavoirTag()">选择标签</el-button>
              <div class="selected-tags-box" v-if="selectedBehaviorTags.length > 0">
                <div class="s-tag-item" v-for="(item, index) in selectedBehaviorTags" :key="index">
                  <span class="tag-name">{{ item.name }}：</span>
                  分值&nbsp;&nbsp;<el-input-number size="mini" @change="getnumber" v-model="item.businessScore"></el-input-number>
                  <i class="el-icon-remove-outline" @click="selectedBehaviorTags.splice(index, 1)"></i>
                </div>
              </div>
            </div>
        </div>
      </el-form-item>
      <el-form-item label="素材" :rules="[{ required: true, message: '该字段不能为空' }]">
        <div v-if="MoreGraphicMatter.length == 0" style="color:#999">可手动添加或选择单图文</div>
        <div v-else v-for="(mor, i) in MoreGraphicMatter" :key="i" class="matebox">
          <div class="matename">{{ mor.name }}</div>
          <div class="matebtn">
            <label>排序：</label>
            <el-input-number size="mini" v-model="mor.sortNum"  @change="getnumber"></el-input-number>
            <el-button
            style="margin-left:20px;"
              type="text"
              @click="EditMater(mor, i)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="MoreGraphicMatter.splice(i, 1)"
            >删除</el-button>
          </div>
          <!-- <img style='width:50px;height:50px;' :src="mor.img"/> -->
        </div>
        <el-button v-if="radio==0" size="small" @click="radio='2'" plain icon="el-icon-plus">继续添加</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom:20px;" v-if="radio!=0">
      <el-radio-group
        v-model="radio"
        @change="checkRadio"
        style="margin-right:20px;"
      >
        <el-radio
          v-if="idedit && radio == 2"
          disabled
          v-model="radio"
          label="2"
        >选择单图文</el-radio>
        <el-radio
          v-else
          v-model="radio"
          label="2"
        >选择单图文</el-radio>
        <el-radio
          v-if="idedit && radio == 1"
          disabled
          v-model="radio"
          label="1"
        >手动添加</el-radio>
        <el-radio
          v-else
          v-model="radio"
          label="1"
        >手动添加</el-radio>
      </el-radio-group>
    </div>
    <div v-if="radio==1" style="border:1px solid #ddd;padding:15px">
      <singleDetail :editrow="editrow" :opentype="`lot`" @showEditContent="showEditContent" @numerClose="numerClose"></singleDetail>
    </div>
    <div v-if="radio==2" style="border:1px solid #ddd;padding:15px">
      <el-button type="primary" @click="chooseModel()">请选择单图文</el-button>
    </div>


    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close(false)">取 消</el-button>
      <el-button
        type="primary"
        @click="success()"
        :loading="loading"
      >确 定</el-button>
    </span>
    <el-dialog
      :title="showtextmodel"
      :visible="showmodel"
      width="800px"
      top="10vh"
      :close-on-click-modal="false"
      append-to-body
      @close="closeDialog"
    >
      <el-table
        v-if="radio == 2"
        :data="singleList"
        stripe
        style="width: 100%"
        ref="multipleTable">
        <el-table-column prop="imageUrl" label="封面" align="center">
          <template slot-scope="scope">
            <img width="50px" height="50px" :src="imageurl + scope.row.imageUrl"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="标题"
          width="180"
          align="center"
        > </el-table-column>
        <el-table-column label="类型"  align="center">
          <template slot-scope="scope">
            <div>{{scope.row.mark=='link'?'链接':'图文'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="简介"
          align="center"
        >
         <template slot-scope="scope">
            <div style="display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{{scope.row.content}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="redactText(scope.row)"
            >确定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="common-pagination">
        <com-pagination
          :page="page"
          @sizeChange="onSizeChange"
          @pageChange="onPageChange"
        ></com-pagination>
      </div>
    </el-dialog>
    <!-- 选择关键词 -->
    <el-dialog
      :title="`选择关键字搜索`"
      :visible="keywordModel"
      width="550px"
      top="10vh"
      :close-on-click-modal="false"
      append-to-body
      @close="closekeyDialog"
    >
      <div style="display:flex;flex-flow:wrap">
        <div
          class="add-btn"
          @click="addWordModel = true"
        >添加</div>
        <div
          v-for="(item, index) in keyslist"
          :key="index"
          :class="checkKeyWordActive(item) ? 'keys activekey' : 'keys'"
          @click="onKeyWordSelect(item)"
        >
          {{ item.name }}
          <i class="el-icon-circle-close keydelete" @click.stop="keywordDelete(item.id,$event)"></i>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closekeyDialog">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="keywordModel = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增关键词 -->
    <el-dialog
      :title="`新增关键词`"
      :visible="addWordModel"
      width="550px"
      top="20vh"
      :close-on-click-modal="false"
      append-to-body
      @close="closewordDialog"
    >
      <div style="display:flex;justify-content:center;">
        <div
          class="left-input"
          style="line-height:30px;"
        >关键词</div>
        <el-input
          v-model="words"
          style="width:400px;margin-left:10px;"
          type="text"
          placeholder="最多6个字"
          maxlength="6"
          show-word-limit
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closewordDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAdd"
          :loading="loading"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择客户行为标签 -->
    <com-dialog :config="behaviorDialog.config" @closeDialog="behaviorDialog.config.visible = false">
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
  </el-dialog>
</template>

<script>
import Template from '@/modules/flywheel/views/third-party/template/Template.vue'
import Editor from '../../../../../components/common/Editor'
import ComPagination from '../../../components/common/ComPagination'
import ComDialog from '../../../components/common/ComDialog'
import singleDetail from './singlecategoryDetail'
import { sort } from 'pinyin/data/dict-zi'
export default {
  components: { ComPagination,singleDetail,ComDialog },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    },
    tagId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      configedit: { initialFrameWidth: 450, initialFrameHeight: 300 },
      imageurl: 'http://athena-1255600302.cosgz.myqcloud.com',
      showmodel: false,
      showtextmodel: '',
      radio: '1',
      model: {
        name: '',
        groupId: '',
        searchWordId: '',
        type: 'numerous_image_text',
        materialQuoteList: [],
        isRadar:true,
        radarRequest: {
          isBehaviorNotice: false,
          isActionNotice:true,
          isBehaviorTag: false,
          radarTagList: [
            // {id: "",businessScore: ""}
          ]
        },
      },
      data: [],
      linktree: [],
      singtree: [],
      loading: false,
      singleList: [],
      page: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      MoreGraphicMatter: [],
      idedit: false,
      keywordModel: false,
      keyslist: [],
      addWordModel: false,
      words: '',
      selectedKeyWordIds: [],
      selectedKeyWords: [],
      editrow:{},
      editIndex:'',
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择标签',
          visible: false
        }
      },
      behaviorGroupItemTags: [], // 行为标签分组的标签列表
      selectedBehaviorTags: [], // 存储选中的行为标签列表
    }
  },

  watch: {
    visible(val) {
      this.radio = '2'
      this.selectedBehaviorTags=[]
      this.MoreGraphicMatter = []
      this.editrow={}
      this.selectedKeyWordIds = []
      this.selectedKeyWords = []
      this.model.groupId = this.tagId
      this.getDepartmentTreeData()
      if (val) {
        if (this.id) {
          this.radio = '0'
          this.getCarousel()
        }
      }
    }
  },

  methods: {
    getnumber(){
      this.$forceUpdate()
    },
    // 数组去重
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    // 获取添加或修改单图文后的数据
    showEditContent(num){
      this.editrow={}
      this.$nextTick(()=>{
        this.radio='0'
        // num[0].sortNum=num[1]
        var list={}
        list.quoteType='image_text'
        list.img=num.imageUrl
        list.mark=num.mark
        list.sortNum=num.sortNum
        list.id=num.id
        list.name=num.name
        if(typeof this.editIndex =='number'){
          this.MoreGraphicMatter[this.editIndex]=list
          this.editIndex=''
        }else{
          this.MoreGraphicMatter.push(list)
        }
        console.log(this.MoreGraphicMatter)
        // this.MoreGraphicMatter = this.MoreGraphicMatter.sort(this.compare('sortNum', false))
      })
    },
    // 详情
    getCarousel() {
      this.MoreGraphicMatter=[]
      this.$http.materialDetail({ id: this.id }).then(res => {
        // this.model = res.data.data
        if(res.data.data.isRadar){
          this.getRadarDetail(res.data.data)
        }else{
          this.model=res.data.data
          this.model.radarRequest={
            isBehaviorNotice:false,
            isActionNotice:true,
            isBehaviorTag: false,
            radarTagList: []
          }
        }
        res.data.data.materialQuoteList.forEach(item => {
          let list = {}
          if (item.quoteType == 'image_text') {
            list = {
              name: item.quoteMaterial.name,
              id: item.quoteMaterial.id,
              img: item.quoteMaterial.imageUrl,
              quoteType: item.quoteType,
              sortNum: item.sortNum,
              mark:item.quoteMaterial.mark
            }
          } 
          this.MoreGraphicMatter.push(list)
        })
        if (res.data.data.searchWordList.length>0) {
          res.data.data.searchWordList.forEach(item => {
            this.selectedKeyWordIds.push(item.id)
            this.selectedKeyWords.push(item.name)
          })
        }
      })
    },
    //获取雷达数据
    getRadarDetail(model){
      this.$http.getInteractRadarDetail({id:model.radarId}).then(rep=>{
        model.radarRequest={
          isBehaviorNotice: rep.data.data.isBehaviorNotice,
          isActionNotice:rep.data.data.isActionNotice,
          isBehaviorTag: rep.data.data.isBehaviorTag,
          radarTagList: []
        }
        this.model=model
        this.selectedBehaviorTags=rep.data.data.behaviorTagList?rep.data.data.behaviorTagList:[]
      })
    },
        // 获取行为标签
    getBehavoirTag(){
      this.$http.getBehaviorPages().then(res=>{
        this.behaviorGroupItemTags=res.data.data
        this.behaviorGroupItemTags.forEach(item=>{
          item.tagList.forEach(val=>{
            val.businessScore=1
          })
        })
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
      this.$nextTick(()=>{
        if (this.selectedBehaviorTags.some(item => item.id === obj.id)) {
          this.selectedBehaviorTags.splice(
            this.selectedBehaviorTags.findIndex(item => item.id === obj.id),
            1
          )
        } else {
          this.selectedBehaviorTags.push(obj)
        }
      })
    },
    // 删除行为标签
    cancelSelectBehaviorTag(obj) {
      this.selectedBehaviorTags.splice(
        this.selectedBehaviorTags.findIndex(item => item.id === obj.id),
        1
      )
    },
    //关闭选择标签按钮
    behaviorConfirm() {
      this.behaviorDialog.config.visible = false
    },
    // 获取多图文分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type: 'numerous_image_text' }).then(res => {
        this.data = res.data.data
        this.data.forEach(item => {
          if (!item.childs) {
            item.childs = null
          }
        })
      })
    },
    // 获取多图文分类id
    changeCascader(e) {
      if (e.length == 1) {
        this.model.groupId = e[0]
      }
      if (e.length == 2) {
        this.model.groupId = e[1]
      }
    },

    // 切换radio
    checkRadio(e) {
      this.editrow={}
      // if(e==1){
      //   this.radio=1
      // }
      // e == 1 ? this.getlinkClass() : this.getgraphic()
    },
    // 点击选择单链接或单图文按钮
    chooseModel() {
      this.showmodel = true
      this.showtextmodel = '选择单图文'
      this.singraphic()
    },
    // 编辑已选中的素材
    EditMater(row, i) {
      if(this.editrow.id){
        this.$message.warning('请先完成当前编辑的内容')
        return
      }
      this.editIndex=i
      this.radio=1
      this.editrow=row
      // this.MoreGraphicMatter.splice(i, 1)
      console.log(this.editrow)
    },
    

    // 获取单图文列表-----------------------------------------------------单图文start
    singraphic() {
      this.$http.matePosterList({ pageNum: this.page.pageNum, pageSize: 20, type:'image_text'}).then(res => {
        this.singleList = []
        this.singleList = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
   
    // ---------------------------------------------单链接end---------

    // 确定选择单图文内容
    redactText(row) {
      this.showmodel = false
      this.showtextmodel = ''
      if(this.radio=='2') {
        this.radio=0
        row.sortNum=1
        row.quoteType='image_text'
        this.MoreGraphicMatter.push(row)
        // this.editrow=row
      }
    },
    // 排序
    compare(property, desc) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (desc == true) {
          // 升序排列
          return value1 - value2
        } else {
          // 降序排列
          return value2 - value1
        }
      }
    },
    success() {
      if (this.model.name == '') {
        this.$message.error('请填写标题')
        return
      }
      if (this.model.groupId == '') {
        this.$message.error('请选择分类')
        return
      }
      if (this.model.imageUrl == '') {
        this.$message.error('请上传封面')
        return
      }

      if (this.radio == '1' || this.radio == '2') {
        this.$message.warning('请先保存素材')
        return
      }
      if (this.MoreGraphicMatter.length == 0) {
        this.$message.error('请添加素材')
        return
      }

      this.model.materialQuoteList = []
      this.MoreGraphicMatter.forEach(item => {
        var list = {}
        list.quoteType = item.quoteType
        list.quoteId = item.id
        list.sortNum = item.sortNum
        this.model.materialQuoteList.push(list)
      })
      if (this.selectedKeyWordIds.length > 0) {
        this.model.searchWordId = this.selectedKeyWordIds.join('_')
      } else {
        this.model.searchWordId = ''
      }
      if(this.model.radarRequest.isBehaviorTag){
        if(this.selectedBehaviorTags.length == 0){
          this.$message.error('请选择客户标签')
          return
        }else{
          this.model.radarRequest.radarTagList=[]
            this.selectedBehaviorTags.forEach(item=>{
            var list = {id:item.id,businessScore:item.businessScore}
            this.model.radarRequest.radarTagList.push(list)
          })
        }
      }else{
        this.model.radarRequest.radarTagList=[]
      }
      // this.model.radarRequest.radarTagList=[]
      // if(this.selectedBehaviorTags.length>0){
      //   this.selectedBehaviorTags.forEach(item=>{
      //     var list = {id:item.id,businessScore:item.businessScore}
      //     this.model.radarRequest.radarTagList.push(list)
      //   })
      // }
      this.model.radarTitle=this.model.name
      // this.$refs.model.validate(valid => {
      //   if (valid) {
      let model = JSON.parse(JSON.stringify(this.model))
      this.loading = true
      this.saveModel(this.id ? 'materialUpdate' : 'materialAdd', model)
      //   }
      // })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then(() => {
          this.loading = false
          this.$message({
            message: type === 'materialUpdate' ? '修改成功' : '添加成功',
            type: 'success'
          })
          this.MoreGraphicMatter=[]
          this.editrow={}
          this.close(true)
        })
        .catch(() => {
          this.MoreGraphicMatter=[]
          this.editrow={}
          this.loading = false
        })
    },
    // 获取关键字列表
    getKeySear() {
      this.$http.searchKeyWord().then(res => {
        this.keyslist = res.data.data.list
        this.keyslist.forEach(item => {
          item.checked = false
        })
      })
    },
    // 确定新增关键字
    confirmAdd() {
      this.$http.AddKeyWordsearch({ name: this.words, sequence: '' }).then(res => {
        this.closewordDialog()
        this.getKeySear()
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
    // 选中关键字
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
    keywordDelete(id,event){
      // var classarry=event.path[0].parentElement.getAttributeNode('class')
      var classarry=event.path[0].parentElement.className
      if(classarry=='keys activekey'){
        this.$message.warning('请取消选中后再删除')
        return
      }
       this.$confirm(`确定删除关键字吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteKyword({ id }).then((res) => {
          this.$message.success('删除成功')
          this.$nextTick(()=>{
            this.getKeySear()
          })
        })
      })
    },
    closekeyDialog() {
      this.keywordModel = false
    },
    closewordDialog() {
      this.addWordModel = false
      this.words = ''
    },
    close(flag) {
      this.MoreGraphicMatter=[]
      this.editrow={}
      this.radio=0
      this.linkmodel = {}
      this.graphicmodel = {}
      this.model = this.$options.data().model
      // this.$nextTick(() => {
      //   this.$refs.model.clearValidate()
      // })
      this.$emit('closeNumerous', flag)
    },
    numerClose(e){
      this.radio=e
      this.editrow={}
    },
    // 关闭弹窗
    closeDialog() {
      this.showmodel = false
      this.showtextmodel = ''
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.singraphic()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.singraphic()
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function () {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function () {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach(el => {
          el.onclick = function () {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    }
  }
}
</script>
