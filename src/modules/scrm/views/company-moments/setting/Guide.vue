<template>
  <div class="moments-guide">
    <div class="header_nav">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.go(-1)">配置指引</el-button>
    </div>
    <div class="guide">
      <div class="g-module first-module">
        <div class="title">设置动态圈展示信息</div>
        <div class="step">第一步：进入企业微信通讯录管理页面，在【对外资料显示】下选择【修改】</div>
        <div class="img-box">
          <!-- <img src="#"/> -->
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-01.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-01.png')]"
          >
          </el-image>
        </div>
        <div class="step">第二步：选择【添加自定义信息】</div>
        <div class="img-box">
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-02.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-02.png')]"
          >
          </el-image>
        </div>
        <div class="step">第三步：填写名称为【动态圈】，选择类型为网页后保存</div>
        <div class="img-box">
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-03.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-03.png')]"
          >
          </el-image>
        </div>
        <div class="step">第四步：前往小数桔后台的【动态圈成员】设置动态圈成员</div>
        <div class="img-box">
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-04.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-04.png')]"
          >
          </el-image>
        </div>
        <div class="tips">以上配置设置好后，微信用户即可在员工个人信息页查看企业动态圈对外信息</div>
        <div class="img-box">
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-05.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-05.png')]"
          >
          </el-image>
          <el-image
            class="guide-image"
            :src="require('@/modules/scrm/images/m-guide-06.png')"
            :preview-src-list="[require('@/modules/scrm/images/m-guide-06.png')]"
          >
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.guide {
  padding: 20px;
  background: #ffffff;
  margin-top: 20px;
  .g-module {
    position: relative;
    padding: 0 0 40px 0;
    max-width: 700px;
    .title {
      margin-bottom: 8px;
    }
    .tips {
      line-height: 20px;
      margin: 20px 0;
    }
    .step {
      font-size: 14px;
      background: #f0f8ff;
      border-radius: 4px;
      width: 100%;
      padding: 10px 10px 10px 30px;
      position: relative;
      margin-top: 20px;
      line-height: 20px;
      box-sizing: border-box;
      &::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 16px;
        width: 6px;
        height: 6px;
        background: #294a7b;
        border-radius: 50%;
      }
      .link {
        cursor: pointer;
        color: #294a7b;
      }
    }
    .img-box {
      display: flex;
      margin-top: 20px;
      margin-bottom: 60px;
      .guide-image {
        width: 100%;
        height: auto;
      }
    }
  }
  .g-module:not(:first-child) {
    padding: 40px 0;
  }
  .g-module:not(:last-child) {
    &::after {
      content: '';
      width: 100%;
      max-width: 700px;
      height: 1px;
      border-bottom: 1px solid #ececec;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
