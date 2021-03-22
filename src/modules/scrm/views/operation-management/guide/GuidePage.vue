<template>
  <div>
    <GoBack :title="'如何添加成员'"></GoBack>
    <div class="guidePage">
      <p class="third">选择关联成员没有找到需要添加的成员，如何添加？</p>
      <p class="third">1. 进入企业微信 ，找到【应用管理】-【应用】-【自建应用】下的【小数桔】</p>
      <div class="image">
        <el-image
          style="width: 200px; height: 200px"
          :src="imgUrlOne"
          :preview-src-list="[imgUrlOne, imgUrlTwo]"
        >
        </el-image>
      </div>
      <p class="third">2. 打开小数桔，点击【编辑】，在【使用范围】内修改或添加成员</p>
      <div class="image">
        <el-image
          style="width: 200px; height: 200px"
          :src="imgUrlTwo"
          :preview-src-list="[imgUrlOne, imgUrlTwo]"
        >
        </el-image>
      </div>
    </div>
  </div>
</template>
<script>
import GoBack from '../../../components/components/GoBack'
export default {
  components: {
    GoBack
  },
  data() {
    let host = this.imgHost + '/public/pc-guide/'
    return {
      imgUrlOne: host + 'guide_a.png',
      imgUrlTwo: host + 'guide_b.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.guidePage {
  background-color: #ffffff;
  padding: 20px;
  color: #606266;
  .first {
    font-size: 18px;
    font-weight: bold;
    line-height: 2em;
  }
  .second {
    font-size: 16px;
    font-weight: bold;
    line-height: 2em;
  }
  .third {
    font-size: 14px;
    // font-weight: bold;
    line-height: 2em;
  }
  .content {
    font-size: 14px;
    text-indent: 2em;
    line-height: 1.5em;
  }
  .image {
    padding: 20px;
  }
}
</style>
