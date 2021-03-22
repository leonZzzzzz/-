<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div
        class="item"
        :class="{'active': i + 1 === activeIndex}"
        v-for="(item, i) in tabbar"
        :key="i"
        @click="handleSelect(item.index)"
      >{{item.name}}</div>
      <el-button type="primary" size="small" class="back" @click="back">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <!-- 基础设置 -->
        <div class="setting">
          <p class="title">基础设置</p>
          <el-form :model="model" ref="model" label-position="top" size="small">
            <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input
                size="small"
                v-model="model.title"
                style="width:400px;"
                maxlength="32"
                placeholder="请输入内容（不超过32字）"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item
                class="inline right"
                style="width:220px; margin-top: -20px;"
                label="是否显示标题"
                prop="showTitle"
                :rules="[{ required: true, message: '该字段不能为空'}]"
              >
                <el-switch v-model="model.showTitle" active-text="显示" inactive-text="不显示"></el-switch>
              </el-form-item>
              <el-form-item
                class="inline right"
                label="颜色主题"
                prop="color"
                :rules="[{ required: true, message: '该字段不能为空'}]"
              >
                <el-color-picker v-model="model.color"></el-color-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-form-item
                label="开始时间"
                class="inline right"
                prop="startTime"
                :rules="[{ required: true, message: '该字段不能为空'}]"
              >
                <el-date-picker
                  type="datetime"
                  size="small"
                  placeholder="选择日期"
                  v-model="model.startTime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  style="width: 180px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="结束时间"
                class="inline right"
                prop="endTime"
                :rules="[{ required: true, message: '该字段不能为空'}]"
              >
                <el-date-picker
                  type="datetime"
                  size="small"
                  placeholder="选择日期"
                  v-model="model.endTime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  style="width: 180px;"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item
              label="封面图"
              prop="picture"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <div class="upload-img-box" @click="openImgBox('radio')">
                <img v-if="model.picture" :src="`${imgHost}${model.picture}`" style="width: 120px;" />
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
            <el-form-item
              label="简介"
              prop="content"
              :rules="[{ required: true, message: '该字段不能为空'}]"
            >
              <editor :content="model.content" @get-content="getContent" ref="editor"></editor>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeIndex === 2" class="setting">
        <p class="title">基础设置</p>
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
                  <h3>{{index+1}}</h3>
                  <p>{{item.type == 3?'问答题':item.type == 2?'多选题':item.type == 1?'单选题':''}}</p>
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
                  :rules="[{ required: true, message: '该字段不能为空'}]"
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
                    <i class="el-icon-remove remove" @click="removeImg('q', index)"></i>
                  </div>
                </el-form-item>
                <!-- 类型 -->
                <el-form-item
                  label="类型"
                  :prop="`model[${index}].type`"
                  :rules="[{ required: true, message: '该字段不能为空'}]"
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
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item v-else label="选项">
                  <div v-for="(answer, a) in item.optionList" :key="a">
                    <el-form-item
                      class="answer-item"
                      :prop="`model[${index}].optionList[${a}].value`"
                      :rules="[{ required: !answer.value && !answer.picture ? true : false, message: '该字段不能为空'}]"
                    >
                      <el-input
                        size="small"
                        v-model="answer.value"
                        style="width:300px;"
                        :placeholder="`请输入选项${answer.seqNum}`"
                      ></el-input>
                      <!-- 标签 -->
                      <!-- <el-button class="btn-round-info tag-btn" @click="openTag(index, a)" type="info" size="mini" round>#</el-button> -->
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
                    <!-- <el-form-item v-if="answer.showTag" >
                           <el-select class="btn-tag" size="mini" v-model="answer.tagId" filterable clearable style="width: 200px;" placeholder="标签">
                              <el-option :label="tag.name" :value="tag.id" v-for="(tag, tagIndex) in tagList" :key="tagIndex"></el-option>
                           </el-select>
                           <el-button class="btn-round-info" @click="rmTag(index, a)" icon="el-icon-close" type="info" size="mini" round></el-button>
                    </el-form-item>-->
                    <el-form-item v-if="answer.picture">
                      <div class="upload-img-box">
                        <img :src="`${imgHost}${answer.picture}`" style="width: 120px;" />
                        <i class="el-icon-remove remove" @click="removeImg('a', index, a)"></i>
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
                    >添加选项</el-button>
                  </el-form-item>
                </el-form-item>
              </el-form-item>
            <!-- </transition-group> -->
          </draggable>
        </el-form>

        <!-- 操作 -->
        <div class="btn-list">
          <el-button class="btn" type="primary" @click="addQuestion(1)" size="small">添加</el-button>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button
        type="primary"
        @click="submit()"
        style="margin-left: 30px;"
        size="small"
        :loading="loading"
      >保存</el-button>
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
import QcHeader from "commonSchool/QcHeader";
import { tableMixin } from "jsSchool/tableMixin";
import editor from "commonSchool/editor";
import api from "apiSchool/common";
import ImageDialog from "commonSchool/ImageDialog";

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
      uploadType: "radio",
      areaHeight: 0,
      tabbar: [{ index: 1, name: "问卷设置" }, { index: 2, name: "编辑题目" }],
      activeIndex: 1,
      updateId: "",
      model: {
        title: "",
        content: "",
        color: "#5062ed",
        showTitle: true,
        startTime: "",
        endTime: ""
      },
      base: {
        surveyId: "",
        model: []
      },
      tagList: [],
      searchData: {
        questionId: ""
      },
      imgObj: {
        imgIndex: null,
        imgType: null
      },
      dragOptions: {
        dragClass: "drag-item",
        handle: ".drag-btn",
        animation: 300
      },
      loading: false,
      dataLoading: false
    };
  },
  created() {
    //  this.getTagList();
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.updateId = this.$route.query.id;
      this.detail(this.$route.query.id);
      this.detailQ(this.$route.query.id);
    }
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
    try {
      //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
    } catch (error) {}
  },
  methods: {
    // 设置高度
    getHeights() {
      this.areaHeight = window.innerHeight - 120 - 165;
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false;
      if (index == 2 && !this.updateId) {
        this.$message.warning("请先保存问卷");
        return;
      }
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    back() {
      this.$router.go(-1);
    },
    detail(id) {
      api.getSurvey({ id: id }).then(res => {
        console.log(res);
        let data = res.data.data;
        this.model = data;
        this.dataLoading = false;
      });
    },
    detailQ(id) {
      api.getSurveyQuestion({ surveyId: id }).then(res => {
        let data = res.data.data;
        this.base.model = data;
        this.dataLoading = false;
      });
    },
    getContent(content) {
      this.model.content = content;
    },
    getTagList() {
      let data = {
        pageNum: 1,
        pageSize: 2000
      };
      api.listTag(data).then(res => {
        this.tagList = res.data.data.list;
      });
    },

    // 拖拽
    datadragEnd(evt) {
      evt.preventDefault();
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      this.base.model[evt.oldIndex].seqNum = evt.oldIndex + 1;
      this.base.model[evt.newIndex].seqNum = evt.newIndex + 1;
    },

    // 添加题目
    addQuestion(type, q) {
      let item = {
        seqNum: this.base.model.length + 1,
        type: type,
        title: "",
        picture: "",
        optionList: [
          {
            seqNum: 1,
            value: "",
            picture: "",
            tagId: ""
          }
        ]
      };
      this.base.model.push(item);
    },

    // 添加答案选项
    addAnswer(type, q, a) {
      if (!this.base.model[q].optionList) {
        this.$set(this.base.model[q], "optionList", []);
      }
      let item = {
        seqNum: this.base.model[q].optionList.length + 1,
        value: "",
        picture: ""
      };
      this.base.model[q].optionList.push(item);
    },

    // 显示标签
    openTag(q, a) {
      this.$set(this.base.model[q].optionList[a], "showTag", true);
    },

    // 删除题目
    rmQuestion(q) {
      this.base.model.splice(q, 1);
    },

    // 删除答案选项
    rmAnswer(q, a) {
      this.base.model[q].optionList.splice(a, 1);
    },

    // 删除标签
    rmTag(q, a) {
      this.base.model[q].optionList[a].tagId = "";
      this.base.model[q].optionList[a].showTag = false;
    },

    // 删除图片
    removeImg(type, q, a) {
      if (type === "q") {
        this.base.model[q].picture = "";
      } else if (type === "a") {
        this.base.model[q].optionList[a].picture = "";
      }
    },

    // 打开图片对话框
    openImgBox(type, q, a) {
      this.uploadType = type;
      this.digImgWrap = true;
      if (this.activeIndex == 2) {
        this.imgObj.imgType = type;
        this.imgObj.q = q;
        this.imgObj.a = a;
      }
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      if (this.activeIndex == 1) {
        this.model.picture = val;
      } else if (this.activeIndex == 2) {
        let imgObj = this.imgObj;
        if (imgObj.imgType === "q") {
          this.base.model[imgObj.q].picture = val;
        } else if (imgObj.imgType === "a") {
          this.base.model[imgObj.q].optionList[imgObj.a].picture = val;
        }
      }
    },
    check(refName) {
      let state = false;
      this.$refs[refName].validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将基础设置信息填写完整！");
        return false;
      }
      return state;
    },
    submit() {
      if (this.activeIndex == 1) {
        this.$refs.editor.getContent();
        if (!this.check("model")) return false;
        let model = JSON.parse(JSON.stringify(this.model));
        this.loading = true;

        if (this.$route.query.id || this.updateId) this.update(model);
        else this.add(model);
      } else if (this.activeIndex == 2) {
        if (!this.check("base")) return false;
        try {
          let item = {
            seqNum: 1,
            value: "",
            picture: "",
            tagId: ""
          };
          this.base.model.map((item, index) => {
            if (item.type == 3) {
              this.base.model[index].optionList = [];
            }
          });
        } catch (error) {}
        let base = {
          questionList: this.base.model,
          surveyId: this.$route.query.id || this.updateId
        };

        this.loading = true;
        this.updateQ(JSON.stringify(base));
      }
    },
    //  更新问卷
    update(model) {
      api
        .updateSurvey(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.activeIndex = 2;
          //  setTimeout(() => {
          //    this.$router.go(-1);
          //  }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //  添加问卷
    add(model) {
      api
        .addSurvey(model)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.updateId = res.data.message;
          this.activeIndex = 2;
          //  setTimeout(() => {
          //    this.$router.go(-1);
          //  }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //  更新题目
    updateQ(model) {
      api
        .updateSurveyQuestion(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "保存成功",
            type: "success"
          });
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
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
    content: "添加图片";
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
    content: "删除";
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
    top: 10px;
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
  overflow: auto;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        border-left: 3px solid #fec02d;
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
  border: 1px dashed #d9d9d9;
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
