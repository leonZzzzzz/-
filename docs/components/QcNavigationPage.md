# 带返回导航页面

## props

| 属性       |  类型   | 默认值 |     说明     |
| :--------- | :-----: | :----: | :----------: |
| title      | string  |  返回  | 返回按钮文字 |
| content    | string  |   /    |     标题     |
| background | string  |  #fff  |    背景色    |
| full       | boolean | false  | 是否铺满容器 |

## slot

| name    |     说明      |
| :------ | :-----------: |
| default |   默认区域    |
| footer  | full 必须开启 |

## event

| 方法 |     说明     |
| :--- | :----------: |
| back | 监听返回事件 |
