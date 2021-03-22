<template>
  <div>
    <img
      class="image-class"
      @click="config.visible = true"
      :style="{ width: width, height: height }"
      :src="`${imgHost}${imageUrl}`"
      fit="cover"
      alt=""
    />
    <com-dialog :config="config" @closeDialog="config.visible = false">
      <div class="image-dialog">
        <img :src="`${imgHost}${imageUrl}`" style="height: 450px;" />
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from './ComDialog'
export default {
  components: {
    ComDialog
  },
  props: {
    imageUrl: {
      type: String,
      default: () => {
        return {}
      }
    },
    height: {
      type: String,
      default: () => {
        return '150px'
      }
    },
    width: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      config: {
        width: '840px',
        title: '查看图片',
        visible: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-class {
  cursor: pointer;
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
