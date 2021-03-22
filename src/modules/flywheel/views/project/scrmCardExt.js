// 小程序配置文件，会覆盖掉小程序项目的extJSON
export default function createStoreExt(data = {}) {
  return {
    "extEnable": true,
    "plugins": {
      "contactPlugin": {
        "version": "1.3.0",
        "provider": "wx104a1a20c3f81ec2"
      }
    },
    "extAppid": data.wechatAppId,
    "ext": {
      "tabBar": {
        "color": '#888888',
        "selectedColor": '#000000',
        "backgroundColor": '#ffffff',
        "list": [{
            "index": 0,
            "text": '名片',
            "pagePath": 'pages/card/index',
            "iconPath": 'images/tabbar/t1.png',
            "selectedIconPath": 'images/tabbar/t1s.png',
          },
          {
            "index": 1,
            "text": '商城',
            "pagePath": 'pages/mall/index',
            "iconPath": 'images/tabbar/t2.png',
            "selectedIconPath": 'images/tabbar/t2s.png',
          },
          {
            "index": 2,
            "text": '官网',
            "pagePath": 'pages/company/index',
            "iconPath": 'images/tabbar/t3.png',
            "selectedIconPath": 'images/tabbar/t3s.png',
          },
        ]
      },
      "theme": {
        "--color-primary": "#F14422",
        "--color-primary2": "rgb(252, 218, 211)",
        "--color-primary4": "rgb(249, 180, 167)",
        "--color-primary6": "rgb(247, 143, 122)",
        "--color-primary8": "rgb(244, 105, 78)"
      },
      "config": {
        "HOME_PATH": "/pages/card/index",
        "baseUrl": data.projectApi + '/',
        "IMG_HOST": data.cosHost,
        "appId": data.wechatAppId,
      }
    }
  }
}