<template>
  <div class="addlivecode">
    <!-- 啦啦啦啦啦啦 -->
    <div class="moban"></div>
    <div class="container">
      <div class="top_search">
        <div class="operating-btn">
          <el-button size="small" type="primary" @click="openAddLiveCode">新建活码</el-button>
          <!-- <el-button size="small" type="primary" @click="downloadAll">批量下载</el-button> -->
          <el-button size="small" type="primary" @click="down">批量下载</el-button>
        </div>
        <div class="search">
          <el-form inline :model="searchForm" label-width="100px" label-position="right" size="small">
            <el-form-item label="活码名称">
              <el-input
                placeholder="请输入活码名称"
                v-model="searchForm.name"
                @input="searchLiveCodeList"
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="关联人员">
            <el-input placeholder="请输入关联人员" v-model="searchForm.userName"></el-input>
          </el-form-item> -->

            <!-- <el-form-item>
              <el-button size="small" type="primary" @click="searchLiveCodeList">查询</el-button>
              <el-button size="small" type="info" @click="reLiveCodeSearch">重置</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="common-table-box">
        <el-table
          :data="tableData"
          width="100%"
          id="table"
          class="el-table"
          :cell-style="changeCellStyle"
          :header-cell-style="{ 'text-align': 'center', 'background-color': '#ebeef5', color: '#333333' }"
          :height="height"
          @cell-mouse-enter="isOverflow"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column label="二维码" align="center">
            <template slot-scope="scope" v-if="scope.row.qrcodeUrl">
              <el-image class="common-table-image" :src="scope.row.qrcodeUrl" :preview-src-list="[scope.row.qrcodeUrl]">
              </el-image>
              <!-- <el-image
                v-for="img in scope.row.qrcodeUrl.split(',')"
                :key="img"
                class="common-table-image"
                :src="scope.row.qrcodeUrl"
                :preview-src-list="scope.row.qrcodeUrl.split(',').map((img) => img)"
              ></el-image> -->
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="left"> </el-table-column>
          <el-table-column label="成员" align="center" class="special-column">
            <template slot-scope="scope">
              <div class="tagname-form">
                <!-- <span class="tagName" v-for="(item, index) in scope.row.userList" :key="index"
                  ><i class="el-icon-user-solid icon-user"></i>{{ item.userName }}</span
                > -->
                <Tag type="light" v-for="(item, index) in scope.row.userList" :key="index">{{ item.userName }}</Tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="添加人数" prop="customerQuantity" align="center">
            <template slot-scope="scope">
              <div>
                {{ scope.row.customerQuantity ? scope.row.customerQuantity : 0 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="行为标签" align="center">
            <template slot-scope="scope">
              <div class="tagList tagname-form">
                <Tag
                  type="light"
                  icon="el-icon-price-tag"
                  v-for="(item, index) in scope.row.behaviorTagList"
                  :key="index"
                  >{{ item.name | isEllipse }}</Tag
                >
                <!-- <span v-for="(item, index) in scope.row.behaviorTagList" :key="index">{{ item.name }}</span> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class="caozuo-column">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="goDetailsList(scope.row.id)">详情</el-button>
                <el-button type="text" @click="downloadImage(scope.row.qrcodeUrl, scope.row.name, scope.row.userList)"
                  >下载</el-button
                >
                <el-popover
                  placement="bottom"
                  width="70"
                  trigger="hover"
                  popper-class="myPopover"
                  style="margin-left: 10px"
                >
                  <div class="popover_btns">
                    <!-- <el-button v-if="scope.row.isEnabled == false" type="text" @click="openUsing(scope.row)"
                      >启用</el-button
                    >
                    <el-button v-if="scope.row.isEnabled == true" type="text" @click="stopLiveCode(scope.row)"
                      >停用</el-button
                    > -->
                    <el-button type="text" @click="showEditDialog(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteCodeFun(scope.row.id)">删除</el-button>
                  </div>
                  <el-button slot="reference" type="text">更多</el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-pagination">
        <com-pagination :page="page" @sizeChange="onSizeChange" @pageChange="onPageChange"></com-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// import ComTable from '../../../components/common/ComTable'
import ComPagination from '../../../components/common/ComPagination'
import api from '../../../api/operation-management'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import Tag from '../../../components/components/Tag'
import html2canvas from 'html2canvas'

export default {
  components: { ComPagination, Tag },
  data() {
    return {
      searchForm: {
        userName: '',
        name: ''
      },

      page: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      genderOptions: [
        { label: '全部', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ],
      tagList: [],
      groupList: [],
      tableData: [],
      height: 400,
      imageUrl: '',
      qrcodeList: '', //存储选中的数据
      qrcodeUrlList: [],
      qrcodeNameList: [],
      downFileName: '',
      downImageList: [],
      QrCodeImg: ''
    }
  },
  created() {
    // 如时扫码登陆的会获取到auth_code
    // if(this.$route.query.auth_code){
    //   this.$http.SendAutncode({code:this.$route.query.auth_code}).then(res=>{

    //   })
    // }

    // console.log(example);
    this.getLiveCode()
  },
  mounted() {
    this.$nextTick(() => {
      this.fullTableHeight()
    })
  },
  activated() {
    // keep-alive专属生命周期
    // 开启keep-alive时每次进入页面都会触发，而created只会在第一次进入时触发
    this.getLiveCode()
  },
  filters: {
    isEllipse(options) {
      if (options.length >= 14) {
        return options.substring(0, 12) + '...'
      } else {
        return options
      }
    }
  },
  methods: {
    //点击批量下载按钮
    async down() {
      if (this.qrcodeList.length == 0) {
        this.$message.warning('请选择需要下载的二维码')
        return
      }
      if (this.qrcodeList.length == 1) {
        this.qrcodeList.forEach(item => {
          this.downloadImage(item.qrcodeUrl, item.name, item.userList)
        })
        return
      }

      this.qrcodeUrlList = [] //存储选中的url的数组
      this.qrcodeNameList = [] //存储选中的二维码的名称
      let userName = []
      let userNameList = []
      this.downImageName = '' //下载后的图片名称
      let userList = []
      //循环遍历table表格选中的渠道活码信息
      this.qrcodeList.forEach((item, index) => {
        //判断图片链接是不是为空
        if (item.qrcodeUrl) {
          //不为空就放到url数组中
          this.qrcodeUrlList.push(item.qrcodeUrl)
          //判断如果活码的关联人员
          //人员为1直接将人员名称等于图片名称
          if (item.userList.length == 1) {
            this.downImageName = item.userList[0].userName
          }
          //人员为2就将第1人和第2人的名称合并并且等于图片名称
          if (item.userList.length == 2) {
            this.downImageName = item.userList[0].userName + '-' + item.userList[1].userName
          }
          //人员为3或者大于3就将前三个人的名称合并并且等于图片名称
          if (item.userList.length >= 3) {
            this.downImageName =
              item.userList[0].userName + '-' + item.userList[1].userName + '-' + item.userList[2].userName
          }
          //判断如果活码的名称里边要是含有字符'.'的，有的话就替换成空格
          if (item.name.includes('.')) {
            item.name = item.name.replace('.', '')
          }
          //最后拼接，数组为，每个下载后的图片名称 = 序号 + 活码名称 + 活码关脸人员
          this.qrcodeNameList.push(index + 1 + '_' + item.name + '-' + this.downImageName)
        }
      })
      //这是打包的方法JSZip
      try {
        let zip = new JSZip()
        let imgs = zip.folder('渠道活码')
        for (let i = 0; i < this.qrcodeUrlList.length; i++) {
          let lst = this.qrcodeUrlList[i].split(',')
          let fileType = lst[lst.length - 1]
          await this.getBase64Image(this.qrcodeUrlList[i]).then(res => {
            imgs.file(this.qrcodeNameList[i] + '.png', res, { base64: true })
          })
        }
        this.downImg(zip)
      } catch (err) {
        this.$message.warning('下载失败')
      }
    },
    downImg(zip) {
      zip
        .generateAsync({
          type: 'blob'
        })
        .then(content => {
          let fileName = '渠道活码.zip'
          FileSaver.saveAs(content, fileName)
        })
    },
    //****传入图片链接，返回base64数据
    getBase64Image(url) {
      return new Promise((resolve, reject) => {
        var base64 = ''
        var img = new Image()
        img.setAttribute('crossOrigin', 'Anonymous')
        img.onload = () => {
          base64 = this.image2Base64(img)
          resolve(base64.split(',')[1])
        }
        img.onerror = () => reject('加载失败') // 这里可能会有跨域失败的问题，解决方案同上，url + 随机数
        img.src = url
      })
    },
    image2Base64(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var dataURL = canvas.toDataURL('image/png')
      return dataURL
    },

    // downImg() {
    //   var blogTitle = '渠道活码'
    //   var zip = new JSZip()
    //   var imgs = zip.folder(blogTitle)
    //   var baseList = []
    //   // 要下载图片的url
    //   var arr = this.qrcodeUrlList
    //   // 下载后图片的文件名，个数应与arr对应
    //   var imgNameList = this.qrcodeNameList
    //   for (var i = 0; i < arr.length; i++) {
    //     let image = new Image()
    //     // 解决跨域 Canvas 污染问题
    //     image.setAttribute('crossOrigin', 'anonymous')
    //     image.onload = function() {
    //       let canvas = document.createElement('canvas')
    //       canvas.width = image.width
    //       canvas.height = image.height
    //       let context = canvas.getContext('2d')
    //       context.drawImage(image, 0, 0, image.width, image.height)
    //       let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
    //       baseList.push(url.substring(22)) // 去掉base64编码前的 data:image/png;base64,
    //       if (baseList.length === arr.length && baseList.length > 0) {
    //         for (let k = 0; k < baseList.length; k++) {
    //           imgs.file(imgNameList[k] + '.png', baseList[k], { base64: true })
    //         }
    //         zip.generateAsync({ type: 'blob' }).then(function(content) {
    //           FileSaver.saveAs(content, blogTitle + '.zip')
    //         })
    //       }
    //     }
    //     image.src = arr[i]
    //   }
    // },

    //点击批量下载按钮
    // downloadAll() {
    //   if (this.qrcodeList.length == 0) {
    //     this.$message.warning('请选择需要下载的二维码')
    //     return
    //   }
    //   if (this.qrcodeList.length == 1) {
    //     this.qrcodeList.forEach(item => {
    //       this.downloadImage(item.qrcodeUrl, item.name, item.userList)
    //     })
    //     return
    //   }
    //   this.qrcodeUrlList = []
    //   this.qrcodeNameList = []
    //   let userName = []
    //   let userNameList = []
    //   this.downImageName = ''
    //   let userList = []
    //   this.qrcodeList.forEach((item, index) => {
    //     if (item.qrcodeUrl) {
    //       this.qrcodeUrlList.push(item.qrcodeUrl)
    //       // this.qrcodeUrlList.push({ qrcodeUrl: item.qrcodeUrl, class: 'moban' })
    //       if (item.userList.length == 1) {
    //         this.downImageName = item.userList[0].userName
    //       }
    //       if (item.userList.length == 2) {
    //         this.downImageName = item.userList[0].userName + '-' + item.userList[1].userName
    //       }
    //       if (item.userList.length >= 3) {
    //         this.downImageName =
    //           item.userList[0].userName + '-' + item.userList[1].userName + '-' + item.userList[2].userName
    //       }
    //       this.qrcodeNameList.push(index + 1 + '_' + item.name + '-' + this.downImageName)
    //     }
    //   })

    //   this.downImg()
    //   // this.drawCanvas(this.qrcodeUrlList)
    // },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id
    },
    //选择改变的
    handleSelectionChange(val) {
      this.qrcodeList = val
    },
    getLiveCode() {
      let params = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: this.searchForm.name,
        userName: this.searchForm.userName
      }
      api.liveCodePage(params).then(res => {
        // console.log(res.data.data.list)
        this.tableData = res.data.data.list
        this.page.total = res.data.data.total
      })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getLiveCode()
    },
    onPageChange(val) {
      this.page.pageNum = val
      this.getLiveCode()
    },
    //点击查询按钮
    searchLiveCodeList() {
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getLiveCode()
    },
    //点击重置按钮
    reLiveCodeSearch() {
      this.searchForm.name = ''
      this.searchForm.userName = ''
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.getLiveCode()
    },
    // 删除渠道活码
    deleteCodeFun(id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.deleteLiveCode({ id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getLiveCode()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    changeCellStyle(row) {
      if (row.column.label === '关联人员') {
        return 'overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;  ' // 修改的样式
      } else {
        return ''
      }
    },
    showEditDialog(row) {
      this.$openNewPage({
        path: `/main/scrm/operation-management/addlivecode/editform?id=` + row.id
      }) // 在新窗口打开
      // this.$router.push(`/main/scrm/operation-management/addlivecode/editform?id=` + row.id)
    },
    openAddLiveCode() {
      this.$openNewPage({
        path: '/main/scrm/operation-management/addlivecode/form'
      }) // 在新窗口打开
      // this.$router.push('/main/scrm/operation-management/addlivecode/form')
    },
    goDetailsList(id) {
      this.$openNewPage({
        path: '/main/scrm/operation-management/addlivecode/detailslist',
        query: {
          id
        }
      }) // 在新窗口打开
      // this.$router.push({
      //   path: '/main/scrm/operation-management/addlivecode/detailslist',
      //   query: {
      //     id
      //   }
      // })
    },
    downloadImage(imagrUrl, name, list) {
      if (imagrUrl == undefined) {
        this.$message.warning('该图片为空')
        return
      }
      let userName = ''
      let userList = []
      if (list) {
        list.forEach(item => {
          userList.push(item.userName)
        })
        if (list.length >= 2) {
          userList = userList.splice(0, 3)
          userName = userList.join('-')
        }
        if (list.length == 1) {
          userName = userList.join('-')
        }
      }
      if (name.indexOf('.' > -1)) {
        // console.log(name)
        name = name.replace('.', ' ')
      }
      this.imageUrl = imagrUrl

      let image = new Image()

      // image.crossOrigin = 'anonymous'
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = this.imageUrl

      console.log('onload外边')
      image.onload = function () {
        console.log('onload进来了')
        let canvas = document.createElement('canvas')
        console.log('onload进来了1')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height) //创建一个画布
        let url = canvas.toDataURL('image/png') //得到图片的base64编码
        let a = document.createElement('a') //生成一个a元素
        let event = new MouseEvent('click') //创建一个点击事件
        a.download = name + '-' + userName || '二维码图片' //设置下载后图片的名称
        a.href = url //将生成的url设置位 a.href
        a.dispatchEvent(event) //出发a的单击事件
        console.log('onload进来了2')
      }
      console.log('onload出来了')

      this.$message.success('二位码下载成功')
    },
    stopLiveCode(row) {
      let list = {
        id: row.id,
        isEnabled: false
      }
      this.$confirm('是否停用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          list.isEnabled = false
          api.stopLiveCode(list).then(() => {
            this.$message.success('停用成功')
            this.getLiveCode()
          })
        })
        .catch(() => {
          return
        })
    },
    openUsing(row) {
      let list = {
        id: row.id,
        isEnabled: true
      }
      this.$confirm('是否停用？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          list.isEnabled = true
          api.stopLiveCode(list).then(() => {
            this.$message.success('启用成功')
            this.getLiveCode()
          })
        })
        .catch(() => {
          return
        })
    },
    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.height =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    // fo
    // 判断表格是否溢出
    isOverflow(row, column, cell, event) {
      // console.log(row);
      if (column.label == '成员') {
        // console.log(cell)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.addlivecode {
  width: 100%;
  height: 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.query-table-box {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.common-table-box {
  padding: 0 20px;
  box-sizing: border-box;
  .tagList {
    span {
      display: inline-block;
      padding: 2px 5px;
      margin: 5px;
      border: 1px solid #f2f2f2;
      border-radius: 3px;
      background-color: #f2f2f2;
    }
  }
}
.common-pagination {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.tagName {
  display: inline-block;
  border: 1px solid #dcdfe6;
  padding: 2px 5px;
  cursor: pointer;
  margin: 8px 8px 7px 0;
  margin-right: 8px;
  margin-bottom: 7px;
  border-radius: 3px;
}
.icon-user {
  color: #294a7b;
}
.special-column {
  max-height: 200px;
  // width: 200px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.common-table-image {
  width: 50px;
  height: 50px;
}
.tagname-form {
  min-height: 60px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
::v-deep .special-column {
  width: 200px;
}
// fo
.top_search {
  padding: 20px;
  display: flex;
  .search {
    margin-left: auto;
    &::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
<style lang="scss">
.myPopover {
  min-width: 70px;
  .popover_btns {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .el-button {
      margin-left: 0;
    }
  }
}
</style>
