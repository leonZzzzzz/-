<template>
  <div
    class="department"
    ref="table"
  >
    <div class="top">
      <div class="search">
        <div class="search_content">
          <div class="inp">
            <el-input
              v-model="searchData.name"
              placeholder="搜索海报素材"
              clearable
              size="small"
              @input="searchByUserName"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="all">{{ groupName }}（{{ pageData.total }}）</div>
      <div class="reload">
        <el-button
          type="primary"
          @click="addPoater"
          size="small"
        ><i class="el-icon-plus"></i>添加海报</el-button>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <el-tree
          class="myTree"
          :data="data"
          node-key="deptId"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :default-expanded-keys="[1]"
          @node-click="handleNodeClick"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
          >
            <div class="custom-tree-node-wrapper">
              <span class="custom-tree-node-label">{{ node.label }}</span>
              <span
                class="operate-btns"
                v-if="data.superiorId"
              >
                <el-dropdown
                  trigger="click"
                  class="custom-tree-menu"
                  size="small"
                >
                  <i class="el-icon-more rotate" />
                  <el-dropdown-menu
                    slot="dropdown"
                    v-if="data.series == '1' || data.series == '2'"
                  >
                    <el-dropdown-item
                      v-for="(item, index) in dropMenuEvents"
                      :key="index"
                      :divided="index > 0"
                      @click.native="clickMenu(item, node, data)"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                  <el-dropdown-menu
                    slot="dropdown"
                    v-else
                  >
                    <el-dropdown-item
                      v-for="(item, index) in dropMenuSonEvents"
                      :key="index"
                      :divided="index > 0"
                      @click.native="clickMenu(item, node, data)"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </span>
        </el-tree>
        <el-button
          type="primary"
          size="small"
          style="width: 190px; margin-top: 30px"
          @click="addone"
        ><i class="el-icon-plus"></i>新增分类</el-button>
      </div>
      <div class="right">
        <div class="checkall">
          <el-checkbox
            v-model="checkAll"
            @change="allChange"
          >全选</el-checkbox>
          <span
            style="margin-left: 30px"
            v-if="isIndeterminate"
          >
            <el-popover
              title="选择分组"
              v-model="visible"
              placement="bottom"
              width="400"
              trigger="click"
              style="margin-right: 10px"
            >
              <el-cascader
                :options="data"
                :props="{ value: 'id', label: 'name', children: 'childs' }"
                :show-all-levels="true"
                v-model="groupId"
                style="width: 400px; margin-top: 20px"
                @change="changeCascader"
                ref="elcascader"
                @visible-change="elCascaderOnlick"
                @expand-change="elCascaderOnlick"
                clearable
              ></el-cascader>
              <div style="margin-top: 20px; text-align: right">
                <span
                  style="margin-right: 20px"
                  @click="visible = false"
                >取消</span>
                <span @click="confirmMove">确定</span>
              </div>
              <el-button
                slot="reference"
                size="small"
              >移动分组</el-button>
            </el-popover>
            <el-button
              @click="batchDel"
              size="small"
            >删除</el-button>
          </span>
          <span
            style="margin-left: 30px"
            v-else
          >
            <el-button
              disabled
              size="small"
            >移动分组</el-button>
            <el-button
              disabled
              size="small"
            >删除</el-button>
          </span>
        </div>
        <div
          id="table"
          ref="table"
          :style="{
            height: height + 'px',
            width: '100%',
            overflow: 'auto',
            background: '#fff',
            display: 'flex',
            paddingTop: '30px'
          }"
        >
          <div
            v-if="lista.length > 0"
            class="flexbox"
          >
            <div
              class="contentbox"
              v-for="(item, i) in lista"
              :key="i"
            >
              <!-- <el-image class="pic" :src="item.imageUrl" :preview-src-list="item.srcList"></el-image> -->
              <!-- <el-image class="pic" :src="qzUrl+item.link" ></el-image> -->
              <img
                class="pic"
                :src="qzUrl + item.link"
                alt=""
              />
              <el-checkbox-group
                v-model="checked"
                @change="changeBox"
              >
                <el-checkbox
                  class="check"
                  :label="item.id"
                  autocomplete="off"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div class="boxbtns">
                <span @click="soldOut(item.id, item.isDisplay)">{{ item.isDisplay ? '下架' : '上架' }}</span>
                <span @click="compile(item.id)">编辑</span>
                <span @click="cancel(item.id)">删除</span>
              </div>
            </div>
          </div>
          <div
            v-if="listb.length > 0"
            class="flexbox"
          >
            <div
              class="contentbox"
              v-for="(item, i) in listb"
              :key="i"
            >
              <!-- <el-image class="pic" :src="item.imageUrl" :preview-src-list="item.srcList"></el-image> -->
              <!-- <el-image class="pic" :src="qzUrl+item.link" ></el-image> -->
              <img
                class="pic"
                :src="qzUrl + item.link"
                alt=""
              />
              <el-checkbox-group
                v-model="checked"
                @change="changeBox"
              >
                <el-checkbox
                  class="check"
                  :label="item.id"
                  autocomplete="off"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div class="boxbtns">
                <span @click="soldOut(item.id, item.isDisplay)">{{ item.isDisplay ? '下架' : '上架' }}</span>
                <span @click="compile(item.id)">编辑</span>
                <span @click="cancel(item.id)">删除</span>
              </div>
            </div>
          </div>
          <div
            v-if="listc.length > 0"
            class="flexbox"
          >
            <div
              class="contentbox"
              v-for="(item, i) in listc"
              :key="i"
            >
              <!-- <el-image class="pic" :src="item.imageUrl" :preview-src-list="item.srcList"></el-image> -->
              <!-- <el-image class="pic" :src="qzUrl+item.link" ></el-image> -->
              <img
                class="pic"
                :src="qzUrl + item.link"
                alt=""
              />
              <el-checkbox-group
                v-model="checked"
                @change="changeBox"
              >
                <el-checkbox
                  class="check"
                  :label="item.id"
                  autocomplete="off"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div class="boxbtns">
                <span @click="soldOut(item.id, item.isDisplay)">{{ item.isDisplay ? '下架' : '上架' }}</span>
                <span @click="compile(item.id)">编辑</span>
                <span @click="cancel(item.id)">删除</span>
              </div>
            </div>
          </div>
          <div
            v-if="listd.length > 0"
            class="flexbox"
          >
            <div
              class="contentbox"
              v-for="(item, i) in listd"
              :key="i"
            >
              <!-- <el-image class="pic" :src="item.imageUrl" :preview-src-list="item.srcList"></el-image> -->
              <!-- <el-image class="pic" :src="qzUrl+item.link" ></el-image> -->
              <img
                class="pic"
                :src="qzUrl + item.link"
                alt=""
              />
              <el-checkbox-group
                v-model="checked"
                @change="changeBox"
              >
                <el-checkbox
                  class="check"
                  :label="item.id"
                  autocomplete="off"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div class="boxbtns">
                <span @click="soldOut(item.id, item.isDisplay)">{{ item.isDisplay ? '下架' : '上架' }}</span>
                <span @click="compile(item.id)">编辑</span>
                <span @click="cancel(item.id)">删除</span>
              </div>
            </div>
          </div>
          <div
            v-if="liste.length > 0"
            class="flexbox"
          >
            <div
              class="contentbox"
              v-for="(item, i) in liste"
              :key="i"
            >
              <!-- <el-image class="pic" :src="item.imageUrl" :preview-src-list="item.srcList"></el-image> -->
              <!-- <el-image class="pic" :src="qzUrl+item.link" ></el-image> -->
              <img
                class="pic"
                :src="qzUrl + item.link"
                alt=""
              />
              <el-checkbox-group
                v-model="checked"
                @change="changeBox"
              >
                <el-checkbox
                  class="check"
                  :label="item.id"
                  autocomplete="off"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div class="boxbtns">
                <span @click="soldOut(item.id, item.isDisplay)">{{ item.isDisplay ? '下架' : '上架' }}</span>
                <span @click="compile(item.id)">编辑</span>
                <span @click="cancel(item.id)">删除</span>
              </div>
            </div>
          </div>
          <div
            v-if="posterlist.length == 0"
            style="text-align: center; padding-top: 100px;margin:0 auto"
          >
            <img
              style="width: 300px"
              src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
            />
          </div>
        </div>
        <div class="page">
          <div class="pagination-count">
            <span class="count">共：{{ pageData.total }}&nbsp;条数据</span>
          </div>
          <el-pagination
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :page-sizes="[20, 30, 50]"
            :page-size="pageData.pageSize"
            :current-page="pageData.pageNum"
            :total="pageData.total"
            layout="prev, pager, next, sizes"
            background
            style="margin-right: -26px"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        :title="modeltitle"
        :visible="showmodel"
        width="500px"
        top="10vh"
        :close-on-click-modal="false"
        append-to-body
        @close="closeDialog"
      >
        <div class="addbox">
          <span>分类名称</span>
          <el-input
            v-model="newChild.name"
            maxlength="10"
            style="width: 350px"
          ></el-input>
        </div>
        <div class="addbox">
          <span>排序</span>
          <el-input-number
            v-model="newChild.sequence"
            style="width: 350px"
          ></el-input-number>
        </div>
        <span slot="footer">
          <el-button @click="closeDialog()">取消</el-button>
          <el-button
            type="primary"
            @click="savePhones()"
          >确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import DotDropdown from '../../../components/common/DotDropdown'
// import List_oldVue from '../../inner-management/department/List_old.vue'
// import Form from './form'
export default {
  components: {
    // DotDropdown
  },
  data() {
    return {
      qzUrl: 'http://athena-1255600302.cosgz.myqcloud.com',
      data: [
        {
          name: '一级分类',
          childs: [
            {
              name: '二级分类'
            }
          ]
        }
      ],
      groupId: '',
      visible: false,
      dropMenuEvents: [
        { label: '添加子分类', funcName: 'addNode' },
        { label: '修改名称', funcName: 'editNode' },
        { label: '删除', funcName: 'removeNode' }
      ],
      dropMenuSonEvents: [
        { label: '修改名称', funcName: 'editNode' },
        { label: '删除', funcName: 'removeNode' }
      ],
      defaultProps: {
        children: 'childs',
        label: 'name'
      },
      height: 565,
      pageData: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      searchData: {
        name: ''
      },
      tagId: '',
      tableData: [],
      isLoading: false,
      nowId: '',
      showmodel: false,
      modeltitle: '',
      row: {},
      newChild: { name: '', sequence: 0, childs: [] },
      checkAll: false,
      posterlist: [],
      checked: [],
      checkedGameId: [],
      isIndeterminate: false,
      checkPosterId: [], //选中的海报id集合
      groupName: '全部',
      lista: [],
      listb: [],
      listc: [],
      listd: [],
      liste: []
    }
  },
  created() {
    // 获取部门数据
    this.getDepartmentTreeData()
    this.getPosterList(this.searchData.name, this.tagId)
    // this.getTableHeight()
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
      window.onresize = () => {
        this.getTableHeight()
      }
    })
  },
  methods: {
    // ---渲染分类---
    handleNodeClick(data) {
      this.tagId = data.id
      this.groupName = data.name
      this.getPosterList(this.searchData.name, data.id)
    },
    // 获取分类数据
    getDepartmentTreeData() {
      this.$http.getMateTree({ type: 'poster' }).then(res => {
        this.data = res.data.data
        var all = { name: '全部', id: '', disabled: true }
        this.data.unshift(all)
        this.data.forEach(item => {
          if (item.childs && item.childs.length == 0) {
            item.childs = null
          }
        })
        console.log(this.data)
        if (!res.data.data[0].id) {
          this.isLoading = false
          return
        }
      })
    },
    // 添加一级分类
    addone() {
      this.showmodel = true
      this.modeltitle = '添加一级分类'
    },
    // 添加子分类
    clickMenu(item, node, data) {
      console.log(item, node, data)
      if (item.funcName == 'addNode') {
        // if(this.posterlist.length>0){
        //   this.$message.warning('该分类下有海报，不可添加下级分类')
        //   return
        // }
        this.showmodel = true
        this.modeltitle = '添加子分类'
        this.row = data
      }
      if (item.funcName == 'editNode') {
        this.showmodel = true
        this.modeltitle = '修改'
        this.row = data
        this.newChild = { name: data.name, sequence: data.sequence, childs: [] }
      }
      if (item.funcName == 'removeNode') {
        if (this.posterlist.length > 0) {
          this.$message.warning('该分类下有海报，不可删除')
          return
        }
        this.$confirm('是否删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.dynamicMateDelete({ id: data.id }).then(res => {
            this.showmodel = false
            this.$message.success('删除成功')
            this.getDepartmentTreeData()
          })
        })
        // this.remove(node,data)
      }
    },
    // add或修改
    savePhones() {
      if (!this.newChild.name) {
        this.$message.warning('请添加分类名称')
        return
      }
      if (this.modeltitle == '添加一级分类') {
        let params = { name: this.newChild.name, sequence: this.newChild.sequence, superiorId: 0, type: 'poster' }
        this.creatTree(params)
      } else if (this.modeltitle == '添加子分类') {
        let params = {
          name: this.newChild.name,
          sequence: this.newChild.sequence,
          superiorId: this.row.id,
          type: 'poster'
        }
        this.creatTree(params)
      } else if (this.modeltitle == '修改') {
        let params = { name: this.newChild.name, sequence: this.newChild.sequence, id: this.row.id, type: 'poster' }
        this.upDateTree(params)
      }
      this.newChild = { name: '', sequence: 0, childs: [] }
    },
    // 新增分类
    creatTree(params) {
      this.$http
        .dynamicMateAdd(params)
        .then(res => {
          this.showmodel = false
          this.$message.success('添加成功')
          this.getDepartmentTreeData()
        })
        .catch(err => {
          this.showmodel = false
          this.$message.warning(err.data.message)
        })
    },
    // 修改分类
    upDateTree(params) {
      this.$http.dynamicMateUpdate(params).then(res => {
        this.showmodel = false
        this.$message.success('修改成功')
        this.getDepartmentTreeData()
      })
    },
    // 删除分类
    remove(node, data) {
      const parent = node.parent
      const childs = parent.data.childs || parent.data
      const index = childs.findIndex(d => d.id === data.id)
      childs.splice(index, 1)
    },
    // 关闭弹窗
    closeDialog() {
      this.showmodel = false
      this.newChild = { name: '', sequence: 0, childs: [] }
    },
    // 添加海报
    addPoater() {
      this.$router.push('./detail?tagId=' + this.tagId)
    },
    // 顶部搜索海报素材
    searchByUserName() {
      this.getPosterList(this.searchData.name, this.tagId)
    },
    // 海报列表
    getPosterList(name, tagId) {
      let params = { pageNum: this.pageData.pageNum, pageSize: 20, type: 'poster', groupId: tagId, name: name }
      this.$http.matePosterList(params).then(res => {
        this.posterlist = res.data.data.list
        this.pageData.total = res.data.data.total
        var lista = [],
          listb = [],
          listc = [],
          listd = [],
          liste = []
        this.posterlist.forEach((item, i) => {
          item.srcList = []
          item.srcList.push('http://athena-1255600302.cosgz.myqcloud.com' + item.link)
          this.checkedGameId.push(item.id)
          if (i == 0 || i == 5 || i == 10 || i == 15) {
            lista.push(item)
          }
          if (i == 1 || i == 6 || i == 11 || i == 16) {
            listb.push(item)
          }
          if (i == 2 || i == 7 || i == 12 || i == 17) {
            listc.push(item)
          }
          if (i == 3 || i == 8 || i == 13 || i == 18) {
            listd.push(item)
          }
          if (i == 4 || i == 9 || i == 14 || i == 19) {
            liste.push(item)
          }
        })
        this.lista = lista
        this.listb = listb
        this.listc = listc
        this.listd = listd
        this.liste = liste
      })
    },
    // 分页
    onSizeChange(val) {
      this.pageData.pageSize = val
      this.getPosterList(this.searchData.name, this.tagId)
    },
    onPageChange(val) {
      this.pageData.pageNum = val
      this.getPosterList(this.searchData.name, this.tagId)
    },
    // 修改海报
    compile(id) {
      this.$openNewPage({path: './detail?id=' + id})
    },
    // 删除海报
    cancel(id) {
      this.$confirm('删除后，海报的相关信息将完全被清除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(id)
        this.$http.mateBatchDeletePoster({ ids }).then(res => {
          this.$message.success('删除成功')
          this.getPosterList(this.searchData.name, this.tagId)
        })
      })
    },
    // 下架
    soldOut(id, isDisplay) {
      this.$confirm(isDisplay ? '确认下架海报？' : '确认上架海报？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.matePosteroffShelf({ id, isDisplay: !isDisplay }).then(res => {
          this.$message.success(isDisplay ? '下架成功' : '上架成功')
          this.getPosterList(this.searchData.name, this.tagId)
        })
      })
    },
    // 全选
    allChange(val) {
      this.checkAll = val
      this.checked = val ? this.checkedGameId : []
      this.isIndeterminate = val
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function () {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function () {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach(el => {
          el.onclick = function () {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    },
    // 选中海报列表
    changeBox(value) {
      console.log(value)
      var a = []
      this.posterlist.forEach(item => {
        value.forEach(val => {
          if (item.id == val) {
            a.push(val)
          }
        })
      })
      this.checkPosterId = a
      let checkedCount = a.length
      this.checkAll = checkedCount === this.posterlist.length
      if ((checkedCount > 0 && checkedCount < this.posterlist.length) || checkedCount === this.posterlist.length) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.posterlist.length;
      // this.isIndeterminate = checkedCount === this.posterlist.length;
    },
    // 获取分类id
    changeCascader(e) {
      if (e.length == 1) {
        this.groupId = e[0]
      }
      if (e.length == 2) {
        this.groupId = e[1]
      }
      if (e.length == 3) {
        this.groupId = e[2]
      }
    },
    // 批量删除
    batchDel() {
      this.$confirm('删除后，海报的相关信息将完全被清除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        if (this.checkAll) {
          ids = this.checkedGameId
        } else {
          ids = this.checkPosterId
        }
        this.$http.mateBatchDeletePoster({ ids }).then(res => {
          this.isIndeterminate = false
          this.$message.success('删除成功')
          this.checkPosterId = []
          this.getPosterList(this.searchData.name, this.tagId)
        })
      })
    },
    // 确认分组
    confirmMove() {
      if (!this.groupId) {
        this.$message.warning('请选择您要移动的分组')
        return
      }
      var ids = []
      if (this.checkAll) {
        ids = this.checkedGameId
      } else {
        ids = this.checkPosterId
      }
      let params = { ids, groupId: this.groupId }
      this.$http.matemovePoster(params).then(res => {
        this.visible = false
        this.isIndeterminate = false
        this.checkPosterId = []
        this.posterlist = []
        this.checked = []
        this.getPosterList(this.searchData.name, this.tagId)
        this.$message.success('移动成功')
      })
    },
    getTableHeight() {
      const OTHER_HEIGHT = 76 + 52 + 30
      this.height = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox__label {
  width: 155px;
  overflow: hidden;
}
.addbox {
  display: flex;
  margin-top: 10px;
  span {
    width: 75px;
    margin-top: 10px;
  }
}
.inp {
  display: flex;
}
.addicon {
  margin-left: 15px;
  line-height: 40px;
}

.department {
  width: 100%;
  height: 100%;
  .top {
    height: 76px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    .search {
      padding: 20px 0;
      display: flex;
      height: 36px;
      .search_content {
        ul {
          display: flex;
          li {
            height: 36px;
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-right: 10px;
            .title {
              color: #606266;
              margin-right: 10px;
            }
          }
        }
      }
      .search_btns {
        display: flex;
        align-items: center;
      }
    }
    .reload {
      padding: 20px 0;
      margin-left: auto;
    }
    .all {
      font-weight: bold;
      padding: 30px 0;
      margin-left: 30px;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 76px);
    display: flex;
    .left {
      width: 240px;
      height: 100%;
      background-color: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
      .alltree {
        font-size: 14px;
        padding: 15px;
        padding-left: 25px;
        color: rgb(88, 88, 88);
      }
      .alltree:hover {
        font-size: 14px;
        padding: 15px;
        padding-left: 25px;
        color: rgb(88, 88, 88);
        background: rgb(245, 247, 250);
      }
      .myTree {
        ::v-deep .el-tree-node__content {
          height: 50px;
          .el-tree-node__label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .right {
      width: calc(100% - 240px);
      height: 100%;
      // background-color: #ffffff;
      // padding: 20px;
      box-sizing: border-box;
      margin-left: 10px;
      .checkall {
        background: #fff;
        padding: 20px;
        margin-bottom: 15px;
      }
      // .picbox {
      //   padding: 20px 10px 0 15px;
      //   background: #fff;
      //   display: flex;
      .flexbox {
        width: 25%;
        .contentbox {
          // width: 212px;
          width: 86%;
          margin: 0 7%;
          // margin: 0 30px;
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          .boxbtns {
            position: absolute;
            width: 70%;
            // width: 170px;
            // left: 10px;
            background: #fff;
            border-radius: 5px;
            opacity: 0.8;
            top: 10px;
            z-index: 8;
            padding: 10px;
            display: none;
            text-align: center;

            top: 10px;
            left: 0;
            right: 0;
            margin: 0 auto;
            span {
              margin-left: 20px;
            }
          }
          .pic {
            width: 120%;
            margin-left: -10%;
            // width:250px;
            // margin-left: -19px;
            // height: 375px;
          }
          .check {
            width: 155px;
            padding: 15px;
            overflow: hidden;
          }
        }
        .contentbox:hover {
          .boxbtns {
            display: block;
          }
        }
      }
      // }
    }
    .page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      padding: 10px 15px;
      .pagination-count {
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        color: #7b7b7b;
        .count {
          margin-right: 20px;
        }
      }
    }
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  position: relative;
  .operate-btns {
    position: absolute;
    right: 2px;
    display: none;
  }
  // 鼠标悬停时，展示
  &:hover,
  :focus-within {
    .operate-btns {
      display: inline;
    }
  }
}
.el-icon-more:before {
  content: '\E794';
  color: #c0c4cc;
  font-size: 20px;
}
.rotate {
  cursor: pointer;
  margin-left: 5px;
  transform: rotate(90deg);
}
.rotate:focus {
  width: 20px;
  height: 20px;
  // border-radius: 4em;
  // background-color: rgba(130, 132, 138, 0.2);
}
// ::v-deep .el-dialog {
//   border-radius: 6px;
// }
// ::v-deep .el-dialog__header {
//   padding: 15px 20px;
// }
// ::v-deep .el-dialog__title {
//   font-size: 16px;
//   font-weight: bold;
// }
// ::v-deep .el-dialog__headerbtn {
//   top: 15px;
//   .el-dialog__close {
//     font-size: 20px;
//     font-weight: bold;
//     color: #333;
//   }
// }
// ::v-deep .el-dialog__body {
//   padding: 20px;
//   padding-top: 0;
// }
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
</style>
