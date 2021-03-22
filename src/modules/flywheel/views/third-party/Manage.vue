<template>
  <div>Manage</div>
</template>

<script>
export default {
  methods: {
    bindTester() {
      this.$http.bindTester().then((res) => {
        console.log(res.data.data)
      })
    }
  }
}
</script>

<style></style>
