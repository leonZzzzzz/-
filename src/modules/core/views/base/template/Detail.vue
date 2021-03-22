<template>
  <QcNavigationPage content="模板详情" class="wx-temp-detail">
    <main class="temp-msg-main">
      <div class="template-preview">
        <TemplatePreview :model="model"></TemplatePreview>
      </div>
      <ul class="temp-msg-main__detail">
        <li class="detail__list">
          <label class="detail__label">模板ID</label>
          <div class="detail__info">{{ model.wxTemplateId }}</div>
        </li>
        <li class="detail__list">
          <label class="detail__label">标题</label>
          <div class="detail__info">{{ model.name }}</div>
        </li>
        <li class="detail__list">
          <label class="detail__label">关键词</label>
          <div class="detail__info">
            <section v-for="item in model.templateItemList" :key="item.id">
              <label class="detail__label">{{ item.name }}</label>
              <div class="detail__info">{{ item.data }}</div>
            </section>
          </div>
        </li>
      </ul>
    </main>
  </QcNavigationPage>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  created() {
    this.wxTemplateGet(this.$route.query.id)
  },
  methods: {
    wxTemplateGet(id) {
      this.$http.wxTemplateGet({ id }).then((res) => {
        this.model = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wx-temp-detail {
  width: 1100px;
  margin: 0 auto;
  .temp-msg-main {
    padding-top: 40px;
    overflow: hidden;
    .template-preview {
      float: left;
      margin: 0 20px;
    }
    &__detail {
      float: left;
      .detail__list {
        list-style: none;
        padding: 20px;
        font-size: 14px;
      }
      .detail__label {
        display: inline-block;
        width: 80px;
        color: #9a9a9a;
        vertical-align: top;
      }
      .detail__info {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}
</style>
