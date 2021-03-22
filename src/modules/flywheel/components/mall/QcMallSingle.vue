<template>
  <div
    class="qc-mall-single"
    :class="{ 'qc-mall-single--top-radio': options.topRadio, 'qc-mall-single--bottom-radio': options.bottomRadio }"
  >
    <el-image
      mode="cover"
      class="qc-mall-single__banner"
      :src="imgHost + options.cover"
    >
      <div
        slot="error"
        class="el-image__error"
        style="min-height:150px"
      >请上传图片，建议尺寸345*150</div>
    </el-image>
    <div class="qc-mall-single__product">
      <div class="qc-mall-single__product-name">
        {{ options.item.length >= 1 ? options.item[0].name : '【商品名称】模拟数据，请添加真实数据' }}
      </div>
      <div class="qc-mall-single__product-other">
        <div class="qc-mall-single__product-price">
          <div class="qc-mall-single__product-now">
            ￥{{ options.item.length >= 1 ? options.item[0].price / 100 : '10' }}
          </div>
          <div class="qc-mall-single__product-orig">
            原价￥{{ options.item.length >= 1 ? options.item[0].origPrice / 100 : '0.01' }}
          </div>
        </div>
        <div class="qc-mall-single__product-button">立刻购买</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QcMallSingle',
  title: '商城组件',
  props: {
    options: Object
  },
  config: [
    { formName: 'cover', label: '封面图', type: 'qc-image-upload', value: '' },
    { formName: 'topRadio', label: '顶部圆角', type: 'el-switch', value: false },
    { formName: 'bottomRadio', label: '底部圆角', type: 'el-switch', value: false },
    {
      formName: 'item',
      label: '自定义数据',
      type: 'qc-uploader',
      value: [],
      props: {
        isChangeName: false,
        module: ['Mall'],
        type: ['product'],
        max: 1,
        propsName: 'id,name,price,origPrice,storeId'
      }
    }
  ]
}
</script>

<style lang="scss" scoped>
.qc-mall-single {
  margin: 15px;
  overflow: hidden;
  background: #fff;
  &--top-radio {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  &--bottom-radio {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  &__banner {
    min-height: 150px;
    width: 100%;
    vertical-align: top;
  }
  &__product {
    padding: 10px;
    &-name {
      font-size: 15px;
      line-height: 22px;
      color: #848484;
    }
    &-other {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &-price {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    &-now {
      color: #ea3d24;
      font-size: 20px;
      margin-right: 10px;
      &:first-letter {
        font-size: 10px;
      }
    }
    &-orig {
      font-size: 12px;
      color: #848484;
      text-decoration: line-through;
    }
    &-button {
      background: #ea3d24;
      color: #fff;
      border-radius: 25px;
      font-size: 14px;
      padding: 7px 20px;
    }
  }
}
</style>
