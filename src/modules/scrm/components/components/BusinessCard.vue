<template>
<!-- xfo -->
  <div>
    <div class="xfo-card"></div>
  </div>
</template>

<script>
const dataArr = [
  {
    address: '广州市天河区车陂路黄洲工业区8栋',
    avatar: 'http://wework.qpic.cn/bizmail/l0ic0wp3ia1mB0mhDOJxrhNia4aGlicWyickwzJcar13zQAp4LJ9e0vZLkg/0',
    businessCardId: '827e449146824ca38a20553501e842f4',
    email: '1909996360000000@qq.com',
    hideQuantity: 1,
    name: '是厚武呀',
    phone: '15813228684',
    phraseQuantity: 1,
    position: '前端',
    topQuantity: 1,
    userId: '1b69782562ac42c48c725c3b2940ea8d',
    viewPersonQuantity: 1
  }
]
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return dataArr
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
