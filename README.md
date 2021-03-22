# 小蜘蛛后台管理系统

## git

> 开发建议在 dev 分支下面进行，测试通过后合并到主分支

## 使用技术栈

> 主要看 package.json，只罗列一些不常用的

- lodash
- sortablejs 拖拽
- uuid 生成 id
- lrz 压缩文件，不常用。  



## 目录结构

```
简略说明

│--public 主要使用到了百度编辑器
│--doc 一些组件的文档说明，只要是QcTable。后续自行添加
│--src
│  │--api 所有模块接口汇总在此
│  │--components 组件
│  │  │——common 通用组件
│  │  │——flywheel 飞轮魔盒的组件 通常这里不需要管
│  │  │——service 需要通过接口实现一些业务逻辑的组件
│  │--filter 全局过滤器
│  │--mixins 全局mixins
│  │--modules 模块，所有页面都会在这里。
│  │--theme 主题。
│  │--utils 工具 也不常用。

```

## 开发思路

> 每个模块应该是在自己模块中维护，然后将接口和路由暴露给 src/api，src/router 来接收。各个模块是业务是如何实现不再赘述，主要还是看代码，遇到问题在询问。主要讲解飞轮魔盒是如何操作的。

# 飞轮魔盒

## 目录结构

> src/modlue/flywheel

```
+---api
+---store 数据中心
+---utils
+---router
+---components 各个模块的组件
|   +---activity
|   +---base
|   +---customize
|   +---lesson
|   +---mall
|   \---school
+---mixins 统一的方法，获取属性在这里操作
\---views
    +---editor 编辑器的功能
    +---manager 管理组件，页面，小程序
    |   +---custom-menu
    |   \---mini-app
    +---project 管理项目，打包，上传，提审之类
    \---third-party
        \---template
```

## 组件如何实现

> 思路如下 <br>
>
> 1、在 src/modlue/flywheel/components/[你的模块] 创建一个组件
>
> 2、在 src/modlue/flywheel/components/index.js 中引入
>
> 3、mixins 会加载里面的组件 通过`initComponent`的方法。
>
> 3.1、initComponent 会把所有组件挂在到全局下面，方便调用
>
> 3.2、获取组件的属性重新解析，存放到 store 中管理

### 组件中需要包含什么

> 具体可以参考已经存在的组件

| 字段   | 类型         | 说明                                                    |
| :----- | :----------- | :------------------------------------------------------ |
| name   | string       | 组件名称 建议 Qc 开头                                   |
| title  | string       | 组件中文名称                                            |
| props  | object       | 必须接收 options 对象，该组件的所用属性都会放在 options |
| config | [config]arry | 该组件有什么属性，会把里面的数据转换成 options 对象     |

### config 说明

> 组件的配置项，可通过配置自定义组件的样式，加载数据方式

| 字段     | 可选参数                                                                                                                                     | 类型   | 说明                                                                                                                   |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------- |
| formName | --                                                                                                                                           | string | 字段名                                                                                                                 |
| label    | --                                                                                                                                           | string | 字段标题                                                                                                               |
| type     | `el-input`，`el-color-picker`，`el-select`，`el-radio-group`，按道理支持所有 elm 表单组件，也可以使用自己定义的表单组件。比如：`qc-uploader` | string | 表单类型                                                                                                               |
| options  | 数据格式必须为 [{label:'',value:''}]                                                                                                         | arry   | 当类型为 `el-select` 或 `el-radio-group` 时需要                                                                        |
| value    | --                                                                                                                                           | \*     | 默认值                                                                                                                 |
| props    | --                                                                                                                                           | object | 表单组件的 `props` 属性，大部分情况不需要。如果用到了 `qc-uploader`，可以选特定的一些 props，请看 `qc-uploader` 的说明 |

### qc-uploader 组件说明

> 此组件是管理为组件添加动态数据

| props 字段   | 类型           | 说明                                 |
| :----------- | :------------- | :----------------------------------- |
| type         | array          | 需要加载的类型                       |
| module       | array          | 需要加载的数据模块                   |
| value        | array , string | 值                                   |
| max          | number         | 当 value 是 array 时，最大长度是多少 |
| propsName    | string         | 选中数据后，需要获的字段             |
| isChangeName | boolean        | 文本字段是否可以修改                 |
