<template>
  <!-- <div class="table-box"> -->
    <el-dialog title="选择关联广告图" width="70%" :visible.sync="visible" :before-close="close" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <qc-table-old ref="table" style="padding-bottom: 30px;" :autoHeight="400" selection border :table-list="showData" :search="searchData" url="api/admin/v1/appAttachment/page" v-if="visible"></qc-table-old>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="tableList.id == null" @click="connectAttachmemt()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  <!-- </div> -->
</template>

<script>
import { tableMixin } from "jsSchool/tableMixin.js";
import SearchWrap from "commonSchool/SearchWrap";
import ButtonWrap from "commonSchool/ButtonWrap";
import api from "apiSchool/common";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, },
  props: {
    id: String,
    title: String,
    visible: Boolean,
  },
  data() {
    return {
      model: {
        onlinecourseId: '',
        memberIdList: [],
      },
      searchData: {
        name: "",
        mobile: "",
        hasNumber: ""
      },
      showData: [
        { prop: "seqNum", label: "排序", template: 'seqNum' },
        { prop: "url", label: "图片", template: "img", isPrefix: true },
        { prop: "name", label: "名称" },
        // { prop: "href", label: "链接" },
        { prop: "note", label: "备注" },
        { prop: "createTime", label: "创建时间" }
      ],
    }
  },
  methods: {
    connectAttachmemt() {
      let model = {
        id: this.tableList.id,
        href: `/pages/news/newsDetail/newsDetail?id=${this.id}`
      }
      // console.log(model);
      // this.close(true)
      // return
      api.connectAttachmemt(model).then(res => {
        this.$message.success('关联成功')
        this.close(true)
      })
    },
    close(flag) {
      this.$emit("close", flag);
    },
  },
}
</script>

