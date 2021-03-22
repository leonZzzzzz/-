# 查询列表 测试阶段

## props

| 属性       |  类型  |   默认值   |      说明      |
| :--------- | :----: | :--------: | :------------: |
| option     | Object | `查看详情` |     配置项     |
| searchForm | Array  |     --     |  列表搜索表单  |
| menu       | Array  |     --     | 自定义功能按钮 |
| column     | Array  |     --     |    列表数据    |

### option

| 属性               |  类型   | 默认值 |                           说明                            |
| :----------------- | :-----: | :----: | :-------------------------------------------------------: |
| url                | String  |   --   |                       请求查询接口                        |
| size               | String  |   --   |                         组件大小                          |
| showPagination     | Boolean |  true  |                     是否显示分页区域                      |
| showSearchAndReset | Boolean |  true  |                  是否需要重置和搜索按钮                   |
| response           | Object  |  true  | 用于自定义返回的数据格式，里面包含两个值`list`和`total`。 |

- response 列子

```js
option: {
  response: {
    // 如果返回的结果是
    // ↓一级  ↓二级   ↓三级
    // res:{data: {data: [1,2,3,4]},page:1}
    // response 的第一级不用写。
    list: 'data.data'
  }
}
```

### searchForm

> 这是一个实验阶段，会全部转换成 render 来实现

| 属性     |  类型  | 默认值 |                说明                |
| :------- | :----: | :----: | :--------------------------------: |
| type     | String |   --   |              表单类型              |
| formName | string |   --   |   用于生成表单的字段名，不可重复   |
| el       | Object |   --   |     elmenet 表单的 props 属性      |
| label    | String |   --   |               表单名               |
| options  | String |   --   | 当类型为`select,check,radio`时可用 |

> `formName特殊操作：如果像时间选择器这样可能会分开两个字段，所以formName 应该通过下划线拼接。`

- 例

```js
{
  formName: 'startTime_endTime'
}
```

每当查询的时候会通过 `onSplitFormName`的方法搜索。<br>
发现后话通过 `_` 分隔开多个 formName 并对应赋值

### menu

| 属性     |   类型   | 默认值 |                                                       说明                                                       |
| :------- | :------: | :----: | :--------------------------------------------------------------------------------------------------------------: |
| type     |  string  |   --   |                                             `el-button` 的 type 属性                                             |
| label    |  string  |   --   |                                                    显示的文字                                                    |
| on       | function |   --   | 点击事件，返回三个值：search=>查询表单的数据<br>selectionRow => 勾选中的数据<br>currentRow => 当前选中的行的数据 |
| disabled | boolean  |   --   |                                      ({currentRow,selectionRow}) => `code`                                       |

### column

> 属性对应`el-table-column`的所有属性，[el-table-column 属性文档](https://element.eleme.cn/#/zh-CN/component/table)

简单结构：

```js
column: [{ label: '', prop: '' }]
```

如需做数据转换，可使用`el-table-column`的`formatter`属性：

```js
column: [{ label: '', prop: '', formatter:(row)=> {
  return ''
}]
```
