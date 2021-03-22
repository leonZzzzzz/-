<template>
  <el-dialog
    :title="id ? '修改客户回收规则' : '添加客户回收规则'"
    :visible.sync="visible"
    width="890px"
    :append-to-body="true"
    :before-close="close"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <div class="xfo-dialog">
      <el-alert
        style="margin-bottom: 20px"
        title="当客户满足回收条件后，将其自动回收至公海池，交给新员工认领。"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-form :model="model" ref="model" label-width="auto" label-position="right">
        <el-form-item label="生效成员" :rules="[{ required: true, message: '该字段不能为空' }]">
          <el-radio v-model="model.type" label="universal">所有成员</el-radio>
          <el-radio v-model="model.type" label="appoint">指定成员</el-radio>
          <div v-if="model.type == 'appoint'">
            <div>
              （针对不同员工配置不同的客户回收规则）<el-tooltip
                effect="dark"
                placement="top"
                v-if="model.type == 'appoint'"
              >
                <div style="line-height: 20px" slot="content">
                  选择部门后，如原来某部门是5人，后<br />新增1人，则对这6位企业成员分别发<br />送提醒。
                </div>
                <i class="el-icon-question" style="font-size: 20px; margin-left: 10px"></i>
              </el-tooltip>
            </div>
            <Tag v-for="(item, index) in selectedList" :key="index">{{ item.name }}</Tag>
          </div>
          <el-button icon="el-icon-plus" size="small" plain v-if="model.type == 'appoint'" @click="chooseMember">{{
            allList.length > 0 ? '已选择' : model.ruleUserList.length > 0 ? '修改成员' : '选择成员'
          }}</el-button>
        </el-form-item>
        <div v-for="(item, index) in model.ruleInfoList" :key="index" class="rule-module">
          <el-form-item :label="'规则' + Number(index + 1)" :rules="[{ required: true, message: '该字段不能为空' }]">
            <span>进入</span>
            <!-- <el-select v-model="item.lifeCycleId" clearable placeholder="请选择" class='gapsel'>
            <el-option
              v-for="type in typeoptions"
              :key="type.id"
              :label="type.cycleName"
              :value="type.id">
            </el-option>
          </el-select> -->
            <el-cascader
              :options="typeoptions"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              :show-all-levels="true"
              v-model="item.lifeCycleId"
              class="gapsel"
              ref="elcascader"
              clearable
            ></el-cascader>
            <span>阶段</span>
            <el-input-number class="blank" :min="1" type="number" v-model="item.days"></el-input-number>
            <span>天未添加跟进记录，自动回收至公海池</span>
            <div style="margin-top: 10px">
              <span>在回收前</span>
              <el-input-number class="blank" :min="1" type="number" v-model="item.beforeRemindDays"></el-input-number>
              <span>天提醒员工</span>
              <el-tooltip effect="dark" placement="top">
                <div style="line-height: 20px" slot="content">
                  比如进入某阶段，3个自然日未添加记<br />录自动回收至公海池，在回收前1天提<br />醒，那么在1号
                  10:30客户跟进，在5<br />号09:00自动回收至公海池，并发送即<br />将回收通知给该员工
                </div>
                <i class="el-icon-question" style="font-size: 20px; margin-left: 10px"></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="排序"
            ><el-input-number class="blank" :min="0" type="number" v-model="item.sortNum"></el-input-number>
          </el-form-item>
          <el-button
            v-if="model.ruleInfoList.length > 1"
            size="small"
            style="margin-left: 50px; position: absolute; top: 10px; right: 10px"
            circle
            icon="el-icon-minus"
            @click="deleteRule(index)"
          ></el-button>
        </div>
        <el-button size="medium" @click="addRules" plain icon="el-icon-plus">添加规则</el-button>
        <div class="botbor" v-if="hide">
          <el-form-item
            label="非企微客户数量："
            prop="unCustomerCount"
            :rules="[{ required: true, message: '该字段不能为空', trigger: ['blur', 'change'] }]"
          >
            <span>每个员工个人所持有的非企微客户上限数量</span>
            <el-input-number class="blank" :min="1" type="number" v-model="model.unCustomerCount"></el-input-number>
            <span>位</span>
            <div>(在【公海池】->【非企微客户】列表，员工录入/批量导入客户数量不计入在其中。)</div>
          </el-form-item>
          <el-form-item label="允许延期：" prop="isExtension" :rules="[{ required: true, message: '该字段不能为空' }]">
            <el-switch v-model="model.isExtension" active-color="#294A7B" inactive-color="#999"> </el-switch>
            <div v-if="model.isExtension">
              <span>允许员工延期</span
              ><el-input-number class="blank" :min="1" type="number" v-model="model.extensionDays"></el-input-number>天
            </div>
          </el-form-item>
          <el-form-item
            label="员工捡回："
            prop="pickAgainDays"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <span>自回收至公海池</span>
            <el-input-number class="blank" :min="1" type="number" v-model="model.pickAgainDays"></el-input-number>
            <span
              >天后可重新捡回（若设置为7天，员工的客户1月1日回收至公海池后，期间该客户未被其他员工认领时，1月8日09:00此员工可重新认领）</span
            >
          </el-form-item>
          <el-form-item
            label="非企微客户再回收："
            prop="unScrmCustRecycleDay"
            :rules="[{ required: true, message: '该字段不能为空' }]"
          >
            <span>非企微客户被领取后</span>
            <el-input-number
              class="blank"
              :min="1"
              type="number"
              v-model="model.unScrmCustRecycleDay"
            ></el-input-number>
            <span>天未添加成功，则重新回收至公海池</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="success()" :loading="loading">确 定</el-button>
    </span>
    <!-- <el-dialog width="400px" title="请选择成员" :visible.sync="innerVisible" :before-close="innerclose" append-to-body>
      <el-tree
        :data="treeMenu"
        show-checkbox
        default-expand-all
        node-key="myId"
        ref="tree"
        :props="defaultProps"
        :check-strictly="true"
        :highlight-current="true"
        :default-checked-keys="defaultCheckedKeys"
        :filter-node-method="filterNode"
        @check="getCheckedNodes"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerclose(false)">取 消</el-button>
        <el-button type="primary" @click="innerclose()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog> -->
    <member-tree-dialog
      :config="dialogVisible"
      @closeDialog="dialogVisible.visible = false"
      :selectedList="selectedList"
      @handleConfirm="innerclose"
    ></member-tree-dialog>
  </el-dialog>
</template>

<script>
import MemberTreeDialog from '../../components/components/MemberTreeDialog.vue'
import Tag from '../../components/components/Tag'
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    Tag,
    MemberTreeDialog
  },

  data() {
    return {
      dialogVisible: {
        width: '800px',
        title: '选择目标成员',
        visible: false
      },
      hide: false,
      innerVisible: false,
      defaultCheckedKeys: [],
      setCheckedNodesArr: [],
      setCheckedNodesArrInfo: [],
      memberListResults: [],
      selectedMenu: [],
      idList: [],
      allList: [],
      memberList: [],
      selectedList: [],
      model: {
        type: 'universal', //类型

        unCustomerCount: '', //非企微客户持有上线
        isExtension: false, //是否允许延期
        extensionDays: '', //延期天数
        pickAgainDays: '', //员工重新捡回天数

        ruleInfoList: [{ lifeCycleId: '', days: '', beforeRemindDays: '', sortNum: '0' }], //规则列表
        ruleUserList: [], //成员列表
        unScrmCustRecycleDay: ''
      },
      typeoptions: [],
      treeMenu: [
        {
          checked: false,
          name: '公司名',
          childs: [
            {
              checked: false,
              name: '部门名',
              childs: [{ name: '员工名', checked: false }]
            }
          ]
        }
      ],
      branchOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      branch: [],
      loading: false,
      defaultProps: {
        children: 'childs',
        label: 'name'
      }
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.getLeftWeek()
        // this.getBottomRules()
        // this.getDepartmentTree()
        if (this.id) {
          this.getDetail(this.id)
        }
      }
    }
  },

  methods: {
    // 获取生命周期
    getLeftWeek() {
      this.$http.getAllLiftcycle().then(res => {
        this.typeoptions = res.data.data
      })
    },
    // 获取底部四项规则
    getBottomRules() {
      this.$http.departmentrecoveryRule().then(res => {
        if (res.data.data) {
          this.model.unCustomerCount = res.data.data.unCustomerCount
          this.model.isExtension = res.data.data.isExtension
          this.model.extensionDays = res.data.data.extensionDays
          this.model.pickAgainDays = res.data.data.pickAgainDays
          this.model.unScrmCustRecycleDay = res.data.data.unScrmCustRecycleDay
        }
      })
    },
    // // 获取成员树数据
    // getDepartmentTree(callback) {
    //   this.$http.getDepartmentTree().then(res => {
    //     let tree = res.data.data
    //     tree.forEach(item => {
    //       if (item.userList) {
    //         for (var i = item.userList.length - 1; i >= 0; i--) {
    //           item.childs.unshift(item.userList[i])
    //         }
    //       }
    //     })
    //     this.treeMenu = JSON.parse(JSON.stringify(tree).replace(/"userList"/g, '"childs"'))
    //     // 设置企业的唯一id
    //     this.setMyId(this.treeMenu, 0)
    //     if (callback) {
    //       callback(res)
    //     }
    //   })
    // },
    // 选择成员
    chooseMember() {
      this.dialogVisible.visible = true
      // this.setDefaultCheckedKeys()
    },

    // 获取详情
    getDetail(id) {
      console.log('aaaaaaaaaaaaaaaaa')
      this.$http.recyclingRulesDetail({ relationId: id }).then(res => {
        this.model = res.data.data
        this.selectedList = []
        this.model.ruleUserList.forEach(item => {
          this.selectedList.push({ id: item.userId, name: item.userName || item.deptName })
        })
        // setTimeout(() => {
        //   this.setDefaultCheckedKeys()
        // }, 500);
      })
    },

    // // 获取选中的数据
    // getCheckedNodes(thisData, allData) {
    //   // 当前选中的列表
    //   let list = this.$refs.tree.getCheckedNodes()
    //   // 判断当前点击的是否被选中
    //   let isSelect = allData.checkedKeys.includes(thisData.myId)
    //   // 判断是否为成员节点
    //   // 存在parentId则不为成员节点
    //   if (thisData.parentId) {
    //     if (isSelect) {
    //       this.setCheckedNodesArr.push(thisData.myId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: thisData.id,
    //         myId: thisData.myId,
    //         name: thisData.name,
    //         type: 1
    //       })
    //     } else {
    //       this.setCheckedNodesArrInfo.forEach((item, index) => {
    //         if (item.id == thisData.id) {
    //           let arrIndex = this.setCheckedNodesArr.indexOf(item.myId)
    //           if (arrIndex == -1) {
    //             return
    //           }
    //           this.setCheckedNodesArr.splice(arrIndex, 1)
    //           this.setCheckedNodesArrInfo.splice(index, 1)
    //         }
    //       })
    //     }
    //   } else {
    //     // 对树节点进行遍历
    //     this.ergodicTreeMenu(this.treeMenu, thisData, isSelect)
    //   }
    //   // 手动选中相同的所有节点
    //   this.$refs.tree.setCheckedKeys(this.setCheckedNodesArr)
    //   // 去重，获取显示列表
    //   let hash = {}
    //   let memberListResults = this.setCheckedNodesArrInfo.reduce((item, next) => {
    //     hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
    //     return item
    //   }, [])
    //   // 赋值返回值
    //   memberListResults.defaultCheckedKeys = allData.checkedKeys
    //   this.setMembers(memberListResults)
    //   this.selectedMenu = memberListResults
    // },
    // // 设置唯一id
    // setMyId(options, myId) {
    //   options.forEach((item, index) => {
    //     item.myId = `${myId}-${index}`
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.setMyId(item.childs, item.myId)
    //     }
    //   })
    // },
    // setMembers(list) {
    //   this.memberList = list
    //   if (!this.memberList.length) {
    //     this.$message({
    //       message: '请选择发送成员后再提交',
    //       type: 'warning'
    //     })
    //     return
    //   }
    //   let idList = []
    //   let allList = []
    //   this.memberList.forEach(item => {
    //     idList.push({ userId: item.id })
    //     allList.push({ userId: item.id, type: item.type, userName: item.name })
    //   })
    //   this.model.ruleUserList = idList
    //   this.allList = allList
    // },
    // // 遍历树节点
    // ergodicTreeMenu(options, option, isSelect) {
    //   options.forEach((value, index) => {
    //     if (value.id == option.id) {
    //       if (isSelect) {
    //         if (!this.setCheckedNodesArr.includes(value.myId)) {
    //           this.setCheckedNodesArr.push(value.myId)
    //           this.setCheckedNodesArrInfo.push({
    //             id: value.id,
    //             myId: value.myId,
    //             name: value.name,
    //             userId: value.userId,
    //             type: 0
    //           })
    //         }
    //       } else {
    //         this.setCheckedNodesArrInfo.forEach((item, index) => {
    //           if (item.id == option.id) {
    //             let arrIndex = this.setCheckedNodesArr.indexOf(item.myId)
    //             if (arrIndex == -1) {
    //               return
    //             }
    //             this.setCheckedNodesArr.splice(arrIndex, 1)
    //             this.setCheckedNodesArrInfo.splice(index, 1)
    //           }
    //         })
    //       }
    //     }
    //     if (!value.childs) {
    //       return
    //     } else {
    //       this.ergodicTreeMenu(value.childs, option, isSelect)
    //     }
    //   })
    // },
    // // 节点过滤
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.name.includes(value)
    // },
    // // 设置节点默认选中
    // setDefaultCheckedKeys() {
    //   // 如果存在该值，表示是当前在当前页面操作，未通过接口
    //   if (this.selectedList.defaultCheckedKeys) {
    //     this.defaultCheckedKeys = this.selectedList.defaultCheckedKeys
    //     return
    //   }
    //   this.getApiDataToNewData()
    //   this.defaultCheckedKeys = this.setCheckedNodesArr
    //   this.selectedMenu = this.selectedList
    // },
    // // 格式化接口数据
    // getApiDataToNewData() {
    //   // 接口数据需要重新进行遍历赋值
    //   this.selectedList.forEach((item, index) => {
    //     this.formatData(this.treeMenu, item)
    //   })
    // },
    // // 格式化接口
    // formatData(options, option) {
    //   options.forEach((item, index) => {
    //     if (item.id == option.id && item.parentId) {
    //       // 判断是否为企业
    //       this.setCheckedNodesArr.push(item.myId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: item.id,
    //         myId: item.myId,
    //         name: item.name,
    //         type: 1
    //       })
    //     } else if (item.id == option.id && !item.parentId) {
    //       this.setCheckedNodesArr.push(item.myId)
    //       this.setCheckedNodesArrInfo.push({
    //         id: item.id,
    //         myId: item.myId,
    //         name: item.name,
    //         type: 0
    //       })
    //     }
    //     if (!item.childs) {
    //       return
    //     } else {
    //       this.formatData(item.childs, option)
    //     }
    //   })
    // },

    // 添加规则
    addRules() {
      this.model.ruleInfoList.push({ lifeCycleId: '', days: '', beforeRemindDays: '', sortNum: '0' })
    },

    // 删除规则
    deleteRule(index) {
      this.model.ruleInfoList.splice(index, 1)
    },
    success() {
      // if (this.model.ruleInfoList.length == 0 ) {
      //   this.$message.warning('请填写完整后再提交')
      //   return
      // }
      if (this.model.type == 'appoint' && this.model.ruleUserList.length == 0) {
        this.$message.warning('请选择生效成员')
        return
      }
      if (this.model.ruleInfoList.length > 0) {
        let b = 0
        this.model.ruleInfoList.forEach(el => {
          if (!el.lifeCycleId || !el.days || !el.beforeRemindDays) {
            b++
          }
          if (el.lifeCycleId) {
            if (typeof el.lifeCycleId == 'object') {
              el.lifeCycleId = el.lifeCycleId[el.lifeCycleId.length - 1]
            }
          }
        })
        if (b > 0) {
          this.$message.warning('规则未填写完整')
          return
        }
      }
      // if (this.model.isExtension && !this.model.extensionDays) {
      //   this.$message.warning('允许员工延期天数未填写')
      //   return
      // }
      this.save(this.id ? 'recyclingRulesUpdate' : 'recyclingRulesAdd')
    },
    save(type) {
      if (type == 'recyclingRulesUpdate') {
        this.model.relationId = this.id
      }
      this.$http[type](this.model).then(res => {
        this.$message.success(this.id ? '修改成功' : '添加成功')
        this.close(true)
      })
    },
    change(val, level, firstIndex, secondIndex, thirdIndex) {},
    close(flag) {
      this.model = {
        type: 'universal', //类型
        unCustomerCount: '', //非企微客户持有上线
        isExtension: false, //是否允许延期
        extensionDays: '', //延期天数
        pickAgainDays: '', //员工重新捡回天数
        ruleInfoList: [{ lifeCycleId: '', days: '', beforeRemindDays: '', sortNum: '0' }], //规则列表
        ruleUserList: [] //成员列表
      }
      this.memberList = []
      this.selectedList = []
      this.selectedMenu = []
      this.$emit('onClose', flag)
    },
    innerclose(flag) {
      this.innerVisible = false
      this.defaultCheckedKeys = []
      this.setCheckedNodesArr = []
      this.setCheckedNodesArrInfo = []
      this.memberListResults = []
      // this.selectedMenu=[]
      this.idList = []
      this.allList = []
      // this.memberList=[]
      // this.selectedList=[]
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
    }
  }
}
</script>
<style lang="scss" scoped>
.botbor {
  border: 1px dashed #999;
  padding: 15px 15px 0 15px;
}
.affix {
  margin-left: 120px;
  margin-bottom: 20px;
}
.gapsel {
  display: inline-block;
  width: 200px;
  margin: 0 5px;
}
.blank {
  display: inline-block;
  width: 150px;
  margin: 0 5px;
}
.tips1 {
  color: red;
  margin-bottom: 10px;
}
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
.rule-module {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  margin-bottom: 10px;
  padding-top: 20px;
  padding-right: 50px;
  position: relative;
}
.xfo-dialog {
  height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
