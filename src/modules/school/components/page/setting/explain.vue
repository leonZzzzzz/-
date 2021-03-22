<template>
  <div v-loading="dataLoading" element-loading-text="拼命加载中">
    <div :style="{'height': `${areaHeight}px`, overflow: 'auto'}">
      <el-form :model="model" ref="model" label-position="top" size="small">
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model.trim="model.title" :maxlength="32" placeholder="最多可输入32位" style="width:400px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
          <editor :content="model.content" @get-content="getContent" ref="editor"></editor>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="save()" size="small" :loading="saveLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
import editor from "../../common/editor";
import api from "apiSchool/common";

export default {
  components: {
    editor
  },
  data() {
    return {
      model: {
        title: '',
        content: '',
      },
      areaHeight: 0,
      dataLoading: false,
      saveLoading: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight()
    })
    window.onresize = () => {
      this.getHeight()
    }
  },
  created() {
    this.dataLoading = true
    this.agreementPage()
  },
  methods: {
    getHeight() {
      this.areaHeight =  window.innerHeight - 122 - 40 - 50 - 30
    },
    agreementPage() {
      api.agreementPage({code: 'registerExplain'}).then(res => {
        console.log(res.data);
        let list = res.data.data.list
        if (list.length > 0) this.agreementGet(list[0].id)
      })
    },
    agreementGet(id) {
      api.agreementGet({id}).then(res => {
        console.log(res.data)
        this.model = res.data.data
        this.dataLoading = !true
      })
    },
    saveModel() {
      let type = this.model.id ? 'agreementUpdate' : 'agreementInsert'
      api[type](this.model).then(res => {
        this.$message.success('保存成功');
        this.agreementPage()
      })
    },
    // 获取content
    getContent(content) {
      this.model.content = content;
    },
    save() {
      this.$refs.editor.getContent();
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.saveModel()
        } else {
          this.$message.error("请将信息填写完整！");
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
