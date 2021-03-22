// 小程序配置文件，会覆盖掉小程序项目的extJSON
export default function createStoreExt(data = {}) {
  return {
    "extEnable": true,
    "plugins": {},
    "navigateToMiniProgramAppIdList": "[]",
    "extAppid": data.wechatAppId,
    "ext": {
      "theme": {
        "--color-primary": "#F14422",
        "--color-primary2": "rgb(252, 218, 211)",
        "--color-primary4": "rgb(249, 180, 167)",
        "--color-primary6": "rgb(247, 143, 122)",
        "--color-primary8": "rgb(244, 105, 78)"
      },
      "config": {
        "HOME_PATH": "/pages/home/index",
        "baseUrl": data.projectApi + '/',
        "IMG_HOST": data.cosHost,
        "appId": data.wechatAppId,
        "consumerWXAppId": data.consumerWXAppId,
      }
    }
  }
}