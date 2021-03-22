<template>
  <!-- 手机展示效果 xfo-->
  <div>
    <div class="phone-effect">
      <div class="bgimg">
        <img :src="bgImage" alt="" />
      </div>
      <div class="content">
        <div class="infomation" v-if="message">
          <div class="logo">
            <el-avatar
              size="small"
              shape="square"
              src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            ></el-avatar>
          </div>
          <div class="info" v-html="parsingEmoji(message)"></div>
        </div>
        <div class="infomation" v-if="imageUrl">
          <div class="logo">
            <el-avatar
              size="small"
              shape="square"
              src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            ></el-avatar>
          </div>
          <div class="info">
            <img style="width: 100%" :src="imageUrl ? imgHost + imageUrl : ''" alt="" />
          </div>
        </div>
        <div class="infomation" v-if="imageText.name">
          <div class="logo">
            <el-avatar
              size="small"
              shape="square"
              src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            ></el-avatar>
          </div>
          <div class="info">
            <div class="image-text">
              <div class="text">
                <p class="title">{{ imageText.name }}</p>
                <p class="it-content">{{ imageText.content }}</p>
              </div>
              <div class="image">
                <el-image
                  style="width: 50px; height: 50px"
                  fit="cover"
                  :src="imageText.imageUrl ? imgHost + imageText.imageUrl : ''"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </div>
        </div>
        <div class="infomation" v-if="program.id">
          <div class="logo">
            <el-avatar
              size="small"
              shape="square"
              src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            ></el-avatar>
          </div>
          <div class="info">
            <div class="program">
              <div class="avatar">
                <el-image
                  style="width: 50px; height: 50px"
                  fit="cover"
                  :src="program.logo ? imgHost + program.logo : ''"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="program-content">
                {{ program.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let imageTextObject = {
  name: '',
  content: '',
  imageUrl: ''
}
let programObject = {}
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imageText: {
      type: Object,
      default: () => {
        return imageTextObject
      }
    },
    program: {
      type: Object,
      default: () => {
        return programObject
      }
    }
  },
  data() {
    return {
      bgImage: require('../../images/groupsendMobile.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-effect {
  width: 300px;
  position: relative;
  .bgimg {
    width: 300px;
    img {
      width: 300px;
    }
  }
  .content {
    width: 255px;
    height: 390px;
    position: absolute;
    top: 100px;
    left: 20px;
    padding: 1px 10px 10px;
    box-sizing: border-box;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }
    .infomation {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      .logo {
      }
      .info {
        flex: 1;
        background-color: #ffffff;
        border-radius: 4px;
        margin-left: 16px;
        position: relative;
        padding: 10px;
        color: #606266;
        font-size: 12px;
        line-height: 1.5em;
        box-sizing: border-box;
        word-break: break-all;
        &::before {
          content: '';
          display: block;
          width: 0;
          height: 0;
          border: 10px solid;
          border-color: transparent #ffffff transparent transparent;
          position: absolute;
          top: 3px;
          left: -20px;
        }
        .image-text {
          display: flex;
          .text {
            flex: 1;
            max-width: 110px;
            margin-right: auto;
            .title {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .it-content {
              color: #c0c4cc;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          ::v-deep .image-slot {
            width: 50px;
            height: 50px;
            background-color: #f4f4f5;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .program {
          display: flex;
          height: 50px;
          overflow: hidden;
          .program-content {
            color: #606266;
            font-size: 14px;
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>
