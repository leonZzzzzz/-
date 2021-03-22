export function serviceTypeName(value) {
  switch (value) {
    case 1:
      return '退货'
    case 2:
      return '换货'
    case 3:
      return '仅退款'
  }
}
export function typeName(value) {
  switch (value) {
    case 0:
      return '平台'
    case 1:
      return '商家'
    case 2:
      return '买家'
  }
}
export function refundStatusName(status) {
  switch (status) {
    case -2:
      return '退款失败'
    case -1:
      return '审核不通过，已取消'
    case 0:
      return '待审核'
    case 1:
      return '退款成功'
  }
}
export function payStatusName(val) {
  switch (val) {
    case -1:
      return '充值失败'
    case 1:
      return '待支付'
    case 3:
      return '充值成功'
  }
}
export function withdrawStatusName(val) {
  switch (val) {
    case -2:
      return '提现失败'
    case 1:
      return '处理中'
    case 2:
      return '提现成功'
  }
}
export function creatorTypeName(val) {
  switch (val) {
    case 1:
      return '平台'
    case 2:
      return '门店'
    case 3:
      return '供应商'
  }
}
export function supplierStatusName(row) {
  switch (row) {
    case 0:
      return '待审核'
    case 1:
      return '审核不通过'
    case 2:
      return '审核通过'
    case 3:
      return '正式供应商'
    case 4:
      return '已冻结'
    case 5:
      return '已中止'
  }
}
export function productStatusName(val) {
  switch (val) {
    case 0:
      return '草稿'
    case 1:
      return '待审核'
    case 2:
      return '通过'
    case 3:
      return '拒绝'
  }
}
export function orderStatusName(val) {
  switch (val) {
    case -1:
      return '退款并取消'
    case 10:
      return '退款并完成'
    default:
      return '退款'
  }
}
export function incomeStatusName(val) {
  switch (val) {
    case -1:
      return '取消'
    case 0:
    case 1:
      return '不可提现'
    case 2:
      return '可提现'
  }
}
export function sourceTypeName(val) {
  switch (val) {
    case 2:
      return '公众号'
    case 3:
      return '小程序'
  }
}

export function withdrawAuditStatusName(val) {
  switch (val) {
    case -2:
      return '提现失败'
    case -1:
      return '审核不通过'
    case 0:
      return '待审核'
    case 1:
      return '处理中'
    case 2:
      return '已到账'
  }
}
export function formatPrice(val) {
  if (val) {
    return (val / 100).toFixed(2)
  } else {
    return 0
  }
}
export function allTableTimefilters(option) {
  if (option) {
    return option.slice(0, option.length - 3)
  } else {
    return ""
  }
}

