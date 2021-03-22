<template>
  <!-- 表格搜索 参考渠道活码搜索 xfo-->
  <!-- 说明：小于三个搜索项，多于三个请使用另一个组件<HugeTableSearch> -->
  <!-- 
 【引入示例】
  import TableSearch from '../../../components/components/TableSearch.vue'

 【使用示例】
  <TableSearch :operationButton="operationButton" :searchInput="searchInput"></TableSearch>

 【属性】
  参数                      类型                说明                 可选值                   默认值
  operationButton          array              操作按钮                --                        --
  searchInput              array              搜索框                  --                        --

 【属性说明】
  参数                                 示例                                                  
  operationButton                  [{ title: '新建', on: () => {console.log('aaa')} }       
  searchInput                      [{title: '姓名',type: 'text',size: 'small',value: '',                
                                   placeholder: '请输入姓名',on: (val) => {console.log(val)}}]  

 【二级属性】
  参数                  二级参数      类型                 说明              可选值                                           默认值
 operationButton        title         string              按钮文本            --                                               --
                        type          string              按钮类型     primary|success|info|warning|danger                   primary 
                        size          string              按钮尺寸     medium|small|mini                                     small
                        on            function(){}        按钮方法            --                                                --
 searchInput            title         string              输入框label         --                                                --
                        type          string              输入框类型    text[文本]|selectOptions[选择]|selectTime[时间]       text
                        size          string              输入框尺寸    medium|small|mini                                     small
                        value         string              输入框值            --                                                --
                        placeholder   string              输入框提示          --                                             请输入内容
                        on            function(val){}     输入框方法,         --                                                --
                                                          val为输入的内容                                                     
 -->
  <div>
    <div class="tableSearch">
      <div class="operationButton">
        <el-button
          v-for="(item, index) in operationButton"
          :key="index"
          :type="item.type || 'primary'"
          :size="item.size || 'small'"
          @click="item.on()"
          >{{ item.title }}</el-button
        >
      </div>
      <div class="searchInput">
        <el-form label-position="right" label-width="auto" :inline="true">
          <el-form-item :label="item.title" v-for="(item, index) in searchInput" :key="index">
            <el-input
              v-model="item.value"
              :placeholder="item.placeholder || '请输入内容'"
              @input="item.on(item.value)"
              :size="item.size || 'small'"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    operationButton: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchInput: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tableSearch {
  display: flex;
  padding: 20px;
  align-items: center;
}
.operationButton {
}
.searchInput {
  margin-left: auto;
  &::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
