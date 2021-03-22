<template>
  <div>
    <go-back title="企业信息"></go-back>
    <div class="main-content">
      <Title>基础信息</Title>
      <div class="xfo-base-info">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="名片主题">
            <xfo-input xfoRef="cardName" v-model="companyInfo.name"></xfo-input>
          </el-form-item>
          <el-form-item label="企业图标">
            <upload-image-vmodel :width="120" :height="120" v-model="companyInfo.logo"></upload-image-vmodel>
          </el-form-item>
          <el-form-item label="名片封面">
            <upload-image-vmodel :width="120" :height="120" v-model="companyInfo.cover"></upload-image-vmodel>
          </el-form-item>
          <el-form-item label="官网简介">
            <xfo-input xfoRef="introduction" v-model="companyInfo.introduction"></xfo-input>
          </el-form-item>
          <el-form-item label="企业地址">
            <xfo-input xfoRef="address" v-model="companyInfo.address"></xfo-input>
          </el-form-item>
          <el-form-item label="企业电话">
            <xfo-input xfoRef="tel" v-model="companyInfo.tel"></xfo-input>
          </el-form-item>
          <el-form-item label="企业介绍">
            <upload-image :width="120" :height="120" :fileList="images" :maxLength="99999"></upload-image>
            <upload-pdf :api="'api/admin/v1.2/upload-file'" accept="pdf" :size="100"></upload-pdf>
          </el-form-item>
          <el-form-item label="企业视频"></el-form-item>
        </el-form>
      </div>
      <Title>企业标签</Title>
      <div class="xfo-tags">
        <Tag type="light" icon="el-icon-office-building" v-for="(tag, tIndex) in companyInfo.tags" :key="tIndex">{{
          tag.name
        }}</Tag>
      </div>
    </div>
  </div>
</template>

<script>
import GoBack from '@/modules/scrm/components/components/GoBack.vue'
import Title from '@/modules/scrm/components/components/Title.vue'
import UploadImageVmodel from '@/modules/scrm/components/components/UploadImageVmodel.vue'
import XfoInput from '@/modules/scrm/components/components/XfoInput.vue'
import Tag from '@/modules/scrm/components/components/Tag.vue'
import UploadImage from '@/modules/scrm/components/components/UploadImage'
import UploadPdf from '@/modules/scrm/components/components/UploadPdf'
export default {
  components: { GoBack, Title, UploadImageVmodel, XfoInput, Tag, UploadImage, UploadPdf },
  created() {
    this.getCropCompant()
  },
  data() {
    return {
      companyInfo: {},
      images: []
    }
  },
  methods: {
    // 获取数据
    getCropCompant() {
      this.$http.getCropCompant().then((res) => {
        console.log(res)
        this.companyInfo = res.data.data
        let images = this.companyInfo.images.split(',')
        images.forEach((item) => {
          this.images.push({ name: 'companyimage', url: this.imgHost + item })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  background-color: #fff;
  padding: 20px;
  .xfo-base-info {
    width: 820px;
  }
  .xfo-image {
    padding: 5px;
    border-radius: 4px;
    border: 1px dashed #c0ccda;
    margin-left: 10px;
  }
}
</style>
