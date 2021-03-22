<template>
  <div class="moments-detail">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">企业动态圈详情</el-button>
    </div>
    <div class="main_content">
      <div class="detail-content">
        <el-form ref="form" :model="form" label-width="80px">
          <!-- <el-form-item label="动态名称">
            <div>{{ form.title }}</div>
          </el-form-item> -->
          <el-form-item label="动态内容" :required="true">
            <div v-html="parsingEmoji(form.content)"></div>
            <div class="upload-content">
              <div class="form-img" v-if="radio === '1'">
                <div class="img-item" v-for="(item, index) in form.momentsUploadContentList" :key="index">
                  <image-preview :imageUrl="item.url" height="100px" width="100px"></image-preview>
                </div>
              </div>
              <div class="form-video" v-if="radio === '2'">
                <div class="video-item" v-for="(item, index) in form.momentsUploadContentList" :key="index">
                  <video-preview :videoData="item"></video-preview>
                </div>
              </div>
              <div class="form-link" v-if="radio === '3'">
                <div class="link-content" @click="openLink(form.momentsUploadContentList[0])">
                  <div class="left">
                    <div class="title">{{ form.momentsUploadContentList[0].title }}</div>
                    <div class="desc">{{ form.momentsUploadContentList[0].description }}</div>
                  </div>
                  <img class="cover" :src="`${imgHost}${form.momentsUploadContentList[0].url}`" />
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="上传内容" :required="true">
            <el-radio-group v-model="radio">
              <el-radio disabled label="-1">无</el-radio>
              <el-radio disabled label="1">图片</el-radio>
              <el-radio disabled label="2">视频</el-radio>
              <el-radio disabled label="3">图文链接</el-radio>
            </el-radio-group>
            <div class="form-img" v-if="radio === '1'">
              <div class="img-item" v-for="(item, index) in form.momentsUploadContentList" :key="index">
                <image-preview :imageUrl="item.url" height="100px" width="100px"></image-preview>
              </div>
            </div>
            <div class="form-video" v-if="radio === '2'">
              <div class="video-item" v-for="(item, index) in form.momentsUploadContentList" :key="index">
                <video-preview :videoData="item"></video-preview>
              </div>
            </div>
            <div class="form-link" v-if="radio === '3'">
              <div class="link-content" @click="openLink(form.momentsUploadContentList[0])">
                <div class="left">
                  <div class="title">{{form.momentsUploadContentList[0].title}}</div>
                  <div class="desc">{{form.momentsUploadContentList[0].description}}</div>
                </div>
                <img class="cover" :src="`${imgHost}${form.momentsUploadContentList[0].url}`"/>
              </div>
            </div>
          </el-form-item> -->
          <el-form-item label="发表成员" :required="true">
            <div class="form-member">
              <div class="member-item" v-for="(item, index) in form.momentsUsers" :key="index">
                <i class="el-icon-s-custom member-icon"></i>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPreview from '../../../components/common/VideoPreview'
import ImagePreview from '../../../components/common/ImagePreview'
export default {
  components: {
    VideoPreview,
    ImagePreview
  },
  data() {
    return {
      form: {},
      radio: '-1' // string类型-1无，1图片，2视频，3图文链接
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getMomentsDetail(this.$route.query.id)
    }
  },
  methods: {
    getMomentsDetail(id) {
      this.$http.getCompMomentsDetail({ id }).then((res) => {
        this.form = res.data.data
        // 判断上传内容的类型
        let uploadList = res.data.data.momentsUploadContentList
        if (uploadList.length > 0) {
          this.radio = uploadList[0].type
        } else {
          this.radio = '-1'
        }
      })
    },
    // 打开链接地址
    openLink(obj) {
      window.open(obj.link)
    }
  }
}
</script>

<style lang="scss" scoped>
.moments-detail {
  width: 100%;
  height: 100%;
  margin: auto;
}
.main_content {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 20px;
  min-height: calc(100% - 56px);
  box-sizing: border-box;
}
.detail-content {
  max-width: 600px;
  .form-img {
    display: flex;
    flex-flow: wrap;
    margin-top: 10px;
    .img-item {
      margin: 0 10px 10px 0;
    }
  }
  .form-video {
    display: flex;
    margin-top: 10px;
    .video-item {
      margin: 0 10px 10px 0;
    }
  }
  .form-link {
    margin-top: 10px;
    .link-content {
      display: flex;
      padding: 10px;
      width: 350px;
      background: #f8f8f8;
      cursor: pointer;
      .left {
        width: 280px;
        margin-right: 10px;
        .title {
          line-height: 24px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .desc {
          line-height: 20px;
          color: #909399;
          overflow: hidden;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          box-orient: vertical;
          display: -webkit-box;
          display: -moz-box;
        }
      }
      .cover {
        width: 60px;
        height: 60px;
      }
    }
  }
  .form-member {
    display: flex;
    flex-flow: wrap;
    max-width: 400px;
    .member-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      margin: 5px 10px 0 0;
      .member-icon {
        margin-right: 5px;
        color: #294a7b;
      }
    }
  }
}
.image-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 800px;
  }
}
</style>
