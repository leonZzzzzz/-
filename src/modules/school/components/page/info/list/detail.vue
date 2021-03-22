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
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{ height: `${areaHeight}px` }" ref="context">
      <div v-show="activeIndex === 1">
        <el-form :model="model" ref="model" label-position="top" size="small">
          <el-form-item
            v-if="!$route.query.id"
            label="栏目"
            prop="categoryId"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-select v-model="model.categoryId" size="small" @change="categoryIdChange">
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, i) in category"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input
              size="small"
              v-model="model.address"
              style="width:400px;"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="imgUrl">
            <!-- <div class="upload-img-box" @click="showImgBox(true, 'iconUrl', 'radio', {width: 400, height: 250})">
              <img v-if="model.iconUrl" :src="`${imgHost}${model.iconUrl}`" style="width: 120px;">
              <i v-else class="el-icon-plus upload-icon"></i>
            </div> -->
            <div class="img-box" style="width:350px">
              <div class="item" v-for="(item, i) in imgList" :key="i">
                <img :src="`${imgHost}${item.url}`" alt="" />
                <i class="el-icon-error" @click="deleteImg(i)"></i>
              </div>
              <div class="item-upload" @click="showImgBox(true, '', 'select')">
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <!-- <div class="img-box" style="width:350px">
              <div class="item" v-for="(item, i) in imgList" :key="i">
                <img :src="`${imgHost}${item.url}`" alt="">
                <i class="el-icon-error" @click="deleteImg(i)"></i>
              </div>
              <div class="item-upload" @click="openImgBox('select')">
                <i class="el-icon-plus"></i>
              </div>
            </div> -->
          </el-form-item>
          <el-form-item
            label="内容"
            prop="content"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <el-input
              size="small"
              type="textarea"
              v-model="model.content"
              style="width:500px;"
              :autosize="{ minRows: 4, maxRows: 18 }"
              clearable
            ></el-input>
          </el-form-item>
           <el-form-item label="评论留言">
          <el-form-item label="是否支持留言评论" label-width="710px">
            <el-switch v-model="model.isEnableComment"></el-switch>
          </el-form-item>
          <el-form-item label-width="0px" v-if="model.isEnableComment">
            <el-checkbox v-model="model.isEnableCommentAudit"
              >审核后才显示在页面</el-checkbox
            >
          </el-form-item>
        </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit" size="small" :loading="loading">保存</el-button>
    </div>

    <image-dialog
      :visible="digImgWrap"
      image-type="info"
      :upload-type="uploadType"
      :img-name="imgName"
      @close-imgbox="showImgBox"
      @get-imgsrc="onGetImgsrc"
      @get-imglistsrc="onGetImglistsrc"
    ></image-dialog>
  </div>
</template>

<script>
import editor from 'commonSchool/editor'
import api from 'apiSchool/common'
// import ImageDialog from "commonSchool/ImageDialog";
import upLoadMixin from 'jsSchool/upLoadMixin'

export default {
  mixins: [upLoadMixin],
  components: {
    editor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500
      },
      digImgWrap: false,
      tabbar: [{ index: 1, name: '基本信息' }],
      activeIndex: 1,
      cityDefault: [],
      model: {
        appellation: '',
        areaCode: '',
        phone: '',
        categoryId: '',
        areaId: '',
        content: '',
        address: '',
        imgUrl: '',
        tagInfo: '',
        isHasTop: false,
        isEnableComment: false,
        isEnableCommentAudit: false
      },
      imgList: [],
      // uploadType: "radio",
      wrapHeight: 0,
      areaHeight: 0,
      category: [],
      areaList: [],
      areaCodeList: [],
      dataLoading: false,
      loading: false,
      categoryTags: [],
      // tags: [],
      tagsVisible: false,
      // 置顶时刻表
      topDateList: [],
      topDialogVisible: false
    }
  },
  created() {
    this.listCategory()
    if (this.$route.query.id) {
      this.dataLoading = true
      this.apiGetInformationDetail()
    }
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    listCategory() {
      api.listByType({ type: 13 }).then(res => {
        this.category = res.data.data
      })
    },
    // 获取国家包含城市
    getAreaList() {
      api.getAreaList().then(res => {
        let list = []
        res.data.data.list.map((item, i) => {
          list.push({ label: item.name, value: item.id, children: [] })
          item.childList.map((two, j) => {
            list[i].children.push({ label: two.name, value: two.id })
          })
        })
        this.areaList = list
      })
    },
    apiGetInformationDetail() {
      api.getInformationDetail({ id: this.$route.query.id }).then(res => {
        this.model = res.data.data
        if (this.model.imgUrl) {
          let imgList = this.model.imgUrl.split(',')
          imgList.map(item => {
            this.imgList.push({ url: item })
          })
        }
        // if (this.$route.query.copy === "true")
        //   this.model = this.copy(this.model);
        this.dataLoading = false
      })
    },
    cityChange(val) {
      this.model.areaId = val[1]
    },
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map(item => {
            for (let key in item) {
              if (
                key === 'id' ||
                key === 'createTime' ||
                key === 'productId' ||
                key === 'productItemId'
              ) {
                delete item[key]
              }
            }
          })
        }
        if (
          key === 'id' ||
          key === 'createTime' ||
          key === 'updateTime' ||
          key === 'isFavourite' ||
          key === 'price'
        ) {
          delete model[key]
        }
      }
      console.log('copy', model)
      return model
    },
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 154
    },
    // 获取content
    getContent(content) {
      this.model.content = content
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false
      this.activeIndex = index
      this.$refs.context.scrollTop = 0
    },
    // // 打开图片对话框
    // openImgBox(type) {
    //   this.uploadType = type;
    //   this.digImgWrap = true;
    // },
    // // 关闭图片对话框
    // closeImgbox(state) {
    //   this.digImgWrap = false;
    // },
    // // 单张图片
    // onGetImgsrc(val) {
    //   this.model.icon = val;
    // },
    // // 多张图片
    // onGetImglistsrc(list, state) {
    //   console.log("onGetImglistsrc", list, state);
    //   this.imgList = [];
    //   if (state === 1) {
    //     list.map((item, i) => {
    //       let url = item.response.data.imageUrl;
    //       this.imgList.push({ url: url });
    //     });
    //   } else {
    //     list.map((item, i) => {
    //       let url = item.imageUrl;
    //       this.imgList.push({ url: url });
    //     });
    //   }
    // },
    // 删除图片
    deleteImg(i) {
      this.imgList.splice(i, 1)
    },
    getImgList() {
      let imgUrl = ''
      this.imgList.map((item, i) => {
        imgUrl += item.url + ','
      })
      this.model.imgUrl = imgUrl.substr(0, imgUrl.length - 1)
    },
    addRow() {
      this.model.productItems.push({
        spec1Value: '',
        quantity: '',
        price: '',
        quantityPerKilogram: ''
      })
    },
    delRow(i) {
      this.model.productItems.splice(i, 1)
    },
    // 提交
    submit() {
      this.getImgList()
      // this.$refs.editor.getContent();
      console.log(this.model)
      // if (this.tags.length) this.model.tagInfo = this.tags.join("_");
      // else this.model.tagInfo = "";
      let model = JSON.parse(JSON.stringify(this.model))
      // model.productItems.map(item => {
      //   item.price = Math.floor(item.price * 100);
      // });
      // return false
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.$route.query.copy) this.addInformation(model)
          else if (this.$route.query.id) this.updateInformation(model)
          else this.addInformation(model)
        } else {
          this.$message.error('请将信息填写完整！')
          return false
        }
      })
    },
    // 添加商品
    addInformation(model) {
      api
        .addInformation(model)
        .then(res => {
          this.loading = false
          this.$message.success('添加成功')
          this.$router.go(-1)
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 更新商品
    updateInformation(model) {
      api
        .updateInformation(model)
        .then(res => {
          this.loading = false
          this.$message.success('更新成功')
          this.$router.go(-1)
        })
        .catch(err => {
          this.loading = false
        })
    },
    categoryIdChange(id) {
      this.getCategoryTag(id)
    },
    // 获取栏目标签
    getCategoryTag(id) {
      let params = {
        code: id
      }
      api.getCategoryTag(params).then(res => {
        console.log('获取栏目标签信息：', res)
        if (res.data.data) {
          let tags = res.data.data.info
          if (tags) {
            this.categoryTags = tags.split('_')
          } else {
            this.categoryTags = []
          }
        }
        this.tagsVisible = true
      })
    },
    handleTopChange(flag) {
      console.log('是否置顶：', flag)
      if (flag) {
        this.topDialogVisible = true
      }
    },
    topDialogClose(flag) {
      this.model.isHasTop = flag
      this.topDialogVisible = flag
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "@/assets/styles/element-variables.scss";

.tabbar {
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px 30px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    // background-color: #3091f2;
    background-color: $--color-primary;
    color: #fff;
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
        content: '';
        // border-left: 3px solid #3091f2;
        border-left: 3px solid $--color-primary;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}

.area-box {
  display: flex;
  .sidebar {
    flex-shrink: 0;
    width: 150px;
  }
  .content {
    padding: 10px;
    overflow: auto;
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
    // border-color: #409eff;
    border-color: $--color-primary;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.img-box {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin: 0 6px 6px 0;
    flex-shrink: 0;
    // &:nth-child(7n) {
    //   margin: 0 0 6px 0;
    // }
    img {
      width: 100%;
    }
    .el-icon-error {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #c5c5c5;
    }
  }
  .item-upload {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    overflow: hidden;
    cursor: pointer;
    line-height: 100px;
    text-align: center;
    &:hover {
      // border-color: #409eff;
      border-color: $--color-primary;
    }
    i {
      font-size: 26px;
      color: #8c939d;
    }
  }
}
.property-box {
  border: 1px solid #e7eaec;
  padding: 15px;
  // width: 869px;
  .property-item {
    border-left: 3px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .name {
      background: rgba(0, 0, 0, 0.035);
      padding: 10px 10px 10px 15px;
      display: flex;
      justify-content: space-between;
      height: 38px;
      .delete-btn {
        display: none;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        .delete-btn {
          display: block;
        }
      }
    }
    .value {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .input {
        width: 150px;
        margin: 15px 0 0 15px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        i {
          font-size: 14px;
          position: absolute;
          right: -15px;
          top: 0;
          transition: all 0.3s ease;
        }
        &:hover {
          i {
            right: 3px;
            cursor: pointer;
          }
        }
      }
      .btn {
        margin: 15px 0 0 15px;
      }
    }
    &:hover {
      border-color: #337ab7;
    }
  }
}
.property-table {
  border: 1px solid #e7eaec;
  margin-top: 20px;
  // width: 900px;
  border-spacing: 0;
  border-collapse: collapse;
  tr {
    th {
      padding: 15px 12px;
      line-height: 1.5;
      .input-group {
        display: flex;
      }
    }
    td {
      border-top: 1px solid #e7eaec;
      line-height: 1.5;
      padding: 15px 12px;
      text-align: center;
    }
  }
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
