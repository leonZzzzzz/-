<template>
  <div class="enterprise">
    <div class="top_nav">
      <ul>
        <li v-for="(item, i) in navList" :key="i" :class="{ active: i == navBarFlag }" @click="changeNavBarFun(i)">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <!-- <div v-if="navBarFlag==4">
      <singledemo></singledemo>
    </div> -->
    <!-- <div v-if="navBarFlag==8">
      <radardemo></radardemo>
    </div> -->
    <div class="main_content">
      <div class="department">
        <div class="top">
          <div class="search">
            <div class="search_content">
              <div class="inp">
                <el-input
                  v-model="searchData.name"
                  :placeholder="changeTrans.search"
                  clearable
                  @input="searchByUserName"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="all">{{ groupName }}（{{ pageData.total }}）</div>
          <div class="reload">
            <!-- <el-button v-if="navBarFlag == 0" type="primary" @click="showtext = true"
              ><i class="el-icon-plus"></i>添加文本</el-button
            > -->
            <!-- <el-button v-if="navBarFlag == 1" type="primary" @click="showimage = true"
              ><i class="el-icon-plus"></i>添加图片</el-button
            > -->
            <!-- <el-button v-if="navBarFlag == 3" type="primary" @click="showlink = true"
              ><i class="el-icon-plus"></i>添加单外部链接</el-button
            > -->
            <el-button v-if="navBarFlag == 0" type="primary" @click="goSingledetail({})"
              ><i class="el-icon-plus"></i>添加单图文</el-button
            >
            <el-button v-if="navBarFlag == 1" type="primary" @click="shownumerous = true"
              ><i class="el-icon-plus"></i>添加多图文</el-button
            >
            <el-button v-if="navBarFlag == 2" type="primary" @click="showfile = true"
              ><i class="el-icon-plus"></i>添加文件</el-button
            >
            <el-button v-if="navBarFlag == 3" type="primary" @click="showvideo = true"
              ><i class="el-icon-plus"></i>添加视频</el-button
            >
            <!-- <el-button v-if="navBarFlag == 6" type="primary" @click="showmini = true"
              ><i class="el-icon-plus"></i>添加小程序</el-button
            > -->
            <!-- <el-button v-if="navBarFlag == 8" type="primary" @click="showradar = true"><i class="el-icon-plus"></i>添加雷达</el-button> -->
            <!-- <el-button v-if="navBarFlag == 9" type="primary" @click="showradar = true"><i class="el-icon-plus"></i>添加海报</el-button> -->
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
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div class="custom-tree-node-wrapper">
                  <span class="custom-tree-node-label">{{ node.label }}</span>
                  <span class="operate-btns" v-if="data.superiorId">
                    <el-dropdown trigger="click" class="custom-tree-menu" size="small">
                      <i class="el-icon-more rotate" />
                      <el-dropdown-menu slot="dropdown" v-if="data.superiorId == '0'">
                        <el-dropdown-item
                          v-for="(item, index) in dropMenuEvents"
                          :key="index"
                          :divided="index > 0"
                          @click.native="clickMenu(item, node, data)"
                        >
                          {{ item.label }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                      <el-dropdown-menu slot="dropdown" v-else>
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
            <el-button type="primary" style="width: 190px; margin-top: 30px" @click="addone"
              ><i class="el-icon-plus"></i>新增分类</el-button
            >
          </div>
          <div class="right">
            <div class="checkall">
              <el-checkbox v-model="checkAll" @change="allChange">全选</el-checkbox>
              <span style="margin-left: 30px" v-if="isIndeterminate && posterlist.length > 0">
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
                    <span style="margin-right: 20px" @click="visible = false">取消</span>
                    <span @click="confirmMove">确定</span>
                  </div>
                  <el-button slot="reference">移动分组</el-button>
                </el-popover>
                <el-button @click="batchDel">删除</el-button>
              </span>
              <span style="margin-left: 30px" v-else>
                <el-button disabled>移动分组</el-button>
                <el-button disabled>删除</el-button>
              </span>
            </div>
            <div
              id="table"
              ref="table"
              :style="{ height: height + 'px', width: '100%', overflow: 'auto', background: '#fff' }"
            >
              <!-- <div v-if="navBarFlag == 0">
                <el-table
                  :data="posterlist"
                  :show-header="false"
                  stripe
                  @selection-change="handleSelectionChange"
                  style="width: 100%"
                  ref="multipleTable"
                >
                  <el-table-column type="selection" width="55"> </el-table-column>
                  <el-table-column label="内容" width="460">
                    <template slot-scope="scope">
                      <div  style="display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;">{{scope.row.content}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="时间" width="180" align="center"> </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click=";(showtext = true), (textid = scope.row.id)">编辑</el-button>
                      <el-button type="text" @click="cancel(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div> -->
              <!-- <div v-if="navBarFlag == 1">
                <div class="picbox" v-if="posterlist.length > 0">
                  <el-row>
                    <el-col :span="6" class="contentbox" v-for="(item, i) in posterlist" :key="i">
                      <el-image class="pic" :src="imageurl + item.imageUrl" :preview-src-list="item.srcList"></el-image>
                      <el-checkbox-group v-model="checked" @change="changeBox">
                        <el-checkbox class="check" :label="item.id" autocomplete="off">{{ item.name }}</el-checkbox>
                      </el-checkbox-group>
                      <div class="boxbtns">
                        <span
                          @click="
                            showimage = true
                            imageid = item.id
                          "
                          >编辑</span
                        >
                        <span @click="cancel(item.id)">删除</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else style="text-align: center; padding-top: 100px;height:255px;overflow:hidden">
                  <img
                    style="width: 300px"
                    src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
                  />
                </div>
              </div> -->
              
              <!-- <div v-if="navBarFlag == 3">
                <el-table
                  :data="posterlist"
                  :show-header="false"
                  stripe
                  @selection-change="handleSelectionChange"
                  style="width: 100%"
                  ref="multipleTablelink"
                >
                  <el-table-column type="selection" width="55"> </el-table-column>
                  <el-table-column label="标题" width="180">
                    <template slot-scope="scope">
                      <div class="jianjie">{{ scope.row.name }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="封面" width="120">
                    <template slot-scope="scope">
                      <img style="width:50px;height:50px;" :src="imageurl + scope.row.imageUrl" />
                    </template>
                  </el-table-column>
                  <el-table-column label="简介" width="180">
                    <template slot-scope="scope">
                      <div class="jianjie">{{ scope.row.content }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="link" label="链接"> </el-table-column>
                  <el-table-column prop="createTime" label="时间" width="180" align="center"> </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click=";(showlink = true), (linkid = scope.row.id)">编辑</el-button>
                      <el-button type="text" @click="cancel(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div> -->
              <div v-if="navBarFlag == 0">
                <el-table
                  :data="posterlist"
                  :show-header="false"
                  stripe
                  @selection-change="handleSelectionChange"
                  style="width: 100%"
                  ref="multipleTablegrap"
                >
                  <el-table-column type="selection" width="55"> </el-table-column>
                  <el-table-column label="封面" align="center">
                    <template slot-scope="scope">
                      <img style="width:60px;height:60px;object-fit: cover;" :src="imageurl + scope.row.imageUrl" />
                    </template>
                  </el-table-column>
                  <el-table-column label="标题">
                    <template slot-scope="scope">
                      <div class="jianjie">{{ scope.row.name }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.mark=="singleContent" ? '图文' : '链接' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="简介">
                    <template slot-scope="scope">
                      <div class="jianjie">{{ scope.row.content }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="时间" align="center"> </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <!-- <LinkaCode :id="`${scope.row.id}`" :text="`primary`" :size="`medium`" :label="`分享`"></LinkaCode> -->
                      <el-button 
                        v-if="scope.row.isRadar && scope.row.radarId" 
                        type="text" 
                        style="margin-left:10px;" 
                        @click="$openNewPage({path: `/main/scrm/radar/detail?id=${scope.row.radarId}`})">详情</el-button>
                      <el-button type="text" v-if="scope.row.mark=='link'" @click="goSingledetail(scope.row)">编辑</el-button>
                      <el-button type="text" v-else @click="goSingledetail(scope.row)">编辑</el-button>
                      <el-button type="text" @click="cancel(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="navBarFlag == 1">
                <div v-if="posterlist.length > 0" class="moregrap">
                  <div v-for="(item, i) in posterlist" :key="i" class="grapbox">
                    <div class="topgrap">
                      <img style="object-fit: cover" :src="imageurl + item.imageUrl" />
                      <div>{{ item.name }}</div>
                    </div>
                    <template v-if="item.materialQuoteList && item.materialQuoteList.length > 0">
                      <div class="list_grap" v-for="(val, index) in item.materialQuoteList" :key="index">
                        <template v-if="val.quoteMaterial && val.quoteType == 'image_text'">
                          <div>{{ val.quoteMaterial.name }}</div>
                          <img style="object-fit: cover;" :src="imageurl + val.quoteMaterial.imageUrl" />
                        </template>
                      </div>
                      <div style="font-size:14px;padding:20px 20px 0 20px">更新于：{{item.updateTime | timeSubString}}</div>
                    </template>
                    <div class="boxbtns">
                      <el-checkbox-group v-model="checked" @change="changeBox">
                        <el-checkbox class="check" :label="item.id" autocomplete="off">&nbsp;</el-checkbox>
                      </el-checkbox-group>
                      <!-- <LinkaCode :id="`${item.id}`" :text="`primary`" :size="`small`" :color="`#606266`" :label="`分享`"></LinkaCode> -->
                      <el-button size="small" 
                        v-if="item.isRadar && item.radarId" 
                        style="margin-left:10px;" 
                        @click="$openNewPage({path: `/main/scrm/radar/detail?id=${item.radarId}`})">详情</el-button>
                      <el-button size="small" @click=";(shownumerous = true), (numerousid = item.id)">编辑</el-button>
                      <el-button size="small" @click="cancel(item.id)">删除</el-button>
                    </div>
                  </div>
                </div>
                <div v-else style="text-align: center; padding-top: 100px;height:255px;overflow:hidden">
                  <img
                    style="width: 300px"
                    src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
                  />
                </div>
              </div>
              <el-table
                v-if="navBarFlag == 2"
                :data="posterlist"
                :show-header="false"
                stripe
                @selection-change="handleSelectionChange"
                style="width: 100%"
                ref="multipleTablefile"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="name" label="内容" width="460"> </el-table-column>
                <el-table-column prop="createTime" label="时间" width="180" align="center"> </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <!-- <LinkaCode :id="`${scope.row.id}`" :text="`text`" :size="`medium`" :label="`分享`"></LinkaCode> -->
                    <el-button 
                      v-if="scope.row.isRadar && scope.row.radarId" 
                      type="text" 
                      style="margin-left:10px;" 
                      @click="$openNewPage({path: `/main/scrm/radar/detail?id=${scope.row.radarId}`})">详情</el-button>
                    <el-button style="margin-left:10px" type="text" @click=";(showfile = true), (fileid = scope.row.id)">编辑</el-button>
                    <el-button style="margin-left:10px" type="text" @click="cancel(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="navBarFlag == 3">
                <div class="picbox" v-if="posterlist.length > 0">
                  <el-row>
                    <el-col :span="6" class="contentbox" v-for="(item, i) in posterlist" :key="i">
                      <video-player
                        class="pic"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="item.playerOptions"
                      ></video-player>
                      <el-checkbox-group v-model="checked" @change="changeBox">
                        <el-checkbox class="check" :label="item.id" autocomplete="off" :title="item.name">{{
                          item.name
                        }}</el-checkbox>
                      </el-checkbox-group>
                      <div class="boxbtns">
                        <!-- <LinkaCode :id="`${item.id}`" :text="`text`" :size="`medium`" :color="`#000`" :label="`分享`"></LinkaCode> -->
                        <span 
                          v-if="item.isRadar && item.radarId" 
                          style="font-size:14px;" 
                          @click="$openNewPage({path: `/main/scrm/radar/detail?id=${item.radarId}`})">详情</span>
                        <span style="font-size:14px;" @click=" showvideo = true, videoid = item.id">编辑</span>
                        <span style="font-size:14px;" @click="cancel(item.id)">删除</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else style="text-align: center; padding-top: 100px;height:255px;overflow:hidden">
                  <img
                    style="width: 300px"
                    src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
                  />
                </div>
              </div>
              <!-- <div v-if="navBarFlag == 6">
                <div class="picbox" v-if="posterlist.length > 0">
                  <el-row>
                    <el-col :span="6" class="contentbox" v-for="(item, i) in posterlist" :key="i">
                      <div style="font-size: 13px;display:flex;padding:10px;color:#606266">
                        <img
                          width="20px"
                          src="http://athena-1255600302.cosgz.myqcloud.com/attachments/common/bdae58a8e7874cd8a1323f825b046dcb.png"
                        />
                        <div style="margin-top:5px;margin-left:5px">小程序</div>
                      </div>
                      <el-image class="pic" :src="imageurl + item.imageUrl" :preview-src-list="item.srcList"></el-image>
                      <el-checkbox-group v-model="checked" @change="changeBox">
                        <el-checkbox class="check" :label="item.id" autocomplete="off">{{ item.name }}</el-checkbox>
                      </el-checkbox-group>
                      <div class="boxbtns">
                        <span
                          @click="
                            showmini = true
                            miniId = item.id
                          "
                          >编辑</span
                        >
                        <span @click="cancel(item.id)">删除</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div v-else style="text-align: center; padding-top: 100px;height:255px;overflow:hidden">
                  <img
                    style="width: 300px"
                    src="http://athena-1255600302.cosgz.myqcloud.com/attachments/null/260bb1d72a76436782119f2c688e9312.png"
                  />
                </div>
              </div> -->
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
        <!-- 新增修改左侧分类start -->
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
              <el-input v-model="newChild.name" maxlength="10" style="width: 350px"></el-input>
            </div>
            <div class="addbox">
              <span>排序</span>
              <el-input-number v-model="newChild.sequence" style="width: 350px"></el-input-number>
            </div>
            <span slot="footer">
              <el-button @click="closeDialog()">取消</el-button>
              <el-button type="primary" @click="savePhones()">确定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 新增修改左侧分类end  -->
      </div>
    </div>

    <TextCateory :visible="showtext" :id="textid" :tagId="tagId" @onClose="onClose"></TextCateory>
    <ImageCategory :visible="showimage" :id="imageid" :tagId="tagId" @closeImage="closeImage"></ImageCategory>
    <VideoCategory :visible="showvideo" :id="videoid" :tagId="tagId" @closeVidel="closeVidel"></VideoCategory>
    <LinkCategory :visible="showlink" :id="linkid" :tagId="tagId" @closeLink="closeLink"></LinkCategory>
    <SingleCategory :visible="showsingle" :id="singleid" :tagId="tagId" :mark="mark" @closeSingle="closeSingle"></SingleCategory>
    <NumerousCategory
      :visible="shownumerous"
      :id="numerousid"
      :tagId="tagId"
      @closeNumerous="closeNumerous"
    ></NumerousCategory>
    <FileCategory :visible="showfile" :id="fileid" :tagId="tagId" @closeFile="closeFile"></FileCategory>
    <MiniCategory :visible="showmini" :id="miniId" :tagId="tagId" @closeMini="closeMini"></MiniCategory>
  </div>
</template>

<script>
// import DotDropdown from '../../../components/common/DotDropdown'
import TextCateory from './textcategory'
import ImageCategory from './imagecategory'
import VideoCategory from './videocategory'
import LinkCategory from './linkcategory'
import SingleCategory from './singlecategory'
import NumerousCategory from './numerouscategory'
import FileCategory from './filecategory'
import MiniCategory from './minicategory'
// import singledemo from '@/modules/core/views/base/news/list/List.vue'
// import radardemo from '@/modules/scrm/views/radar/List.vue'

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  components: {
    // DotDropdown,
    TextCateory,
    ImageCategory,
    VideoCategory,
    LinkCategory,
    SingleCategory,
    NumerousCategory,
    FileCategory,
    videoPlayer,
    MiniCategory,
    // singledemo: singledemo,
    // radardemo: radardemo,
  },
  data() {
    return {
      popvisible:false,
      mark:'singleContent',
      imageurl: 'http://athena-1255600302.cosgz.myqcloud.com',
      showtext: false,
      showimage: false,
      showvideo: false,
      showlink: false,
      showsingle: false,
      shownumerous: false,
      showfile: false,
      showmini: false,
      showradar: false,
      navList: [
        // {
        //   name: '文本',
        //   isActive: true
        // },
        // {
        //   name: '图片',
        //   isActive: false
        // },
        
        // {
        //   name: '单外部链接',
        //   isActive: false
        // },
        {
          name: '单图文',
          isActive: false
        },
        {
          name: '多图文',
          isActive: false
        },
        {
          name: '文件',
          isActive: false
        },
        {
          name: '视频',
          isActive: false
        },
        // {
        //   name: '小程序',
        //   isActive: false
        // }
        // {
        //   name: '雷达',
        //   isActive: false
        // },
        // {
        //   name: '海报',
        //   isActive: false
        // },
      ],
      navBarFlag:0,
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
      textid: '',
      imageid: '',
      videoid: '',
      linkid: '',
      singleid: '',
      numerousid: '',
      fileid: '',
      miniId: '',
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
      categoryId: '',
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
      allchecked: false,
      changeTrans: {
        search: '搜索文本素材或关键字'
      }
    }
  },
  // destroyed(){
  //   sessionStorage.removeItem('navBarFlag')
  // },
  created() {
    console.log(this.$store.state.isSession)
    this.tagId = ''
    var navBarFlag = sessionStorage.getItem('navBarFlag')
    if (navBarFlag) {
      this.navBarFlag = navBarFlag
    }
    // 获取分类数据
    this.getDepartmentTreeData()
    // 海报、文本、图片、图文、小程序列表
    this.getPosterList(this.searchData.name, this.tagId, this.navBarFlag)
    // this.getTableHeight()
  },
  mounted() {
    this.$nextTick(() => {
      this.tagId = ''

      this.getTableHeight()
      window.onresize = () => {
        this.getTableHeight()
      }
    })
  },
  methods: {
    goSingledetail(row){
      // 使用新窗口打开页面目标页用go(-1)返回无效，此时需要记录当前路由在目标页面$router.replace(formPagePage)返回
      if(row && row.id){
        this.$openNewPage({path: `./singlecategoryDetail?id=${row.id}&tagId=${this.tagId}&mark=${row.mark ||''}`})
      }else{
        this.$router.push({path: `./singlecategoryDetail?mark=${row.mark || ''}&tagId=${this.tagId}`})
      }
    },
    // 关闭文本弹窗
    onClose(flag) {
      this.showtext = false
      this.textid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭图片弹窗
    closeImage(flag) {
      this.showimage = false
      this.imageid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭视频弹窗
    closeVidel(flag) {
      this.showvideo = false
      this.videoid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭单链接窗口
    closeLink(flag) {
      this.showlink = false
      this.linkid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭单图文
    closeSingle(flag) {
      this.showsingle = false
      this.singleid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭多图文
    closeNumerous(flag) {
      this.shownumerous = false
      this.numerousid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭文件弹窗
    closeFile(flag) {
      this.showfile = false
      this.fileid = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },
    // 关闭小程序弹窗
    closeMini(flag) {
      this.showmini = false
      this.miniId = ''
      this.groupId = ''
      if (typeof flag == 'boolean' && flag) {
        this.getPosterList(this.searchData.name, this.tagId)
      }
    },

    // 获取选中的素材
    handleSelectionChange(value) {
      var a = []
      this.posterlist.forEach((item) => {
        value.forEach((val) => {
          if (item.id == val.id) {
            a.push(val.id)
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
    },
    // ---渲染分类---
    handleNodeClick(data) {
      this.tagId = data.id
      this.groupName = data.name
      this.isIndeterminate = false
      this.getPosterList(this.searchData.name, data.id)
    },
    // 切换顶部类目
    changeNavBarFun(index) {
      this.posterlist=[]
      this.groupId = ''
      this.tagId = ''
      this.groupName = '全部'
      this.checkPosterId = []
      this.searchData.name = ''
      this.navBarFlag = index
      sessionStorage.setItem('navBarFlag', index)
      // if (index == 0) {
      //   this.changeTrans.search = '搜索文本素材或关键字'
      // } else if (index == 1) {
      //   this.changeTrans.search = '搜索图片素材或关键字'
      // } else 
      if (index == 0) {
        this.changeTrans.search = '搜索视频素材或关键字'
      } 
      // else if (index == 3) {
      //   this.changeTrans.search = '搜索单外部链接或关键字'
      // }
       else if (index == 1) {
        this.changeTrans.search = '搜索单图文或关键字'
      } else if (index == 2) {
        this.changeTrans.search = '搜索多图文或关键字'
      } else if (index == 3) {
        this.changeTrans.search = '搜索文件素材或关键字'
      } 
      // else if (index == 6) {
      //   this.changeTrans.search = '搜索小程序或关键字'
      // } else if (index == 7) {
      //   this.changeTrans.search = '搜索雷达或关键字'
      // } else if (index == 8) {
      //   this.changeTrans.search = '搜索海报或关键字'
      // }
      this.getDepartmentTreeData()
      this.getPosterList(this.searchData.name, this.tagId)
      this.allChange(false)
    },

    // 获取分类数据all
    getDepartmentTreeData() {
      var type = ''
      // if (this.navBarFlag == 0) {
      //   type = 'text'
      // } else if (this.navBarFlag == 1) {
      //   type = 'image'
      // } else 
      if (this.navBarFlag == 3) {
        type = 'video'
      } 
      // else if (this.navBarFlag == 3) {
      //   type = 'external_link'
      // }
       else if (this.navBarFlag == 0) {
        type = 'image_text'
      } else if (this.navBarFlag == 1) {
        type = 'numerous_image_text'
      } else if (this.navBarFlag == 2) {
        type = 'file'
      } 
      // else if (this.navBarFlag == 6) {
      //   type = 'program'
      // }
      // else if(this.navBarFlag==7){
      //   type="radar"
      // }
      // else if(this.navBarFlag==8){
      //   type="poster"
      // }
      // if (type == 'image_text') {
      //   this.$http.MateroneSingle({ type: 8 }).then((res) => {
      //     var parentid = res.data.data[0].id
      //     if (parentid) {
      //       this.$http.MateroneSingletwo({ type: 8, parentId: parentid }).then((res) => {
      //         this.data = res.data.data.list
      //         var all = { name: '全部', id: '', disabled: true }
      //         this.data.unshift(all)
      //       })
      //     }
      //   })
      // } else {
        this.$http.getMateTree({ type }).then((res) => {
          this.data = res.data.data
          this.data.forEach((item) => {
            if (!item.childs) {
              item.childs = null
            }
          })
          var all = { name: '全部', id: '', disabled: true }
          this.data.unshift(all)
          if (!res.data.data[0].id) {
            this.isLoading = false
            return
          }
        })
      // }
    },
    // 添加一级分类
    addone() {
      this.showmodel = true
      this.modeltitle = '添加一级分类'
    },
    // 添加子分类
    clickMenu(item, node, data) {
      if (item.funcName == 'addNode') {
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
          this.$message.warning('该分类下有素材，不可删除')
          return
        }
        this.$confirm('是否删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.dynamicMateDelete({ id: data.id }).then((res) => {
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
      var type = ''
      // if (this.navBarFlag == 0) {
      //   type = 'text'
      // } else if (this.navBarFlag == 1) {
      //   type = 'image'
      // } else 
      if (this.navBarFlag == 3) {
        type = 'video'
      } 
      // else if (this.navBarFlag == 3) {
      //   type = 'external_link'
      // }
       else if (this.navBarFlag == 0) {
        type = 'image_text'
      } else if (this.navBarFlag == 1) {
        type = 'numerous_image_text'
      } else if (this.navBarFlag == 2) {
        type = 'file'
      }
      // else if (this.navBarFlag == 6) {
      //   type = 'program'
      // } 
      // else if (this.navBarFlag == 7) {
      //   type = 'radar'
      // } else if (this.navBarFlag == 8) {
      //   type = 'poster'
      // }
      if (!this.newChild.name) {
        this.$message.warning('请添加分类名称')
        return
      }
      if (this.modeltitle == '添加一级分类') {
        let params = { name: this.newChild.name, sequence: this.newChild.sequence, superiorId: 0, type }
        this.creatTree(params)
      } else if (this.modeltitle == '添加子分类') {
        let params = {
          name: this.newChild.name,
          sequence: this.newChild.sequence,
          superiorId: this.row.id,
          type
        }
        this.creatTree(params)
      } else if (this.modeltitle == '修改') {
        let params = { name: this.newChild.name, sequence: this.newChild.sequence, id: this.row.id, type }
        this.upDateTree(params)
      }
      this.newChild = { name: '', sequence: 0, childs: [] }
    },
    // 新增分类
    creatTree(params) {
      this.$http
        .dynamicMateAdd(params)
        .then((res) => {
          this.showmodel = false
          this.$message.success('添加成功')
          this.getDepartmentTreeData()
        })
        .catch((err) => {
          this.showmodel = false
          // this.$message.error()
        })
    },

    // 修改分类
    upDateTree(params) {
      this.$http.dynamicMateUpdate(params).then((res) => {
        this.showmodel = false
        this.$message.success('修改成功')
        this.getDepartmentTreeData()
      })
    },
    // 删除分类
    remove(node, data) {
      const parent = node.parent
      const childs = parent.data.childs || parent.data
      const index = childs.findIndex((d) => d.id === data.id)
      childs.splice(index, 1)
    },
    // 关闭弹窗
    closeDialog() {
      this.showmodel = false
      this.newChild = { name: '', sequence: 0, childs: [] }
    },

    // 顶部搜索海报素材
    searchByUserName() {
      this.getPosterList(this.searchData.name, this.tagId)
    },

    // 列表all
    getPosterList(name, tagId) {
      var type = ''
      // if (this.navBarFlag == 0) {
      //   type = 'text'
      // } else if (this.navBarFlag == 1) {
      //   type = 'image'
      // } else 
      if (this.navBarFlag == 3) {
        type = 'video'
      } 
      // else if (this.navBarFlag == 3) {
      //   type = 'external_link'
      // }
       else if (this.navBarFlag == 0) {
        type = 'image_text'
      } else if (this.navBarFlag == 1) {
        type = 'numerous_image_text'
      } else if (this.navBarFlag == 2) {
        type = 'file'
      } 
      // else if (this.navBarFlag == 6) {
      //   type = 'program'
      // }
      // else if(this.navBarFlag==8){
      //   type="radar"
      // }
      // else if(this.navBarFlag==9){
      //   type="poster"
      // }
      let params = {}
      // if (type == 'image_text') {
      //   params = { pageNum: this.pageData.pageNum, pageSize: 20, categoryId: tagId, title: name }
      //   this.gettableList('MaterSingleContent', params, name, tagId)
      // } else 
      if (type == 'numerous_image_text') {
        params = { pageNum: this.pageData.pageNum, pageSize: 20, type, groupId: tagId, name: name }
        this.gettableList('numMoregraphic', params, name, tagId)
      } else {
        params = { pageNum: this.pageData.pageNum, pageSize: 20, type, groupId: tagId, name: name }
        this.gettableList('matePosterList', params, name, tagId)
      }
    },
    // 列表接口调用
    gettableList(type, params, name, tagId) {
      this.$http[type](params).then((res) => {
        this.checkAll = false
        this.checkPosterId = []
        this.pageData.total = res.data.data.total
        var poster = res.data.data.list
        this.checkedGameId = []
        this.posterlist = []
        this.isIndeterminate = false
        poster.forEach((item) => {
          item.srcList = []
          item.srcList.push('http://athena-1255600302.cosgz.myqcloud.com' + item.imageUrl)
          this.checkedGameId.push(item.id)
        })
        if (this.navBarFlag == 3) {
          poster.forEach((item) => {
            item.playerOptions = {
              playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: 'zh-CN',
              aspectRatio: '16:16', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  src:
                    'http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/7c91912e5285890809428211638/fmhJD2mAmBIA.mp4', // 路径
                  type: 'video/mp4' // 类型
                }
              ],
              poster:
                'http://1255600302.vod2.myqcloud.com/cc5a8997vodgzp1255600302/7c91912e5285890809428211638/5285890809428211639.jpg', //你的封面地址
              notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
            }
            item.playerOptions.poster = 'http://athena-1255600302.cosgz.myqcloud.com' + item.imageUrl
            item.playerOptions.sources[0].src = item.videoUrl
          })
        }
        this.posterlist = poster
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
    hideORshow(id, isDisplay) {
      var text = isDisplay ? '隐藏' : '显示'
      this.$confirm(`确定${text}单图文素材吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.showORhiddenSingleGRO({ id, isDisplay: isDisplay ? false : true }).then((res) => {
          this.$message.success(`${text}成功`)
          this.getPosterList(this.searchData.name, this.tagId)
        })
      })
    },

    // 删除
    cancel(id) {
      var text = ''
      // if (this.navBarFlag == 0) {
      //   text = '文本'
      // } else if (this.navBarFlag == 1) {
      //   text = '图片'
      // } else 
      if (this.navBarFlag == 3) {
        text = '视频'
      } 
      // else if (this.navBarFlag == 3) {
      //   text = '单外部链接'
      // }
       else if (this.navBarFlag == 0) {
        text = '单图文'
      } else if (this.navBarFlag == 1) {
        text = '多图文'
      } else if (this.navBarFlag == 2) {
        text = '文件'
      }
      //  else if (this.navBarFlag == 6) {
      //   text = '小程序'
      // } 
      // else if (this.navBarFlag == 7) {
      //   text = '雷达'
      // } else if (this.navBarFlag == 8) {
      //   text = '海报'
      // }
      // if (this.navBarFlag == 4) {
      //   this.deleteMatter('deleteSingleGRO', text, id)
      // } else {
        this.deleteMatter('mateBatchDeletePoster', text, id)
      // }
    },
    deleteMatter(type, text, id) {
      this.$confirm(`删除后，${text}的相关信息将完全被清除, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(id)
        this.$http[type]({ ids }).then((res) => {
          this.checkAll = false
          this.isIndeterminate = false
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
        this.$http.matePosteroffShelf({ id, isDisplay: !isDisplay }).then((res) => {
          this.$message.success(isDisplay ? '下架成功' : '上架成功')
          this.getPosterList(this.searchData.name, this.tagId)
        })
      })
    },
    // 全选
    allChange(val) {
      // if (this.navBarFlag == 0) {
      //   if (this.$refs.multipleTable.selection.length < this.posterlist.length) {
      //     this.checkAll = true
      //     this.isIndeterminate = true
      //   } else {
      //     this.checkAll = false
      //     this.isIndeterminate = false
      //   }
      //   this.$refs.multipleTable.toggleAllSelection()
      // } 
      // else if (this.navBarFlag == 3) {
      //   if (this.$refs.multipleTablelink.selection.length < this.posterlist.length) {
      //     this.checkAll = true
      //     this.isIndeterminate = true
      //   } else {
      //     this.checkAll = false
      //     this.isIndeterminate = false
      //   }
      //   this.$refs.multipleTablelink.toggleAllSelection()
      // } else
       if (this.navBarFlag == 0) {
        if (this.$refs.multipleTablegrap.selection.length < this.posterlist.length) {
          this.checkAll = true
          this.isIndeterminate = true
        } else {
          this.checkAll = false
          this.isIndeterminate = false
        }
        this.$refs.multipleTablegrap.toggleAllSelection()
      } else if (this.navBarFlag == 2) {
        if (this.$refs.multipleTablefile.selection.length < this.posterlist.length) {
          this.checkAll = true
          this.isIndeterminate = true
        } else {
          this.checkAll = false
          this.isIndeterminate = false
        }
        this.$refs.multipleTablefile.toggleAllSelection()
      } else {
        this.allchecked = val
        this.checked = val ? this.checkedGameId : []
        this.isIndeterminate = val
      }
    },
    elCascaderOnlick(e) {
      let that = this
      setTimeout(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            // this.previousElementSibling.onclick();
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
        document.querySelectorAll('.el-cascader-panel .el-radio').forEach((el) => {
          el.onclick = function() {
            // that.$refs.elcascader.dropDownVisible = false;
          }
        })
      }, 100)
    },
    // 选中海报列表
    changeBox(value) {
      console.log(value)
      var a = []
      this.posterlist.forEach((item) => {
        value.forEach((val) => {
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
    },
    // 批量删除
    batchDel() {
      var text = ''
      // if (this.navBarFlag == 0) {
      //   text = '文本'
      // } else if (this.navBarFlag == 1) {
      //   text = '图片'
      // } else 
      if (this.navBarFlag == 3) {
        text = '视频'
      } 
      // else if (this.navBarFlag == 3) {
      //   text = '单外部链接'
      // }
       else if (this.navBarFlag == 0) {
        text = '单图文'
      } else if (this.navBarFlag == 1) {
        text = '多图文'
      } else if (this.navBarFlag == 2) {
        text = '文件'
      } 
      // else if (this.navBarFlag == 6) {
      //   text = '小程序'
      // }
      //  else if (this.navBarFlag == 7) {
      //   text = '雷达'
      // } else if (this.navBarFlag == 8) {
      //   text = '海报'
      // }
      this.$confirm(`删除后，${text}的相关信息将完全被清除, 是否继续?`, '提示', {
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
        this.$http.mateBatchDeletePoster({ ids }).then((res) => {
          this.visible = false
          this.isIndeterminate = false
          this.checkPosterId = []
          this.posterlist = []
          this.checked = []
          this.checkAll = false
          this.getPosterList(this.searchData.name, this.tagId)
          this.$message.success('删除成功')
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
      this.$http.matemovePoster(params).then((res) => {
        this.visible = false
        this.isIndeterminate = false
        this.checkPosterId = []
        this.posterlist = []
        this.checked = []
        this.checkAll = false
        this.getPosterList(this.searchData.name, this.tagId)
        this.$message.success('移动成功')
        this.groupId = ''
      })
    },
    getTableHeight() {
      const OTHER_HEIGHT = 76 + 52
      this.height = window.innerHeight - document.querySelector('#table').offsetTop - OTHER_HEIGHT
    }
  },
  filters: {
    timeSubString(time) {
      if (!time) {
        return
      }
      return time.substring(0, time.length - 9)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .video-js .vjs-big-play-button {
  border-radius: 50%;
  width: 50px;
  left: 80px;
  top: 80px;
}
.enterprise {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .top_nav {
    width: 100%;
    height: 44px;
    display: flex;
    ul {
      display: flex;
      background-color: #fff;
      background-image: linear-gradient(to bottom, #ebeef5, #ffffff);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
      li {
        width: 120px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        background-color: #ebeef5;
        font-size: 14px;
        user-select: none;
        cursor: pointer;
        &.active {
          border-radius: 0px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: #fff;
        }
        &.borderLeft {
          border-bottom-left-radius: 10px;
        }
        &.borderRight {
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
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
    border-bottom: 1px solid #eee;
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
        background: rgb(246, 246, 249);
        padding: 20px;
        margin-bottom: 15px;
      }
      .picbox {
        padding: 20px 10px 0 10px;
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        .contentbox {
          width: 212px;
          margin: 0 25px;
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          position: relative;
          .boxbtns {
            position: absolute;
            width: 170px;
            left: 10px;
            background: #fff;
            border-radius: 5px;
            opacity: 0.8;
            top: 10px;
            z-index: 8;
            padding: 10px;
            display: none;
            text-align: center;
            span {
              margin: 0px 10px;
            }
          }

          .pic {
            width: 210px;
            height: 210px;
          }
          .check {
            width: 150px;
            padding: 15px;
            overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
          }
        }
        .contentbox:hover {
          .boxbtns {
            display: block;
            justify-content: space-between;
          }
        }
      }
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
.video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  margin-left: 80px !important;
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
::v-deep .el-dialog {
  border-radius: 6px;
}
::v-deep .el-dialog__header {
  padding: 15px 20px;
}
::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: bold;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
  .el-dialog__close {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
}
::v-deep .el-dialog__body {
  padding: 20px;
  padding-top: 0;
}
::v-deep .el-table__body-wrapper {
  overflow: hidden;
}
.main_content {
  background-color: #ffffff;
}
.linkname {
  width: 180px;
  margin: 15px;
  word-break: break-all;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.jianjie {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.moregrap {
  // -moz-column-count: 2; /* Firefox */
  // -webkit-column-count: 2; /* Safari 和 Chrome */
  column-count: 4;
  // -moz-column-gap: 30px;
  // -webkit-column-gap: 30px;
  column-gap: 30px;
  // display: inline-block;
  break-inside: avoid;
  margin: 0 20px;

  .grapbox {
    break-inside: avoid;
    border-radius: 5px;
    border: 1px solid #eee;
    margin-bottom: 20px;
    .topgrap {
      // height: 120px;
      position: relative;
      img {
        width: 100%;
        height: 120px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        display: block;
      }
      div {
        position: absolute;
        background: rgba(20, 20, 20, 0.5);
        padding: 20px;
        bottom: 0px;
        width: calc(100% - 40px);
        // left: 15px;
        // right: 15px;
        color: #fff;
        line-height: 20px;
      }
    }
    .list_grap {
      display: flex;
      justify-content: space-between;
      padding: 15px 15px 0 15px;
      div {
        width: calc(100% - 80px);
        font-size: 14px;
        line-height: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
  }

  .boxbtns {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
}

::v-deep .el-checkbox-group {
  margin-top: 6px;
}
</style>
