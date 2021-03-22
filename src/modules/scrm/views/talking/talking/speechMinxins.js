export default {
  // props: {
  //   introPage: {
  //     type: String,
  //     default: ''
  //   },
  // },
  data() {
    return {
      updateSeqNum: 0, // 修改话术排序
      updateSeqNumId: '', // 修改当前行的id
      // 新建话术弹窗
      speechAddDialog: {
        config: {
          width: '800px',
          title: '新建话术',
          visible: false
        },
        input: {
          imageName: '',
          videoName: ''
        },
        loading: false
      },
      // 编辑话术弹窗
      speechEditDialog: {
        config: {
          width: '800px',
          title: '编辑话术',
          visible: false
        },
        input: {
          imageName: '',
          videoName: '',
          fileName: ''
        },
        editForm: {}, // 话术详情表单
        loading: false,
        fileDescribe: '' // 文件简介
      },
      // 话术表格字段
      column: Object.freeze([
        {
          label: '话术内容',
          minWidth: '250px',
          prop: 'content',
          formatter: row => {
            return {
              text: (
                <div>
                  {row.content.length > 100 ? (
                    <div onClick={this.showSpeechDetailDialog.bind(this, row)}>
                      {row.content.slice(0, 100) + '...'}
                      <el-button type="text" onClick={this.showSpeechDetailDialog.bind(this, row)}>
                        详情
                      </el-button>
                    </div>
                  ) : (
                    row.content
                  )}
                </div>
              ),
              image: (
                <div style="display: flex;">
                  <el-image
                    style="flex-shrink: 0;width: 90px; height: 90px"
                    src={this.imgHost + row.imageUrl + '?imageMogr2/crop/90x90'}
                    preview-src-list={[this.imgHost + row.imageUrl]}
                  ></el-image>
                  {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
                </div>
              ),
              video: (
                <div style="display: flex;">
                  <video-preview videoData={row} width="120px" style="flex-shrink: 0;"></video-preview>
                  {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
                </div>
              ),
              image_text: (
                <div>
                  <el-tag size="mini" type="warning" style="margin-right: 10px;">
                    图文
                  </el-tag>
                  {row.name}
                </div>
              ),
              program: (
                <div>
                  <el-tag size="mini" type="success" style="margin-right: 10px;">
                    小程序
                  </el-tag>
                  {row.name}
                </div>
              ),
              file: (
                <div>
                  <el-tag size="mini" type="success" style="margin-right: 10px;">
                    {row.file ? row.file.replace(/.*\.(\w+)$/, '$1') : '文件'}
                  </el-tag>
                  {row.name || row.fileName}
                </div>
              )
            }[row.type]
          }
        },
        {
          label: '类型',
          // minWidth: '80px',
          align: 'center',
          prop: 'type',
          formatter: row => {
            return {
              text: '文字',
              image: '图片',
              image_text: '图文',
              video: '视频',
              program: '小程序',
              file: '文件'
            }[row.type]
          }
        },
        // {
        //   label: '标签',
        //   minWidth: '150px',
        //   align: 'left',
        //   formatter: row => {
        //     return (
        //       row.behaviorTagNameList && row.behaviorTagNameList.map(item => <el-tag type='info' style='margin-right: 10px;'>{item}</el-tag>)
        //     )
        //   }
        // },
        {
          label: '使用次数',
          // minWidth: '50px',
          align: 'center',
          prop: 'useQuantity'
        },
        // /* <el-input  value={row.seqNum} placeholder="请输入内容" onChange={this.updateSeqNumFun(row.seqNum)}></el-input> */
        {
          label: '排序',
          // minWidth: '50px',
          align: 'center',
          prop: 'seqNum'
        },
        // formatter: row => {
        //   return (
        //     <div onClick={this.updateSeqNumFun(this,row)}>
        //       <span>{row.seqNum}</span>
        //       <el-input type={this.updateSeqNumId == row.id ? 'text' : 'hidden'} v-model={this.updateSeqNum} placeholder="请输入内容"></el-input>
        //     </div>
        //   )
        // }
        {
          label: '创建时间',
          // minWidth: '100px',
          align: 'center',
          prop: 'createTime',
          formatter: row => {
            return row.createTime.slice(0, row.createTime.length - 3)
          }
        },

        {
          label: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          formatter: row => {
            return this.introPage == 'drainage' ? (
              <div>
                <el-button type="text" onClick={this.choooseSpeech.bind(this, row)}>
                  选中
                </el-button>
              </div>
            ) : (
              row.isRadar ?
                <div>
                  <el-button type="text" onClick={this.gotoRadar.bind(this, row)}>
                    详情
                  </el-button>
                  <el-button type="text" onClick={this.showSpeechEditDialog.bind(this, row)}>
                    修改
                  </el-button>
                  <el-button type="text" onClick={this.deleteSpeech.bind(this, row.id)}>
                    删除
                  </el-button>
                </div> :
                <div>
                  <el-button type="text" onClick={this.showSpeechEditDialog.bind(this, row)}>
                    修改
                    </el-button>
                  <el-button type="text" onClick={this.deleteSpeech.bind(this, row.id)}>
                    删除
                    </el-button>
                </div>
            )
          }
        }
      ]),
      // search: {
      //   tableData: [],
      //   column: Object.freeze([
      //     {
      //       type: 'index',
      //       label: '序号',
      //       minWidth: '150px',
      //       align: 'center'
      //     },
      //     {
      //       label: '话术内容',
      //       minWidth: '250px',
      //       prop: 'content',
      //       formatter: (row) => {
      //         return {
      //           text: (
      //             <div>
      //               {row.content.length > 100 ? (
      //                 <div onClick={this.showSpeechDetailDialog.bind(this, row)}>
      //                   {row.content.slice(0, 100) + '...'}
      //                   <el-button type="text" onClick={this.showSpeechDetailDialog.bind(this, row)}>
      //                     详情
      //                   </el-button>
      //                 </div>
      //               ) : (
      //                   row.content
      //                 )}
      //             </div>
      //           ),
      //           image: (
      //             <div style="display: flex;">
      //               <el-image
      //                 style='flex-shrink: 0;width: 90px; height: 90px'
      //                 src={this.imgHost + row.imageUrl + '?imageMogr2/crop/90x90'}
      //                 preview-src-list={[this.imgHost + row.imageUrl]}>
      //               </el-image>
      //               {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
      //             </div>
      //           ),
      //           video: (
      //             <div style="display: flex;">
      //               <video-preview videoData={row} width="120px" style='flex-shrink: 0;'></video-preview>
      //               {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
      //             </div>
      //           ),
      //           image_text: (
      //             <div>
      //               <el-tag size="mini" type="warning" style="margin-right: 10px;">
      //                 图文
      //               </el-tag>
      //               {row.name}
      //             </div>
      //           ),
      //           program: (
      //             <div>
      //               <el-tag size="mini" type="success" style="margin-right: 10px;">
      //                 小程序
      //               </el-tag>
      //               {row.name}
      //             </div>
      //           ),
      //           file: (
      //             <div>
      //               <el-tag size="mini" type="success" style="margin-right: 10px;">
      //                 {row.file ? row.file.replace(/.*\.(\w+)$/, '$1') : '文件'}
      //               </el-tag>
      //               {row.name || row.fileName}
      //             </div>
      //           )
      //         }[row.type]
      //       }
      //     },
      //     {
      //       label: '类型',
      //       minWidth: '150px',
      //       align: 'center',
      //       prop: 'type',
      //       formatter: row => {
      //         return {
      //           text: '文字',
      //           image: '图片',
      //           image_text: '图文',
      //           video: '视频',
      //           program: '小程序',
      //           file: '文件'
      //         }[row.type]
      //       }
      //     },
      //     {
      //       label: '标签',
      //       minWidth: '150px',
      //       align: 'left',
      //       formatter: row => {
      //         return (
      //           row.behaviorTagNameList && row.behaviorTagNameList.map(item => <el-tag type='info' style='margin-right: 10px;'>{item}</el-tag>)
      //         )
      //       }
      //     },
      //     {
      //       label: '使用次数',
      //       minWidth: '80px',
      //       align: 'center',
      //       prop: 'useQuantity',
      //     },
      //     {
      //       label: '创建时间',
      //       minWidth: '100px',
      //       align: 'left',
      //       prop: 'createTime',
      //       formatter: row => {
      //         return row.createTime ? row.createTime.slice(0, 16) : ''
      //       }
      //     },
      //   ]),
      //   page: {
      //     pageNum: 1,
      //     pageSize: 15,
      //     total: 0,
      //     searchWordName: ''
      //   }
      // },
      search: {
        tableData: [],
        column: Object.freeze([
          {
            label: '话术内容',
            minWidth: '250px',
            prop: 'content',
            formatter: row => {
              return {
                text: (
                  <div>
                    {row.content.length > 100 ? (
                      <div onClick={this.showSpeechDetailDialog.bind(this, row)}>
                        {row.content.slice(0, 100) + '...'}
                        <el-button type="text" onClick={this.showSpeechDetailDialog.bind(this, row)}>
                          详情
                        </el-button>
                      </div>
                    ) : (
                      row.content
                    )}
                  </div>
                ),
                image: (
                  <div style="display: flex;">
                    <el-image
                      style="flex-shrink: 0;width: 90px; height: 90px"
                      src={this.imgHost + row.imageUrl + '?imageMogr2/crop/90x90'}
                      preview-src-list={[this.imgHost + row.imageUrl]}
                    ></el-image>
                    {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
                  </div>
                ),
                video: (
                  <div style="display: flex;">
                    <video-preview videoData={row} width="120px" style="flex-shrink: 0;"></video-preview>
                    {row.name && <p style="margin-left: 10px;line-height: 1.5;">{row.name}</p>}
                  </div>
                ),
                image_text: (
                  <div>
                    <el-tag size="mini" type="warning" style="margin-right: 10px;">
                      图文
                    </el-tag>
                    {row.name}
                  </div>
                ),
                program: (
                  <div>
                    <el-tag size="mini" type="success" style="margin-right: 10px;">
                      小程序
                    </el-tag>
                    {row.name}
                  </div>
                ),
                file: (
                  <div>
                    <el-tag size="mini" type="success" style="margin-right: 10px;">
                      {row.file ? row.file.replace(/.*\.(\w+)$/, '$1') : '文件'}
                    </el-tag>
                    {row.name || row.fileName}
                  </div>
                )
              }[row.type]
            }
          },
          {
            label: '类型',
            minWidth: '150px',
            align: 'center',
            prop: 'type',
            formatter: row => {
              return {
                text: '文字',
                image: '图片',
                image_text: '图文',
                video: '视频',
                program: '小程序',
                file: '文件'
              }[row.type]
            }
          },
          // {
          //   label: '标签',
          //   minWidth: '150px',
          //   align: 'left',
          //   formatter: row => {
          //     return (
          //       row.behaviorTagNameList && row.behaviorTagNameList.map(item => <el-tag type='info' style='margin-right: 10px;'>{item}</el-tag>)
          //     )
          //   }
          // },
          {
            label: '使用次数',
            minWidth: '80px',
            align: 'center',
            prop: 'useQuantity'
          },
          // /* <el-input  value={row.seqNum} placeholder="请输入内容" onChange={this.updateSeqNumFun(row.seqNum)}></el-input> */
          {
            label: '排序',
            minWidth: '80px',
            align: 'center',
            prop: 'seqNum'
          },
          // formatter: row => {
          //   return (
          //     <div onClick={this.updateSeqNumFun(this,row)}>
          //       <span>{row.seqNum}</span>
          //       <el-input type={this.updateSeqNumId == row.id ? 'text' : 'hidden'} v-model={this.updateSeqNum} placeholder="请输入内容"></el-input>
          //     </div>
          //   )
          // }
          {
            label: '创建时间',
            minWidth: '100px',
            align: 'center',
            prop: 'createTime',
            formatter: row => {
              return row.createTime.slice(0, row.createTime.length - 3)
            }
          },

          {
            label: '操作',
            width: '100px',
            align: 'center',
            fixed: 'right',
            formatter: row => {
              return (
                <div>
                  <el-button type="text" onClick={this.showSpeechEditDialog.bind(this, row)}>
                    修改
                  </el-button>
                  <el-button type="text" onClick={this.deleteSpeech.bind(this, row.id)}>
                    删除
                  </el-button>
                </div>
              )
            }
          }
        ]),
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0,
          searchWordName: ''
        }
      }
    }
  },
  methods: {
    gotoRadar(row) {
      this.$router.push(`/main/scrm/radar/detail?id=${row.radarId}`)
    },
    choooseSpeech(row) {
      var list = { id: row.id, content: row.content ? row.content : row.name }
      this.$emit('getSpeechId', JSON.stringify(list))
    },
    // 显示新增话术的弹窗
    showSpeechAddDialog() {
      this.seqNum = 0
      this.speechEditDialog = Object.assign(this.$data.speechEditDialog, this.$options.data().speechEditDialog) // 初始化值
      this.speechEditDialog.config.visible = true
      this.speechEditDialog.config.title = '新建话术'
      this.materialEditor.type = 'text'
      this.isRadarDisable = false
      this.isImageRadarDisable = false
      this.getBehaviorTagPage() // 获取行为标签列表
      // this.options = Object.assign(this.$data.options, this.$options.data().options) // 初始化值
      // 获取分组信息
      // this.options.selectedCategory = ''
      // this.options.selectedGroup = ''
      this.options.selectedCategory = this.currentCategoryID
      if (this.currentGroupID !== 'add-new') {
        this.options.selectedGroup = this.currentGroupID
      } else {
        this.options.selectedGroup = ''
      }
      this.$nextTick(() => {
        this.$refs.materialEditorEdit.clearFormData()
      })
      // 清空选择的关键词列表
      this.selectedKeyWords = []
      this.selectedKeyWordIds = []
      // 清空选择的行为标签列表
      this.selectedBehaviorTags = []
      // 清空同步到互动雷达项
      // this.isRadar = false
      // this.radarTitle = ''
      // this.isFromRadar = false
      // this.radarSetting.form = {}
      this.clearRadarSetting() // 清空雷达设置信息
    },
    closeSpeechAddDialog() {
      this.speechAddDialog.config.visible = false
      this.clearAllSpeechDialogData()
    },
    // 编辑话术
    showSpeechEditDialog(row) {
      // 获取话术详情，修改话术内容需要提交整个对象
      let id = row.id
      let that = this
      let model = this.speechEditDialog
      // 清空选择的行为标签列表
      this.selectedBehaviorTags = []
      this.getBehaviorTagPage() // 获取行为标签列表
      this.clearRadarSetting() // 清空雷达设置信息
      that.$http.getSpeechcraft({ id }).then(res => {
        let data = res.data.data
        // console.log('这是数据', data)
        this.seqNum = data.seqNum
        model.config.visible = true
        model.config.title = '编辑话术'
        // 获取分组信息
        // this.getCategoryOptions()
        that.options.selectedCategory = that.currentCategoryID
        that.options.selectedGroup = that.currentGroupID
        that.materialEditor.type = row.type
        if (row.type === 'image') {
          model.input.imageName = row.name
        } else if (row.type === 'video') {
          model.input.videoName = row.name
        } else if (row.type === 'file') {
          model.input.fileName = row.name
        } else {
          model.input.imageName = ''
          model.input.videoName = ''
          model.input.fileName = ''
        }
        that.$set(model, 'editForm', data)
        that.$nextTick(() => {
          that.$refs.materialEditorEdit.clearFormData()
          that.$refs.materialEditorEdit.setEditFormData()
        })
        // 获取搜索关键词
        let ids = []
        let keywords = []
        if (data.searchWordList) {
          data.searchWordList.forEach(item => {
            ids.push(item.id)
            keywords.push(item.name)
          })
        }
        this.selectedKeyWordIds = ids
        this.selectedKeyWords = keywords
        // 行为标签
        this.selectedBehaviorTags = data.behaviorTagList
        // 互动雷达
        // this.isRadar = data.isRadar
        // this.radarTitle = data.radarTitle || ''
        // if (data.radarId && data.radarId !== '') {
        //   this.isFromRadar = true
        //   let id = data.radarId
        //   this.$http.getInteractRadarDetail({ id }).then(res => {
        //     this.radarSetting.form = res.data.data
        //   })
        // } else {
        //   this.isFromRadar = false
        // }
        if (row.type === 'image_text') {
          this.isRadarDisable = false
          this.imageTextRadarSetting.isRadar = data.isRadar
          this.isImageRadarDisable = false
          this.imageTextRadarSetting.radarTitle = data.radarTitle || ''
          if (data.radarId && data.radarId !== '') {
            this.imageTextRadarSetting.isFromRadar = true
            let id = data.radarId
            this.$http.getInteractRadarDetail({ id }).then(res => {
              this.imageTextRadarSetting.form = res.data.data
              if (this.imageTextRadarSetting.form.behaviorTagList) {
                this.selectedBehaviorTags = this.imageTextRadarSetting.form.behaviorTagList
                // console.log('如果有数据就进来', this.selectedBehaviorTags)
              } else {
                this.selectedBehaviorTags = []
                // console.log('如果没数据就清空', this.selectedBehaviorTags)
              }
              let radarRequest = {}
              // radarRequest.$set({
              //   isActionNotice: this.fileRadarSetting.form.isActionNotice,
              //   isBehaviorNotice: this.fileRadarSetting.form.isActionNotice,
              //   isBehaviorTag: this.fileRadarSetting.form.isActionNotice.isBehaviorTag
              // })
              this.$set(radarRequest, 'isActionNotice', this.imageTextRadarSetting.form.isActionNotice)
              this.$set(radarRequest, 'isBehaviorNotice', this.imageTextRadarSetting.form.isBehaviorNotice)
              this.$set(radarRequest, 'isBehaviorTag', this.imageTextRadarSetting.form.isBehaviorTag)
              if (this.imageTextRadarSetting.form.behaviorTagList) {
                this.$set(radarRequest, 'radarTagList', this.imageTextRadarSetting.form.behaviorTagList)
              }
              this.$set(model.editForm, 'radarRequest', radarRequest)
            })
          } else {
            this.imageTextRadarSetting.isFromRadar = false
          }
        } else if (row.type === 'file') {
          this.fileRadarSetting.isRadar = data.isRadar
          this.isRadarDisable = false
          this.isImageRadarDisable = false
          this.fileRadarSetting.radarTitle = data.radarTitle || ''
          if (data.radarId && data.radarId !== '') {
            this.fileRadarSetting.isFromRadar = true
            let id = data.radarId
            this.$http.getInteractRadarDetail({ id }).then(res => {
              this.fileRadarSetting.form = res.data.data
              if (this.fileRadarSetting.form.behaviorTagList) {
                this.selectedBehaviorTags = this.fileRadarSetting.form.behaviorTagList
              } else {
                this.selectedBehaviorTags = []
              }
              let radarRequest = {}
              this.$set(radarRequest, 'isActionNotice', this.fileRadarSetting.form.isActionNotice)
              this.$set(radarRequest, 'isBehaviorNotice', this.fileRadarSetting.form.isBehaviorNotice)
              this.$set(radarRequest, 'isBehaviorTag', this.fileRadarSetting.form.isBehaviorTag)
              if (this.fileRadarSetting.form.behaviorTagList) {
                this.$set(radarRequest, 'radarTagList', this.fileRadarSetting.form.behaviorTagList)
              }
              this.$set(model.editForm, 'radarRequest', radarRequest)
            })
          } else {
            this.fileRadarSetting.isFromRadar = false
          }
        } else if (row.type === 'video') {
          this.isRadarDisable = false
          this.videoRadarSetting.isRadar = data.isRadar
          // this.isImageRadarDisable = false
          this.videoRadarSetting.radarTitle = data.radarTitle || ''
          if (data.radarId && data.radarId !== '') {
            this.videoRadarSetting.isFromRadar = true
            let id = data.radarId
            this.$http.getInteractRadarDetail({ id }).then(res => {
              this.videoRadarSetting.form = res.data.data
              if (this.videoRadarSetting.form.behaviorTagList) {
                this.selectedBehaviorTags = this.videoRadarSetting.form.behaviorTagList
                // console.log('如果有数据就进来', this.selectedBehaviorTags)
              } else {
                this.selectedBehaviorTags = []
                // console.log('如果没数据就清空', this.selectedBehaviorTags)
              }
              let radarRequest = {}
              // radarRequest.$set({
              //   isActionNotice: this.fileRadarSetting.form.isActionNotice,
              //   isBehaviorNotice: this.fileRadarSetting.form.isActionNotice,
              //   isBehaviorTag: this.fileRadarSetting.form.isActionNotice.isBehaviorTag
              // })
              this.$set(radarRequest, 'isActionNotice', this.videoRadarSetting.form.isActionNotice)
              this.$set(radarRequest, 'isBehaviorNotice', this.videoRadarSetting.form.isBehaviorNotice)
              this.$set(radarRequest, 'isBehaviorTag', this.videoRadarSetting.form.isBehaviorTag)
              if (this.videoRadarSetting.form.behaviorTagList) {
                this.$set(radarRequest, 'radarTagList', this.videoRadarSetting.form.behaviorTagList)
              }
              this.$set(model.editForm, 'radarRequest', radarRequest)
            })
          } else {
            this.videoRadarSetting.isFromRadar = false
          }
        }
        // 获取文件的简介信息
        if (row.type === 'file') {
          model.fileDescribe = data.fileDescribe
        } else {
          model.fileDescribe = ''
        }
      })
      // console.log('当前选项' + this.currentCategoryID + '--' + this.currentGroupID)
    },
    // 关闭编辑弹窗
    closeSpeechEditDialog() {
      this.speechEditDialog.config.visible = false
      this.createNewWordsWayFlag = false
    },
    // 删除话术
    deleteSpeech(id) {
      let that = this
      that
        .$confirm('是否删除该话术？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$http.deleteSpeechcraft({ id }).then(() => {
            // 重置page, 获取列表数据
            that.$message.success('删除成功')
            that.page.pageNum = 1
            that.page.pageSize = 15
            that.page.total = 0
            that.getSpeechcraftPage()
          })
        })
    },
    // 双击修改序号
    updateSeqNumFun(row) {
      this.updateSeqNumId = row.id
    },
    // 清空雷达设置信息
    clearRadarSetting() {
      this.imageTextRadarSetting.isRadar = false
      this.imageTextRadarSetting.radarTitle = ''
      this.imageTextRadarSetting.isFromRadar = false
      this.imageTextRadarSetting.form = {}
      this.fileRadarSetting.isRadar = false
      this.fileRadarSetting.radarTitle = ''
      this.fileRadarSetting.isFromRadar = false
      this.fileRadarSetting.form = {}
    }
  }
}
