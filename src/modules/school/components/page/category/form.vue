<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>-->
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div class="form">
        <el-button size="small" type="primary" @click="addRow()">添加</el-button>
        <table class="property-table">
          <tr>
            <th v-for="(item, i) in tableTitle" :key="i">{{item.title}}</th>
          </tr>
          <tr v-for="(item, i) in categoryList" :key="i">
            <td>
              <QcImageUpload
                width="40px"
                height="40px"
                v-model="item.iconUrl"
              ></QcImageUpload>
            </td>
            <td>
              <el-input-number
                :min="1"
                size="small"
                v-model="item.seqNum"
                style="width: 100px;"
                clearable
              ></el-input-number>
            </td>
            <td>
              <el-input
                size="small"
                v-model.trim="item.name"
                placeholder="请输入名称"
                @blur="inputBlur"
                clearable
              ></el-input>
            </td>
            <td>
              <el-input size="small" v-model.trim="item.info" placeholder="请输入备注" clearable></el-input>
            </td>
            <td>
              <el-button size="small" type="danger" @click="delRow(i)">删除</el-button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit" size="small" :loading="loading">保存</el-button>
    </div>
    <image-dialog
      :visible="digImgWrap"
      :uploadType="uploadType"
      imageType="app"
      @close-imgbox="closeImgbox"
      @get-imgsrc="onGetImgsrc"
      :cropper-option="cropperOption"
    ></image-dialog>
  </div>
</template>

<script>
import ImageDialog from '../../common/ImageDialog'
import api from 'apiSchool/common'
import ButtonWrap from '../../common/ButtonWrap'
import SearchWrap from '../../common/SearchWrap'

export default {
  components: {
    ImageDialog,
    ButtonWrap,
    SearchWrap
  },
  data() {
    return {
      cropperOption: {
        autoCropWidth: 200,
        autoCropHeight: 200,
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false
      },
      wrapHeight: 0,
      areaHeight: 0,
      uploadIndex: 0,
      canISubmit: true,
      digImgWrap: false,
      loading: false,
      dataLoading: false,
      categoryList: [],
      uploadType: 'radio',
      searchData: {
        name: ''
      },
      tableTitle: [
        { title: '图标', value: '' },
        { title: '排序', value: '' },
        { title: '名称', value: '' },
        { title: '备注', value: '' },
        { title: '操作', value: '' }
      ]
    }
  },
  created() {
    this.apiGetList()
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 105
    },
    // 分类列表
    apiGetList() {
      api.listByType({ type: 13 }).then(res => {
        this.categoryList = res.data.data
      })
    },
    //更新
    apiUpdate(model) {
      api
        .updateCategoryEdit({ list: model, type: 13 })
        .then(() => {
          this.loading = false
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.apiGetList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交
    submit() {
      for (let i = 0; i < this.categoryList.length; i++) {
        if (this.categoryList[i].iconUrl == '') {
          this.$message.warning('请上传图标')
          this.canISubmit = false
          break
        } else if (this.categoryList[i].name == '') {
          this.$message.warning('字段不能为空')
          this.canISubmit = false
          break
        } else {
          this.canISubmit = true
        }
      }
      if (this.canISubmit) this.apiUpdate(this.categoryList)
    },
    addRow() {
      this.categoryList.push({
        seqNum: (this.categoryList.length + 1) * 1,
        name: '',
        info: '',
        iconUrl: '',
        code: '',
        type: 13,
        id: '',
        isDisplay: true
      })
    },
    delRow(i) {
      this.categoryList.splice(i, 1)
    },
    //更新信息
    detail() {
      api.getAttachment({ id: this.id }).then(res => {
        this.model = res.data.data
        this.dataLoading = false
      })
    },
    inputBlur(e) {
      // console.log(e)
      if (e.target.value === '') {
        this.$message.warning('字段不能为空')
        this.canISubmit = false
      }
    },
    close(flag) {
      this.model = this.reduc()
      this.$emit('close', flag)
    },
    reduc() {
      let model = {
        name: '',
        href: '',
        url: '',
        sortNumber: 0,
        note: ''
      }
      return model
    },
    // 打开图片对话框
    openImgBox(index) {
      this.uploadIndex = index
      this.digImgWrap = true
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc(val) {
      this.categoryList[this.uploadIndex].iconUrl = val
    }
  }
}
</script>
<style lang="scss" scoped>
.context-box {
  padding: 20px;
  overflow: auto;
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
      img {
        cursor: pointer;
      }
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
