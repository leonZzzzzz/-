let Utils = {
  // 格式化日期
  formatDate(date) {
    if (typeof date == 'string') {
      date = new Date(date)
    }
    return `${date.getFullYear()}-${date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${
      date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
    } ${date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()}:${
      date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
    }:${date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()}`
  },
  //转换为有时分秒的时间戳
  newFormatDate(date) {
    date = new Date(date)
    return `${date.getFullYear()}-${date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${
      date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
    } ${date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()}:${
      date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()
    }:${date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()}`
  }
}

export default Utils
