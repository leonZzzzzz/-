<template>
  <QcNavigationPage content="商品信息" class="prodocu-page" full>
    <el-form :model="model" ref="productModel" label-position="right" label-width="auto">
      <QcTitle title="基本信息">
        <el-form-item
          label="商品名称"
          prop="name"
          :rules="[
            { required: true, message: '商品名称不能为空' },
            { max: 60, message: '建议字数不超过60字' }
          ]"
        >
          <el-input v-model="model.name" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryList" :rules="[{ required: true, message: '商品分类不能为空' }]">
          <!-- <el-select v-model="model.categoryIds" style="width:450px;">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in categoryLists"
              :key="item.id"
            ></el-option>
          </el-select> -->
          <el-cascader
            style="width: 450px;"
            v-model="model.categoryList"
            :props="{
              value: 'id',
              label: 'name',
              children: 'childs'
            }"
            :options="categoryLists"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="商品品牌">
          <el-select v-model="model.brandId" style="width:450px;">
            <el-option :label="item.name" :value="item.id" v-for="(item, i) in brandLists" :key="i"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="商品等级" v-if="storeRoleShowLevel">
          <el-select v-model="model.level" style="width:450px;">
            <el-option :label="item.name" :value="item.id" v-for="(item, i) in levelLists" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品标签">
          <el-select v-model="model.tagList" multiple style="width:450px;">
            <el-option :label="item.name" :value="item.id" v-for="(item, i) in tagLists" :key="i"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="商品相册" prop="rollingImgUrl" :rules="[{ required: true, message: '商品相册不能为空' }]">
          <div class="img-box">
            <div class="item" v-for="(item, i) in rollingImgUrl" :key="item">
              <img :src="`${imgHost}${item}`" />
              <i class="el-icon-error" @click="onImgListDelete(i)"></i>
            </div>
            <div>
              <ImageUpload
                v-show="rollingImgUrl.length < 9"
                imageType="product"
                :isCrop="false"
                :cropw="100"
                :croph="100"
                :enlarge="5"
                :on-success="onImgListSuccess"
              ></ImageUpload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="虚拟商品">
          <el-switch v-model="model.isVirtual"></el-switch>
        </el-form-item>
        <el-form-item label="商品详情">
          <Editor v-model="model.content"></Editor>
        </el-form-item>
        <el-form-item v-if="false" label="自定义参数">
          <div class="property-box">
            <!-- <el-button @click="addSpecParams" style="margin-top:10px;">添加参数</el-button> -->
            <el-row>
              <el-col :span="3">选择参数类型：</el-col>
              <el-col :span="6">
                <el-select v-model="model.specParamsCategoryId" @change="paramsChildPage">
                  <el-option
                    v-for="params in paramsLists"
                    :label="params.name"
                    :value="params.id"
                    :key="params.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <div style="margin-top:10px" class="property-item" v-for="(item, i) in model.productSpecParams" :key="i">
              <el-row class="name" v-if="i === 0">
                <el-col :span="3">参数名</el-col>
                <el-col :span="6">参数值</el-col>
              </el-row>
              <el-row :gutter="20" style="padding-top:10px;">
                <el-col :span="3">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ item.specName }}
                  <!-- <el-input placeholder="建议四个字" v-model="item.specName"></el-input> -->
                </el-col>
                <el-col :span="6">
                  <el-input placeholder="建议60字以内" v-model="item.specValue" :maxlength="30"></el-input>
                </el-col>
                <!-- <el-col :span="6">
                  <el-button
                    class="delete-btn"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delSpecParams(i)"
                  ></el-button>
                </el-col>-->
              </el-row>
            </div>
          </div>
        </el-form-item>
      </QcTitle>
      <QcTitle title="库存信息">
        <el-form-item label="商品规格">
          <div class="property-box">
            <div class="property-item" v-for="(item, i) in property" :key="i">
              <div class="name">
                <div class="label">规格名：</div>
                <div>
                  <el-input
                    :maxlength="10"
                    style="width: 212px;"
                    placeholder="建议不多于十个字"
                    v-model="item.specName"
                  ></el-input>
                  <el-checkbox :disabled="lock && !item.hasImg" v-model="item.hasImg" @change="onAddSpecImg($event, i)"
                    >添加商品封面图</el-checkbox
                  >
                  <el-button
                    class="delete-btn"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delProperty(i)"
                  ></el-button>
                </div>
              </div>
              <div class="value">
                <div class="label">规格值：</div>
                <div class="col">
                  <div class="input" v-for="(label, index) in item.specValue" :key="index">
                    <el-input v-model="label.value" style="margin-bottom:10px;" :maxlength="60"></el-input>
                    <i class="el-icon-error" @click="delValue(i, index)"></i>
                    <div v-if="item.hasImg">
                      <ImageUpload
                        imageType="product"
                        :image-url="item.specImage[index].value"
                        :cropw="98"
                        :croph="98"
                        :isCrop="false"
                        :enlarge="5"
                        :on-success="onImgSuccess"
                        @click.native.stop="setImgIndex(i, index)"
                      ></ImageUpload>
                    </div>
                  </div>
                  <div class="btn" @click="addVaule(i)">
                    <el-button type="text">+ 添加</el-button>
                  </div>
                </div>
              </div>
            </div>
            <el-button style="width: 150px;" @click="addProperty()" v-if="property.length < 4">添加规格</el-button>
            <p style="font-size: 12px;color: #ff8f76;">
              *如果商品属于多规格会员价、现价、库存将不可填写。会员价、现价、默认获取规格中现价最低值。库存默认所有库存总和
            </p>
          </div>
          <table class="property-table" v-if="property.length">
            <tbody>
              <tr>
                <th v-for="(item, i) in tableTitleComputed" :key="i">
                  <div class="input-group" v-if="item.inputType">
                    <el-input
                      :placeholder="item.title"
                      style="width:150px"
                      v-model="item.value"
                      @keyup.native="
                        ;['origPrice', 'price', 'vipPrice'].includes(item.inputType)
                          ? checkInputPrice($event, item, 'value')
                          : checkInputInt($event, item, 'value')
                      "
                    >
                      <el-button
                        slot="append"
                        type="primary"
                        icon="el-icon-check"
                        style="padding: 9px;"
                        @click="onSyncPrice(item, i)"
                      ></el-button>
                    </el-input>
                  </div>
                  <div v-else>{{ item.title }}</div>
                </th>
              </tr>
              <tr v-for="(item, i) in tableBody" :key="i">
                <template v-for="(label, index) in tableBodyValuesComputed(item.itemValue)">
                  <td :key="index" v-if="!label.hidden" :rowspan="label.rowspan" class="border-left">
                    <el-input
                      :style="`width:150px`"
                      v-model="label.value"
                      :placeholder="label.placeholder"
                      v-if="label.inputType"
                      @blur="compareValue"
                      @keyup.native="
                        ;['origPrice', 'price', 'vipPrice'].includes(label.inputType)
                          ? checkInputPrice($event, label, 'value')
                          : checkInputInt($event, label, 'value')
                      "
                    ></el-input>
                    <span v-else style="width: 80px;display: block;word-wrap: break-word;line-height: 18px;">{{
                      label.value
                    }}</span>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-form-item label="原价" prop="origPrice" :rules="[{ required: true, message: '该字段为必填项' }]">
          <el-input
            :disabled="model.isMultiSpec"
            v-model="model.origPrice"
            @keyup.native="checkInputPrice($event, model, 'origPrice')"
            style="width:450px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="现价" prop="price" :rules="[{ required: true, message: '该字段为必填项' }]">
          <el-input
            :disabled="model.isMultiSpec"
            v-model="model.price"
            @keyup.native="checkInputPrice($event, model, 'price')"
            style="width:450px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="会员价"
          prop="vipPrice"
          v-if="isOpenVipPrice"
          :rules="[{ required: true, message: '该字段为必填项' }]"
        >
          <el-input
            :disabled="model.isMultiSpec"
            v-model="model.vipPrice"
            @keyup.native="checkInputPrice($event, model, 'vipPrice')"
            style="width:450px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="qty" :rules="[{ required: true, message: '该字段为必填项' }]">
          <el-input
            :disabled="model.isMultiSpec"
            v-model="model.qty"
            style="width:450px;"
            @keyup.native="checkInputInt($event, model, 'qty')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="最低起订量"
          prop="minOrderQuantity"
          :rules="[{ required: true, message: '该字段为必填项' }]"
        >
          <el-input
            :disabled="model.isMultiSpec"
            v-model="model.minOrderQuantity"
            @keyup.native="checkInputInt($event, model, 'minOrderQuantity')"
            style="width:450px;"
          ></el-input>
        </el-form-item>
      </QcTitle>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="loading" @click="onSubmit()">保存</el-button>
      <el-button type="primary" :loading="loading" @click="submitAndSell()">保存并上架</el-button>
    </div>
  </QcNavigationPage>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      loading: false,
      // 是否开启会员价，在配置页统一配置的
      isOpenVipPrice: false,
      model: {
        code: '',
        creatorType: null,
        name: '',
        supplierId: '',
        brandId: '',
        categoryIds: '',
        categoryList: [],
        tagIds: '',
        tagList: [],
        iconUrl: '',
        rollingImgUrl: '',
        promotionPrice: null,
        minPrice: '',
        maxPrice: '',
        origPrice: '',
        price: '',
        vipPrice: '',
        supplierPrice: null,
        qty: '',
        isVirtual: false,
        level: '',
        seqNum: 0,
        isMultiSpec: false,
        isPromotion: false,
        // isRelease: true,
        minOrderQuantity: 1, // 最低起订量
        isSell: false,
        content: '',
        score: null,
        productItems: [],
        productSpecParams: [],
        specParamsCategoryId: ''
      },
      rollingImgUrl: [],
      property: [],
      itemLength: 0,
      tableTitle: [
        { value: '', title: '原价', inputType: 'origPrice' },
        { value: '', title: '现价', inputType: 'price' },
        { value: '', title: '会员价', inputType: 'vipPrice' },
        { value: '', title: '库存', inputType: 'number' },
        { value: '', title: '最低起订量', inputType: 'minOrderQuantity' }
      ],
      tableBody: [
        {
          itemValue: [
            { value: '', placeholder: '原价', inputType: 'origPrice' },
            { value: '', placeholder: '现价', inputType: 'price' },
            { value: '', placeholder: '会员价', inputType: 'vipPrice' },
            { value: '', placeholder: '库存', inputType: 'number' },
            { value: '', placeholder: '最低起订量', inputType: 'minOrderQuantity' }
          ]
        }
      ],
      supplierLists: [],
      paramsLists: [],
      lock: false,
      tagLists: [],
      categoryLists: [],
      brandLists: [],
      levelLists: [],
      storeRoleShowLevel: true // 是否允许店铺账号自行设置商品等级
    }
  },
  computed: {
    // 关闭VIP价格时，不显示vip价格输入框。
    // 用computed过滤的好处是: 不用去删除tableBody里的vipPrice字段，不会影响data里的数据结构
    tableTitleComputed() {
      return this.tableTitle.filter((item) => {
        return item.inputType === 'vipPrice' && !this.isOpenVipPrice ? false : true
      })
    },
    tableBodyValuesComputed() {
      return function(arr) {
        return arr.filter((item) => {
          return item.inputType === 'vipPrice' && !this.isOpenVipPrice ? false : true
        })
      }
    },
    // 当前登录账号是否是店铺角色
    isStoreRole() {
      return this.$store.state.isStoreRole
    }
  },
  async created() {
    await this.pageParams()
    await this.pageCategory()
    // await this.pageBrand()
    await this.pageLevel()
    this.getIsVipPrice()
    if (this.isStoreRole) this.getStoreRoleShowLevel()
  },
  mounted() {
    this.setSort()
    if (this.$route.query.id) {
      if (this.$route.query.copy) {
        this.copyProduct()
      } else {
        this.getProduct()
      }
    }
  },
  methods: {
    /**
     * 检验规格输入框只能输入金额格式(只简单处理了下，并不严格)
     * @param {object} e 事件源
     * @param {object} obj 要在操作的对象
     * @param {string} key 要在操作的对象的key
     */

    checkInputPrice(e, obj, key) {
      // console.log(e.target.value)
      // let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      if (!obj[key]) return (obj[key] = '')
      obj[key] = obj[key].replace(/[^\d+(\.\d+)?$]/g, '')
    },
    // 检验规格输入框只能输入数字
    checkInputInt(e, obj, key) {
      if (!obj[key]) return (obj[key] = '')
      obj[key] = obj[key].replace(/[^\d]+/g, '')
    },
    // 获取时候开启VIP价格
    getIsVipPrice() {
      this.$http.getConfigByKey('is_open_product_vip_price').then((res) => {
        if (res.data.data) {
          if (res.data.data.value === '1') this.isOpenVipPrice = true
          else this.isOpenVipPrice = false
        }
      })
    },
    pageCategory() {
      // this.$http.pageCategory({ type: 1 }).then(res => {
      //   this.categoryLists = res.data.data.list
      // })
      // 树形结构
      this.$http.treeCategory({ type: 1, parentId: '0' }).then((res) => {
        this.categoryLists = res.data.data
      })
    },
    // 品牌
    pageBrand() {
      this.$http.pageBrand({ pageSize: 99 }).then((res) => {
        this.brandLists = res.data.data.list
      })
    },
    // 等级
    pageLevel() {
      this.$http.pageProductLevel({ pageSize: 99 }).then((res) => {
        this.levelLists = res.data.data.list
      })
    },
    // 获取配置：是否允许店铺账号设置商品等级
    async getStoreRoleShowLevel() {
      let res = await this.$http.getConfigByKey('is_show_product_level')
      if (res.data.data.value === '0') {
        this.storeRoleShowLevel = false
      }
    },
    /**
     * 给model赋值
     *  */

    compareValue() {
      let sepc = this.getTable()
      this.model.qty = 0
      this.model.price = Number(sepc[0].price)
      this.model.origPrice = Number(sepc[0].origPrice)
      this.model.vipPrice = Number(sepc[0].vipPrice)
      this.$set(this.model, 'minOrderQuantity', Number(sepc.minOrderQuantity))
      sepc.forEach((item) => {
        this.model.qty += Number(item.qty)
        if (item.price <= this.model.price) {
          this.model.price = Number(item.price)
          this.model.origPrice = Number(item.origPrice)
          this.model.vipPrice = Number(item.vipPrice)
          this.model.supplierPrice = Number(item.supplierPrice)
          this.model.number = Number(item.number)
          this.$set(this.model, 'minOrderQuantity', Number(item.minOrderQuantity))
        }
      })
    },
    onAddSpecImg(e, i) {
      this.lock = false
      this.property.map((res, index) => {
        if (index === i && e) {
          res.specValue.forEach((value, specIndex) => {
            res.specImage[specIndex] = { value: '' }
          })
          res.hasImg = e
          this.lock = true
        } else {
          res.hasImg = false
          res.specImage = []
        }
      })
    },
    // 获取自定义参数
    pageParams() {
      this.$http.pageParams({ parentId: 0 }).then((res) => {
        this.paramsLists = res.data.data.list
      })
    },
    paramsChildPage(parentId) {
      this.$http.pageParams({ parentId }).then((res) => {
        this.$set(this.model, 'productSpecParams', [])
        res.data.data.list.map((params, index) => {
          this.model.productSpecParams.push({
            seqNum: index,
            specName: params.name,
            specValue: ''
          })
        })
      })
    },
    // 获取商品详情
    getProduct(id = this.$route.query.id) {
      this.$http.getProduct({ id }).then((res) => {
        let data = res.data.data
        data.content = data.content || ''
        // console.log('详情',data.content)
        this.onProductInit(data)
      })
    },
    copyProduct() {
      this.$http.copyProduct({ id: this.$route.query.id }).then((res) => {
        let data = res.data.data
        data.content = data.content || ''
        this.onProductInit(data)
      })
    },
    // 添加商品
    addProduct(model) {
      this.loading = true
      this.$http
        .addProduct(model)
        .then(() => {
          this.$message.success('添加成功')
          // let path = location
          // history.pushState(
          //   {},
          //   0,
          //   `${path.origin}${path.pathname}#/main/product/detail?id=${res.data.message}`
          // );
          // Object.assign(this.$data, this.$options.data());
          this.loading = false
          this.$router.back()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 更新商品
    updateProduct(model) {
      this.loading = true
      this.$http
        .updateProduct(model)
        .then(() => {
          this.$message.success('更新成功')
          Object.assign(this.$data, this.$options.data())
          this.loading = false
          this.$router.back()
        })
        .catch(() => {
          this.loading = false
        })
    },
    onProductInit(model) {
      if (model.rollingImgUrl) {
        this.rollingImgUrl = model.rollingImgUrl.split('_')
      }
      model.categoryList = []
      model.tagList = []
      if (model.categoryIds) {
        let categoryList = model.categoryIds.split('_')
        model.categoryList = categoryList.map((item) => item)
      }
      if (model.tagIds) {
        let tagList = model.tagIds.split('_')
        tagList.map((item) => {
          model.tagList.push(item)
        })
      }
      model.origPrice = (model.origPrice || 0) / 100
      model.price = (model.price || 0) / 100
      // 如果没设置vipPrice，那vipPrice 默认等于商品 price
      if (model.vipPrice === undefined || model.vipPrice === null || model.vipPrice === '') {
        model.vipPrice = model.price
      } else {
        model.vipPrice = (model.vipPrice || 0) / 100
      }
      model.maxPrice = (model.maxPrice || 0) / 100
      model.minPrice = (model.minPrice || 0) / 100
      if (!model.minOrderQuantity) {
        model.minOrderQuantity = 1
      }
      this.model = model
      if (this.model.isMultiSpec) {
        this.setTable(this.model.productItems)
        this.setProperty(this.model)
      }
    },
    onImgListSuccess(e) {
      if (this.rollingImgUrl.length < 9) {
        this.rollingImgUrl.push(e)
      }
    },
    onImgListDelete(index) {
      this.rollingImgUrl.splice(index, 1)
    },
    onImgSuccess(e) {
      this.$set(this.property[this.tableBodyIndex].specImage, this.itemIndex, {
        value: e
      })
      // this.property[this.tableBodyIndex].specImage[this.itemIndex].value = e
    },
    setImgIndex(tableBodyIndex, itemIndex) {
      this.tableBodyIndex = tableBodyIndex
      this.itemIndex = itemIndex
    },
    setSort() {
      const el = document.querySelector('.img-box')
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        filter: '.el-upload--picture-card',
        draggable: '.item',
        animation: 300,
        setData: (dataTransfer) => {
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt) => {
          const targetRow = this.rollingImgUrl.splice(evt.oldIndex, 1)[0]
          // const fileTargetRow = this.fileList.splice(evt.oldIndex, 1)[0]
          this.rollingImgUrl.splice(evt.newIndex, 0, targetRow)
          // console.log('moved this.imgList :', this.rollingImgUrl)
        }
      })
    },
    // 初始化表格值
    getItemValue() {
      return [
        { value: '', placeholder: '原价', inputType: 'origPrice' },
        { value: '', placeholder: '现价', inputType: 'price' },
        { value: '', placeholder: '会员价', inputType: 'vipPrice' },
        { value: '', placeholder: '库存', inputType: 'number' },
        { value: '', placeholder: '最低起订量', inputType: 'minOrderQuantity' }
      ]
    },
    // 设置表格
    setItemValue() {
      this.tableBody.map((item) => {
        let count = this.tableTitle.length - item.itemValue.length
        if (count !== 0) {
          for (let i = 0; i < count; i++) {
            item.itemValue.splice(0, 0, { value: '', rowspan: 1 })
          }
        }
      })
      let total = 1
      this.property.map((item) => {
        total *= item.specValue.length
      })
      this.property.map((item, i) => {
        let count = 1
        let index = 0
        for (let j = 0; j <= i; j++) {
          count *= this.property[j].specValue.length
        }
        index = total / count
        this.tableBody.map((body, v) => {
          if (v % index === 0) {
            body.itemValue[i].rowspan = index
            body.itemValue[i].hidden = false
          } else {
            body.itemValue[i].hidden = true
          }
        })
      })
    },
    // 添加属性规格
    addSpecParams() {
      if (!this.model.productSpecParams) {
        this.$set(this.model, 'productSpecParams', [])
      }
      this.model.productSpecParams.push({
        specName: '',
        specValue: ''
      })
    },
    // 删除属性规格
    delSpecParams(index) {
      this.model.productSpecParams.splice(index, 1)
    },
    // 添加规格
    addProperty() {
      let data = {
        specName: '',
        specValue: [{ value: '' }],
        specImage: [{ value: '' }]
      }
      this.property.push(data)
      let index = this.property.length - 1
      this.tableTitle.splice(index, 0, { title: '', index: index })
      this.tableBody.map((item) => {
        item.itemValue.splice(index, 0, { value: '', rowspan: 1 })
      })
    },
    // 删除规格
    delProperty(i) {
      this.property.map((item, index) => {
        if (index > i) {
          this.tableTitle[index].index = this.tableTitle[index].index - 1
        }
      })
      this.property.splice(i, 1)
      this.tableTitle.splice(i, 1)

      let count = 1
      this.property.map((item) => {
        count *= item.specValue.length
      })
      this.tableBody = []
      for (let i = 0; i < count; i++) {
        this.tableBody.push({ itemValue: this.getItemValue() })
      }
      this.setItemValue()
    },
    // 添加规格值
    addVaule(index) {
      this.property[index].specValue.push({ value: '' })
      this.property[index].specImage.push({ value: '' })
      if (this.property.length <= 1) {
        this.tableBody.push({ itemValue: this.getItemValue() })
      } else {
        let itemLength = this.property[index].specValue.length
        let total = 1
        this.property.map((item) => {
          total *= item.specValue.length
        })
        let count = itemLength - 1
        for (let i = 0; i < total / itemLength; i++) {
          this.tableBody.splice(count, 0, { itemValue: this.getItemValue() })
          count += itemLength
        }
      }
      this.setItemValue()
    },
    // 删除规格值
    delValue(i, index) {
      let length = this.property[i].specValue.length
      if (length === 1) {
        this.$alert('规格最少需要一个属性值', '信息', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (i > 0) {
        let frontTotal = 1
        let afterTotal = 1
        this.property.map((item) => {
          frontTotal *= item.specValue.length
        })
        this.property[i].specValue.splice(index, 1)
        this.property[i].specImage.splice(index, 1)
        this.property.map((item) => {
          afterTotal *= item.specValue.length
        })
        let count = this.property[i].specValue.length
        for (let i = 0; i < frontTotal - afterTotal; i++) {
          this.tableBody.splice(index, 1)
          index += count
        }
      } else {
        this.property[i].specValue.splice(index, 1)
        this.property[i].specImage.splice(index, 1)
        let itemLength = this.tableBody.length / length
        this.tableBody.splice(itemLength * index, itemLength)
      }
      this.setItemValue()
    },
    /**
     * 把model中 有关 spec*Name spec*Value spec*Image  格式化成
     * {specName: '', specValue: [{value: '',img: ‘’}]}
     * */
    setProperty(model) {
      let list = []
      let property = []
      // 循环所有有关该格式 [{key: '',value: ''}]
      Object.keys(model).forEach((key) => {
        if (/[spec][\d]+[Value | Name | Image]/.test(key) && model[key]) {
          list.push({ key: key, value: model[key] })
        }
      })
      list.map((item) => {
        if (/[spec][\d]+[Name]/.test(item.key)) {
          property.push({ hasImg: false, specName: item.value })
        }
        if (/[spec][\d]+[Value]/.test(item.key)) {
          let values = item.value.split('_')
          let specValue = []
          values.forEach((item) => {
            specValue.push({ value: item })
          })
          property[item.key.substr(4, 1) - 1].specValue = specValue
          property[item.key.substr(4, 1) - 1].specImage = []
        }
        if (/[spec][\d]+[Image]/.test(item.key)) {
          let values = item.value.split('_')
          let specValue = []
          values.forEach((item) => {
            specValue.push({ value: item })
          })
          property[item.key.substr(4, 1) - 1].hasImg = true
          property[item.key.substr(4, 1) - 1].specImage = specValue
        }
      })
      this.property = property
      this.property.forEach((item, i) => {
        this.tableTitle.splice(i, 0, { title: item.specName, index: i })
      })
      this.setItemValue()
    },
    getProperty(model) {
      return new Promise((resolve, reject) => {
        let data = {}
        this.property.forEach((item, i) => {
          let value = []
          let image = []
          if (item.hasImg) {
            this.propertyImageIndex = i + 1
            item.specImage.map((res) => {
              if (res.value) {
                image.push(res.value)
              } else {
                reject(new Error('请将规格图片上传完整'))
              }
            })
            data[`spec${i + 1}Image`] = image.join('_')
          }
          if (!item.specName) {
            reject(new Error('请将商品规格名填写完整'))
          }
          data[`spec${i + 1}Name`] = item.specName
          item.specValue.forEach((label) => {
            if (!label.value) {
              reject(new Error('请将商品规格项填写完整'))
            }
            value.push(label.value)
          })
          data[`spec${i + 1}Value`] = value.join('_')
        })
        Object.keys(model).forEach((key) => {
          if (/[spec][\d]+[Value | Name | Image]/.test(key)) {
            delete model[key]
          }
        })
        resolve(Object.assign(model, data))
      })
    },
    /**
     * 同步input值到表格对应的列
     */
    onSyncPrice(item, i) {
      // console.log('onSyncPrice', item)
      this.tableBody.forEach((label) => {
        //页面表格上的显示的数据是过滤后的，index不一定对的上，所以需要根据inputType查询正确的索引
        let index = label.itemValue.findIndex((o) => o.inputType === item.inputType)
        if (index !== -1) label.itemValue[index].value = item.value
      })
      this.compareValue()
    },
    /**
     * 设置规格表格
     */
    setTable(productItems) {
      productItems.map((item, i) => {
        let itemValue = this.getItemValue()
        let data = {}
        console.log(itemValue)
        itemValue[0].value = item.origPrice / 100
        itemValue[1].value = item.price / 100
        itemValue[2].value = item.vipPrice / 100
        itemValue[3].value = item.qty
        itemValue[4].value = item.minOrderQuantity
        data.itemValue = itemValue
        this.$set(this.tableBody, i, data)
        for (let key in item) {
          if (/Value/.test(key) && item[key]) {
            this.tableBody[i].itemValue.splice(key.substr(4, 1) - 1, 0, {
              value: item[key],
              rowspan: 1
            })
          }
        }
      })
      this.tableBody[0].itemValue.map((item) => {
        if (item.rowspan) {
          this.itemLength++
        }
      })
    },
    /**
     * 获取多规格表格
     * @return productItems 规格数据
     */
    getTable(validate = false) {
      let productItems = []
      let isInput = true
      let regPrice = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      this.tableBody.forEach((item) => {
        let data = {}
        item.itemValue.forEach((label, k) => {
          let length = this.property.length
          if (k < length) {
            data[`spec${k + 1}Name`] = this.tableTitle[k].title
            data[`spec${k + 1}Value`] = label.value
          } else {
            let titles = ['origPrice', 'price', 'vipPrice', 'qty', 'minOrderQuantity']
            if (validate) {
              switch (label.inputType) {
                case 'price':
                  if (!(label.value > 0) || !regPrice.test(label.value)) {
                    isInput = false
                    this.$message.error(`${label.placeholder}数据格式不正确`)
                  }
                  break
                case 'number':
                  if (!(label.value >= 0)) {
                    isInput = false
                    this.$message.error(`${label.placeholder}数据格式不正确`)
                  }
                  break
                case 'minOrderQuantity':
                  label.value = Number(label.value)
                  if (!/^\d+$/.test(label.value) || !(label.value > 0)) {
                    isInput = false
                    this.$message.error(`${label.placeholder}数据格式不正确`)
                  }
                  break
              }
            }
            data[titles[k - length]] = label.value
            data.name = this.model.name
          }
        })
        productItems.push(data)
      })
      if (!isInput) {
        return false
      }
      // 把之前的数据合并起来
      if (this.itemLength === this.property.length) {
        this.model.productItems.map((item, i) => {
          if (productItems[i]) {
            productItems[i] = Object.assign(item, productItems[i])
          }
        })
      }
      return productItems
    },
    submitAndSell() {
      this.model.isSell = true
      this.onSubmit()
    },
    // 提交
    onSubmit() {
      this.model.iconUrl = this.rollingImgUrl[0]
      this.model.rollingImgUrl = this.rollingImgUrl.join('_')
      if (this.model.categoryList) {
        this.model.categoryIds = this.model.categoryList.join('_')
      }
      this.$refs['productModel'].validate((valid) => {
        if (valid) {
          this.model.tagIds = this.model.tagList.join('_')
          let model = JSON.parse(JSON.stringify(this.model))
          this.getProperty(model).then(
            (model) => {
              model.origPrice = parseFloat(model.origPrice) * 100
              model.price = parseFloat(model.price) * 100
              model.vipPrice = parseFloat(model.vipPrice) * 100
              // 如果平台没开启VIP，那vipPrice 默认等于商品 price
              if (!this.isOpenVipPrice) {
                model.vipPrice = model.price
              }
              if (model.isMultiSpec) {
                // 多规格走这里
                let maxPrice = model.price
                let minPrice = model.price
                let image =
                  model[`spec${this.propertyImageIndex}Image`] &&
                  model[`spec${this.propertyImageIndex}Image`].split('_')
                let productItems = this.getTable(true)
                if (!productItems) {
                  return
                }
                model.productItems = productItems
                model.productItems.map((item, i) => {
                  if (image) {
                    this.property[this.propertyImageIndex - 1].specValue.forEach((value, j) => {
                      if (value.value === item[`spec${this.propertyImageIndex}Value`]) {
                        item.iconUrl = image[j]
                      }
                    })
                  } else {
                    item.iconUrl = model.iconUrl
                  }
                  item.seqNum = i
                  item.origPrice = parseFloat(item.origPrice) * 100
                  item.price = parseFloat(item.price) * 100
                  item.vipPrice = parseFloat(item.vipPrice) * 100
                  if (maxPrice <= item.price) {
                    maxPrice = item.price // 商品最大值
                  }
                  if (minPrice >= item.price) {
                    minPrice = item.price // 商品最小值
                    model.vipPrice = item.vipPrice
                  }
                  // 如果平台没开启VIP，那vipPrice 默认等于商品 price
                  if (!this.isOpenVipPrice) {
                    item.vipPrice = item.price
                  }
                })
                model.maxPrice = maxPrice
                model.minPrice = minPrice
              } else {
                // 单规格走这里
                model.productItems = []
                model.maxPrice = model.minPrice = model.price
              }
              // console.log('提交的参数：', JSON.stringify(model, null, 1))
              // console.log('提交的参数：', model)
              // return
              if (this.model.id) {
                this.updateProduct(model)
              } else {
                this.addProduct(model)
              }
            },
            () => {
              this.$message.error('请先将信息填写完整')
            }
          )
        } else {
          console.log(this.model)
          this.$message({
            message: '请先将信息填写完整',
            type: 'warning'
          })
        }
      })
    }
  },
  watch: {
    property: {
      handler(val) {
        let length = val.length
        if (length === 0) {
          this.model.isMultiSpec = false
        } else {
          this.model.isMultiSpec = true
          // eslint-disable-next-line
          let total = 1
          this.property.map((item) => {
            total *= item.specValue.length
          })
          val.map((item, i) => {
            if (this.tableTitle[i].index === i) {
              this.tableTitle[i].title = item.specName
            }
            let total = 1
            this.property.map((label, k) => {
              if (k > i) {
                total *= label.specValue.length
              }
            })
            let times = 1
            for (let d = i - 1; d >= 0; d--) {
              times *= val[d].specValue.length
            }
            let index = 0
            for (let m = 0; m < times; m++) {
              for (let j = 0; j < item.specValue.length; j++) {
                for (let r = 0; r < total; r++) {
                  this.tableBody[index].itemValue[i].value = item.specValue[j].value
                  index++
                }
              }
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.prodocu-page {
  .img-box {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    .item {
      position: relative;
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      margin: 0 6px 6px 0;
      flex-shrink: 0;
      img {
        width: 100%;
      }
      .el-icon-error {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 20px;
        color: #c5c5c5;
      }
    }
  }
  .property-box {
    border: 1px solid #e7eaec;
    padding: 10px;
    // width: 869px;
    .property-item {
      .name {
        background: rgba(0, 0, 0, 0.035);
        padding: 5px 10px;
        display: flex;
        position: relative;
        .delete-btn {
          padding: 8px;
          position: absolute;
          right: 10px;
          top: 50%;
          display: none;
          transform: translateY(-50%);
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
          .delete-btn {
            display: block;
          }
        }
      }
      .value {
        display: flex;
        align-items: baseline;
        padding: 10px;
        .label {
          width: 58px;
        }
        .col {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          .input {
            width: 100px;
            position: relative;
            overflow: hidden;
            margin-right: 10px;
            margin-bottom: 10px;
            i {
              position: absolute;
              top: 12px;
              right: -15px;
              font-size: 14px;
              color: #ff5433;
              transition: all 0.1s ease;
            }
            &:hover {
              i {
                right: 3px;
                cursor: pointer;
              }
            }
          }
        }
      }
      &:hover {
        border-color: #337ab7;
      }
    }
  }
  .property-table {
    border: 1px solid #e7eaec;
    margin-top: 20px;
    // width: 900px;
    border-spacing: 0;
    border-collapse: collapse;
    tr {
      th {
        padding: 5px 10px;
        text-align: center;
        border-left: 1px solid #e7eaec;
        background: #f6f6f6;
        .input-group {
          display: flex;
        }
      }
      td {
        padding: 5px 10px;
        border-top: 1px solid #e7eaec;
        text-align: center;
      }
      td.border-left {
        color: #666;
        border-left: 1px solid #e7eaec;
      }
    }
  }
}
</style>
