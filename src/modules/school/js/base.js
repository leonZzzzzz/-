let alumni = {
  title: "校友会后台管理",
  type: 1,
  // baseHost: 'http://xyh.wego168.com/alumni/',
  baseHost: window.location.origin + '/',

  projectName: function () {
    let pathname = window.location.pathname.split('/')[1];
    console.log()
    // let name = process.env.NODE_ENV === "production" ? pathname : "alumni"
    // let name = process.env.NODE_ENV === "production" ? pathname : "alumni_lingnan"
    let name = process.env.NODE_ENV === "production" ? pathname : "alumni_mba"
    return name
  },
}

export default alumni