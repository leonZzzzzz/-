<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input size="small" v-model.trim="searchData.title"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分类">
            <el-select size="small" v-model="searchData.categoryId">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in categoryList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select size="small" v-model="searchData.isRelease">
              <el-option label="全部" value=""></el-option>
              <el-option label="发布" :value="true"></el-option>
              <el-option label="下架" :value="false"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- 
          <el-form-item label="状态">
            <el-select size="small" v-model="searchData.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="报名中" value="1"></el-option>
              <el-option label="已开课" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">添加</el-button>
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="update(1)">修改</el-button>
        <el-button type="primary" size="small" :disabled="tableList.id == null"  @click="deleteConfirm(1)">删除</el-button>
        <!-- <el-button type="primary" size="small" :disabled="tableList.id == null" @click="jumpPage('list/question?id='+tableList.id)">编辑题目</el-button> -->
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="jumpPage(`list/question?id=${tableList.id}&active=2`)">查看结果</el-button>
        <el-button type="primary" size="small" :disabled="tableList.id == null" @click="getVisible()">提取问卷链接</el-button>
      </button-wrap>
    </div>
    <qc-table-old ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/survey/page">
    </qc-table-old>
    <!-- 复制链接弹窗 -->
    <el-dialog title="问卷链接" :visible.sync="simpleVisible" :append-to-body="true" :close-on-click-modal="false" :before-close="closeSimple" width="880px">
      <p v-if="$store.state.appTypeList.some(item => item === 3)" 
        style="font-size: 14px;color: #888; padding: 10px 0;">注: 如果您的应用对接的是小程序，请使用小程序码分享</p>
      <div style="display: flex;">
        <div v-if="(!$store.state.appTypeList.length || $store.state.appTypeList.some(item => item === 2))" style="display: flex;">
          <el-input size="small" style="width: 400px;" v-model="shareLink"></el-input>
          <el-button size="small" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
          <el-popover placement="right" width="160" trigger="click">
            <qrcode 
              :value="shareLink" 
              v-if="shareLink" 
              tag="img"
              :options="{ size: 160 }"
              >
            </qrcode>
            <el-button slot="reference" type="primary" size="small" ref="test">二维码</el-button>
          </el-popover>
        </div>
        <WxQRCode v-if="simpleVisible && $store.state.appTypeList.some(item => item === 3)" :options="wxQRCodeOptions"></WxQRCode>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSimple()" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 会员列表弹窗 -->
    <!-- <dig-table  :visible="dialogTable" :id="updateId" :title="updateTitle" @close="closeDialogTable" ></dig-table> -->
  </div>
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin.js";
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import Qrcode from '@xkeshi/vue-qrcode';
// import DigTable from "./table";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, Qrcode, },
  data() {
    return {
      digFromWrap: false,
      simpleVisible: false,
      actVisible: false,
      dialogTable: false,
      updateId: "",
      updateTitle: "",
      categoryList: [],
      wxQRCodeOptions: {
        name: '', 
        scene: ''
      },
      searchData: {
        title: '',
      },
      showData: [
        { template: "index" },
        { prop: "title", label: "标题" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" }
      ],
      shareLink: '',
      shareSurvey: `${this.base.baseHost}${this.base.projectName()}/mobile/POUND/survey?wo=1&wot=2&woacm=1&mpl=1&`,
    };
  },
  methods: {
    insert() {
      // this.digFromWrap = true;
      this.$router.push("list/release");
    },
    update(count) {
      this.updateId = this.tableList.id;
      // this.$router.push(`scssonRelease?id=${this.tableList.id}`);
      if (count === 1) {
        this.$router.push(`list/release?id=${this.tableList.id}`);
      } else {
        this.$router.push(`list/release?id=${this.tableList.id}&copy=true`);
      }
    },
    getVisible() {
      this.shareLink = `${this.shareSurvey}id=${this.tableList.id}`
      this.wxQRCodeOptions = {
        name: 'survey',
        scene: this.tableList.id || ''
      }
      this.simpleVisible = true;
    },
    closeSimple () {
      this.simpleVisible = false;
    },
    closeLink() {
      this.actVisible = false;
    },
    copy(shareLink) {
      let oInput = document.createElement("input");
      oInput.value = shareLink;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.style.display = 'none';
      document.body.removeChild(oInput);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    detail() {
      this.$router.push(`list/detail?id=${this.tableList.id}`);
    },
    getCategory() {
      api.listCategory({type: 1, pageNum: 1, pageSize: 200}).then(res => {
        this.categoryList = res.data.data.list
      })
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    deleteConfirm(count) {
      let text =
        count === 1 ? "是否删除该数据?" : count == 2 ? "是否发布?" : '是否下架?';
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (count === 1) this.delete();
          else this.release(count);
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deletescsson({ id: this.tableList.id })
        .then(res => {
          console.log(res);
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.message,
            type: "error"
          });
        });
    },
    release(count) {
      let model = {
        id: this.tableList.id,
        isRelease: count == 2 ? true : false
      };
      api
        .releasescsson(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.searchKeep();
          // setTimeout(() => {
          //   this.$router.go(-1);
          // }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    openDialogTable() {
      this.dialogTable = true;
      this.updateId = this.tableList.id;
      this.updateTitle = this.tableList.title;
    },
    closeDialogTable(flag) {
      this.dialogTable = false;
    },
  }
};
</script>
