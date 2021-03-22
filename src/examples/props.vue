<template>
  <div>{{ myData }}</div>
</template>

<script>
export default {
  props: {
    myData: Object
  },
  watch: {
    myData: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  }
}
</script>

<style></style>
