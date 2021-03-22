<template>
  <!-- 目标人员标签  参考新建企业动态圈  xfo -->
  <!-- 
  【引入示例】
  import Tag from '../../../components/components/Tag'

  【使用示例】
  <Tag type='light'> 这是我的标签 </Tag>

  【属性】
  参数       类型              说明                     可选值           默认值
  size       number      tag的高度                     --                 28
  type       string      控制标签文本与图标颜色     dark（#546e95）       dark
                                                    light（#606266）          
  url        string      头像                        --                   --
  imgType    string      头像形状                  rect（矩形）          rect 
                                                    circle（圆形）
  fontSize   number      字体大小                    --                   16px
  【方法】
  无

 -->
  <div class="tag-page">
    <span
      :class="['tag', type == 'light' ? 'light' : '']"
      :style="`height: ${size}px; line-height: ${size}px;font-size:${fontSize}px`"
    >
      <el-image
        :class="{ circle: imgType == 'circle' }"
        style="width: 18px; height: 18px; margin-right: 5px"
        :src="url"
        fit="cover"
        v-if="url"
      ></el-image>
      <i :class="icon" v-if="!url"></i>
      <slot></slot
    ></span>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'dark'
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'el-icon-user-solid icon-user'
    },
    size: {
      type: Number,
      default: 28
    },
    fontSize: {
      type: Number,
      default: 14
    },
    imgType: {
      type: String,
      default: 'rect' // rect 矩形 circle 圆形
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-page {
  display: inline-block;
}
.tag {
  display: flex;
  border: 1px solid #546e95;
  padding: 0 5px;
  margin: 8px 8px 7px 0;
  border-radius: 3px;
  align-items: center;
  color: #546e95;
  i {
    color: #546e95;
  }
  .circle {
    border-radius: 8px;
    overflow: hidden;
  }
}
.light {
  border-color: #dcdfe6;
  color: #606266;
  i {
    color: #606266;
  }
}
</style>
