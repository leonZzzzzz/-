<template>
  <div class="template-preview">
    <div class="temp-msg-card">
      <header class="card-header">
        <div class="card-logo"></div>
      </header>
      <main class="card-main">
        <section>
          <h2 class="title">{{ model.name }}</h2>
        </section>
        <ul class="content">
          <li class="content__list" v-for="item in model.templateItemList" :key="item.id">
            <label class="content__label">{{ item.name }}</label>
            <div class="content__info">{{ item.data }}</div>
          </li>
        </ul>
      </main>
      <footer class="card-footer">查看详情</footer>
    </div>
    <div class="tip">点击下图查看配置示例</div>
    <el-image
      style="width: 320px;display: block;"
      :src="imgHost + '/attachments/null/6176f19168634b15a4135f1b9ba48ebd.png'"
      :preview-src-list="[imgHost + '/attachments/null/6176f19168634b15a4135f1b9ba48ebd.png']"
    >
    </el-image>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.template-preview {
  width: 320px;
  .temp-msg-card {
    border: 1px solid #eee;
    border-radius: 5px;
    .card-header {
      border-bottom: 1px solid #eee;
      .card-logo {
        width: 40px;
        height: 40px;
        margin: 15px;
        background: #dadada;
        border-radius: 50%;
      }
    }
    .card-main {
      padding: 15px;
      min-height: 230px;
      .title {
        font-size: 14px;
        font-weight: normal;
      }
      .time {
        color: #9a9a9a;
        font-size: 12px;
      }
      .content {
        padding: 30px 0;
        .content__list {
          list-style: none;
          font-size: 14px;
        }
        .content__label {
          display: inline-block;
          width: 80px;
          color: #9a9a9a;
          vertical-align: top;
        }
        .content__info {
          display: inline-block;
          vertical-align: top;
        }
      }
    }
    .card-footer {
      border-top: 1px solid #eee;
      font-size: 14px;
      padding: 9px 15px;
    }
  }
  .tip {
    color: #9a9a9a;
    padding: 20px 0 20px;
    text-align: center;
    font-size: 14px;
  }
}
</style>
