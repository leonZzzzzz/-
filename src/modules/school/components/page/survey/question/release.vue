<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div
        class="item"
        :class="{ active: i + 1 === activeIndex }"
        v-for="(item, i) in tabbar"
        :key="i"
        @click="handleSelect(item.index)"
      >
        {{ item.name }}
      </div>
      <el-button type="primary" size="small" class="export" @click="apiExport">导出结果</el-button>
      <el-button type="primary" size="small" class="back" @click="back">返回</el-button>
    </div>
    <div class="context-box" :style="{ height: `${areaHeight}px` }" ref="context">
      <!-- 问卷内容 -->
      <div v-if="false">
        <!-- 基础设置 -->
        <div class="setting">
          <!-- <p class="title">基础设置</p> -->

          <el-form class="question-list" ref="base" :model="base" label-position="top">
            <draggable v-model="base.model" @update="datadragEnd" :options="dragOptions">
              <!-- <transition-group> -->
              <!-- 选题 -->
              <el-form-item
                class="question-item"
                v-for="(item, index) in base.model"
                :key="index"
                label-position="top"
                size="small"
              >
                <div class="question-item-head">
                  <h3>{{ index + 1 }}</h3>
                  <p>
                    {{
                      item.type == 3
                        ? '问答题'
                        : item.type == 2
                        ? '多选题'
                        : item.type == 1
                        ? '单选题'
                        : ''
                    }}
                  </p>
                  <el-button
                    class="rm-btn btn-round-info drag-btn"
                    icon="el-icon-rank"
                    type="info"
                    size="mini"
                    round
                  ></el-button>
                  <el-button
                    @click="rmQuestion(index)"
                    class="rm-btn btn-round-danger"
                    icon="el-icon-delete"
                    type="danger"
                    size="mini"
                    round
                  ></el-button>
                </div>
                <!-- 题目 -->
                <el-form-item
                  :label="`题目`"
                  :prop="`model[${index}].title`"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                >
                  <el-input
                    size="small"
                    v-model="item.title"
                    style="width:300px;"
                    placeholder="请输入题目"
                  ></el-input>
                  <!-- 添加图片 -->
                  <el-button
                    class="btn-round-info"
                    @click="openImgBox('q', index)"
                    icon="el-icon-picture"
                    type="info"
                    size="mini"
                    round
                  ></el-button>
                </el-form-item>
                <el-form-item v-if="item.picture">
                  <div class="upload-img-box">
                    <img :src="`${imgHost}${item.picture}`" style="width: 120px;" />
                    <i class="el-icon-remove remove " @click="removeImg('q', index)"></i>
                  </div>
                </el-form-item>
                <!-- 类型 -->
                <el-form-item
                  label="类型"
                  :prop="`model[${index}].type`"
                  :rules="[{ required: true, message: '该字段不能为空' }]"
                >
                  <el-select size="small" v-model="item.type">
                    <el-option label="单选" :value="1"></el-option>
                    <el-option label="多选" :value="2"></el-option>
                    <el-option label="问答" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 选项 -->
                <el-form-item v-if="item.type == 3" label="回答" class="answer-list">
                  <div>
                    <el-form-item class="answer-item">
                      <el-input
                        size="small"
                        type="textarea"
                        :rows="2"
                        disabled
                        style="width:300px;"
                        placeholder=""
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item v-else label="选项">
                  <div v-for="(answer, a) in item.optionList" :key="a">
                    <el-form-item
                      class="answer-item"
                      :prop="`model[${index}].optionList[${a}].value`"
                      :rules="[
                        {
                          required: !answer.value && !answer.picture ? true : false,
                          message: '该字段不能为空'
                        }
                      ]"
                    >
                      <el-input
                        size="small"
                        v-model="answer.value"
                        style="width:300px;"
                        :placeholder="`请输入选项${answer.seqNum}`"
                      ></el-input>
                      <!-- 标签 -->
                      <el-button
                        class="btn-round-info tag-btn"
                        @click="openTag(index, a)"
                        type="info"
                        size="mini"
                        round
                        >#</el-button
                      >
                      <!-- 图片 -->
                      <el-button
                        class="btn-round-info"
                        @click="openImgBox('a', index, a)"
                        icon="el-icon-picture"
                        type="info"
                        size="mini"
                        round
                      ></el-button>
                      <!-- 删除 -->
                      <el-button
                        class="btn-round-danger"
                        @click="rmAnswer(index, a)"
                        icon="el-icon-delete"
                        type="danger"
                        size="mini"
                        round
                      ></el-button>
                    </el-form-item>
                    <el-form-item v-if="answer.showTag">
                      <el-select
                        class="btn-tag"
                        size="mini"
                        v-model="answer.tagId"
                        filterable
                        clearable
                        style="width: 200px;"
                        placeholder="标签"
                      >
                        <el-option
                          :label="tag.name"
                          :value="tag.id"
                          v-for="(tag, tagIndex) in tagList"
                          :key="tagIndex"
                        ></el-option>
                      </el-select>
                      <el-button
                        class="btn-round-info"
                        @click="rmTag(index, a)"
                        icon="el-icon-close"
                        type="info"
                        size="mini"
                        round
                      ></el-button>
                    </el-form-item>
                    <el-form-item v-if="answer.picture">
                      <div class="upload-img-box">
                        <img :src="`${imgHost}${answer.picture}`" style="width: 120px;" />
                        <i class="el-icon-remove remove " @click="removeImg('a', index, a)"></i>
                      </div>
                    </el-form-item>
                  </div>
                  <el-form-item>
                    <el-button
                      class="color-white"
                      style="width: 100%;"
                      @click="addAnswer('a', index)"
                      icon="el-icon-plus"
                      type="info"
                      size="mini"
                      plain
                      >添加选项</el-button
                    >
                  </el-form-item>
                </el-form-item>
              </el-form-item>
              <!-- </transition-group> -->
            </draggable>
          </el-form>

          <!-- 操作 -->
          <div class="btn-list">
            <el-button class="btn" type="primary" @click="addQuestion(1)" size="small"
              >添加</el-button
            >
          </div>
        </div>
      </div>
      <!-- 问卷结果 -->
      <div class="result">
        <div class="base-info">
          <h3>问卷基本信息</h3>
          <p>问卷名称：{{ result.title }}</p>
          <p>开始时间：{{ result.startTime }}</p>
          <p>目前参与人数：{{ result.joinNum }}人</p>
        </div>
        <div class="result-list">
          <h3>问卷结果</h3>
          <div
            v-if="item.type == 3"
            class="result-item"
            v-for="item in result.questionList"
            :key="item.id"
          >
            <p>
              <span>{{ item.seqNum }}、{{ item.title }}</span>
              <span style="color: #666; padding: 0 10px;">(默认显示最新5条)</span>
              <span style="color: #fec02d;cursor: pointer;" @click="openDialogTable(item.id)"
                >查看全部>>></span
              >
            </p>
            <p class="option" v-for="answer in item.answerList" :key="answer.id">
              <span style="color: #666;">{{ answer.textAnswer }}</span>
            </p>
          </div>
          <div v-else class="result-item">
            <p>{{ item.seqNum }}、{{ item.title }}</p>
            <p class="option" v-for="(answer, index) in item.optionList" :key="index">
              <el-progress
                class="progress"
                :percentage="result.joinNum ? ((answer.chooseNum || 0) / result.joinNum) * 100 : 0"
                color="#fec02d"
              ></el-progress>
              <span>{{ answer.value }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 全部答案-->
    <el-dialog
      title="回答列表"
      width="70%"
      :visible.sync="dialogTable"
      @close="closeDialogTable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <div ref="search">
            <search-wrap>
               <el-form :inline="true">
                  <el-form-item label="">
                  <el-input size="small" v-model.trim="searchData.title" placeholder="请输入标题"></el-input>
                  </el-form-item>
                  <el-form-item>
                  <el-button type="primary" size="small" @click="search(2)">查询</el-button>
                  </el-form-item>
               </el-form>
            </search-wrap>
         </div>  -->
      <!-- <p class="img-tips">tips：</p> -->
      <qc-table-old
        v-if="dialogTable"
        ref="table"
        style="padding-bottom: 30px;"
        :autoHeight="400"
        selection
        border
        :table-list="showData"
        :search="searchData"
        url="api/admin/v1/question/textAnswerPage"
      ></qc-table-old>
    </el-dialog>
    <div class="bottom-btn" v-if="false">
      <el-button
        type="primary"
        @click="submit()"
        style="margin-left: 30px;"
        size="small"
        :loading="loading"
        >保存</el-button
      >
    </div>
    <image-dialog
      :visible="digImgWrap"
      uploadType="radio"
      imageType="survey"
      @close-imgbox="closeImgbox"
      @get-imgsrc="onGetImgsrc"
    ></image-dialog>
  </div>
</template>

<script>
 /* eslint-disable */
import QcHeader from 'commonSchool/QcHeader'
import { tableMixin } from 'jsSchool/tableMixin'
import editor from 'commonSchool/editor'
import api from 'apiSchool/common'
import ImageDialog from 'commonSchool/ImageDialog'

export default {
  mixins: [tableMixin],
  components: {
    editor,
    ImageDialog,
    QcHeader
  },
  data() {
    return {
      digImgWrap: false,
      dialogTable: false,
      areaHeight: 0,
      tabbar: [
        { index: 1, name: '问卷结果' }
        // { index: 1, name: "问卷内容" },
      ],
      activeIndex: 1,
      base: {
        surveyId: '',
        model: []
      },
      result: {},
      tagList: [],
      searchData: {
        questionId: ''
      },
      showData: [
        { template: 'index' },
        { prop: 'name', label: '会员', width: '200' },
        { prop: 'textAnswer', label: '内容' }
      ],
      imgObj: {
        imgIndex: null,
        imgType: null
      },
      dragOptions: {
        dragClass: 'drag-item',
        handle: '.drag-btn',
        animation: 300
      },
      loading: false,
      dataLoading: false
    }
  },
  computed: {
    getPercentage(val) {
      if (!val) return val
      console.log(val / this.result.joinNum)
      return val / this.result.joinNum
    }
  },
  created() {
    // this.getTagList();
    if (this.$route.query.id) {
      this.dataLoading = true
      // this.detail(this.$route.query.id);
      this.surveyResult(this.$route.query.id)
    }
    // this.activeIndex = Number(this.$route.query.active) || 1;
  },
  mounted() {
    this.getHeights()
    window.onresize = () => {
      this.getHeights()
    }
    // try {
    //    //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    //    document.body.ondrop = function (event) {
    //       event.preventDefault();
    //       event.stopPropagation();
    //    }
    // } catch (error) {}
  },
  methods: {
    // 设置高度
    getHeights() {
      this.areaHeight = window.innerHeight - 120 - 50
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false
      this.activeIndex = index
      this.$refs.context.scrollTop = 0
    },
    back() {
      this.$router.go(-1)
    },
    detail(id) {
      api.getSurveyQuestion({ surveyId: id }).then(res => {
        let data = res.data.data
        this.base.model = data
        this.dataLoading = false
      })
    },

    surveyResult(id) {
      api.surveyResult({ id: id }).then(res => {
        this.result = res.data.data
        this.dataLoading = false
      })
    },

    getTagList() {
      let data = {
        pageNum: 1,
        pageSize: 2000
      }
      api.listTag(data).then(res => {
        this.tagList = res.data.data.list
      })
    },

    // 拖拽
    datadragEnd(evt) {
      evt.preventDefault()
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      this.base.model[evt.oldIndex].seqNum = evt.oldIndex + 1
      this.base.model[evt.newIndex].seqNum = evt.newIndex + 1
    },

    comfrim(callback) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          callback && callback()
        })
        .catch(() => {
          return
        })
    },

    // 添加题目
    addQuestion(type, q) {
      let item = {
        seqNum: this.base.model.length + 1,
        type: type,
        title: '',
        picture: '',
        optionList: [
          {
            seqNum: 1,
            value: '',
            picture: '',
            tagId: ''
          }
        ]
      }
      this.base.model.push(item)
    },

    // 添加答案选项
    addAnswer(type, q, a) {
      if (!this.base.model[q].optionList) {
        this.$set(this.base.model[q], 'optionList', [])
      }
      let item = {
        seqNum: this.base.model[q].optionList.length + 1,
        value: '',
        picture: ''
      }
      this.base.model[q].optionList.push(item)
    },

    // 显示标签
    openTag(q, a) {
      this.$set(this.base.model[q].optionList[a], 'showTag', true)
    },

    // 删除题目
    rmQuestion(q) {
      this.base.model.splice(q, 1)
    },

    // 删除答案选项
    rmAnswer(q, a) {
      this.base.model[q].optionList.splice(a, 1)
    },

    // 删除标签
    rmTag(q, a) {
      this.base.model[q].optionList[a].tagId = ''
      this.base.model[q].optionList[a].showTag = false
    },

    // 删除图片
    removeImg(type, q, a) {
      if (type === 'q') {
        this.base.model[q].picture = ''
      } else if (type === 'a') {
        this.base.model[q].optionList[a].picture = ''
      }
    },

    // 打开图片对话框
    openImgBox(type, q, a) {
      this.uploadType = type
      this.digImgWrap = true
      this.imgObj.imgType = type
      this.imgObj.q = q
      this.imgObj.a = a
    },
    // 关闭图片对话框
    closeImgbox() {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc(val) {
      let imgObj = this.imgObj
      if (imgObj.imgType === 'q') {
        this.base.model[imgObj.q].picture = val
      } else if (imgObj.imgType === 'a') {
        this.base.model[imgObj.q].optionList[imgObj.a].picture = val
      }
    },
    check() {
      let state = false
      this.$refs.base.validate(valid => {
        state = valid
      })
      if (!state) {
        this.$message.error('请将基础设置信息填写完整！')
        return false
      }
      return state
    },
    submit() {
      if (!this.check()) return false
      try {
        let item = {
          seqNum: 1,
          value: '',
          picture: '',
          tagId: ''
        }
        this.base.model.map((item, index) => {
          if (item.type == 3) {
            this.base.model[index].optionList = []
          }
        })
      } catch (error) {
        //
      }

      let base = {
        questionList: this.base.model,
        surveyId: this.$route.query.id
      }

      this.loading = true
      this.update(JSON.stringify(base))
    },
    update(model) {
      api
        .updateSurveyQuestion(model)
        .then(res => {
          this.loading = false
          console.log(res)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    openDialogTable(id) {
      this.dialogTable = true
      this.searchData.questionId = id
    },
    closeDialogTable(flag) {
      this.dialogTable = false
      if (flag == 1) {
        // this.searchData.questionId = ''
      }
    },

    // 导出
    apiExport() {
      location.href = `${this.localhost}/api/admin/v1/survey/export?id=${this.$route.query.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-item {
  border-color: #fec02d !important;
}
.color-white {
  color: #909399 !important;
  background: #f4f4f5 !important;
  &:hover {
    color: #fff !important;
    background: #909399 !important;
  }
}
.btn-round-info {
  position: relative;
  color: #909399 !important;
  background: #f4f4f5 !important;
  border-color: #dcdfe6;
  margin-left: 20px;
  &:hover {
    color: #fff !important;
    background: #909399 !important;
  }
  &:hover::before {
    display: none;
    content: '添加图片';
    position: absolute;
    top: -32px;
    left: 0;
    // width: 0;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    color: #909399;
  }
}

.btn-round-danger {
  position: relative;
  color: #fff !important;
  margin-left: 20px;
  &:hover::before {
    display: none;
    content: '删除';
    position: absolute;
    top: -32px;
    left: 0;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    color: #f56c6c;
  }
}

.tabbar {
  position: relative;
  display: flex;
  border-bottom: 1px solid #e7eaec;
  .back {
    position: absolute;
    right: 10px;
    top: 12px;
  }
  .export {
    position: absolute;
    right: 100px;
    top: 12px;
  }
  .item {
    padding: 20px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    background-color: #fec02d;
    color: #000;
    // background-color: #f4f4f5;
    // color: #909399;
  }
}
.context-box {
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  .setting {
    width: 80%;
    margin: 0 auto;
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      color: #000;
      position: relative;
      &:before {
        position: absolute;
        content: '';
        border-left: 3px solid #909399;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
    .btn-list {
      display: flex;
      align-items: center;
      margin: 20px 0;
      .btn {
        margin-right: 20px;
      }
    }
    .question-list {
      // color: #909399;
      overflow: hidden;
      .el-form-item {
        margin-bottom: 20px;
      }
      .question-item {
        position: relative;
        padding: 20px 20px 0;
        margin-top: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0px 5px 10px 0px #dcdfe6;
        .question-item-head {
          position: relative;
          display: flex;
          align-items: center;
          height: 40px;
          line-height: 40px;
          h3 {
            margin-right: 20px;
          }
          p {
            flex: 1;
            font-size: 1.1em;
          }
        }
        .rm-btn {
        }
      }
    }
  }
  .result {
    .base-info {
      p {
        margin-top: 20px;
      }
    }
    .result-list {
      margin-top: 25px;
      .result-item {
        p {
          margin-top: 25px;
        }
        .option {
          margin-left: 10px;
        }
        .progress {
          display: inline-block;
          width: 200px;
        }
      }
    }
  }
}

.inline {
  display: inline-block;
  margin-bottom: 0;
}
.right {
  margin-right: 30px;
}
.right-30 {
  margin-right: 30px;
}
.zi {
  padding: 10px;
  border: 1px solid #e7eaec;
  margin-top: 20px;
  position: relative;
  .del {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  // border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: #fec02d;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .remove {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #f56c6c;
    font-size: 24px;
  }
}
.act-table {
  border: 1px solid #dfe6ec;
  position: relative;
  .add {
    position: absolute;
    top: -35px;
    right: 0;
  }
  tr {
    &:first-child {
      background: #eef1f6;
    }
    th,
    td {
      padding: 7px 10px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.desc {
  color: #7b7b7b;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
