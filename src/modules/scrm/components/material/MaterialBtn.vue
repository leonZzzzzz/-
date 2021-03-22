<!--从素材库中选择弹窗组件-->
<!--
  【引入示例】
  import MaterialBtn from '../../../components/material/MaterialBtn'

  【使用示例】
   <material-btn :isType='isType' @success="materialSuccess"></material-btn>

  【属性】
  参数         类型                说明                          可选值           默认值
  isType     String            传给组件的文件类型                  --               text
                           具体参考【属性说明】

  【属性说明】
  参数                     示例
  isType                  image/image_text/program
  【方法】
  方法名           类型                说明                         参数
  success     function(val){}        点击弹窗确认按钮              val，选择后的整条素材数据


  //注1:改弹窗只有三种类型,后续将继续增加(嫌少的可以自己去加)
  //注2:此组件灵活性差,不适合的可以自己写多一个
     -->

<template>
  <div>
    <el-button type="primary" size="small" icon="el-icon-folder-opened" @click="openMaterial"
      >&nbsp;&nbsp;从素材库中选择&nbsp;&nbsp;</el-button
    >
    <com-dialog :config="showMaterial.config" @closeDialog="closeMaterial">
      <div class="menu-div">
        <ul>
          <li
            v-for="(item, index) in menu"
            :key="index"
            @click="chooseMenuItem(index, item.type)"
            :class="ItemIndex == index ? 'active' : ''"
          >
            <i :class="item.icon"></i><span>{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <div class="menu-select">
        <el-select size="small" v-model="selectedGroupID" placeholder="请选择" @change="selectTextChange()" clearable>
          <el-option v-for="item in menuTableData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <el-input
          style="width: 200px; margin-left: 20px"
          size="small"
          v-model="selectTextName"
          @input="getMaterialPage(selectedGroupID, selectTextName)"
          placeholder="请输入素材名称、关键字"
          clearable
        ></el-input>
      </div>
      <div class="menu-table">
        <com-table :tableData="tableData" :column="column" :isFull="false" :height="500"></com-table>
      </div>
      <div class="menu-compination">
        <span>共 {{ page.total }} 条数据</span>
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-sizes="[15, 30, 50]"
          :page-size="page.pageSize"
          :current-page="page.pageNum"
          :total="page.total"
          layout="prev, pager, next, sizes"
          background
          style="margin-right: -26px"
        >
        </el-pagination>
      </div>
      <div class="menu-btn">
        <div>
          <el-button @click="closeMaterial">取消</el-button>
          <el-button type="primary" @click="changeRow">确定</el-button>
        </div>
      </div>
    </com-dialog>

    <com-dialog :config="showImage.config" @closeDialog="closeImage">
      <div style="max-height: 600px; overflow-y: auto">
        <el-image v-if="showImageSrc" :src="showImageSrc" style="width: 100%"></el-image>
        <div style="">{{ showText }}</div>
      </div>
      <div style="display: flex">
        <el-button style="margin-left: auto; margin-top: 15px" type="primary" @click="closeImage">确定</el-button>
      </div>
    </com-dialog>
  </div>
</template>

<script>
import ComDialog from '../common/ComDialog'
import ComTable from '../common/ComTable'
export default {
  props: {
    isFull: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    height: {
      type: Number,
      default: () => {
        return 500
      }
    },
    isType: {
      type: String,
      default: () => {
        return 'image_text'
      }
    }
  },
  components: { ComDialog, ComTable },
  data() {
    return {
      //存储分页数据
      page: {
        pageSize: 15,
        pageNum: 1,
        total: 0
      },
      //存储弹窗的数据
      showMaterial: {
        config: {
          width: '1200px',
          title: '选择素材',
          visible: false
        }
      },
      //存储弹窗的数据
      showImage: {
        config: {
          width: '800px',
          title: '查看图片',
          visible: false
        }
      },
      //顶部切换菜单的选项
      menu: [
        // { type: 'text', value: '文字', icon: 'el-icon-edit' },
        // { type: 'image', value: '图片', icon: 'el-icon-picture-outline' },
        { type: 'image_text', value: '单图文', icon: 'el-icon-link' },
        { type: 'numerous_image_text', value: '多图文', icon: 'el-icon-link' }
        // { type: 'program', value: '小程序', icon: 'el-icon-chat-round' }
      ],
      ItemIndex: 0,
      tableData: [], //存储获取到的列表数据
      menuTableData: [], //存储获取到的第一分组数据
      ItemType: 'image', //存储点击时候的类型
      selectedGroupID: '', // 存储选择素材分组的id
      selectTextName: '', //存储搜索的素材名称
      column: [], //文件类型列数据
      fullHeight: 500, //表格的高度
      showImageSrc: '', //存储查看图片弹窗的链接
      showText: '', // 存储查看文字弹窗的文字
      // selectId: '',
      selectRow: {},
      //文件类型的每列数据
      imageColumn: [
        {
          label: '素材名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '素材内容',
          minWidth: '150px',
          align: 'center',
          prop: 'imageUrl',
          formatter: row => {
            return (
              <div>
                <el-image
                  style="width:100px;height:100px"
                  src={this.imgHost + row.imageUrl}
                  onClick={this.showImgCom.bind(this, row.imageUrl)}
                ></el-image>
              </div>
            )
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      //图文类型列数据
      imageTextColumn: [
        {
          label: '封面',
          minWidth: '150px',
          align: 'center',
          prop: 'imageUrl',
          formatter: row => {
            return (
              <div>
                <el-image
                  style="width:100px;height:100px"
                  onClick={this.showImgCom.bind(this, row.imageUrl)}
                  src={this.imgHost + row.imageUrl}
                ></el-image>
              </div>
            )
          }
        },
        {
          label: '图文名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '图文链接',
          minWidth: '150px',
          align: 'center',
          prop: 'link',
          formatter: row => {
            return (
              <div>
                <a style="color: #294a7b;" href={row.link} target="_blank">
                  {row.link}
                </a>
              </div>
            )
          }
        },
        {
          label: '图文摘要',
          minWidth: '150px',
          align: 'center',

          formatter: row => {
            return (
              <div>
                {(row.content && row.content.length) > 100 ? (
                  <div>
                    {row.content.slice(0, 100) + '...'}
                    <el-button type="text" onClick={this.showTextDetailDialog.bind(this, row.content)}>
                      详情
                    </el-button>
                  </div>
                ) : (
                  row.content
                )}
              </div>
            )
          }
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button style="color:red" type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      //图文类型列数据
      imageMoreTextColumn: [
        {
          label: '封面',
          minWidth: '150px',
          align: 'center',
          prop: 'imageUrl',
          formatter: row => {
            return (
              <div>
                <el-image
                  style="width:100px;height:100px"
                  onClick={this.showImgCom.bind(this, row.imageUrl)}
                  src={this.imgHost + row.imageUrl}
                ></el-image>
              </div>
            )
          }
        },
        {
          label: '图文名称',
          minWidth: '150px',
          align: 'center',
          prop: 'name'
        },
        {
          label: '图文链接',
          minWidth: '150px',
          align: 'center',
          prop: 'link',
          formatter: row => {
            return (
              <div>
                <a style="color: #294a7b;" href={row.link} target="_blank">
                  {row.link}
                </a>
              </div>
            )
          }
        },
        {
          label: '图文摘要',
          minWidth: '150px',
          align: 'center',

          formatter: row => {
            return (
              <div>
                {(row.content && row.content.length) > 100 ? (
                  <div>
                    {row.content.slice(0, 100) + '...'}
                    <el-button type="text" onClick={this.showTextDetailDialog.bind(this, row.content)}>
                      详情
                    </el-button>
                  </div>
                ) : (
                  row.content
                )}
              </div>
            )
          }
        },
        {
          label: '创建时间',
          minWidth: '150px',
          align: 'center',
          prop: 'createTime'
        },
        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button style="color:red" type="text" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ],
      //小程序类型列数据
      programColumn: [
        {
          label: '名称',
          align: 'center',
          prop: 'name'
        },
        {
          label: 'ID',
          align: 'center',
          prop: 'programId'
        },
        {
          label: '链接',
          align: 'center',
          prop: 'link'
        },
        {
          label: '封面',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <img
                src={this.imgHost + row.imageUrl}
                onClick={this.showImgCom.bind(this, row.imageUrl)}
                style="width:80px;height:80px;"
                alt=""
              />
            )
          }
        },
        {
          label: '分类',
          minWidth: '150px',
          align: 'center',
          prop: 'groupName'
        },
        {
          label: '操作',
          align: 'center',
          formatter: (row, column, cellValue, index) => {
            return (
              <div>
                {row.selected ? (
                  <el-button type="text" style="color:red" onClick={this.cancelSelected.bind(this, row)}>
                    取消
                  </el-button>
                ) : (
                  <el-button type="text" onClick={this.confirmSelected.bind(this, row, index)}>
                    选择
                  </el-button>
                )}
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    //方法部分

    //点击选择素材的确认按钮
    changeRow() {
      if (this.selectRow.id) {
        console.log(this.selectRow)
        if (this.selectRow.type === 'numerous_image_text') {
          this.$http.getLinkandCode({ id: this.selectRow.id }).then(res => {
            let link = res.data.data.link
            console.log(link)
            this.$set(this.selectRow, 'link', link)
          })
        }
        console.log('传出去的参数', this.selectRow)
        setTimeout(() => {
          this.$emit('success', this.selectRow)
        }, 100)

        this.closeMaterial()
      } else {
        this.$message.warning('请选择素材')
      }
    },
    //字数过多,点击详情按钮事件
    showTextDetailDialog(content) {
      this.showText = content
      this.showImage.config.visible = true
    },
    //点击操作列取消的按钮
    cancelSelected() {
      this.tableData.forEach(item => {
        this.$set(item, 'selected', false)
      })
      this.selectRow = {}
    },

    //点击操作列选择的按钮
    confirmSelected(row, index) {
      this.tableData.forEach(item => {
        this.$set(item, 'selected', false)
      })
      this.$set(this.tableData[index], 'selected', true)
      this.selectRow = row
    },
    //点击列表图片的点击事件
    showImgCom(src) {
      this.showImage.config.visible = true
      this.showImageSrc = this.imgHost + src
    },
    //关闭查看图片弹窗
    closeImage() {
      this.showImage.config.visible = false
      this.showImageSrc = ''
    },
    //分页尺寸改变
    onSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      if (this.ItemType != 'numerous_image_text') {
        this.getMaterialPage(this.selectedGroupID, this.selectTextName)
      } else {
        this.numMoregraphic(this.selectedGroupID, this.selectTextName)
      }
      this.selectRow = {}
    },
    //分页页数改变
    onPageChange(val) {
      this.page.pageNum = val
      if (this.ItemType != 'numerous_image_text') {
        this.getMaterialPage(this.selectedGroupID, this.selectTextName)
      } else {
        this.numMoregraphic(this.selectedGroupID, this.selectTextName)
      }
      this.selectRow = {}
    },
    //点击从素材库中选择的按钮
    openMaterial() {
      this.ItemType = this.isType
      this.selectRow = {}
      if (this.ItemType == 'image') {
        this.ItemIndex = 0
      }
      if (this.ItemType == 'image_text' || this.ItemType == 'numerous_image_text') {
        this.ItemType = 'image_text'
        // this.ItemIndex = 1
        this.ItemIndex = 0
      }
      if (this.ItemType == 'program') {
        this.ItemIndex = 3
      }

      this.showMaterial.config.visible = true
      this.page = {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
      this.selectTextName = ''
      this.selectedGroupID = ''
      this.getMaterialGroups()
    },
    //关闭选择素材弹窗
    closeMaterial() {
      this.showMaterial.config.visible = false
      this.page = {
        pageNum: 1,
        pageSize: 15,
        total: 0
      }
    },
    //选择菜单上的某一项
    chooseMenuItem(index, type) {
      this.selectedGroupID = ''
      this.ItemIndex = index
      this.ItemType = type
      this.page.pageNum = 1
      this.page.pageSize = 15
      this.page.total = 0
      this.selectTextName = ''
      this.selectRow = {}
      this.getMaterialGroups()

      // this.getMaterialPage()
    },
    //选择素材分组回调事件
    selectTextChange() {
      // this.selectTextName = ''
      this.getMaterialPage(this.selectedGroupID, this.selectTextName)
    },

    fullTableHeight() {
      const TOP_HEADER_HEIGHT = 60,
        PAGINATION_HEIGHT = 52,
        PADDING_BOTTOM_HEIGHT = 20,
        PADDING_TOP_HEIGHT = 20
      this.fullHeight =
        window.innerHeight -
        document.querySelector('#table').offsetTop -
        TOP_HEADER_HEIGHT -
        PAGINATION_HEIGHT -
        PADDING_BOTTOM_HEIGHT -
        PADDING_TOP_HEIGHT
    },
    //方法结束
    //接口部分
    //获取素材分组列表
    getMaterialGroups() {
      this.menuTableData = []
      let type = this.ItemType
      let params = {
        pageNum: 1,
        pageSize: 999,
        type: type
      }
      this.$http.getMaterialGroups(params).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          if (item.series == 1) {
            this.menuTableData.push(item)
          }
        })
        if (this.ItemType != 'numerous_image_text') {
          this.getMaterialPage()
        } else {
          this.numMoregraphic()
        }
      })
    },
    getMaterialPage(groupId, name) {
      this.tableData = []
      let type = this.ItemType
      if (type === 'image') {
        this.column = this.imageColumn
      } else if (type === 'image_text') {
        this.column = this.imageTextColumn
      } else if (type === 'program') {
        // console.log('')
        this.column = this.programColumn
      } else if (type === 'numerous_image_text') {
        this.column = this.imageMoreTextColumn
      }
      let params = {
        type: type,
        groupId: groupId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: name
      }
      this.$http.getMaterialPage(params).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          this.$set(item, 'selected', false)
        })
        this.tableData = list
        this.page.total = res.data.data.total
        console.log(this.tableData)
      })
    },
    numMoregraphic(groupId, name) {
      this.tableData = []
      let type = this.ItemType
      if (type === 'image') {
        this.column = this.imageColumn
      } else if (type === 'image_text') {
        this.column = this.imageTextColumn
      } else if (type === 'program') {
        // console.log('')
        this.column = this.programColumn
      } else if (type === 'numerous_image_text') {
        this.column = this.imageMoreTextColumn
      }
      let params = {
        type: type,
        groupId: groupId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        name: name
      }
      this.$http.numMoregraphic(params).then(res => {
        let list = res.data.data.list
        list.forEach(item => {
          this.$set(item, 'selected', false)
        })
        this.tableData = list
        this.page.total = res.data.data.total
        console.log(this.tableData)
      })
    }
    //接口结束
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isFull) {
        this.fullTableHeight()
        window.onresize = () => {
          this.fullTableHeight()
        }
      }
    })
  },
  destroyed() {
    window.onresize = ''
  }
}
</script>

<style lang="scss" scoped>
.menu-div {
  ul {
    width: 100%;
    display: flex;
    li {
      flex: 1;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
  }
}
.menu-select {
  display: flex;
  margin: 20px 0;
}
// .menu-table {
//   border: 1px solid red;
// }
.active {
  color: #294a7b;
}
.menu-compination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
}
.menu-btn {
  display: flex;
  div {
    margin-left: auto;
  }
}
</style>
