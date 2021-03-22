<template>
  <div style="height: 100%">
    <go-back title="单图文" v-if="opentype!='lot'"></go-back>
    <div class="main-content">
      <div style="margin:10px 20px 20px 20px;">
        <el-radio-group v-if="!id" v-model="radio" @change="checkRadio" style="margin-right:20px;">
          <el-radio v-model="radio" label="1">自定义图文</el-radio>
          <el-radio v-model="radio" label="2">外部链接</el-radio>
        </el-radio-group>
        <el-radio-group v-else v-model="radio" @change="checkRadio" style="margin-right:20px;">
          <el-radio v-model="radio" v-if="radio==2" disabled label="1">自定义图文</el-radio>
          <el-radio v-model="radio" v-if="radio==1" label="1">自定义图文</el-radio>
          <el-radio v-model="radio" v-if="radio==1" disabled label="2">外部链接</el-radio>
          <el-radio v-model="radio" v-if="radio==2" label="2">外部链接</el-radio>
        </el-radio-group>
      </div>
      <el-form v-if="radio==1" :model="model" ref="model" label-width="90px" label-position="right">
        <el-form-item label="名称" prop="singleContent.title" :rules="rules">
          <el-input v-model="model.singleContent.title" @input="getnumber" maxlength="64" placeholder="名称最长为64个字符" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="素材分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-cascader
            :options="singledata"
            :props="{ value: 'id', label: 'name', children: 'childs' }"
            :show-all-levels="true"
            v-model="model.groupId"
            style="width: 400px"
            @change="changeSingleCascader"
            ref="elcascader"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="图文分类" prop="singleContent.categoryId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-cascader
            :options="data"
            :props="{ value: 'id', label: 'name', children: 'childs' }"
            :show-all-levels="true"
            v-model="model.singleContent.categoryId"
            style="width: 400px"
            @change="changeCascader"
            ref="elcascader"
            @visible-change="elCascaderOnlick"
            @expand-change="elCascaderOnlick"
            clearable
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="封面" prop="singleContent.iconUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
          <QcImageUpload v-model="model.singleContent.iconUrl" width="100px" height="100px"></QcImageUpload>
          <div style="display:inline-block;color:#999;">建议尺寸220*220</div>
        </el-form-item>
        <el-form-item label="简介" prop="singleContent.info">
          <el-input style="width: 400px" type="textarea" v-model="model.singleContent.info" @input="getnumber"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="singleContent.content" :rules="[{ required: true, message: '该字段不能为空' }]">
          <Editor v-model="model.singleContent.content"></Editor>
        </el-form-item>
        <el-form-item label="关键字">
          <key-word :selectedKeyWords="selectedKeyWords" :selectedKeyWordIds="selectedKeyWordIds" @getkeywordlist="getkeywordlist(arguments)"></key-word>
        </el-form-item>
        <!-- <el-form-item v-if="opentype=='lot'" label="排序">
          <el-input-number :min="0" type="number" @change="getnumber()" v-model="singleSort"></el-input-number>
        </el-form-item> -->
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
              <el-button size="mini" icon="el-icon-plus" class="tags-btn" @click="behaviorDialog.config.visible = true,getBehavoirTag()"
                >选择标签</el-button
              >
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
        <!-- <el-form-item label="评论留言">
          <el-switch v-model="model.singleContent.isEnableComment" inactive-text="是否支持留言评论"></el-switch>
          <div v-if="model.singleContent.isEnableComment">
            <el-checkbox v-model="model.singleContent.isEnableCommentAudit">审核后才显示在页面</el-checkbox>
          </div>
        </el-form-item> -->
      </el-form>
      <el-form v-if="radio==2" :model="model" ref="model" label-width="90px" label-position="right">
        <el-form-item label="名称" prop="name" :rules="rules">
          <el-input v-model="model.name" maxlength="64" placeholder="链接最长为64个字符" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-input v-model="model.link" placeholder="链接最长为256个字符" style="width: 400px"></el-input>
          <!-- <el-button type="primary" size="small" @click="imgDes=true">去选择</el-button> -->
        </el-form-item>
        <el-form-item label="素材分类" prop="groupId" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-cascader
            :options="singledata"
            :props="{ value: 'id', label: 'name', children: 'childs' }"
            :show-all-levels="true"
            v-model="model.groupId"
            style="width: 400px"
            @change="changeSingleCascader"
            ref="elcascader"
            @visible-change="elCascaderOnlick"
            @expand-change="elCascaderOnlick"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="封面" prop="imageUrl" :rules="[{ required: true, message: '该字段不能为空' }]">
          <QcImageUpload v-model="model.imageUrl" width="100px" height="100px"></QcImageUpload>
        </el-form-item>
        <el-form-item label="简介" prop="content">
          <el-input style="width: 400px" type="textarea" v-model="model.content"></el-input>
        </el-form-item>
        <el-form-item label="关键字">
          <key-word :selectedKeyWords="selectedKeyWords" :selectedKeyWordIds="selectedKeyWordIds" @getkeywordlist="getkeywordlist(arguments)"></key-word>
        </el-form-item>
        <!-- <el-form-item v-if="opentype=='lot'" label="排序">
          <el-input-number :min="0" type="number" @change="getnumber()" v-model="singleSort"></el-input-number>
        </el-form-item> -->
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
                <el-button size="mini" icon="el-icon-plus" class="tags-btn" @click="behaviorDialog.config.visible = true,getBehavoirTag()"
                  >选择标签</el-button
                >
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close(false)">取 消</el-button>
        <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
      </div>
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
          <div class="add-btn" @click="addWordModel = true">添加</div>
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="closekeyDialog">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="keywordModel = false">确 定</el-button>
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
          <div class="left-input" style="line-height:30px;">关键词</div>
          <el-input
            v-model="words"
            style="width:400px;margin-left:10px;"
            type="text"
            placeholder="最多6个字"
            maxlength="6"
            show-word-limit
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closewordDialog">取 消</el-button>
          <el-button type="primary" @click="confirmAdd" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 图文列表 -->
      <el-dialog
        :title="`图文列表`"
        :visible="imgDes"
        width="850px"
        top="10vh"
        :close-on-click-modal="false"
        append-to-body
        @close="imgDes=false"
      >
        <singledemo :opentype="`single`"></singledemo>
        <span slot="footer" class="dialog-footer">
          <el-button @click="imgDes=false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd" :loading="loading">确 定</el-button>
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
    </div>
  </div>
</template>

<script>
import GoBack from '../../../components/components/GoBack.vue'
import Editor from '../../../../../components/common/Editor'
import singledemo from '@/modules/core/views/base/news/list/List.vue'
import keyWord from '../../../components/common/KeyWords'
import ComDialog from '../../../components/common/ComDialog'
import singleContent from '@/modules/school/router/singleContent'
export default {
  components: {
    singledemo,
    keyWord,
    ComDialog,
    GoBack
  },
  props: {
    // visible: Boolean,
    // id: {
    //   type: String,
    //   default: ''
    // },
    // tagId: {
    //   type: String,
    //   default: ''
    // },
    // mark: {
    //   type: String,
    //   default: ''
    // },
    // singlefileId: {
    //   type: String,
    //   default: ''
    // },
    opentype:{
      type:String,
      default:''
    },
    lotradio:{
      type:String,
      default:''
    },
    editrow:{
      type:String,
      default:''
    },
  },
  data() {
    let validateInput = (rule, value, callback) => {
        if (!this.checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符！！"));
        } else {
          callback();
        }
      };
    return {
      // rules: {
       rules: [
          {required: true, message: '该字段不能为空', trigger: 'blur'},
          { validator: validateInput, trigger: 'blur' }
        ],
      // },
      id:'',
      tagId:'',
      mark:'',
      singlefileId:'',
      model: {
        mark:'singleContent',
        type:'image_text',
        groupId:'',
        isRadar:true,
        // 单链接传参---start
        name:'',
        imageUrl:'',
        content:'',
        link:'',
        // 单链接传参---end
        singleContent:{//单图文传参---start
          title: '',
          // categoryId: '',
          content: '',
          iconUrl: '',
          info: '',
          isEnableComment: false, //是否支持留言
          isEnableCommentAudit: false, //是否需要审核
        },
        // 单图文传参--end

        radarRequest: {
          isBehaviorNotice: false,
          isActionNotice:true,
          isBehaviorTag: false,
          radarTagList: [
            // {id: "",businessScore: ""}
          ]
        },
        // readPoint: '',
      },

      data: [],
      loading: false,
      keywordModel: false,
      keyslist: [],
      addWordModel: false,
      words: '',
      selectedKeyWordIds: [],
      selectedKeyWords: [],
      radio:'1',
      imgDes:false,
      behaviorGroupItemTags: [], // 行为标签分组的标签列表
      selectedBehaviorTags: [], // 存储选中的行为标签列表
      behaviorDialog: {
        config: {
          width: '800px',
          title: '选择标签',
          visible: false
        }
      },
      singledata:[],
    }
  },
  mounted(){
    console.log(this.$route.query,this.editrow)
    this.id=this.$route.query.id?this.$route.query.id:this.editrow.id?this.editrow.id:''
    this.tagId=this.$route.query.tagId?this.$route.query.tagId:this.editrow.groupId?this.editrow.groupId:''
    this.mark=this.$route.query.mark?this.$route.query.mark:this.editrow.mark?this.editrow.mark:''
    // this.singlefileId=this.$route.query.singlefileId?this.$route.query.singlefileId:this.editrow.fileId?this.editrow.fileId:''
    this.singleSort=this.editrow.sortNum?this.editrow.sortNum:'1'

    this.model.groupId=this.tagId
  },
  created(){
    this.$nextTick(()=>{
      this.getSingleFodder()
      this.getDepartmentTreeData()
      if (this.id) {
        this.radio=this.mark=='singleContent'?'1':'2'
        this.getCarousel()
      }
    })
  },
  methods: {
    checkSpecialKey(str) {
      let specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/~#￥……&*（）——|{}【】‘']‘'";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    getnumber(){
      this.$forceUpdate()
    },
    // 切换图文或链接
    checkRadio(e){
      this.model.mark=e==1?'singleContent':'link'
      this.model.groupId=""
      this.model.isRadar=true
      // this.model.singleContent.categoryId=""
      this.selectedBehaviorTags=[]
      this.model.radarRequest={
        isBehaviorNotice: false,
        isActionNotice:true,
        isBehaviorTag: false,
        radarTagList: []
      }
    },
    // 获取单图文素材分类
    getSingleFodder() {
      this.$http.getMateTree({ type: 'image_text' }).then(res => {
        this.singledata = res.data.data
        this.singledata.forEach(item => {
          if (!item.childs) {
            item.childs = null
          }
        })
      })
    },
    // 获取单图文素材分类id
    changeSingleCascader(e){
      if (e.length == 1) {
        this.model.groupId = e[0]
      }
      if (e.length == 2) {
        this.model.groupId = e[1]
      }
    },
    // 获取图文分类数据
    getDepartmentTreeData() {
      this.showtext=true
      this.$http.MateroneSingle({ type: 8 }).then((res) => {
        var parentid = res.data.data[0].id
        if (parentid) {
          this.$http.MateroneSingletwo({ type: 8, parentId: parentid }).then((res) => {
            this.data = res.data.data.list
          })
        }
      })
    },
    // 获取图文分类id
    changeCascader(e) {
      if (e.length == 1) {
        this.model.singleContent.categoryId = e[0]
      }
      if (e.length == 2) {
        this.model.singleContent.categoryId = e[1]
      }
    },
    // 详情
    getCarousel() {
      //素材详情
      this.$http.materialDetail({ id: this.id }).then((res) => {
        if(res.data.data.mark=='link'){
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
        }else if(res.data.data.mark=='singleContent'){
          console.log(res.data.data.fileId)
          // 获取图文详情s
          this.$http.MaterSingleDetail({id:res.data.data.fileId}).then(json=>{
            if(res.data.data.isRadar){
              this.getRadarDetail(res.data.data,json.data.data)
            }else{
              this.model=res.data.data
              this.model.singleContent=json.data.data
              this.model.radarRequest={
                isBehaviorNotice:false,
                isActionNotice:true,
                isBehaviorTag: false,
                radarTagList: []
              }
            }
          })
        }
        if (res.data.data.searchWordList.length>0) {
          res.data.data.searchWordList.forEach((item) => {
            this.selectedKeyWordIds.push(item.id)
            this.selectedKeyWords.push(item.name)
          })
        }
      })
    },
    getRadarDetail(model,singleContent){
      //获取雷达数据
      this.$http.getInteractRadarDetail({id:model.radarId}).then(rep=>{
        model.radarRequest={
          isBehaviorNotice: rep.data.data.isBehaviorNotice,
          isActionNotice:rep.data.data.isActionNotice,
          isBehaviorTag: rep.data.data.isBehaviorTag,
          radarTagList: []
        }
        if(singleContent){
          model.singleContent=singleContent
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
    // 获取关键字列表
    getkeywordlist(list) {
      this.keyslist = list[0]
      this.keywordModel = list[1]
    },
    // 获取关键字列表
    getKeySear() {
      this.$http.searchKeyWord().then((res) => {
        this.keyslist = res.data.data.list
        this.keyslist.forEach((item) => {
          item.checked = false
        })
      })
    },
    // 确定新增关键字
    confirmAdd() {
      this.$http.AddKeyWordsearch({ name: this.words, sequence: '' }).then((res) => {
        this.closewordDialog()
        this.getKeySear()
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
    // 选中关键字
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
    //html剔除富文本标签，留下纯文本
    formatGetSimpleText(html){
      var re1 = new RegExp("<.+?>","g");//匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      var msg = html.replace(re1,'');//执行替换成空字符
      return msg;
    },
    success() {
      if(this.model.mark=='singleContent'&&this.model.singleContent.info==''){
        var contenttext=this.formatGetSimpleText(this.model.singleContent.content)
        this.model.singleContent.info=contenttext.slice(0,100)
      }
      // if (this.model.groupId == '') {
      //   this.$message.error('请选择图文分类')
      //   return
      // }
      // if (this.model.content == '') {
      //   this.$message.error('请填写图文介绍')
      //   return
      // }

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
      this.$refs.model.validate((valid) => {
        if (valid) {
          let model = JSON.parse(JSON.stringify(this.model))
          this.loading = true
          this.saveModel(this.id ? 'UpdateSingleGrapic' : 'addSingleGrapic', model)
        } else {
          this.$message.warning('请先完善内容才能确定哦！')
        }
      })
    },
    saveModel(type, model) {
      this.$http[type](model)
        .then((res) => {
          this.loading = false
          this.$message({
            message: type === 'UpdateSingleGrapic' ? '修改成功' : '添加成功',
            type: 'success'
          })
          // this.close(true)
          if(this.opentype!='lot'){
            if (window.history.length > 1) {
              this.$openNewPageBack()
            } else if (sessionStorage.getItem('fromPagePath')) {
              this.$router.replace(sessionStorage.getItem('fromPagePath'))
              sessionStorage.removeItem('fromPagePath')
            }
          }else{
            console.log(this.singleSort)
            res.data.data.sortNum=this.singleSort
            this.$emit('showEditContent',res.data.data)
          }
          this.editrow={}
        })
        .catch(() => {
          this.loading = false
        })
    },
    close(flag) {
      if(this.opentype=='lot'){
        this.editrow={}
        this.$emit('numerClose', '0')
        return
      }
      this.$openNewPageBack()
      // this.model = this.$options.data().model
      this.$nextTick(() => {
        this.$refs.model.clearValidate()
      })
      // this.$emit('closeSingle', flag)
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach((el) => {
          el.onclick = function() {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  background-color: #fff;
  padding: 20px;
  min-height: calc(100% - 96px);
}
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
}
.haveedit {
  margin-right: 10px;
  margin-bottom: 8px;
  padding: 0px 15px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
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
.dialog-footer {
  text-align: center;
}
</style>
