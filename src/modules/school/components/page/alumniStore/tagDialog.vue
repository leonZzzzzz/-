<template>
  <el-dialog title='添加标签' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="overflow: auto;" v-loading="dataLoading">
         <el-form :model="model" ref="model" class="new-form" label-position="top">
            <el-form-item>
            
            </el-form-item>
         </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button size="small" @click="close(false)">取 消</el-button>
         <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
      </span>
   </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tagList: [],
      memberTagList: [],
      model: {
        templateId: '',
        memberId: '',
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        // this.$refs.model.clearValidate();
        this.dataLoading = true;
        this.getMemberTag()
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getTagList() {
      this.$http.pagePersonalityLabel({pageNum: 1, pageSize: 999}).then(res => {
        this.tagList = res.data.data.list
      })
    },
    getMemberTag() {
      this.$http.pageMemberPersonalityLabel({pageNum: 1, pageSize: 999, memberId: this.id, orderBy: 'newFirst'}).then(res => {
        this.dataLoading = false;
        this.memberTagList = res.data.data.list
      })
    },
    addTag() {
      
    }
  }
}
</script>

